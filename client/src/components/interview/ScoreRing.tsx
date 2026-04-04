interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function ScoreRing({ score, size = 120, strokeWidth = 10, showLabel = true }: ScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#4fffb0' : score >= 65 ? '#f59e0b' : '#ff6c6c';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#252a35" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute text-center">
          <div className="font-display font-extrabold" style={{ fontSize: size * 0.22, color }}>{score}</div>
          <div className="text-text3 uppercase tracking-wider" style={{ fontSize: size * 0.09 }}>Score</div>
        </div>
      )}
    </div>
  );
}
