import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const source = readFileSync(join(root, "src/utils/chemGraph.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const directory = mkdtempSync(join(tmpdir(), "chemtrainer-graph-"));
const modulePath = join(directory, "chemGraph.mjs");
writeFileSync(modulePath, compiled, "utf8");
const { compareMolecules, detectFunctionalGroups } = await import(pathToFileURL(modulePath).href);

const atom = (id, element, extra = {}) => ({ id, element, x: 0, y: 0, ...extra });
const bond = (id, from, to, order = 1) => ({ id, from, to, order });
const graph = (name, atoms, bonds = []) => ({ name, atoms, bonds });
const assert = (condition, message) => { if (!condition) throw new Error(message); };

try {
  const coohFragment = graph("COOH-blok", [atom("cooh", "C", { label: "COOH", fragment: "COOH" })]);
  const coohLoose = graph("los COOH", [atom("c", "C"), atom("od", "O"), atom("os", "O"), atom("h", "H")], [bond("1", "c", "od", 2), bond("2", "c", "os"), bond("3", "os", "h")]);
  assert(compareMolecules(coohLoose, coohFragment).match, "Los gebouwd COOH matcht COOH-fragment niet.");

  const ohFragment = graph("OH-blok", [atom("oh", "O", { label: "OH", fragment: "OH" })]);
  const ohLoose = graph("los OH", [atom("o", "O"), atom("h", "H")], [bond("1", "o", "h")]);
  assert(compareMolecules(ohLoose, ohFragment).match, "Los gebouwd OH matcht OH-fragment niet.");

  const carbonyl = graph("los C=O", [atom("c", "C"), atom("o", "O")], [bond("1", "c", "o", 2)]);
  assert(detectFunctionalGroups(carbonyl).includes("carbonyl"), "Los gebouwd C=O wordt niet als carbonyl herkend.");

  const ester = graph("losse ester", [atom("c1", "C"), atom("od", "O"), atom("os", "O"), atom("c2", "C")], [bond("1", "c1", "od", 2), bond("2", "c1", "os"), bond("3", "os", "c2")]);
  assert(detectFunctionalGroups(ester).includes("ester"), "Los gebouwde ester wordt niet herkend.");

  const amide = graph("losse amide", [atom("c", "C"), atom("o", "O"), atom("n", "N"), atom("h", "H")], [bond("1", "c", "o", 2), bond("2", "c", "n"), bond("3", "n", "h")]);
  assert(detectFunctionalGroups(amide).includes("amide"), "Los gebouwde amide wordt niet herkend.");

  const builderSource = readFileSync(join(root, "src/components/chem/MoleculePuzzleBuilder.tsx"), "utf8");
  assert(/disabled=\{feedback\.length === 0\}/.test(builderSource), "Modelantwoord is niet aantoonbaar geblokkeerd vóór Controleer structuur.");
  console.log("ChemGraph validation passed: losse COOH, OH, C=O, ester en amide worden correct behandeld; modelantwoord is vóór controle verborgen.");
} finally {
  rmSync(directory, { recursive: true, force: true });
}
