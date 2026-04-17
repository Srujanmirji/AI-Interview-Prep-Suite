'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen bg-background text-foreground font-body overflow-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="absolute inset-0 radar-grid opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
