export function QuestionGcChromatogram({ variant = "three-peaks" }: { variant?: string }) {
  const showTimes = variant !== "no-times";
  const peaks = [
    { x: 145, y: 82, label: "2,1" },
    { x: 300, y: 46, label: "4,8" },
    { x: 461, y: 112, label: "7,0" },
  ];
  return <svg className="science-svg gc-svg" viewBox="0 0 560 245" role="img" aria-label="Onlabeld GC-chromatogram met drie pieken">
    <line x1="52" y1="198" x2="528" y2="198" className="science-axis" />
    <line x1="52" y1="28" x2="52" y2="198" className="science-axis" />
    <path d="M52 198 C85 198,95 198,110 198 C125 198,126 82,145 82 C164 82,165 198,185 198 C220 198,242 198,258 198 C274 198,278 46,300 46 C322 46,326 198,346 198 C390 198,404 198,420 198 C437 198,442 112,461 112 C480 112,484 198,528 198" className="chromatogram-line" />
    <text x="290" y="230" textAnchor="middle" className="science-axis-label">retentietijd (min)</text>
    <text x="18" y="120" transform="rotate(-90 18 120)" className="science-axis-label">signaal</text>
    {showTimes && peaks.map((peak) => <text key={peak.x} x={peak.x} y="216" textAnchor="middle" className="science-tick-label">{peak.label}</text>)}
  </svg>;
}
