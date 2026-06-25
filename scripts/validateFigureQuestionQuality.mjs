import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "src/data/questions.ts",
  "src/data/priorityQuestions.ts",
  "src/data/qualityReplacementQuestions.ts",
  "src/data/figureQuestions.ts",
  "src/data/coverageQaQuestions.ts",
  "src/data/officialPracticeTest.ts",
  "src/data/extendedQuestions.ts",
];

function read(file) {
  return fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), "utf8") : "";
}

function extractQuestionBlocks(source) {
  const blocks = [];
  let index = 0;
  while ((index = source.indexOf("q({", index)) !== -1) {
    const start = index;
    let cursor = index + 2;
    let depth = 0;
    let inString = false;
    let quote = "";
    let escaped = false;
    for (; cursor < source.length; cursor += 1) {
      const char = source[cursor];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === quote) inString = false;
        continue;
      }
      if (char === "\"" || char === "'" || char === "`") {
        inString = true;
        quote = char;
        continue;
      }
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth === 0 && source.slice(cursor, cursor + 2) === "})") {
        blocks.push(source.slice(start, cursor + 2));
        index = cursor + 2;
        break;
      }
    }
  }
  return blocks;
}

function prop(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*"([^"]*)"`));
  return match?.[1] ?? "";
}

function hasVisual(block) {
  return /visual:\s*\{/.test(block);
}

const warnings = [];
let checked = 0;
let withVisual = 0;
const replacementBlocks = extractQuestionBlocks(read("src/data/qualityReplacementQuestions.ts"));
const replacementIds = new Set(replacementBlocks.map((block) => prop(block, "id")).filter(Boolean));
const latestReplacementById = new Map(replacementBlocks.map((block) => [prop(block, "id"), block]));

for (const file of files) {
  for (const block of extractQuestionBlocks(read(file))) {
    const id = prop(block, "id") || "unknown-id";
    if (file !== "src/data/qualityReplacementQuestions.ts" && replacementIds.has(id)) continue;
    if (file === "src/data/qualityReplacementQuestions.ts" && latestReplacementById.get(id) !== block) continue;
    checked += 1;
    if (!hasVisual(block)) continue;
    withVisual += 1;
    const module = prop(block, "module") || "?";
    const question = prop(block, "question");
    const component = prop(block, "component");
    const src = prop(block, "src");
    const caption = prop(block, "caption");
    const modelAnswer = prop(block, "modelAnswer");
    const lowerQuestion = question.toLowerCase();
    const lowerVisualText = `${caption} ${prop(block, "alt")}`.toLowerCase();

    if (!/purpose:\s*"(read-data|interpret-spectrum|interpret-structure|setup-identification|calculation-support|explanation-only)"/.test(block)) {
      warnings.push(`${file}: ${id} (${module}) visual zonder expliciet purpose-label`);
    }

    if (/(bereken|molariteit|massa%|massapercentage|hoeveel mol|concentratie)/i.test(question) && /TitrationSetupDiagram|titratie-opstelling-callouts/.test(block) && !/(meniscus|buretstand|opstelling|schellbach)/i.test(question)) {
      warnings.push(`${file}: ${id} gebruikt algemene titratie-opstelling bij berekenvraag`);
    }

    if (/(hoeveel componenten|hoeveel pieken|aantal componenten|tel de pieken)/i.test(question) && /(component a|component b|component c|stof a|stof b|stof c)/i.test(lowerVisualText)) {
      warnings.push(`${file}: ${id} vraagt aantal componenten/pieken maar visual/caption labelt componenten`);
    }

    if (!/(gebruik|lees af|bepaal uit|spectrum|chromatogram|figuur|schema|meetfiguur|verdunningsschema)/i.test(question)) {
      warnings.push(`${file}: ${id} heeft visual maar vraag verwijst niet expliciet naar figuur/spectrum/schema`);
    }

    const answerLooksExplicit = /(eindantwoord|kort antwoord|dus|=|mol\/l|%| ml| g| u)/i.test(modelAnswer);
    if (!answerLooksExplicit) {
      warnings.push(`${file}: ${id} modelantwoord lijkt geen expliciet eindantwoord of eenheid te bevatten`);
    }

    if ((component === "GcChromatogramDiagram" || src.includes("gc-chromatogram")) && /component a|component b|component c|stof a|stof b|stof c/i.test(lowerVisualText)) {
      warnings.push(`${file}: ${id} GC-visual bevat antwoord-sturende labels`);
    }
  }
}

console.log(`Figure question quality validation completed: ${checked} vraagblokken gecontroleerd; ${withVisual} met visual; ${warnings.length} waarschuwingen.`);
if (warnings.length) {
  console.log("\nWaarschuwingen:");
  for (const warning of warnings.slice(0, 80)) console.log(`- ${warning}`);
  if (warnings.length > 80) console.log(`- ... ${warnings.length - 80} extra waarschuwingen niet getoond`);
}
