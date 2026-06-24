import type { AtomElement, AtomNode, BondEdge, MoleculeGraph } from "../types";

const maximumValence: Record<AtomElement, number> = { H: 1, O: 2, N: 3, C: 4, Cl: 1, S: 6, P: 5 };
const fragmentFormula: Record<string, Partial<Record<AtomElement, number>>> = {
  CH3: { C: 1, H: 3 }, "CH₂": { C: 1, H: 2 }, CH2: { C: 1, H: 2 }, OH: { O: 1, H: 1 }, NH2: { N: 1, H: 2 }, "NH₂": { N: 1, H: 2 },
  COOH: { C: 1, O: 2, H: 1 }, "C=O": { C: 1, O: 1 }, O: { O: 1 }, "C(=O)O": { C: 1, O: 2 }, "C(=O)NH": { C: 1, O: 1, N: 1, H: 1 },
  fosfaat: { P: 1, O: 4 }, suiker: { C: 5, H: 10, O: 5 }, base: { N: 1 }, "alkylstaart": { C: 12, H: 25 },
};

const fragmentOpenValence: Record<string, number> = { CH3: 1, "CH₂": 2, CH2: 2, OH: 1, NH2: 1, "NH₂": 1, COOH: 1, "C=O": 2, O: 2, "C(=O)O": 2, "C(=O)NH": 2, fosfaat: 2, suiker: 2, base: 1, "alkylstaart": 1 };

export interface ValenceValidation { valid: boolean; errors: string[]; }
export interface MoleculeComparison { match: boolean; sameAtoms: boolean; sameBonds: boolean; sameGroups: boolean; missingGroups: string[]; extraGroups: string[]; }

function bondTotal(atomId: string, bonds: BondEdge[]) { return bonds.filter((bond) => bond.from === atomId || bond.to === atomId).reduce((sum, bond) => sum + bond.order, 0); }
function atomDisplay(atom: AtomNode) { return atom.label || atom.element; }
function atomKey(atom: AtomNode) { return `${atom.element}|${atom.fragment ?? atom.label ?? ""}|${atom.charge ?? 0}`; }

export function validateValence(graph: MoleculeGraph): ValenceValidation {
  const errors: string[] = [];
  graph.atoms.forEach((atom) => {
    const bonds = bondTotal(atom.id, graph.bonds);
    const fragment = atom.fragment ?? atom.label ?? "";
    const max = fragmentOpenValence[fragment] ?? maximumValence[atom.element];
    if (bonds > max) errors.push(`${atomDisplay(atom)} heeft te veel bindingen (${bonds}; maximaal ${max}).`);
    if (atom.element === "H" && bonds !== 0 && bonds !== 1) errors.push("Waterstof mag maximaal één binding hebben.");
    if (atom.element === "Cl" && bonds > 1) errors.push("Chloor mag maximaal één binding hebben.");
  });
  graph.bonds.forEach((bond) => {
    if (!graph.atoms.some((atom) => atom.id === bond.from) || !graph.atoms.some((atom) => atom.id === bond.to)) errors.push("Een binding verwijst naar een atoom dat niet meer bestaat.");
    if (bond.from === bond.to) errors.push("Een atoom kan in deze V1 niet aan zichzelf gebonden zijn.");
  });
  return { valid: errors.length === 0, errors };
}

