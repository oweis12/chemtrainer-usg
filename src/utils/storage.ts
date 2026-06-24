import type { StoredProgress } from "../types";

const KEY = "chemtrainer-usg-progress-v1";

const initialProgress: StoredProgress = { completedLessons: [], answers: [], mistakes: [], theme: "light" };

export function readProgress(): StoredProgress {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? { ...initialProgress, ...JSON.parse(stored) } : initialProgress;
  } catch {
    return initialProgress;
  }
}

export function writeProgress(progress: StoredProgress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}
