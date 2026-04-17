'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, FileText, Mic, Send, Github, CheckCircle2, Download, Trophy, AlertCircle, RefreshCw } from 'lucide-react';

type FlowState = 'resume' | 'interview' | 'feedback';

export default function UnifiedDashboard() {
  const [flowState, setFlowState] = useState<FlowState>('resume');
  
  // Progress Strip
  const maxQuestions = 5;

  // --- Resume State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [resumeResult, setResumeResult] = useState<any>(null);

  // --- Interview State ---
  const [interviewStep, setInterviewStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("Click 'Start Interview' to begin.");
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [interviewResults, setInterviewResults] = useState<any[]>([]);

  const handleStartSession = () => {
    setFlowState('resume');
    setFirstName(''); setLastName(''); setRole(''); setSkills('');
    setResumeResult(null);
    setInterviewStep(0);
    setCurrentQuestion("Click 'Start Interview' to begin.");
    setPreviousQuestions([]);
    setUserAnswer("");
    setInterviewResults([]);
  };

  const handleGenerateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingResume(true);
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, role, experience: "Draft experience based on role", skills })
      });
      const data = await res.json();
      if (!data.error) {
        setResumeResult(data);
        setFlowState('interview');
        fetchNextQuestion([]); // Kick off first question
      } else {
        alert("Error generating resume.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const fetchNextQuestion = async (history: string[]) => {
    setIsLoadingQuestion(true);
    try {
      const res = await fetch('/api/interview/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: role || 'Software Engineer', step: interviewStep, previousQuestions: history })
      });
      const data = await res.json();
      if (data.question) {
        setCurrentQuestion(data.question);
        setPreviousQuestions([...history, data.question]);
      }
    } catch (e) {
      console.error(e);
      setCurrentQuestion("Failed to load question.");
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, answer: userAnswer })
      });
      const data = await res.json();
      
      if (!data.error) {
        setInterviewResults(prev => [...prev, data]);
        
        const nextStep = interviewStep + 1;
        setInterviewStep(nextStep);
        setUserAnswer("");
        
        if (nextStep >= maxQuestions) {
          setFlowState('feedback');
        } else {
          fetchNextQuestion(previousQuestions);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Calculate aggregated score
  const averageScore = interviewResults.length > 0 
    ? Math.round(interviewResults.reduce((acc, curr) => acc + (curr.pacingScore || 80), 0) / interviewResults.length)
    : 0;

  return (
    <div className="min-h-screen relative flex flex-col font-body text-foreground overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 mix-blend-screen">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl pointer-events-none" />
        <div className="absolute inset-0 radar-grid opacity-10 pointer-events-none" />
      </div>

      {/* 1. TOP BAR */}
      <header className="relative z-10 w-full border-b border-white/5 bg-white/5 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold font-display cursor-pointer hover:text-accent transition-colors text-white">
          <BrainCircuit className="w-6 h-6 text-accent" />
          AIPS
        </Link>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Github className="w-4 h-4" /> Connect GitHub
          </button>
          <button onClick={handleStartSession} className="bg-accent text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
            Start New Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Progress Strip */}
        <div className="flex justify-center mb-8">
          <div className="liquid-glass rounded-full px-6 py-3 flex items-center gap-4 sm:gap-8 border border-white/10 shadow-lg text-sm sm:text-base font-medium text-white/60">
            <div className={`flex items-center gap-2 transition-colors ${flowState === 'resume' ? 'text-accent' : flowState !== 'resume' ? 'text-green-400' : ''}`}>
              {flowState !== 'resume' ? <CheckCircle2 className="w-5 h-5"/> : <span className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center text-[10px]">1</span>}
              Resume
            </div>
            <div className="w-8 h-[1px] bg-white/20" />
            <div className={`flex items-center gap-2 transition-colors ${flowState === 'interview' ? 'text-accent' : flowState === 'feedback' ? 'text-green-400' : ''}`}>
               {flowState === 'feedback' ? <CheckCircle2 className="w-5 h-5"/> : <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${flowState === 'interview' ? 'border-accent text-accent' : 'border-white/30 text-white/30'}`}>2</span>}
              Interview {flowState === 'interview' ? `${interviewStep + 1}/${maxQuestions}` : ''}
            </div>
            <div className="w-8 h-[1px] bg-white/20" />
            <div className={`flex items-center gap-2 transition-colors ${flowState === 'feedback' ? 'text-accent' : ''}`}>
               <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${flowState === 'feedback' ? 'border-accent text-accent' : 'border-white/30 text-white/30'}`}>3</span>
              Score
            </div>
          </div>
        </div>

        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          
          {/* CARD 1: Resume Builder */}
          <div className={`liquid-glass rounded-3xl border ${flowState === 'resume' ? 'border-accent/50 shadow-[0_0_30px_rgba(var(--color-accent),0.1)]' : 'border-white/5 opacity-60'} p-6 sm:p-8 flex flex-col transition-all duration-500`}>
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <FileText className={`w-6 h-6 ${flowState === 'resume' ? 'text-accent' : 'text-white/40'}`} />
              <h2 className="text-xl font-display font-medium text-white">Resume Builder</h2>
            </div>
            
            <div className="flex-1 flex flex-col">
              {!resumeResult ? (
                <form onSubmit={handleGenerateResume} className="space-y-5 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} disabled={flowState !== 'resume'} placeholder="First Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30 disabled:opacity-50" />
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} disabled={flowState !== 'resume'} placeholder="Last Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30 disabled:opacity-50" />
                    <input type="text" required value={role} onChange={e => setRole(e.target.value)} disabled={flowState !== 'resume'} placeholder="Target Role (e.g. Frontend Engineer)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30 disabled:opacity-50" />
                    <textarea rows={3} required value={skills} onChange={e => setSkills(e.target.value)} disabled={flowState !== 'resume'} placeholder="Skills (React, Node, etc.)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30 resize-none disabled:opacity-50" />
                  </div>
                  <div className="space-y-3 mt-4">
                    <button type="submit" disabled={flowState !== 'resume' || isGeneratingResume} className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 group">
                      {isGeneratingResume ? (
                        <><RefreshCw className="w-4 h-4 animate-spin"/> AI is generating...</>
                      ) : (
                        <>Generate Resume</>
                      )}
                    </button>
                    <button type="button" disabled={flowState !== 'resume'} className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-colors disabled:opacity-50">
                      Upload Resume (PDF)
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col h-full animate-fade-rise">
                  <div className="flex-1 bg-white p-6 rounded-xl text-black shadow-inner overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
                    <h3 className="font-bold text-lg mb-1">{resumeResult.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">{resumeResult.role}</p>
                    <div className="space-y-2 text-xs text-gray-700">
                      <p><strong>Skills:</strong> {Array.isArray(resumeResult.skills) ? resumeResult.skills.join(', ') : resumeResult.skills}</p>
                      <p><strong>Experience:</strong> {resumeResult.experience?.[0]?.title} at {resumeResult.experience?.[0]?.company}</p>
                      <p className="line-clamp-3 italic text-gray-500 text-[10px]">Preview truncated. Download to see full optimized details.</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-green-400 text-sm font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> ATS: {resumeResult.atsScore}/100</div>
                    <button className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: Interview Practice */}
          <div className={`liquid-glass rounded-3xl border ${flowState === 'interview' ? 'border-accent/50 shadow-[0_0_30px_rgba(var(--color-accent),0.1)]' : 'border-white/5 opacity-60'} p-6 sm:p-8 flex flex-col transition-all duration-500`}>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Mic className={`w-6 h-6 ${flowState === 'interview' ? 'text-accent' : 'text-white/40'}`} />
                <h2 className="text-xl font-display font-medium text-white">Interview Practice</h2>
              </div>
              {flowState === 'interview' && (
                <span className="text-xs font-medium bg-white/10 px-3 py-1 rounded-full text-white/80">Q {interviewStep + 1}/{maxQuestions}</span>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              {flowState === 'resume' ? (
                <div className="flex-1 flex items-center justify-center text-center text-white/30 text-sm p-6">
                  Generate your resume first to unlock the tailored interview simulation.
                </div>
              ) : flowState === 'feedback' ? (
                <div className="flex-1 flex items-center justify-center text-center text-green-400 text-sm p-6 flex-col gap-3">
                  <CheckCircle2 className="w-12 h-12" />
                  Interview Completed!
                </div>
              ) : (
                <div className="flex-1 flex flex-col animate-fade-rise">
                  <div className="bg-black/30 rounded-xl p-5 border border-white/5 mb-4 relative min-h-[120px] flex items-center">
                    {isLoadingQuestion ? (
                       <div className="w-full text-center text-white/50 text-sm flex items-center justify-center gap-2">
                         <RefreshCw className="w-4 h-4 animate-spin"/> Loading question...
                       </div>
                    ) : (
                      <p className="text-base text-white/90 leading-relaxed">{currentQuestion}</p>
                    )}
                  </div>
                  
                  <textarea 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isEvaluating || isLoadingQuestion}
                    placeholder="Type your answer here..."
                    className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30 resize-none disabled:opacity-50"
                  />
                  
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !userAnswer.trim() || isLoadingQuestion}
                      className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isEvaluating ? (
                        <><RefreshCw className="w-4 h-4 animate-spin"/> Analyzing answer...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Submit Answer</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 3: Feedback & Score */}
          <div className={`liquid-glass rounded-3xl border ${flowState === 'feedback' ? 'border-accent/50 shadow-[0_0_30px_rgba(var(--color-accent),0.1)]' : 'border-white/5 opacity-60'} p-6 sm:p-8 flex flex-col transition-all duration-500`}>
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Trophy className={`w-6 h-6 ${flowState === 'feedback' ? 'text-accent' : 'text-white/40'}`} />
              <h2 className="text-xl font-display font-medium text-white">Feedback & Score</h2>
            </div>

            <div className="flex-1 flex flex-col">
              {flowState !== 'feedback' ? (
                <div className="flex-1 flex items-center justify-center text-center text-white/30 text-sm p-6">
                  Complete your interview to receive your final score and detailed feedback.
                </div>
              ) : (
                <div className="flex-1 flex flex-col animate-fade-rise">
                  <div className="text-center py-6 border-b border-white/5">
                    <div className="text-5xl font-display font-bold text-white mb-2">{averageScore}</div>
                    <div className="text-sm uppercase tracking-widest text-accent">Final Score</div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Key Strengths</h4>
                      <ul className="space-y-2 text-sm text-white/70">
                        <li className="flex gap-2"><span className="text-accent">•</span> Strong technical accuracy in {role} concepts.</li>
                        <li className="flex gap-2"><span className="text-accent">•</span> Good pacing overall.</li>
                      </ul>
                    </div>
                    
                    {/* Improvements */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-yellow-400"/> Areas for Improvement</h4>
                      <ul className="space-y-3 text-sm text-white/70">
                        {interviewResults.map((res, idx) => (
                           <li key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5">
                             <div className="text-xs text-white/40 mb-1">Q{idx + 1} Feedback</div>
                             <span className="text-yellow-200 block text-xs">{res.actionableTip || "Try to expand more on your previous experience."}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <button onClick={handleStartSession} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors">
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
