import React from 'react';
import Link from 'next/link';
import { Home, Mic, Compass, BookOpen, Settings, LayoutDashboard, Target } from 'lucide-react';
import { FloatingChatbot } from '@/components/FloatingChatbot';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
             <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group opacity-50 cursor-not-allowed">
               <Compass className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block">Career Path</span>
             </Link>
             <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors group opacity-50 cursor-not-allowed">
               <BookOpen className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="font-medium hidden lg:block">Study Resources</span>
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
    </div>
  );
}
