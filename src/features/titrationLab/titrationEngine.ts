import type { EndpointState, TitrationLabProgress, TitrationSimulation, ValveSetting } from "../../types";

export interface TitrationProcedureState {
  rinsedBurette: boolean;
  rinsedPipette: boolean;
  pipettedSample: boolean;
  addedIndicator: boolean;
  filledBurette: boolean;
  readStart: boolean;
  titratedSlowly: boolean;
  stoppedAtEndpoint: boolean;
  readEnd: boolean;
}

export interface TitrationSetupSelection {
  stand: boolean;
  burette: boolean;
  stopcock: boolean;
  erlenmeyer: boolean;
  pipette: boolean;
  indicator: boolean;
}

export interface TitrationCalculationResult {
  titrantMol: number;
  analyteMol: number;
  analyteMolarity: number;
  analyteMassG?: number;
  massPercentage?: number;
}

export interface TitrationScore {
  setup: number;
  procedure: number;
  accuracy: number;
  reading: number;
  calculation: number;
  finalAnswer: number;
  total: number;
}

export const titrationProcedureDefaults: TitrationProcedureState = {
  rinsedBurette: false,
  rinsedPipette: false,
  pipettedSample: false,
  addedIndicator: false,
  filledBurette: false,
  readStart: false,
  titratedSlowly: false,
  stoppedAtEndpoint: false,
  readEnd: false,
};

export const titrationSetupDefaults: TitrationSetupSelection = {
  stand: false,
  burette: false,
  stopcock: false,
  erlenmeyer: false,
  pipette: false,
  indicator: false,
};

export const initialTitrationLabProgress: TitrationLabProgress = {
  completedCount: 0,
  bestDeviationMl: null,
  averageScore: 0,
  frequentMistakes: [],
};

export function clampVolume(value: number) {
  return Math.max(0, Math.min(50, value));
}

export function flowRateMlPerTick(setting: ValveSetting) {
  if (setting === "langzaam") return 0.03;
  if (setting === "normaal") return 0.12;
  if (setting === "snel") return 0.42;
  return 0;
}

export function getEndpointState(addedMl: number, targetMl: number, allowedErrorMl: number): EndpointState {
  if (addedMl < targetMl - Math.max(0.45, allowedErrorMl * 2)) return "voor";
  if (addedMl < targetMl - allowedErrorMl) return "bijna";
  if (Math.abs(addedMl - targetMl) <= allowedErrorMl) return "goed";
  return "te_ver";
}

export function endpointLabel(state: EndpointState, simulation: TitrationSimulation) {
  if (simulation.indicator.toLowerCase().includes("fenolftale")) {
    if (state === "voor") return "kleurloos";
    if (state === "bijna") return "heel licht roze, verdwijnt nog";
    if (state === "goed") return "blijvend lichtroze";
    return "donker/fel roze";
  }
  if (state === "voor") return "beginkleur";
  if (state === "bijna") return "kleur begint om te slaan";
  if (state === "goed") return "blijvende lichte omslagkleur";
  return "te sterke omslagkleur";
}

export function accuracyFeedback(addedMl: number, simulation: TitrationSimulation) {
  const deviation = addedMl - simulation.equivalenceVolumeMl;
  const absDeviation = Math.abs(deviation);
  if (absDeviation <= simulation.allowedErrorMl) return { level: "good" as const, deviation, text: "Goed getitreerd: je zit binnen de toegestane afwijking." };
  if (deviation < 0) return { level: "early" as const, deviation, text: "Te vroeg gestopt: het equivalentiepunt is nog niet bereikt." };
  if (absDeviation <= simulation.allowedErrorMl * 3) return { level: "ok" as const, deviation, text: "Iets te ver: acceptabel om te bespreken, maar minder nauwkeurig." };
  return { level: "bad" as const, deviation, text: "Veel te ver: de meting is onbetrouwbaar." };
}

