interface ProgressBarProps {
  value: number;
  tone?: "blue" | "green" | "amber" | "red";
  label?: string;
  compact?: boolean;
}

export function ProgressBar({ value, tone = "blue", label, compact = false }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress-wrap ${compact ? "progress-compact" : ""}`}>
      <div className="progress-track" aria-label={label ? `${label}: ${safeValue}%` : `${safeValue}%`}>
        <div className={`progress-fill progress-${tone}`} style={{ width: `${safeValue}%` }} />
      </div>
      {!compact && <span className="progress-value">{safeValue}%</span>}
    </div>
  );
}
