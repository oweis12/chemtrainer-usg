type Peak = { x: number; h: number; label: string; note?: string };

const presets: Record<string, Peak[]> = {
  standard: [
    { x: 92, h: 45, label: "43" },
    { x: 178, h: 120, label: "57" },
    { x: 304, h: 76, label: "88" },
    { x: 330, h: 14, label: "89" },
  ],
  chlorine: [
    { x: 120, h: 42, label: "43" },
    { x: 236, h: 120, label: "78" },
    { x: 282, h: 40, label: "80" },
  ],
  bromine: [
    { x: 116, h: 34, label: "43" },
    { x: 232, h: 116, label: "122" },
    { x: 282, h: 112, label: "124" },
  ],
  carbon: [
    { x: 106, h: 62, label: "43" },
    { x: 246, h: 120, label: "86" },
    { x: 274, h: 18, label: "87" },
  ],
};

export function QuestionMassSpectrum({ variant = "standard" }: { variant?: string }) {
  const labels = !variant.includes("unlabeled");
  const presetKey = variant.replace("-unlabeled", "");
  const peaks = presets[presetKey] ?? presets.standard;
  return <svg className="science-svg mass-spectrum-svg" viewBox="0 0 520 265" role="img" aria-label="Oefenmassaspectrum met configureerbare pieken">
    <line x1="55" y1="25" x2="55" y2="210" className="science-axis" />
    <line x1="55" y1="210" x2="490" y2="210" className="science-axis" />
    {[0, 50, 100].map((value) => <g key={value}>
      <line x1="50" y1={210 - value * 1.55} x2="55" y2={210 - value * 1.55} className="science-tick" />
      <text x="44" y={214 - value * 1.55} textAnchor="end" className="science-tick-label">{value}</text>
    </g>)}
    {peaks.map((peak, index) => <g key={`${peak.label}-${index}`}>
      <line x1={peak.x} y1="210" x2={peak.x} y2={210 - peak.h * 1.55} className={`spectrum-peak peak-${index}`} />
      {labels && <text x={peak.x} y="229" textAnchor="middle" className="science-tick-label">{peak.label}</text>}
      {peak.note && labels && <text x={peak.x} y={198 - peak.h * 1.55} textAnchor="middle" className="science-note">{peak.note}</text>}
    </g>)}
    <text x="18" y="132" transform="rotate(-90 18 132)" className="science-axis-label">relatieve intensiteit (%)</text>
    <text x="288" y="252" textAnchor="middle" className="science-axis-label">m/z</text>
  </svg>;
}
