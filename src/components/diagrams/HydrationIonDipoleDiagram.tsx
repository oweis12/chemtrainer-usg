export function HydrationIonDipoleDiagram() {
  return <svg className="science-svg hydration-ion-dipole-svg" viewBox="0 0 640 280" role="img" aria-label="Hydratatie en ion-dipoolinteracties">
    <rect x="38" y="34" width="564" height="212" rx="22" className="science-panel" />
    <g transform="translate(176 142)">
      <circle r="34" className="hydration-ion positive" />
      <text y="7" textAnchor="middle" className="hydration-ion-label">Na+</text>
      <g className="hydration-water">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="0" y="-49" textAnchor="middle" className="water-o-label">Oδ-</text>
      </g>
      <g className="hydration-water" transform="rotate(90)">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="0" y="-49" textAnchor="middle" className="water-o-label">Oδ-</text>
      </g>
      <g className="hydration-water" transform="rotate(180)">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="0" y="-49" textAnchor="middle" className="water-o-label">Oδ-</text>
      </g>
      <g className="hydration-water" transform="rotate(270)">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="0" y="-49" textAnchor="middle" className="water-o-label">Oδ-</text>
      </g>
    </g>
    <g transform="translate(458 142)">
      <circle r="34" className="hydration-ion negative" />
      <text y="7" textAnchor="middle" className="hydration-ion-label">Cl-</text>
      <g className="hydration-water">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="-16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
        <text x="16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
      </g>
      <g className="hydration-water" transform="rotate(90)">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="-16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
        <text x="16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
      </g>
      <g className="hydration-water" transform="rotate(180)">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="-16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
        <text x="16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
      </g>
      <g className="hydration-water" transform="rotate(270)">
        <path d="M0 -76 L-20 -34 L20 -34 Z" />
        <text x="-16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
        <text x="16" y="-22" textAnchor="middle" className="water-h-label">Hδ+</text>
      </g>
    </g>
    <text x="176" y="244" textAnchor="middle" className="science-axis-label">kation: Oδ- naar binnen</text>
    <text x="458" y="244" textAnchor="middle" className="science-axis-label">anion: Hδ+ naar binnen</text>
  </svg>;
}
