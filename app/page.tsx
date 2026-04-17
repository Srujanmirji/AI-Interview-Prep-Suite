'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  FileText, Target, MessageSquare, Mic, PhoneCall, Video, 
  Activity, Map, BarChart, LineChart, Trophy, Bot, 
  UserCheck, Building, Lightbulb, PenTool, Globe, 
  BrainCircuit, Briefcase, Cpu, ChevronDown, Github
} from 'lucide-react';
import { COMPLETE_FEATURES } from '@/lib/featuresData';
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function LandingPage() {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { scrollY } = useScroll();
  // Smoothly fade in a heavy blur and dark tint over the first 800px of scroll
  const blurOpacity = useTransform(scrollY, [0, 800], [0, 1]);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Note: Assuming 'about' section doesn't exist yet, if it did, we'd add an id to it like features.
  // For now, these buttons will just scroll to top or features.

  return (
    <main className="relative w-full bg-background font-body text-foreground selection:bg-white/20">
      
      {/* Fullscreen Fixed Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
        {/* Dynamic Glassy Background Overlay tied to scroll */}
        <motion.div 
          style={{ opacity: blurOpacity }}
          className="absolute inset-0 bg-background/60 backdrop-blur-3xl pointer-events-none"
        />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Slide 1: Hero Section */}
        <section id="home" className="relative min-h-screen w-full flex flex-col pt-6">
          {/* Navigation Bar */}
          <nav className="relative z-10 flex flex-row items-center justify-between px-8 py-2 max-w-7xl w-full mx-auto">
            <div className="text-3xl tracking-tight font-display text-foreground">
              Velorah<sup className="text-xs">®</sup>
            </div>
            <div className="hidden md:flex flex-row items-center gap-8">
              <button onClick={scrollToHero} className="text-sm text-foreground hover:text-foreground transition-colors cursor-pointer">Home</button>
              <button onClick={scrollToFeatures} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Features</button>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">About</button>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Login
              </Link>
              <Link href="/auth" className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground cursor-pointer hover:scale-[1.03] transition-transform flex items-center gap-2 border border-white/5">
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-40">
            <h1 className="w-full flex items-center justify-center animate-fade-rise">
              <GooeyText 
                texts={["Your Career, Mastered.", "Your Future, Defined.", "Your Success, Guaranteed.", "Your Potential, Realized.", "Your Dreams, Attained."]}
                className="w-full h-auto flex items-center justify-center"
                textClassName="text-4xl sm:text-6xl md:text-7xl font-normal font-display text-foreground leading-tight text-center"
              />
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
              AI-driven preparation for the modern job market. Optimize your resume, master your interviews, and land the offer.
            </p>
            
            <div className="flex flex-col items-center gap-6 mt-12 animate-fade-rise-delay-2 w-full sm:w-auto">
              <div className="flex flex-col gap-4">
                <Link href="/auth" className="w-72 inline-block">
                  <LiquidButton className="w-full">
                    <span className="flex items-center justify-center w-full">
                      Login
                    </span>
                  </LiquidButton>
                </Link>
                <button 
                  onClick={() => setShowSignup(!showSignup)} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  New here? <span className="underline">{showSignup ? 'Already have an account?' : 'Create your account'}</span>
                </button>
              </div>

              {/* Revealable Signup Section */}
              <AnimatePresence>
                {showSignup && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Link href="/auth" className="w-72 inline-block">
                      <LiquidButton className="w-full">
                        <span className="flex items-center justify-center w-full">
                          Sign up
                        </span>
                      </LiquidButton>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <button onClick={scrollToFeatures} className="absolute bottom-10 animate-bounce text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>
        </section>

        {/* Slide 2: Features Section */}
        <section id="features" className="relative min-h-screen w-full py-32 px-6 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-20 animate-fade-rise">
              <h2 className="text-4xl md:text-6xl font-display font-medium mb-6">The Complete Toolkit.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">An advanced unified platform providing every tool you need to confidently secure your dream offer.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-rise-delay max-w-screen-2xl mx-auto">
              <AnimatePresence>
                {(showAllFeatures ? COMPLETE_FEATURES : COMPLETE_FEATURES.slice(0, 8)).map((feat, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    key={feat.title} 
                    className="liquid-glass rounded-3xl group hover:bg-white/5 transition-colors box-border border-white/5"
                  >
                    <Link href={feat.href} className="p-8 block w-full h-full">
                    <div className="mb-6 p-3 bg-white/5 w-fit rounded-2xl group-hover:bg-white/10 transition-colors">
                      {feat.icon}
                    </div>
                    <h3 className="text-xl font-display font-medium mb-3">{feat.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feat.description}
                    </p>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-16 flex justify-center animate-fade-rise-delay-2">
              <button 
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-foreground hover:scale-[1.03] hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
              >
                {showAllFeatures ? 'Show Less' : 'More Features'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllFeatures ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
