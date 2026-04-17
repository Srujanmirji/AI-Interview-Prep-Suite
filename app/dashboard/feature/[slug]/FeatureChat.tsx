'use client';

import React, { useState, useRef } from 'react';
import { Send, Bot, Layers, Volume2, Mic as MicIcon, Square } from 'lucide-react';
import { generateContent } from '@/app/actions/gemini';

export default function FeatureChat({ title }: { title: string }) {
  const isVoiceModule = title.toLowerCase().includes('voice');

  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([{
    role: 'bot', 
    text: `Hello! I am the AI specifically configured for the **${title}** module. How can I assist you with this today?`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const playTTS = async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const audioBlob = await res.blob();
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audio.onended = () => setIsSpeaking(false);
        await audio.play().catch(err => {
            console.error("Audio playback interrupted by browser:", err);
            alert("Browser blocked audio playback. Please ensure you clicked the screen before the AI spoke.");
        });
      } else {
        const errJson = await res.json().catch(()=>({}));
        console.error("ElevenLabs API Error:", errJson);
        alert(`Voice Error: ${errJson.error || "ElevenLabs failed to process audio. Check your API key or quota."}`);
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      alert("Network Error connecting to Voice API.");
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
        await processVoiceInput(audioBlob);
      };
      
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Please allow microphone access to use the Voice Interview module.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    let userMessage = "";
    try {
        // 1. STT via Groq Whisper
        const formData = new FormData();
        formData.append('file', audioBlob);
        const sttRes = await fetch('/api/groq/transcribe', {
            method: 'POST',
            body: formData
        });
        const sttData = await sttRes.json();
        
        if (!sttData.text) throw new Error("No transcription generated");
        userMessage = sttData.text;
        
        // Update UI with User Message
        const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
        setMessages(newMessages);

        // 2. LLM via Groq Llama3
        const chatRes = await fetch('/api/groq/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ messages: newMessages })
        });
        const chatData = await chatRes.json();
        const botResponse = chatData.result || "Failed to generate response.";
        
        setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);

        // 3. TTS via ElevenLabs
        playTTS(botResponse);

    } catch (error) {
        console.error("Voice processing error:", error);
        setMessages(prev => [...prev, { role: 'user', text: userMessage || '*(Audio Unrecognized)*' }]);
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an issue processing your voice. Please try again.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleTextSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const historyText = messages.map(m => `${m.role}: ${m.text}`).join('\n');
      const prompt = `System: You are an expert AI tailored specifically for the module: "${title}". 
History:
${historyText}
user: ${userMessage}

Please provide a highly professional, accurate, and structured response acting as the AI module for ${title}.`;
      
      const response = await generateContent(prompt);
      const botResponse = response || 'Failed to process request.';
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);

      if (isVoiceModule) {
         playTTS(botResponse);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error connecting to the AI system.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-secondary/50 rounded-2xl border border-white/5 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 flex flex-shrink-0 items-center justify-center border border-[#3b82f6]/20 relative">
                 {isSpeaking && i === messages.length - 1 ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#3b82f6] animate-pulse" />
                      <div className="absolute inset-0 bg-[#3b82f6]/20 rounded-full animate-ping" />
                    </>
                 ) : (
                    <Bot className="w-4 h-4 text-[#3b82f6]" />
                 )}
              </div>
            )}
            <div className={`p-4 rounded-xl max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-[#3b82f6] text-white' : 'bg-background border border-border text-foreground'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 flex items-center justify-center border border-[#3b82f6]/20">
              <Layers className="w-4 h-4 text-[#3b82f6] animate-spin" />
            </div>
            <div className="p-4 rounded-xl bg-background border border-border text-foreground text-sm flex items-center gap-2">
              <span className="animate-pulse">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent border-t border-border/50">
        {isVoiceModule ? (
          <div className="flex flex-col items-center justify-center pt-4">
             {isRecording ? (
                <button 
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 border border-red-500 flex items-center justify-center transition-all animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
             ) : (
                <button 
                  onClick={startRecording}
                  disabled={isLoading || isSpeaking}
                  className="w-16 h-16 rounded-full bg-[#3b82f6] text-white flex items-center justify-center hover:scale-105 hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <MicIcon className="w-6 h-6" />
                </button>
             )}
             <p className="text-xs text-muted-foreground mt-3 font-medium tracking-wide uppercase">
               {isRecording ? 'Tap to Stop Recording' : isLoading ? 'Analyzing audio...' : isSpeaking ? 'AI is speaking...' : 'Tap to Speak (Groq STT)'}
             </p>
          </div>
        ) : (
          <form onSubmit={handleTextSend} className="relative flex items-center max-w-4xl mx-auto w-full">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={`Ask the ${title} AI...`}
              className="w-full bg-secondary/80 border border-border rounded-xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:border-[#3b82f6] disabled:opacity-50 shadow-sm backdrop-blur-md"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-3 p-2 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
