import Link from 'next/link';
import { BrainCircuit, Github } from 'lucide-react';

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full bg-background flex flex-col md:flex-row font-body text-foreground">
      
      {/* Left side info panel */}
      <div className="hidden md:flex flex-1 bg-secondary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 radar-grid opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-display cursor-pointer hover:text-accent transition-colors">
            <BrainCircuit className="w-8 h-8 text-accent" />
            AIPS
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-display font-medium mb-6">Master your interview.</h2>
          <p className="text-muted-foreground text-lg mb-8">Join thousands of candidates who landed roles at top tech companies using our AI-powered simulator.</p>
          <div className="flex flex-row space-x-2">
             <div className="h-1 w-12 bg-accent rounded-full"/>
             <div className="h-1 w-4 bg-white/20 rounded-full"/>
             <div className="h-1 w-4 bg-white/20 rounded-full"/>
          </div>
        </div>
      </div>

      {/* Right side Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 relative">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-display font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Enter your details to access your dashboard.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <input 
                type="email" 
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter password"
              />
            </div>

            {/* In a real app this would trigger auth, we link to dashboard for demo */}
            <Link href="/dashboard" className="block w-full text-center bg-foreground text-background font-medium rounded-lg px-4 py-3 hover:bg-white/90 transition-colors">
              Sign In
            </Link>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Link href="/dashboard" className="w-full liquid-glass rounded-lg px-4 py-3 flex items-center justify-center gap-3 font-medium hover:bg-white/5 transition-colors border border-border cursor-pointer">
            <span className="text-xl">G</span> Google
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <a href="#" className="text-accent font-medium hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </main>
  );
}
