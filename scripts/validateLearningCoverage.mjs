import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(resolve(root, file), "utf8");
const failures = [];

const lessonSource = read("src/data/lessons.ts");
const objectiveSource = read("src/data/learningObjectives.ts");
const officialSource = read("src/data/officialPracticeTest.ts");
const visualRegistrySource = read("src/data/visualAssetRegistry.ts");
const highPrioritySource = read("HIGH_PRIORITY_IMAGES_TO_GENERATE.md");
const auditSource = read("VISUAL_ASSET_AUDIT.md");
const questionFiles = [
  "src/data/questions.ts",
  "src/data/extendedQuestions.ts",
  "src/data/priorityQuestions.ts",
  "src/data/massSpecMasteryQuestions.ts",
  "src/data/structureQuestions.ts",
  "src/data/structureGraphQuestions.ts",
  "src/data/qualityReplacementQuestions.ts",
  "src/data/coverageQaQuestions.ts",
  "src/data/officialPracticeTest.ts",
];
const questionSource = questionFiles.map(read).join("\n");

const idsFrom = (source) => [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
const lessonIds = new Set(idsFrom(lessonSource));

const extractString = (block, key) => {
  const match = block.match(new RegExp(`${key}:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`));
  return match ? match[1].replace(/\\"/g, '"') : "";
};

const extractFactoryBlocks = (source, names = ["q", "s"]) => {
  const blocks = [];
  const startPattern = new RegExp(`\\b(?:${names.join("|")})\\s*\\(\\s*\\{`, "g");
  for (const match of source.matchAll(startPattern)) {
    let parenDepth = 0;
    let quote = "";
    let escaped = false;
    let end = -1;

    for (let index = match.index; index < source.length; index += 1) {
      const char = source[index];

      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === quote) {
          quote = "";
        }
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        quote = char;
        continue;
      }
      if (char === "(") parenDepth += 1;
      if (char === ")") {
        parenDepth -= 1;
        if (parenDepth === 0) {
          end = index + 1;
          break;
        }
      }
    }

    if (end > -1) blocks.push(source.slice(match.index, end));
  }
  return blocks;
};

const questionBlocks = extractFactoryBlocks(questionSource)
  .map((block) => [block, extractString(block, "id")])
  .filter(([, id]) => id);
const questionsById = new Map();
for (const [block, id] of questionBlocks) {
  questionsById.set(id, {
    id,
    module: extractString(block, "module"),
    topic: extractString(block, "topic"),
    skill: extractString(block, "skill"),
    question: extractString(block, "question"),
    modelAnswer: extractString(block, "modelAnswer"),
    block,
  });
}

const objectiveEntries = [...objectiveSource.matchAll(/o\(\s*"([^"]+)",\s*"(M(?:4|5D|6|7|8|9|10))",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\[([^\]]*)\],\s*\[([^\]]*)\],\s*"([^"]*)"\s*\)/g)].map((match) => ({
  id: match[1],
  module: match[2],
  onderwerp: match[3],
  tekst: match[4],
  type: match[5],
  lessonIds: [...match[6].matchAll(/"([^"]+)"/g)].map((item) => item[1]),
  questionIds: [...match[7].matchAll(/"([^"]+)"/g)].map((item) => item[1]),
  notes: match[8],
}));

if (objectiveEntries.length < 70) failures.push(`Te weinig subleerdoelen: ${objectiveEntries.length}; minimaal 70 vereist.`);
const objectiveCounts = Object.fromEntries(["M4", "M5D", "M6", "M7", "M8", "M9", "M10"].map((module) => [module, 0]));

const normalize = (text) => text.toLowerCase()
  .normalize("NFD").replace(/\p{Diacritic}/gu, "")
  .replace(/[₀-₉]/g, (char) => "₀₁₂₃₄₅₆₇₈₉".indexOf(char))
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (char) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(char))
  .replaceAll("−", "-");

