import { initialTitrationLabProgress } from "../features/titrationLab/titrationEngine";
import type { StoredProgress, TitrationLabProgress } from "../types";

const KEY = "chemtrainer-usg-progress-v1";
const TITRATION_LAB_KEY = "chemtrainer-usg-titrationlab-v1";

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

export function readTitrationLabProgress(): TitrationLabProgress {
  try {
    const stored = localStorage.getItem(TITRATION_LAB_KEY);
    return stored ? { ...initialTitrationLabProgress, ...JSON.parse(stored) } : initialTitrationLabProgress;
  } catch {
    return initialTitrationLabProgress;
  }
}

export function writeTitrationLabProgress(progress: TitrationLabProgress) {
  localStorage.setItem(TITRATION_LAB_KEY, JSON.stringify(progress));
}
