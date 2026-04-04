import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import api from '@/lib/api';

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'progress' | 'skills' | 'roles'>('progress');

  useEffect(() => {
    api.get('/sessions/analytics').then(({ data }) => setData(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const tabs = [{ key: 'progress', label: 'Progress' }, { key: 'skills', label: 'Skills' }, { key: 'roles', label: 'By Role' }];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pt-28">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-text2 mt-1">Deep dive into your performance trends</p>
      </div>

      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-surface text-accent border border-accent/30' : 'text-text2 hover:text-text hover:bg-surface'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-20 text-center text-text3">Loading analytics…</div>
      ) : !data ? (
        <div className="card p-20 text-center">
          <p className="text-text2 mb-4">No data yet. Complete your first interview to see analytics!</p>
        </div>
      ) : (
        <div className="card p-6">
          {tab === 'progress' && (
            <>
              <h3 className="font-display font-bold mb-1">Score Over Time</h3>
              <p className="text-text2 text-sm mb-6">Your performance across recent sessions</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.scoreHistory.map((s: any) => ({ ...s, date: new Date(s.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252a35" />
                  <XAxis dataKey="date" stroke="#555d75" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#555d75" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#111318', border: '1px solid #252a35', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="score" stroke="#4fffb0" strokeWidth={2} dot={{ r: 4, fill: '#4fffb0' }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === 'skills' && (
            <>
              <h3 className="font-display font-bold mb-1">Skill Breakdown</h3>
              <p className="text-text2 text-sm mb-6">Average score by question type</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.skillBreakdown.map((s: any) => ({ name: s.type.charAt(0).toUpperCase() + s.type.slice(1), score: s.avg }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252a35" />
                  <XAxis dataKey="name" stroke="#555d75" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#555d75" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#111318', border: '1px solid #252a35', borderRadius: 8 }} />
                  <Bar dataKey="score" fill="#7c6cff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-6">
                {data.skillBreakdown.map((s: any) => (
                  <div key={s.type} className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{s.type}:</span>
                    <span className={`badge text-xs ${s.avg >= 75 ? 'bg-accent/10 text-accent' : 'bg-surface2 text-text2'}`}>{s.avg}/100</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === 'roles' && (
            <>
              <h3 className="font-display font-bold mb-1">Performance by Role</h3>
              <p className="text-text2 text-sm mb-6">Average score per role practiced</p>
              <div className="space-y-4">
                {data.roleBreakdown.map((r: any) => (
                  <div key={r.role}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text2">{r.role} <span className="text-text3">({r.count} session{r.count > 1 ? 's' : ''})</span></span>
                      <span className="font-semibold">{r.avg}/100</span>
                    </div>
                    <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full transition-all duration-700" style={{ width: `${r.avg}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
