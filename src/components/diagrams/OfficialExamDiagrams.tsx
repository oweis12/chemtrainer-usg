import type { ReactNode } from "react";

function Label({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <text x={x} y={y} className="science-note">{children}</text>;
}

export function AsparagusicAcidDiagram() {
  return <svg className="science-svg official-structure-svg" viewBox="0 0 680 280" role="img" aria-label="Eigen skeletformule van asparagusinezuur met carbonzuurgroep en zwavelring">
    <text x="36" y="38" className="science-label">asparagusinezuur — eigen schema</text>
    <path d="M155 145 L214 109 M246 108 L291 136 M318 159 L288 218 L180 218 Z" className="molecule-bond-line" />
    <circle cx="230" cy="96" r="17" className="atom-label-back" />
    <text x="230" y="96" textAnchor="middle" dominantBaseline="middle" className="structure-atom-text sulfur">S</text>
    <circle cx="310" cy="147" r="17" className="atom-label-back" />
    <text x="310" y="147" textAnchor="middle" dominantBaseline="middle" className="structure-atom-text sulfur">S</text>
    <path d="M155 145 L92 108" className="molecule-bond-line" />
    <text x="54" y="108" className="structure-atom-text">HO</text>
    <path d="M92 108 L92 70" className="molecule-bond-line" />
    <path d="M100 108 L100 70" className="molecule-bond-line thin" />
    <text x="82" y="62" className="structure-atom-text oxygen">O</text>
    <circle cx="155" cy="145" r="5" className="structure-carbon-dot" />
    <circle cx="180" cy="218" r="5" className="structure-carbon-dot" />
    <circle cx="285" cy="218" r="5" className="structure-carbon-dot" />
    <path d="M396 92 h210 v128 h-210 z" className="callout-box" />
    <Label x={414} y={122}>Controleer in je antwoord:</Label>
    <Label x={414} y={150}>C₄H₆O₂S₂</Label>
    <Label x={414} y={178}>C heeft vier bindingen</Label>
    <Label x={414} y={206}>carbonzuurgroep = –C(=O)–OH</Label>
  </svg>;
}

export function EthylEsterFormationDiagram() {
  return <svg className="science-svg official-structure-svg" viewBox="0 0 720 285" role="img" aria-label="Eigen schema voor ethylester vorming uit carbonzuur en ethanol">
    <text x="36" y="38" className="science-label">ethylester tekenen — start vanuit carbonzuur + ethanol</text>
    <text x="64" y="126" className="structure-atom-text">R</text>
    <path d="M95 120 L150 120" className="molecule-bond-line" />
    <text x="160" y="126" className="structure-atom-text">C</text>
    <path d="M178 112 L178 70" className="molecule-bond-line" />
    <path d="M186 112 L186 70" className="molecule-bond-line thin" />
    <text x="170" y="62" className="structure-atom-text oxygen">O</text>
    <path d="M184 120 L245 120" className="molecule-bond-line" />
    <text x="255" y="126" className="structure-atom-text oxygen">OH</text>
    <text x="323" y="126" className="science-label">+</text>
    <text x="375" y="126" className="structure-atom-text">HO–CH₂–CH₃</text>
    <path d="M520 120 h82" className="science-arrow" />
    <text x="624" y="126" className="structure-atom-text">R–C(=O)–O–CH₂–CH₃</text>
    <path d="M240 152 C312 210 431 210 528 152" className="science-arrow amber-arrow" />
    <Label x={260} y={235}>H van –OH en H van ethanol vormen samen water; over blijft –C(=O)–O–CH₂–CH₃.</Label>
  </svg>;
}

export function CelluloseHydrogenBondDiagram() {
  return <svg className="science-svg official-structure-svg" viewBox="0 0 720 300" role="img" aria-label="Eigen schema van twee celluloseketens met waterstofbruggen tussen OH-groepen">
    <text x="34" y="36" className="science-label">cellulose — OH-groepen kunnen waterstofbruggen vormen</text>
    <path d="M80 100 C145 62 200 138 265 100 S385 62 450 100 S570 138 640 100" className="polymer-chain" />
    <path d="M80 210 C145 172 200 248 265 210 S385 172 450 210 S570 248 640 210" className="polymer-chain" />
    {[150, 330, 510].map((x) => <g key={`top-${x}`}><path d={`M${x} 88 L${x} 58`} className="molecule-bond-line" /><text x={x - 14} y="50" className="structure-atom-text oxygen">OH</text></g>)}
    {[220, 405, 585].map((x) => <g key={`bottom-${x}`}><path d={`M${x} 222 L${x} 252`} className="molecule-bond-line" /><text x={x - 14} y="274" className="structure-atom-text oxygen">OH</text></g>)}
    <path d="M150 58 C175 94 194 150 220 252" className="hbond-dash" />
    <path d="M330 58 C360 104 382 160 405 252" className="hbond-dash" />
    <path d="M510 58 C538 100 560 158 585 252" className="hbond-dash" />
    <Label x={78} y={282}>Stippellijn: Hδ⁺ van O–H naar Oδ− van een andere keten.</Label>
  </svg>;
}

export function CalciumHydrationDiagram() {
  const waters = [
    { x: 360, y: 74, rotate: 180 },
    { x: 520, y: 148, rotate: 270 },
    { x: 360, y: 222, rotate: 0 },
    { x: 200, y: 148, rotate: 90 },
  ];
  return <svg className="science-svg official-structure-svg" viewBox="0 0 720 300" role="img" aria-label="Eigen schema van vier watermoleculen rond calciumion met zuurstof naar calcium gericht">
    <text x="34" y="36" className="science-label">hydratatie van Ca²⁺ — water richt zijn Oδ− naar het ion</text>
    <circle cx="360" cy="148" r="46" className="ion-core" />
    <text x="337" y="157" className="ion-core-label">Ca²⁺</text>
    {waters.map((water) => <g key={`${water.x}-${water.y}`} transform={`translate(${water.x} ${water.y}) rotate(${water.rotate})`}>
      <circle cx="0" cy="0" r="20" className="water-oxygen" />
      <text x="-8" y="6" className="water-label">Oδ−</text>
      <circle cx="-35" cy="30" r="13" className="water-hydrogen" />
      <circle cx="35" cy="30" r="13" className="water-hydrogen" />
      <text x="-44" y="35" className="water-h-label">Hδ+</text>
      <text x="23" y="35" className="water-h-label">Hδ+</text>
    </g>)}
    <path d="M360 100 L360 76 M408 148 L500 148 M360 196 L360 220 M312 148 L220 148" className="ion-dipole-line" />
    <Label x={68} y={270}>Bij een positief ion wijst de negatieve O-kant naar binnen; de Hδ⁺-kanten wijzen naar buiten.</Label>
  </svg>;
}
