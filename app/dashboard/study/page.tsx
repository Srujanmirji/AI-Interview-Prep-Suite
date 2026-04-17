'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Target, Sparkles, ChevronDown, CheckCircle2, ChevronRight, Activity, ArrowRight, Layers } from 'lucide-react';

interface Topic {
  name: string;
  explanation: string;
  importance: string;
  example: string;
  importanceLevel: 'High' | 'Medium' | 'Low';
  frequency: 'Common' | 'Occasional' | 'Rare';
  practice: string[];
  miniProject: string | null;
}

interface Phase {
  phase: string;
  topics: Topic[];
}

export default function StudyConceptsPage() {
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [domain, setDomain] = useState('React / Next.js');
  const [skillFocus, setSkillFocus] = useState('Performance & Architecture');
  
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Phase[] | null>(null);

  // Interaction State
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRoadmap(null);
    setExpandedTopic(null);

    try {
      const res = await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, experienceLevel, domain, skillFocus })
      });
      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      } else {
        alert("Failed to generate: " + (data.error || "Unknown Error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network Error generating roadmap.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = (topicName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(completedTopics);
    if (newSet.has(topicName)) newSet.delete(topicName);
    else newSet.add(topicName);
    setCompletedTopics(newSet);
  };

  const toggleExpand = (topicName: string) => {
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-rise p-4 md:p-8">
      
      {/* HEADER & FORM CONFIGURATOR */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" /> Concept Mastery Roadmap
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Generate a hyper-personalized, stage-by-stage learning trajectory.</p>
        </div>

        <form onSubmit={handleGenerate} className="liquid-glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 blur-[80px] rounded-full pointer-events-none" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Target Role</label>
                <input required value={targetRole} onChange={e=>setTargetRole(e.target.value)} type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="e.g. Frontend Developer" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Experience Level</label>
                <select value={experienceLevel} onChange={e=>setExperienceLevel(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors appearance-none">
                  <option className="bg-background text-white">Beginner</option>
                  <option className="bg-background text-white">Intermediate</option>
                  <option className="bg-background text-white">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Domain Focus (Optional)</label>
                <input value={domain} onChange={e=>setDomain(e.target.value)} type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="e.g. Fintech, E-Commerce" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70 font-medium">Specific Skill Focus (Optional)</label>
                <input value={skillFocus} onChange={e=>setSkillFocus(e.target.value)} type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] transition-colors" placeholder="e.g. React, System Design" />
              </div>
           </div>

           <button disabled={isLoading} type="submit" className="w-full md:w-auto bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-50">
             {isLoading ? <Layers className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
             {isLoading ? 'Architecting Path...' : 'Generate Roadmap'}
           </button>
        </form>
      </div>

      {/* LOADING SKELETON */}
      {isLoading && (
        <div className="space-y-8 pl-4 lg:pl-8 border-l-2 border-white/5 relative">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="relative">
               <div className="absolute -left-[23px] lg:-left-[39px] top-1 w-6 h-6 rounded-full bg-white/5 border-2 border-background animate-pulse" />
               <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse mb-6" />
               <div className="space-y-4">
                 <div className="h-24 w-full bg-white/5 rounded-2xl animate-pulse" />
                 <div className="h-24 w-full bg-white/5 rounded-2xl animate-pulse delay-75" />
               </div>
             </div>
           ))}
        </div>
      )}

      {/* VERTICAL ROADMAP UI */}
      {roadmap && (
        <div className="relative pt-4">
           {/* Connecting Line */}
           <div className="absolute left-[20px] md:left-[30px] top-0 bottom-0 w-px bg-gradient-to-b from-[#3b82f6] via-white/10 to-transparent" />

           <div className="space-y-12">
             {roadmap.map((phase: Phase, pIdx: number) => (
               <motion.div 
                 initial={{ opacity: 0, x: -20 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 transition={{ delay: pIdx * 0.2 }}
                 key={pIdx} 
                 className="relative pl-12 md:pl-20"
               >
                 {/* Phase Waypoint */}
                 <div className="absolute left-[13px] md:left-[23px] top-1 w-4 h-4 rounded-full bg-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.8)] border-[3px] border-background" />
                 
                 <h2 className="text-2xl font-display text-white mb-6 uppercase tracking-widest text-[#3b82f6]/90 flex items-center gap-3">
                   Phase 0{pIdx + 1} // {phase.phase}
                 </h2>

                 <div className="space-y-4">
                   {phase.topics.map((topic, tIdx) => {
                     const isExpanded = expandedTopic === topic.name;
                     const isCompleted = completedTopics.has(topic.name);
                     const isHighImportance = topic.importanceLevel === 'High';

                     return (
                       <motion.div 
                          layout
                          key={topic.name} 
                          onClick={() => toggleExpand(topic.name)}
                          className={`
                            group cursor-pointer liquid-glass rounded-2xl border transition-all duration-300 overflow-hidden
                            ${isHighImportance && !isCompleted ? 'border-[#3b82f6]/40 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'border-white/5 hover:border-white/20'}
                            ${isCompleted ? 'opacity-50 grayscale' : ''}
                          `}
                       >
                         {/* Card Header */}
                         <div className="p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                               <button 
                                 onClick={(e) => toggleComplete(topic.name, e)}
                                 className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                   isCompleted ? 'bg-[#4ade80] border-[#4ade80]' : 'border-white/20 hover:border-[#3b82f6]'
                                 }`}
                               >
                                 {isCompleted && <CheckCircle2 className="w-4 h-4 text-black" />}
                               </button>
                               <div>
                                 <h3 className="text-lg font-medium text-white flex items-center gap-3">
                                   {topic.name}
                                   {isHighImportance && <span className="text-[10px] uppercase font-bold bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-0.5 rounded-sm">Crucial</span>}
                                 </h3>
                                 <p className="text-sm text-white/50 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{topic.explanation}</p>
                               </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                         </div>

                         {/* Expandable Body */}
                         <AnimatePresence>
                           {isExpanded && (
                             <motion.div
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="border-t border-white/5 bg-black/20"
                             >
                               <div className="p-6 space-y-6">
                                 
                                 {/* Grid Layout for Concepts */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3b82f6]"><Target className="w-3 h-3"/> Why Interviewers Care</h4>
                                      <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-4 rounded-xl">{topic.importance}</p>
                                   </div>
                                   <div className="space-y-2">
                                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3b82f6]"><Activity className="w-3 h-3"/> Real World Example</h4>
                                      <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-4 rounded-xl">{topic.example}</p>
                                   </div>
                                 </div>

                                 {/* Actionable Practice */}
                                 <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Actionable Practice Tasks</h4>
                                    <ul className="space-y-3">
                                      {topic.practice.map((task, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                                          <ArrowRight className="w-4 h-4 mt-0.5 text-[#3b82f6] shrink-0" />
                                          {task}
                                        </li>
                                      ))}
                                    </ul>
                                    
                                    {topic.miniProject && (
                                      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#3b82f6]/10 to-transparent border border-[#3b82f6]/20">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-1">Mini Project Builder</div>
                                        <p className="text-sm text-white/90 font-medium">{topic.miniProject}</p>
                                      </div>
                                    )}
                                 </div>
                                 
                                 <div className="flex gap-2">
                                    <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-white/60">Frequency: {topic.frequency}</span>
                                    <span className={`text-xs px-3 py-1 rounded-full ${
                                      topic.importanceLevel === 'High' ? 'bg-red-500/20 text-red-400' : 
                                      topic.importanceLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                      'bg-green-500/20 text-green-400'
                                    }`}>
                                      Importance: {topic.importanceLevel}
                                    </span>
                                 </div>

                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>

                       </motion.div>
                     );
                   })}
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}
