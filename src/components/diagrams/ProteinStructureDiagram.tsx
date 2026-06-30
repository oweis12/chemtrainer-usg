type ProteinStructureVariant = "primarySecondaryTertiary" | "denaturation" | "enzymeShape";

function ProteinBead({ cx, cy, fill = "var(--amber-soft)" }: { cx: number; cy: number; fill?: string }) {
  return <circle cx={cx} cy={cy} r="12" fill={fill} stroke="var(--amber)" strokeWidth="1.6" />;
}

export function ProteinStructureDiagram({ variant = "primarySecondaryTertiary" }: { variant?: ProteinStructureVariant }) {
  if (variant === "denaturation") {
    return (
      <svg className="science-svg protein-structure-svg" viewBox="0 0 760 260" role="img" aria-label="Denaturatie van een eiwit">
        <rect x="20" y="24" width="720" height="212" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <rect x="52" y="56" width="252" height="136" rx="18" fill="var(--green-soft)" stroke="var(--green)" strokeWidth="1.6" />
        <text x="178" y="84" textAnchor="middle" className="science-label">werkend enzym</text>
        <path d="M116 152 C120 110 160 94 198 108 C238 122 252 160 220 178 C178 202 130 188 116 152 Z" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="2" />
        <circle cx="232" cy="148" r="16" fill="var(--paper-raised)" stroke="var(--amber)" strokeWidth="2" />
        <text x="232" y="153" textAnchor="middle" className="science-note">actieve</text>
        <text x="232" y="166" textAnchor="middle" className="science-note">plaats</text>
        <text x="380" y="92" textAnchor="middle" className="science-note">hitte / pH</text>
        <path d="M320 126 H432" className="science-arrow" />
        <path d="M425 120 L432 126 L425 132" className="science-arrow" fill="none" />
        <rect x="456" y="56" width="252" height="136" rx="18" fill="var(--red-soft)" stroke="var(--red)" strokeWidth="1.6" />
        <text x="582" y="84" textAnchor="middle" className="science-label">gedenatureerd</text>
        <path d="M498 150 C518 118 548 124 566 108 C584 94 608 100 616 126 C622 146 610 164 592 172 C568 184 538 188 516 174 C500 164 490 166 498 150 Z" fill="var(--paper-raised)" stroke="var(--red)" strokeWidth="2.2" strokeDasharray="8 6" />
        <path d="M530 130 C550 136 556 160 574 164" fill="none" stroke="var(--amber)" strokeWidth="2" strokeDasharray="6 5" />
        <text x="380" y="220" textAnchor="middle" className="science-caption">Denaturatie verandert vooral de ruimtelijke vorm; de peptideketen hoeft daarbij niet direct te breken.</text>
      </svg>
    );
  }

  if (variant === "enzymeShape") {
    return (
      <svg className="science-svg protein-structure-svg" viewBox="0 0 760 250" role="img" aria-label="Enzymvorm en substraatpassing">
        <rect x="22" y="24" width="716" height="202" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <rect x="46" y="54" width="290" height="140" rx="18" fill="var(--green-soft)" stroke="var(--green)" strokeWidth="1.6" />
        <text x="191" y="82" textAnchor="middle" className="science-label">goede passing</text>
        <path d="M118 146 C132 102 180 96 212 118 C242 138 254 176 224 182 C196 188 172 176 152 176 C130 176 108 170 118 146 Z" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="2" />
        <path d="M214 138 L244 152 L214 166 Z" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="2" />
        <rect x="424" y="54" width="290" height="140" rx="18" fill="var(--red-soft)" stroke="var(--red)" strokeWidth="1.6" />
        <text x="569" y="82" textAnchor="middle" className="science-label">slechte passing</text>
        <path d="M488 146 C500 110 546 104 580 122 C610 138 620 176 592 180 C568 184 550 172 526 172 C506 172 480 168 488 146 Z" fill="var(--paper-raised)" stroke="var(--red)" strokeWidth="2.2" strokeDasharray="8 6" />
        <path d="M628 138 L658 152 L628 166 Z" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="2" />
        <text x="380" y="218" textAnchor="middle" className="science-caption">Enzymwerking hangt af van de vorm van de actieve plaats en van de passing met het substraat.</text>
      </svg>
    );
  }

  return (
    <svg className="science-svg protein-structure-svg" viewBox="0 0 760 280" role="img" aria-label="Primaire, secundaire en tertiaire eiwitstructuur">
      <rect x="20" y="22" width="720" height="236" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
      <rect x="42" y="54" width="206" height="168" rx="18" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
      <text x="145" y="82" textAnchor="middle" className="science-label">primair</text>
      {[74, 104, 134, 164, 194].map((cx) => <ProteinBead key={cx} cx={cx} cy={140} />)}
      <path d="M86 140 H182" fill="none" stroke="var(--line-strong)" strokeWidth="3" />
      <text x="145" y="190" textAnchor="middle" className="science-note">aminozuurvolgorde</text>
      <rect x="278" y="54" width="206" height="168" rx="18" fill="var(--green-soft)" stroke="var(--green)" strokeWidth="1.6" />
      <text x="381" y="82" textAnchor="middle" className="science-label">secundair</text>
      <path d="M330 178 C322 122 352 100 382 110 C412 120 428 158 402 182 C382 202 342 202 330 178 Z" fill="none" stroke="var(--blue)" strokeWidth="5" strokeLinecap="round" />
      <path d="M346 120 L414 178" fill="none" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="6 5" />
      <text x="381" y="190" textAnchor="middle" className="science-note">helix / plooi</text>
      <rect x="514" y="54" width="206" height="168" rx="18" fill="var(--blue-soft)" stroke="var(--blue)" strokeWidth="1.6" />
      <text x="617" y="82" textAnchor="middle" className="science-label">tertiair</text>
      <path d="M562 170 C548 126 584 100 620 112 C652 122 672 152 656 182 C640 206 600 204 578 194 C566 188 566 184 562 170 Z" fill="var(--paper-raised)" stroke="var(--blue)" strokeWidth="2.4" />
      <circle cx="644" cy="146" r="16" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="2" />
      <text x="617" y="190" textAnchor="middle" className="science-note">totale 3D-vorm</text>
      <text x="380" y="246" textAnchor="middle" className="science-caption">Primair is de volgorde; secundair en tertiair beschrijven hoe dezelfde keten verder vouwt.</text>
    </svg>
  );
}
