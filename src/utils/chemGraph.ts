import type { AtomElement, AtomNode, BondEdge, MoleculeGraph } from "../types";

const maximumValence: Record<AtomElement, number> = { H: 1, O: 2, N: 3, C: 4, Cl: 1, S: 6, P: 5 };
const fragmentFormula: Record<string, Partial<Record<AtomElement, number>>> = {
  CH3: { C: 1, H: 3 }, "CH₂": { C: 1, H: 2 }, CH2: { C: 1, H: 2 }, OH: { O: 1, H: 1 }, NH2: { N: 1, H: 2 }, "NH₂": { N: 1, H: 2 },
  COOH: { C: 1, O: 2, H: 1 }, "C=O": { C: 1, O: 1 }, O: { O: 1 }, "C(=O)O": { C: 1, O: 2 }, "C(=O)NH": { C: 1, O: 1, N: 1, H: 1 },
  fosfaat: { P: 1, O: 4 }, suiker: { C: 5, H: 10, O: 5 }, base: { N: 1 }, "alkylstaart": { C: 12, H: 25 },
};
const fragmentOpenValence: Record<string, number> = { CH3: 1, "CH₂": 2, CH2: 2, OH: 1, NH2: 1, "NH₂": 1, COOH: 1, "C=O": 2, O: 2, "C(=O)O": 2, "C(=O)NH": 2, fosfaat: 2, suiker: 2, base: 1, "alkylstaart": 1 };

type TemplateAtom = { key: string; element: AtomElement; charge?: number };
type FragmentTemplate = { atoms: TemplateAtom[]; bonds: Array<[string, string, 1 | 2 | 3]>; ports: string[] };

// Een fragment is alleen een invoersnelkoppeling. Voor vergelijking breiden we het uit
// naar dezelfde elementaire bindingen die een leerling ook met losse atomen kan tekenen.
const fragmentTemplates: Record<string, FragmentTemplate> = {
  CH3: { atoms: [{ key: "c", element: "C" }, { key: "h1", element: "H" }, { key: "h2", element: "H" }, { key: "h3", element: "H" }], bonds: [["c", "h1", 1], ["c", "h2", 1], ["c", "h3", 1]], ports: ["c"] },
  "CH₂": { atoms: [{ key: "c", element: "C" }, { key: "h1", element: "H" }, { key: "h2", element: "H" }], bonds: [["c", "h1", 1], ["c", "h2", 1]], ports: ["c", "c"] },
  CH2: { atoms: [{ key: "c", element: "C" }, { key: "h1", element: "H" }, { key: "h2", element: "H" }], bonds: [["c", "h1", 1], ["c", "h2", 1]], ports: ["c", "c"] },
  OH: { atoms: [{ key: "o", element: "O" }, { key: "h", element: "H" }], bonds: [["o", "h", 1]], ports: ["o"] },
  NH2: { atoms: [{ key: "n", element: "N" }, { key: "h1", element: "H" }, { key: "h2", element: "H" }], bonds: [["n", "h1", 1], ["n", "h2", 1]], ports: ["n"] },
  "NH₂": { atoms: [{ key: "n", element: "N" }, { key: "h1", element: "H" }, { key: "h2", element: "H" }], bonds: [["n", "h1", 1], ["n", "h2", 1]], ports: ["n"] },
  COOH: { atoms: [{ key: "c", element: "C" }, { key: "od", element: "O" }, { key: "os", element: "O" }, { key: "h", element: "H" }], bonds: [["c", "od", 2], ["c", "os", 1], ["os", "h", 1]], ports: ["c"] },
  "C=O": { atoms: [{ key: "c", element: "C" }, { key: "o", element: "O" }], bonds: [["c", "o", 2]], ports: ["c"] },
  "C(=O)O": { atoms: [{ key: "c", element: "C" }, { key: "od", element: "O" }, { key: "os", element: "O" }], bonds: [["c", "od", 2], ["c", "os", 1]], ports: ["c", "os"] },
  "C(=O)NH": { atoms: [{ key: "c", element: "C" }, { key: "o", element: "O" }, { key: "n", element: "N" }, { key: "h", element: "H" }], bonds: [["c", "o", 2], ["c", "n", 1], ["n", "h", 1]], ports: ["c", "n"] },
  fosfaat: { atoms: [{ key: "p", element: "P" }, { key: "o1", element: "O" }, { key: "o2", element: "O" }, { key: "o3", element: "O" }, { key: "o4", element: "O" }], bonds: [["p", "o1", 2], ["p", "o2", 1], ["p", "o3", 1], ["p", "o4", 1]], ports: ["o2", "o3"] },
  suiker: { atoms: [{ key: "c", element: "C" }], bonds: [], ports: ["c", "c"] },
  base: { atoms: [{ key: "n", element: "N" }], bonds: [], ports: ["n"] },
  "alkylstaart": { atoms: [{ key: "c1", element: "C" }, { key: "c2", element: "C" }, { key: "c3", element: "C" }, { key: "c4", element: "C" }], bonds: [["c1", "c2", 1], ["c2", "c3", 1], ["c3", "c4", 1]], ports: ["c1"] },
};

