import { BookOpenText, ClipboardText, Flask, ListChecks, Target, TrendDown } from "@phosphor-icons/react";
import { lessons, modules } from "../data/lessons";
import type { AppPage, StoredProgress } from "../types";
import { moduleScore, topicScores } from "../utils/scoring";
import { ModuleCard } from "../components/ModuleCard";
import { ProgressBar } from "../components/ProgressBar";

export function Home({ progress, onNavigate, onContinueLearning }: { progress: StoredProgress; onNavigate: (page: AppPage) => void; onContinueLearning: (lessonId: string | null) => void }) {
  const weakTopics = topicScores(progress.answers)
    .filter((entry) => entry.total >= 1 && entry.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 4);
  const correctAnswers = progress.answers.filter((answer) => answer.correct).length;
  const totalAnswers = progress.answers.length;
  const accuracy = totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : null;
  const nextLesson = lessons.find((lesson) => !progress.completedLessons.includes(lesson.id));

  return (
    <div className="page-home">
      <section className="home-hero">
        <div className="home-lead">
          <span className="section-kicker">{nextLesson ? "Volgende les" : "Studieoverzicht"}</span>
          <h1>{nextLesson ? nextLesson.title : "Je hebt alle lessen afgerond"}</h1>
          <p>{nextLesson ? "Ga verder met de uitleg en voorbeelden. Je kunt ook meteen oefenen." : "Bekijk een les opnieuw of oefen gericht met examenvragen."}</p>
          <div className="home-primary-actions">
            <button className="primary-button" onClick={() => onContinueLearning(nextLesson?.id ?? null)}><BookOpenText size={19} /> {nextLesson ? "Ga verder" : "Bekijk de lessen"}</button>
            <button className="secondary-button" onClick={() => onNavigate("practice")}><ListChecks size={19} /> Start met oefenen</button>
          </div>
        </div>
        <aside className="home-overview" aria-label="Jouw voortgang">
          <h2>Jouw voortgang</h2>
          <div><span>Oefenvragen gemaakt</span><strong>{totalAnswers}</strong></div>
          <div><span>Goed beantwoord</span><strong>{accuracy === null ? "Nog geen vragen" : accuracy + "%"}</strong></div>
          <div><span>Open fouten</span><strong>{progress.mistakes.length}</strong></div>
          <button className="text-link" onClick={() => onNavigate("mistakes")}>
            Foutenlog bekijken <span>({progress.mistakes.length})</span> →
          </button>
        </aside>
      </section>

      <section className="section-block module-progress-section">
        <div className="section-title-row">
          <div><span className="section-kicker">Je oefenresultaten</span><h2>Modulevoortgang</h2></div>
          <span className="paper-note">Gebaseerd op je gemaakte vragen</span>
        </div>
        <div className="module-grid">
          {modules.map((module) => {
            const attempts = progress.answers.filter((answer) => answer.module === module.id).length;
            return (
              <ModuleCard
                key={module.id}
                module={module}
                attempts={attempts}
                score={moduleScore(module.id, progress.answers)}
                onOpen={() => onNavigate("learn")}
              />
            );
          })}
        </div>
      </section>

      <section className="home-bottom-grid">
        <div className="weak-list">
          <div className="section-title-row">
            <div><span className="section-kicker">Op basis van je antwoorden</span><h2>Onderwerpen om te herhalen</h2></div>
            <TrendDown size={23} className="red-text" aria-hidden="true" />
          </div>
          {weakTopics.length ? weakTopics.map((entry) => (
            <div className="weak-row" key={entry.topic}>
              <div><strong>{entry.topic}</strong><small>{entry.total} {entry.total === 1 ? "vraag" : "vragen"} gemaakt</small></div>
              <ProgressBar value={entry.percentage} tone="red" compact />
              <span className="weak-percent">{entry.percentage}%</span>
            </div>
          )) : (
            <div className="empty-note">
              <Target size={22} />
              <p>Na een paar oefenvragen zie je hier welke onderwerpen extra aandacht vragen.</p>
            </div>
          )}
        </div>

        <div className="mode-chooser">
          <div><span className="section-kicker">Oefenen en toetsen</span><h2>Kies je aanpak</h2></div>
          <button className="mode-button mode-practice" onClick={() => onNavigate("practice")}>
            <ListChecks size={22} />
            <span><strong>Oefenen</strong><small>Gericht per onderwerp en niveau</small></span>
            <span aria-hidden="true">→</span>
          </button>
          <button className="mode-button mode-test" onClick={() => onNavigate("test")}>
            <ClipboardText size={22} />
            <span><strong>Toetsmodus</strong><small>Maak een toets en bekijk feedback na afloop</small></span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <div className="exam-tip">
        <Flask size={20} weight="duotone" />
        <div><strong>Examentip</strong><p>Schrijf bij een berekening eerst de formule op. Zet volumes om naar liter en controleer of de eenheid van je antwoord klopt.</p></div>
      </div>
    </div>
  );
}
