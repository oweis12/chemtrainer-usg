import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "public/robots.txt",
  "public/sitemap.xml",
  "public/llms.txt",
  "public/over-chemtrainer.html",
  "public/scheikunde-vwo.html",
  "public/voor-docenten.html",
];

requiredFiles.forEach((file) => {
  if (!existsSync(resolve(root, file))) failures.push(`${file} ontbreekt.`);
});

const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");
if (!indexHtml.includes("ChemTrainer USG | Scheikunde leren voor VWO")) failures.push("index.html mist de verwachte title.");
if (!indexHtml.includes("Leer scheikunde voor VWO met duidelijke uitleg")) failures.push("index.html mist de verwachte meta description.");
if (!indexHtml.includes("EducationalApplication")) failures.push("index.html mist EducationalApplication structured data.");

const storageSource = readFileSync(resolve(root, "src/utils/storage.ts"), "utf8");
if (!storageSource.includes("chemtrainer:profiles:v1")) failures.push("Profile storage key chemtrainer:profiles:v1 ontbreekt.");
if (!storageSource.includes("chemtrainer:activeProfileId:v1")) failures.push("Active profile key chemtrainer:activeProfileId:v1 ontbreekt.");

const files = ["src/data/shopItems.ts"];
const tempRoot = mkdtempSync(join(tmpdir(), "chemtrainer-seo-audit-"));
writeFileSync(join(tempRoot, "package.json"), JSON.stringify({ type: "module" }), "utf8");

try {
  for (const file of files) {
    const sourcePath = resolve(root, file);
    const outPath = join(tempRoot, file.replace(/\.tsx?$/, ".mjs"));
    const compiled = ts.transpileModule(readFileSync(sourcePath, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, compiled, "utf8");
  }

  const { shopItems } = await import(pathToFileURL(join(tempRoot, "src/data/shopItems.mjs")).href);
  const ids = shopItems.map((item) => item.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) failures.push(`Dubbele shop item ids: ${[...new Set(duplicateIds)].join(", ")}.`);
  const nonPositivePrices = shopItems.filter((item) => item.price <= 0).map((item) => item.id);
  if (nonPositivePrices.length) failures.push(`Shop items zonder positieve prijs: ${nonPositivePrices.join(", ")}.`);

  const rewardsSource = readFileSync(resolve(root, "src/utils/gameRewards.ts"), "utf8");
  const achievementIds = [...rewardsSource.matchAll(/withAchievement\(next,\s*"([^"]+)"/g)].map((match) => match[1]);
  const duplicateAchievementIds = achievementIds.filter((id, index) => achievementIds.indexOf(id) !== index);
  if (duplicateAchievementIds.length) failures.push(`Dubbele achievement ids: ${[...new Set(duplicateAchievementIds)].join(", ")}.`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`SEO/profile audit failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("SEO/profile audit passed: publieke SEO-bestanden, metadata, profielsleutels, shop item ids en achievement ids zijn gecontroleerd.");
