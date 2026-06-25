export function IndicatorBottle({ active, indicator }: { active: boolean; indicator: string }) {
  return <div className={`indicator-bottle ${active ? "active" : ""}`} aria-label={`Indicatorflesje met ${indicator}`}>
    <svg viewBox="0 0 120 150" role="img" aria-label="Indicatorflesje">
      <rect x="42" y="14" width="36" height="23" rx="5" className="indicator-cap" />
      <path d="M34 39 H86 L98 132 H22 Z" className="indicator-glass" />
      <path d="M30 88 C45 80 68 98 90 87 L97 132 H23 Z" className="indicator-liquid" />
      <text x="20" y="145" className="indicator-label">{indicator}</text>
    </svg>
  </div>;
}
