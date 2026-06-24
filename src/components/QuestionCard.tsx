import { ArrowCounterClockwise, ArrowDown, ArrowUp, Check, CheckCircle, Eye, Lightbulb, PencilSimple, Question, SealCheck, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { structureBuildTaskMap } from "../data/structureBuildTasks";
import { getBinasReferencesFor } from "../data/binasReferences";
import type { Question as ChemistryQuestion } from "../types";
import { BinasBox } from "./BinasBox";
import { FeedbackPanel } from "./FeedbackPanel";
import { FormulaBlock } from "./FormulaBlock";
import { StructureRenderer } from "./StructureRenderer";
import { MoleculePuzzleBuilder } from "./chem/MoleculePuzzleBuilder";

type PracticeResult = { question: ChemistryQuestion; correct: boolean; reflection: string };

interface QuestionCardProps {
  question: ChemistryQuestion;
  mode?: "practice" | "test";
  number?: number;
  total?: number;
  onPracticeResult?: (result: PracticeResult) => void;
  onTestAnswer?: (question: ChemistryQuestion, answer: string) => void;
}

const objectiveTypes = new Set(["mcq", "calculation", "order"]);

function clean(text: string) {
  return text.toLowerCase().replaceAll(" ", "").replaceAll("×", "x").replaceAll("⁻", "-").replaceAll("₋", "-").replaceAll(",", ".");
}

function answerMatches(question: ChemistryQuestion, answer: string) {
  if (!question.correctAnswer) return false;
  const expected = clean(question.correctAnswer);
  const actual = clean(answer);
  if (actual === expected || actual.includes(expected)) return true;
  const expectedNumber = question.correctAnswer.match(/[-+]?\d+(?:[,.]\d+)?(?:\s*[×x]\s*10\^?[-+]?\d+)?/);
  if (expectedNumber && actual.includes(clean(expectedNumber[0]))) return true;
  return false;
}

export function QuestionCard({ question, mode = "practice", number, total, onPracticeResult, onTestAnswer }: QuestionCardProps) {
  const [textAnswer, setTextAnswer] = useState("");
  const [selected, setSelected] = useState("");
  const [order, setOrder] = useState(question.options ?? []);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<boolean | undefined>();
  const [hintIndex, setHintIndex] = useState(-1);
  const [reflection, setReflection] = useState("");
  const [recorded, setRecorded] = useState(false);
  const buildTask = question.type === "structure_build" && question.structureTaskId ? structureBuildTaskMap[question.structureTaskId] : undefined;
  const isBuilder = Boolean(buildTask);
  const binasReferences = useMemo(() => getBinasReferencesFor(question.module, `${question.topic} ${question.skill} ${question.question}`), [question]);

  const autoGrade = objectiveTypes.has(question.type);
  const activeAnswer = useMemo(() => question.type === "mcq" ? selected : question.type === "order" ? order.join(" > ") : textAnswer, [order, question.type, selected, textAnswer]);

  const moveOrder = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const copy = [...order];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setOrder(copy);
  };

  const report = (correct: boolean) => {
    if (recorded) return;
    setRecorded(true);
    onPracticeResult?.({ question, correct, reflection });
  };

  const handlePractice = () => {
    setRevealed(true);
    if (autoGrade) {
      const verdict = answerMatches(question, activeAnswer);
      setResult(verdict);
      report(verdict);
    }
  };

  const submitTest = () => onTestAnswer?.(question, activeAnswer);
  const typeLabel: Record<ChemistryQuestion["type"], string> = {
    mcq: "meerkeuze", open: "open uitleg", calculation: "berekening", steps: "stappenvraag", order: "volgorde", mixed: "combinatie", structure: "structuurformule",
    structure_view: "structuur lezen", structure_click: "structuur aanwijzen", structure_build: "molecuul bouwen", structure_complete: "structuur verklaren",
  };

  return (
    <article className="question-card">
      <div className="question-header">
        <div className="question-index">{number && total ? `${number} / ${total}` : "Oefenvraag"}</div>
        <div className="question-tags"><span>{question.module}</span><span>{question.topic}</span><span>Niveau {question.level}</span><span>{typeLabel[question.type]}</span></div>
      </div>
      <h2>{question.question}</h2>
      <div className="question-binas"><BinasBox references={binasReferences} /></div>
      {question.structure && <StructureRenderer structure={question.structure} />}
      {question.type === "calculation" && <FormulaBlock title="Rekenherinnering" note="Controleer steeds je eenheden."><span>n = c × V &nbsp; · &nbsp; c = n / V &nbsp; · &nbsp; V in L</span></FormulaBlock>}
      {isBuilder && buildTask && <div className="question-builder"><MoleculePuzzleBuilder task={buildTask} onChecked={(correct) => report(correct)} /></div>}

      {question.type === "mcq" && question.options && <div className="option-list">{question.options.map((option) => <label className={`option-row ${selected === option ? "selected" : ""}`} key={option}><input type="radio" name={question.id} value={option} checked={selected === option} onChange={() => setSelected(option)} /><span className="radio-dot" />{option}</label>)}</div>}

      {question.type === "order" && <div className="order-list">{order.map((item, index) => <div className="order-row" key={item}><span className="order-number">{index + 1}</span><span>{item}</span><span className="order-controls"><button onClick={() => moveOrder(index, -1)} aria-label="Omhoog"><ArrowUp size={15} /></button><button onClick={() => moveOrder(index, 1)} aria-label="Omlaag"><ArrowDown size={15} /></button></span></div>)}</div>}

      {!isBuilder && !(["mcq", "order"] as ChemistryQuestion["type"][]).includes(question.type) && <div className="answer-field"><label htmlFor={`${question.id}-answer`}><PencilSimple size={17} /> Jouw uitwerking{question.type === "calculation" ? " (met eenheden)" : ""}</label><textarea id={`${question.id}-answer`} value={textAnswer} onChange={(event) => setTextAnswer(event.target.value)} placeholder={question.type === "calculation" ? "Formule → invullen → eenheden → antwoord" : "Schrijf je uitleg in volledige zinnen…"} rows={question.type === "calculation" ? 4 : 6} /></div>}

      {!isBuilder && !revealed && mode === "practice" && <div className="hint-row"><button className="text-action" onClick={() => setHintIndex((current) => Math.min(current + 1, question.hints.length - 1))}><Lightbulb size={17} /> Toon hint</button>{hintIndex >= 0 && <span className="hint-text">{question.hints[hintIndex]}</span>}</div>}
      <div className="question-actions">
        {!isBuilder && (mode === "test" ? <button className="primary-button" disabled={!activeAnswer.trim()} onClick={submitTest}><SealCheck size={19} /> Antwoord vastleggen</button> : !revealed ? <button className="primary-button" disabled={!activeAnswer.trim() && question.type !== "order"} onClick={handlePractice}>{autoGrade ? <Check size={19} /> : <Eye size={19} />}{autoGrade ? "Controleer antwoord" : "Toon modelantwoord"}</button> : null)}
        {!isBuilder && question.type === "order" && !revealed && <button className="ghost-button" onClick={() => setOrder(question.options ?? [])}><ArrowCounterClockwise size={17} /> Herstel volgorde</button>}
      </div>

      {!isBuilder && revealed && <FeedbackPanel question={question} correct={result} selfReview={!autoGrade} />}
      {!isBuilder && revealed && !autoGrade && !recorded && <div className="self-assessment"><p><Question size={18} weight="fill" /> Beoordeel je eigen antwoord met de rubric.</p><div className="rubric-checks">{question.rubric.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}</div><label className="reflection-field">Als je dit opnieuw wilt oefenen, wat ga je anders doen?<input value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Bijv. eerst de molverhouding uitschrijven." /></label><div className="self-actions"><button className="secondary-button" onClick={() => report(true)}><CheckCircle size={18} weight="fill" /> Ik beheers dit</button><button className="review-button" onClick={() => report(false)}><WarningCircle size={18} weight="fill" /> Nog oefenen</button></div></div>}
    </article>
  );
}
