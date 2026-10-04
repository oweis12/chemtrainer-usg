import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import type { TitrationProcedureState, TitrationSetupSelection } from "../../features/titrationLab/titrationEngine";

const setupParts: Array<{ key: keyof TitrationSetupSelection; label: string }> = [
  { key: "stand", label: "Statief" },
  { key: "burette", label: "Buret" },
  { key: "stopcock", label: "Kraantje" },
  { key: "erlenmeyer", label: "Erlenmeyer" },
  { key: "pipette", label: "Pipet" },
  { key: "indicator", label: "Indicator" },
];

const procedureSteps: Array<{ key: keyof TitrationProcedureState; label: string; action: string; success: string; problem: string; recovery: string }> = [
  { key: "rinsedBurette", label: "Spoel de buret met titrant", action: "Buret gespoeld", success: "De bekende oplossing wordt niet verdund door achtergebleven water.", problem: "Achtergebleven water kan de titrant verdunnen en de opgegeven molariteit veranderen.", recovery: "Spoel met een kleine hoeveelheid titrant en laat die via het kraantje weglopen." },
  { key: "rinsedPipette", label: "Spoel de pipet met monsteroplossing", action: "Pipet gespoeld", success: "Het afgemeten monstervolume houdt dezelfde samenstelling als de oplossing.", problem: "Demiwater in de pipet kan het monster verdunnen.", recovery: "Spoel de pipet met monsteroplossing voordat je het vaste volume opzuigt." },
  { key: "pipettedSample", label: "Pipetteer een bekend monstervolume", action: "Monster gepipetteerd", success: "Je weet hoeveel mL monster in de erlenmeyer zit; dat volume gebruik je bij c = n / V.", problem: "Zonder bekend monstervolume kun je geen betrouwbare molariteit berekenen.", recovery: "Meet het monster af met een volumepipet en noteer het volume." },
  { key: "addedIndicator", label: "Voeg indicator toe", action: "Indicator toegevoegd", success: "De kleurverandering geeft straks het praktische eindpunt aan.", problem: "Zonder indicator mis je het kleurveranderingssignaal.", recovery: "Voeg enkele druppels indicator toe en meng rustig." },
  { key: "filledBurette", label: "Vul de buret met titrant", action: "Buret gevuld", success: "De titrant met bekende molariteit zit nu boven het monster.", problem: "Zonder gevulde buret kun je geen beginstand aflezen of bekend volume toevoegen.", recovery: "Vul de buret, verwijder luchtbelletjes en lees daarna de beginstand af." },
  { key: "readStart", label: "Lees de beginstand af", action: "Beginstand afgelezen", success: "De beginstand is nodig: gebruikt volume = eindstand − beginstand.", problem: "Zonder beginstand kun je het gebruikte volume niet bepalen.", recovery: "Lees de onderkant van de meniscus op ooghoogte af." },
  { key: "titratedSlowly", label: "Titreer langzaam bij het eindpunt", action: "Langzaam getitreerd", success: "Langzaam druppelen verkleint de kans dat je voorbij het eindpunt schiet.", problem: "Te snel titreren rond het eindpunt geeft kans op overshoot.", recovery: "Zet de kraan op ‘Druppelen’ zodra de kleurverandering traag verdwijnt." },
  { key: "stoppedAtEndpoint", label: "Stop bij de blijvende kleuromslag", action: "Gestopt bij eindpunt", success: "De blijvende kleuromslag is het praktische eindpunt, dicht bij het equivalentiepunt.", problem: "Te vroeg of te laat stoppen maakt het gemeten volume te klein of te groot.", recovery: "Sluit de kraan bij de omslag. Bij zoutzuur als titrant verdwijnt het roze." },
  { key: "readEnd", label: "Lees de eindstand af", action: "Eindstand afgelezen", success: "Met begin- en eindstand bepaal je het buretverbruik.", problem: "Zonder eindstand kun je het toegevoegde volume niet uitrekenen.", recovery: "Sluit de kraan en lees de onderkant van de meniscus op ooghoogte af." },
];
const preparationSteps = procedureSteps.slice(0, 5);

interface TitrationStepPanelProps {
  setup: TitrationSetupSelection;
  procedure: TitrationProcedureState;
  setupFeedback: string[];
  setupChallenge: boolean;
  showHints?: boolean;
  activeProcedureAnimation?: keyof TitrationProcedureState | null;
  onToggleSetupChallenge: () => void;
  onToggleSetup: (key: keyof TitrationSetupSelection) => void;
  onSetProcedure: (key: keyof TitrationProcedureState, value: boolean, action?: string) => void;
}

export function TitrationStepPanel({ setup, procedure, setupFeedback, setupChallenge, showHints = true, activeProcedureAnimation, onToggleSetupChallenge, onToggleSetup, onSetProcedure }: TitrationStepPanelProps) {
  const isStepDone = (key: keyof TitrationProcedureState) => procedure[key];
  const currentStep = preparationSteps.find((step) => !isStepDone(step.key)) ?? preparationSteps[preparationSteps.length - 1];
  const justCompleted = activeProcedureAnimation ? preparationSteps.find((step) => step.key === activeProcedureAnimation && isStepDone(step.key)) : undefined;
  const setupReady = setupFeedback[0]?.startsWith("Goed");

  return <section className="titration-console-section titration-preparation">
    <div className="titration-current-step">
      <span className="section-kicker">Voorbereiden · volgende handeling</span>
      <h3>{currentStep.label}</h3>
      <button className="secondary-button compact-button" onClick={() => onSetProcedure(currentStep.key, true, currentStep.key)}>
        <CheckCircle size={16} /> {currentStep.action}
      </button>
      {showHints && <details className="titration-why">
        <summary>Waarom?</summary>
        <p>{justCompleted ? justCompleted.success : currentStep.problem}</p>
        {!justCompleted && <p><strong>Herstel:</strong> {currentStep.recovery}</p>}
      </details>}
      {justCompleted && <p className="titration-step-confirmation" role="status"><CheckCircle size={15} weight="fill" /> {justCompleted.action}.</p>}
    </div>

    <details className="titration-setup-challenge">
      <summary>Extra uitdaging: stel de opstelling samen</summary>
      <p>Controleer de onderdelen voordat je aan de voorbereiding begint.</p>
      <button className={setupChallenge ? "completed-button compact-button" : "ghost-button compact-button"} onClick={onToggleSetupChallenge}>
        {setupChallenge ? "Uitdaging beëindigen" : "Uitdaging starten"}
      </button>
      {setupChallenge && <>
        <div className="setup-chip-grid">
          {setupParts.map((part) => <button type="button" key={part.key} className={setup[part.key] ? "active" : ""} aria-pressed={setup[part.key]} onClick={() => onToggleSetup(part.key)}>
            <CheckCircle size={16} weight={setup[part.key] ? "fill" : "regular"} /> {part.label}
          </button>)}
        </div>
        {showHints && <div className={`setup-feedback ${setupReady ? "good" : "warn"}`}>
          {setupReady ? <CheckCircle size={16} weight="fill" /> : <WarningCircle size={16} weight="fill" />}
          <div>{setupFeedback.map((item) => <p key={item}>{item}</p>)}</div>
        </div>}
      </>}
    </details>

  </section>;
}