export function evaluateSetup(selection: TitrationSetupSelection) {
  const feedback: string[] = [];
  if (!selection.burette) feedback.push("Je mist de buret.");
  if (!selection.stand && selection.burette) feedback.push("De buret moet in een statief hangen.");
  if (!selection.erlenmeyer) feedback.push("De erlenmeyer staat niet onder de buret.");
  if (!selection.stopcock && selection.burette) feedback.push("Je mist het kraantje onder de buret.");
  if (!selection.pipette) feedback.push("Je mist de pipet voor het bekende monstervolume.");
  if (!selection.indicator) feedback.push("Je mist de indicator.");
  if (!feedback.length) feedback.push("Goed: de opstelling klopt.");
  return feedback;
}

export function setupScore(selection: TitrationSetupSelection) {
  const values = Object.values(selection);
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function evaluateProcedure(procedure: TitrationProcedureState, valveSetting: ValveSetting, endpointState: EndpointState) {
  const warnings: string[] = [];
  if (!procedure.rinsedBurette) warnings.push("Buret niet met titrant gespoeld: achtergebleven demiwater kan de bekende oplossing verdunnen en de berekende concentratie verstoren.");
  if (!procedure.rinsedPipette) warnings.push("Pipet niet met monsteroplossing gespoeld: dan kan de hoeveelheid onderzochte stof in de erlenmeyer veranderen.");
  if (!procedure.pipettedSample) warnings.push("Geen bekend monstervolume: zonder nauwkeurig gepipetteerd volume kun je c = n / V niet betrouwbaar gebruiken.");
  if (!procedure.addedIndicator) warnings.push("Indicator ontbreekt: je mist het kleurveranderingssignaal bij het eindpunt.");
  if (!procedure.filledBurette) warnings.push("Buret nog niet gevuld: vul met titrant en verwijder luchtbelletjes vóór de beginstand.");
  if (!procedure.readStart) warnings.push("Beginstand ontbreekt: gebruikt volume is eindstand − beginstand, dus je mist de startwaarde.");
  if (valveSetting === "snel" && (endpointState === "bijna" || endpointState === "goed")) warnings.push("Te snel rond het eindpunt: kans op overshoot, dus te veel titrant en een te hoge berekende hoeveelheid analyte.");
  if (!procedure.titratedSlowly) warnings.push("Druppelstand nog niet gebruikt: bij het eindpunt moet je langzaam titreren om overshoot te voorkomen.");
  if (procedure.stoppedAtEndpoint && endpointState === "voor") warnings.push("Stop te vroeg gemarkeerd: het equivalentiepunt is nog niet bereikt.");
  if (procedure.stoppedAtEndpoint && endpointState === "te_ver") warnings.push("Stop te laat gemarkeerd: de kleur is te sterk en het gemeten volume is te groot.");
  if (!procedure.stoppedAtEndpoint && endpointState === "te_ver") warnings.push("Je bent voorbij het eindpunt; de kleur is te sterk en de meting is onbetrouwbaar.");
  if (!procedure.readEnd) warnings.push("Eindstand ontbreekt: sluit de kraan en lees de onderkant van de meniscus opnieuw af.");
  return warnings;
}

export function procedureScore(procedure: TitrationProcedureState, warnings: string[]) {
  const completed = Object.values(procedure).filter(Boolean).length;
  const base = (completed / Object.values(procedure).length) * 100;
  return Math.max(0, Math.round(base - warnings.length * 5));
}

export function calculateFromVolume(simulation: TitrationSimulation, usedVolumeMl: number): TitrationCalculationResult {
  const titrantMol = simulation.titrantMolarity * (usedVolumeMl / 1000);
  const analyteMol = titrantMol * (simulation.moleRatio.analyte / simulation.moleRatio.titrant);
  const analyteMolarity = analyteMol / (simulation.analyteVolumeMl / 1000);
  const analyteMassG = simulation.molarMassAnalyte ? analyteMol * simulation.molarMassAnalyte : undefined;
  const massPercentage = analyteMassG !== undefined && simulation.sampleMassG ? (analyteMassG / simulation.sampleMassG) * 100 : undefined;
  return { titrantMol, analyteMol, analyteMolarity, analyteMassG, massPercentage };
}

export function expectedCalculation(simulation: TitrationSimulation) {
  return calculateFromVolume(simulation, simulation.equivalenceVolumeMl);
}

export function parseDutchNumber(value: string) {
  const superscript: Record<string, string> = { "⁻": "-", "⁺": "+", "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
  const cleaned = value.trim()
    .replace(/\s+/g, "")
    .replace(",", ".")
    .replace(/[×·]/g, "x")
    .replace(/[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (char) => superscript[char] ?? char);
  if (!cleaned) return null;
  const scientific = cleaned.match(/^([+-]?\d*\.?\d+)x10\^?([+-]?\d+)$/i);
  const parsed = scientific ? Number(scientific[1]) * 10 ** Number(scientific[2]) : Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function relativeErrorPercent(actual: number | null, expected: number) {
  if (actual === null || expected === 0) return null;
  return Math.abs((actual - expected) / expected) * 100;
}

export function readingFeedback(startInput: string, endInput: string, actualStartMl: number, actualEndMl: number) {
  const start = parseDutchNumber(startInput);
  const end = parseDutchNumber(endInput);
  const messages: string[] = [];
  const tooManyDecimals = [startInput, endInput].some((input) => {
    const decimal = input.trim().replace(",", ".").match(/\.(\d+)/);
    return decimal ? decimal[1].length > 2 : false;
  });
  if (start === null) messages.push("Vul de beginstand als getal in.");
  if (end === null) messages.push("Vul de eindstand als getal in.");
  if (start !== null && Math.abs(start - actualStartMl) > 0.05) messages.push("Beginstand wijkt te veel af. Lees de onderkant van de meniscus op ooghoogte af.");
  if (end !== null && Math.abs(end - actualEndMl) > 0.05) messages.push("Eindstand wijkt te veel af. Controleer decimalen en meniscus.");
  if (start !== null && end !== null && end < start) messages.push("Eindstand moet groter zijn dan beginstand bij deze buretmeting.");
  const usedVolume = start !== null && end !== null ? end - start : null;
  if (usedVolume !== null && tooManyDecimals) messages.push("Noteer buretstanden bij voorkeur op twee decimalen.");
  if (!messages.length) messages.push("Buretaflezing klopt: eindstand − beginstand geeft het gebruikte volume.");
  return { start, end, usedVolume, messages };
}

export function scoreTitration(args: {
  setup: TitrationSetupSelection;
  procedure: TitrationProcedureState;
  procedureWarnings: string[];
  deviationMl: number;
  allowedErrorMl: number;
  readingOk: boolean;
  calculationOk: boolean;
  finalOk: boolean;
}): TitrationScore {
  const setup = setupScore(args.setup);
  const procedure = procedureScore(args.procedure, args.procedureWarnings);
  const accuracy = Math.max(0, Math.round(100 - (Math.abs(args.deviationMl) / Math.max(args.allowedErrorMl, 0.01)) * 28));
  const reading = args.readingOk ? 100 : 45;
  const calculation = args.calculationOk ? 100 : 45;
  const finalAnswer = args.finalOk ? 100 : 45;
  const total = Math.round(setup * 0.16 + procedure * 0.18 + accuracy * 0.24 + reading * 0.14 + calculation * 0.16 + finalAnswer * 0.12);
  return { setup, procedure, accuracy, reading, calculation, finalAnswer, total };
}

export function updateTitrationProgress(progress: TitrationLabProgress, score: TitrationScore, deviationMl: number, simulationId: string, newMistakes: string[]): TitrationLabProgress {
  const completedCount = progress.completedCount + 1;
  const averageScore = Math.round(((progress.averageScore * progress.completedCount) + score.total) / completedCount);
  const bestDeviationMl = progress.bestDeviationMl === null ? Math.abs(deviationMl) : Math.min(progress.bestDeviationMl, Math.abs(deviationMl));
  const frequentMistakes = [...progress.frequentMistakes, ...newMistakes].slice(-12);
  return { completedCount, averageScore, bestDeviationMl, frequentMistakes, lastSimulationId: simulationId, updatedAt: new Date().toISOString() };
}
