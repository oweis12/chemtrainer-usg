export function MicelleDiagram() {
  const droplets = Array.from({ length: 10 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 10;
    const x = 320 + Math.cos(angle) * 92;
    const y = 142 + Math.sin(angle) * 78;
    const tailX = 320 + Math.cos(angle) * 44;
    const tailY = 142 + Math.sin(angle) * 38;
    return { x, y, tailX, tailY, angle };
  });

  return <svg className="science-svg micelle-svg" viewBox="0 0 640 280" role="img" aria-label="Micel met hydrofiele kop en hydrofobe staart">
    <rect x="42" y="34" width="556" height="212" rx="22" className="science-panel" />
    <ellipse cx="320" cy="142" rx="74" ry="58" className="micelle-oil-core" />
    {droplets.map((drop, index) => <g key={index}>
      <line x1={drop.tailX} y1={drop.tailY} x2={drop.x} y2={drop.y} className="micelle-tail" />
      <circle cx={drop.x} cy={drop.y} r="12" className="micelle-head" />
    </g>)}
    <text x="320" y="146" textAnchor="middle" className="micelle-core-label">olie / vet</text>
    <text x="122" y="78" className="science-axis-label">hydrofiele kop naar water</text>
    <text x="422" y="78" className="science-axis-label">hydrofobe staart naar vet</text>
    <text x="320" y="244" textAnchor="middle" className="ms-diagram-note">zeep verdeelt olie als micellen, geen echte zout-oplossing</text>
  </svg>;
}
