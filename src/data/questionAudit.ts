export type QuestionAuditStatus = "keep" | "improve" | "replace";

export interface QuestionAuditEntry {
  module: "M5D" | "M7" | "M8" | "M9" | "M10";
  focus: string;
  keep: string[];
  improve: string[];
  replace: string[];
  decision: string;
}

const ids = (prefix: string, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => `${prefix}${String(from + index).padStart(2, "0")}`);

// De replace-ID's worden in questions.ts werkelijk door qualityReplacementQuestions
// overschreven. De overige vragen zijn doorgelicht als bruikbare instap (keep) of
// als inhoudelijk bruikbare vraag die vooral door les/visual (improve) wordt versterkt.
export const questionAudit: QuestionAuditEntry[] = [
  { module: "M10", focus: "titratie, zuur-base, pH en foutenanalyse", keep: ["overige M10-vragen met volledig model en rubric"], improve: ["m10-21 t/m m10-57", "priority-m10-01 t/m priority-m10-23"], replace: ids("m10-", 1, 20), decision: "20 korte of onvoldoende contextuele instappers zijn vervangen door rekenketens, praktijkfouten en beoordelingsvragen." },
  { module: "M8", focus: "MS, GC, IR, NMR en isotopen", keep: ["overige M8-vragen met bruikbare techniekfocus"], improve: ["priority-m8-16 t/m priority-m8-45"], replace: ids("priority-m8-", 1, 15), decision: "15 items zijn vervangen door pseudo-spectrum-, chromatogram- en techniekcombinatievragen." },
  { module: "M5D", focus: "DNA, eiwitten en polymeren", keep: ["overige M5D-vragen als begripsanker"], improve: ["priority-m5d-16 t/m priority-m5d-35"], replace: ids("priority-m5d-", 1, 15), decision: "15 items zijn vervangen door expliciete structuur-, transcriptie-, translatie- en denaturatievragen." },
  { module: "M9", focus: "bindingen en materiaalredeneren", keep: ["m9-01 t/m m9-60"], improve: ["bronvragen in officiële toets 15 t/m 22"], replace: [], decision: "Bestaande set is inhoudelijk bruikbaar; officiële toets voegt realistische context toe." },
  { module: "M7", focus: "redox", keep: ["m7-01 t/m m7-15"], improve: ["officiële toets 12 en 13"], replace: [], decision: "Halfreactie- en elektronenintuïtie zijn al toetswaardig; officiële context versterkt toepassing." },
];

export const replacementCounts = { M10: 20, M8: 15, M5D: 15 } as const;
