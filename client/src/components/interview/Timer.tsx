import { Clock } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';

interface TimerProps { durationMinutes: number; onExpire?: () => void; }

export default function Timer({ durationMinutes, onExpire }: TimerProps) {
  const { formatted, isWarning, isDanger } = useTimer(durationMinutes * 60, onExpire);
  return (
    <div className={`flex items-center gap-2 font-display font-bold text-2xl px-4 py-3 rounded-xl bg-surface2 ${isDanger ? 'text-accent3 animate-[pulse_1s_ease_infinite]' : isWarning ? 'text-yellow-400' : 'text-text'}`}>
      <Clock className="w-5 h-5" />
      {formatted}
    </div>
  );
}
