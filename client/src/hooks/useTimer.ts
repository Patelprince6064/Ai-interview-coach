import { useState, useEffect, useRef } from 'react';

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (seconds <= 0) { onExpireRef.current?.(); return; }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const formatted = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const isWarning = seconds <= 300;
  const isDanger = seconds <= 60;

  return { seconds, formatted, isWarning, isDanger };
}
