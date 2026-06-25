import type { TitrationCalculationResult } from "../../features/titrationLab/titrationEngine";
import type { TitrationSimulation } from "../../types";

export interface TitrationCalculationInputs {
  titrantMol: string;
  analyteMolarity: string;
  massPercentage: string;
}

interface TitrationCalculationPanelProps {
  simulation: TitrationSimulation;
  usedVolumeMl: number | null;
  expected: TitrationCalculationResult;
  inputs: TitrationCalculationInputs;
  checked: boolean;
  titrantMolOk: boolean;
  molarityOk: boolean;
  massPercentageOk: boolean;
  onChange: (next: TitrationCalculationInputs) => void;
  onCheck: () => void;
}

export function TitrationCalculationPanel({ simulation, usedVolumeMl, expected, inputs, checked, titrantMolOk, molarityOk, massPercentageOk, onChange, onCheck }: TitrationCalculationPanelProps) {
  const showMass = simulation.taskType === "massa-aandeel";
  return <section className="titration-panel">
    <span className="section-kicker">Berekening</span>
    <h2>Reken met je eigen gemeten volume.</h2>
    <p className="calculation-used-volume">Gebruikt volume titrant: <strong>{usedVolumeMl === null ? "nog niet bepaald" : `${usedVolumeMl.toFixed(2)} mL`}</strong></p>
    <ol className="calculation-help">
      <li>Bereken hoeveel mol {simulation.titrantName} heeft gereageerd.</li>
      <li>Gebruik de molverhouding uit: <code>{simulation.reactionEquation}</code></li>
      <li>Bereken de molariteit van {simulation.analyteName}.</li>
      {showMass && <li>Bereken hoeveel procent van de massa van het monster uit de stof bestaat.</li>}
    </ol>
    <div className="calculation-input-grid">
      <label>Hoeveel mol {simulation.titrantName} heeft gereageerd?<input value={inputs.titrantMol} onChange={(event) => onChange({ ...inputs, titrantMol: event.target.value })} placeholder="bijv. 0,001860" /></label>
      <label>Molariteit van {simulation.analyteName}<input value={inputs.analyteMolarity} onChange={(event) => onChange({ ...inputs, analyteMolarity: event.target.value })} placeholder="mol/L" /></label>
      {showMass && <label>Percentage van de massa van het monster<input value={inputs.massPercentage} onChange={(event) => onChange({ ...inputs, massPercentage: event.target.value })} placeholder="%" /></label>}
    </div>
    <button className="secondary-button" onClick={onCheck}>Controleer berekening</button>
    {checked && <div className="calculation-feedback">
      <p className={titrantMolOk ? "good" : "warn"}>Mol titrant: {titrantMolOk ? "klopt" : `controleer: op basis van jouw volume is dit ${expected.titrantMol.toExponential(3)} mol`}</p>
      <p className={molarityOk ? "good" : "warn"}>Molariteit: {molarityOk ? "klopt" : `op basis van jouw volume is dit ${expected.analyteMolarity.toFixed(4)} mol/L`}</p>
      {showMass && <p className={massPercentageOk ? "good" : "warn"}>Massa-aandeel: {massPercentageOk ? "klopt" : `op basis van jouw volume is dit ${expected.massPercentage?.toFixed(2)}%`}</p>}
    </div>}
  </section>;
}
