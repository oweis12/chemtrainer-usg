import type { ModuleId, Question } from "../types";

export function topicsFor(questions: Question[], module?: ModuleId | "all") {
  const selected = module && module !== "all" ? questions.filter((question) => question.module === module) : questions;
  return [...new Set(selected.map((question) => question.topic))].sort();
}

export function skillsFor(questions: Question[], module?: ModuleId | "all", topic?: string) {
  return [...new Set(questions.filter((question) => (!module || module === "all" || question.module === module) && (!topic || topic === "all" || question.topic === topic)).map((question) => question.skill))].sort();
}

export function filterQuestions(questions: Question[], filters: { module?: ModuleId | "all"; topic?: string; skill?: string; level?: number | "all" }) {
  return questions.filter((question) =>
    (!filters.module || filters.module === "all" || question.module === filters.module) &&
    (!filters.topic || filters.topic === "all" || question.topic === filters.topic) &&
    (!filters.skill || filters.skill === "all" || question.skill === filters.skill) &&
    (!filters.level || filters.level === "all" || question.level === filters.level),
  );
}
