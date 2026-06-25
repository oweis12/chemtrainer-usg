import { CheckCircle, Lightbulb, Warning, XCircle } from "@phosphor-icons/react";
import type { Question } from "../types";

interface FeedbackPanelProps {
  question: Question;
  correct?: boolean;
  selfReview?: boolean;
}

export function FeedbackPanel({ question, correct, selfReview = false }: FeedbackPanelProps) {
  const needsDetailedLayer = ["M10", "M8", "M5D"].includes(question.module) || question.type.startsWith("structure") || Boolean(question.visual);
  const firstStep = question.steps?.[0] ?? question.hints?.[0] ?? "Lees de vraag opnieuw en bepaal welk begrip of welke grootheid centraal staat.";
  const dataClue = question.visual ? "De figuur of het schema is relevante informatie: gebruik labels, assen, pijlen of onderschrift actief in je antwoord."
    : question.type === "calculation" ? "De getallen met eenheden zijn relevant; controleer vooral L, mol/L, g en molmassa."
      : "De relevante informatie zit in de vakbegrippen uit de vraag en in de gegeven structuur of context.";

  return (
    <section className={`feedback-panel ${correct === true ? "feedback-good" : correct === false ? "feedback-review" : ""}`}>
      <div className="feedback-title">
        {correct === true ? <CheckCircle size={22} weight="fill" /> : correct === false ? <XCircle size={22} weight="fill" /> : <Lightbulb size={22} weight="fill" />}
        <h3>{correct === true ? "Goed onderbouwd" : correct === false ? "Nog eens nalopen" : "Modelantwoord"}</h3>
      </div>
      <p className="model-answer">{question.modelAnswer}</p>
      {question.steps && (
        <ol className="answer-steps">
          {question.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}
        </ol>
      )}
      {needsDetailedLayer && (
        <div className="answer-explanation-layers">
          <div><strong>1. Wat wordt gevraagd?</strong><span>{question.skill} bij {question.topic}.</span></div>
          <div><strong>2. Welke info is relevant?</strong><span>{dataClue}</span></div>
          <div><strong>3. Welke tussenstap komt eerst?</strong><span>{firstStep}</span></div>
          <div><strong>4. Waarom klopt dit chemisch?</strong><span>{question.explanation}</span></div>
        </div>
      )}
      {selfReview && (
        <div className="rubric-box">
          <strong>Rubric-checklist</strong>
          <ul>{question.rubric.map((item) => <li key={item}><CheckCircle size={15} /> {item}</li>)}</ul>
        </div>
      )}
      <div className="feedback-explanation"><Warning size={16} weight="fill" /><span>{question.explanation}</span></div>
      {question.commonMistakes.length > 0 && <p className="mistake-note"><strong>Let op:</strong> {question.commonMistakes.join(" ")}</p>}
    </section>
  );
}