export function detectFunctionalGroups(graph: MoleculeGraph): string[] {
  const groups = new Set(graph.functionalGroups ?? []);
  const labelText = graph.atoms.map((atom) => `${atom.fragment ?? ""} ${atom.label ?? ""}`).join(" ").toLowerCase();
  if (/\boh\b|alcohol/.test(labelText)) groups.add("alcohol");
  if (/cooh|carbonzuur/.test(labelText)) groups.add("carbonzuur");
  if (/c\(=o\)o|ester/.test(labelText)) groups.add("ester");
  if (/c\(=o\)nh|amide|peptide/.test(labelText)) groups.add("amide");
  if (/c\(=o\)|cooh|carbonyl/.test(labelText)) groups.add("carbonyl");
  if (/nh2|amino/.test(labelText)) groups.add("aminogroep");
  if (/fosfaat/.test(labelText)) groups.add("fosfaatgroep");
  if (/suiker/.test(labelText)) groups.add("suikerblok");
  if (/base/.test(labelText)) groups.add("baseblok");

  const atomsById = new Map(graph.atoms.map((atom) => [atom.id, atom]));
  const carbonylCarbons = new Set<string>();
  graph.bonds.filter((bond) => bond.order === 2).forEach((bond) => {
    const from = atomsById.get(bond.from); const to = atomsById.get(bond.to);
    if (from?.element === "C" && to?.element === "O") carbonylCarbons.add(from.id);
    if (to?.element === "C" && from?.element === "O") carbonylCarbons.add(to.id);
  });
  if (carbonylCarbons.size) groups.add("carbonyl");
  carbonylCarbons.forEach((carbonId) => {
    const neighbours = graph.bonds.filter((bond) => bond.from === carbonId || bond.to === carbonId).map((bond) => atomsById.get(bond.from === carbonId ? bond.to : bond.from));
    if (neighbours.some((atom) => atom?.element === "N")) groups.add("amide");
    const oxygenNeighbours = neighbours.filter((atom) => atom?.element === "O");
    if (oxygenNeighbours.length >= 2) groups.add("ester");
  });
  graph.atoms.filter((atom) => atom.element === "O").forEach((oxygen) => {
    const neighbours = graph.bonds.filter((bond) => bond.from === oxygen.id || bond.to === oxygen.id).map((bond) => atomsById.get(bond.from === oxygen.id ? bond.to : bond.from));
    if (neighbours.some((atom) => atom?.element === "H") && neighbours.some((atom) => atom?.element === "C")) groups.add("alcohol");
  });
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

function atomSignatures(graph: MoleculeGraph): string[] {
  const atoms = new Map(graph.atoms.map((atom) => [atom.id, atom]));
  return graph.atoms.map((atom) => {
    const neighbours = graph.bonds.filter((bond) => bond.from === atom.id || bond.to === atom.id).map((bond) => {
      const neighbour = atoms.get(bond.from === atom.id ? bond.to : bond.from);
      return `${bond.order}:${neighbour ? atomKey(neighbour) : "missing"}`;
    }).sort().join(",");
    return `${atomKey(atom)}=>${neighbours}`;
  }).sort();
}

export function compareMolecules(studentGraph: MoleculeGraph, targetGraph: MoleculeGraph): MoleculeComparison {
  const studentAtoms = studentGraph.atoms.map(atomKey).sort();
  const targetAtoms = targetGraph.atoms.map(atomKey).sort();
  const sameAtoms = studentAtoms.join("/") === targetAtoms.join("/");
  const studentGroups = detectFunctionalGroups(studentGraph);
  const targetGroups = detectFunctionalGroups(targetGraph);
  const missingGroups = targetGroups.filter((group) => !studentGroups.includes(group));
  const extraGroups = studentGroups.filter((group) => !targetGroups.includes(group));
  const sameGroups = missingGroups.length === 0 && extraGroups.length === 0;
  const sameBonds = atomSignatures(studentGraph).join("/") === atomSignatures(targetGraph).join("/");
  return { match: sameAtoms && sameBonds && sameGroups, sameAtoms, sameBonds, sameGroups, missingGroups, extraGroups };
}

export function getStructureFeedback(studentGraph: MoleculeGraph, targetGraph: MoleculeGraph): string[] {
  const valence = validateValence(studentGraph);
  if (!valence.valid) return valence.errors;
  const comparison = compareMolecules(studentGraph, targetGraph);
  if (comparison.match) return ["Goed: structuur klopt."];
  if (comparison.missingGroups.length) {
    const group = comparison.missingGroups[0];
    if (group === "alcohol") return ["Je mist een OH-groep: de gevraagde structuur bevat een alcoholgroep."];
    if (group === "carbonzuur") return ["Je mist een COOH-groep: de gevraagde structuur bevat een carbonzuur."];
    if (group === "ester") return ["Je mist een esterbinding: zoek naar C(=O)O."];
    if (group === "amide") return ["Je mist een amidebinding: zoek naar C(=O)NH."];
    if (group === "carbonyl") return ["Je mist de C=O dubbele binding."];
    return [`Je mist de functionele groep: ${group}.`];
  }
  if (!comparison.sameAtoms && !comparison.sameGroups) return ["Je hebt nog niet dezelfde bouwstenen als het doelmolecuul. Vergelijk de atomen en de functionele groepen stap voor stap."];
  if (!comparison.sameAtoms) return ["Je mist atomen of hebt extra atomen geplaatst. Controleer eerst de bouwstenen en hun aantallen."];
  if (!comparison.sameBonds) return ["Je hebt de juiste atomen, maar de verbindingen staan verkeerd. Controleer vooral enkel-, dubbel- en drievoudige bindingen."];
  return ["De structuur is bijna goed. Vergelijk de functionele groepen nog eens met het doelmolecuul."];
}