export interface ValenceValidation { valid: boolean; errors: string[]; }
export interface MoleculeComparison { match: boolean; sameAtoms: boolean; sameBonds: boolean; sameGroups: boolean; missingGroups: string[]; extraGroups: string[]; }

type Endpoint = { ports: string[]; cursor: number };
const bondTotal = (atomId: string, bonds: BondEdge[]) => bonds.filter((bond) => bond.from === atomId || bond.to === atomId).reduce((sum, bond) => sum + bond.order, 0);
const atomDisplay = (atom: AtomNode) => atom.label || atom.element;
const atomKey = (atom: AtomNode) => `${atom.element}|${atom.charge ?? 0}`;
const neighborsOf = (graph: MoleculeGraph, id: string) => graph.bonds.filter((bond) => bond.from === id || bond.to === id).map((bond) => ({ bond, atom: graph.atoms.find((atom) => atom.id === (bond.from === id ? bond.to : bond.from)) })).filter((item): item is { bond: BondEdge; atom: AtomNode } => Boolean(item.atom));

export function expandFragmentBlocks(graph: MoleculeGraph): MoleculeGraph {
  const atoms: AtomNode[] = [];
  const bonds: BondEdge[] = [];
  const endpoints = new Map<string, Endpoint>();
  graph.atoms.forEach((atom) => {
    const fragment = atom.fragment ?? atom.label ?? "";
    const template = fragmentTemplates[fragment];
    if (!template) {
      atoms.push({ ...atom, fragment: undefined });
      endpoints.set(atom.id, { ports: [atom.id], cursor: 0 });
      return;
    }
    template.atoms.forEach((part, index) => atoms.push({ id: `${atom.id}:${part.key}`, element: part.element, charge: part.charge, x: atom.x + (index * 4), y: atom.y + (index % 2 ? 6 : -6) }));
    template.bonds.forEach(([from, to, order], index) => bonds.push({ id: `${atom.id}:internal:${index}`, from: `${atom.id}:${from}`, to: `${atom.id}:${to}`, order }));
    endpoints.set(atom.id, { ports: template.ports.map((port) => `${atom.id}:${port}`), cursor: 0 });
  });
  const endpointFor = (id: string) => {
    const endpoint = endpoints.get(id);
    if (!endpoint) return id;
    const port = endpoint.ports[Math.min(endpoint.cursor, endpoint.ports.length - 1)];
    endpoint.cursor += 1;
    return port;
  };
  graph.bonds.forEach((bond) => bonds.push({ ...bond, from: endpointFor(bond.from), to: endpointFor(bond.to) }));
  return { ...graph, atoms, bonds, functionalGroups: [] };
}

