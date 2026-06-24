import { ArrowRight, Drop, Lightning, Plus, Sparkle } from "@phosphor-icons/react";
import type { ConceptDiagramId } from "../types";

const diagramMeta: Record<ConceptDiagramId, { title: string; caption: string }> = {
  covalent: { title: "Twee atomen delen elektronen", caption: "De blauwe puntjes horen bij beide atomen: ze worden gedeeld." },
  ionic: { title: "Tegengestelde ladingen trekken aan", caption: "Een positief en negatief ion vormen samen een ionbinding in een rooster." },
  metallic: { title: "Metaalionen met vrije elektronen", caption: "De kleine blauwe puntjes kunnen door het metaal bewegen." },
  polarity: { title: "Een ongelijke verdeling van elektronen", caption: "De elektronen worden vaker naar de δ−-kant getrokken." },
  "hydrogen-bond": { title: "Waterstofbrug tussen twee moleculen", caption: "Dit is aantrekking tussen moleculen, niet de binding binnen één molecuul." },
  titration: { title: "Titratie: druppels tellen tot precies genoeg", caption: "Bij het equivalentiepunt zijn zuur en base in de juiste molverhouding op." },
  redox: { title: "Elektronen gaan van reductor naar oxidator", caption: "Wie e⁻ afgeeft is de reductor; wie e⁻ opneemt is de oxidator." },
  "dna-nucleotide": { title: "Een nucleotide is één bouwsteentje", caption: "Veel van deze bouwsteentjes achter elkaar vormen een DNA- of RNA-keten." },
  "mass-spectrum": { title: "Een massaspectrum is een verzameling pieken", caption: "De hoogste piek heet basispiek; M is het hele molecuulion." },
};

export function ConceptDiagram({ kind }: { kind: ConceptDiagramId }) {
  const meta = diagramMeta[kind];
  return <figure className={`concept-diagram diagram-${kind}`}><div className="diagram-heading"><Sparkle size={16} weight="fill" /> <span>{meta.title}</span></div><DiagramBody kind={kind} /><figcaption>{meta.caption}</figcaption></figure>;
}

function DiagramBody({ kind }: { kind: ConceptDiagramId }) {
  if (kind === "covalent") return <div className="diagram-covalent"><span className="atom atom-left">H</span><span className="shared-electrons">• •</span><span className="atom atom-right">H</span><span className="diagram-label">gedeelde elektronen</span></div>;
  if (kind === "ionic") return <div className="diagram-ionic"><span className="ion ion-positive">Na<sup>+</sup></span><span className="attract-line">⇄</span><span className="ion ion-negative">Cl<sup>−</sup></span><span className="diagram-label">aantrekking</span></div>;
  if (kind === "metallic") return <div className="diagram-metallic"><div className="metal-grid">{["M⁺", "M⁺", "M⁺", "M⁺", "M⁺", "M⁺"].map((ion, index) => <span key={`${ion}-${index}`} className="metal-ion">{ion}</span>)}</div><div className="electron-cloud">{Array.from({ length: 10 }, (_, index) => <i key={index}>e⁻</i>)}</div><span className="diagram-label">vrije, bewegende elektronen</span></div>;
  if (kind === "polarity") return <div className="diagram-polarity"><span className="delta delta-plus">δ+</span><span className="polar-atom">H</span><span className="electron-pull">e⁻ →</span><span className="polar-atom polar-strong">Cl</span><span className="delta delta-minus">δ−</span><span className="diagram-label">Cl trekt harder aan gedeelde elektronen</span></div>;
  if (kind === "hydrogen-bond") return <div className="diagram-hbond"><div className="water-fragment">O<span>δ−</span>—H<span>δ+</span></div><div className="hbond-dashes">⋯⋯</div><div className="water-fragment">O<span>δ−</span>—H<span>δ+</span></div><span className="diagram-label">Hδ+ wordt aangetrokken door Oδ− van een buur</span></div>;
  if (kind === "titration") return <div className="diagram-titration"><div className="buret-visual"><strong>NaOH</strong><span className="meniscus" /><i className="buret-drop"><Drop weight="fill" /></i></div><ArrowRight size={25} className="diagram-arrow" /><div className="erlenmeyer-visual"><span>azijnzuur<br />+ indicator</span></div><div className="equivalence-badge">precies genoeg<br /><b>equivalentiepunt</b></div></div>;
  if (kind === "redox") return <div className="diagram-redox"><div className="redox-card redactor"><strong>Reductor</strong><span>staat e⁻ af</span></div><div className="electron-arrow"><span>e⁻ e⁻</span><ArrowRight size={34} weight="bold" /></div><div className="redox-card oxidator"><strong>Oxidator</strong><span>neemt e⁻ op</span></div></div>;
  if (kind === "dna-nucleotide") return <div className="diagram-dna"><span className="dna-part phosphate">fosfaat</span><ArrowRight size={18} /><span className="dna-part sugar">suiker</span><ArrowRight size={18} /><span className="dna-part base">base<br />A / T / C / G</span><span className="diagram-label">= één nucleotide</span></div>;
  return <div className="diagram-ms"><div className="ms-axis"><span>intensiteit</span></div><div className="ms-peaks"><i className="peak fragment" style={{ height: "40%" }}><b>43</b><em>fragment</em></i><i className="peak base" style={{ height: "100%" }}><b>57</b><em>basispiek</em></i><i className="peak molecular" style={{ height: "65%" }}><b>M</b><em>molecuulion</em></i><i className="peak isotope" style={{ height: "12%" }}><b>M+1</b><em>vaak ¹³C</em></i></div><span className="diagram-label">m/z →</span></div>;
}
