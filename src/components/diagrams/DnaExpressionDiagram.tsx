type DnaExpressionVariant =
  | "nucleotide"
  | "basePairs"
  | "transcription"
  | "translation"
  | "dnaToProteinSteps"
  | "mutationEffect";

function Block({ x, y, w, h, fill, stroke = "var(--line-strong)", label, note }: { x: number; y: number; w: number; h: number; fill: string; stroke?: string; label: string; note?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={stroke} strokeWidth="1.6" />
      <text x={x + w / 2} y={y + 30} textAnchor="middle" className="science-label">{label}</text>
      {note ? <text x={x + w / 2} y={y + 56} textAnchor="middle" className="science-note">{note}</text> : null}
    </>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <path d={`M${x1} ${y1} H${x2}`} className="science-arrow" />
      <path d={`M${x2 - 7} ${y2 - 6} L${x2} ${y2} L${x2 - 7} ${y2 + 6}`} className="science-arrow" fill="none" />
    </>
  );
}

export function DnaExpressionDiagram({ variant = "dnaToProteinSteps" }: { variant?: DnaExpressionVariant }) {
  if (variant === "nucleotide") {
    return (
      <svg className="science-svg dna-expression-svg" viewBox="0 0 760 220" role="img" aria-label="Bouw van een DNA-nucleotide">
        <rect x="22" y="26" width="716" height="168" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <Block x={58} y={68} w={150} h={84} fill="var(--blue-soft)" stroke="var(--blue)" label="fosfaat" />
        <Arrow x1={208} y1={110} x2={270} y2={110} />
        <Block x={270} y={68} w={150} h={84} fill="var(--amber-soft)" stroke="var(--amber)" label="desoxyribose" />
        <Arrow x1={420} y1={110} x2={482} y2={110} />
        <Block x={482} y={68} w={214} h={84} fill="var(--green-soft)" stroke="var(--green)" label="base" note="A / T / C / G" />
        <text x="380" y="184" textAnchor="middle" className="science-caption">Eén nucleotide bestaat uit fosfaat, suiker en één stikstofbase.</text>
      </svg>
    );
  }

  if (variant === "basePairs") {
    const pairs = [
      { left: "A", right: "T", y: 72 },
      { left: "C", right: "G", y: 110 },
      { left: "G", right: "C", y: 148 },
    ];
    return (
      <svg className="science-svg dna-expression-svg" viewBox="0 0 760 250" role="img" aria-label="Complementaire basenparing in DNA">
        <rect x="26" y="24" width="708" height="198" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <path d="M132 54 C112 90 112 156 132 192" fill="none" stroke="var(--blue)" strokeWidth="8" strokeLinecap="round" />
        <path d="M628 54 C648 90 648 156 628 192" fill="none" stroke="var(--blue)" strokeWidth="8" strokeLinecap="round" />
        {pairs.map((pair) => (
          <g key={`${pair.left}-${pair.right}-${pair.y}`}>
            <rect x="182" y={pair.y - 18} width="78" height="36" rx="14" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
            <text x="221" y={pair.y + 6} textAnchor="middle" className="science-label">{pair.left}</text>
            <rect x="500" y={pair.y - 18} width="78" height="36" rx="14" fill="var(--green-soft)" stroke="var(--green)" strokeWidth="1.6" />
            <text x="539" y={pair.y + 6} textAnchor="middle" className="science-label">{pair.right}</text>
            <path d={`M260 ${pair.y} H500`} stroke="var(--line-strong)" strokeWidth="2.4" strokeDasharray="7 7" fill="none" />
          </g>
        ))}
        <text x="221" y="52" textAnchor="middle" className="science-note">streng 1</text>
        <text x="539" y="52" textAnchor="middle" className="science-note">streng 2</text>
        <text x="380" y="212" textAnchor="middle" className="science-caption">A paart met T en C paart met G; de strengen worden bij elkaar gehouden door waterstofbruggen.</text>
      </svg>
    );
  }

  if (variant === "transcription") {
    const mapping = ["A→U", "T→A", "C→G", "G→C"];
    return (
      <svg className="science-svg dna-expression-svg" viewBox="0 0 760 250" role="img" aria-label="Transcriptie van DNA naar mRNA">
        <rect x="24" y="22" width="712" height="206" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <Block x={58} y={54} w={300} h={70} fill="var(--blue-soft)" stroke="var(--blue)" label="DNA-matrijs" note="3'-TAC CGA AAA-5'" />
        <Arrow x1={358} y1={89} x2={428} y2={89} />
        <Block x={430} y={54} w={274} h={70} fill="var(--green-soft)" stroke="var(--green)" label="mRNA" note="5'-AUG GCU UUU-3'" />
        <text x="381" y="75" textAnchor="middle" className="science-note">transcriptie</text>
        {mapping.map((item, index) => (
          <g key={item}>
            <rect x={78 + index * 156} y="148" width="118" height="34" rx="12" fill={index % 2 === 0 ? "var(--amber-soft)" : "var(--paper-muted)"} stroke="var(--line-strong)" strokeWidth="1.2" />
            <text x={137 + index * 156} y="170" textAnchor="middle" className="science-note">{item}</text>
          </g>
        ))}
        <text x="380" y="206" textAnchor="middle" className="science-caption">Gebruik bij transcriptie RNA-regels: mRNA krijgt U in plaats van T.</text>
      </svg>
    );
  }

  if (variant === "translation") {
    return (
      <svg className="science-svg dna-expression-svg" viewBox="0 0 760 260" role="img" aria-label="Translatie van mRNA-codons naar een aminozuurketen">
        <rect x="24" y="24" width="712" height="212" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <Block x={58} y={62} w={236} h={72} fill="var(--green-soft)" stroke="var(--green)" label="mRNA" note="AUG | GCU | UUU | UAA" />
        <Block x={326} y={56} w={122} h={84} fill="var(--amber-soft)" stroke="var(--amber)" label="ribosoom" note="leest codons" />
        <Arrow x1={294} y1={97} x2={326} y2={97} />
        <Arrow x1={448} y1={97} x2={506} y2={97} />
        <Block x={506} y={62} w={188} h={72} fill="var(--blue-soft)" stroke="var(--blue)" label="aminozuren" note="Met - Ala - Phe" />
        <path d="M112 178 C156 156 206 156 248 178" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <path d="M248 178 C292 200 338 200 382 178" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <path d="M382 178 C426 156 478 156 520 178" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
        <circle cx="112" cy="178" r="16" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
        <circle cx="248" cy="178" r="16" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
        <circle cx="382" cy="178" r="16" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
        <circle cx="520" cy="178" r="16" fill="var(--red-soft)" stroke="var(--red)" strokeWidth="1.6" />
        <text x="520" y="205" textAnchor="middle" className="science-note">stop</text>
        <text x="380" y="223" textAnchor="middle" className="science-caption">Translatie leest mRNA in codons van drie basen en koppelt de bijbehorende aminozuren.</text>
      </svg>
    );
  }

  if (variant === "mutationEffect") {
    return (
      <svg className="science-svg dna-expression-svg" viewBox="0 0 760 280" role="img" aria-label="Effect van een mutatie op codon en aminozuur">
        <rect x="22" y="20" width="716" height="238" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
        <text x="164" y="50" textAnchor="middle" className="science-label">normaal</text>
        <Block x={48} y={66} w={232} h={56} fill="var(--blue-soft)" stroke="var(--blue)" label="DNA" note="TAC CGA AAA" />
        <Block x={48} y={132} w={232} h={56} fill="var(--green-soft)" stroke="var(--green)" label="mRNA" note="AUG GCU UUU" />
        <Block x={48} y={198} w={232} h={40} fill="var(--amber-soft)" stroke="var(--amber)" label="Met - Ala - Phe" />
        <text x="596" y="50" textAnchor="middle" className="science-label">mutatie</text>
        <Block x={480} y={66} w={232} h={56} fill="var(--red-soft)" stroke="var(--red)" label="DNA" note="TAC CCA AAA" />
        <Block x={480} y={132} w={232} h={56} fill="var(--green-soft)" stroke="var(--green)" label="mRNA" note="AUG GGU UUU" />
        <Block x={480} y={198} w={232} h={40} fill="var(--amber-soft)" stroke="var(--amber)" label="Met - Gly - Phe" />
        <text x="380" y="98" textAnchor="middle" className="science-note">andere base</text>
        <Arrow x1={280} y1={154} x2={480} y2={154} />
        <text x="380" y="246" textAnchor="middle" className="science-caption">Een baseverandering kan een ander mRNA-codon en daarna een ander aminozuur geven.</text>
      </svg>
    );
  }

  return (
    <svg className="science-svg dna-expression-svg" viewBox="0 0 760 260" role="img" aria-label="Overzicht van DNA naar mRNA naar codons en aminozuurketen">
      <rect x="20" y="24" width="720" height="212" rx="18" fill="var(--paper-raised)" stroke="var(--line-strong)" strokeWidth="1.4" />
      <Block x={42} y={76} w={138} h={74} fill="var(--blue-soft)" stroke="var(--blue)" label="DNA" note="A T C G" />
      <Arrow x1={180} y1={113} x2={254} y2={113} />
      <text x="217" y="92" textAnchor="middle" className="science-note">transcriptie</text>
      <Block x={254} y={76} w={138} h={74} fill="var(--green-soft)" stroke="var(--green)" label="mRNA" note="A U C G" />
      <Arrow x1={392} y1={113} x2={466} y2={113} />
      <text x="429" y="92" textAnchor="middle" className="science-note">codons</text>
      <Block x={466} y={76} w={116} h={74} fill="var(--amber-soft)" stroke="var(--amber)" label="AUG" note="GCU | UUU" />
      <Arrow x1={582} y1={113} x2={656} y2={113} />
      <text x="619" y="92" textAnchor="middle" className="science-note">translatie</text>
      <Block x={656} y={76} w={64} h={74} fill="var(--red-soft)" stroke="var(--red)" label="eiwit" note="keten" />
      <path d="M164 186 C214 166 264 166 314 186" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
      <path d="M314 186 C364 206 412 206 462 186" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
      <path d="M462 186 C512 166 560 166 610 186" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
      <circle cx="164" cy="186" r="14" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
      <circle cx="314" cy="186" r="14" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
      <circle cx="462" cy="186" r="14" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
      <circle cx="610" cy="186" r="14" fill="var(--amber-soft)" stroke="var(--amber)" strokeWidth="1.6" />
      <text x="380" y="220" textAnchor="middle" className="science-caption">Vaste toetsroute: DNA bepalen, mRNA maken, codons groeperen, daarna aminozuurvolgorde noteren.</text>
    </svg>
  );
}
