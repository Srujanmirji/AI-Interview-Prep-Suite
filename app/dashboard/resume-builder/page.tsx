'use client';

import React, { useState } from 'react';
import { FileText, Wand2, Download, Plus, CheckCircle2 } from 'lucide-react';

export default function ResumeBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [firstName, setFirstName] = useState('Sai');
  const [lastName, setLastName] = useState('Doe');
  const [role, setRole] = useState('Senior Frontend Engineer');
  const [experience, setExperience] = useState('Developed scalable React applications...');
  const [skills, setSkills] = useState('React, TypeScript, Next.js, Node.js');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, role, experience, skills })
      });
      const data = await res.json();
      if (data && !data.error) {
        setResult(data);
      } else {
        console.error("API returned error:", data.error);
        alert("Failed to generate resume. Please check console.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-rise max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-medium">AI Resume Builder</h1>
        <p className="text-muted-foreground mt-1">Generate an ATS-friendly resume tailored to your target role.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Form */}
        <div className="liquid-glass p-6 rounded-2xl border border-white/5">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-accent"/> Personal Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
              </div>
              <input type="text" required value={role} onChange={e => setRole(e.target.value)} placeholder="Target Role (e.g. Senior Frontend Engineer)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Experience</h3>
                <button type="button" className="text-xs text-accent hover:underline flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
              </div>
              <div className="bg-background p-4 rounded-lg border border-border space-y-3">
                <textarea rows={5} required value={experience} onChange={e => setExperience(e.target.value)} className="w-full bg-transparent resize-none text-sm text-muted-foreground focus:outline-none focus:text-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Skills (comma separated)</h3>
              <textarea rows={2} required value={skills} onChange={e => setSkills(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>

            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI is crafting your resume...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" /> Generate Magic Resume
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview / Result Area */}
        <div className="bg-secondary/50 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col">
          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>Your optimized resume preview will appear here.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-6 animate-fade-rise">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-green-400 font-medium">
                  <CheckCircle2 className="w-5 h-5"/> ATS Score: {result.atsScore || 95}/100
                </div>
                <button className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors" onClick={() => alert("PDF Download coming soon!")}>
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>

              {/* Dynamic Resume Preview */}
              <div className="flex-1 bg-white p-6 rounded-lg text-black font-sans shadow-lg overflow-y-auto aspect-[1/1.4]">
                <h1 className="text-2xl font-bold border-b pb-2 mb-4">{result.name}</h1>
                <h2 className="text-sm tracking-widest text-gray-500 uppercase mb-4">{result.role}</h2>
                
                <h3 className="font-bold text-sm mt-6 mb-2 border-b pb-1">EXPERIENCE</h3>
                {result.experience?.map((exp: any, i: number) => (
                  <div className="mb-4" key={i}>
                    <div className="flex justify-between font-bold text-sm">
                      <span>{exp.company}</span>
                      <span>{exp.date}</span>
                    </div>
                    <p className="text-sm italic text-gray-600 mb-1">{exp.title}</p>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
                      {exp.bullets?.map((bullet: string, j: number) => (
                        <li key={j}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <h3 className="font-bold text-sm mt-6 mb-2 border-b pb-1">SKILLS</h3>
                <p className="text-sm text-gray-800">
                  {Array.isArray(result.skills) ? result.skills.join(', ') : result.skills}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