const keywordRules = [
  [/codon|transcriptie|translatie/, ["codon", "mrna", "transcriptie", "translatie", "aminozuur", "stopcodon"]],
  [/nucleotide/, ["nucleotide", "fosfaat", "suiker", "base"]],
  [/denaturatie|enzym/, ["denaturatie", "enzym", "actieve plaats", "temperatuur", "ph"]],
  [/eiwitstructuur/, ["primaire", "secundaire", "tertiaire", "eiwitstructuur", "aminozuurvolgorde"]],
  [/polymeren|polymerisatie/, ["polymeer", "polymerisatie", "additie", "condensatie", "monomeer"]],
  [/elektrochemische cel/, ["elektrochemische", "galvanische", "halfcellen", "buitenkring", "elektronen", "zoutbrug"]],
  [/brandstofcel/, ["brandstofcel", "waterstof", "proton", "membraan", "pem", "h2"]],
  [/concentratiecel/, ["concentratiecel", "concentratieverschil", "molariteit", "potentiaalverschil"]],
  [/hydratie-energie/, ["hydratatie-energie", "hydratatie", "ionen", "energie"]],
  [/roosterenergie/, ["roosterenergie", "rooster", "hydratatie", "netto energie"]],
  [/vormingswarmte|verbrandingswarmte/, ["vormingswarmte", "verbrandingswarmte", "reactiewarmte", "producten min beginstoffen"]],
  [/atoomeconomie/, ["atoomeconomie", "beginstoffen", "gewenst product"]],
  [/e-factor|rendement/, ["e-factor", "afval", "rendement", "opbrengst"]],
  [/k-constante|k-formule|k en fasen/, ["k-waarde", "k =", "k-constante", "evenwicht", "producten", "beginstoffen", "vaste stoffen"]],
  [/c\/h|omestering/, ["c/h", "verbranding", "co2", "h2o", "omestering", "ester", "alcoholrest"]],
  [/ionisatie-energie|schillenmodel|valentie|atoomsoorten/, ["ionisatie-energie", "schil", "valentie", "elektron", "kern", "sprong"]],
  [/reactietypen/, ["redox", "zuur-base", "verbranding", "synthese", "ontleding", "reactietype"]],
  [/reactiesnelheid|botsende|snelheidsfactoren/, ["reactiesnelheid", "bots", "temperatuur", "katalysator", "contactoppervlak", "activeringsenergie"]],
  [/metaalbinding/, ["metaalbinding", "metaalrooster", "gedelokaliseerde", "vrije elektronen", "legering"]],
  [/vanderwaals/, ["vanderwaals", "apolair", "kookpunt", "intermoleculaire"]],
  [/waterstofbrug/, ["waterstofbrug", "o-h", "n-h", "h-brug"]],
  [/dipool|polair|δ/, ["dipool", "polair", "apolair", "elektronegativiteit", "delta", "δ"]],
  [/ion-dipool|hydratatie/, ["ion-dipool", "hydratatie", "water", "ion"]],
  [/titratie|buret|schellbach|indicator|equivalentiepunt|molverhouding|massa-aandeel|meetkwaliteit/, ["titratie", "buret", "schellbach", "indicator", "equivalentiepunt", "molverhouding", "molariteit", "massa", "verbruik"]],
  [/molmassa|molbegrip|massa en mol|molariteit|reacties rekenen|formules|massa-aandeel/, ["mol", "molmassa", "molariteit", "massa", "formule", "reactievergelijking", "concentratie"]],
  [/massaspectrometrie|m-piek|basispiek|fragmentatie|gc|ir|nmr|isotopen|atoommodel/, ["massaspect", "m-piek", "basispiek", "fragment", "gc", "ir", "nmr", "isotoop", "isotop", "atoommodel", "rutherford"]],
];

const fallbackKeywords = (objective) => normalize(`${objective.onderwerp} ${objective.tekst}`)
  .split(/[^a-z0-9+/-]+/)
  .filter((word) => word.length >= 5 && !["uitleggen", "berekenen", "herkennen", "gebruiken", "verschillen", "correct", "bepalen", "toepassen"].includes(word))
  .slice(0, 8);

