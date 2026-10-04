import { ArrowClockwise, TestTube } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { FigureBlock } from "../components/content/FigureBlock";
import { TitrationCalculationPanel, type TitrationCalculationInputs } from "../components/titration/TitrationCalculationPanel";
import { TitrationFeedbackPanel } from "../components/titration/TitrationFeedbackPanel";
import { TitrationSetup } from "../components/titration/TitrationSetup";
import { TitrationStepPanel } from "../components/titration/TitrationStepPanel";
import { BuretteReadingPanel } from "../components/titration/BuretteReadingPanel";
import { titrationSimulations } from "../data/titrationSimulations";
import { visualAssetRegistry } from "../data/visualAssetRegistry";
import { getFigureByAssetId } from "../data/figureRegistry";
import type { EndpointState, TitrationLabProgress, TitrationSimulation, ValveSetting } from "../types";
import {
  accuracyFeedback,
  calculateFromVolume,
  endpointLabel,
  evaluateProcedure,
  evaluateSetup,
  flowRateMlPerTick,
  getEndpointState,
  parseDutchNumber,
  readingFeedback,
  relativeErrorPercent,
  scoreTitration,
  titrationProcedureDefaults,
  titrationSetupDefaults,
  updateTitrationProgress,
  type TitrationProcedureState,
  type TitrationSetupSelection,
} from "../features/titrationLab/titrationEngine";

const START_READING_ML = 0.35;
type TitrationLabMode = "uitleg" | "begeleid" | "zelf";
type ProcedureAnimation = keyof TitrationProcedureState | null;
const PROCEDURE_ORDER: Array<keyof TitrationProcedureState> = [
  "rinsedBurette",
  "rinsedPipette",
  "pipettedSample",
  "addedIndicator",
  "filledBurette",
  "readStart",
  "titratedSlowly",
  "stoppedAtEndpoint",
  "readEnd",
];
const PHASE_LABELS = ["Voorbereiden", "Beginstand", "Titreren", "Eindstand", "Berekenen"] as const;

function cloneSetup(): TitrationSetupSelection {
  return { ...titrationSetupDefaults };
}

function readySetup(): TitrationSetupSelection {
  return { stand: true, burette: true, stopcock: true, erlenmeyer: true, pipette: true, indicator: true };
}

function cloneProcedure(): TitrationProcedureState {
  return { ...titrationProcedureDefaults };
}

function emptyCalculationInputs(): TitrationCalculationInputs {
  return { titrantMol: "", analyteMolarity: "", massPercentage: "" };
}

function endpointHint(state: EndpointState, simulation: TitrationSimulation) {
  if (simulation.titrantName === "zoutzuur") return "De roze kleur verdwijnt bij toevoegen van zoutzuur. Stop zodra de oplossing na zwenken kleurloos blijft; extra zuur is niet zichtbaar aan de indicator.";
  if (simulation.indicator.toLowerCase().includes("fenolftale")) {
    if (state === "voor") return "Nog kleurloos: er is nog zuur over in de erlenmeyer.";
    if (state === "bijna") return "Bijna: een roze zweem verdwijnt nog door zwenken.";
    if (state === "goed") return "Goed eindpunt: heel lichtroze blijft ongeveer een halve minuut zichtbaar.";
    return "Te ver: de roze kleur is te sterk, dus je hebt te veel titrant toegevoegd.";
  }
  return `Huidige omslag: ${endpointLabel(state, simulation)}.`;
}

