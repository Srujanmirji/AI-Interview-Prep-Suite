'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from 'recharts';
import { 
  Trophy, TrendingUp, AlertTriangle, CheckCircle2, Star, Target, BookOpen, Clock, Activity, Zap, Mic, Sparkles,
  FileText, MessageSquare, PhoneCall, Video, Map, BarChart as BarChartIcon, LineChart as LineChartIcon, Bot, UserCheck, Building, Lightbulb, PenTool, Globe, BrainCircuit, Briefcase, Cpu
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const progressData = [
  { name: 'W1', score: 45 },
  { name: 'W2', score: 55 },
  { name: 'W3', score: 68 },
  { name: 'W4', score: 62 },
  { name: 'W5', score: 75 },
  { name: 'W6', score: 85 },
];

const skillsData = [
  { name: 'DSA', value: 70 },
  { name: 'System Design', value: 45 },
  { name: 'React', value: 90 },
  { name: 'Node.js', value: 65 },
  { name: 'Communication', value: 80 },
];

const pieData = [
  { name: 'Strengths', value: 65, color: '#4ade80' },
  { name: 'Weaknesses', value: 35, color: '#f87171' },
];

const recentMocks = [
  { id: 1, role: 'Senior Frontend Engineer', date: 'Today', score: 85, feedback: 'Great communication, needs work on system design basics.', status: 'excellent' },
  { id: 2, role: 'React Developer', date: 'Yesterday', score: 72, feedback: 'Good technical knowledge, improved pacing needed.', status: 'good' },
  { id: 3, role: 'Full Stack Engineer', date: 'Last Week', score: 55, feedback: 'Struggled with database indexing concepts.', status: 'needs_work' },
];

import { COMPLETE_FEATURES } from '@/lib/featuresData';

export default function AnalyticsDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate data loading animation
    const t = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-white/50 gap-4">
         <div className="w-10 h-10 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
         <span className="text-sm font-medium animate-pulse">AI is compiling your analytics...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4">
            <SparkleIcon /> Level 12 AI Builder
          </motion.div>
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="text-4xl font-display font-medium text-white tracking-tight">
            Welcome back, Srujan
          </motion.h1>
          <motion.p initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="text-white/60 mt-2">Your interview readiness has increased by 12% this week.</motion.p>
        </div>
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.3}}>
          <Link href="/dashboard/session" className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all inline-flex items-center gap-2">
            <Mic className="w-4 h-4" /> Start Mock Interview
          </Link>
        </motion.div>
      </div>

      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Resume Score" value="92/100" icon={<FileText />} delay={0.1} trend="+5%" color="border-blue-500" glow="rgba(59, 130, 246, 0.5)"/>
        <SummaryCard title="Avg. Mock Score" value="78/100" icon={<Activity/>} delay={0.2} trend="+12%" color="border-blue-400" glow="rgba(96, 165, 250, 0.5)" />
        <SummaryCard title="Readiness Level" value="Advanced" icon={<Target/>} delay={0.3} trend="Top 15%" color="border-purple-400" glow="rgba(192, 132, 252, 0.5)" />
        <SummaryCard title="Current Streak" value="7 Days" icon={<Zap/>} delay={0.4} trend="1,400 XP" color="border-yellow-400" glow="rgba(250, 204, 21, 0.5)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. PERFORMANCE ANALYTICS */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.5}} className="lg:col-span-2 liquid-glass p-6 rounded-3xl border border-white/5 space-y-6">
           <div className="flex justify-between items-center">
             <h2 className="text-xl font-display text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-accent"/> Progress Over Time</h2>
             <select className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none">
               <option>Last 6 Weeks</option>
               <option>Last 6 Months</option>
             </select>
           </div>
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={progressData}>
                 <defs>
                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="rgb(var(--color-accent))" stopOpacity={0.3}/>
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false}/>
                 <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false}/>
                 <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                 <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* SKILLS RADAR / BAR */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.6}} className="liquid-glass p-6 rounded-3xl border border-white/5 space-y-6">
           <h2 className="text-xl font-display text-white">Skill Breakdown</h2>
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={skillsData} layout="vertical" margin={{top: 0, right: 0, left: 30, bottom: 0}}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}/>
                 <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                   {skillsData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.value < 50 ? '#f87171' : entry.value < 75 ? '#fbbf24' : '#4ade80'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. SKILL GAP & WEAKNESS PANEL */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.7}} className="liquid-glass p-6 rounded-3xl border border-red-500/20 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px]" />
          <h2 className="text-xl font-display text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400"/> Skill Gaps Identified</h2>
          
          <div className="space-y-4">
             <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3">
               <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-red-400" /></div>
               <div>
                 <p className="text-sm font-medium text-red-200">System Design (Databases)</p>
                 <p className="text-xs text-red-200/70 mt-1">Struggled with scaling SQL databases in Mock #3.</p>
               </div>
             </div>
             
             <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3">
               <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-yellow-400" /></div>
               <div>
                 <p className="text-sm font-medium text-yellow-200">Behavioral Structure</p>
                 <p className="text-xs text-yellow-200/70 mt-1">Answers lacked the STAR formatting.</p>
               </div>
             </div>
          </div>
        </motion.div>

        {/* 4. PERSONALIZED STUDY PLAN */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.8}} className="liquid-glass p-6 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-xl font-display text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent"/> AI Study Plan</h2>
          
          <div className="space-y-5">
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-white/80">React Hooks Mastery</span>
                 <span className="text-green-400">100%</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-400 w-full" /></div>
             </div>

             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-accent font-medium flex items-center gap-1.5"><Star className="w-3 h-3"/> System Design Context</span>
                 <span className="text-accent">40%</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-accent w-[40%] shadow-[0_0_10px_rgba(var(--color-accent),0.8)]" /></div>
               <p className="text-[10px] text-white/50 pt-1 uppercase tracking-wider">Next Recommended Topic</p>
             </div>

             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-white/40">Advanced Algorithms</span>
                 <span className="text-white/40">0%</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white/20 w-[0%]" /></div>
             </div>
          </div>
        </motion.div>

        {/* 5. GAMIFICATION SECTION */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.9}} className="liquid-glass p-6 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-xl font-display text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400"/> Gamification</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
               <div className="relative">
                 <div className="w-16 h-16 rounded-full border-2 border-dashed border-yellow-400/50 flex items-center justify-center animate-[spin_10s_linear_infinite]" />
                 <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-2xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">12</div>
               </div>
               <div>
                 <p className="text-white font-medium text-lg">Level 12</p>
                 <p className="text-sm text-white/50">1,400 / 2,000 XP to Level 13</p>
               </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3 text-white/80">Badges Earned</p>
              <div className="flex gap-3">
                 <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 group relative">
                   <div className="absolute inset-0 bg-green-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                   React
                 </div>
                 <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent group relative">
                   <div className="absolute inset-0 bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                   AI
                 </div>
                 <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                   ?
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. RECENT ACTIVITY LIST */}
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:1.0}}>
         <h2 className="text-2xl font-display text-white mb-6">Recent Activity</h2>
         <div className="liquid-glass rounded-3xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-medium text-white/40 uppercase tracking-widest hidden md:grid">
               <div className="col-span-4">Role</div>
               <div className="col-span-2">Date</div>
               <div className="col-span-2">Score</div>
               <div className="col-span-4">AI Feedback Summary</div>
            </div>
            <div className="divide-y divide-white/5">
              {recentMocks.map((mock) => (
                <div key={mock.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-white/[0.02] transition-colors group">
                   <div className="col-span-4 font-medium text-white">{mock.role}</div>
                   <div className="col-span-2 text-sm text-white/50 flex items-center gap-2"><Clock className="w-3 h-3"/>{mock.date}</div>
                   <div className="col-span-2 font-display text-xl">
                      <span className={
                        mock.score >= 80 ? 'text-green-400' : mock.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }>{mock.score}</span><span className="text-sm text-white/20">/100</span>
                   </div>
                   <div className="col-span-4 text-sm text-white/60 line-clamp-2 md:line-clamp-1">{mock.feedback}</div>
                </div>
              ))}
            </div>
         </div>
      </motion.div>
      
      {/* 7. AI SUGGESTIONS PANEL */}
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:1.1}} className="border border-accent/20 bg-accent/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/10 pointer-events-none" />
         <div className="flex-1 w-full relative z-10">
           <h3 className="text-xl font-display text-white mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" /> AI Coach Advice</h3>
           <p className="text-white/70">"You've been skipping the STAR format in behavioral questions. Practice 2 HR questions today focusing heavily on Action & Result. I also noticed your resume lacks specifics on Docker. If you know it, add it!"</p>
         </div>
         <div className="shrink-0 relative z-10 w-full md:w-auto">
           <button className="w-full md:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] focus:outline-none">
             Adopt Suggestions
           </button>
         </div>
      </motion.div>

    </div>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v4a3 3 0 0 1-3 3H4v2h4a3 3 0 0 1 3 3v4h2v-4a3 3 0 0 1 3-3h4v-2h-4a3 3 0 0 1-3-3V2h-2Zm8.5 13.5L18 14l-1.5 1.5L15 14l1.5 1.5L15 17l1.5-1.5L18 17l1.5-1.5-.5-.5Zm-14 0L4 14l-1.5 1.5L1 14l1.5 1.5L1 17l1.5-1.5L4 17l1.5-1.5-.5-.5Z"/></svg>
  );
}

function LayersIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>;
}

function SummaryCard({ title, value, icon, delay, trend, color, glow }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay }}
      whileHover={{ y: -5 }}
      style={{ boxShadow: `0 0 0px ${glow}` }}
      className={`relative group liquid-glass p-6 rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_var(--glow)]`}
    >
      {/* Dynamic Glow Injector */}
      <style>{`.group:hover { --glow: ${glow}; }`}</style>
      
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-20 group-hover:opacity-50 transition-opacity bg-current`} style={{color: glow.replace('0.5', '1')}}/>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border bg-black/40 ${color} shadow-inner`}>
         {React.cloneElement(icon, { className: 'w-6 h-6 text-white' })}
      </div>
      <p className="text-sm text-white/60 mb-1">{title}</p>
      <h3 className="text-3xl font-display font-medium text-white tracking-tight">{value}</h3>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/50">
        <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs">{trend}</span> since last week
      </div>
    </motion.div>
  );
}
