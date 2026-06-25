import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const failures = [];
const forbiddenOnlyHints = new Set([
  "kijk goed naar de vraag.",
  "gebruik het modelantwoord.",
  "denk aan de formule.",
  "markeer de gegevens.",
  "controleer je antwoord.",
  "markeer eerst de gegeven grootheden en de gevraagde grootheid.",
]);

const files = [
  "src/types/index.ts",
  "src/utils/questionEnhancements.ts",
  ...readdirSync(resolve(root, "src/data")).filter((file) => file.endsWith(".ts")).map((file) => `src/data/${file}`),
];

const tempRoot = join(tmpdir(), `chemtrainer-hints-${Date.now()}-${Math.random().toString(16).slice(2)}`);
mkdirSync(tempRoot, { recursive: true });
writeFileSync(join(tempRoot, "package.json"), JSON.stringify({ type: "module" }), "utf8");

const outPathFor = (sourcePath) => join(tempRoot, sourcePath.replace(/\.tsx?$/, ".mjs"));
const sourcePathForImport = (sourceFile, specifier) => {
  const base = resolve(root, dirname(sourceFile), specifier);
  const candidates = [`${base}.ts`, `${base}.tsx`, join(base, "index.ts")];
  return candidates.find((candidate) => files.map((file) => resolve(root, file)).includes(candidate));
};

try {
  for (const file of files) {
    const sourcePath = resolve(root, file);
    const outPath = outPathFor(file);
    mkdirSync(dirname(outPath), { recursive: true });
    let compiled = ts.transpileModule(readFileSync(sourcePath, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    compiled = compiled.replace(/(from\s+["'])(\.\.?\/[^"']+)(["'])/g, (full, prefix, specifier, suffix) => {
      const targetSource = sourcePathForImport(file, specifier);
      if (!targetSource) return full;
      const targetRelative = relative(root, targetSource).replace(/\.tsx?$/, ".mjs");
      let rewritten = relative(dirname(outPath), join(tempRoot, targetRelative)).replaceAll("\\", "/");
      if (!rewritten.startsWith(".")) rewritten = `./${rewritten}`;
      return `${prefix}${rewritten}${suffix}`;
    });
    writeFileSync(outPath, compiled, "utf8");
  }

  const { questions } = await import(pathToFileURL(outPathFor("src/data/questions.ts")).href);
  const { officialPracticeTest } = await import(pathToFileURL(outPathFor("src/data/officialPracticeTest.ts")).href);
  const allQuestions = [...questions, ...officialPracticeTest.questions];

  const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const hintText = (question) => normalize(question.hints.join(" "));
  const qText = (question) => normalize(`${question.topic} ${question.skill} ${question.question} ${question.modelAnswer}`);
  const hasHint = (question, pattern) => pattern.test(hintText(question));
  const concerns = (question, pattern) => pattern.test(qText(question));

  for (const question of allQuestions) {
    if (!question.hints?.length) failures.push(`${question.id}: mist hints.`);
    if (question.hints?.length === 1 && forbiddenOnlyHints.has(question.hints[0].toLowerCase())) failures.push(`${question.id}: verboden generieke hint als enige hint.`);
    if (question.module === "M10" && (question.type === "calculation" || concerns(question, /titr|buret|molariteit|massa%|massa-aandeel|azijn|naoh|volume/)) && !hasHint(question, /liter|n\s*=|molariteit|volume|molverhouding|beginstand|eindstand|massa-aandeel|molmassa/)) failures.push(`${question.id}: M10 reken/titratiehint mist stap- of eenheidstaal.`);
    if (question.module === "M8" && concerns(question, /massaspect|spectrum|m-piek|m\+1|m\+2|basispiek|fragment|m\/z/) && !hasHint(question, /piek|m\/z|m-piek|basispiek|fragment|isoto|¹³c|cl|br/)) failures.push(`${question.id}: M8 spectrumhint mist piektaal.`);
    if (question.module === "M5D" && concerns(question, /dna|rna|mrna|nucleotide|codon|transcriptie|translatie/) && !hasHint(question, /nucleotide|fosfaat|suiker|base|mrna|codon|transcriptie|translatie|uracil|rna/)) failures.push(`${question.id}: M5D DNA/RNA-hint mist kernbegrip.`);
    if ((question.type?.startsWith("structure") || question.structure) && !hasHint(question, /functionele groep|o-h|n-h|c=o|cooh|ester|amide|polariteit|h-brug|hydrofiel|hydrofoob/)) failures.push(`${question.id}: structuurvraag mist functiegroep-hint.`);
  }

  if (failures.length) {
    console.error(`Hint quality validation failed (${failures.length}):`);
    failures.slice(0, 80).forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  const genericOnly = allQuestions.filter((question) => question.hints.length === 1 && forbiddenOnlyHints.has(question.hints[0].toLowerCase())).length;
  const totalHints = allQuestions.reduce((sum, question) => sum + question.hints.length, 0);
  console.log(`Hint quality validation passed: ${allQuestions.length} vragen gecontroleerd; ${totalHints} vraag-specifieke hints actief; ${genericOnly} verboden generieke-only hints over.`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
