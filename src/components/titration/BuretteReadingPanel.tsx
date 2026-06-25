import { Eye, WarningCircle } from "@phosphor-icons/react";

interface BuretteReadingPanelProps {
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
  { id: "boven", label: "bovenkant meniscus" },
  { id: "onder", label: "onderkant meniscus op ooghoogte" },
  { id: "rand", label: "schuin langs de rand" },
];

export function BuretteReadingPanel({ startInput, endInput, actualStartMl, actualEndMl, messages, schellbachChoice, onStartInput, onEndInput, onSchellbachChoice }: BuretteReadingPanelProps) {
  const schellbachCorrect = schellbachChoice === "onder";
  return <section className="titration-panel">
    <span className="section-kicker">Buret aflezen</span>
    <h2>Lees begin- en eindstand af.</h2>
    <div className="reading-grid">
      <label>Beginstand in mL<input value={startInput} onChange={(event) => onStartInput(event.target.value)} placeholder={actualStartMl.toFixed(2)} /></label>
      <label>Eindstand in mL<input value={endInput} onChange={(event) => onEndInput(event.target.value)} placeholder={actualEndMl.toFixed(2)} /></label>
    </div>
    <div className="reading-feedback">
      {messages.map((message) => <p key={message}><Eye size={15} /> {message}</p>)}
    </div>
    <div className="schellbach-box">
      <h3>Schellbach-modus</h3>
      <svg className="schellbach-mini" viewBox="0 0 280 118" role="img" aria-label="Schellbachstreep en meniscus">
        <rect x="104" y="12" width="72" height="92" rx="16" className="schellbach-glass" />
        <path d="M112 62 C128 75 154 75 168 62" className="schellbach-meniscus" />
        <path d="M140 14 L140 59 L126 84 M140 59 L154 84" className="schellbach-stripe" />
        <line x1="70" y1="64" x2="210" y2="64" className="eye-level-line" />
        <text x="34" y="67" className="schellbach-text">ooghoogte</text>
      </svg>
      <p>Waar lees je af?</p>
      <div className="schellbach-options">
        {choices.map((choice) => <button key={choice.id} className={schellbachChoice === choice.id ? "active" : ""} onClick={() => onSchellbachChoice(choice.id)}>{choice.label}</button>)}
      </div>
      {schellbachChoice && <p className={schellbachCorrect ? "schellbach-good" : "schellbach-warning"}>
        {schellbachCorrect ? "Goed: lees de onderkant van de meniscus op ooghoogte af." : <><WarningCircle size={15} weight="fill" /> Fout: de Schellbachstreep helpt juist het punt bij de onderkant van de meniscus te vinden.</>}
      </p>}
    </div>
  </section>;
}
