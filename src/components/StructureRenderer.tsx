import { Drop, Flask, Sparkle } from "@phosphor-icons/react";
import type { BondEdge, MoleculeGraph, StructureData } from "../types";
import { detectFunctionalGroups, getMoleculeFormula } from "../utils/chemGraph";

const atomColor: Record<string, string> = { C: "#1f4b99", H: "#78859a", O: "#c8583e", N: "#2f7d55", Cl: "#2f7d55", S: "#d88b1e", P: "#7a5da8" };

function bondLines(bond: BondEdge, graph: MoleculeGraph) {
  const from = graph.atoms.find((atom) => atom.id === bond.from);
  const to = graph.atoms.find((atom) => atom.id === bond.to);
  if (!from || !to) return [];
  const dx = to.x - from.x; const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const offsetX = (-dy / length) * 5; const offsetY = (dx / length) * 5;
  const offsets = bond.order === 1 ? [0] : bond.order === 2 ? [-1, 1] : [-1.5, 0, 1.5];
  return offsets.map((multiplier, index) => <line key={`${bond.id}-${index}`} x1={from.x + offsetX * multiplier} y1={from.y + offsetY * multiplier} x2={to.x + offsetX * multiplier} y2={to.y + offsetY * multiplier} className="molecule-bond" />);
}

function MoleculeSvg({ graph, className = "" }: { graph: MoleculeGraph; className?: string }) {
  return <svg viewBox="0 0 600 360" role="img" aria-label={`Structuurformule van ${graph.name}`} className={`molecule-svg ${className}`} preserveAspectRatio="xMidYMid meet"><g>{graph.bonds.flatMap((bond) => bondLines(bond, graph))}</g><g>{graph.atoms.map((atom) => <g key={atom.id} className="molecule-atom"><circle cx={atom.x} cy={atom.y} r="27" style={{ fill: atomColor[atom.element] ?? "#1f4b99" }} /><text x={atom.x} y={atom.y + 6} textAnchor="middle" className="molecule-atom-label">{atom.label ?? atom.element}</text>{atom.charge !== undefined && <text x={atom.x + 22} y={atom.y - 18} className="molecule-charge">{atom.charge > 0 ? `+${atom.charge === 1 ? "" : atom.charge}` : atom.charge === -1 ? "−" : atom.charge}</text>}</g>)}</g></svg>;
}

export function StructureRenderer({ structure }: { structure: StructureData }) {
  const graph = structure.graph;
  const groups = graph ? detectFunctionalGroups(graph) : structure.groups;
  const formula = graph ? getMoleculeFormula(graph) : structure.formula;
  return <figure className="structure-renderer" aria-label={`Structuurformule van ${graph?.name ?? structure.annotation}`}>
    <div className="structure-topline"><Flask size={17} weight="duotone" /> Structuurformule</div>
    {graph ? <MoleculeSvg graph={graph} /> : <div className="structure-formula">{structure.formula}</div>}
    <figcaption className="structure-meta"><span><Sparkle size={14} weight="fill" /> {groups.join(" · ") || "analyseer de structuur"}</span><span><Drop size={14} weight="fill" /> {structure.polar ? "polair" : "apolair"} · H-brug: {structure.hBond}</span><span className="structure-formula-chip">{formula}</span></figcaption>
  </figure>;
}

export { MoleculeSvg };
