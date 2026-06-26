type BondPolarityVariant = "nonpolarCovalent" | "polarCovalent" | "electronegativityDecision" | "moleculePolarity";

const variants = new Set<BondPolarityVariant>(["nonpolarCovalent", "polarCovalent", "electronegativityDecision", "moleculePolarity"]);

function activeVariant(value?: string): BondPolarityVariant {
  return value && variants.has(value as BondPolarityVariant) ? value as BondPolarityVariant : "polarCovalent";
}

function Atom({ x, y, label, className = "" }: { x: number; y: number; label: string; className?: string }) {
  return <g transform={`translate(${x} ${y})`} className={`bond-atom ${className}`}>
    <circle r="43" />
    <text y="8" textAnchor="middle" className="science-label">{label}</text>
  </g>;
}

function ElectronPair({ x, y }: { x: number; y: number }) {
  return <g className="bond-electron-pair" transform={`translate(${x} ${y})`}>
    <circle cx="-9" cy="0" r="7" />
    <circle cx="9" cy="0" r="7" />
  </g>;
}

function NonpolarCovalent() {
  return <>
    <line x1="250" y1="132" x2="470" y2="132" className="bond-line" />
    <Atom x={235} y={132} label="H" />
    <Atom x={485} y={132} label="H" />
    <ElectronPair x={360} y={132} />
    <text x="360" y="84" textAnchor="middle" className="science-label">gedeeld elektronenpaar</text>
    <text x="360" y="194" textAnchor="middle" className="science-note">gelijke aantrekkingskracht</text>
    <path d="M286 100 H332" className="bond-balance-arrow" />
    <path d="M434 100 H388" className="bond-balance-arrow" />
  </>;
}

function PolarCovalent({ markerId }: { markerId: string }) {
  return <>
    <line x1="244" y1="132" x2="492" y2="132" className="bond-line" />
    <Atom x={224} y={132} label="H" className="bond-atom-positive" />
    <Atom x={514} y={132} label="Cl" className="bond-atom-negative" />
    <ElectronPair x={438} y={132} />
    <text x="224" y="73" textAnchor="middle" className="bond-delta bond-delta-plus">δ+</text>
    <text x="514" y="73" textAnchor="middle" className="bond-delta bond-delta-minus">δ−</text>
    <text x="438" y="92" textAnchor="middle" className="science-label">e-paar dichter bij Cl</text>
    <line x1="274" y1="190" x2="483" y2="190" className="bond-dipole-arrow" markerEnd={`url(#${markerId})`} />
    <text x="380" y="216" textAnchor="middle" className="science-note">dipoolrichting</text>
  </>;
}

function ElectronegativityDecision({ markerId }: { markerId: string }) {
  const cards = [
    { title: "1 BINAS 40A", note: "zoek EN", x: 36 },
    { title: "2 ΔEN", note: "verschil", x: 205 },
    { title: "3 grens", note: "schoolregel", x: 374 },
    { title: "4 conclusie", note: "bindingstype", x: 543 },
  ];

  return <>
    {cards.map((card, index) => <g key={card.title} transform={`translate(${card.x} 58)`}>
      <rect width="132" height="140" className="science-box bond-decision-card" />
      <text x="66" y="34" textAnchor="middle" className="science-label">{card.title}</text>
      <text x="66" y="85" textAnchor="middle" className="science-note">{card.note}</text>
      {index < cards.length - 1 && <line x1="139" y1="70" x2="160" y2="70" className="science-arrow" markerEnd={`url(#${markerId})`} />}
    </g>)}
    <text x="360" y="232" textAnchor="middle" className="science-note">grensgevallen: kijk ook naar soort atomen en vraagcontext</text>
  </>;
}

function MoleculePolarity({ markerId }: { markerId: string }) {
  return <>
    <g transform="translate(170 132)">
      <Atom x={0} y={0} label="C" />
      <Atom x={-92} y={0} label="O" className="bond-atom-negative" />
      <Atom x={92} y={0} label="O" className="bond-atom-negative" />
      <line x1="-49" y1="0" x2="-43" y2="0" className="bond-line" />
      <line x1="43" y1="0" x2="49" y2="0" className="bond-line" />
      <line x1="-48" y1="-20" x2="-88" y2="-20" className="bond-dipole-arrow" markerEnd={`url(#${markerId})`} />
      <line x1="48" y1="-20" x2="88" y2="-20" className="bond-dipole-arrow" markerEnd={`url(#${markerId})`} />
      <text x="0" y="91" textAnchor="middle" className="science-note">dipolen heffen op</text>
    </g>
    <g transform="translate(520 132)">
      <Atom x={0} y={0} label="O" className="bond-atom-negative" />
      <Atom x={-78} y={52} label="H" className="bond-atom-positive" />
      <Atom x={78} y={52} label="H" className="bond-atom-positive" />
      <line x1="-38" y1="26" x2="-52" y2="36" className="bond-line" />
      <line x1="38" y1="26" x2="52" y2="36" className="bond-line" />
      <line x1="-55" y1="30" x2="-18" y2="10" className="bond-dipole-arrow" markerEnd={`url(#${markerId})`} />
      <line x1="55" y1="30" x2="18" y2="10" className="bond-dipole-arrow" markerEnd={`url(#${markerId})`} />
      <text x="0" y="102" textAnchor="middle" className="science-note">dipolen tellen op</text>
    </g>
    <text x="170" y="42" textAnchor="middle" className="science-label">CO2</text>
    <text x="520" y="42" textAnchor="middle" className="science-label">H2O</text>
  </>;
}

export function BondPolarityDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  const markerId = `bond-arrow-${selected}`;

  return <svg className={`science-svg bond-polarity-svg bond-polarity-${selected}`} viewBox="0 0 720 260" role="img" aria-label={`Binding en polariteit: ${selected}`}>
    <defs>
      <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="currentColor" /></marker>
    </defs>
    {selected === "nonpolarCovalent" && <NonpolarCovalent />}
    {selected === "polarCovalent" && <PolarCovalent markerId={markerId} />}
    {selected === "electronegativityDecision" && <ElectronegativityDecision markerId={markerId} />}
    {selected === "moleculePolarity" && <MoleculePolarity markerId={markerId} />}
  </svg>;
}
