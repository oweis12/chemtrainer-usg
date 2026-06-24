import { CheckCircle, Lightbulb, Warning, XCircle } from "@phosphor-icons/react";
import type { Question } from "../types";

interface FeedbackPanelProps {
  question: Question;
  correct?: boolean;
  selfReview?: boolean;
}

export function FeedbackPanel({ question, correct, selfReview = false }: FeedbackPanelProps) {
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
