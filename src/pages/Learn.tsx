import { ArrowLeft, CheckCircle, ClipboardText, Lightbulb, ListChecks, TestTube, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { lessons } from "../data/lessons";
import { binasReferenceMap, getBinasReferencesFor } from "../data/binasReferences";
import { visualAssetRegistry } from "../data/visualAssetRegistry";
import type { FigureExplanation, Lesson, ModuleId } from "../types";
import { BinasBox } from "../components/BinasBox";
import { FormulaBlock } from "../components/FormulaBlock";
import { LessonCard } from "../components/LessonCard";
import { ConceptDiagram } from "../components/ConceptDiagram";
import { BinasReferenceBox } from "../components/content/BinasReferenceBox";
import { FigureBlock } from "../components/content/FigureBlock";
import { FigureExplanationBlock } from "../components/content/FigureExplanationBlock";
import { QuestionVisual } from "../components/QuestionVisual";
import { getFigureByAssetId } from "../data/figureRegistry";
import { getRenderableLessonVideo } from "../data/lessonVideoRegistry";
import { LessonVideoCard } from "../components/content/LessonVideoCard";
import { M11LessonVisual } from "../components/M11LessonVisual";
import { M11BookMode } from "../components/M11BookMode";
import { m11BookChapters } from "../data/m11Book";

const moduleFilters: Array<ModuleId | "all"> = ["all", "M4", "M5D", "M6", "M7", "M8", "M9", "M10", "M11"];

export function Learn({ completedLessons, onComplete, onPractice, onTitrationLab, initialLessonId }: { completedLessons: string[]; onComplete: (lessonId: string) => void; onPractice: (module: ModuleId) => void; onTitrationLab: () => void; initialLessonId?: string | null }) {
  const [selected, setSelected] = useState<Lesson | null>(() => lessons.find((lesson) => lesson.id === initialLessonId) ?? null);
  const [filter, setFilter] = useState<ModuleId | "all">("all");
  const [checksVisible, setChecksVisible] = useState(false);
  const visible = lessons.filter((lesson) => filter === "all" || lesson.module === filter);

  if (selected && m11BookChapters.some((chapter) => chapter.lessonId === selected.id)) {
    return (
      <M11BookMode
        key={selected.id}
        lesson={selected}
        completed={completedLessons.includes(selected.id)}
        onBack={() => { setSelected(null); setChecksVisible(false); }}
        onComplete={() => onComplete(selected.id)}
        onPractice={() => onPractice(selected.module)}
        onSelectLesson={(lessonId) => {
          const nextLesson = lessons.find((lesson) => lesson.id === lessonId);
          if (nextLesson) setSelected(nextLesson);
        }}
      />
    );
  }

  if (selected) {
    return (
      <LessonDetail
        lesson={selected}
        completed={completedLessons.includes(selected.id)}
        onBack={() => { setSelected(null); setChecksVisible(false); }}
        onComplete={() => onComplete(selected.id)}
        onPractice={() => onPractice(selected.module)}
        onTitrationLab={onTitrationLab}
        checksVisible={checksVisible}
        setChecksVisible={setChecksVisible}
      />
    );
  }

  return (
    <div className="learn-page">
      <header className="page-intro learn-heading">
        <span className="section-kicker">Leren</span>
        <h1>Begrijp de stof stap voor stap</h1>
        <p>Kies een onderwerp, lees de uitleg en voorbeelden en controleer je begrip met de mini-check.</p>
      </header>

      <div className="learn-filter">
        <label htmlFor="learn-module-filter">Module</label>
        <select id="learn-module-filter" value={filter} onChange={(event) => setFilter(event.target.value as ModuleId | "all")}>
          {moduleFilters.map((module) => <option key={module} value={module}>{module === "all" ? "Alle modules" : module}</option>)}
        </select>
        <span>{visible.length} {visible.length === 1 ? "les" : "lessen"}</span>
      </div>

      <section className="lesson-list" aria-label="Lessen">
        {visible.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            completed={completedLessons.includes(lesson.id)}
            onOpen={() => setSelected(lesson)}
          />
        ))}
      </section>
    </div>
  );
}

function fallbackFigureExplanation(example: NonNullable<Lesson["extraExamples"]>[number]): FigureExplanation {
  return {
    observation: example.visual?.caption ?? example.prompt,
    meaning: "Gebruik de zichtbare onderdelen als aanwijzingen. Lees eerst wat er staat afgebeeld en koppel elk label daarna aan het begrip uit de les.",
    conclusion: example.conclusion,
    examUse: "Op een toets gebruik je de figuur als bron: benoem de waarneming, leg de betekenis uit en sluit af met de conclusie in woorden.",
  };
}

