'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Layers, Volume2 } from 'lucide-react';
import { generateContent } from '@/app/actions/gemini';

export default function FeatureChat({ title }: { title: string }) {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([{
    role: 'bot', 
    text: `Hello! I am the AI specifically configured for the **${title}** module. How can I assist you with this today?`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
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

Please provide a highly professional, accurate, and structured response acting as the AI module for ${title}. Do not use pleasantries if the user asks for a generation (e.g. if they ask for a cover letter, just give the cover letter).`;
      
      const response = await generateContent(prompt);
      const botResponse = response || 'Failed to process request.';
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);

      if (title.toLowerCase().includes('voice')) {
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
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-accent/20 flex flex-shrink-0 items-center justify-center border border-accent/20 relative">
                 {isSpeaking && i === messages.length - 1 ? (
                    <>
                      <Volume2 className="w-4 h-4 text-accent animate-pulse" />
                      <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
                    </>
                 ) : (
                    <Bot className="w-4 h-4 text-accent" />
                 )}
              </div>
            )}
            <div className={`p-4 rounded-xl max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-accent text-white' : 'bg-background border border-border text-foreground'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
              <Layers className="w-4 h-4 text-accent animate-spin" />
            </div>
            <div className="p-4 rounded-xl bg-background border border-border text-foreground text-sm">
              Processing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask the ${title} AI...`}
            className="w-full bg-secondary border border-border rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 text-muted-foreground hover:text-accent disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
