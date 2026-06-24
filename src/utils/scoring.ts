import type { AnswerRecord, ModuleId, Question } from "../types";

export const percentage = (correct: number, total: number) => total ? Math.round((correct / total) * 100) : 0;

export function moduleScore(moduleId: ModuleId, answers: AnswerRecord[]) {
  const relevant = answers.filter((answer) => answer.module === moduleId);
  return percentage(relevant.filter((answer) => answer.correct).length, relevant.length);
}

export function topicScores(answers: AnswerRecord[]) {
  const map = new Map<string, { correct: number; total: number }>();
  answers.forEach((answer) => {
    const entry = map.get(answer.topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    entry.correct += Number(answer.correct);
    map.set(answer.topic, entry);
  });
  return [...map.entries()].map(([topic, score]) => ({ topic, ...score, percentage: percentage(score.correct, score.total) }));
}
