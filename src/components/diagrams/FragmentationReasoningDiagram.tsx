type FragmentationReasoningVariant = "massDifference" | "lossOfFragment" | "moleculeToFragments";

const variants = new Set<FragmentationReasoningVariant>(["massDifference", "lossOfFragment", "moleculeToFragments"]);

function activeVariant(value?: string): FragmentationReasoningVariant {
  return value && variants.has(value as FragmentationReasoningVariant) ? value as FragmentationReasoningVariant : "massDifference";
}

function Difference() {
  return <>
    <line x1="68" y1="245" x2="570" y2="245" className="science-axis" />
    <line x1="205" y1="245" x2="205" y2="88" className="spectrum-peak peak-1" />
    <line x1="474" y1="245" x2="474" y2="132" className="spectrum-peak peak-2" />
    <text x="205" y="270" textAnchor="middle" className="ms-diagram-label">43</text>
    <text x="474" y="270" textAnchor="middle" className="ms-diagram-label">72 (M)</text>
    <path d="M218 72 H461" className="ms-difference-line" />
    <text x="340" y="58" textAnchor="middle" className="ms-diagram-label">Δm/z = 72 − 43 = 29</text>
    <text x="340" y="306" textAnchor="middle" className="science-note">Een verlies van 29 u is een mogelijkheid, niet meteen een unieke structuur.</text>
  </>;
}

function LossOfFragment() {
  return <>
    <g transform="translate(42 91)">
      <rect width="184" height="111" rx="6" className="science-box" />
      <text x="92" y="35" textAnchor="middle" className="ms-diagram-label">molecuulion M⁺</text>
      <text x="92" y="75" textAnchor="middle" className="ms-formula-label">[ABCD]⁺</text>
    </g>
    <g className="ms-fragment-arrow"><line x1="247" y1="145" x2="378" y2="145" /><path d="M367 138 L379 145 L367 152 Z" /></g>
    <text x="313" y="126" textAnchor="middle" className="science-note">binding breekt</text>
    <g transform="translate(399 68)">
      <rect width="194" height="67" rx="6" className="science-box" />
      <text x="97" y="29" textAnchor="middle" className="ms-diagram-label">fragmention</text>
      <text x="97" y="53" textAnchor="middle" className="ms-formula-label">[ABC]⁺</text>
      <rect y="101" width="194" height="67" rx="6" className="science-box ms-neutral-box" />
      <text x="97" y="130" textAnchor="middle" className="ms-diagram-label">neutraal verlies</text>
      <text x="97" y="154" textAnchor="middle" className="ms-formula-label">D</text>
    </g>
    <text x="320" y="286" textAnchor="middle" className="science-note">De detector ziet het geladen fragment; het neutrale deel geeft zelf geen piek.</text>
  </>;
}

function MoleculeToFragments() {
  const fragments = [["m/z 15", "klein ion"], ["m/z 29", "stabiel ion"], ["m/z 43", "basispiek"]];
  return <>
    <g transform="translate(224 40)"><rect width="192" height="75" rx="6" className="science-box" /><text x="96" y="31" textAnchor="middle" className="ms-diagram-label">molecuulion</text><text x="96" y="58" textAnchor="middle" className="ms-formula-label">M⁺·</text></g>
    {fragments.map(([label, note], index) => {
      const x = 40 + index * 205;
      return <g key={label}>
        <path d={`M320 115 C320 157 ${x + 91} 148 ${x + 91} 187`} className="ms-branch-line" />
        <g transform={`translate(${x} 187)`}><rect width="182" height="78" rx="6" className="science-box" /><text x="91" y="31" textAnchor="middle" className="ms-diagram-label">{label}</text><text x="91" y="57" textAnchor="middle" className="ms-diagram-note">{note}</text></g>
      </g>;
    })}
    <text x="320" y="304" textAnchor="middle" className="science-note">Meerdere fragmenten kunnen uit hetzelfde molecuulion ontstaan.</text>
  </>;
}

export function FragmentationReasoningDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  return <svg className={`science-svg ms-master-svg fragmentation-${selected}`} viewBox="0 0 640 330" role="img" aria-label={`Fragmentatieredenering: ${selected}`}>
    {selected === "massDifference" && <Difference />}
    {selected === "lossOfFragment" && <LossOfFragment />}
    {selected === "moleculeToFragments" && <MoleculeToFragments />}
  </svg>;
}
