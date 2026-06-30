import { Sparkle, TrendUp } from "@phosphor-icons/react";

interface PointsBadgeProps {
  points: number;
  level: number;
  streakDays: number;
  onOpenRewards: () => void;
}

export function PointsBadge({ points, level, streakDays, onOpenRewards }: PointsBadgeProps) {
  return (
    <button className="points-badge" onClick={onOpenRewards} aria-label="Open beloningen en shop">
      <span>
        <Sparkle size={16} weight="duotone" />
        <strong>{points}</strong>
        <small>punten</small>
      </span>
      <span>
        <TrendUp size={16} weight="duotone" />
        <strong>Level {level}</strong>
        <small>{streakDays}-daagse streak</small>
      </span>
    </button>
  );
}
