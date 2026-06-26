import { CheckCircle, Lightbulb, Warning, XCircle } from "@phosphor-icons/react";
import type { Question } from "../types";

interface FeedbackPanelProps {
  question: Question;
  correct?: boolean;
  selfReview?: boolean;
}

export function FeedbackPanel({ question, correct, selfReview = false }: FeedbackPanelProps) {
  const steps = question.steps?.length ? question.steps : [question.hints?.[0] ?? "Bepaal eerst welk begrip of welke grootheid centraal staat."];
  const dataClue = question.visual ? "De figuur of het schema is relevante informatie: gebruik labels, assen, pijlen of onderschrift actief in je antwoord."
    : question.type === "calculation" ? "De getallen met eenheden zijn relevant; controleer vooral L, mol/L, g en molmassa."
      : "De relevante informatie zit in de vakbegrippen uit de vraag en in de gegeven structuur of context.";
  const tip = question.commonMistakes.length ? question.commonMistakes.join(" ") : "Schrijf niet alleen het losse begrip op; koppel het aan de gegevens uit de vraag.";

  return (
    <section className={`feedback-panel ${correct === true ? "feedback-good" : correct === false ? "feedback-review" : ""}`}>
      <div className="feedback-title">
        {correct === true ? <CheckCircle size={22} weight="fill" /> : correct === false ? <XCircle size={22} weight="fill" /> : <Lightbulb size={22} weight="fill" />}
        <h3>{correct === true ? "Goed onderbouwd" : correct === false ? "Nog eens nalopen" : "Modelantwoord"}</h3>
      </div>
      <div className="feedback-block">
        <strong>Eindantwoord</strong>
        <p className="model-answer">{question.modelAnswer}</p>
      </div>
      <div className="feedback-block">
        <strong>Stappen</strong>
        <ol className="answer-steps">
          {steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}
        </ol>
      </div>
      <div className="feedback-block">
        <strong>Waarom dit klopt</strong>
        <p>{question.explanation}</p>
        <p className="feedback-clue">{dataClue}</p>
      </div>
      {selfReview && (
        <div className="rubric-box">
          <strong>Rubric-checklist</strong>
          <ul>{question.rubric.map((item) => <li key={item}><CheckCircle size={15} /> {item}</li>)}</ul>
        </div>
      )}
      <div className="feedback-tip"><Warning size={16} weight="fill" /><span><strong>Veelgemaakte fout / tip:</strong> {tip}</span></div>
    </section>
  );
}
