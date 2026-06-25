import { learningObjectives } from "./learningObjectives";
import type { ModuleId } from "../types";

export const coverageMap: Record<ModuleId, string[]> = {
  M4: learningObjectives.filter((objective) => objective.module === "M4").map((objective) => objective.id),
  M5D: learningObjectives.filter((objective) => objective.module === "M5D").map((objective) => objective.id),
  M6: learningObjectives.filter((objective) => objective.module === "M6").map((objective) => objective.id),
  M7: learningObjectives.filter((objective) => objective.module === "M7").map((objective) => objective.id),
  M8: learningObjectives.filter((objective) => objective.module === "M8").map((objective) => objective.id),
  M9: learningObjectives.filter((objective) => objective.module === "M9").map((objective) => objective.id),
  M10: learningObjectives.filter((objective) => objective.module === "M10").map((objective) => objective.id),
};

export const coverageSummary = (module?: ModuleId) => learningObjectives.filter((objective) => !module || objective.module === module).reduce((summary, objective) => {
  summary[objective.status] += 1;
  return summary;
}, { "gedekt": 0, "deels gedekt": 0, "mist": 0 });
