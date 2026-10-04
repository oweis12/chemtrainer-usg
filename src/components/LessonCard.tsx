import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import type { Lesson } from "../types";

export function LessonCard({ lesson, completed, onOpen }: { lesson: Lesson; completed: boolean; onOpen: () => void }) {
  return (
    <button className="lesson-card" onClick={onOpen}>
      <span className="lesson-module">{lesson.module}</span>
      <span className="lesson-card-main">
        <strong>{lesson.title}</strong>
        <span className="lesson-card-description">{lesson.objectives[0] ?? lesson.topic}</span>
      </span>
      <span className="lesson-card-meta">
        {completed && <span className="lesson-completion"><CheckCircle size={17} weight="fill" /> Afgerond</span>}
        <span className="lesson-open-action">Open les <ArrowRight size={17} /></span>
      </span>
    </button>
  );
}
