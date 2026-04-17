import React from 'react';
import { Settings, PlayCircle, Layers, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function FeaturePlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="space-y-6 animate-fade-rise max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <Link href="/" className="text-sm text-accent hover:underline flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-medium">{title}</h1>
          <p className="text-muted-foreground mt-1">Configure and manage your {title.toLowerCase()} settings.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Main UI Area */}
        <div className="lg:col-span-2 relative liquid-glass rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 text-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <div className="relative z-10 max-w-sm space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex flex-col items-center justify-center border border-accent/20">
              <Layers className="w-10 h-10 text-accent animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-medium tracking-tight">System Ready</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The {title.toLowerCase()} module requires configuration before your first session. Once configured, you can launch the interactive environment.
            </p>

            <button className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors flex justify-center items-center gap-2">
              <PlayCircle className="w-5 h-5" /> Launch Module
            </button>
          </div>
        </div>

        {/* Sidebar Analytics Placeholder */}
        <div className="space-y-6 flex flex-col">
          <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex-1">
            <h3 className="font-medium mb-4 flex items-center gap-2 text-muted-foreground">
              <Settings className="w-4 h-4" /> Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                <span className="text-sm">Difficulty Level</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">Advanced</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                <span className="text-sm">Session Duration</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">30 mins</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl flex flex-col gap-2 opacity-50 cursor-not-allowed">
                <span className="text-sm">Target Role Focus</span>
                <div className="w-full bg-white/10 h-8 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
