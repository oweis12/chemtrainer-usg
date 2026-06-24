import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import type { ChemistryModule } from "../types";
import { ProgressBar } from "./ProgressBar";

interface ModuleCardProps {
  module: ChemistryModule;
  score: number;
  attempts: number;
  onOpen: () => void;
}

export function ModuleCard({ module, score, attempts, onOpen }: ModuleCardProps) {
  return (
    <button className={`module-card module-${module.accent}`} onClick={onOpen}>
      <span className="module-tab">{module.shortLabel}</span>
      <div className="module-card-head"><span className="module-title">{module.title}</span><ArrowRight size={19} /></div>
      <p>{module.subtitle}</p>
      <div className="module-scoreline"><span>{attempts ? `${score}% beheerst` : "nog niet geoefend"}</span><span>{attempts} vragen</span></div>
      <ProgressBar value={attempts ? score : 0} tone={module.accent} compact />
      {score < 60 && attempts > 0 && <span className="weak-chip"><WarningCircle size={14} /> aandachtspunt</span>}
    </button>
  );
}
