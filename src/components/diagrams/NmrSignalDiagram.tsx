type NmrSignalVariant = "twoSignalsRatio" | "questionSafe";

const nmrVariants = new Set<NmrSignalVariant>(["twoSignalsRatio", "questionSafe"]);

function activeNmrVariant(value?: string): NmrSignalVariant {
  return value && nmrVariants.has(value as NmrSignalVariant) ? (value as NmrSignalVariant) : "twoSignalsRatio";
}

const signalSets: Record<NmrSignalVariant, Array<{ x: number; height: number; label?: string; note?: string }>> = {
  twoSignalsRatio: [
    { x: 192, height: 122, label: "signaal A", note: "3 H" },
    { x: 414, height: 62, label: "signaal B", note: "1 H" },
  ],
  questionSafe: [
    { x: 192, height: 122 },
    { x: 414, height: 62 },
  ],
};

export function NmrSignalDiagram({ variant }: { variant?: string }) {
  const selected = activeNmrVariant(variant);
  const signals = signalSets[selected];
  return <svg className={`science-svg nmr-signal-svg nmr-signal-${selected}`} viewBox="0 0 640 290" role="img" aria-label={`NMR-signalen: ${selected}`}>
    <rect x="56" y="34" width="542" height="188" rx="18" className="science-panel" />
    <line x1="74" y1="222" x2="584" y2="222" className="science-axis" />
    {[6, 4, 2, 0].map((value, index) => {
      const x = 108 + index * 142;
      return <g key={value}>
        <line x1={x} y1="222" x2={x} y2="229" className="science-tick" />
        <text x={x} y="247" textAnchor="middle" className="science-tick-label">{value}</text>
      </g>;
    })}
    {signals.map((signal) => <g key={`${selected}-${signal.x}`}>
      <path d={`M${signal.x - 22} 222 C${signal.x - 12} 206 ${signal.x - 9} 182 ${signal.x} ${222 - signal.height} C${signal.x + 9} 182 ${signal.x + 12} 206 ${signal.x + 22} 222`} className="nmr-signal-trace" />
      {signal.label && <text x={signal.x} y={98 - (signal.height > 90 ? 12 : 0)} textAnchor="middle" className="ms-diagram-note">{signal.label}</text>}
      {signal.note && <text x={signal.x} y={114} textAnchor="middle" className="ir-band-label">integraal {signal.note}</text>}
    </g>)}
    <text x="330" y="272" textAnchor="middle" className="science-axis-label">chemische shift (ppm)</text>
    <text x="76" y="58" className="science-axis-label">relatieve intensiteit</text>
    {selected === "twoSignalsRatio" && <text x="332" y="78" textAnchor="middle" className="ms-diagram-note">aantal signalen = aantal H-omgevingen</text>}
  </svg>;
}
