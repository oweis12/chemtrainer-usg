import { ArrowLeft, CheckCircle, ClipboardText, Lightbulb, ListChecks, TestTube, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { lessons } from "../data/lessons";
import { getBinasReferencesFor } from "../data/binasReferences";
import { visualAssetRegistry } from "../data/visualAssetRegistry";
import type { Lesson, ModuleId } from "../types";
import { BinasBox } from "../components/BinasBox";
import { FormulaBlock } from "../components/FormulaBlock";
import { LessonCard } from "../components/LessonCard";
import { ConceptDiagram } from "../components/ConceptDiagram";
import { FigureBlock } from "../components/content/FigureBlock";
import { QuestionVisual } from "../components/QuestionVisual";
import { getFigureByAssetId } from "../data/figureRegistry";

export function Learn({ completedLessons, onComplete, onPractice, onTitrationLab }: { completedLessons: string[]; onComplete: (lessonId: string) => void; onPractice: (module: ModuleId) => void; onTitrationLab: () => void }) {
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [filter, setFilter] = useState<ModuleId | "all">("all");
  const [checksVisible, setChecksVisible] = useState(false);
  const visible = lessons.filter((lesson) => filter === "all" || lesson.module === filter);

  if (selected) return <LessonDetail lesson={selected} completed={completedLessons.includes(selected.id)} onBack={() => { setSelected(null); setChecksVisible(false); }} onComplete={() => onComplete(selected.id)} onPractice={() => onPractice(selected.module)} onTitrationLab={onTitrationLab} checksVisible={checksVisible} setChecksVisible={setChecksVisible} />;
  return <div className="learn-page"><section className="page-intro"><span className="section-kicker">Leeromgeving</span><h1>Van basisbegrip naar toetsantwoord.</h1><p>Elke les bouwt op van de bouwsteen naar het antwoord dat je op een toets moet kunnen formuleren.</p></section><div className="filter-tabs"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Alle modules</button>{(["M4", "M5D", "M6", "M7", "M8", "M9", "M10"] as ModuleId[]).map((module) => <button key={module} className={filter === module ? "active" : ""} onClick={() => setFilter(module)}>{module}</button>)}</div><section className="lesson-list">{visible.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} completed={completedLessons.includes(lesson.id)} onOpen={() => setSelected(lesson)} />)}</section></div>;
}