const specificKeywordsFor = (objective) => {
  const haystack = normalize(`${objective.onderwerp} ${objective.tekst}`);
  if (objective.module === "M5D") {
    if (/hydrolyse/.test(haystack)) return ["hydrolyse", "water", "peptidebinding", "aminozuur"];
    if (/dna-basen/.test(haystack)) return ["dna", "basen", "base", "a-t", "c-g", "complementaire"];
    if (/dna en rna|dna\/rna/.test(haystack)) return ["rna", "uracil", "ribose", "desoxyribose", "thymine", "enkelstrengs"];
  }
  if (objective.module === "M6") {
    if (/ionrooster/.test(haystack)) return ["ionrooster", "rooster", "ion-ion", "smeltpunt", "tegengestelde"];
    if (/geleidbaarheid/.test(haystack)) return ["geleid", "stroom", "vrij beweg", "lading vervoeren", "ionen"];
    if (/oplossen/.test(haystack)) return ["oplossen", "hydratatie", "water", "ion-dipool", "roosterenergie"];
    if (/zuur-base|ph|zuren|basen/.test(haystack)) return ["ph", "zuur", "base", "h3o", "oh", "proton"];
    if (/ionen/.test(haystack)) return ["ion", "zout", "lading", "formule", "na", "cl"];
  }
  if (objective.module === "M8") {
    if (/micro en macro/.test(haystack)) return ["waarneming", "deeltjes", "atoommodel", "alfadeeltjes", "afbuigen", "microniveau"];
    if (/atoombouw/.test(haystack)) return ["proton", "neutron", "elektron", "atoomnummer", "massagetal", "lading"];
    if (/isotopen|isotoopverhouding/.test(haystack)) return ["isotoop", "isotop", "gemiddelde", "atoommassa", "percentage", "neutron"];
    if (/massaspectrometer/.test(haystack)) return ["massaspectrometer", "ioniseren", "m/z", "versnellen", "detecteren", "lading"];
    if (/m-piek/.test(haystack)) return ["m-piek", "molecuulion", "molecuulmassa", "hoogste m/z"];
    if (/m\+1/.test(haystack)) return ["m+1", "c-atomen", "13c", "koolstof"];
    if (/m\+2/.test(haystack)) return ["m+2", "chloor", "broom", "cl", "br"];
    if (/gaschromatografie/.test(haystack)) return ["gc", "retentietijd", "vluchtig", "stationaire fase", "kolom"];
  }
  if (objective.module === "M9") {
    if (/micro en macro/.test(haystack)) return ["microniveau", "deeltjes", "rooster", "binding", "aantrekking", "stofeigenschap"];
    if (/ionisatie-energie/.test(haystack)) return ["ionisatie-energie", "elektron", "energie", "kern", "schil", "sprong"];
    if (/valentie/.test(haystack)) return ["valentie", "buitenste schil", "ionlading", "sprong", "covalent"];
    if (/atoombinding/.test(haystack)) return ["atoombinding", "covalente", "gedeelde elektronen", "elektronenpaar"];
    if (/ionbinding/.test(haystack)) return ["ionbinding", "ionrooster", "ion-ion", "tegengestelde lading", "elektrostatische"];
    if (/moleculaire stoffen/.test(haystack)) return ["moleculaire", "moleculen", "neutraal", "covalente", "stof"];
    if (/dipool-dipool/.test(haystack)) return ["dipool-dipool", "dipoolinteracties", "polair", "intermoleculaire"];
    if (/waterstofbrug/.test(haystack)) return ["waterstofbrug", "h-brug", "o-h", "n-h", "kookpunt"];
    if (/dipolen/.test(haystack)) return ["dipool", "polair", "apolair", "elektronegativiteit", "δ", "delta"];
    if (/oplosbaarheid/.test(haystack)) return ["oplos", "water", "polair", "apolair", "hydrofiel", "hydrofoob", "ion-dipool"];
  }
  if (objective.module === "M10") {
    if (/concentratiecel/.test(haystack)) return ["concentratiecel", "concentratieverschil", "molariteit", "potentiaalverschil", "gelijke molariteit"];
    if (/zuur-basevergelijking/.test(haystack)) return ["zuur-base", "protonoverdracht", "h3o", "oh", "netto-ionreactie"];
    if (/massa-aandeel/.test(haystack)) return ["massa%", "massapercentage", "massa", "molmassa", "procent"];
    if (/zuur\b/.test(haystack)) return ["zuur", "protondonor", "h+", "h3o", "salpeterzuur"];
    if (/base\b/.test(haystack)) return ["base", "protonacceptor", "oh", "hydroxide"];
    if (/\bph\b/.test(haystack)) return ["ph", "h+", "h3o", "log", "sterk zuur", "mol/l"];
    if (/evenwicht/.test(haystack)) return ["evenwicht", "k-waarde", "productkant", "beginstofkant", "terugreactie"];
    if (/titratie uitvoeren/.test(haystack)) return ["equivalentiepunt", "eindpunt", "indicator", "titratie"];
  }
  return undefined;
};

