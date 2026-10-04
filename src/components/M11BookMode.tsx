import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import type { Lesson } from "../types";
import { m11BookChapters } from "../data/m11Book";
import { getRenderableLessonVideo } from "../data/lessonVideoRegistry";
import { LessonVideoCard } from "./content/LessonVideoCard";
import { M11LessonVisual } from "./M11LessonVisual";

interface M11BookModeProps {
  lesson: Lesson;
  completed: boolean;
  onBack: () => void;
  onComplete: () => void;
  onPractice: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export function M11BookMode({ lesson, completed, onBack, onComplete, onPractice, onSelectLesson }: M11BookModeProps) {
  const chapter = m11BookChapters.find((item) => item.lessonId === lesson.id);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  if (!chapter) return null;

  const video = getRenderableLessonVideo(lesson.videoIds);

  return (
    <main className="m11-book-page">
      <button className="m11-book-back" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Terug naar lessen
      </button>

      <header className="m11-book-header">
        <p className="m11-book-kicker">M11 · studieboek</p>
        <div className="m11-book-title-row">
          <div className="m11-book-title-copy">
            <p className="m11-book-paragraph">{chapter.paragraph}</p>
            <h1>{chapter.title}</h1>
            <p className="m11-book-goal">{chapter.goal}</p>
            <p className="m11-book-context">{chapter.contextNote}</p>
          </div>
        </div>
      </header>

      <div className="m11-book-layout">
        <aside className="m11-book-rail" aria-label="M11 hoofdstukken">
          <p className="m11-book-rail-heading">Hoofdstukken</p>
          <nav className="m11-book-rail-nav">
            {m11BookChapters.map((item) => (
              <button
                className="m11-book-rail-button"
                key={item.lessonId}
                type="button"
                aria-current={item.lessonId === chapter.lessonId ? "page" : undefined}
                onClick={() => onSelectLesson(item.lessonId)}
              >
                <span className="m11-book-rail-number">{item.paragraph}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <label className="m11-book-mobile-nav">
          <span>Hoofdstuk</span>
          <select value={chapter.lessonId} onChange={(event) => onSelectLesson(event.target.value)}>
            {m11BookChapters.map((item) => (
              <option key={item.lessonId} value={item.lessonId}>{item.paragraph} · {item.title}</option>
            ))}
          </select>
        </label>

        <article className="m11-book-reading">
          {chapter.theorySections.map((section) => (
            <section className="m11-book-theory" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {section.keyTerms && (
                <p className="m11-book-key-terms">
                  <span>Kernbegrippen</span> {section.keyTerms.join(" · ")}
                </p>
              )}
            </section>
          ))}

          <section className="m11-book-visual" aria-label="Lesvisualisatie">
            <M11LessonVisual lessonId={lesson.id} />
          </section>

          <section className="m11-book-example">
            <p className="m11-book-eyebrow">Uitgewerkt voorbeeld</p>
            <h2>{chapter.workedExample.title}</h2>
            <p className="m11-book-example-prompt">{chapter.workedExample.prompt}</p>
            <ol>
              {chapter.workedExample.steps.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
            <p className="m11-book-example-answer"><strong>Antwoord</strong> {chapter.workedExample.answer}</p>
          </section>

          <section className="m11-book-exercises">
            <div className="m11-book-section-intro">
              <p className="m11-book-eyebrow">Zelf oefenen</p>
              <h2>Oefeningen</h2>
            </div>
            <ol className="m11-book-exercise-list">
              {chapter.exercises.map((exercise, index) => (
                <li className="m11-book-exercise" key={exercise.id}>
                  <p className="m11-book-source-ref">Bronselectie: {exercise.sourceRefs.join(" · ")}</p>
                  <p className="m11-book-question">{exercise.question}</p>
                  <details className="m11-book-detail">
                    <summary>Hint</summary>
                    <p>{exercise.hint}</p>
                  </details>
                  <label className="m11-book-answer-label" htmlFor={`${exercise.id}-answer`}>Jouw uitwerking</label>
                  <textarea
                    id={`${exercise.id}-answer`}
                    rows={3}
                    value={answers[exercise.id] ?? ""}
                    onChange={(event) => setAnswers((current) => ({ ...current, [exercise.id]: event.target.value }))}
                    placeholder="Schrijf je vergelijking of redenering op…"
                  />
                  <details className="m11-book-detail">
                    <summary>{answers[exercise.id]?.trim() ? "Vergelijk met het modelantwoord" : "Toon modelantwoord"}</summary>
                    <p>{exercise.answer}</p>
                  </details>
                </li>
              ))}
            </ol>
          </section>

          <section className="m11-book-checklist">
            <p className="m11-book-eyebrow">Controleer jezelf</p>
            <h2>Na deze paragraaf kan ik…</h2>
            <ul>
              {chapter.checklist.map((item) => {
                const key = chapter.lessonId + ":" + item;
                return (
                  <li key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={Boolean(checkedItems[key])}
                        onChange={(event) => setCheckedItems((current) => ({ ...current, [key]: event.target.checked }))}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          {chapter.optionalNote && (
            <aside className="m11-book-optional">
              <h2>Scope</h2>
              <p>{chapter.optionalNote}</p>
            </aside>
          )}

          {video && (
            <section className="m11-book-video">
              <p className="m11-book-eyebrow">Extra uitleg</p>
              <h2>Bekijk één aanvullende uitleg</h2>
              <LessonVideoCard video={video} scopeNote={lesson.videoScopeNote} />
            </section>
          )}
        </article>
      </div>

      <footer className="m11-book-actions">
        <button className="m11-book-secondary-action" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          Terug naar lessen
        </button>
        <div className="m11-book-action-group">
          <button className="m11-book-secondary-action" type="button" onClick={onPractice}>
            Verder oefenen
            <ArrowRight size={17} aria-hidden="true" />
          </button>
          <button className="m11-book-complete-action" type="button" onClick={onComplete} aria-pressed={completed}>
            <CheckCircle size={18} weight={completed ? "fill" : "regular"} aria-hidden="true" />
            {completed ? "Afgerond" : "Markeer als afgerond"}
          </button>
        </div>
      </footer>
    </main>
  );
}
