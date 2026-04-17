'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, User, Briefcase, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function AuthPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '0-2 Years',
    domain: 'Software Engineering',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;
    
    login(formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 blur-[120px] rounded-full point-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full point-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-display text-white mb-2 text-center tracking-tight">Create your Profile</h1>
          <p className="text-white/50 text-center">Let's tailor your AI interview experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="liquid-glass p-8 rounded-3xl border border-white/5 space-y-5">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                required
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-body"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Target Role</label>
            <div className="relative">
              <Briefcase className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                required
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-body"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Experience</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white focus:outline-none focus:border-accent/50 focus:bg-[#1a1a1a] transition-all font-body appearance-none"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                >
                  <option className="text-black bg-white" value="0-2 Years">0-2 Years</option>
                  <option className="text-black bg-white" value="3-5 Years">3-5 Years</option>
                  <option className="text-black bg-white" value="5+ Years">5+ Years</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Domain</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white focus:outline-none focus:border-accent/50 focus:bg-[#1a1a1a] transition-all font-body appearance-none"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                >
                  <option className="text-black bg-white" value="Software Engineering">Engineering</option>
                  <option className="text-black bg-white" value="Product Management">Product</option>
                  <option className="text-black bg-white" value="Data Science">Data Science</option>
                  <option className="text-black bg-white" value="Design">Design</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!formData.name || !formData.role}
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400"
          >
            Enter Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="text-center text-white/30 text-xs mt-6">
          Your data is stored securely and processed locally for this session.
        </p>
      </motion.div>
    </div>
  );
}
