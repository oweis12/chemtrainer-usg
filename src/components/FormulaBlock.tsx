import { Sigma } from "@phosphor-icons/react";

interface FormulaBlockProps {
  title?: string;
  children: React.ReactNode;
  note?: string;
}

export function FormulaBlock({ title = "Formuleblok", children, note }: FormulaBlockProps) {
  return (
    <aside className="formula-block">
      <div className="formula-heading"><Sigma size={17} weight="bold" /> {title}</div>
      <div className="formula-content">{children}</div>
      {note && <p className="formula-note">{note}</p>}
    </aside>
  );
}
