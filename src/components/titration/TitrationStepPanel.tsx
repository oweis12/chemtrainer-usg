import { ArrowCounterClockwise, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import type { TitrationProcedureState, TitrationSetupSelection } from "../../features/titrationLab/titrationEngine";
import type { EndpointState, ValveSetting } from "../../types";

const setupParts: Array<{ key: keyof TitrationSetupSelection; label: string }> = [
  { key: "stand", label: "statief" },
  { key: "burette", label: "buret" },
  { key: "stopcock", label: "kraantje" },
  { key: "erlenmeyer", label: "erlenmeyer onder buret" },
  { key: "pipette", label: "pipet voor monster" },
  { key: "indicator", label: "indicator" },
];

const procedureSteps: Array<{ key: keyof TitrationProcedureState; label: string; action: string; success: string; problem: string; recovery: string }> = [
  { key: "rinsedBurette", label: "Spoel de buret met titrant", action: "Buret correct gespoeld", success: "Goed: de bekende oplossing in de buret wordt niet verdund door achtergebleven water.", problem: "Als de buret niet met titrant is gespoeld, kan de bekende oplossing verdund raken. Dan klopt de opgegeven molariteit niet meer.", recovery: "Spoel de buret met een klein beetje titrant en laat dat via het kraantje weglopen." },
  { key: "rinsedPipette", label: "Spoel de pipet met monsteroplossing", action: "Pipet correct gespoeld", success: "Goed: het afgemeten monstervolume bevat dan dezelfde samenstelling als de monsteroplossing.", problem: "Als de pipet nog demiwater bevat, wordt het monster verdund. Dan verandert de hoeveelheid onderzochte stof in de erlenmeyer.", recovery: "Spoel de pipet met monsteroplossing voordat je het vaste volume opzuigt." },
  { key: "pipettedSample", label: "Pipetteer een bekend volume monster", action: "Monster gepipetteerd", success: "Goed: je weet nu hoeveel mL monster in de erlenmeyer zit. Dat volume gebruik je later bij c = n / V.", problem: "Zonder bekend monstervolume kun je na de titratie geen betrouwbare molariteit berekenen.", recovery: "Meet het monster af met een volumepipet en noteer het volume." },
  { key: "addedIndicator", label: "Voeg indicator toe", action: "Indicator toegevoegd", success: "Goed: de kleurverandering geeft straks een praktisch eindpunt.", problem: "Zonder indicator mis je het kleurveranderingssignaal bij het eindpunt.", recovery: "Voeg enkele druppels indicator toe en meng rustig." },
  { key: "filledBurette", label: "Vul de buret met titrant", action: "Buret gevuld", success: "Goed: de titrant met bekende molariteit zit nu boven het monster.", problem: "Zonder gevulde buret kun je geen beginstand aflezen en geen bekend volume toevoegen.", recovery: "Vul de buret, verwijder luchtbelletjes en noteer daarna pas de beginstand." },
  { key: "readStart", label: "Lees de beginstand af", action: "Beginstand afgelezen", success: "Goed: beginstand is nodig, want gebruikt volume = eindstand − beginstand.", problem: "Als de beginstand ontbreekt, kun je het gebruikte volume niet correct berekenen.", recovery: "Lees de onderkant van de meniscus op ooghoogte en vul de beginstand in bij ‘Buret aflezen’." },
  { key: "titratedSlowly", label: "Titreer langzaam bij het eindpunt", action: "Langzaam getitreerd", success: "Goed: langzaam druppelen verkleint de kans dat je voorbij het eindpunt schiet.", problem: "Te snel titreren rond het eindpunt geeft kans op overshoot: je voegt dan te veel titrant toe.", recovery: "Zet de kraan op ‘Druppel’ zodra de kleurverandering traag verdwijnt." },
  { key: "stoppedAtEndpoint", label: "Stop bij blijvende lichte kleur", action: "Gestopt bij eindpunt", success: "Goed: een blijvende lichte kleur is het praktische eindpunt dat dicht bij het equivalentiepunt ligt.", problem: "Als je te vroeg of te laat stopt, wordt het gemeten volume te klein of te groot.", recovery: "Sluit de kraan zodra de lichte kleur blijft. Bij fel/donker is de titratie voorbijgeschoten." },
  { key: "readEnd", label: "Lees de eindstand af", action: "Eindstand afgelezen", success: "Goed: met begin- en eindstand kun je het buretverbruik bepalen.", problem: "Zonder eindstand kun je het toegevoegde volume niet uitrekenen.", recovery: "Sluit de kraan en lees opnieuw de onderkant van de meniscus op ooghoogte af." },
];

interface TitrationStepPanelProps {
  setup: TitrationSetupSelection;
  procedure: TitrationProcedureState;
  setupFeedback: string[];
  procedureWarnings: string[];
  valveSetting: ValveSetting;
  endpointState: EndpointState;
  hasStartReading: boolean;
  hasEndReading: boolean;
  showSetupBuilder?: boolean;
  showProcedureWarnings?: boolean;
  activeProcedureAnimation?: keyof TitrationProcedureState | null;
  currentProcedureIndex: number;
  onToggleSetup: (key: keyof TitrationSetupSelection) => void;
  onSetProcedure: (key: keyof TitrationProcedureState, value: boolean, action?: string) => void;
  onChangeProcedureIndex: (index: number) => void;
}

export function TitrationStepPanel({ setup, procedure, setupFeedback, procedureWarnings, valveSetting, endpointState, hasStartReading, hasEndReading, showSetupBuilder = true, showProcedureWarnings = true, activeProcedureAnimation, currentProcedureIndex, onToggleSetup, onSetProcedure, onChangeProcedureIndex }: TitrationStepPanelProps) {
  const isStepDone = (key: keyof TitrationProcedureState) => {
    if (key === "readStart") return procedure.readStart || hasStartReading;
    if (key === "readEnd") return procedure.readEnd || hasEndReading;
    return procedure[key];
  };
  const totalSteps = procedureSteps.length;
  const currentStep = procedureSteps[Math.max(0, Math.min(currentProcedureIndex, totalSteps - 1))];
  const currentStepIndex = procedureSteps.findIndex((step) => step.key === currentStep.key);
  const contextualFeedback = (key: keyof TitrationProcedureState, done: boolean, fallback: string) => {
    if (key === "readStart" && !hasStartReading) return "Vul beneden eerst een beginstand in. Pas dan is deze stap echt gekoppeld aan een meting.";
    if (key === "readEnd" && !hasEndReading) return "Vul beneden eerst een eindstand in. Pas dan is het volume controleerbaar.";
    if (key === "titratedSlowly" && valveSetting === "snel") return "De kraan staat snel: dat is handig in het begin, maar gevaarlijk bij het eindpunt.";
    if (key === "titratedSlowly" && done) return "Goed: je hebt de druppelstand gebruikt. Rond het eindpunt is dat nauwkeuriger dan snel laten lopen.";
    if (key === "stoppedAtEndpoint" && done && endpointState !== "goed") return endpointState === "te_ver" ? "Je hebt stoppen gemarkeerd, maar de kleur is al te sterk. Deze meting geeft waarschijnlijk een te groot volume." : "Je hebt stoppen gemarkeerd, maar het eindpunt is nog niet overtuigend bereikt.";
    return fallback;
  };

  return <section className="titration-panel">
    <span className="section-kicker">Opstelling bouwen</span>
    {showSetupBuilder ? <>
      <h2>Klik de onderdelen aan die correct geplaatst zijn.</h2>
      <div className="setup-chip-grid">
        {setupParts.map((part) => <button key={part.key} className={setup[part.key] ? "active" : ""} onClick={() => onToggleSetup(part.key)}>
          <CheckCircle size={16} weight={setup[part.key] ? "fill" : "regular"} />
          {part.label}
        </button>)}
      </div>
    <div className={`setup-feedback ${setupFeedback[0]?.startsWith("Goed") ? "good" : "warn"}`}>
        {setupFeedback[0]?.startsWith("Goed") ? <CheckCircle size={18} weight="fill" /> : <WarningCircle size={18} weight="fill" />}
        <div>{setupFeedback.map((item) => <p key={item}>{item}</p>)}</div>
      </div>
    </> : <div className="setup-feedback good">
      <CheckCircle size={18} weight="fill" />
      <div><p>De basisopstelling staat klaar. Wil je dit extra oefenen? Zet dan de challenge “zelf opstelling samenstellen” aan.</p></div>
    </div>}
    <h3>Procedurestappen</h3>
    <div className="procedure-stepper">
      <div className="procedure-stepper-top">
        <div>
          <p className="procedure-stepper-progress">Stap {currentStepIndex + 1} van {totalSteps}</p>
          <h4>{currentStep.label}</h4>
        </div>
        <div className="procedure-stepper-nav">
          <button className="ghost-button compact-button" onClick={() => onChangeProcedureIndex(Math.max(0, currentProcedureIndex - 1))} disabled={currentProcedureIndex <= 0}>Vorige</button>
          <button className="secondary-button compact-button" onClick={() => onChangeProcedureIndex(Math.min(totalSteps - 1, currentProcedureIndex + 1))} disabled={currentProcedureIndex >= totalSteps - 1}>Volgende</button>
        </div>
      </div>
      <div className="procedure-stepper-chips" aria-label="Procedure voortgang">
        {procedureSteps.map((step, index) => {
          const done = isStepDone(step.key);
          const isActive = index === currentProcedureIndex;
          return <button key={step.key} className={`procedure-step-chip ${done ? "done" : "todo"} ${isActive ? "active" : ""}`} onClick={() => onChangeProcedureIndex(index)} aria-pressed={isActive}>{index + 1}</button>;
        })}
      </div>
      <article className={`procedure-step-card single ${isStepDone(currentStep.key) ? "done" : "todo"} ${(currentStep.key === "stoppedAtEndpoint" && isStepDone(currentStep.key) && endpointState !== "goed") || (currentStep.key === "titratedSlowly" && valveSetting === "snel") ? "attention" : ""} ${activeProcedureAnimation === currentStep.key ? "animating" : ""}`}>
        <div className="procedure-step-head">
          <span>{currentStepIndex + 1}</span>
          <div>
            <h4>{currentStep.label}</h4>
            <p>{isStepDone(currentStep.key) ? "Status: uitgevoerd of gemeten." : "Status: nog doen."}</p>
          </div>
        </div>
        <p className="procedure-step-feedback">{contextualFeedback(currentStep.key, isStepDone(currentStep.key), isStepDone(currentStep.key) ? currentStep.success : currentStep.problem)}</p>
        {activeProcedureAnimation === currentStep.key && <p className="procedure-step-animating">Mini-preview toont deze handeling.</p>}
        {!isStepDone(currentStep.key) && <p className="procedure-step-recovery"><strong>Herstel:</strong> {currentStep.recovery}</p>}
        <div className="procedure-step-actions">
          <button className={isStepDone(currentStep.key) ? "completed-button compact-button" : "secondary-button compact-button"} onClick={() => onSetProcedure(currentStep.key, true, currentStep.key)}>
            <CheckCircle size={16} weight={isStepDone(currentStep.key) ? "fill" : "regular"} /> {currentStep.action}
          </button>
          {isStepDone(currentStep.key) && <button className="ghost-button compact-button" onClick={() => onSetProcedure(currentStep.key, false, currentStep.key)}><ArrowCounterClockwise size={15} /> Opnieuw oefenen</button>}
        </div>
      </article>
    </div>
    {showProcedureWarnings && procedureWarnings.length > 0 && <div className="procedure-warnings">
      {procedureWarnings.map((warning) => <p key={warning}><WarningCircle size={15} weight="fill" /> {warning}</p>)}
    </div>}
  </section>;
}
