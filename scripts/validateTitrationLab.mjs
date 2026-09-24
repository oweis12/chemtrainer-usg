import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const load = async path => {
 const source = ts.transpileModule(readFileSync(path, 'utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};
const engine = await load('src/features/titrationLab/titrationEngine.ts');
const {titrationSimulations} = await load('src/data/titrationSimulations.ts');
for (const simulation of titrationSimulations) {
 const result = engine.calculateFromVolume(simulation, simulation.equivalenceVolumeMl);
 assert.ok(Math.abs(result.analyteMolarity-simulation.analyteMolarityHidden)<1e-8, simulation.id);
 assert.equal(engine.getEndpointState(0, simulation.equivalenceVolumeMl, simulation.allowedErrorMl),'voor');
 assert.equal(engine.getEndpointState(simulation.equivalenceVolumeMl, simulation.equivalenceVolumeMl, simulation.allowedErrorMl),'goed');
 assert.equal(engine.getEndpointState(49.65, simulation.equivalenceVolumeMl, simulation.allowedErrorMl),'te_ver');
}
const reverse=titrationSimulations.find(s=>s.titrantName==='zoutzuur');
assert.equal(engine.endpointLabel('voor',reverse),'roze');
assert.equal(engine.endpointLabel('goed',reverse),'kleurloos');
assert.equal(engine.endpointLabel('te_ver',reverse),'kleurloos');
assert.equal(engine.parseDutchNumber('1,86 × 10⁻³'),.00186);
assert.ok(Math.abs(engine.readingFeedback('0,35','18,95',.35,18.95).usedVolume - 18.6) < 1e-10);
assert.ok(engine.readingFeedback('0,35','19,35',.35,18.95).messages.some(m=>m.includes('Eindstand')));
console.log('Titration validation passed: five stoichiometric scenarios, reverse indicator, endpoint states and burette readings.');
