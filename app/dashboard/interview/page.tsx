'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Video, Timer, MessageSquare, AlertCircle, Play, Square } from 'lucide-react';

export default function MockInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 15); // 15 mins
  const [step, setStep] = useState(0);

  const mockQuestions = [
    "Tell me about a time you had to optimize a slow-performing application.",
    "How do you handle disagreements with a product manager?",
    "Can you explain the differences between React Server Components and traditional SSR?",
    "Great. That completes our session. Analyzing your responses..."
  ];

  // Timer effect
  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (step < mockQuestions.length - 1) {
      setStep(s => s + 1);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-rise max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-medium">Mock Simulator</h1>
          <p className="text-muted-foreground mt-1">Senior Frontend Engineer - System Design & Behavioral</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono tracking-wider">{formatTime(timeLeft)}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-widest">Time Remaining</div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Main Video/Audio Area */}
        <div className="lg:col-span-2 relative liquid-glass rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-end p-6">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="relative z-10 w-full">
            <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center gap-3 mb-2 text-accent">
                <BotIcon /> <span className="font-medium text-sm">AI Interviewer</span>
              </div>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {mockQuestions[step]}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 rounded-full flex items-center justify-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {isRecording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isRecording ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                    </span>
                    {isRecording ? 'Recording Answer...' : 'Microphone Ready'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleNextQuestion}
                disabled={!isRecording && step === 0}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
              >
                {step === mockQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6 flex flex-col">
          <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex-1">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <ActivityIcon /> Live Analysis
            </h3>
            
            {isRecording ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pacing</span>
                    <span className="text-green-400">140 wpm (Good)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full"><div className="bg-green-400 h-full w-[60%] rounded-full" /></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Filler Words</span>
                    <span className="text-yellow-400">3 detected</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full"><div className="bg-yellow-400 h-full w-[30%] rounded-full" /></div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-200">Try to maintain eye contact with the camera while explaining the architecture.</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Video className="w-8 h-8 mb-2" />
                <p className="text-sm">Start recording to see live behavioral analytics.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  );
}
function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  );
}
