type IrSpectrumVariant = "overview" | "questionSafe";

const variants = new Set<IrSpectrumVariant>(["overview", "questionSafe"]);

function activeVariant(value?: string): IrSpectrumVariant {
  return value && variants.has(value as IrSpectrumVariant) ? (value as IrSpectrumVariant) : "overview";
}

const bandAreas = [
  { x: 86, width: 96, label: "O-H / N-H" },
  { x: 236, width: 68, label: "C-H" },
  { x: 344, width: 58, label: "C=O" },
  { x: 442, width: 126, label: "vingerafdruk" },
];

const spectrumPath = "M74 122 C108 80 118 174 154 182 C188 188 202 116 234 134 C262 149 278 116 308 122 C334 126 342 208 372 210 C404 212 418 166 448 174 C478 182 496 200 526 194 C552 189 566 170 582 166";

export function IrSpectrumDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  return <svg className={`science-svg ir-spectrum-svg ir-spectrum-${selected}`} viewBox="0 0 640 290" role="img" aria-label={`IR-spectrum: ${selected}`}>
    <rect x="56" y="34" width="542" height="188" rx="18" className="science-panel" />
    <line x1="74" y1="56" x2="74" y2="222" className="science-axis" />
    <line x1="74" y1="222" x2="584" y2="222" className="science-axis" />
    {[0, 50, 100].map((value) => {
      const y = 222 - value * 1.44;
      return <g key={value}>
        <line x1="67" y1={y} x2="74" y2={y} className="science-tick" />
        <text x="60" y={y + 4} textAnchor="end" className="science-tick-label">{value}</text>
      </g>;
    })}
    {[4000, 3000, 2000, 1500, 1000].map((value, index) => {
      const x = 96 + index * 112;
      return <g key={value}>
        <line x1={x} y1="222" x2={x} y2="229" className="science-tick" />
        <text x={x} y="247" textAnchor="middle" className="science-tick-label">{value}</text>
      </g>;
    })}
    {selected === "overview" && bandAreas.map((area) => <g key={area.label}>
      <rect x={area.x} y="54" width={area.width} height="148" rx="12" className="ir-band-zone" />
      <text x={area.x + area.width / 2} y="74" textAnchor="middle" className="ir-band-label">{area.label}</text>
    </g>)}
    <path d={spectrumPath} className="ir-spectrum-trace" />
    <text x="26" y="140" transform="rotate(-90 26 140)" textAnchor="middle" className="science-axis-label">transmissie / absorptiepatroon</text>
    <text x="332" y="272" textAnchor="middle" className="science-axis-label">golfgetal (cm-1)</text>
    {selected === "overview" && <text x="362" y="96" textAnchor="middle" className="ms-diagram-note">sterke band kan functionele groep aanwijzen</text>}
  </svg>;
}
