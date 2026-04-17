'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Video, Timer, MessageSquare, AlertCircle, Play, Square, Send } from 'lucide-react';

export default function MockInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 15); // 15 mins
  const [step, setStep] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState("Loading question...");
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [analysis, setAnalysis] = useState<{
    feedback?: string;
    pacingText?: string;
    pacingScore?: number;
    fillerWordsCount?: number;
    actionableTip?: string;
  } | null>(null);

  // Fetch first question on mount
  useEffect(() => {
    fetchNextQuestion([]);
  }, []);

  const fetchNextQuestion = async (history: string[]) => {
    try {
      const res = await fetch('/api/interview/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Senior Frontend Engineer', step, previousQuestions: history })
      });
      const data = await res.json();
      if (data.question) {
        setCurrentQuestion(data.question);
        setPreviousQuestions([...history, data.question]);
      }
    } catch (e) {
      console.error(e);
      setCurrentQuestion("Failed to load question.");
    }
  };

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

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    setIsRecording(false);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer: userAnswer })
      });
      const data = await res.json();
      if (!data.error) {
        setAnalysis(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestionClick = () => {
    setStep(s => s + 1);
    setAnalysis(null);
    setUserAnswer("");
    setCurrentQuestion("Loading next question...");
    fetchNextQuestion(previousQuestions);
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <div className="relative z-10 w-full flex flex-col h-full justify-between">
            <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl border border-white/10 mt-6">
              <div className="flex items-center gap-3 mb-2 text-accent">
                <BotIcon /> <span className="font-medium text-sm">AI Interviewer</span>
              </div>
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            <div className="space-y-4 mt-auto">
              {!analysis ? (
                <>
                  <textarea 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here (Voice recording coming soon)..."
                    className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-accent resize-none h-32"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsRecording(!isRecording)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-accent/50 hover:bg-accent/80'
                        }`}
                        title="Simulate Voice Record"
                      >
                        {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                    <button 
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="bg-accent hover:bg-accent/90 px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isEvaluating ? 'Evaluating...' : <><Send className="w-4 h-4"/> Submit Answer</>}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-end">
                  <button 
                    onClick={handleNextQuestionClick}
                    className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-sm font-medium transition-colors"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6 flex flex-col">
          <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex-1 overflow-y-auto">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <ActivityIcon /> AI Analysis
            </h3>
            
            {analysis ? (
              <div className="space-y-6 animate-fade-rise">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                  <p className="text-sm text-foreground/90">{analysis.feedback}</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pacing Evaluated From Text</span>
                    <span className="text-green-400">{analysis.pacingText}</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full"><div className="bg-green-400 h-full rounded-full" style={{ width: `${analysis.pacingScore}%`}} /></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Filler Words / Stutter</span>
                    <span className="text-yellow-400">{analysis.fillerWordsCount} detected</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-200">{analysis.actionableTip}</p>
                </div>
              </div>
            ) : isEvaluating ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-sm">Gemini is analyzing your response...</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <MessageSquare className="w-8 h-8 mb-2" />
                <p className="text-sm">Submit your answer to see live behavioral and technical analytics.</p>
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