export function TitrationLab({ progress: storedProgress, onSaveProgress }: { progress: TitrationLabProgress; onSaveProgress: (progress: TitrationLabProgress) => void }) {
  const [labMode, setLabMode] = useState<TitrationLabMode>("begeleid");
  const [setupChallenge, setSetupChallenge] = useState(false);
  const [selectedId, setSelectedId] = useState(titrationSimulations[0]?.id ?? "");
  const simulation = titrationSimulations.find((item) => item.id === selectedId) ?? titrationSimulations[0];
  const [setup, setSetup] = useState<TitrationSetupSelection>(() => readySetup());
  const [procedure, setProcedure] = useState<TitrationProcedureState>(() => cloneProcedure());
  const [currentAddedMl, setCurrentAddedMl] = useState(0);
  const [valveSetting, setValveSetting] = useState<ValveSetting>("dicht");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [schellbachChoice, setSchellbachChoice] = useState("");
  const [calculationInputs, setCalculationInputs] = useState<TitrationCalculationInputs>(() => emptyCalculationInputs());
  const [calculationChecked, setCalculationChecked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(storedProgress);
  const [activeProcedureAnimation, setActiveProcedureAnimation] = useState<ProcedureAnimation>(null);
  const [labMessage, setLabMessage] = useState("");
  const [measurements, setMeasurements] = useState<Array<{ volume: number; included: boolean }>>([]);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    setProgress(storedProgress);
  }, [storedProgress]);

  useEffect(() => {
    if (labMode !== "uitleg" && !setupChallenge) setSetup(readySetup());
  }, [labMode, setupChallenge]);

  const canDose = Object.values(setup).every(Boolean) && procedure.filledBurette && procedure.pipettedSample && procedure.addedIndicator && procedure.readStart && currentAddedMl < 50 - START_READING_ML;
  useEffect(() => {
    if (valveSetting === "dicht") return;
    if (!canDose || labMode === "uitleg") { setValveSetting("dicht"); return; }
    const timer = window.setInterval(() => {
      setCurrentAddedMl((current) => Math.min(50 - START_READING_ML, Math.round((current + flowRateMlPerTick(valveSetting)) * 100) / 100));
    }, 320);
    return () => window.clearInterval(timer);
  }, [valveSetting, canDose, labMode]);

  const actualEndMl = START_READING_ML + currentAddedMl;
  const endpointState = getEndpointState(currentAddedMl, simulation.equivalenceVolumeMl, simulation.allowedErrorMl);
  const setupFeedback = useMemo(() => evaluateSetup(setup), [setup]);
  const procedureWarnings = useMemo(() => evaluateProcedure(procedure, valveSetting, endpointState), [endpointState, procedure, valveSetting]);
  const reading = useMemo(() => readingFeedback(startInput, endInput, START_READING_ML, actualEndMl), [actualEndMl, endInput, startInput]);
  const readingOk = reading.messages.length === 1 && reading.messages[0].startsWith("Buretaflezing klopt") && schellbachChoice === "onder";
  const usedVolumeMl = reading.usedVolume !== null && reading.usedVolume > 0 ? reading.usedVolume : currentAddedMl;
  const expected = useMemo(() => calculateFromVolume(simulation, Math.max(usedVolumeMl, 0.01)), [simulation, usedVolumeMl]);
  const titrantMolOk = (relativeErrorPercent(parseDutchNumber(calculationInputs.titrantMol), expected.titrantMol) ?? 999) <= 5;
  const molarityOk = (relativeErrorPercent(parseDutchNumber(calculationInputs.analyteMolarity), expected.analyteMolarity) ?? 999) <= 5;
  const massPercentageOk = simulation.taskType !== "massa-aandeel" || (relativeErrorPercent(parseDutchNumber(calculationInputs.massPercentage), expected.massPercentage ?? 0) ?? 999) <= 5;
  const calculationOk = calculationChecked && titrantMolOk && molarityOk && massPercentageOk;
  const accuracy = accuracyFeedback(currentAddedMl, simulation);
  const mistakes = useMemo(() => {
    const items = new Set<string>();
    if (!setupFeedback[0]?.startsWith("Goed")) setupFeedback.forEach((item) => items.add(item));
    procedureWarnings.forEach((item) => items.add(item));
    reading.messages.filter((message) => !message.startsWith("Buretaflezing klopt")).forEach((item) => items.add(item));
    if (schellbachChoice && schellbachChoice !== "onder") items.add("Schellbachstreep verkeerd gebruikt: lees onderkant meniscus op ooghoogte af.");
    if (accuracy.level !== "good") items.add(accuracy.text);
    if (calculationChecked && !titrantMolOk) items.add("Mol titrant wijkt af: zet mL om naar L en gebruik molariteit × volume.");
    if (calculationChecked && !molarityOk) items.add("Molariteit wijkt af: deel de mol stof in de erlenmeyer door het monstervolume in liter.");
    if (calculationChecked && simulation.taskType === "massa-aandeel" && !massPercentageOk) items.add("Massa-aandeel wijkt af: reken mol om naar gram en deel door de monstermassa.");
    return Array.from(items);
  }, [accuracy.level, accuracy.text, calculationChecked, massPercentageOk, molarityOk, procedureWarnings, reading.messages, schellbachChoice, setupFeedback, simulation.taskType, titrantMolOk]);
  const score = scoreTitration({
    setup,
    procedure,
    procedureWarnings,
    deviationMl: accuracy.deviation,
    allowedErrorMl: simulation.allowedErrorMl,
    readingOk,
    calculationOk,
    finalOk: accuracy.level === "good" && readingOk && calculationOk,
  });

  const resetSimulation = (nextId = selectedId) => {
    if (nextId !== selectedId) setMeasurements([]);
    setRecorded(false); setLabMessage("");
    setSelectedId(nextId);
    setSetup(setupChallenge ? cloneSetup() : readySetup());
    setProcedure(cloneProcedure());
    setCurrentAddedMl(0);
    setValveSetting("dicht");
    setStartInput("");
    setEndInput("");
    setSchellbachChoice("");
    setCalculationInputs(emptyCalculationInputs());
    setCalculationChecked(false);
    setSaved(false);
    setActiveProcedureAnimation(null);
  };

  const saveProgress = () => {
    if (saved || !procedure.readEnd || !calculationChecked || valveSetting !== "dicht") return;
    const next = updateTitrationProgress(progress, score, accuracy.deviation, simulation.id, mistakes);
    setProgress(next);
    onSaveProgress(next);
    setSaved(true);
  };
  const asset = (id: string) => visualAssetRegistry.find((item) => item.id === id);
  const setMode = (next: TitrationLabMode) => {
    setValveSetting("dicht");
    setLabMode(next);
    if (next !== "uitleg" && !setupChallenge) setSetup(readySetup());
  };
  const toggleSetupChallenge = () => {
    setValveSetting("dicht");
    setSetupChallenge((current) => {
      const next = !current;
      setSetup(next ? cloneSetup() : readySetup());
      return next;
    });
  };
  const pulseProcedureAnimation = (key: keyof TitrationProcedureState) => {
    setActiveProcedureAnimation(key);
  };
  const setProcedureStep = (key: keyof TitrationProcedureState, value: boolean, label?: string) => {
    if (currentAddedMl > 0 && ["rinsedBurette", "rinsedPipette", "pipettedSample", "addedIndicator", "filledBurette"].includes(key)) { setLabMessage("Begin een nieuwe meting om het monster of de voorbereiding te veranderen."); return; }
    if (value) {
      if (!Object.values(setup).every(Boolean)) { setLabMessage("Maak eerst de opstelling compleet."); return; }
      const previous = PROCEDURE_ORDER.slice(0, PROCEDURE_ORDER.indexOf(key));
      if (previous.some(step => !procedure[step])) { setLabMessage("Voer eerst de eerdere stappen uit en noteer je beginstand."); return; }
      if (key === "readStart" || key === "readEnd") { setLabMessage("Noteer de buretstand in het afleespaneel hieronder."); return; }
      if (key === "titratedSlowly") { changeValve("langzaam"); return; }
      if (key === "stoppedAtEndpoint") { setValveSetting("dicht"); }
    }
    setProcedure(current => {
      const next = { ...current, [key]: value };
      if (!value) PROCEDURE_ORDER.slice(PROCEDURE_ORDER.indexOf(key) + 1).forEach(step => { next[step] = false; });
      return next;
    });
    setLabMessage(""); setSaved(false);
    if (label) pulseProcedureAnimation(key);
  };
  function changeValve(next: ValveSetting) {
    if (next !== "dicht" && !canDose) return;
    setValveSetting(next);
    if (next !== "dicht") {
      setSaved(false); setRecorded(false); setEndInput(""); setCalculationChecked(false);
      setProcedure(current => ({ ...current, titratedSlowly: current.titratedSlowly || next === "langzaam", stoppedAtEndpoint: false, readEnd: false }));
    }
  }
  function addDrop() {
    if (!canDose || valveSetting !== "dicht") return;
    setCurrentAddedMl(current => Math.min(49.65, Math.round((current + .03) * 100) / 100));
    setProcedure(current => ({ ...current, titratedSlowly: true, stoppedAtEndpoint: false, readEnd: false }));
    setEndInput(""); setSaved(false); setRecorded(false); setCalculationChecked(false);
  }
  const handleStartInput = (value: string) => {
    if (currentAddedMl > 0 || !procedure.filledBurette) { setLabMessage("Noteer de beginstand na het vullen, vóór je begint te titreren."); return; }
    setStartInput(value);
    const valid = parseDutchNumber(value) !== null && Math.abs(parseDutchNumber(value)! - START_READING_ML) <= .05;
    setProcedure(current => ({ ...current, readStart: valid }));
    if (valid) setLabMessage("");
  };
  const handleEndInput = (value: string) => {
    if (valveSetting !== "dicht" || !currentAddedMl) { setLabMessage("Sluit de kraan na het titreren voordat je de eindstand noteert."); return; }
    setEndInput(value); setSaved(false); setRecorded(false); setCalculationChecked(false);
    const valid = parseDutchNumber(value) !== null && Math.abs(parseDutchNumber(value)! - actualEndMl) <= .05;
    setProcedure(current => ({ ...current, readEnd: valid, stoppedAtEndpoint: true }));
    setLabMessage("");
  };
  const selectedMeasurements = measurements.filter(row => row.included);
  const average = selectedMeasurements.length ? selectedMeasurements.reduce((sum, row) => sum + row.volume, 0) / selectedMeasurements.length : null;
  const preparationComplete = PROCEDURE_ORDER.slice(0, 5).every((step) => procedure[step]);
  const activePhase = !preparationComplete ? 0 : !procedure.readStart ? 1 : !procedure.stoppedAtEndpoint ? 2 : !procedure.readEnd ? 3 : 4;
  const phaseInstructions = [
    labMode === "begeleid" ? "Werk de voorbereiding stap voor stap af." : "Voer de voorbereiding uit en markeer elke handeling.",
    labMode === "begeleid" ? "Lees de onderkant van de meniscus op ooghoogte af en noteer de beginstand." : "Noteer de beginstand voordat je titrant toevoegt.",
    labMode === "begeleid" ? "Doseer en zwenk. Schakel bij de omslag over op druppelen." : "Volg de kleuromslag en stop wanneer die bij zwenken blijvend is.",
    labMode === "begeleid" ? "Sluit de kraan. Lees de eindstand op ooghoogte af en controleer de Schellbachstreep." : "Noteer de eindstand en kies hoe je de meniscus hebt afgelezen.",
    labMode === "begeleid" ? "Reken met je gemeten volume. Controleer daarna je uitkomst." : "Gebruik je meting en de reactieverhouding om de concentratie te berekenen.",
  ];
  const readingMessages = activePhase === 1
    ? reading.messages.filter((message) => message.startsWith("Vul de beginstand") || message.startsWith("Beginstand") || message.startsWith("Noteer buretstanden"))
    : reading.messages.filter((message) => message.startsWith("Vul de eindstand") || message.startsWith("Eindstand") || message.startsWith("Noteer buretstanden") || message.startsWith("Buretaflezing klopt"));
  const dosingWarning = procedureWarnings.find((warning) => warning.startsWith("Te snel rond het eindpunt") || warning.startsWith("Je bent voorbij het eindpunt"));
  const explainerFigure = asset("visual-titration-steps");
  const explainerMetadata = getFigureByAssetId("visual-titration-steps");

  return <div className={`titration-page titration-mode-${labMode}`}>
    <header className="titration-header">
      <div className="titration-title">
        <span className="section-kicker">Practicum · M10</span>
        <h1>TitratieLab</h1>
      </div>
      <div className="titration-header-controls">
        <nav className="titration-mode-tabs" aria-label="TitratieLab modus">
          {([
            ["uitleg", "Uitleg"],
            ["begeleid", "Begeleid"],
            ["zelf", "Zelf"],
          ] as const).map(([id, label]) => <button type="button" key={id} className={labMode === id ? "active" : ""} aria-pressed={labMode === id} onClick={() => setMode(id)}>{label}</button>)}
        </nav>
        <label className="titration-scenario-control">
          <span>Scenario</span>
          <select value={simulation.id} onChange={(event) => resetSimulation(event.target.value)}>
            {titrationSimulations.map((item) => <option key={item.id} value={item.id}>{item.titel}</option>)}
          </select>
        </label>
        <button type="button" className="titration-reset-button" onClick={() => resetSimulation()}><ArrowClockwise size={16} /> Nieuwe meting</button>
      </div>
    </header>

    {labMode === "uitleg" ? <section className="titration-overview">
      <div className="titration-overview-copy">
        <span className="section-kicker">In vijf stappen</span>
        <h2>Zo werkt titreren</h2>
        <p>Je bepaalt de concentratie van een monster met een oplossing waarvan de molariteit bekend is.</p>
        <ol className="titration-overview-steps">
          <li><strong>Voorbereiden</strong><span>Spoel buret met titrant en pipet met monster. Pipetteer het monster, voeg indicator toe en vul de buret.</span></li>
          <li><strong>Beginstand</strong><span>Lees de onderkant van de meniscus op ooghoogte af.</span></li>
          <li><strong>Titreren</strong><span>Voeg titrant toe en zwenk de erlenmeyer. Druppel langzaam bij de kleuromslag.</span></li>
          <li><strong>Eindstand</strong><span>Sluit de kraan en lees opnieuw af. De Schellbachstreep helpt de onderkant van de meniscus te zien.</span></li>
          <li><strong>Berekenen</strong><span>Gebruikt volume = eindstand − beginstand. Zet mL om naar L en gebruik de reactieverhouding.</span></li>
        </ol>
        <p className="titration-overview-note">Extra demiwater in de erlenmeyer verandert het aantal mol monster niet.</p>
        <button type="button" className="primary-button" onClick={() => setMode("begeleid")}>Start begeleid oefenen</button>
      </div>
      {explainerFigure?.path && <FigureBlock
        src={explainerFigure.path}
        alt={explainerFigure.alt ?? "Overzicht van de stappen bij een titratie"}
        title={explainerMetadata?.title ?? explainerFigure.topic ?? "Stappen bij een titratie"}
        figureNumber={explainerMetadata?.number}
        caption={explainerFigure.caption}
        status={explainerFigure.status}
      />}
    </section> : <>
      <main className="titration-workbench" aria-label="Titratie werkbank">
        <section className="titration-apparatus-column" aria-label="Opstelling en titratie">
          <TitrationSetup
            simulation={simulation}
            setup={setup}
            currentAddedMl={currentAddedMl}
            startReadingMl={START_READING_ML}
            valveSetting={valveSetting}
            endpointState={endpointState}
            hasIndicator={procedure.addedIndicator}
            filled={procedure.filledBurette}
            hasSample={procedure.pipettedSample}
            canDose={canDose}
            onDrop={addDrop}
            onValveChange={changeValve}
            procedureAnimation={activeProcedureAnimation ?? undefined}
          />
          {activePhase === 2 && procedure.addedIndicator && <div className={"endpoint-hint endpoint-" + endpointState} aria-live="polite">
            <TestTube size={19} />
            <div>
              <strong>{endpointLabel(endpointState, simulation)}</strong>
              {labMode === "begeleid" && <p>{endpointHint(endpointState, simulation)}</p>}
              {labMode === "zelf" && <p>Observeer de kleur na zwenken.</p>}
            </div>
          </div>}
        </section>

        <aside className="titration-console" aria-labelledby="titration-console-title">
          <header className="titration-console-header">
            <div>
              <span className="section-kicker">{labMode === "begeleid" ? "Begeleid oefenen" : "Zelf oefenen"}</span>
              <h2 id="titration-console-title">Nu doen</h2>
            </div>
            <span className="titration-phase-count">{activePhase + 1} / 5</span>
          </header>
          <ol className="titration-progress-strip" aria-label="Voortgang van de titratie">
            {PHASE_LABELS.map((label, index) => <li key={label} className={index === activePhase ? "active" : index < activePhase ? "complete" : ""} aria-current={index === activePhase ? "step" : undefined}>
              <span className="titration-progress-number">{index < activePhase ? "✓" : index + 1}</span>
              <span>{label}</span>
            </li>)}
          </ol>
          <p className="titration-phase-instruction">{phaseInstructions[activePhase]}</p>
          {labMessage && <p className="titration-console-message" role="status">{labMessage}</p>}

          {activePhase === 0 && <TitrationStepPanel
            setup={setup}
            procedure={procedure}
            setupFeedback={setupFeedback}
            setupChallenge={setupChallenge}
            showHints={labMode === "begeleid"}
            activeProcedureAnimation={activeProcedureAnimation}
            onToggleSetupChallenge={toggleSetupChallenge}
            onToggleSetup={(key) => setSetup((current) => ({ ...current, [key]: !current[key] }))}
            onSetProcedure={setProcedureStep}
          />}

          {activePhase === 1 && <BuretteReadingPanel
            focus="start"
            startInput={startInput}
            endInput={endInput}
            actualStartMl={START_READING_ML}
            actualEndMl={actualEndMl}
            messages={readingMessages}
            schellbachChoice={schellbachChoice}
            onStartInput={handleStartInput}
            onEndInput={handleEndInput}
            onSchellbachChoice={setSchellbachChoice}
          />}

          {activePhase === 2 && <section className="titration-console-section titration-dosing-console">
            <span className="section-kicker">Kraan en eindpunt</span>
            <h3>{valveSetting === "dicht" ? "Doseer via de opstelling" : "Titrant stroomt"}</h3>
            <p>{labMode === "begeleid" ? "Gebruik de kraan onder de buret. Zwenk na het doseren en schakel rond de omslag over op druppelen." : "Doseer, zwenk en volg de kleuromslag in de erlenmeyer."}</p>
            {labMode === "begeleid" && dosingWarning && <p className="titration-inline-warning"><TestTube size={15} /> {dosingWarning}</p>}
            <button type="button" className="secondary-button" disabled={valveSetting !== "dicht" || currentAddedMl <= 0} onClick={() => setProcedureStep("stoppedAtEndpoint", true, "stoppedAtEndpoint")}>Klaar met titreren</button>
          </section>}

          {activePhase === 3 && <BuretteReadingPanel
            focus="end"
            startInput={startInput}
            endInput={endInput}
            actualStartMl={START_READING_ML}
            actualEndMl={actualEndMl}
            messages={readingMessages}
            schellbachChoice={schellbachChoice}
            onStartInput={handleStartInput}
            onEndInput={handleEndInput}
            onSchellbachChoice={setSchellbachChoice}
          />}

          {activePhase === 4 && <TitrationCalculationPanel
            simulation={simulation}
            usedVolumeMl={usedVolumeMl > 0 ? usedVolumeMl : null}
            expected={expected}
            inputs={calculationInputs}
            checked={calculationChecked}
            titrantMolOk={titrantMolOk}
            molarityOk={molarityOk}
            massPercentageOk={massPercentageOk}
            onChange={(next) => { setCalculationInputs(next); setSaved(false); }}
            onCheck={() => setCalculationChecked(true)}
          />}

          {activePhase === 4 && calculationChecked && procedure.readEnd && <TitrationFeedbackPanel
            endpointText={endpointLabel(endpointState, simulation)}
            accuracyLevel={accuracy.level}
            accuracyText={accuracy.text}
            deviationMl={accuracy.deviation}
            score={score}
            progress={progress}
            mistakes={mistakes}
            saved={saved}
            onSave={saveProgress}
          />}
        </aside>

        {procedure.readEnd && <details className="titration-history">
          <summary>Meetgeschiedenis <span>{measurements.length} meting(en)</span></summary>
          <p>Leg een aflezing vast en vergelijk herhalingen. Gebruik alleen vergelijkbare metingen voor het gemiddelde.</p>
          <button type="button" className="ghost-button compact-button" disabled={!readingOk || valveSetting !== "dicht" || recorded || !procedure.readEnd} onClick={() => { setMeasurements(rows => [...rows, { volume: reading.usedVolume!, included: true }]); setRecorded(true); }}>Meting vastleggen</button>
          {measurements.length > 0 ? <>
            <table><thead><tr><th>Gebruik</th><th>Meting</th><th>Verbruik</th></tr></thead><tbody>{measurements.map((row, index) => <tr key={index}>
              <td><input type="checkbox" aria-label={"Gebruik meting " + (index + 1)} checked={row.included} onChange={() => setMeasurements(rows => rows.map((item, rowIndex) => rowIndex === index ? { ...item, included: !item.included } : item))} /></td>
              <td>{index + 1}</td><td>{row.volume.toFixed(2).replace(".", ",")} mL</td>
            </tr>)}</tbody></table>
            <p><strong>Gemiddeld: {average === null ? "—" : average.toFixed(2).replace(".", ",") + " mL"}</strong> · {selectedMeasurements.length} metingen</p>
            {selectedMeasurements.length > 1 && Math.max(...selectedMeasurements.map((row) => row.volume)) - Math.min(...selectedMeasurements.map((row) => row.volume)) > .2 && <p role="status">Deze waarden verschillen meer dan 0,20 mL. Onderzoek de oorzaak en doe een extra meting.</p>}
          </> : <p className="muted">Nog geen metingen vastgelegd.</p>}
        </details>}
      </main>
    </>}
  </div>;
}
