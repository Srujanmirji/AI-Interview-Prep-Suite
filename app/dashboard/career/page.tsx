'use client';

import React, { useState } from 'react';
import { Compass, Briefcase, Target, Clock, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Milestone {
  id: number;
  timeframe: string;
  title: string;
  requiredSkills: string[];
  actionSteps: string[];
}

interface RoadmapResult {
  overview: string;
  milestones: Milestone[];
  finalAdvice: string;
}

export default function CareerPathPage() {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [timeline, setTimeline] = useState('6 Months');
  
  // Advanced Details
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [context, setContext] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRole || !targetRole) return;
    
    setIsGenerating(true);
    setRoadmap(null);
    
    try {
      const res = await fetch('/api/career/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole, targetRole, timeline, education, experience, linkedin, context })
      });
      
      const data = await res.json();
      if (data && !data.error) {
        setRoadmap(data);
      } else {
        alert("Error generating roadmap: " + (data.error || "Unknown"));
      }
    } catch (e) {
      console.error(e);
      alert("Network Error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen relative p-6 space-y-8 max-w-[1200px] mx-auto pb-32">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex flex-shrink-0 items-center justify-center border border-accent/20">
          <Compass className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-medium text-white">AI Career Architect</h1>
          <p className="text-white/50 text-sm mt-1">Map the exact timeline between your current role and your dream promotion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel (Col 4) */}
        <div className="lg:col-span-4 h-fit">
          <div className="liquid-glass p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
             
             <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                <div>
                   <label className="text-xs font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block flex items-center gap-2">
                     <Briefcase className="w-4 h-4"/> Current Role
                   </label>
                   <input 
                     type="text" 
                     placeholder="e.g. Helpdesk Analyst" 
                     required
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30"
                     value={currentRole}
                     onChange={e => setCurrentRole(e.target.value)}
                   />
                </div>
                
                <div className="flex justify-center -my-3 opacity-30">
                  <ArrowRight className="w-5 h-5 text-white rotate-270" />
                </div>
                
                <div>
                   <label className="text-xs font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block flex items-center gap-2">
                     <Target className="w-4 h-4"/> Dream Role
                   </label>
                   <input 
                     type="text" 
                     placeholder="e.g. Cloud Engineer" 
                     required
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30"
                     value={targetRole}
                     onChange={e => setTargetRole(e.target.value)}
                   />
                </div>

                <div>
                   <label className="text-xs font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block flex items-center gap-2">
                     <Clock className="w-4 h-4"/> Desired Timeline
                   </label>
                   <select 
                     value={timeline}
                     onChange={e => setTimeline(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white appearance-none cursor-pointer"
                   >
                     <option value="3 Months">Omitted (Aggressive)</option>
                     <option value="6 Months">6 Months (Focused)</option>
                     <option value="1 Year">1 Year (Steady)</option>
                     <option value="2+ Years">2+ Years (Long-term)</option>
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block">
                       Experience (Yrs)
                     </label>
                     <input 
                       type="text" 
                       placeholder="e.g. 2, 5+" 
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30"
                       value={experience}
                       onChange={e => setExperience(e.target.value)}
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block">
                       Education
                     </label>
                     <input 
                       type="text" 
                       placeholder="e.g. BS Comp Sci" 
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30"
                       value={education}
                       onChange={e => setEducation(e.target.value)}
                     />
                   </div>
                </div>

                <div>
                   <label className="text-xs font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block">
                     LinkedIn Profile (Optional)
                   </label>
                   <input 
                     type="url" 
                     placeholder="https://linkedin.com/in/username" 
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30"
                     value={linkedin}
                     onChange={e => setLinkedin(e.target.value)}
                   />
                </div>
                
                <div>
                   <label className="text-xs font-medium text-white/50 uppercase tracking-widest pl-1 mb-2 block">
                     Key Details & Context
                   </label>
                   <textarea 
                     rows={2}
                     placeholder="Certifications, specific tech stack, gaps in knowledge..." 
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent text-white placeholder:text-white/30 resize-none"
                     value={context}
                     onChange={e => setContext(e.target.value)}
                   />
                </div>

                <div className="pt-2">
                   <button 
                     type="submit" 
                     disabled={isGenerating}
                     className="w-full bg-accent text-white py-3.5 rounded-xl font-medium hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(var(--color-accent),0.3)] flex justify-center items-center gap-2 disabled:opacity-50"
                   >
                     {isGenerating ? (
                        <><RefreshCw className="w-4 h-4 animate-spin"/> Architecting Pathway...</>
                     ) : "Generate Roadmap"}
                   </button>
                </div>
             </form>
          </div>
        </div>

        {/* Results Panel (Col 8) */}
        <div className="lg:col-span-8">
           {!roadmap && !isGenerating && (
             <div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-white/10 rounded-3xl bg-black/10">
               <Compass className="w-16 h-16 text-white/10 mb-4 animate-pulse" />
               <p className="text-white/40 font-medium">Input your career parameters to forge a path.</p>
             </div>
           )}

           {isGenerating && (
             <div className="flex flex-col items-center justify-center h-[500px] border border-white/5 rounded-3xl bg-black/20 liquid-glass animate-pulse">
               <div className="relative">
                 <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin" />
                 <Compass className="w-12 h-12 text-accent m-4 opacity-50" />
               </div>
               <p className="mt-6 text-accent font-medium text-sm tracking-widest uppercase">Calculating Nodes...</p>
             </div>
           )}

           {roadmap && (
             <div className="space-y-8 animate-fade-rise">
                
                {/* Overview Box */}
                <div className="liquid-glass p-6 rounded-2xl border border-accent/20 bg-accent/5">
                  <h3 className="font-display font-medium text-white mb-2">Strategy Overview</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{roadmap.overview}</p>
                </div>

                {/* The Timeline */}
                <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:inset-y-0 before:left-0 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-accent/50 before:to-transparent">
                   
                   {roadmap.milestones.map((m, idx) => (
                      <div key={idx} className="relative group">
                         {/* Timeline Dot */}
                         <div className="absolute -left-6 sm:-left-10 -translate-x-[50%] w-4 h-4 rounded-full bg-background border-2 border-accent group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.8)] transition-all z-10" />
                         
                         {/* Card Content */}
                         <div className="liquid-glass p-6 rounded-2xl border border-white/5 shadow-lg group-hover:border-accent/30 transition-all bg-black/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 bg-white/5 rounded-bl-3xl">
                              <span className="text-xs font-bold text-accent tracking-widest uppercase">{m.timeframe}</span>
                            </div>
                            
                            <h4 className="text-xl font-display font-medium text-white pr-20">{m.title}</h4>
                            
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                               {/* Skills Box */}
                               <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                 <h5 className="text-xs text-white/40 uppercase tracking-widest mb-3">Target Skills</h5>
                                 <div className="flex flex-wrap gap-2">
                                   {m.requiredSkills.map((s, i) => (
                                     <span key={i} className="px-2 py-1 bg-white/10 text-white/80 text-[10px] rounded-md font-medium border border-white/5">
                                       {s}
                                     </span>
                                   ))}
                                 </div>
                               </div>

                               {/* Action Steps Box */}
                               <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                 <h5 className="text-xs text-white/40 uppercase tracking-widest mb-3">Key Action Steps</h5>
                                 <ul className="space-y-2">
                                   {m.actionSteps.map((step, i) => (
                                      <li key={i} className="flex gap-2 text-xs text-white/70 leading-relaxed">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                        <span>{step}</span>
                                      </li>
                                   ))}
                                 </ul>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}

                </div>

                {/* Final Advice */}
                <div className="text-center p-8 mt-12 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                  <Target className="w-8 h-8 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 italic text-sm max-w-xl mx-auto">"{roadmap.finalAdvice}"</p>
                </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
}
