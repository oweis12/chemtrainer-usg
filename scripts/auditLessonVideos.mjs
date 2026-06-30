import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "chemtrainer-video-audit-"));

async function importTs(relativePath) {
  const sourcePath = path.join(root, relativePath);
  const source = await fs.readFile(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
    fileName: sourcePath,
  });
  const outputPath = path.join(tmpDir, `${path.basename(relativePath, ".ts")}-${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`);
  await fs.writeFile(outputPath, output.outputText, "utf8");
  return import(pathToFileURL(outputPath).href);
}

const { lessons } = await importTs("src/data/lessons.ts");
const { lessonVideoRegistry } = await importTs("src/data/lessonVideoRegistry.ts");

const errors = [];
const warnings = [];
const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const videoById = new Map(lessonVideoRegistry.map((video) => [video.id, video]));

function duplicates(values) {
  const seen = new Set();
  const duplicateSet = new Set();
  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) duplicateSet.add(value);
    seen.add(value);
  }
  return [...duplicateSet];
}

for (const id of duplicates(lessonVideoRegistry.map((video) => video.id))) {
  errors.push(`Duplicate registry video id: ${id}`);
}

for (const id of duplicates(lessonVideoRegistry.map((video) => video.youtubeId).filter(Boolean))) {
  errors.push(`Duplicate YouTube id in registry: ${id}`);
}

for (const video of lessonVideoRegistry) {
  if (!video.exactUrl) errors.push(`${video.id} mist exactUrl.`);
  try {
    new URL(video.exactUrl);
  } catch {
    errors.push(`${video.id} heeft geen geldige exactUrl: ${video.exactUrl}`);
  }

  if (video.youtubeId && !/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId)) {
    errors.push(`${video.id} heeft een ongeldige YouTube-id: ${video.youtubeId}`);
  }

  if (video.youtubeId && video.youtubeUrl && !video.youtubeUrl.includes(video.youtubeId)) {
    errors.push(`${video.id} heeft een youtubeUrl die niet bij youtubeId past.`);
  }

  for (const lessonId of video.lessonIds) {
    const lesson = lessonById.get(lessonId);
    if (!lesson) {
      errors.push(`${video.id} verwijst naar onbekende les ${lessonId}.`);
      continue;
    }
    if (!lesson.videoIds?.includes(video.id)) {
      errors.push(`${video.id} staat bij lessonIds, maar ${lessonId} rendert deze video niet.`);
    }
  }
}

for (const lesson of lessons) {
  const videoIds = lesson.videoIds ?? [];
  if (videoIds.length > 1) {
    errors.push(`${lesson.id} heeft meer dan 1 directe hoofdvideo: ${videoIds.join(", ")}`);
  }

  for (const videoId of videoIds) {
    const video = videoById.get(videoId);
    if (!video) {
      errors.push(`${lesson.id} verwijst naar onbekende video ${videoId}.`);
      continue;
    }
    if (video.confidence === "low") {
      errors.push(`${lesson.id} rendert low-confidence video ${videoId}.`);
    }
    if (!video.lessonIds.includes(lesson.id)) {
      errors.push(`${lesson.id} rendert ${videoId}, maar de registry noemt deze les niet.`);
    }
  }

}

const youtubePatterns = [
  /youtube(?:-nocookie)?\.com\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/g,
  /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g,
  /youtu\.be\/([A-Za-z0-9_-]{11})/g,
  /data-video-id=["']([A-Za-z0-9_-]{11})["']/g,
];

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8500);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal });
    const text = await response.text();
    return { ok: true, status: response.status, text };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

let networkChecked = false;
let networkUnavailable = false;
let directLinkFallbackCards = 0;
let foundYoutubeIds = 0;

for (const video of lessonVideoRegistry) {
  if (!video.youtubeId) directLinkFallbackCards += 1;
  const result = await fetchText(video.exactUrl);
  if (!result.ok) {
    networkUnavailable = true;
    warnings.push(`Internetcheck overgeslagen of mislukt voor ${video.id}: ${result.error?.message ?? "onbekende fout"}`);
    continue;
  }
  networkChecked = true;
  if (result.status >= 400) {
    errors.push(`${video.id} exactUrl geeft HTTP ${result.status}: ${video.exactUrl}`);
    continue;
  }

  const ids = new Set();
  for (const pattern of youtubePatterns) {
    for (const match of result.text.matchAll(pattern)) ids.add(match[1]);
  }

  if (ids.size > 0) foundYoutubeIds += 1;
  if (!video.youtubeId && ids.size > 0) {
    warnings.push(`${video.id} heeft nog geen youtubeId, maar de bronpagina bevat: ${[...ids].join(", ")}`);
  }
  if (video.youtubeId && ids.size > 0 && !ids.has(video.youtubeId)) {
    errors.push(`${video.id} youtubeId ${video.youtubeId} komt niet overeen met IDs op de Exact-pagina (${[...ids].join(", ")}).`);
  }
}

if (!networkChecked && networkUnavailable) {
  warnings.push("Geen betrouwbare internetcheck uitgevoerd; embeds kunnen later opnieuw uit exactUrl worden gecontroleerd.");
}

const lessonsWithVideo = lessons.filter((lesson) => (lesson.videoIds ?? []).length > 0);
const lessonsWithoutVideo = lessons.length - lessonsWithVideo.length;
const modulesWithVideos = [...new Set(lessonsWithVideo.map((lesson) => lesson.module))].sort();

console.log("LESSON VIDEO AUDIT");
console.log(`Registry videos: ${lessonVideoRegistry.length}`);
console.log(`Lessons with high/medium video: ${lessonsWithVideo.length}`);
console.log(`Lessons without video: ${lessonsWithoutVideo}`);
console.log(`YouTube IDs in registry: ${lessonVideoRegistry.filter((video) => video.youtubeId).length}`);
console.log(`YouTube IDs found on source pages: ${foundYoutubeIds}`);
console.log(`Direct-link fallback cards: ${directLinkFallbackCards}`);
console.log(`Modules with videos: ${modulesWithVideos.join(", ") || "-"}`);
console.log(`M5D lessons with curated video: ${lessons.filter((lesson) => lesson.module === "M5D" && (lesson.videoIds ?? []).length > 0).length}`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nLesson video audit passed.");