// C- en N-gebonden waterstoffen zijn bij een structuurformule vaak impliciet.
// O-H blijft staan: dat onderscheidt bijvoorbeeld een carbonzuur van een ester.
export function normalizeChemicalGraph(graph: MoleculeGraph): MoleculeGraph {
  const expanded = expandFragmentBlocks(graph);
  const keepIds = new Set(expanded.atoms.filter((atom) => {
    if (atom.element !== "H") return true;
    const neighbour = neighborsOf(expanded, atom.id)[0]?.atom;
    return neighbour?.element !== "C" && neighbour?.element !== "N";
  }).map((atom) => atom.id));
  return { ...expanded, atoms: expanded.atoms.filter((atom) => keepIds.has(atom.id)), bonds: expanded.bonds.filter((bond) => keepIds.has(bond.from) && keepIds.has(bond.to)) };
}

export function validateValence(graph: MoleculeGraph): ValenceValidation {
  const errors: string[] = [];
  graph.atoms.forEach((atom) => {
    const bonds = bondTotal(atom.id, graph.bonds);
    const fragment = atom.fragment ?? atom.label ?? "";
    const max = fragmentOpenValence[fragment] ?? maximumValence[atom.element];
    if (bonds > max) errors.push(`${atomDisplay(atom)} heeft te veel bindingen (${bonds}; maximaal ${max}).`);
    if (atom.element === "H" && bonds !== 1) errors.push("Een los H-atoom moet precies één binding hebben.");
    if (atom.element === "Cl" && bonds > 1) errors.push("Chloor mag maximaal één binding hebben.");
  });
  graph.bonds.forEach((bond) => {
    if (!graph.atoms.some((atom) => atom.id === bond.from) || !graph.atoms.some((atom) => atom.id === bond.to)) errors.push("Een binding verwijst naar een atoom dat niet meer bestaat.");
    if (bond.from === bond.to) errors.push("Een atoom kan niet aan zichzelf gebonden zijn.");
  });
  return { valid: errors.length === 0, errors };
}

export function detectFunctionalGroups(graph: MoleculeGraph): string[] {
  const groups = new Set<string>();
  const rawLabels = graph.atoms.map((atom) => `${atom.fragment ?? ""} ${atom.label ?? ""}`).join(" ").toLowerCase();
  if (/fosfaat/.test(rawLabels)) groups.add("fosfaatgroep");
  if (/suiker/.test(rawLabels)) groups.add("suikerblok");
  if (/\bbase\b/.test(rawLabels)) groups.add("baseblok");
  if (/alkylstaart/.test(rawLabels)) groups.add("hydrofobe staart");
  const normalized = normalizeChemicalGraph(graph);
  const byId = new Map(normalized.atoms.map((atom) => [atom.id, atom]));
  const carbonyls = normalized.bonds.filter((bond) => bond.order === 2).flatMap((bond) => {
    const from = byId.get(bond.from); const to = byId.get(bond.to);
    return from?.element === "C" && to?.element === "O" ? [from.id] : to?.element === "C" && from?.element === "O" ? [to.id] : [];
  });
  if (carbonyls.length) groups.add("carbonyl");
  carbonyls.forEach((carbonId) => {
    const neighbours = neighborsOf(normalized, carbonId);
    const singleOxygens = neighbours.filter(({ atom, bond }) => atom.element === "O" && bond.order === 1);
    if (neighbours.some(({ atom, bond }) => atom.element === "N" && bond.order === 1)) groups.add("amide");
    singleOxygens.forEach(({ atom: oxygen }) => {
      const oxygenNeighbours = neighborsOf(normalized, oxygen.id).map(({ atom }) => atom);
      if (oxygenNeighbours.some((atom) => atom.element === "H")) groups.add("carbonzuur");
      if (oxygenNeighbours.some((atom) => atom.element === "C" && atom.id !== carbonId)) groups.add("ester");
    });
  });
  normalized.atoms.filter((atom) => atom.element === "O").forEach((oxygen) => {
    const neighbours = neighborsOf(normalized, oxygen.id);
    if (neighbours.some(({ atom }) => atom.element === "H") && neighbours.some(({ atom }) => atom.element === "C")) {
      const carbonNeighbour = neighbours.find(({ atom }) => atom.element === "C")?.atom;
      if (carbonNeighbour && !carbonyls.includes(carbonNeighbour.id)) groups.add("alcohol");
    }
  });
  normalized.atoms.filter((atom) => atom.element === "N").forEach((nitrogen) => {
    const neighbours = neighborsOf(normalized, nitrogen.id);
    const attachedToCarbonyl = neighbours.some(({ atom }) => carbonyls.includes(atom.id));
    if (neighbours.some(({ atom }) => atom.element === "C") && !attachedToCarbonyl) groups.add("aminogroep");
  });
  normalized.atoms.filter((atom) => atom.element === "P").forEach((phosphorus) => {
    if (neighborsOf(normalized, phosphorus.id).filter(({ atom }) => atom.element === "O").length >= 2) groups.add("fosfaatgroep");
  });
  if ([...groups].some((group) => ["alcohol", "carbonzuur", "amide", "ester", "fosfaatgroep"].includes(group)) || normalized.atoms.some((atom) => Boolean(atom.charge))) groups.add("hydrofiele kop");
  const carbonCount = normalized.atoms.filter((atom) => atom.element === "C").length;
  if (carbonCount >= 4) groups.add("hydrofobe staart");
  return [...groups].sort();
}

