type IsotopePatternVariant = "mPlusOneCarbon" | "chlorineThreeToOne" | "bromineOneToOne" | "multipleChlorines" | "unknownPractice";

const variants = new Set<IsotopePatternVariant>(["mPlusOneCarbon", "chlorineThreeToOne", "bromineOneToOne", "multipleChlorines", "unknownPractice"]);

function activeVariant(value?: string): IsotopePatternVariant {
  return value && variants.has(value as IsotopePatternVariant) ? value as IsotopePatternVariant : "mPlusOneCarbon";
}

const patterns: Record<IsotopePatternVariant, Array<{ offset: number; height: number; label: string; note?: string }>> = {
  mPlusOneCarbon: [{ offset: 0, height: 100, label: "M", note: "meeste ¹²C" }, { offset: 1, height: 12, label: "M+1", note: "vaak ¹³C" }],
  chlorineThreeToOne: [{ offset: 0, height: 100, label: "M", note: "³⁵Cl" }, { offset: 2, height: 33, label: "M+2", note: "³⁷Cl" }],
  bromineOneToOne: [{ offset: 0, height: 100, label: "M", note: "⁷⁹Br" }, { offset: 2, height: 97, label: "M+2", note: "⁸¹Br" }],
  multipleChlorines: [{ offset: 0, height: 100, label: "M" }, { offset: 2, height: 65, label: "M+2" }, { offset: 4, height: 11, label: "M+4" }],
  unknownPractice: [{ offset: 0, height: 100, label: "78" }, { offset: 2, height: 34, label: "80" }],
};

const ratioLabel: Record<IsotopePatternVariant, string> = {
  mPlusOneCarbon: "M+1 groeit ongeveer mee met het aantal C-atomen",
  chlorineThreeToOne: "M : M+2 ≈ 3 : 1",
  bromineOneToOne: "M : M+2 ≈ 1 : 1",
  multipleChlorines: "meerdere Cl-atomen: bundel M, M+2, M+4",
  unknownPractice: "oefendata: bepaal zelf welk patroon past",
};

export function IsotopePatternDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  const peaks = patterns[selected];
  const xFor = (offset: number) => 228 + offset * 57;
  return <svg className={`science-svg ms-master-svg isotope-pattern-${selected}`} viewBox="0 0 640 320" role="img" aria-label={`Isotopenpatroon: ${selected}`}>
    <line x1="94" y1="238" x2="554" y2="238" className="science-axis" />
    <line x1="94" y1="238" x2="94" y2="54" className="science-axis" />
    <text x="21" y="157" transform="rotate(-90 21 157)" textAnchor="middle" className="science-axis-label">relatieve intensiteit</text>
    {peaks.map((peak, index) => {
      const x = xFor(peak.offset);
      const y = 238 - peak.height * 1.55;
      return <g key={peak.label}>
        <line x1={x} y1="238" x2={x} y2={y} className={`spectrum-peak peak-${Math.min(index + 1, 3)}`} />
        <text x={x} y="261" textAnchor="middle" className="ms-diagram-label">{peak.label}</text>
        {selected !== "unknownPractice" && peak.note && <text x={x} y={Math.max(39, y - 12)} textAnchor="middle" className="ms-diagram-note">{peak.note}</text>}
      </g>;
    })}
    <text x="325" y="298" textAnchor="middle" className="science-axis-label">m/z</text>
    <text x="325" y="34" textAnchor="middle" className="ms-diagram-label">{ratioLabel[selected]}</text>
  </svg>;
}
