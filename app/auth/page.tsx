import Link from 'next/link';
import { BrainCircuit, Github } from 'lucide-react';

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full relative flex items-center justify-center font-body text-foreground overflow-hidden">
      
      {/* Fullscreen Fixed Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-3xl pointer-events-none" />
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-12 animate-fade-rise">
        
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-display cursor-pointer hover:text-accent transition-colors">
            <BrainCircuit className="w-8 h-8 text-accent" />
            AIPS
          </Link>
        </div>

        <div className="liquid-glass rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-medium text-white">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">Enter your details to access your dashboard.</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80 uppercase tracking-widest">Email address</label>
              <input 
                type="email" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-white placeholder:text-white/30"
                placeholder="name@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-white/80 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-white placeholder:text-white/30"
                placeholder="Enter password"
              />
            </div>

            {/* Link wrapper to simulate form submission going to dashboard */}
            <div className="pt-2">
              <Link href="/dashboard" className="w-full inline-block group">
                <div className="liquid-glass w-full text-center bg-white/5 border border-white/10 text-white font-medium rounded-xl px-4 py-3 hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Sign In
                </div>
              </Link>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-3 bg-transparent backdrop-blur-md text-white/50">Or continue with</span>
            </div>
          </div>

          <Link href="/auth/github" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-center gap-3 font-medium hover:bg-white/10 transition-colors cursor-pointer text-white">
            <Github className="w-5 h-5" /> Continue with GitHub
          </Link>
          
          <p className="text-center text-sm text-white/50 mt-8">
            Don&apos;t have an account? <a href="#" className="text-accent font-medium hover:underline text-white">Sign up</a>
          </p>
        </div>
      </div>
    </main>
  );
}
