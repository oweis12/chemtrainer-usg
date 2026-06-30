import { ArrowClockwise, BookOpenText, Flask, Info, PlayCircle, TestTube } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { FigureBlock } from "../components/content/FigureBlock";
import { ProcedureActionPreview } from "../components/titration/ProcedureActionPreview";
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
  clampVolume,
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
  if (simulation.indicator.toLowerCase().includes("fenolftale")) {
    if (state === "voor") return "Nog kleurloos: er is nog zuur/base over in de erlenmeyer.";
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
  stoppedAtEndpoint: "Stop bij blijvende lichte kleur, niet bij felroze.",
  readEnd: "Gebruik: eindstand − beginstand = gebruikt volume.",
};

export function TitrationLab({ progress: storedProgress, onSaveProgress }: { progress: TitrationLabProgress; onSaveProgress: (progress: TitrationLabProgress) => void }) {
  const [labMode, setLabMode] = useState<TitrationLabMode>("uitleg");
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
  const [currentProcedureIndex, setCurrentProcedureIndex] = useState(0);

  useEffect(() => {
    setProgress(storedProgress);
  }, [storedProgress]);

  useEffect(() => {
    if (labMode !== "uitleg" && !setupChallenge) setSetup(readySetup());
  }, [labMode, setupChallenge]);

  useEffect(() => {
    if (valveSetting === "dicht") return;
    const timer = window.setInterval(() => {
      setCurrentAddedMl((current) => clampVolume(current + flowRateMlPerTick(valveSetting)));
    }, 320);
    return () => window.clearInterval(timer);
  }, [valveSetting]);

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
    const next = updateTitrationProgress(progress, score, accuracy.deviation, simulation.id, mistakes);
    setProgress(next);
    onSaveProgress(next);
    setSaved(true);
  };
  const asset = (id: string) => visualAssetRegistry.find((item) => item.id === id);
  const imageIds = ["visual-titration-setup", "visual-titration-meniscus", "visual-titration-schellbach", "visual-titration-steps"];
  const setMode = (next: TitrationLabMode) => {
    setLabMode(next);
    if (next !== "uitleg" && !setupChallenge) setSetup(readySetup());
  };
  const toggleSetupChallenge = () => {
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
    setProcedure((current) => ({ ...current, [key]: value }));
    if (label) pulseProcedureAnimation(key, label);
  };
  const handleStartInput = (value: string) => {
    setStartInput(value);
    if (value.trim()) setProcedureStep("readStart", true, "readStart");
  };
  const handleEndInput = (value: string) => {
    setEndInput(value);
    if (value.trim()) setProcedureStep("readEnd", true, "readEnd");
  };

  return <div className="titration-page">
    <section className="page-intro intro-inline titration-hero">
      <div>
        <span className="section-kicker">TitratieLab V1</span>
        <h1>Oefen titreren alsof je naast de docent aan de labtafel staat.</h1>
        <p>Bouw de opstelling, draai aan het kraantje, lees de buret af en werk de berekening uit met je eigen gemeten volume.</p>
      </div>
      <div className="titration-lab-stamp"><Flask size={22} weight="duotone" /><span>2D lab · lokaal opgeslagen</span></div>
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
        <div className="titration-video-placeholder">
          <PlayCircle size={33} weight="duotone" />
          <h3>Bekijk een korte uitlegvideo</h3>
          <p>Hier kan later een korte uitlegvideo worden toegevoegd.</p>
        </div>
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
        <p>{labMode === "begeleid" ? "De basisopstelling staat klaar en de app geeft hulp bij fouten. De titrant is de bekende oplossing in de buret; de monsteroplossing zit in de erlenmeyer." : "Je krijgt minder directe hulp. Bouw de opstelling alleen als extra challenge; normaal oefen je vooral eindpunt, aflezen en berekenen."}</p>
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
          onValveChange={(next) => {
            setValveSetting(next);
            if (next === "langzaam") setProcedure((current) => ({ ...current, titratedSlowly: true }));
          }}
          procedureAnimation={activeProcedureAnimation ?? undefined}
        />
        {lastProcedureAction && <div className="titration-action-banner" aria-live="polite">{procedureActionCopy[lastProcedureAction as keyof TitrationProcedureState] ?? ""}</div>}
        <div className={`endpoint-hint endpoint-${endpointState}`}>
          <TestTube size={20} weight="duotone" />
          <div>
            <strong>{endpointLabel(endpointState, simulation)}</strong>
            <p>{endpointHint(endpointState, simulation)}</p>
          </div>
        </div>
        <button className="ghost-button" onClick={() => resetSimulation()}><ArrowClockwise size={17} /> Reset deze simulatie</button>
      </div>

      <div className="titration-side-column">
        <ProcedureActionPreview action={activeProcedureAnimation} />
        <TitrationStepPanel
          setup={setup}
          procedure={procedure}
          setupFeedback={setupFeedback}
          procedureWarnings={procedureWarnings}
          valveSetting={valveSetting}
          endpointState={endpointState}
          hasStartReading={Boolean(startInput.trim())}
          hasEndReading={Boolean(endInput.trim())}
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
        <TitrationFeedbackPanel
          endpointText={endpointLabel(endpointState, simulation)}
          accuracyLevel={accuracy.level}
          accuracyText={accuracy.text}
          deviationMl={accuracy.deviation}
          score={score}
          progress={progress}
          mistakes={mistakes}
          saved={saved}
          onSave={saveProgress}
        />
      </div>
    </section>

    <section className="titration-note">
      <Info size={19} />
      <p>Het echte equivalentievolume blijft tijdens het titreren verborgen. Net als in het practicum moet je sturen op kleur, rustig druppelen en daarna met je eigen buretstanden rekenen.</p>
    </section>
    </>}
  </div>;
}
