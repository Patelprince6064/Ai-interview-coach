import { Link } from 'react-router-dom';
import { BrainCircuit, Zap, Target, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { ROLES } from '@/lib/interviewData';

const features = [
  { icon: BrainCircuit, title: 'AI-Powered Feedback', desc: 'Instant, detailed feedback on structure, clarity, and impact — scored in real time.' },
  { icon: Target, title: 'Role-Specific Questions', desc: 'Curated question banks tailored to your target role, seniority level, and industry.' },
  { icon: Clock, title: 'Timed Practice Mode', desc: 'Practice under real interview pressure with countdown timers that match actual interviews.' },
  { icon: TrendingUp, title: 'Progress Analytics', desc: 'Track your improvement over sessions with detailed score history and skill breakdowns.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-20 pt-32">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(79,255,176,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,108,255,0.06) 0%, transparent 60%)'
        }} />
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-semibold tracking-widest uppercase mb-8">
          <Zap className="w-3 h-3" /> Powered by Claude AI
        </div>
        <h1 className="animate-fade-up-1 font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl mb-6">
          Master every interview<br />with your <span className="text-accent">AI coach</span>
        </h1>
        <p className="animate-fade-up-2 text-text2 text-lg max-w-xl leading-relaxed mb-10">
          Practice real questions, get instant AI feedback, and track your progress — built for job seekers who take preparation seriously.
        </p>
        <div className="animate-fade-up-3 flex flex-wrap gap-4 justify-center">
          <Link to="/roles" className="btn-primary flex items-center gap-2 rounded-xl px-8 py-3.5">
            Start Practicing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/register" className="btn-outline rounded-xl px-8 py-3.5">Create Free Account</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[['50+','Role Categories'],['98%','User Satisfaction'],['3×','Faster Preparation'],['24/7','Available Anytime']].map(([n,l]) => (
            <div key={l} className="text-center py-8 px-4 border-r border-border last:border-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r">
              <div className="font-display text-3xl font-extrabold">{n}</div>
              <div className="text-text3 text-xs mt-1 tracking-wide">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <span className="section-label">Why InterviewAI</span>
        <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3 mb-4">Everything you need<br />to land the offer</h2>
        <p className="text-text2 max-w-md mb-14 leading-relaxed">From targeted practice to real-time scoring — your complete interview preparation system.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:border-accent/30 hover:-translate-y-1 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-bold mb-2">{title}</h3>
              <p className="text-text2 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <span className="section-label">Available Roles</span>
        <h2 className="font-display text-4xl font-extrabold tracking-tight mt-3 mb-10">Pick your path</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((r) => (
            <Link key={r.id} to="/roles" className="card p-5 flex items-center gap-4 hover:border-accent/40 hover:-translate-y-1 transition-all duration-200 group">
              <span className="text-3xl">{r.emoji}</span>
              <div>
                <div className="font-display font-bold group-hover:text-accent transition-colors">{r.title}</div>
                <div className="text-text3 text-xs mt-0.5">{r.tags.join(' · ')}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-16 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 to-accent2/10 p-16 text-center">
        <h2 className="font-display text-4xl font-extrabold tracking-tight mb-4">Ready to ace your next interview?</h2>
        <p className="text-text2 mb-8">Start your first practice session in under 60 seconds — no credit card required.</p>
        <Link to="/roles" className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5">
          Choose Your Role <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
