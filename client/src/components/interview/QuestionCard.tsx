import { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';
import type { Question } from '@/lib/interviewData';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

const typeStyles: Record<string, string> = {
  behavioral: 'bg-accent2/10 text-accent2 border-accent2/30',
  technical: 'bg-accent/10 text-accent border-accent/30',
  situational: 'bg-accent3/10 text-accent3 border-accent3/30',
};
const diffStyles: Record<string, string> = {
  easy: 'bg-accent/10 text-accent',
  medium: 'bg-yellow-400/10 text-yellow-400',
  hard: 'bg-accent3/10 text-accent3',
};

export default function QuestionCard({ question, questionNumber, totalQuestions, onSubmit, isLoading }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);

  const handleSubmit = () => {
    if (answer.trim().length >= 20) { onSubmit(answer.trim()); setAnswer(''); setShowHints(false); }
  };

  return (
    <div className="card p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className={`badge border ${typeStyles[question.type]}`}>
          {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
        </div>
        <div className={`badge ${diffStyles[question.difficulty]}`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </div>
      </div>

      <h2 className="font-display text-xl font-bold leading-snug">{question.text}</h2>

      <textarea
        className="input min-h-[180px] resize-none"
        placeholder="Type your answer here. Use the STAR method: Situation, Task, Action, Result…"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-1.5 text-sm text-text2 hover:text-accent transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'Hide hints' : 'Show hints'}
        </button>
        <span className="text-xs text-text3">{answer.length} chars</span>
      </div>

      {showHints && (
        <ul className="space-y-2">
          {question.hints.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text2 bg-surface2 rounded-lg px-3 py-2">
              <span className="text-accent font-bold mt-0.5">→</span>{h}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSubmit}
        disabled={answer.trim().length < 20 || isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 rounded-xl py-3"
      >
        {isLoading ? (
          <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin-slow" />Evaluating…</>
        ) : (
          <><Send className="w-4 h-4" /> Submit Answer</>
        )}
      </button>
    </div>
  );
}
