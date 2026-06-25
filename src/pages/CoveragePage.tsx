import { ChartBar, CheckCircle, Clock, PencilSimpleLine } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { CoverageChecklist, deriveObjectiveStudentStatus } from "../components/CoverageChecklist";
import { learningObjectives } from "../data/learningObjectives";
import type { ModuleId } from "../types";
import { readProgress } from "../utils/storage";

export function CoveragePage({ onVisualAudit }: { onVisualAudit: () => void }) {
  const [module, setModule] = useState<ModuleId | "all">("all");
  const [progress] = useState(() => readProgress());
  const [mastery, setMastery] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("chemtrainer-usg-objective-mastery-v1");
      return stored ? JSON.parse(stored) as Record<string, boolean> : {};
    } catch {
      return {};
    }
  });
  const visibleObjectives = useMemo(() => learningObjectives.filter((objective) => module === "all" || objective.module === module), [module]);
  const summary = useMemo(() => visibleObjectives.reduce((counts, objective) => {
    const status = deriveObjectiveStudentStatus(objective, progress, Boolean(mastery[objective.id]));
    counts[status] += 1;
    return counts;
  }, { "not-started": 0, "bezig": 0, "geoefend": 0, "beheerst": 0 }), [mastery, progress, visibleObjectives]);

  return <div className="coverage-page">
    <section className="page-intro intro-inline">
      <div>
        <span className="section-kicker">Leerdoelen</span>
        <h1>Leerdoelen checklist</h1>
        <p>Gebruik deze pagina om te zien wat je moet kunnen, welke lessen erbij horen en wat je nog even moet herhalen.</p>
      </div>
    </section>
    <section className="coverage-summary coverage-summary-student">
      <div><PencilSimpleLine size={24} weight="fill" /><strong>{summary["not-started"]}</strong><span>nog niet begonnen</span></div>
      <div><Clock size={24} weight="fill" /><strong>{summary.bezig}</strong><span>bezig</span></div>
      <div><CheckCircle size={24} weight="fill" /><strong>{summary.geoefend}</strong><span>geoefend</span></div>
      <div><CheckCircle size={24} weight="duotone" /><strong>{summary.beheerst}</strong><span>beheerst</span></div>
    </section>
    <section className="coverage-filter">
      <label>Module<select value={module} onChange={(event) => setModule(event.target.value as ModuleId | "all")}><option value="all">Alle modules</option>{(["M4", "M5D", "M6", "M7", "M8", "M9", "M10"] as ModuleId[]).map((id) => <option key={id} value={id}>{id}</option>)}</select></label>
      <p>Kies een module en vink leerdoelen af zodra je ze echt beheerst. Gebruik de lessen en vragen als routekaart: eerst begrijpen, dan oefenen, dan afvinken.</p>
    </section>
    <section className="coverage-qa-strip">
      <div>
        <span className="section-kicker">QA / developer</span>
        <h2>Niet voor je leerroute</h2>
        <p>De visuele audit blijft een controlepagina voor ontbrekende of geplande afbeeldingen.</p>
      </div>
      <button className="ghost-button" onClick={onVisualAudit}><ChartBar size={18} /> QA: visuele audit</button>
    </section>
    <div className="coverage-grid">{visibleObjectives.map((objective) => <CoverageChecklist key={objective.id} objective={objective} progress={progress} onMasteryChange={(objectiveId, value) => setMastery((current) => ({ ...current, [objectiveId]: value }))} />)}</div>
  </div>;
}
