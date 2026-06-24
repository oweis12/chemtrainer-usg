import { ArrowRight, CheckCircle, Clock } from "@phosphor-icons/react";
import type { Lesson } from "../types";

export function LessonCard({ lesson, completed, onOpen }: { lesson: Lesson; completed: boolean; onOpen: () => void }) {
  return (
    <button className="lesson-card" onClick={onOpen}>
      <span className="lesson-module">{lesson.module}</span>
      <div className="lesson-card-main">
        <h3>{lesson.title}</h3>
        <p>{lesson.objectives.slice(0, 2).join(" · ")}</p>
      </div>
      <div className="lesson-card-meta">
        {completed ? <span className="done-stamp"><CheckCircle size={17} weight="fill" /> afgerond</span> : <span><Clock size={16} /> {lesson.duration}</span>}
        <ArrowRight size={18} />
      </div>
    </button>
  );
}
