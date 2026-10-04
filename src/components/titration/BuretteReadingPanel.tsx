import { Eye, WarningCircle } from "@phosphor-icons/react";

interface BuretteReadingPanelProps {
  focus: "start" | "end";
  startInput: string;
  endInput: string;
  actualStartMl: number;
  actualEndMl: number;
  messages: string[];
  schellbachChoice: string;
  onStartInput: (value: string) => void;
  onEndInput: (value: string) => void;
  onSchellbachChoice: (value: string) => void;
}

const choices = [
  { id: "boven", label: "Bovenkant meniscus" },
  { id: "onder", label: "Onderkant op ooghoogte" },
  { id: "rand", label: "Schuin langs de rand" },
];

export function BuretteReadingPanel({ focus, startInput, endInput, actualStartMl, actualEndMl, messages, schellbachChoice, onStartInput, onEndInput, onSchellbachChoice }: BuretteReadingPanelProps) {
  const schellbachCorrect = schellbachChoice === "onder";
  const isStart = focus === "start";
  return <section className="titration-console-section titration-reading-panel">
    <span className="section-kicker">Buret aflezen</span>
    <h3>{isStart ? "Noteer de beginstand" : "Noteer de eindstand"}</h3>
    {isStart ? <label className="titration-reading-field">Beginstand · mL
      <input inputMode="decimal" value={startInput} onChange={(event) => onStartInput(event.target.value)} placeholder={actualStartMl.toFixed(2)} aria-label="Beginstand in milliliter" />
    </label> : <>
      <div className="titration-start-summary"><span>Beginstand</span><strong>{startInput || actualStartMl.toFixed(2)} mL</strong></div>
      <label className="titration-reading-field">Eindstand · mL
        <input inputMode="decimal" value={endInput} onChange={(event) => onEndInput(event.target.value)} placeholder={actualEndMl.toFixed(2)} aria-label="Eindstand in milliliter" />
      </label>
    </>}

    <div className="reading-feedback" aria-live="polite">
      {messages.map((message) => <p key={message}><Eye size={15} /> {message}</p>)}
    </div>

    {!isStart && <div className="schellbach-box">
      <div className="schellbach-head">
        <div><span className="section-kicker">Schellbachstreep</span><p>Kies waar je de stand afleest.</p></div>
        <details className="schellbach-visual-details">
          <summary>Bekijk schema</summary>
          <svg className="schellbach-mini" viewBox="0 0 280 118" role="img" aria-label="Schellbachstreep, meniscus en ooghoogte">
            <rect x="104" y="12" width="72" height="92" rx="16" className="schellbach-glass" />
            <path d="M112 62 C128 75 154 75 168 62" className="schellbach-meniscus" />
            <path d="M140 14 L140 59 L126 84 M140 59 L154 84" className="schellbach-stripe" />
            <line x1="70" y1="64" x2="210" y2="64" className="eye-level-line" />
            <text x="34" y="67" className="schellbach-text">ooghoogte</text>
          </svg>
        </details>
      </div>
      <div className="schellbach-options" role="group" aria-label="Waar lees je de meniscus af?">
        {choices.map((choice) => <button type="button" key={choice.id} className={schellbachChoice === choice.id ? "active" : ""} aria-pressed={schellbachChoice === choice.id} onClick={() => onSchellbachChoice(choice.id)}>{choice.label}</button>)}
      </div>
      {schellbachChoice && <p className={schellbachCorrect ? "schellbach-good" : "schellbach-warning"} role="status">
        {schellbachCorrect ? "Goed: lees de onderkant van de meniscus op ooghoogte af." : <><WarningCircle size={15} weight="fill" /> Lees de onderkant van de meniscus op ooghoogte af.</>}
      </p>}
    </div>}
  </section>;
}