function LessonDetail({ lesson, completed, onBack, onComplete, onPractice, onTitrationLab, checksVisible, setChecksVisible }: { lesson: Lesson; completed: boolean; onBack: () => void; onComplete: () => void; onPractice: () => void; onTitrationLab: () => void; checksVisible: boolean; setChecksVisible: (value: boolean) => void }) {
  const simpleMeaning = lesson.simpleMeaning ?? [lesson.foundation[0]];
  const memoryAnchor = lesson.memoryAnchor ?? [lesson.objectives[0], "Gebruik daarna het voorbeeld als vast stappenplan."];
  const binasReferences = getBinasReferencesFor(lesson.module, `${lesson.topic} ${lesson.title} ${lesson.example.prompt}`);
  const lessonImageSlots = (lesson.imageSlots ?? []).map((id) => visualAssetRegistry.find((asset) => asset.id === id)).filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));
  const showTitrationLab = lesson.module === "M10" && /titr|buret|azijn|zuur-base/i.test(`${lesson.topic} ${lesson.title}`);
  let sectionCounter = 1;
  const sectionNo = () => String(sectionCounter++).padStart(2, "0");

  return <div className="lesson-detail">
    <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Terug naar lessen</button>
    <header className="lesson-detail-head">
      <div>
        <span className="lesson-module">{lesson.module}</span>
        <span className="section-kicker">{lesson.topic}</span>
        <h1>{lesson.title}</h1>
        <p>{lesson.duration} · Lees rustig; je hoeft niet alles in één keer te onthouden.</p>
      </div>
      <button className={completed ? "completed-button" : "secondary-button"} onClick={onComplete}><CheckCircle size={19} weight={completed ? "fill" : "regular"} />{completed ? "Les afgerond" : "Markeer als afgerond"}</button>
    </header>

    <div className="lesson-layout">
      <article className="lesson-reading">
        <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <span className="learning-layer">Laag 1 — vanaf nul</span>
            <h2>Wat betekent dit heel simpel?</h2>
            {simpleMeaning.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
            <div className="why-box"><strong>Waarom leer je dit?</strong><p>{lesson.relevance}</p></div>
            <ul className="objective-list">{lesson.objectives.map((objective) => <li key={objective}><CheckCircle size={17} weight="fill" />{objective}</li>)}</ul>
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <span className="learning-layer">Laag 2 — schooluitleg</span>
            <h2>Stap-voor-stap uitleg vanaf nul</h2>
            {lesson.foundation.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <h2>Belangrijke woorden in gewone taal</h2>
            <dl className="concept-list">{lesson.concepts.map((concept) => <div key={concept.term}><dt>{concept.term}</dt><dd>{concept.meaning}</dd></div>)}</dl>
          </div>
        </section>

        {lesson.diagram && <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div><h2>Visualisatie / mini-diagram</h2><ConceptDiagram kind={lesson.diagram} /></div>
        </section>}

        {lessonImageSlots.length > 0 && <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <h2>Figuren bij deze les</h2>
            <div className="lesson-image-slots">
              {lessonImageSlots.map((asset, index) => {
                const figure = getFigureByAssetId(asset.id);
                return <FigureBlock
                  key={asset.id}
                  src={asset.path}
                  alt={asset.alt}
                  title={figure?.title ?? asset.topic}
                  figureNumber={figure?.number ?? String(index + 1)}
                  caption={asset.caption}
                  status={asset.status}
                />;
              })}
            </div>
          </div>
        </section>}

        <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <h2>Voorbeeld stap voor stap</h2>
            <FormulaBlock title={lesson.example.title}><p>{lesson.example.prompt}</p></FormulaBlock>
            <ol className="lesson-steps">{lesson.example.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
            <BinasBox references={binasReferences} heading="BINAS bij dit voorbeeld" />
          </div>
        </section>

        {lesson.extraExamples && lesson.extraExamples.length > 0 && <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <h2>Extra uitgewerkte voorbeelden</h2>
            <div className="lesson-extra-examples">
              {lesson.extraExamples.map((example) => <article className="lesson-extra-example" key={example.title}>
                {example.visual && <QuestionVisual visual={example.visual} />}
                <FormulaBlock title={example.title}><p>{example.prompt}</p></FormulaBlock>
                <ol className="lesson-steps">{example.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
                <p className="example-conclusion"><strong>Conclusie:</strong> {example.conclusion}</p>
              </article>)}
            </div>
          </div>
        </section>}

        <section className="lesson-section">
          <span className="section-no warning-no">{sectionNo()}</span>
          <div>
            <h2>Veelgemaakte fout</h2>
            <ul className="mistake-list">{lesson.commonMistakes.map((mistake) => <li key={mistake}><Warning size={17} weight="fill" />{mistake}</li>)}</ul>
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <span className="learning-layer">Laag 3 — toetsniveau</span>
            <h2>Hoe zeg je dit op de toets?</h2>
            <div className="exam-answer"><ClipboardText size={22} weight="duotone" /><p>{lesson.examAnswer}</p></div>
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-no">{sectionNo()}</span>
          <div>
            <h2>Als je vastloopt, onthoud dit eerst</h2>
            <ul className="memory-list">{memoryAnchor.map((item) => <li key={item}><Lightbulb size={17} weight="fill" />{item}</li>)}</ul>
          </div>
        </section>
      </article>

      <aside className="lesson-sidebar">
        <div className="mini-check">
          <span className="section-kicker">Mini-check</span>
          <h3>Drie korte vragen</h3>
          {lesson.miniCheck.map((check, index) => <details key={check.question} open={checksVisible}><summary><span>{index + 1}</span>{check.question}</summary><p>{check.answer}</p></details>)}
          <button className="ghost-button full-width" onClick={() => setChecksVisible(!checksVisible)}><Lightbulb size={17} />{checksVisible ? "Antwoorden verbergen" : "Antwoorden tonen"}</button>
        </div>
        <div className="learn-next"><ListChecks size={24} /><h3>Klaar voor toepassen?</h3><p>Oefen vragen uit {lesson.module} op jouw niveau.</p><button className="primary-button full-width" onClick={onPractice}>Naar oefenen</button></div>
        {showTitrationLab && <div className="learn-next titration-next"><TestTube size={24} /><h3>Practicum oefenen?</h3><p>Open de 2D simulatie voor buret aflezen, eindpunt en berekening.</p><button className="secondary-button full-width" onClick={onTitrationLab}>Open TitratieLab</button></div>}
      </aside>
    </div>
  </div>;
}
