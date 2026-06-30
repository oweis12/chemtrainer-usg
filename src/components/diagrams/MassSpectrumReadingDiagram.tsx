type MassSpectrumReadingVariant = "basic" | "mPeak" | "basePeakVsMPeak" | "fragmentPeaks";

const variants = new Set<MassSpectrumReadingVariant>(["basic", "mPeak", "basePeakVsMPeak", "fragmentPeaks"]);

function activeVariant(value?: string): MassSpectrumReadingVariant {
  return value && variants.has(value as MassSpectrumReadingVariant) ? value as MassSpectrumReadingVariant : "basic";
}

type Peak = { mz: number; intensity: number; role?: string; tone: string };

const peakSets: Record<MassSpectrumReadingVariant, Peak[]> = {
  basic: [{ mz: 15, intensity: 42, role: "fragment", tone: "peak-0" }, { mz: 29, intensity: 100, role: "basispiek", tone: "peak-1" }, { mz: 44, intensity: 35, role: "mogelijke M", tone: "peak-2" }],
  mPeak: [{ mz: 15, intensity: 38, role: "fragment", tone: "peak-0" }, { mz: 29, intensity: 100, role: "fragment", tone: "peak-1" }, { mz: 44, intensity: 31, role: "M", tone: "peak-2" }, { mz: 45, intensity: 3, role: "M+1", tone: "peak-3" }],
  basePeakVsMPeak: [{ mz: 43, intensity: 100, role: "basispiek", tone: "peak-1" }, { mz: 58, intensity: 51, role: "fragment", tone: "peak-0" }, { mz: 86, intensity: 24, role: "M-piek", tone: "peak-2" }],
  fragmentPeaks: [{ mz: 15, intensity: 46, role: "fragment", tone: "peak-0" }, { mz: 29, intensity: 82, role: "fragment", tone: "peak-0" }, { mz: 43, intensity: 100, role: "fragment", tone: "peak-1" }, { mz: 72, intensity: 35, role: "M-piek", tone: "peak-2" }],
};

export function MassSpectrumReadingDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  const peaks = peakSets[selected];
  const minMz = Math.min(...peaks.map((peak) => peak.mz));
  const maxMz = Math.max(...peaks.map((peak) => peak.mz));
  const xFor = (mz: number) => 88 + ((mz - minMz) / Math.max(1, maxMz - minMz)) * 462;
  const yFor = (intensity: number) => 244 - intensity * 1.7;

  return <svg className={`science-svg ms-master-svg ms-spectrum-reading-${selected}`} viewBox="0 0 640 330" role="img" aria-label={`Massaspectrum lezen: ${selected}`}>
    <line x1="72" y1="52" x2="72" y2="244" className="science-axis" />
    <line x1="72" y1="244" x2="584" y2="244" className="science-axis" />
    {[0, 50, 100].map((value) => <g key={value}><line x1="65" y1={244 - value * 1.7} x2="72" y2={244 - value * 1.7} className="science-tick" /><text x="59" y={249 - value * 1.7} textAnchor="end" className="science-tick-label">{value}</text></g>)}
    {peaks.map((peak) => {
      const x = xFor(peak.mz);
      const y = yFor(peak.intensity);
      return <g key={`${peak.mz}-${peak.role}`}>
        <line x1={x} y1="244" x2={x} y2={y} className={`spectrum-peak ${peak.tone}`} />
        <text x={x} y="265" textAnchor="middle" className="science-tick-label">{peak.mz}</text>
        {peak.role && <text x={x} y={Math.max(34, y - 11)} textAnchor="middle" className="ms-diagram-note">{peak.role}</text>}
      </g>;
    })}
    <text x="18" y="160" transform="rotate(-90 18 160)" textAnchor="middle" className="science-axis-label">relatieve intensiteit (%)</text>
    <text x="330" y="305" textAnchor="middle" className="science-axis-label">m/z = massa / lading</text>
    {selected === "basePeakVsMPeak" && <g className="ms-spectrum-callout"><path d="M186 75 H316" /><text x="251" y="63" textAnchor="middle" className="ms-diagram-label">hoogste piek ≠ grootste m/z</text></g>}
  </svg>;
}
