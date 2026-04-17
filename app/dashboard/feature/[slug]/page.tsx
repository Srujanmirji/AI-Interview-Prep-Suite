import React from 'react';
import { Settings, PlayCircle, Layers, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FeatureChat from './FeatureChat';

export default async function FeaturePlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="space-y-6 animate-fade-rise max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <Link href="/" className="text-sm text-accent hover:underline flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-medium">{title}</h1>
          <p className="text-muted-foreground mt-1">Interactive generative environment for {title.toLowerCase()}.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Main UI Area */}
        <div className="lg:col-span-2 relative flex flex-col">
          <FeatureChat title={title} />
        </div>

        {/* Sidebar Analytics Placeholder */}
        <div className="space-y-6 flex flex-col">
          <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex-1">
            <h3 className="font-medium mb-4 flex items-center gap-2 text-muted-foreground">
              <Settings className="w-4 h-4" /> Module Status
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                <span className="text-sm">AI Engine</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/20">Online</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                <span className="text-sm">Latency</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">~1.2s</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl flex flex-col gap-2">
                <span className="text-sm">Context Tracking</span>
                <div className="w-full bg-accent/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-accent w-1/4 h-full rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
