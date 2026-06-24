import { BookBookmark, CaretDown, CaretUp, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import type { BinasReference } from "../types";

interface BinasBoxProps {
  references: BinasReference[];
  heading?: string;
  compact?: boolean;
}

export function BinasBox({ references, heading = "BINAS-hulp", compact = false }: BinasBoxProps) {
  const [open, setOpen] = useState(false);

  return <section className={`binas-box ${compact ? "binas-box-compact" : ""}`}>
    <button className="binas-box-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
      <span><BookBookmark size={19} weight="duotone" /><span><b>{heading}</b><small>{references.length ? "Welke BINAS-tabel heb ik nodig?" : "Heb ik hier BINAS nodig?"}</small></span></span>
      {open ? <CaretUp size={18} /> : <CaretDown size={18} />}
    </button>
    {open && <div className="binas-box-content">
      {references.map((reference) => <article className="binas-reference-mini" key={reference.id}>
        <div><span className="binas-table-label">{reference.tabel}</span><strong>{reference.onderwerp}</strong></div>
        <p><b>Gebruik:</b> {reference.wanneerGebruikJeDezeTabel}</p>
        <p className="binas-warning"><WarningCircle size={15} weight="fill" /><span><b>Let op:</b> {reference.waarschuwing}</span></p>
      </article>)}
      {references.length ? <p className="binas-copyright-note">Alleen een wegwijzer: controleer altijd de legenda en exacte gegevens in jouw eigen BINAS-editie.</p> : <p className="binas-copyright-note"><b>Voor deze vraag is geen BINAS-tabel nodig.</b> Gebruik de gegevens uit de opgave en werk je formule, eenheden en redenering zorgvuldig uit.</p>}
    </div>}
  </section>;
}
