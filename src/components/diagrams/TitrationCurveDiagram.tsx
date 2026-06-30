type TitrationCurveVariant = "weakAcidStrongBase" | "questionSafe";

const titrationCurveVariants = new Set<TitrationCurveVariant>(["weakAcidStrongBase", "questionSafe"]);

function activeTitrationCurveVariant(value?: string): TitrationCurveVariant {
  return value && titrationCurveVariants.has(value as TitrationCurveVariant) ? (value as TitrationCurveVariant) : "weakAcidStrongBase";
}

const curvePath = "M92 206 C146 196 186 180 226 162 C254 149 286 144 314 140 C332 137 346 132 356 118 C366 102 370 82 378 66 C388 48 406 40 456 38";

export function TitrationCurveDiagram({ variant }: { variant?: string }) {
  const selected = activeTitrationCurveVariant(variant);
  return <svg className={`science-svg titration-curve-svg titration-curve-${selected}`} viewBox="0 0 640 300" role="img" aria-label={`Titratiecurve: ${selected}`}>
    <rect x="58" y="30" width="540" height="204" rx="18" className="science-panel" />
    <line x1="84" y1="52" x2="84" y2="232" className="science-axis" />
    <line x1="84" y1="232" x2="584" y2="232" className="science-axis" />
    {[0, 7, 14].map((value) => {
      const y = 232 - value * 12.4;
      return <g key={value}>
        <line x1="77" y1={y} x2="84" y2={y} className="science-tick" />
        <text x="68" y={y + 4} textAnchor="end" className="science-tick-label">{value}</text>
      </g>;
    })}
    {[0, 10, 20, 30].map((value, index) => {
      const x = 108 + index * 138;
      return <g key={value}>
        <line x1={x} y1="232" x2={x} y2="239" className="science-tick" />
        <text x={x} y="257" textAnchor="middle" className="science-tick-label">{value}</text>
      </g>;
    })}
    <path d={curvePath} className="titration-curve-trace" />
    {selected === "weakAcidStrongBase" && <>
      <line x1="356" y1="40" x2="356" y2="232" className="titration-guide-line" />
      <rect x="332" y="78" width="74" height="96" rx="16" className="titration-indicator-zone" />
      <text x="356" y="70" textAnchor="middle" className="ir-band-label">steile pH-sprong</text>
      <text x="356" y="190" textAnchor="middle" className="ms-diagram-note">omslagtraject hier kiezen</text>
      <text x="412" y="54" className="ms-diagram-note">equivalentiepunt boven pH 7</text>
    </>}
    <text x="26" y="142" transform="rotate(-90 26 142)" textAnchor="middle" className="science-axis-label">pH</text>
    <text x="334" y="284" textAnchor="middle" className="science-axis-label">toegevoegd volume titrant (mL)</text>
  </svg>;
}
