import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import { ROLES } from '@/lib/interviewData';

export default function RoleSelection() {
  const navigate = useNavigate();
  const categories = [...new Set(ROLES.map((r) => r.tags[0]))];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pt-28">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Choose Your Role</h1>
        <p className="text-text2 mt-2">Select the role you're interviewing for — we'll load the right questions.</p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text3 mb-5">{cat}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.filter((r) => r.tags[0] === cat).map((role) => (
              <div
                key={role.id}
                onClick={() => navigate(`/interview/${role.id}`)}
                className="card p-6 cursor-pointer group hover:border-accent/40 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl mb-4">{role.emoji}</div>
                <h3 className="font-display font-bold text-lg mb-1 group-hover:text-accent transition-colors">{role.title}</h3>
                <p className="text-text2 text-sm leading-relaxed mb-4">{role.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {role.tags.map((t) => (
                    <span key={t} className="badge bg-surface2 text-text2 border border-border text-xs">{t}</span>
                  ))}
                  <span className="badge bg-surface2 text-text2 border border-border text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{role.duration}min
                  </span>
                  <span className="badge bg-surface2 text-text2 border border-border text-xs flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />{role.questions.length}q
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
