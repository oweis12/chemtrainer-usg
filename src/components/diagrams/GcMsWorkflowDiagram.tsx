type GcMsWorkflowVariant = "gcThenMs" | "retentionTimeAndSpectrum" | "unknownMixture";

const variants = new Set<GcMsWorkflowVariant>(["gcThenMs", "retentionTimeAndSpectrum", "unknownMixture"]);

function activeVariant(value?: string): GcMsWorkflowVariant {
  return value && variants.has(value as GcMsWorkflowVariant) ? value as GcMsWorkflowVariant : "gcThenMs";
}

function Arrow({ x1, y, x2 }: { x1: number; y: number; x2: number }) {
  return <g className="ms-route-arrow"><line x1={x1} y1={y} x2={x2 - 9} y2={y} /><path d={`M${x2 - 10} ${y - 6} L${x2} ${y} L${x2 - 10} ${y + 6} Z`} /></g>;
}

function MiniChromatogram({ labels = true }: { labels?: boolean }) {
  return <g>
    <line x1="0" y1="100" x2="180" y2="100" className="science-axis" />
    <path d="M0 100 C34 100 39 40 49 100 C82 100 89 9 102 100 C130 100 139 55 150 100 H180" className="chromatogram-line" />
    {labels && <><text x="49" y="34" textAnchor="middle" className="ms-diagram-note">A</text><text x="102" y="0" textAnchor="middle" className="ms-diagram-note">B</text><text x="150" y="49" textAnchor="middle" className="ms-diagram-note">C</text></>}
  </g>;
}

function MiniSpectrum() {
  return <g><line x1="0" y1="100" x2="170" y2="100" className="science-axis" /><line x1="31" y1="100" x2="31" y2="67" className="spectrum-peak peak-0" /><line x1="78" y1="100" x2="78" y2="13" className="spectrum-peak peak-1" /><line x1="132" y1="100" x2="132" y2="51" className="spectrum-peak peak-2" /></g>;
}

function GcThenMs() {
  return <>
    <g transform="translate(18 112)"><rect width="114" height="72" rx="5" className="science-box" /><text x="57" y="28" textAnchor="middle" className="ms-diagram-label">mengsel</text><text x="57" y="53" textAnchor="middle" className="ms-diagram-note">A + B + C</text></g>
    <Arrow x1={133} y={148} x2={169} />
    <g transform="translate(180 86)"><rect width="126" height="124" rx="5" className="science-box" /><text x="63" y="29" textAnchor="middle" className="ms-diagram-label">GC</text><text x="63" y="56" textAnchor="middle" className="ms-diagram-note">scheidt in tijd</text><path d="M20 95 C42 95 46 70 57 95 C75 95 82 53 94 95 H108" className="chromatogram-line" /></g>
    <Arrow x1={307} y={148} x2={348} />
    <g transform="translate(359 86)"><rect width="126" height="124" rx="5" className="science-box" /><text x="63" y="29" textAnchor="middle" className="ms-diagram-label">MS</text><text x="63" y="56" textAnchor="middle" className="ms-diagram-note">meet per piek</text><line x1="30" y1="96" x2="30" y2="77" className="spectrum-peak peak-0" /><line x1="61" y1="96" x2="61" y2="61" className="spectrum-peak peak-1" /><line x1="94" y1="96" x2="94" y2="83" className="spectrum-peak peak-2" /></g>
    <Arrow x1={486} y={148} x2={527} />
    <g transform="translate(538 112)"><rect width="84" height="72" rx="5" className="science-box" /><text x="42" y="29" textAnchor="middle" className="ms-diagram-label">bewijs</text><text x="42" y="53" textAnchor="middle" className="ms-diagram-note">per stof</text></g>
    <text x="320" y="268" textAnchor="middle" className="science-note">Retentietijd helpt ordenen; het massaspectrum levert massa-, isotoop- en fragmentaanwijzingen.</text>
  </>;
}

function RetentionTimeAndSpectrum() {
  return <>
    <g transform="translate(55 83)"><MiniChromatogram /><text x="90" y="132" textAnchor="middle" className="science-axis-label">retentietijd →</text></g>
    <path d="M157 82 C213 39 306 39 349 89" className="ms-link-line" />
    <text x="252" y="38" textAnchor="middle" className="ms-diagram-label">kies één GC-piek</text>
    <g transform="translate(397 83)"><MiniSpectrum /><text x="85" y="132" textAnchor="middle" className="science-axis-label">m/z →</text></g>
    <text x="485" y="239" textAnchor="middle" className="ms-diagram-note">eigen spectrum</text>
    <text x="320" y="290" textAnchor="middle" className="science-note">Een retentietijd is conditie-afhankelijk en is op zichzelf geen unieke stofnaam.</text>
  </>;
}

function UnknownMixture() {
  return <>
    <text x="320" y="38" textAnchor="middle" className="ms-diagram-label">onbekend mengsel</text>
    <g transform="translate(45 78)"><MiniChromatogram labels={false} /><text x="90" y="132" textAnchor="middle" className="science-axis-label">GC-data</text></g>
    <g transform="translate(265 78)"><MiniSpectrum /><text x="85" y="132" textAnchor="middle" className="science-axis-label">MS van piek 1</text></g>
    <g transform="translate(465 78)"><MiniSpectrum /><text x="85" y="132" textAnchor="middle" className="science-axis-label">MS van piek 2</text></g>
    <text x="320" y="269" textAnchor="middle" className="ms-diagram-note">combineer: aantal componenten + spectrum per component</text>
    <text x="320" y="300" textAnchor="middle" className="science-note">De figuur noemt bewust geen stofnamen: identificatie vraagt extra gegevens of vergelijking.</text>
  </>;
}

export function GcMsWorkflowDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  return <svg className={`science-svg ms-master-svg gc-ms-workflow-${selected}`} viewBox="0 0 640 320" role="img" aria-label={`GC-MS workflow: ${selected}`}>
    {selected === "gcThenMs" && <GcThenMs />}
    {selected === "retentionTimeAndSpectrum" && <RetentionTimeAndSpectrum />}
    {selected === "unknownMixture" && <UnknownMixture />}
  </svg>;
}
