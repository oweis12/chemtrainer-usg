import { ArrowClockwise, BookOpenText, Flask, Info, TestTube } from "@phosphor-icons/react";
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

const procedureActionCopy: Partial<Record<keyof TitrationProcedureState, string>> = {
  rinsedBurette: "De bekende oplossing spoelt de buret, zodat de titrant niet wordt verdund.",
  rinsedPipette: "De pipet bevat nu dezelfde oplossing als het monster.",
  pipettedSample: "Je brengt een nauwkeurig volume monsteroplossing in de erlenmeyer.",
  addedIndicator: "De indicator laat straks met een kleurverandering zien wanneer het eindpunt bereikt is.",
  filledBurette: "De buret is gevuld met een oplossing met bekende molariteit.",
  readStart: "Gebruik: eindstand − beginstand = gebruikt volume.",
  titratedSlowly: "Rond het eindpunt voorkom je overshoot door langzaam te druppelen.",
  stoppedAtEndpoint: "Sluit de kraan bij de omslag. Bij zoutzuur als titrant verdwijnt het roze.",
  readEnd: "Gebruik: eindstand − beginstand = gebruikt volume.",
};

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
  const [lastProcedureAction, setLastProcedureAction] = useState<string>("");
  const [labMessage, setLabMessage] = useState("");
  const [measurements, setMeasurements] = useState<Array<{ volume: number; included: boolean }>>([]);
  const [recorded, setRecorded] = useState(false);
  const [currentProcedureIndex, setCurrentProcedureIndex] = useState(0);

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
    setLastProcedureAction("");
    setCurrentProcedureIndex(0);
  };

  const saveProgress = () => {
    if (saved || !procedure.readEnd || !calculationChecked || valveSetting !== "dicht") return;
    const next = updateTitrationProgress(progress, score, accuracy.deviation, simulation.id, mistakes);
    setProgress(next);
    onSaveProgress(next);
    setSaved(true);
  };
  const asset = (id: string) => visualAssetRegistry.find((item) => item.id === id);
  const imageIds = ["visual-titration-setup", "visual-titration-meniscus", "visual-titration-schellbach", "visual-titration-steps"];
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
  const pulseProcedureAnimation = (key: keyof TitrationProcedureState, label: string) => {
    setLastProcedureAction(label);
    setActiveProcedureAnimation(key);
    const nextIndex = PROCEDURE_ORDER.indexOf(key);
    if (nextIndex >= 0) setCurrentProcedureIndex(nextIndex);
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
    if (label) pulseProcedureAnimation(key, label);
    if (value) setCurrentProcedureIndex(Math.min(PROCEDURE_ORDER.indexOf(key) + 1, 8));
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
    if (valid) { setCurrentProcedureIndex(6); setLabMessage(""); }
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

  return <div className="titration-page">
    <section className="page-intro intro-inline titration-hero">
      <div>
        <span className="section-kicker">Practicum · M10</span>
        <h1>Bepaal de molariteit van je monster.</h1>
        <p>Bepaal een onbekende molariteit. Bereid je monster voor, titreer tot de kleuromslag en reken met je eigen meting.</p>
      </div>
      <div className="titration-lab-stamp"><Flask size={22} weight="duotone" /><span>TitratieLab</span></div>
    </section>

    <div className="titration-mode-tabs" aria-label="TitratieLab modus">
      {([
        ["uitleg", "Uitleg"],
        ["begeleid", "Begeleid oefenen"],
        ["zelf", "Zelf oefenen"],
      ] as const).map(([id, label]) => <button key={id} className={labMode === id ? "active" : ""} onClick={() => setMode(id)}>{label}</button>)}
    </div>

    {labMode === "uitleg" && <section className="titration-explainer">
      <div className="titration-explainer-head">
        <BookOpenText size={27} weight="duotone" />
        <div>
          <span className="section-kicker">Uitlegmodus</span>
          <h2>Bekijk eerst de opstelling.</h2>
          <p>Een titratie wordt veel makkelijker als je de woorden aan de spullen koppelt. In figuur 1 zie je de volledige opstelling; figuur 2 laat de meniscus op ooghoogte zien en figuur 3 laat zien hoe de Schellbachstreep helpt bij aflezen.</p>
        </div>
      </div>
      <div className="titration-image-grid">
        {imageIds.map((id) => {
          const item = asset(id);
          const figure = getFigureByAssetId(id);
          return <FigureBlock key={id} src={item?.path} alt={item?.alt ?? id} title={figure?.title ?? item?.topic ?? id} figureNumber={figure?.number} caption={item?.caption} status={item?.status} />;
        })}
      </div>
      <p className="titration-figure-reference">Zoals in figuur 4 zichtbaar is: je leest eerst de beginstand af, titreert rustig tot het eindpunt, leest daarna de eindstand af en rekent pas dan met het gebruikte volume in liter.</p>
      <div className="titration-learning-grid">
        <div className="titration-rinsing-note">
          <span className="section-kicker">Glaswerk spoelen</span>
          <p>Bij nauwkeurig titreren spoel je de buret met de bekende oplossing in de buret. De pipet spoel je met de monsteroplossing. De erlenmeyer mag met demiwater worden nagespoeld, want extra water verandert het aantal mol stof in de erlenmeyer niet.</p>
        </div>
      </div>
      <div className="titration-glossary">
        {[
          ["titrant", "oplossing met bekende molariteit in de buret"],
          ["monsteroplossing", "te onderzoeken oplossing waarvan je iets wilt bepalen"],
          ["indicator", "stof die van kleur verandert rond het eindpunt"],
          ["equivalentiepunt", "punt waarop precies genoeg titrant is toegevoegd om volledig te reageren"],
          ["buret", "glazen meetbuis waarmee je nauwkeurig vloeistof toevoegt"],
          ["erlenmeyer", "kolf waarin de monsteroplossing zit"],
          ["pipet", "glaswerk waarmee je een nauwkeurig vast volume afmeet"],
          ["molariteit", "hoeveelheid mol opgeloste stof per liter oplossing"],
          ["molmassa", "massa van 1 mol stof in g/mol"],
        ].map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}
      </div>
      <div className="titration-open-row">
        <button className="secondary-button" onClick={() => setMode("begeleid")}>Open interactieve simulatie</button>
      </div>
    </section>}

    {labMode !== "uitleg" && <>

    <section className="titration-sim-grid" aria-label="Kies titratie-simulatie">
      {titrationSimulations.map((item) => <button key={item.id} className={`titration-sim-card ${item.id === simulation.id ? "active" : ""}`} onClick={() => resetSimulation(item.id)}>
        <span>{item.taskType}</span>
        <strong>{item.titel}</strong>
        <small>{item.analyteVolumeMl.toFixed(2)} mL monster · {item.titrantMolarity.toFixed(4)} mol/L {item.titrantName}</small>
      </button>)}
    </section>

    <section className="titration-mode-helper">
      <div>
        <span className="section-kicker">{labMode === "begeleid" ? "Begeleid oefenen" : "Zelf oefenen"}</span>
        <p>{labMode === "begeleid" ? "De basisopstelling staat klaar en de app geeft hulp bij fouten. De titrant is de bekende oplossing in de buret; de monsteroplossing zit in de erlenmeyer." : "Werk de meting zelfstandig uit. Controleer na afloop je aflezing en berekening."}</p>
      </div>
      <button className={setupChallenge ? "completed-button" : "ghost-button"} onClick={toggleSetupChallenge}>Extra oefenen: stel zelf de opstelling samen</button>
    </section>

    <section className="titration-workspace">
      <div className="titration-main-column">
        <TitrationSetup
          simulation={simulation}
          setup={setup}
          currentAddedMl={currentAddedMl}
          startReadingMl={START_READING_ML}
          valveSetting={valveSetting}
          endpointState={endpointState}
          hasIndicator={procedure.addedIndicator}
          filled={procedure.filledBurette} hasSample={procedure.pipettedSample} canDose={canDose} onDrop={addDrop}
          onValveChange={changeValve}
          procedureAnimation={activeProcedureAnimation ?? undefined}
        />
        {lastProcedureAction && <div className="titration-action-banner" aria-live="polite">{procedureActionCopy[lastProcedureAction as keyof TitrationProcedureState] ?? ""}</div>}
        {procedure.addedIndicator && <div className={`endpoint-hint endpoint-${endpointState}`}>
          <TestTube size={20} weight="duotone" />
          <div>
            <strong>{endpointLabel(endpointState, simulation)}</strong>
            <p>{labMode === "begeleid" ? endpointHint(endpointState, simulation) : "Observeer de kleur na zwenken en bepaal zelf wanneer je stopt."}</p>
          </div>
        </div>
        }
        <section className="titration-panel lab-notebook">
          <span className="section-kicker">Meetlogboek</span><h2>Vergelijk je metingen</h2>
          <p>Noteer je verbruik en herhaal de proef. Vink alleen vergelijkbare metingen aan voor het gemiddelde.</p>
          <button className="secondary-button" disabled={!readingOk || valveSetting !== "dicht" || recorded || !procedure.readEnd} onClick={() => { setMeasurements(rows => [...rows, { volume: reading.usedVolume!, included: true }]); setRecorded(true); }}>Meting vastleggen</button>
          {measurements.length > 0 ? <><table><thead><tr><th>Gebruik</th><th>Meting</th><th>Verbruik</th></tr></thead><tbody>{measurements.map((row, index) => <tr key={index}><td><input type="checkbox" aria-label={`Gebruik meting ${index+1}`} checked={row.included} onChange={() => setMeasurements(rows => rows.map((r,i) => i===index?{...r,included:!r.included}:r))}/></td><td>{index+1}</td><td>{row.volume.toFixed(2).replace('.',',')} mL</td></tr>)}</tbody></table><p><strong>Gemiddeld: {average === null ? "—" : `${average.toFixed(2).replace('.',',')} mL`}</strong> · {selectedMeasurements.length} metingen</p>{selectedMeasurements.length>1 && Math.max(...selectedMeasurements.map(r=>r.volume))-Math.min(...selectedMeasurements.map(r=>r.volume))>.2 && <p role="status">Deze waarden verschillen meer dan 0,20 mL. Onderzoek de oorzaak en doe een extra meting.</p>}</> : <p className="muted">Nog geen metingen vastgelegd.</p>}
        </section>
        <button className="ghost-button" onClick={() => resetSimulation()}><ArrowClockwise size={17} /> Nieuwe meting</button>
      </div>

      <div className="titration-side-column">
        {labMessage && <p className="lab-action-message" role="status">{labMessage}</p>}
        <TitrationStepPanel
          setup={setup}
          procedure={procedure}
          setupFeedback={setupFeedback}
          procedureWarnings={procedureWarnings}
          valveSetting={valveSetting}
          endpointState={endpointState}
          hasStartReading={procedure.readStart}
          hasEndReading={procedure.readEnd}
          showSetupBuilder={setupChallenge}
          showProcedureWarnings={labMode === "begeleid"}
          activeProcedureAnimation={activeProcedureAnimation}
          currentProcedureIndex={currentProcedureIndex}
          onToggleSetup={(key) => setSetup((current) => ({ ...current, [key]: !current[key] }))}
          onSetProcedure={setProcedureStep}
          onChangeProcedureIndex={setCurrentProcedureIndex}
        />
        <BuretteReadingPanel
          startInput={startInput}
          endInput={endInput}
          actualStartMl={START_READING_ML}
          actualEndMl={actualEndMl}
          messages={reading.messages}
          schellbachChoice={schellbachChoice}
          onStartInput={handleStartInput}
          onEndInput={handleEndInput}
          onSchellbachChoice={setSchellbachChoice}
        />
        <TitrationCalculationPanel
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
        />
        {calculationChecked && procedure.readEnd && <TitrationFeedbackPanel
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
      </div>
    </section>

    <section className="titration-note">
      <Info size={19} />
      <p>Het echte equivalentievolume blijft tijdens het titreren verborgen. Net als in het practicum moet je sturen op kleur, rustig druppelen en daarna met je eigen buretstanden rekenen.</p>
    </section>
    </>}
  </div>;
}
