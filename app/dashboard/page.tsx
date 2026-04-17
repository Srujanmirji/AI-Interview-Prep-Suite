'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { FileText, Mic, Target, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PROGRESS_DATA = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 70 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 82 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 88 },
  { name: 'Sun', score: 92 },
];

const SKILL_DATA = [
  { subject: 'System Design', A: 80, fullMark: 100 },
  { subject: 'Algorithms', A: 90, fullMark: 100 },
  { subject: 'Communication', A: 65, fullMark: 100 },
  { subject: 'Behavioral', A: 75, fullMark: 100 },
  { subject: 'Domain Knowledge', A: 85, fullMark: 100 },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-fade-rise">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium">Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Your interview readiness is at 82%.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-secondary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            1,250 XP
          </div>
          <div className="bg-secondary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            🔥 5 Day Streak
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-medium">Resume Score</h3>
          </div>
          <div className="text-4xl font-display font-bold text-green-400">92<span className="text-xl text-muted-foreground">/100</span></div>
          <p className="text-sm text-muted-foreground mt-2">ATS optimized for SDE roles.</p>
        </div>

        <div className="liquid-glass p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-medium">Avg. Interview Score</h3>
          </div>
          <div className="text-4xl font-display font-bold text-foreground">84<span className="text-xl text-muted-foreground">/100</span></div>
          <p className="text-sm text-muted-foreground mt-2">Based on 12 mock sessions.</p>
        </div>

        <div className="liquid-glass p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-medium">Job Matches</h3>
          </div>
          <div className="text-4xl font-display font-bold text-foreground">15</div>
          <p className="text-sm text-muted-foreground mt-2">Highly matched open positions.</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex flex-col">
          <h3 className="text-lg font-medium mb-6">Performance Progress</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROGRESS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar dataKey="score" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex flex-col">
          <h3 className="text-lg font-medium mb-6">Skill Analysis</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_DATA}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="liquid-glass p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-medium mb-4">Suggested Next Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div>
              <div className="font-medium">Practice Behavioral Questions</div>
              <div className="text-sm text-muted-foreground">Your communication score is 65%. Let&apos;s improve it.</div>
            </div>
            <Link href="/dashboard/interview" className="flex items-center gap-2 text-sm text-accent font-medium hover:underline">
              Start <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div>
              <div className="font-medium">Tailor Resume for Google</div>
              <div className="text-sm text-muted-foreground">Match your resume against the SWE III description.</div>
            </div>
            <Link href="/dashboard/matcher" className="flex items-center gap-2 text-sm text-accent font-medium hover:underline">
              Match <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
