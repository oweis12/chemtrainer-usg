import { BookOpenText, ClipboardText, Flask, ListChecks, Target, TrendDown, WarningCircle } from "@phosphor-icons/react";
import { modules } from "../data/lessons";
import type { AppPage, StoredProgress } from "../types";
import { moduleScore, topicScores } from "../utils/scoring";
import { ModuleCard } from "../components/ModuleCard";
import { ProgressBar } from "../components/ProgressBar";

export function Home({ progress, onNavigate }: { progress: StoredProgress; onNavigate: (page: AppPage) => void }) {
  const weakTopics = topicScores(progress.answers).filter((entry) => entry.total >= 1 && entry.percentage < 70).sort((a, b) => a.percentage - b.percentage).slice(0, 4);
  const done = progress.answers.filter((answer) => answer.correct).length;
  const overall = progress.answers.length ? Math.round((done / progress.answers.length) * 100) : 0;

  return (
    <div className="page-home">
      <section className="home-hero">
        <div><span className="section-kicker">Jouw studiefocus deze week</span><h1>Werk aan je zwakke onderwerpen en bereid je voor op de toets.</h1><p>Begin met een les, oefen gericht en gebruik je fouten als studieplan. Rustig, stapsgewijs, toetsklaar.</p></div>
        <aside className="study-overview"><h2>Studieoverzicht</h2><div><span>Gemaakte vragen</span><strong>{progress.answers.length}</strong></div><div><span>Beheersing</span><strong className="good-text">{overall}%</strong></div><div><span>Open fouten</span><strong className="warn-text">{progress.mistakes.length}</strong></div><button className="text-link" onClick={() => onNavigate("mistakes")}>Bekijk je foutenlog →</button></aside>
      </section>

      <section className="section-block"><div className="section-title-row"><div><span className="section-kicker">Module-voortgang</span><h2>Modules 4–10</h2></div><span className="paper-note">Voortgang groeit met gemaakte vragen</span></div><div className="module-grid">{modules.map((module) => { const attempts = progress.answers.filter((answer) => answer.module === module.id).length; return <ModuleCard key={module.id} module={module} attempts={attempts} score={moduleScore(module.id, progress.answers)} onOpen={() => onNavigate("learn")} />; })}</div></section>

      <section className="home-bottom-grid">
        <div className="weak-list panel-lined"><div className="section-title-row"><div><span className="section-kicker">Zwakke onderwerpen</span><h2>Herhaal met prioriteit</h2></div><TrendDown size={27} className="red-text" /></div>{weakTopics.length ? weakTopics.map((entry, index) => <div className="weak-row" key={entry.topic}><span className="weak-number">{index + 1}</span><div><strong>{entry.topic}</strong><small>{entry.total} gemaakte {entry.total === 1 ? "vraag" : "vragen"}</small></div><ProgressBar value={entry.percentage} tone="red" compact /><span className="weak-percent">{entry.percentage}%</span></div>) : <div className="empty-note"><Target size={24} /><p>Maak een paar oefenvragen; hier verschijnt dan jouw persoonlijke herhaalplan.</p></div>}</div>
        <div className="mode-chooser"><span className="section-kicker">Kies je studiemodus</span><button className="mode-button mode-learn" onClick={() => onNavigate("learn")}><BookOpenText size={28} /><span><strong>Leren</strong><small>Uitleg, begrippen en modelantwoorden</small></span><span>→</span></button><button className="mode-button mode-practice" onClick={() => onNavigate("practice")}><ListChecks size={28} /><span><strong>Oefenen</strong><small>Gericht per onderwerp en niveau</small></span><span>→</span></button><button className="mode-button mode-test" onClick={() => onNavigate("test")}><ClipboardText size={28} /><span><strong>Toetsmodus</strong><small>Geen feedback tot je inlevert</small></span><span>→</span></button><button className="mode-button mode-mistakes" onClick={() => onNavigate("mistakes")}><WarningCircle size={28} /><span><strong>Foutenlog</strong><small>Analyseer en oefen opnieuw</small></span><span>→</span></button></div>
      </section>
      <div className="exam-tip"><Flask size={22} weight="duotone" /><div><strong>Examentip</strong><p>Schrijf bij elke berekening eerst de formule en zet volumes om naar liter. Dat kost seconden en voorkomt klassieke puntenverlies.</p></div></div>
    </div>
  );
}