export function getMoleculeFormula(graph: MoleculeGraph): string {
  if (graph.formula) return graph.formula;
  const counts: Partial<Record<AtomElement, number>> = {};
  graph.atoms.forEach((atom) => {
    const fragment = atom.fragment ?? atom.label ?? "";
    const fragmentCounts = fragmentFormula[fragment];
    if (fragmentCounts) Object.entries(fragmentCounts).forEach(([element, amount]) => { const key = element as AtomElement; counts[key] = (counts[key] ?? 0) + (amount ?? 0); });
    else counts[atom.element] = (counts[atom.element] ?? 0) + 1;
  });
  const order: AtomElement[] = ["C", "H", "N", "O", "P", "S", "Cl"];
  return order.filter((element) => counts[element]).map((element) => `${element}${counts[element] === 1 ? "" : counts[element]}`).join("") || "—";
}

const normalizedDescriptor = (graph: MoleculeGraph, atom: AtomNode) => `${atomKey(atom)}|${neighborsOf(graph, atom.id).map(({ atom: neighbour, bond }) => `${bond.order}:${atomKey(neighbour)}`).sort().join(",")}`;
const bondBetween = (graph: MoleculeGraph, a: string, b: string) => graph.bonds.find((bond) => (bond.from === a && bond.to === b) || (bond.from === b && bond.to === a))?.order;

function graphsEquivalent(student: MoleculeGraph, target: MoleculeGraph) {
  if (student.atoms.length !== target.atoms.length || student.bonds.length !== target.bonds.length) return false;
  const studentDescriptors = student.atoms.map((atom) => normalizedDescriptor(student, atom)).sort();
  const targetDescriptors = target.atoms.map((atom) => normalizedDescriptor(target, atom)).sort();
  if (studentDescriptors.join("/") !== targetDescriptors.join("/")) return false;
  const targetAtoms = [...target.atoms].sort((a, b) => normalizedDescriptor(target, a).localeCompare(normalizedDescriptor(target, b)));
  const candidates = new Map(targetAtoms.map((targetAtom) => [targetAtom.id, student.atoms.filter((studentAtom) => normalizedDescriptor(student, studentAtom) === normalizedDescriptor(target, targetAtom))]));
  const used = new Set<string>(); const mapping = new Map<string, string>();
  const visit = (index: number): boolean => {
    if (index === targetAtoms.length) return true;
    const targetAtom = targetAtoms[index];
    for (const candidate of candidates.get(targetAtom.id) ?? []) {
      if (used.has(candidate.id)) continue;
      const compatible = [...mapping.entries()].every(([mappedTarget, mappedStudent]) => bondBetween(target, targetAtom.id, mappedTarget) === bondBetween(student, candidate.id, mappedStudent));
      if (!compatible) continue;
      mapping.set(targetAtom.id, candidate.id); used.add(candidate.id);
      if (visit(index + 1)) return true;
      mapping.delete(targetAtom.id); used.delete(candidate.id);
    }
    return false;
  };
  return visit(0);
}

