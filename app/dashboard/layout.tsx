'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Mic, Compass, BookOpen, Settings, LayoutDashboard, Target, Layers, X } from 'lucide-react';
import { FloatingChatbot } from '@/components/FloatingChatbot';
import { motion, AnimatePresence } from 'motion/react';
import { COMPLETE_FEATURES } from '@/lib/featuresData';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background text-foreground font-body overflow-hidden">
      
      {/* Sidebar Navigation */}
      <nav className="w-20 lg:w-64 border-r border-white/5 bg-white/5 backdrop-blur-md flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.5)] transition-all">
                <Target className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold font-display text-white hidden lg:block tracking-wide">AIPS</span>
            </Link>
          </div>
          
          <div className="px-4 py-8 space-y-2">
             <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group">
               <LayoutDashboard className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block">Overview</span>
             </Link>
             <Link href="/dashboard/session" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group">
               <Mic className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block">Mock Simulator</span>
             </Link>
             <button onClick={() => setIsFeaturesOpen(true)} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group">
               <Layers className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block text-left text-sm">All AI Features</span>
             </button>
             <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group opacity-50 cursor-not-allowed">
               <Compass className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block text-sm">Career Path</span>
             </Link>
             <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group opacity-50 cursor-not-allowed">
               <BookOpen className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block text-sm">Study Resources</span>
             </Link>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5">
           <button className="flex items-center justify-center lg:justify-start gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group">
             <Settings className="w-5 h-5 group-hover:text-accent transition-colors" />
             <span className="font-medium hidden lg:block">Settings</span>
           </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-screen overflow-y-auto relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
        </div>
        <div className="relative z-10 h-full w-full">
           {children}
        </div>
      </main>

      <FloatingChatbot />

      {/* Global Slide-Over Features Panel */}
      <AnimatePresence>
        {isFeaturesOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
              onClick={() => setIsFeaturesOpen(false)}
            />
            
            {/* Sliding Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-background border-l border-white/10 shadow-2xl flex flex-col z-50"
            >
               {/* Panel Header */}
               <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
                 <div>
                   <h2 className="text-xl font-display text-white">AI Tools Hub</h2>
                   <p className="text-sm text-white/50">Select a specialized module</p>
                 </div>
                 <button 
                   onClick={() => setIsFeaturesOpen(false)}
                   className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>

               {/* Panel Content (Scrollable Features List) */}
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {COMPLETE_FEATURES.map((feat, i) => (
                    <Link 
                      key={i} 
                      href={feat.href} 
                      onClick={() => setIsFeaturesOpen(false)}
                      className="group liquid-glass p-4 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-accent/20 transition-all flex items-start gap-4"
                    >
                      <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors border border-white/5">
                        {feat.icon && React.cloneElement(feat.icon as React.ReactElement, { className: 'w-5 h-5 text-accent' })}
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm mb-1">{feat.title}</h3>
                        <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{feat.description}</p>
                      </div>
                    </Link>
                 ))}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
