import { ArrowRight, Atom, CheckCircle, Flask, Function, HandPointing, ListChecks, PuzzlePiece, Sparkle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { MoleculePuzzleBuilder } from "../components/chem/MoleculePuzzleBuilder";
import { StructureRenderer } from "../components/StructureRenderer";
import { structureBuildTasks } from "../data/structureBuildTasks";
import { structureGraphQuestions } from "../data/structureGraphQuestions";
import type { StructureBuildLevel } from "../types";

type LabTab = "recognize" | "build" | "groups" | "test";

const tabs: Array<{ id: LabTab; label: string; icon: React.ReactNode }> = [
  { id: "recognize", label: "Herkennen", icon: <HandPointing size={18} /> },
  { id: "build", label: "Bouwen", icon: <PuzzlePiece size={18} /> },
  { id: "groups", label: "Functionele groepen", icon: <Function size={18} /> },
  { id: "test", label: "Toetsvragen", icon: <ListChecks size={18} /> },
];

interface StructureLabProps {
  onPractice: () => void;
}

export function StructureLab({ onPractice }: StructureLabProps) {
  const [tab, setTab] = useState<LabTab>("recognize");
  const [level, setLevel] = useState<StructureBuildLevel | "all">("all");
  const [selectedTaskId, setSelectedTaskId] = useState(structureBuildTasks[0].id);
  const tasks = useMemo(() => structureBuildTasks.filter((task) => level === "all" || task.level === level), [level]);
  const selectedTask = structureBuildTasks.find((task) => task.id === selectedTaskId) ?? tasks[0] ?? structureBuildTasks[0];
  const exampleQuestions = structureGraphQuestions.filter((question) => question.structure?.graph).slice(0, 4);
  const groupExamples = structureGraphQuestions.filter((question) => ["StructuurLab · alcohol", "StructuurLab · carbonzuur", "StructuurLab · ester", "StructuurLab · amide", "StructuurLab · nucleotide"].includes(question.topic)).filter((question, index, all) => all.findIndex((item) => item.topic === question.topic) === index);

  const selectLevel = (next: StructureBuildLevel | "all") => {
    setLevel(next);
    const nextTask = structureBuildTasks.find((task) => next === "all" || task.level === next);
    if (nextTask) setSelectedTaskId(nextTask.id);
  };

  return <div className="structure-lab-page">
    <section className="page-intro intro-inline">
      <div><span className="section-kicker">StructuurLab</span><h1>Zie wat een structuurformule vertelt.</h1><p>Lees eerst de atomen en bindingen. Bouw daarna zelf met puzzelstukken. De chemie blijft echt; de editor blijft bewust rustig en overzichtelijk.</p></div>
      <div className="structurelab-stamp"><Atom size={29} weight="duotone" /><span>kijken<br />→ bouwen</span></div>
    </section>

    <div className="lab-tabs" role="tablist" aria-label="Onderdelen van StructuurLab">
      {tabs.map((item) => <button role="tab" aria-selected={tab === item.id} className={tab === item.id ? "active" : ""} key={item.id} onClick={() => setTab(item.id)}>{item.icon}{item.label}</button>)}
    </div>

    {tab === "recognize" && <section className="lab-reading-grid">
      <article className="lab-notebook-card lab-reading-card">
        <span className="learning-layer">Eerst rustig lezen</span><h2>Een tekening is een routekaart van atomen.</h2>
        <p>Een cirkel met C, H, O of N staat voor een atoom. Een lijn ertussen is een binding: één lijn betekent één gedeeld elektronenpaar, twee lijnen een dubbele binding. Je hoeft niet meteen elke naam te kennen. Zoek eerst de opvallende atomen: O en N vertellen vaak al veel.</p>
        <div className="lab-rule-list"><div><strong>C</strong><span>koolstof; maakt meestal vier bindingen</span></div><div><strong>H</strong><span>waterstof; maakt meestal één binding</span></div><div><strong>O</strong><span>zuurstof; zoek naar OH of C=O</span></div><div><strong>N</strong><span>stikstof; zoek naar NH₂ of C(=O)—N</span></div></div>
        <div className="lab-tip"><Sparkle size={18} weight="fill" /><span><b>Handige kijkvolgorde:</b> 1. zoek O/N, 2. kijk naar dubbele bindingen, 3. benoem de groep, 4. pas daarna voorspel je polariteit of H-bruggen.</span></div>
      </article>
      <article className="lab-notebook-card lab-example-card"><span className="learning-layer">Voorbeeld</span><h2>Lees ethanol in drie stappen.</h2>{exampleQuestions[0]?.structure && <StructureRenderer structure={exampleQuestions[0].structure} />}<ol className="lab-steps"><li><span>1</span><p>Je ziet een O die direct aan H zit: dat is een OH-groep.</p></li><li><span>2</span><p>OH aan een koolstofketen betekent: alcohol.</p></li><li><span>3</span><p>O trekt elektronen hard aan, dus dit uiteinde is polair.</p></li></ol></article>
    </section>}

    {tab === "build" && <section className="lab-build-layout">
      <aside className="lab-build-menu"><div><span className="learning-layer">Bouwopdrachten</span><h2>Werk in lagen.</h2><p>Start met losse atomen of kies een snel fragment zodra je de groep herkent. Blokjes zijn snelkoppelingen: ook een zelfgebouwde COOH met C, O, O en H telt gewoon mee.</p></div><div className="lab-level-tabs">{(["all", 1, 2, 3, 4] as const).map((item) => <button className={level === item ? "active" : ""} key={String(item)} onClick={() => selectLevel(item)}>{item === "all" ? "Alles" : `Niveau ${item}`}</button>)}</div><div className="lab-task-list">{tasks.map((task) => <button key={task.id} className={selectedTask.id === task.id ? "active" : ""} onClick={() => setSelectedTaskId(task.id)}><span>N{task.level}</span><div><strong>{task.title}</strong><small>{task.prompt}</small></div></button>)}</div></aside>
      <article className="lab-builder-stage"><div className="lab-builder-head"><div><span className="section-kicker">Niveau {selectedTask.level}</span><h2>{selectedTask.title}</h2><p>{selectedTask.prompt}</p></div><Flask size={30} weight="duotone" /></div><MoleculePuzzleBuilder key={selectedTask.id} task={selectedTask} /><p className="lab-builder-note">De knop <b>Controleer</b> vergelijkt bouwstenen, functionele groepen en bindingen. Je voortgang blijft op dit apparaat bewaard.</p></article>
    </section>}

    {tab === "groups" && <section className="lab-groups"><div className="lab-groups-head"><div><span className="learning-layer">Patronen herkennen</span><h2>Vijf groepen die je vaak terugziet.</h2><p>Lees niet alleen de naam; kijk naar het kleinste stuk structuur dat de groep bewijst.</p></div><div className="lab-group-key"><span>OH</span> alcohol <span>COOH</span> carbonzuur <span>C(=O)—O</span> ester</div></div><div className="lab-group-grid">{groupExamples.map((question) => question.structure && <article className="lab-group-card" key={question.id}><h3>{question.topic.replace("StructuurLab · ", "")}</h3><StructureRenderer structure={question.structure} /><p>{question.modelAnswer}</p></article>)}</div></section>}

    {tab === "test" && <section className="lab-test-section"><div className="lab-test-copy"><span className="learning-layer">Van kijken naar toetsdenken</span><h2>Structuurvragen zitten nu tussen je gewone oefenvragen.</h2><p>Je kunt er in Oefenen op filteren via onderwerpen zoals <b>StructuurLab · ester</b>, <b>StructuurLab · polariteit</b> of <b>StructuurLab · nucleotide</b>. Bouwvragen worden bewust niet in de Proeftoets gezet: daar wil je zonder interactieve editor kunnen werken.</p><button className="primary-button" onClick={onPractice}>Naar Oefenen <ArrowRight size={18} /></button></div><div className="lab-test-preview">{exampleQuestions.slice(1, 3).map((question) => question.structure && <article key={question.id}><div><span>{question.module}</span><small>Niveau {question.level}</small></div><p>{question.question}</p><CheckCircle size={21} weight="duotone" /></article>)}</div></section>}
  </div>;
}
