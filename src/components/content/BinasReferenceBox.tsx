import { BookBookmark, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export type BinasReference = {
  table: string;
  title: string;
  useFor: string;
  howToUse?: string;
  example?: string;
};

interface BinasReferenceBoxProps {
  references: BinasReference[];
  compact?: boolean;
}

export function BinasReferenceBox({ references, compact = false }: BinasReferenceBoxProps) {
  if (!references.length) return null;

  return <section className={`binas-reference-box ${compact ? "binas-reference-box-compact" : ""}`}>
    <div className="binas-reference-box-head">
      <BookBookmark size={20} weight="duotone" />
      <div>
        <strong>Waar vind je dit in BINAS?</strong>
        <span>Wegwijzer, geen overgenomen tabelinhoud.</span>
      </div>
    </div>
    <div className="lesson-binas-reference-list">
      {references.map((reference) => <article key={`${reference.table}-${reference.title}`} className="lesson-binas-reference-card">
        <div><span>{reference.table}</span><strong>{reference.title}</strong></div>
        <p><b>Gebruik voor:</b> {reference.useFor}</p>
        {reference.howToUse && <p><CheckCircle size={15} weight="fill" /><span>{reference.howToUse}</span></p>}
        {reference.example && <p><WarningCircle size={15} weight="fill" /><span>{reference.example}</span></p>}
      </article>)}
    </div>
  </section>;
}
