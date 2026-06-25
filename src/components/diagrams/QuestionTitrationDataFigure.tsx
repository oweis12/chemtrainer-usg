export function QuestionTitrationDataFigure({ variant = "dilution" }: { variant?: string }) {
  if (variant === "buret-readings") {
    return <svg className="science-svg titration-svg" viewBox="0 0 620 250" role="img" aria-label="Buretstanden voor een titratieberekening">
      <rect x="72" y="28" width="88" height="168" className="buret-body" />
      <rect x="324" y="28" width="88" height="168" className="buret-body" />
      <path d="M78 74 Q116 82 154 74" className="meniscus-line" />
      <path d="M330 156 Q368 164 406 156" className="meniscus-line" />
      <text x="116" y="222" textAnchor="middle" className="science-axis-label">beginstand 1,25 mL</text>
      <text x="368" y="222" textAnchor="middle" className="science-axis-label">eindstand 19,70 mL</text>
      <text x="246" y="116" textAnchor="middle" className="science-note">verbruik = eindstand - beginstand</text>
    </svg>;
  }
  if (variant === "flow") {
    const items = ["buretvolume", "mol titrant", "molverhouding", "gevraagde c of massa%"];
    return <svg className="science-svg titration-svg" viewBox="0 0 620 210" role="img" aria-label="Titratie rekenflow">
      {items.map((item, index) => <g key={item}>
        <rect x={34 + index * 145} y="76" width="112" height="48" rx="6" className="buret-body" />
        <text x={90 + index * 145} y="104" textAnchor="middle" className="science-note">{item}</text>
        {index < items.length - 1 && <path d={`M${150 + index * 145} 100 L${170 + index * 145} 100`} className="science-arrow" />}
      </g>)}
      <text x="310" y="156" textAnchor="middle" className="science-axis-label">mL naar L voor n = molariteit x volume</text>
    </svg>;
  }
  return <svg className="science-svg titration-svg" viewBox="0 0 620 250" role="img" aria-label="Verdunningsschema voor natuurazijn en titratie">
    <rect x="52" y="74" width="114" height="66" rx="6" className="buret-body" />
    <text x="109" y="100" textAnchor="middle" className="science-note">10,00 mL</text>
    <text x="109" y="121" textAnchor="middle" className="science-note">natuurazijn</text>
    <path d="M174 107 L246 107" className="science-arrow" />
    <rect x="254" y="58" width="118" height="96" rx="6" className="erlenmeyer-shape" />
    <text x="313" y="98" textAnchor="middle" className="science-note">aanvullen</text>
    <text x="313" y="121" textAnchor="middle" className="science-note">tot 100,0 mL</text>
    <path d="M380 107 L452 107" className="science-arrow" />
    <rect x="460" y="66" width="116" height="82" rx="6" className="buret-body" />
    <text x="518" y="94" textAnchor="middle" className="science-note">25,00 mL</text>
    <text x="518" y="116" textAnchor="middle" className="science-note">aliquot</text>
    <text x="310" y="192" textAnchor="middle" className="science-axis-label">verdunningsfactor = 100,0 / 10,00 = 10</text>
  </svg>;
}
