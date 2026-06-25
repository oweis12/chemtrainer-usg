import type { ReactNode } from "react";

export function LabBench({ children, showTile = false }: { children: ReactNode; showTile?: boolean }) {
  return <section className="titration-bench" aria-label="Titratie-practicumtafel">
    {showTile && <div className="bench-tile" aria-hidden="true">witte tegel</div>}
    {children}
  </section>;
}
