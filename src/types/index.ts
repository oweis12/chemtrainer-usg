export type ModuleId = "M4" | "M5D" | "M6" | "M7" | "M8" | "M9" | "M10";

export type QuestionType = "mcq" | "open" | "calculation" | "steps" | "order" | "mixed" | "structure" | "structure_view" | "structure_click" | "structure_build" | "structure_complete";

export type AtomElement = "C" | "H" | "O" | "N" | "Cl" | "S" | "P";

export interface AtomNode {
  id: string;
  element: AtomElement;
  x: number;
  y: number;
  charge?: number;
  label?: string;
  fragment?: string;
}

export interface BondEdge {
  id: string;
  from: string;
  to: string;
  order: 1 | 2 | 3;
}

export interface MoleculeGraph {
  atoms: AtomNode[];
  bonds: BondEdge[];
  name: string;
  formula?: string;
  functionalGroups?: string[];
}

export type StructureBuildLevel = 1 | 2 | 3 | 4;

export interface StructureBuildTask {
  id: string;
  title: string;
  level: StructureBuildLevel;
  prompt: string;
  hint: string;
  targetGraph: MoleculeGraph;
  modelNote: string;
  suggestedFragments: string[];
}

export interface ChemistryModule {
  id: ModuleId;
  shortLabel: string;
  title: string;
  subtitle: string;
  topics: string[];
  accent: "blue" | "amber" | "green" | "red";
}

export interface BinasReference {
  id: string;
  onderwerp: string;
  module: ModuleId;
  tabel: string;
  wanneerGebruikJeDezeTabel: string;
  voorbeeldvraag: string;
  waarschuwing: string;
  keywords?: string[];
}

export interface Lesson {
  id: string;
  module: ModuleId;
  title: string;
  topic: string;
  duration: string;
  objectives: string[];
  relevance: string;
  foundation: string[];
  simpleMeaning?: string[];
  diagram?: ConceptDiagramId;
  memoryAnchor?: string[];
  concepts: Array<{ term: string; meaning: string }>;
  example: { title: string; prompt: string; steps: string[] };
  extraExamples?: Array<{ title: string; prompt: string; steps: string[]; conclusion: string; visual?: QuestionVisual; figureExplanation?: FigureExplanation }>;
  examApproach?: string[];
  binasReferenceIds?: string[];
  examAnswer: string;
  commonMistakes: string[];
  miniCheck: Array<{ question: string; answer: string }>;
  imageSlots?: string[];
  videoIds?: string[];
}

export interface FigureExplanation {
  observation: string;
  meaning: string;
  conclusion: string;
  examUse: string;
  commonMistake?: string;
  steps?: string[];
  binasLink?: string;
}

export type ConceptDiagramId = "covalent" | "ionic" | "metallic" | "polarity" | "hydrogen-bond" | "titration" | "redox" | "dna-nucleotide" | "gene-expression" | "mass-spectrum";

export interface StructureData {
  formula: string;
  groups: string[];
  polar: boolean;
  hBond: "donor" | "acceptor" | "both" | "none";
  annotation: string;
  graph?: MoleculeGraph;
}

export interface QuestionVisual {
  type: "diagram" | "spectrum" | "chromatogram" | "structure" | "image";
  component?: string;
  src?: string;
  alt: string;
  caption?: string;
  variant?: string;
  purpose?: "read-data" | "interpret-spectrum" | "interpret-structure" | "setup-identification" | "calculation-support" | "explanation-only";
}

export type LearningObjectiveType = "kennen" | "kunnen" | "berekenen" | "uitleggen" | "toepassen";
export type CoverageStatus = "gedekt" | "deels gedekt" | "mist";

export interface LearningObjective {
  id: string;
  module: ModuleId;
  onderwerp: string;
  leerdoelTekst: string;
  type: LearningObjectiveType;
  lessonIds: string[];
  questionIds: string[];
  status: CoverageStatus;
  notes: string;
}

export interface VisualAssetRecord {
  id: string;
  module: ModuleId;
  topic: string;
  location: string;
  currentProblem: string;
  desiredVisual: string;
  type: "real lab photo" | "labeled setup" | "generated realistic teaching image" | "exam-style structure formula image" | "spectrum/chromatogram" | "step image" | "callout diagram";
  priority: "hoog" | "middel" | "laag";
  proposedFilename: string;
  alt: string;
  caption: string;
  prompt: string;
  status: "needs-image" | "placeholder" | "done";
  path?: string;
}

export interface OfficialPracticeTest {
  id: string;
  title: string;
  sourceStatus: "source-missing" | "ready";
  sourceNote: string;
  questions: Question[];
}

export interface Question {
  id: string;
  /** Alleen gebruikt bij een brongebonden oefentoets met puntentoekenning. */
  points?: number;
  module: ModuleId;
  topic: string;
  skill: string;
  level: 1 | 2 | 3 | 4;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  modelAnswer: string;
  steps?: string[];
  rubric: string[];
  hints: string[];
  commonMistakes: string[];
  explanation: string;
  visual?: QuestionVisual;
  structure?: StructureData;
  structureTaskId?: string;
}

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  answeredAt: string;
  module: ModuleId;
  topic: string;
  level: number;
}

export interface MistakeRecord {
  id: string;
  questionId: string;
  module: ModuleId;
  topic: string;
  faultType: string;
  createdAt: string;
  reflection: string;
}

export interface StoredProgress {
  completedLessons: string[];
  answers: AnswerRecord[];
  mistakes: MistakeRecord[];
  theme: "light" | "dark";
}

export type AppPage = "home" | "learn" | "practice" | "test" | "mistakes" | "structurelab" | "titrationlab" | "binas" | "coverage" | "visualaudit";
export type TestKind = "official" | "officialPractice" | "random" | "challenge" | "priority" | "learningObjectives";

export type TitrationTaskType = "molariteit" | "massa-aandeel" | "volume-aflezen" | "procedure";
export type ValveSetting = "dicht" | "langzaam" | "normaal" | "snel";
export type EndpointState = "voor" | "bijna" | "goed" | "te_ver";

export interface TitrationMoleRatio {
  analyte: number;
  titrant: number;
}

export interface TitrationSimulation {
  id: string;
  titel: string;
  analyteName: string;
  titrantName: string;
  analyteVolumeMl: number;
  analyteMolarityHidden: number;
  titrantMolarity: number;
  reactionEquation: string;
  moleRatio: TitrationMoleRatio;
  indicator: string;
  endpointPHApprox: number;
  equivalenceVolumeMl: number;
  allowedErrorMl: number;
  taskType: TitrationTaskType;
  instructions: string[];
  modelCalculation: string[];
  commonMistakes: string[];
  rubric: string[];
  molarMassAnalyte?: number;
  sampleMassG?: number;
}

export interface TitrationLabProgress {
  completedCount: number;
  bestDeviationMl: number | null;
  averageScore: number;
  frequentMistakes: string[];
  lastSimulationId?: string;
  updatedAt?: string;
}