export function compareMolecules(studentGraph: MoleculeGraph, targetGraph: MoleculeGraph): MoleculeComparison {
  const student = normalizeChemicalGraph(studentGraph); const target = normalizeChemicalGraph(targetGraph);
  const studentAtoms = student.atoms.map(atomKey).sort(); const targetAtoms = target.atoms.map(atomKey).sort();
  const sameAtoms = studentAtoms.join("/") === targetAtoms.join("/");
  const studentGroups = detectFunctionalGroups(studentGraph); const targetGroups = detectFunctionalGroups(targetGraph);
  const missingGroups = targetGroups.filter((group) => !studentGroups.includes(group));
  const extraGroups = studentGroups.filter((group) => !targetGroups.includes(group));
  const sameBonds = sameAtoms && graphsEquivalent(student, target);
  return { match: sameAtoms && sameBonds, sameAtoms, sameBonds, sameGroups: missingGroups.length === 0, missingGroups, extraGroups };
}

export function getStructureFeedback(studentGraph: MoleculeGraph, targetGraph: MoleculeGraph): string[] {
  const valence = validateValence(studentGraph);
  if (!valence.valid) return valence.errors;
  const comparison = compareMolecules(studentGraph, targetGraph);
  if (comparison.match) return ["Goed: structuur klopt. Het maakt niet uit of je snelle blokken of losse atomen hebt gebruikt."];
  const studentGroups = detectFunctionalGroups(studentGraph); const targetGroups = detectFunctionalGroups(targetGraph);
  if (targetGroups.includes("carbonzuur") && !studentGroups.includes("carbonzuur")) {
    return studentGroups.includes("carbonyl") ? ["Je hebt al een C=O, maar voor een carbonzuurgroep mist nog een O—H-binding aan dezelfde koolstof."] : ["Je mist een dubbele binding tussen C en O in de carbonzuurgroep."];
  }
  if (targetGroups.includes("ester") && !studentGroups.includes("ester")) return ["Je mist de esterverbinding: zoek naar het patroon C(=O)—O—C."];
  if (targetGroups.includes("amide") && !studentGroups.includes("amide")) return ["Je mist de amidebinding: de N moet direct aan de carbonyl-koolstof in C(=O)—N zitten."];
  if (targetGroups.includes("alcohol") && !studentGroups.includes("alcohol")) return ["Je mist een O—H-binding aan een koolstof: dat vormt de alcoholgroep."];
  if (targetGroups.includes("fosfaatgroep") && !studentGroups.includes("fosfaatgroep")) return ["Je mist een fosfaatgroep: zoek naar P met gebonden O-atomen."];
  if (!comparison.sameAtoms) return ["Je mist atomen of hebt extra atomen geplaatst. Vergelijk eerst de kernatomen van de structuur."];
  if (!comparison.sameBonds) return ["Je hebt de juiste atomen, maar minstens één binding staat anders. Controleer vooral C=O, O—H en de plaats waar een groep aan de keten vastzit."];
  return ["De structuur is bijna goed. Vergelijk de functionele groep en de bindingen stap voor stap."];
}