function LessonDetail({ lesson, completed, onBack, onComplete, onPractice, onTitrationLab, checksVisible, setChecksVisible }: { lesson: Lesson; completed: boolean; onBack: () => void; onComplete: () => void; onPractice: () => void; onTitrationLab: () => void; checksVisible: boolean; setChecksVisible: (value: boolean) => void }) {
  const hasSimpleMeaning = Boolean(lesson.simpleMeaning?.length);
  const simpleMeaning = hasSimpleMeaning ? lesson.simpleMeaning! : [lesson.foundation[0]];
  const theoryFoundation = hasSimpleMeaning ? lesson.foundation : lesson.foundation.slice(1);
  const memoryAnchor = lesson.memoryAnchor?.length
    ? lesson.memoryAnchor
    : [lesson.objectives[0] ?? "Pas de aanpak uit het uitgewerkte voorbeeld toe."];
  const binasReferences = getBinasReferencesFor(lesson.module, lesson.topic + " " + lesson.title + " " + lesson.example.prompt);
  const explicitBinasReferences = (lesson.binasReferenceIds ?? [])
    .map((id) => binasReferenceMap[id])
    .filter(Boolean)
    .map((reference) => ({
      table: reference.tabel,
      title: reference.onderwerp,
      useFor: reference.wanneerGebruikJeDezeTabel,
      howToUse: reference.waarschuwing,
      example: reference.voorbeeldvraag,
    }));
  const explicitTables = new Set(explicitBinasReferences.map((reference) => reference.table));
  const additionalBinasReferences = binasReferences.filter((reference) => !explicitTables.has(reference.tabel));
  const lessonImageSlots = (lesson.imageSlots ?? [])
    .map((id) => visualAssetRegistry.find((asset) => asset.id === id))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));
  const lessonVideo = getRenderableLessonVideo(lesson.videoIds);
  const showTitrationLab = lesson.module === "M10" && /titr|buret|azijn|zuur-base/i.test(lesson.topic + " " + lesson.title);
  const coreExampleIsInExtras = Boolean(lesson.extraExamples?.some((example) => example.prompt === lesson.example.prompt));
  const hasVisualSupport = Boolean(lesson.diagram || lessonImageSlots.length || lesson.module === "M11");

  return (
    <div className="lesson-detail">
      <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Terug naar lessen</button>

      <header className="lesson-detail-head">
        <div>
          <p className="lesson-context">{lesson.module}<span aria-hidden="true">·</span>{lesson.topic}</p>
          <h1>{lesson.title}</h1>
          <p className="lesson-intro">Uitleg en voorbeelden bij {lesson.topic}.</p>
        </div>
        <button className={completed ? "completed-button" : "secondary-button"} onClick={onComplete}>
          <CheckCircle size={19} weight={completed ? "fill" : "regular"} />
          {completed ? "Les afgerond" : "Markeer als afgerond"}
        </button>
      </header>

      <article className="lesson-reading" style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
        <section className="lesson-section lesson-core-section" style={{ display: "block" }}>
          <h2>Kernidee</h2>
          {simpleMeaning.length > 0 && <div className="lesson-prose">
            {simpleMeaning.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>}
          <div className="why-box"><strong>Waarom leer je dit?</strong><p>{lesson.relevance}</p></div>
          <ul className="objective-list">
            {lesson.objectives.map((objective) => <li key={objective}><CheckCircle size={17} weight="fill" />{objective}</li>)}
          </ul>
        </section>

        <section className="lesson-section lesson-theory-section" style={{ display: "block" }}>
          <h2>Theorie</h2>
          <div className="lesson-prose">
            {theoryFoundation.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          {lesson.concepts.length > 0 && (
            <div className="lesson-concepts">
              <h3>Belangrijke begrippen</h3>
              <dl className="concept-list">
                {lesson.concepts.map((concept) => <div key={concept.term}><dt>{concept.term}</dt><dd>{concept.meaning}</dd></div>)}
              </dl>
            </div>
          )}
        </section>

        {hasVisualSupport && (
          <section className="lesson-section lesson-visual-section" style={{ display: "block" }}>
            <h2>In beeld</h2>
            {lesson.module === "M11" && <M11LessonVisual lessonId={lesson.id} />}
            {lesson.diagram && (
              <div className="lesson-visual-item">
                <ConceptDiagram kind={lesson.diagram} />
                <FigureExplanationBlock explanation={{
                  observation: "Je ziet een schema bij " + lesson.topic + ".",
                  meaning: "Het schema helpt bij het leerdoel: " + lesson.objectives[0] + ".",
                  conclusion: memoryAnchor[0],
                  examUse: lesson.examApproach?.[0] ?? lesson.examAnswer,
                }} />
              </div>
            )}
            {lessonImageSlots.length > 0 && (
              <div className="lesson-image-slots">
                {lessonImageSlots.map((asset, index) => {
                  const figure = getFigureByAssetId(asset.id);
                  return (
                    <div className="lesson-figure-with-explanation" key={asset.id}>
                      <FigureBlock
                        src={asset.path}
                        alt={asset.alt}
                        title={figure?.title ?? asset.topic}
                        figureNumber={figure?.number ?? String(index + 1)}
                        caption={asset.caption}
                        status={asset.status}
                      />
                      <FigureExplanationBlock explanation={{
                        observation: asset.alt,
                        meaning: asset.caption,
                        conclusion: "Gebruik dit beeld om " + lesson.objectives[0] + " te onderbouwen.",
                        examUse: lesson.examApproach?.[0] ?? "Koppel de zichtbare onderdelen aan " + lesson.topic + " en formuleer daarna je conclusie.",
                      }} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {(lesson.example || (lesson.extraExamples && lesson.extraExamples.length > 0)) && (
          <section className="lesson-section lesson-examples-section" style={{ display: "block" }}>
            <h2>Uitgewerkt voorbeeld</h2>
            {!coreExampleIsInExtras && (
              <article className="lesson-worked-example">
                <FormulaBlock title={lesson.example.title}><p>{lesson.example.prompt}</p></FormulaBlock>
                <ol className="lesson-steps">{lesson.example.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
              </article>
            )}
            {lesson.extraExamples && lesson.extraExamples.length > 0 && (
              <div className="lesson-extra-examples">
                {lesson.extraExamples.map((example) => (
                  <article className="lesson-extra-example" key={example.title}>
                    {example.visual && <QuestionVisual visual={example.visual} />}
                    {example.visual && <FigureExplanationBlock explanation={example.figureExplanation ?? fallbackFigureExplanation(example)} />}
                    <FormulaBlock title={example.title}><p>{example.prompt}</p></FormulaBlock>
                    <ol className="lesson-steps">{example.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
                    <p className="example-conclusion"><strong>Conclusie:</strong> {example.conclusion}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="lesson-section lesson-exam-section" style={{ display: "block" }}>
          <h2>Toetsaanpak, fouten en BINAS</h2>
          {lesson.examApproach && lesson.examApproach.length > 0 && (
            <div className="lesson-exam-approach">
              <h3>Zo pak je een toetsvraag aan</h3>
              <ol className="lesson-steps">{lesson.examApproach.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
            </div>
          )}
          <div className="lesson-mistakes">
            <h3>Veelgemaakte fouten</h3>
            <ul className="mistake-list">{lesson.commonMistakes.map((mistake) => <li key={mistake}><Warning size={17} weight="fill" />{mistake}</li>)}</ul>
          </div>
          <div className="exam-answer">
            <ClipboardText size={22} weight="duotone" />
            <div><strong>Zo formuleer je het antwoord</strong><p>{lesson.examAnswer}</p></div>
          </div>
          {(explicitBinasReferences.length > 0 || additionalBinasReferences.length > 0 || binasReferences.length === 0) && (
            <details className="lesson-binas-aid">
              <summary>BINAS naslaan als je het nodig hebt</summary>
              {explicitBinasReferences.length > 0 && <BinasReferenceBox references={explicitBinasReferences} />}
              <BinasBox references={additionalBinasReferences} heading={explicitBinasReferences.length ? "Aanvullende verwijzingen" : "BINAS bij deze les"} />
            </details>
          )}
        </section>

        {lessonVideo && (
          <section className="lesson-section lesson-video-section" style={{ display: "block" }}>
            <h2>Video als aanvulling</h2>
            <p className="lesson-section-intro">Bekijk deze video als aanvulling op de uitleg.</p>
            <LessonVideoCard video={lessonVideo} scopeNote={lesson.videoScopeNote} />
          </section>
        )}
        {lesson.module === "M11" && !lessonVideo && (
          <section className="lesson-section lesson-video-section" style={{ display: "block" }}>
            <h2>Video als aanvulling</h2>
            <p>Er is geen aanvullende video bij deze les.</p>
          </section>
        )}

        <section className="lesson-section lesson-review-section" style={{ display: "block" }}>
          <h2>Check jezelf</h2>
          {memoryAnchor.length > 0 && (
            <div className="lesson-memory">
              <Lightbulb size={19} weight="fill" />
              <div><strong>Houd dit vast</strong><ul>{memoryAnchor.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
          )}
          <div className="mini-check">
            <h3>Mini-check</h3>
            <div className="mini-check-questions">
              {lesson.miniCheck.map((check, index) => (
                <details key={check.question} open={checksVisible}>
                  <summary><span>{index + 1}</span>{check.question}</summary>
                  <p>{check.answer}</p>
                </details>
              ))}
            </div>
            <button className="ghost-button" onClick={() => setChecksVisible(!checksVisible)}>
              <Lightbulb size={17} />{checksVisible ? "Antwoorden verbergen" : "Antwoorden tonen"}
            </button>
          </div>
          <div className="lesson-practice-actions">
            <button className="primary-button" onClick={onPractice}><ListChecks size={19} /> Oefenen met {lesson.module}</button>
            {showTitrationLab && <button className="secondary-button" onClick={onTitrationLab}><TestTube size={19} /> Open TitratieLab</button>}
          </div>
        </section>
      </article>
    </div>
  );
}
