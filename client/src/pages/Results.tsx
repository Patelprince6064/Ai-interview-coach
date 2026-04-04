import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { RotateCcw, LayoutDashboard, ChevronDown } from 'lucide-react';
import ScoreRing from '@/components/interview/ScoreRing';

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { answers, roleId, roleTitle } = state || {};

  if (!answers?.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16">
      <p className="text-text2">No results to display.</p>
      <button className="btn-primary rounded-xl px-6 py-2.5" onClick={() => navigate('/roles')}>Start an Interview</button>
    </div>
  );

  const overall = Math.round(answers.reduce((s: number, a: any) => s + a.score, 0) / answers.length);
  const label = overall >= 85 ? 'Excellent' : overall >= 72 ? 'Good' : overall >= 58 ? 'Needs Work' : 'Keep Practicing';
  const labelColor = overall >= 85 ? 'text-accent bg-accent/10 border-accent/30' : overall >= 72 ? 'text-accent2 bg-accent2/10 border-accent2/30' : overall >= 58 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : 'text-accent3 bg-accent3/10 border-accent3/30';
  const msg = overall >= 85 ? "Outstanding! Your answers showed strong structure and clear results. You're well-prepared."
    : overall >= 72 ? "Solid performance. Focus on quantifying your impact and using the STAR method consistently."
    : overall >= 58 ? "You have the foundation — keep practicing with more specific examples and measurable outcomes."
    : "Don't get discouraged! Focus on the STAR method, prepare strong stories, and retry.";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="section-label mb-3">Interview Complete</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight mb-1">
          {overall >= 80 ? 'Great Performance!' : overall >= 65 ? 'Good Effort!' : 'Keep Practicing!'}
        </h1>
        <p className="text-text2 text-sm">{roleTitle} · {answers.length} questions</p>
      </div>

      {/* Score */}
      <div className="card p-10 flex flex-col items-center gap-4 mb-8">
        <ScoreRing score={overall} size={160} strokeWidth={12} />
        <span className={`badge border ${labelColor} text-sm px-5 py-1.5`}>{label}</span>
        <p className="text-text2 text-sm text-center max-w-sm leading-relaxed">{msg}</p>
      </div>

      {/* Breakdown */}
      <h2 className="font-display text-xl font-bold mb-4">Question Breakdown</h2>
      <div className="space-y-3 mb-10">
        {answers.map((a: any, i: number) => {
          const scoreColor = a.score >= 80 ? 'text-accent' : a.score >= 65 ? 'text-yellow-400' : 'text-accent3';
          const isOpen = openIndex === i;
          return (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-surface2/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs text-text3 mb-1">Q{i + 1} · {a.question.type}</p>
                  <p className="text-sm font-medium leading-snug">{a.question.text}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-display font-extrabold text-xl ${scoreColor}`}>{a.score}</span>
                  <ChevronDown className={`w-4 h-4 text-text3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-border">
                  <div className="mt-4">
                    <p className="text-xs text-text3 uppercase tracking-widest font-semibold mb-2">Your Answer</p>
                    <p className="text-sm text-text2 bg-surface2 rounded-xl p-4 leading-relaxed">{a.answerText}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text3 uppercase tracking-widest font-semibold mb-2">AI Feedback</p>
                    <p className="text-sm text-text leading-relaxed bg-surface2 rounded-xl p-4">{a.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button className="btn-outline rounded-xl flex items-center gap-2" onClick={() => navigate(`/interview/${roleId}`)}>
          <RotateCcw className="w-4 h-4" /> Retry Interview
        </button>
        <Link to="/dashboard" className="btn-primary rounded-xl flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <button className="btn-outline rounded-xl" onClick={() => navigate('/roles')}>New Role</button>
      </div>
    </div>
  );
}
