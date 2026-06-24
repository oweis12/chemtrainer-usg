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
  examAnswer: string;
  commonMistakes: string[];
  miniCheck: Array<{ question: string; answer: string }>;
}

export type ConceptDiagramId = "covalent" | "ionic" | "metallic" | "polarity" | "hydrogen-bond" | "titration" | "redox" | "dna-nucleotide" | "mass-spectrum";

export interface StructureData {
  formula: string;
  groups: string[];
  polar: boolean;
  hBond: "donor" | "acceptor" | "both" | "none";
  annotation: string;
  graph?: MoleculeGraph;
}

export interface Question {
  id: string;
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

export type AppPage = "home" | "learn" | "practice" | "test" | "mistakes" | "structurelab" | "binas";
export type TestKind = "official" | "random" | "challenge";
