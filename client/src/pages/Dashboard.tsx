import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, PlayCircle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/lib/interviewData';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sessions').then(({ data }) => setSessions(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const best = sessions.length ? Math.max(...sessions.map((s) => s.overallScore)) : 0;
  const trend = sessions.length >= 2
    ? Math.round(sessions.slice(0, 3).reduce((s, x) => s + x.overallScore, 0) / Math.min(3, sessions.length))
      - Math.round(sessions.slice(3).reduce((s, x) => s + x.overallScore, 0) / Math.max(1, sessions.slice(3).length))
    : null;

  const stats = [
    { icon: PlayCircle, label: 'Sessions Completed', value: user?.totalSessions ?? 0 },
    { icon: Star, label: 'Average Score', value: user?.averageScore ? `${user.averageScore}` : '—' },
    { icon: TrendingUp, label: 'Best Score', value: best || '—' },
    { icon: Clock, label: 'Score Trend', value: trend !== null ? `${trend >= 0 ? '+' : ''}${trend}` : '—' },
  ];

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pt-28">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-text2 mt-1">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <Link to="/roles" className="btn-primary rounded-xl flex items-center gap-2 px-5 py-2.5">
          New Interview <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5">
            <Icon className="w-5 h-5 text-accent mb-3" />
            <div className="font-display text-3xl font-extrabold">{value}</div>
            <div className="text-text3 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Recent Sessions */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-display font-bold">Recent Sessions</h3>
            <p className="text-text2 text-xs mt-0.5">Your latest interview runs</p>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="py-10 text-center text-text3 text-sm">Loading…</div>
            ) : sessions.length === 0 ? (
              <div className="py-10 text-center text-text3 text-sm">No sessions yet. Complete your first interview!</div>
            ) : (
              sessions.slice(0, 6).map((s, i) => {
                const c = s.overallScore >= 80 ? 'text-accent bg-accent/10' : s.overallScore >= 65 ? 'text-yellow-400 bg-yellow-400/10' : 'text-accent3 bg-accent3/10';
                return (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-surface2/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{s.roleTitle}</div>
                      <div className="text-text3 text-xs mt-0.5">{timeAgo(s.completedAt)}</div>
                    </div>
                    <span className={`font-display font-bold text-sm px-3 py-1 rounded-lg ${c}`}>{s.overallScore}/100</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Suggested Roles */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-bold">Practice Next</h3>
            <p className="text-text2 text-xs mt-0.5">Recommended for you</p>
          </div>
          <div className="divide-y divide-border">
            {ROLES.slice(0, 5).map((r) => (
              <Link key={r.id} to={`/interview/${r.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface2/50 transition-colors group">
                <span className="text-2xl">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm group-hover:text-accent transition-colors">{r.title}</div>
                  <div className="text-text3 text-xs">{r.questions.length}q · {r.duration}min</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text3 group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