const keywordsFor = (objective) => {
  const haystack = normalize(`${objective.onderwerp} ${objective.tekst}`);
  const specific = specificKeywordsFor(objective);
  if (specific) return specific;
  const matched = keywordRules.find(([pattern]) => pattern.test(haystack));
  return matched ? matched[1] : fallbackKeywords(objective);
};

const questionMatchesObjective = (objective, question) => {
  const haystack = normalize(`${question.topic} ${question.skill} ${question.question} ${question.modelAnswer}`);
  return keywordsFor(objective).some((keyword) => haystack.includes(normalize(keyword)));
};

for (const objective of objectiveEntries) {
  objectiveCounts[objective.module] += 1;
  if (!objective.lessonIds.length) failures.push(`${objective.id}: geen gekoppelde les.`);
  if (objective.questionIds.length < 2) failures.push(`${objective.id}: minder dan twee gekoppelde vragen.`);
  objective.lessonIds.filter((lessonId) => !lessonIds.has(lessonId)).forEach((lessonId) => failures.push(`${objective.id}: onbekende les ${lessonId}.`));

  let matchingQuestions = 0;
  for (const questionId of objective.questionIds) {
    const question = questionsById.get(questionId);
    if (!question) {
      failures.push(`${objective.id}: onbekende vraag ${questionId}.`);
      continue;
    }
    if (question.module !== objective.module) {
      failures.push(`${objective.id}: vraag ${questionId} zit in ${question.module}, verwacht ${objective.module}.`);
      continue;
    }
    if (!questionMatchesObjective(objective, question)) {
      failures.push(`${objective.id}: vraag ${questionId} lijkt inhoudelijk niet te passen bij '${objective.onderwerp}'. Topic/skill: ${question.topic}/${question.skill}.`);
      continue;
    }
    matchingQuestions += 1;
  }
  if (matchingQuestions < 2) failures.push(`${objective.id}: minder dan twee inhoudelijk passende vragen (${matchingQuestions}/2).`);
}

if (objectiveCounts.M10 < 20) failures.push(`M10 heeft ${objectiveCounts.M10} subleerdoelen; minimaal 20 vereist.`);
if (objectiveCounts.M8 < 15) failures.push(`M8 heeft ${objectiveCounts.M8} subleerdoelen; minimaal 15 vereist.`);
if (objectiveCounts.M5D < 12) failures.push(`M5D heeft ${objectiveCounts.M5D} subleerdoelen; minimaal 12 vereist.`);
if (objectiveCounts.M9 < 18) failures.push(`M9 heeft ${objectiveCounts.M9} subleerdoelen; minimaal 18 vereist.`);
if (objectiveCounts.M4 + objectiveCounts.M6 + objectiveCounts.M7 < 15) failures.push("M4, M6 en M7 hebben samen minder dan 15 subleerdoelen.");

