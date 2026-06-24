import { useRef, useState } from "react";
import type { AtomNode, BondEdge, MoleculeGraph } from "../../types";
import type { BuilderPiece } from "./AtomPalette";

type Tool = "place" | "bond" | "delete";

function bondSegments(bond: BondEdge, graph: MoleculeGraph) {
  const from = graph.atoms.find((atom) => atom.id === bond.from); const to = graph.atoms.find((atom) => atom.id === bond.to);
  if (!from || !to) return [];
  const dx = to.x - from.x; const dy = to.y - from.y; const length = Math.sqrt(dx ** 2 + dy ** 2) || 1;
  const ox = (-dy / length) * 5; const oy = (dx / length) * 5;
  const offsets = bond.order === 1 ? [0] : bond.order === 2 ? [-1, 1] : [-1.5, 0, 1.5];
  return offsets.map((offset, index) => <line key={`${bond.id}-${index}`} x1={from.x + ox * offset} y1={from.y + oy * offset} x2={to.x + ox * offset} y2={to.y + oy * offset} className="puzzle-bond" />);
}

interface MoleculeCanvasProps {
  graph: MoleculeGraph;
  tool: Tool;
  selectedPiece: BuilderPiece;
  activeBondAtom?: string;
  onPlace: (piece: BuilderPiece, x: number, y: number) => void;
  onAtomClick: (atom: AtomNode) => void;
  onMoveAtom: (id: string, x: number, y: number) => void;
  onDeleteBond: (bondId: string) => void;
}

export function MoleculeCanvas({ graph, tool, selectedPiece, activeBondAtom, onPlace, onAtomClick, onMoveAtom, onDeleteBond }: MoleculeCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const point = (event: { clientX: number; clientY: number }) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 300, y: 180 };
    return { x: Math.max(26, Math.min(574, ((event.clientX - rect.left) / rect.width) * 600)), y: Math.max(26, Math.min(334, ((event.clientY - rect.top) / rect.height) * 360)) };
  };
  const backgroundClick = (event: React.MouseEvent<SVGSVGElement>) => { if (tool === "place") { const position = point(event); onPlace(selectedPiece, position.x, position.y); } };
  const pointerMove = (event: React.PointerEvent<SVGSVGElement>) => { if (dragging) { const position = point(event); onMoveAtom(dragging, position.x, position.y); } };
  return <div className={`molecule-canvas ${tool === "bond" ? "canvas-bond-mode" : ""}`}><svg ref={svgRef} viewBox="0 0 600 360" onClick={backgroundClick} onPointerMove={pointerMove} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)} aria-label="Interactief molecuulcanvas"><defs><pattern id="lab-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs><rect width="600" height="360" className="canvas-grid" />{graph.bonds.map((bond) => <g key={bond.id} onClick={(event) => { event.stopPropagation(); if (tool === "delete") onDeleteBond(bond.id); }}>{bondSegments(bond, graph)}<line x1={graph.atoms.find((atom) => atom.id === bond.from)?.x} y1={graph.atoms.find((atom) => atom.id === bond.from)?.y} x2={graph.atoms.find((atom) => atom.id === bond.to)?.x} y2={graph.atoms.find((atom) => atom.id === bond.to)?.y} className="puzzle-bond-hit" /></g>)}{graph.atoms.map((atom) => <g key={atom.id} className={`puzzle-atom atom-${atom.element} ${activeBondAtom === atom.id ? "bond-source" : ""}`} onClick={(event) => { event.stopPropagation(); onAtomClick(atom); }} onPointerDown={(event) => { if (tool !== "delete" && tool !== "bond") { event.stopPropagation(); setDragging(atom.id); } }}><circle cx={atom.x} cy={atom.y} r="26" /><text x={atom.x} y={atom.y + 6} textAnchor="middle">{atom.label ?? atom.element}</text>{atom.charge !== undefined && <text x={atom.x + 22} y={atom.y - 17} className="puzzle-charge">{atom.charge > 0 ? `+${atom.charge === 1 ? "" : atom.charge}` : atom.charge === -1 ? "−" : atom.charge}</text>}</g>)}</svg><p className="canvas-instruction">{tool === "place" ? "Klik op het ruitjesveld om je gekozen atoom of bouwsteen te plaatsen. Sleep een atoom om het te verplaatsen." : tool === "bond" ? "Klik twee atomen aan om de gekozen binding te maken." : "Klik een atoom of binding aan om die te verwijderen."}</p></div>;
}
