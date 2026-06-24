import { ArrowCounterClockwise, Check, Eye, LinkSimple, Trash, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { AtomElement, MoleculeGraph, StructureBuildTask } from "../../types";
import { getMoleculeFormula, getStructureFeedback, validateValence } from "../../utils/chemGraph";
import { StructureRenderer } from "../StructureRenderer";
import { AtomPalette, type BuilderPiece } from "./AtomPalette";
import { BondSelector } from "./BondSelector";
import { MoleculeCanvas } from "./MoleculeCanvas";
import { StructureFeedbackPanel } from "./StructureFeedbackPanel";

type Tool = "place" | "bond" | "delete";

const fragmentAtoms: Record<string, { element: AtomElement; label: string; charge?: number }> = {
  CH3: { element: "C", label: "CH₃" }, CH2: { element: "C", label: "CH₂" }, OH: { element: "O", label: "OH" }, NH2: { element: "N", label: "NH₂" }, COOH: { element: "C", label: "COOH" }, "C=O": { element: "C", label: "C=O" }, O: { element: "O", label: "O" }, "C(=O)O": { element: "C", label: "C(=O)O" }, "C(=O)NH": { element: "C", label: "C(=O)NH" }, fosfaat: { element: "P", label: "fosfaat" }, suiker: { element: "C", label: "suiker" }, base: { element: "N", label: "base" }, alkylstaart: { element: "C", label: "alkylstaart" },
};

function emptyGraph(task: StructureBuildTask): MoleculeGraph { return { name: `Mijn ${task.title}`, atoms: [], bonds: [] }; }
function newId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`; }

export function MoleculePuzzleBuilder({ task, onChecked }: { task: StructureBuildTask; onChecked?: (correct: boolean, graph: MoleculeGraph) => void }) {
  const storageKey = `chemtrainer-usg-structure-${task.id}`;
  const [graph, setGraph] = useState<MoleculeGraph>(() => { try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) as MoleculeGraph : emptyGraph(task); } catch { return emptyGraph(task); } });
  const [piece, setPiece] = useState<BuilderPiece>({ kind: "atom", value: "C" });
  const [tool, setTool] = useState<Tool>("place");
  const [bondOrder, setBondOrder] = useState<1 | 2 | 3>(1);
  const [bondSource, setBondSource] = useState<string>();
  const [feedback, setFeedback] = useState<string[]>([]);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(graph)); }, [graph, storageKey]);
  useEffect(() => { setGraph(() => { try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) as MoleculeGraph : emptyGraph(task); } catch { return emptyGraph(task); } }); setFeedback([]); setShowModel(false); setBondSource(undefined); }, [storageKey, task]);

  const formula = useMemo(() => getMoleculeFormula(graph), [graph]);
  const place = (selected: BuilderPiece, x: number, y: number) => {
    const id = newId("atom");
    const atom = selected.kind === "atom" ? { id, element: selected.value, x, y } : { id, x, y, fragment: selected.value, ...fragmentAtoms[selected.value] };
    setGraph((current) => ({ ...current, atoms: [...current.atoms, atom] }));
  };
  const clickAtom = (atom: { id: string }) => {
    if (tool === "delete") { setGraph((current) => ({ ...current, atoms: current.atoms.filter((item) => item.id !== atom.id), bonds: current.bonds.filter((bond) => bond.from !== atom.id && bond.to !== atom.id) })); return; }
    if (tool !== "bond") return;
    if (!bondSource) { setBondSource(atom.id); return; }
    if (bondSource === atom.id) { setBondSource(undefined); return; }
    setGraph((current) => {
      const existing = current.bonds.find((bond) => (bond.from === bondSource && bond.to === atom.id) || (bond.to === bondSource && bond.from === atom.id));
      const bonds = existing ? current.bonds.map((bond) => bond.id === existing.id ? { ...bond, order: bondOrder } : bond) : [...current.bonds, { id: newId("bond"), from: bondSource, to: atom.id, order: bondOrder }];
      return { ...current, bonds };
    });
    setBondSource(undefined);
  };
  const check = () => { const validation = validateValence(graph); const result = validation.valid ? getStructureFeedback(graph, task.targetGraph) : validation.errors; setFeedback(result); onChecked?.(result.some((line) => line.startsWith("Goed:")), graph); };
  const reset = () => { localStorage.removeItem(storageKey); setGraph(emptyGraph(task)); setFeedback([]); setShowModel(false); setBondSource(undefined); };
  const moveAtom = (id: string, x: number, y: number) => setGraph((current) => ({
    ...current,
    atoms: current.atoms.map((atom) => atom.id === id ? { ...atom, x, y } : atom),
  }));
  const deleteBond = (bondId: string) => setGraph((current) => ({
    ...current,
    bonds: current.bonds.filter((bond) => bond.id !== bondId),
  }));

  return <section className="puzzle-builder">
    <header className="puzzle-head"><div><span className="section-kicker">StructuurLab · niveau {task.level}</span><h3>{task.title}</h3><p>{task.prompt}</p></div><div className="puzzle-formula">Jouw formule: <strong>{formula}</strong></div></header>
    <div className="puzzle-controls"><AtomPalette selected={piece} onSelect={(next) => { setPiece(next); setTool("place"); }} /><div className="puzzle-tools"><span className="section-kicker">Gereedschap</span><div className="tool-buttons"><button className={tool === "place" ? "selected" : ""} onClick={() => setTool("place")}>Plaatsen</button><button className={tool === "bond" ? "selected" : ""} onClick={() => setTool("bond")}><LinkSimple size={16} /> Verbinden</button><button className={tool === "delete" ? "selected" : ""} onClick={() => setTool("delete")}><Trash size={16} /> Verwijderen</button></div><BondSelector order={bondOrder} onChange={(value) => { setBondOrder(value); setTool("bond"); }} /><p className="puzzle-hint">Hint: {task.hint}</p></div></div>
    <MoleculeCanvas graph={graph} tool={tool} selectedPiece={piece} activeBondAtom={bondSource} onPlace={place} onAtomClick={clickAtom} onMoveAtom={moveAtom} onDeleteBond={deleteBond} />
    <div className="puzzle-actions"><button className="primary-button" onClick={check}><Check size={18} /> Controleer structuur</button><button className="ghost-button" onClick={reset}><ArrowCounterClockwise size={17} /> Reset</button><button className="ghost-button" onClick={() => setShowModel(!showModel)}><Eye size={17} /> {showModel ? "Model verbergen" : "Toon modelantwoord"}</button>{bondSource && <button className="text-action" onClick={() => setBondSource(undefined)}><X size={16} /> Selectie annuleren</button>}</div>
    <StructureFeedbackPanel feedback={feedback} />
    {showModel && <div className="puzzle-model"><span className="section-kicker">Modelantwoord</span><StructureRenderer structure={{ formula: task.targetGraph.formula ?? "", groups: task.targetGraph.functionalGroups ?? [], polar: true, hBond: "none", annotation: task.title, graph: task.targetGraph }} /><p>{task.modelNote}</p></div>}
  </section>;
}
