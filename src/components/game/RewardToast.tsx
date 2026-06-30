import { Sparkle } from "@phosphor-icons/react";
import { useEffect } from "react";

export interface RewardToastMessage {
  id: string;
  label: string;
  points: number;
}

interface RewardToastProps {
  toasts: RewardToastMessage[];
  onDismiss: (id: string) => void;
}

export function RewardToast({ toasts, onDismiss }: RewardToastProps) {
  useEffect(() => {
    if (!toasts.length) return undefined;
    const timers = toasts.map((toast) => window.setTimeout(() => onDismiss(toast.id), 3200));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [onDismiss, toasts]);

  if (!toasts.length) return null;

  return (
    <div className="reward-toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className="reward-toast" key={toast.id}>
          <Sparkle size={18} weight="duotone" />
          <div>
            <strong>{toast.points > 0 ? `+${toast.points} punten` : toast.label}</strong>
            <p>{toast.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
