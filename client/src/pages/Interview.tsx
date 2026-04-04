import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { ROLES } from '@/lib/interviewData';
import { useAuth } from '@/context/AuthContext';
import QuestionCard from '@/components/interview/QuestionCard';
import Timer from '@/components/interview/Timer';

export default function Interview() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = ROLES.find((r) => r.id === roleId);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  if (!role) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16">
      <AlertTriangle className="w-10 h-10 text-accent3" />
      <p className="font-display text-xl font-bold">Role not found</p>
      <button className="btn-primary rounded-xl px-6 py-2.5" onClick={() => navigate('/roles')}>Browse Roles</button>
    </div>
  );

  const startSession = async () => {
    if (user) {
      try {
        const { data } = await api.post('/sessions', { roleId: role.id, roleTitle: role.title });
        setSessionId(data.data._id);
      } catch { /* proceed without persisting */ }
    }
    setSessionStarted(true);
  };

  const handleSubmit = async (answerText: string) => {
    const question = role.questions[currentIndex];
    setIsLoading(true);
    let score = 65, feedback = 'Good answer.';

    if (user && sessionId) {
      try {
        const { data } = await api.post(`/sessions/${sessionId}/answers`, {
          questionText: question.text, questionType: question.type,
          difficulty: question.difficulty, answerText, duration: 60,
        });
        score = data.data.score;
        feedback = data.data.feedback;
      } catch {
        const result = await scoreWithClaudeClient(answerText, question.text, question.type, question.difficulty);
        score = result.score;
        feedback = result.feedback;
      }
    } else {
      // Guest mode — score directly via Claude API from client
      const result = await scoreWithClaudeClient(answerText, question.text, question.type, question.difficulty);
      score = result.score;
      feedback = result.feedback;
    }

    const newAnswers = [...answers, { question, answerText, score, feedback }];
    setAnswers(newAnswers);
    setIsLoading(false);

    if (currentIndex + 1 >= role.questions.length) {
      if (user && sessionId) {
        try { await api.put(`/sessions/${sessionId}/complete`, { totalDuration: role.duration * 60 }); } catch {}
      }
      navigate('/results', { state: { answers: newAnswers, roleId: role.id, roleTitle: role.title } });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const endEarly = async () => {
    if (user && sessionId && answers.length > 0) {
      try { await api.put(`/sessions/${sessionId}/complete`, { totalDuration: (role.duration * 60) }); } catch {}
    }
    if (answers.length > 0) navigate('/results', { state: { answers, roleId: role.id, roleTitle: role.title } });
    else navigate('/roles');
  };

  if (!sessionStarted) return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="card p-10 max-w-md w-full text-center space-y-5">
        <div className="text-5xl">{role.emoji}</div>
        <h1 className="font-display text-2xl font-extrabold">{role.title} Interview</h1>
        <p className="text-text2 text-sm leading-relaxed">{role.questions.length} questions · {role.duration} minutes · AI-scored feedback after each answer</p>
        <div className="flex flex-col gap-3 pt-2">
          <button className="btn-primary rounded-xl py-3" onClick={startSession}>Begin Interview →</button>
          <button className="btn-ghost" onClick={() => navigate('/roles')}>← Choose another role</button>
        </div>
      </div>
    </div>
  );

  const progress = (currentIndex / role.questions.length) * 100;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm text-text2 mb-2">
              <span>Question {currentIndex + 1} of {role.questions.length}</span>
              <span>{role.title}</span>
            </div>
            <div className="h-1 bg-surface2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <QuestionCard
            question={role.questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={role.questions.length}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-text3 uppercase tracking-widest font-semibold mb-2">Time Remaining</p>
            <Timer durationMinutes={role.duration} onExpire={endEarly} />
          </div>
          <div className="card p-5 space-y-3">
            <p className="text-xs text-text3 uppercase tracking-widest font-semibold">💡 Hints</p>
            {role.questions[currentIndex].hints.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-text2">
                <span className="text-accent font-bold mt-0.5">→</span>{h}
              </div>
            ))}
          </div>
          <button onClick={endEarly} className="w-full border border-border text-accent3 text-sm rounded-xl py-2.5 hover:bg-accent3/5 transition-colors">
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}

// Score answer using Claude API directly from client (guest mode / fallback)
async function scoreWithClaudeClient(
  answerText: string,
  questionText: string,
  questionType: string,
  difficulty: string
): Promise<{ score: number; feedback: string }> {
  const prompt = `You are an expert interview coach. Evaluate the following interview answer and return a JSON object.

Question: ${questionText}
Question Type: ${questionType}
Difficulty: ${difficulty}
Candidate's Answer: ${answerText}

Score the answer from 0 to 100 based on:
- Structure and clarity (does it follow STAR or similar framework?)
- Relevance to the question
- Specificity (concrete examples, metrics, outcomes)
- Communication quality
- Depth appropriate to difficulty level

Respond with ONLY a valid JSON object, no markdown:
{"score": <integer 0-100>, "feedback": "<2-4 sentences of specific, actionable coaching feedback>"}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const score = Math.min(100, Math.max(0, Math.round(Number(parsed.score))));
    const feedback = String(parsed.feedback || '').trim() || fallbackFeedback(answerText, questionType, score);
    return { score, feedback };
  } catch {
    const score = fallbackScore(answerText, difficulty);
    return { score, feedback: fallbackFeedback(answerText, questionType, score) };
  }
}

function fallbackScore(text: string, diff: string) {
  let base = 55 + Math.random() * 12;
  const words = text.trim().split(/\s+/).length;
  if (words > 120) base += 10; else if (words > 70) base += 5;
  const keys = ['situation','task','action','result','outcome','achieved','implemented','led','solved','increased','reduced','improved'];
  base += keys.filter((w) => text.toLowerCase().includes(w)).length * 2.5;
  if (diff === 'hard') base -= 6; if (diff === 'easy') base += 6;
  return Math.min(100, Math.max(28, Math.round(base)));
}

function fallbackFeedback(text: string, type: string, score: number) {
  const p = [];
  if (score >= 82) p.push('Strong answer with clear structure and compelling specifics.');
  else if (score >= 68) p.push('Good answer. A few targeted refinements would make it stand out.');
  else p.push('Your answer shows potential but needs deeper structure and concrete examples.');
  if (text.trim().split(/\s+/).length < 60) p.push('Try to expand further — aim for 100–150 words.');
  if (!text.toLowerCase().includes('result') && !text.toLowerCase().includes('outcome'))
    p.push('Always close with the quantifiable result to complete the STAR framework.');
  return p.join(' ');
}
