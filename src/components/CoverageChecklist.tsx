import { BookOpenText, CheckCircle, Circle, Clock, ListChecks, PencilSimpleLine } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { lessons } from "../data/lessons";
import { questions } from "../data/questions";
import type { LearningObjective, StoredProgress } from "../types";

const OBJECTIVE_MASTERY_KEY = "chemtrainer-usg-objective-mastery-v1";

type StudentObjectiveStatus = "not-started" | "bezig" | "geoefend" | "beheerst";

const lessonMap = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const questionMap = new Map(questions.map((question) => [question.id, question]));

function readObjectiveMastery() {
  try {
    const stored = localStorage.getItem(OBJECTIVE_MASTERY_KEY);
    return stored ? JSON.parse(stored) as Record<string, boolean> : {};
  } catch {
    return {};
  }
}

function writeObjectiveMastery(state: Record<string, boolean>) {
  localStorage.setItem(OBJECTIVE_MASTERY_KEY, JSON.stringify(state));
}

export function deriveObjectiveStudentStatus(objective: LearningObjective, progress: StoredProgress, mastered: boolean): StudentObjectiveStatus {
  if (mastered) return "beheerst";
  const completedLessons = objective.lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
  const attempted = progress.answers.filter((answer) => objective.questionIds.includes(answer.questionId));
  const correct = attempted.filter((answer) => answer.correct).length;
  if (correct > 0 || completedLessons === objective.lessonIds.length) return "geoefend";
  if (attempted.length > 0 || completedLessons > 0) return "bezig";
  return "not-started";
}

const studentStatusMeta: Record<StudentObjectiveStatus, { label: string; Icon: typeof Circle }> = {
  "not-started": { label: "nog niet begonnen", Icon: Circle },
  "bezig": { label: "bezig", Icon: PencilSimpleLine },
  "geoefend": { label: "geoefend", Icon: Clock },
  "beheerst": { label: "beheerst", Icon: CheckCircle },
};

function questionLabel(id: string) {
  const question = questionMap.get(id);
  return question ? `${id} · ${question.question}` : id;
}

function lessonLabel(id: string) {
  const lesson = lessonMap.get(id);
  return lesson ? `${lesson.module} · ${lesson.title}` : id;
}

export function CoverageChecklist({ objective, progress, onMasteryChange }: { objective: LearningObjective; progress: StoredProgress; onMasteryChange?: (objectiveId: string, value: boolean) => void }) {
  const [mastered, setMastered] = useState(false);

  useEffect(() => {
    const mastery = readObjectiveMastery();
    setMastered(Boolean(mastery[objective.id]));
  }, [objective.id]);

  const toggleMastered = () => {
    const next = !mastered;
    const mastery = readObjectiveMastery();
    mastery[objective.id] = next;
    writeObjectiveMastery(mastery);
    setMastered(next);
    onMasteryChange?.(objective.id, next);
  };

  const studentStatus = deriveObjectiveStudentStatus(objective, progress, mastered);
  const { label, Icon } = studentStatusMeta[studentStatus];

  return <article className={`coverage-objective coverage-student-${studentStatus}`}>
    <header>
      <div>
        <span className="objective-module">{objective.module}</span>
        <span className="objective-type">{objective.type}</span>
      </div>
      <span className="coverage-status">
        <Icon size={16} weight="fill" /> {label}
      </span>
    </header>
    <h3>{objective.leerdoelTekst}</h3>
    <p className="coverage-subject"><strong>Onderwerp:</strong> {objective.onderwerp}</p>
    <div className="coverage-links">
      <div>
        <BookOpenText size={16} />
        <strong>Welke les hoort hierbij?</strong>
        <span>{objective.lessonIds.map((id) => <span key={id} className="coverage-chip">{lessonLabel(id)}</span>)}</span>
      </div>
      <div>
        <ListChecks size={16} />
        <strong>Welke vragen kan ik oefenen?</strong>
        <span>{objective.questionIds.map((id) => <span key={id} className="coverage-chip">{questionLabel(id)}</span>)}</span>
      </div>
    </div>
    <div className="coverage-student-actions">
      <label className="coverage-mastery-toggle">
        <input type="checkbox" checked={mastered} onChange={toggleMastered} />
        <span>Ik beheers dit leerdoel</span>
      </label>
      <small>{objective.notes}</small>
    </div>
  </article>;
}
