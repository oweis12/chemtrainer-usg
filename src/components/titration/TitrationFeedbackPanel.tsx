import { CheckCircle, FloppyDisk, Gauge, WarningCircle } from "@phosphor-icons/react";
import type { TitrationLabProgress } from "../../types";
import type { TitrationScore } from "../../features/titrationLab/titrationEngine";

interface TitrationFeedbackPanelProps {
  endpointText: string;
  accuracyLevel: "good" | "early" | "ok" | "bad";
  accuracyText: string;
  deviationMl: number;
  score: TitrationScore;
  progress: TitrationLabProgress;
  mistakes: string[];
  saved: boolean;
  onSave: () => void;
}

export function TitrationFeedbackPanel({ endpointText, accuracyLevel, accuracyText, deviationMl, score, progress, mistakes, saved, onSave }: TitrationFeedbackPanelProps) {
  const goodAccuracy = accuracyLevel === "good";
  return <section className="titration-feedback-panel">
    <div className={`endpoint-strip ${goodAccuracy ? "good" : "warn"}`}>
      {goodAccuracy ? <CheckCircle size={22} weight="fill" /> : <WarningCircle size={22} weight="fill" />}
      <div>
        <span className="section-kicker">Eindpunt</span>
        <h2>{endpointText}</h2>
        <p>{accuracyText} Afwijking: {deviationMl >= 0 ? "+" : ""}{deviationMl.toFixed(2)} mL.</p>
      </div>
    </div>

    <div className="score-grid">
      <div><span>opstelling</span><strong>{score.setup}%</strong></div>
      <div><span>procedure</span><strong>{score.procedure}%</strong></div>
      <div><span>nauwkeurigheid</span><strong>{score.accuracy}%</strong></div>
      <div><span>aflezen</span><strong>{score.reading}%</strong></div>
      <div><span>berekening</span><strong>{score.calculation}%</strong></div>
      <div><span>totaal</span><strong>{score.total}%</strong></div>
    </div>

    <div className="titration-progress-card">
      <Gauge size={20} />
      <div>
        <strong>Lokale voortgang</strong>
        <p>{progress.completedCount} simulatie(s) opgeslagen · gemiddelde score {progress.averageScore}% · beste afwijking {progress.bestDeviationMl === null ? "nog geen" : `${progress.bestDeviationMl.toFixed(2)} mL`}</p>
      </div>
    </div>

    {mistakes.length > 0 && <div className="titration-mistake-list">
      <strong>Let hier opnieuw op</strong>
      {mistakes.slice(0, 6).map((mistake) => <p key={mistake}><WarningCircle size={15} weight="fill" /> {mistake}</p>)}
    </div>}

    <button className={saved ? "completed-button full-width" : "primary-button full-width"} onClick={onSave}>
      <FloppyDisk size={18} />{saved ? "Simulatie opgeslagen" : "Sla simulatie lokaal op"}
    </button>
  </section>;
}