const lessonEntries = [...lessonSource.matchAll(/id:\s*"(m(?:4|5d|6|7|8|9|10)-[^"]+)",\s*module:[\s\S]*?(?=\n\s*\{|\n\];|\n\};)/gi)];
for (const [block, id] of lessonEntries) if (!/miniCheck:\s*\[/.test(block)) failures.push(`${id}: mini-check ontbreekt.`);

if (!/const q = \(draft: Draft\): Question => \(\{[\s\S]*?rubric:[\s\S]*?explanation:/m.test(questionSource)) failures.push("Vraagfactory q mist rubric of explanation als standaard.");
if (!/const s = \(draft: StructureDraft\): Question => \(\{[\s\S]*?rubric:[\s\S]*?explanation:/m.test(questionSource)) failures.push("Vraagfactory s mist rubric of explanation als standaard.");
if (/rubric:\s*\[\s*\]/.test(questionSource)) failures.push("Er is een vraag met een lege rubric.");
if (/explanation:\s*"\s*"/.test(questionSource)) failures.push("Er is een vraag met een lege explanation.");

for (const question of questionsById.values()) {
  const text = question.question;
  if (/\bbereken\s+[cn]\(/i.test(text)) failures.push(`${question.id}: cryptische vraagtekst met bereken c(...)/n(...).`);
  if (/\bbereken\s+massa%/i.test(text)) failures.push(`${question.id}: cryptisch massa%-verzoek.`);
  if (/\bc\((?:CH|zuur|NaOH|H|OH)/i.test(text)) failures.push(`${question.id}: vraagtekst gebruikt c(...) in plaats van molariteit in woorden.`);
  if (/\bn\((?:CH|NaOH|H|OH)/i.test(text)) failures.push(`${question.id}: vraagtekst gebruikt n(...) in plaats van hoeveelheid mol in woorden.`);
  if (/mol L⁻¹/.test(text)) failures.push(`${question.id}: vraagtekst gebruikt mol L⁻¹; gebruik molariteit/mol\/L in leerlingtekst.`);
}
if (/\bM\([^)]*\)\s*=/.test(questionSource) || /\bM\s*=\s*[^\n"]*g\/mol/.test(questionSource)) failures.push("Hoofdletter M wordt nog gebruikt voor molmassa.");

for (const moduleId of ["M4", "M5D", "M6", "M7", "M8", "M9", "M10"]) {
  if (!new RegExp(`module: "${moduleId}"`).test(lessonSource)) failures.push(`${moduleId} ontbreekt in Leren.`);
  if (!new RegExp(`module: "${moduleId}"`).test(questionSource)) failures.push(`${moduleId} ontbreekt in Oefenen.`);
}

const officialQuestions = idsFrom(officialSource).filter((id) => /^official-\d+$/.test(id));
const officialReady = /sourceStatus:\s*"ready"/.test(officialSource);
const officialMissing = /sourceStatus:\s*"source-missing"/.test(officialSource) && /sourceNote:\s*"[^"\n]+"/.test(officialSource);
if (officialReady && officialQuestions.length < 1) failures.push("Officiële oefentoets staat op ready maar heeft geen vragen.");
if (!officialReady && !officialMissing) failures.push("Officiële oefentoets mist zowel echte vragen als duidelijke bronmelding.");
if (officialReady && officialQuestions.length !== 25) failures.push(`Officiële oefentoets heeft ${officialQuestions.length} vragen; de docentbron bevat 25 vragen.`);

const officialBlocks = extractFactoryBlocks(officialSource, ["q"])
  .map((block) => [block, extractString(block, "id")])
  .filter(([, id]) => /^official-\d+$/.test(id));
for (const [block, id] of officialBlocks) {
  const text = extractString(block, "question");
  const needsVisual = /(gegeven|getoonde|bovenstaande|onderstaande|onderstaand|plaatje|schema|skeletformule)|gebruik[\s\S]{0,80}(structuur|schema)/i.test(text);
  const hasVisual = /visual:\s*\{/.test(block) || /structure:\s*\{/.test(block);
  if (needsVisual && !hasVisual) failures.push(`${id}: verwijst naar gegeven/getoond schema of structuur zonder visual/structure.`);
}

const highPriorityFilenames = [...highPrioritySource.matchAll(/Bestand:\s*`([^`]+)`/g)].map((match) => match[1]);
for (const filename of highPriorityFilenames) {
  if (!visualRegistrySource.includes(`proposedFilename: "${filename}"`)) failures.push(`High-priority filename ontbreekt in visualAssetRegistry: ${filename}`);
  if (!auditSource.includes(filename)) failures.push(`High-priority filename ontbreekt in VISUAL_ASSET_AUDIT.md: ${filename}`);
}

if (!/genericM10CalculationPlan/.test(read("src/data/questions.ts")) || !/needsM10Plan/.test(read("src/data/questions.ts"))) failures.push("Niet elke M10-rekenvraag krijgt aantoonbaar een stappenplan.");

if (failures.length) {
  console.error("Learning coverage validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Learning coverage validation passed: ${objectiveEntries.length} subleerdoelen; M5D ${objectiveCounts.M5D}, M8 ${objectiveCounts.M8}, M9 ${objectiveCounts.M9}, M10 ${objectiveCounts.M10}; ${officialQuestions.length} officiële toetsvragen; ${highPriorityFilenames.length} high-priority beeldslots consistent.`);
