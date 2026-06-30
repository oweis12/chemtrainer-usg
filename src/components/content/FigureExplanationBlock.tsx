import { ArrowRight, CheckCircle, ListChecks, WarningCircle } from "@phosphor-icons/react";
import type { FigureExplanation } from "../../types";

export function FigureExplanationBlock({ explanation }: { explanation: FigureExplanation }) {
  return <section className="figure-explanation-block">
    <div>
      <strong>Wat zie je?</strong>
      <p>{explanation.observation}</p>
    </div>
    <div>
      <strong>Wat betekent dit?</strong>
      <p>{explanation.meaning}</p>
    </div>
    <div>
      <strong>Wat concludeer je hieruit?</strong>
      <p>{explanation.conclusion}</p>
    </div>
    <div>
      <strong>Hoe komt dit op de toets?</strong>
      <p>{explanation.examUse}</p>
    </div>
    {explanation.steps && explanation.steps.length > 0 && <div className="figure-explanation-steps">
      <strong><ListChecks size={15} weight="fill" /> Stappenplan bij dit soort vragen</strong>
      <ol>{explanation.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    </div>}
    {explanation.binasLink && <p className="figure-explanation-note"><ArrowRight size={15} weight="bold" />{explanation.binasLink}</p>}
    {explanation.commonMistake && <div className="figure-explanation-warning"><strong><WarningCircle size={15} weight="fill" /> Veelgemaakte fout</strong><p>{explanation.commonMistake}</p></div>}
  </section>;
}

export function LessonWrapUp({ objectives, examApproach, memoryAnchor }: { objectives: string[]; examApproach?: string[]; memoryAnchor: string[] }) {
  const toetsItems = examApproach?.length ? examApproach.slice(0, 4) : memoryAnchor.slice(0, 3);

  return <section className="lesson-wrap-up">
    <div>
      <strong>Kort samengevat</strong>
      <ul>{memoryAnchor.slice(0, 3).map((item) => <li key={item}><CheckCircle size={15} weight="fill" />{item}</li>)}</ul>
    </div>
    <div>
      <strong>Wat moet je nu kunnen?</strong>
      <ul>{objectives.slice(0, 3).map((objective) => <li key={objective}><CheckCircle size={15} weight="fill" />{objective}</li>)}</ul>
    </div>
    <div>
      <strong>Zo kan dit op de toets terugkomen</strong>
      <ol>{toetsItems.map((item) => <li key={item}>{item}</li>)}</ol>
    </div>
  </section>;
}
