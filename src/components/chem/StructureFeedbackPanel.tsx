import { CheckCircle, Info, WarningCircle } from "@phosphor-icons/react";

export function StructureFeedbackPanel({ feedback }: { feedback: string[] }) {
  if (!feedback.length) return null;
  const correct = feedback.some((item) => item.startsWith("Goed:"));
  return <section className={`structure-feedback ${correct ? "structure-feedback-good" : ""}`}>{correct ? <CheckCircle size={22} weight="fill" /> : <WarningCircle size={22} weight="fill" />}<div><strong>{correct ? "Structuur gecontroleerd" : "Kijk nog één stap terug"}</strong>{feedback.map((item) => <p key={item}>{item}</p>)}</div>{!correct && <Info size={18} className="structure-feedback-info" />}</section>;
}
