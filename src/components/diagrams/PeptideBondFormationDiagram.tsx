type PeptideBondFormationVariant = "condensation" | "hydrolysis" | "peptideBondHighlight";

const backboneStyle = { fill: "var(--paper-raised)", stroke: "var(--line-strong)", strokeWidth: 1.4 } as const;
const blueFill = "var(--blue-soft)";
const amberFill = "var(--amber-soft)";
const greenFill = "var(--green-soft)";
const redFill = "var(--red-soft)";

function Label({ x, y, text, fill = "var(--ink)" }: { x: number; y: number; text: string; fill?: string }) {
  return <text x={x} y={y} textAnchor="middle" className="science-label" fill={fill}>{text}</text>;
}

export function PeptideBondFormationDiagram({ variant = "condensation" }: { variant?: PeptideBondFormationVariant }) {
  if (variant === "peptideBondHighlight") {
    return (
      <svg className="science-svg peptide-bond-formation-svg" viewBox="0 0 760 220" role="img" aria-label="Peptidebinding herkennen in een vereenvoudigd dipeptide">
        <rect x="22" y="28" width="716" height="164" rx="18" style={backboneStyle} />
        <Label x={380} y={86} text="H₂N-CHR1-C(=O)-NH-CHR2-COOH" />
        <rect x="286" y="104" width="182" height="46" rx="14" fill={amberFill} stroke="var(--amber)" strokeWidth="2" />
        <Label x={377} y={132} text="C(=O)-NH" fill="var(--amber)" />
        <path d="M377 150 V172" className="science-arrow" />
        <text x="377" y="186" textAnchor="middle" className="science-note">peptidebinding</text>
        <rect x="72" y="106" width="132" height="34" rx="12" fill={blueFill} stroke="var(--blue)" strokeWidth="1.6" />
        <Label x={138} y={128} text="aminozuur 1" fill="var(--blue)" />
        <rect x="554" y="106" width="132" height="34" rx="12" fill={greenFill} stroke="var(--green)" strokeWidth="1.6" />
        <Label x={620} y={128} text="aminozuur 2" fill="var(--green)" />
      </svg>
    );
  }

  if (variant === "hydrolysis") {
    return (
      <svg className="science-svg peptide-bond-formation-svg" viewBox="0 0 760 250" role="img" aria-label="Hydrolyse van een peptidebinding">
        <rect x="18" y="24" width="724" height="202" rx="18" style={backboneStyle} />
        <rect x="42" y="58" width="240" height="112" rx="16" fill={blueFill} stroke="var(--blue)" strokeWidth="1.6" />
        <Label x={162} y={86} text="dipeptide" fill="var(--blue)" />
        <Label x={162} y={116} text="H₂N-CHR1-C(=O)-NH-CHR2-COOH" />
        <rect x="118" y="132" width="88" height="28" rx="10" fill={amberFill} stroke="var(--amber)" strokeWidth="1.6" />
        <text x="162" y="151" textAnchor="middle" className="science-note">C(=O)-NH</text>
        <circle cx="350" cy="114" r="32" fill={redFill} stroke="var(--red)" strokeWidth="1.8" />
        <Label x={350} y={120} text="H₂O" fill="var(--red)" />
        <text x="350" y="156" textAnchor="middle" className="science-note">water erbij</text>
        <path d="M394 114 H438" className="science-arrow" />
        <path d="M431 108 L438 114 L431 120" className="science-arrow" fill="none" />
        <rect x="470" y="54" width="238" height="116" rx="16" fill={greenFill} stroke="var(--green)" strokeWidth="1.6" />
        <Label x={589} y={82} text="producten" fill="var(--green)" />
        <Label x={589} y={111} text="H₂N-CHR1-COOH" />
        <Label x={589} y={143} text="+ H₂N-CHR2-COOH" />
        <text x="380" y="205" textAnchor="middle" className="science-caption">Hydrolyse gebruikt water om de peptidebinding te verbreken.</text>
      </svg>
    );
  }

  return (
    <svg className="science-svg peptide-bond-formation-svg" viewBox="0 0 760 260" role="img" aria-label="Condensatie tussen twee aminozuren waarbij een peptidebinding ontstaat">
      <rect x="18" y="22" width="724" height="214" rx="18" style={backboneStyle} />
      <rect x="34" y="56" width="204" height="128" rx="16" fill={blueFill} stroke="var(--blue)" strokeWidth="1.6" />
      <Label x={136} y={83} text="aminozuur 1" fill="var(--blue)" />
      <Label x={136} y={113} text="H₂N-CHR1-COOH" />
      <rect x="80" y="132" width="56" height="28" rx="10" fill={redFill} stroke="var(--red)" strokeWidth="1.6" />
      <text x="108" y="151" textAnchor="middle" className="science-note">OH</text>
      <rect x="268" y="56" width="204" height="128" rx="16" fill={greenFill} stroke="var(--green)" strokeWidth="1.6" />
      <Label x={370} y={83} text="aminozuur 2" fill="var(--green)" />
      <Label x={370} y={113} text="H₂N-CHR2-COOH" />
      <rect x="298" y="132" width="56" height="28" rx="10" fill={amberFill} stroke="var(--amber)" strokeWidth="1.6" />
      <text x="326" y="151" textAnchor="middle" className="science-note">H</text>
      <path d="M152 146 H278" className="science-arrow" />
      <path d="M272 140 L278 146 L272 152" className="science-arrow" fill="none" />
      <circle cx="516" cy="108" r="34" fill={redFill} stroke="var(--red)" strokeWidth="1.8" />
      <Label x={516} y={114} text="H₂O" fill="var(--red)" />
      <text x="516" y="152" textAnchor="middle" className="science-note">water vrij</text>
      <path d="M392 146 H460" className="science-arrow" />
      <path d="M454 140 L460 146 L454 152" className="science-arrow" fill="none" />
      <rect x="544" y="56" width="174" height="128" rx="16" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.6" />
      <Label x={631} y={83} text="dipeptide" />
      <Label x={631} y={113} text="H₂N-CHR1-C(=O)-NH-CHR2-COOH" />
      <rect x="584" y="132" width="96" height="28" rx="10" fill={amberFill} stroke="var(--amber)" strokeWidth="1.6" />
      <text x="632" y="151" textAnchor="middle" className="science-note">C(=O)-NH</text>
      <text x="380" y="214" textAnchor="middle" className="science-caption">Condensatie: OH van de carboxylgroep en H van de aminogroep vormen samen water.</text>
    </svg>
  );
}
