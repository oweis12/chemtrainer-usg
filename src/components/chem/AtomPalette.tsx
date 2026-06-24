import type { AtomElement } from "../../types";

export type BuilderPiece = { kind: "atom"; value: AtomElement } | { kind: "fragment"; value: string };

const atoms: AtomElement[] = ["C", "H", "O", "N", "Cl", "S", "P"];
const fragments = ["CH3", "CH2", "OH", "NH2", "COOH", "C=O", "O", "C(=O)O", "C(=O)NH", "fosfaat", "suiker", "base", "alkylstaart"];

export function AtomPalette({ selected, onSelect }: { selected: BuilderPiece; onSelect: (piece: BuilderPiece) => void }) {
  return <section className="atom-palette"><div><span className="section-kicker">Los atoom</span><div className="atom-palette-grid">{atoms.map((atom) => <button key={atom} className={`palette-atom atom-${atom} ${selected.kind === "atom" && selected.value === atom ? "selected" : ""}`} onClick={() => onSelect({ kind: "atom", value: atom })}>{atom}</button>)}</div></div><div><span className="section-kicker">Snelle bouwsteen</span><div className="fragment-palette">{fragments.map((fragment) => <button key={fragment} className={selected.kind === "fragment" && selected.value === fragment ? "selected" : ""} onClick={() => onSelect({ kind: "fragment", value: fragment })}>{fragment}</button>)}</div></div></section>;
}
