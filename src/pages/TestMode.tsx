import { Alarm, ArrowRight, CheckCircle, ClipboardText, Clock, GraduationCap, ListChecks, Shuffle, Sparkle, Target, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { questions } from "../data/questions";
import type { Question, TestKind } from "../types";
import { FeedbackPanel } from "../components/FeedbackPanel";
import { QuestionCard } from "../components/QuestionCard";

const objectiveTypes = new Set(["mcq", "calculation", "order"]);
// Bouwen vraagt om een interactief canvas en hoort daarom thuis in Oefenen/StructuurLab,
// niet in een lineaire proeftoets zonder directe interactie.
const testEligibleQuestions = questions.filter((question) => question.type !== "structure_build");
const clean = (text: string) => text.toLowerCase().replaceAll(" ", "").replaceAll(",", ".").replaceAll("×", "x");
const testAnswerMatches = (question: Question, answer: string) => {
  if (!question.correctAnswer) return false;
  const expected = clean(question.correctAnswer);
  if (clean(answer) === expected || clean(answer).includes(expected)) return true;
  const number = question.correctAnswer.match(/[-+]?\d+(?:[,.]\d+)?(?:\s*[×x]\s*10\^?[-+]?\d+)?/);
  return Boolean(number && clean(answer).includes(clean(number[0])));
};
const mix = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const timeLabel = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

interface TestModeProps {
  onResult: (question: Question, correct: boolean, reflection: string) => void;
  onPracticeQuestion: (question: Question) => void;
}

export function TestMode({ onResult, onPracticeQuestion }: TestModeProps) {
  const [kind, setKind] = useState<TestKind>("official");
  const [withTimer, setWithTimer] = useState(true);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [outcomes, setOutcomes] = useState<Record<string, boolean | undefined>>({});
  const [seconds, setSeconds] = useState(40 * 60);

  useEffect(() => {
    if (!started || submitted || !withTimer || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, started, submitted, withTimer]);
  useEffect(() => { if (started && seconds === 0 && !submitted) submit(); }, [seconds, started, submitted]);

  const current = items[index];
  const picked = useMemo(() => {
    if (kind === "challenge") return mix(testEligibleQuestions.filter((question) => question.level === 4)).slice(0, 8);
    if (kind === "official") {
      const sequence = ["M4", "M5D", "M6", "M7", "M8", "M9", "M10", "M4", "M6", "M10"];
      return sequence.map((module, occurrence) => {
        const moduleQuestions = testEligibleQuestions.filter((question) => question.module === module);
        return moduleQuestions[occurrence % moduleQuestions.length];
      });
    }
    return mix(testEligibleQuestions).slice(0, 10);
  }, [kind]);

  function start() { setItems(picked); setIndex(0); setAnswers({}); setOutcomes({}); setSeconds(kind === "challenge" ? 35 * 60 : kind === "official" ? 40 * 60 : 30 * 60); setSubmitted(false); setStarted(true); }
  function acceptAnswer(question: Question, answer: string) { setAnswers((all) => ({ ...all, [question.id]: answer })); setIndex((currentIndex) => Math.min(currentIndex + 1, items.length)); }
  function submit() {
    if (submitted) return;
    const automatic: Record<string, boolean | undefined> = {};
    items.forEach((question) => { if (objectiveTypes.has(question.type)) { const correct = testAnswerMatches(question, answers[question.id] ?? ""); automatic[question.id] = correct; onResult(question, correct, "Automatisch beoordeeld in toetsmodus."); } });
    setOutcomes(automatic); setSubmitted(true);
  }
  function selfScore(question: Question, correct: boolean) { if (outcomes[question.id] !== undefined) return; setOutcomes((all) => ({ ...all, [question.id]: correct })); onResult(question, correct, "Zelf beoordeeld na toetsinzage."); }

  if (!started) return <div className="test-page"><section className="page-intro"><span className="section-kicker">Toetsmodus</span><h1>Oefen onder toetscondities.</h1><p>Geen directe feedback, geen hints. Je krijgt pas na inleveren je analyse en modelantwoorden.</p></section><div className="test-kind-grid"><TestKindCard active={kind === "official"} title="Proeftoets" text="Gebalanceerde set uit modules 4 t/m 10." icon={<GraduationCap size={31} />} onClick={() => setKind("official")} /><TestKindCard active={kind === "random"} title="Random proeftoets" text="Tien willekeurige, serieuze vragen uit de databank." icon={<Shuffle size={30} />} onClick={() => setKind("random")} /><TestKindCard active={kind === "challenge"} title="8+ challenge" text="Combinatievragen die redeneren en rekenen verbinden." icon={<Sparkle size={30} />} onClick={() => setKind("challenge")} /></div><section className="test-settings"><div><Alarm size={24} /><div><strong>Timer optioneel</strong><p>{kind === "challenge" ? "35 minuten" : kind === "official" ? "40 minuten" : "30 minuten"} voorgesteld.</p></div></div><label className="switch-label"><input type="checkbox" checked={withTimer} onChange={(event) => setWithTimer(event.target.checked)} /><span className="toggle-rail"><span /></span>{withTimer ? "Timer aan" : "Timer uit"}</label><button className="primary-button" onClick={start}><ClipboardText size={19} /> Start {kind === "challenge" ? "challenge" : "toets"}</button></section></div>;
  if (submitted) return <TestResults items={items} outcomes={outcomes} onSelfScore={selfScore} onPractice={onPracticeQuestion} onAgain={() => setStarted(false)} />;
  if (!current) return <div className="test-page"><div className="test-finish-card"><CheckCircle size={42} weight="fill" /><h1>Alle antwoorden zijn vastgelegd.</h1><p>Je kunt nu inleveren. Daarna zie je pas de feedback.</p><button className="primary-button" onClick={submit}>Toets inleveren <ArrowRight size={18} /></button></div></div>;
  return <div className="test-page"><div className="test-run-header"><div><span className="section-kicker">{kind === "challenge" ? "8+ challenge" : kind === "official" ? "Proeftoets" : "Random proeftoets"}</span><strong>Vraag {Math.min(index + 1, items.length)} van {items.length}</strong></div>{withTimer && <span className={`timer ${seconds < 300 ? "timer-low" : ""}`}><Clock size={18} /> {timeLabel(seconds)}</span>}<button className="text-action" onClick={submit}>Nu inleveren</button></div><p className="test-rule">Toetsmodus: feedback en modelantwoorden blijven verborgen tot je inlevert.</p><QuestionCard key={current.id} question={current} mode="test" number={index + 1} total={items.length} onTestAnswer={acceptAnswer} /></div>;
}

function TestKindCard({ active, title, text, icon, onClick }: { active: boolean; title: string; text: string; icon: React.ReactNode; onClick: () => void }) { return <button className={`test-kind-card ${active ? "selected" : ""}`} onClick={onClick}>{icon}<h2>{title}</h2><p>{text}</p><span>{active ? "Geselecteerd" : "Kies deze modus"}</span></button>; }

function TestResults({ items, outcomes, onSelfScore, onPractice, onAgain }: { items: Question[]; outcomes: Record<string, boolean | undefined>; onSelfScore: (question: Question, correct: boolean) => void; onPractice: (question: Question) => void; onAgain: () => void }) {
  const assessed = items.filter((question) => outcomes[question.id] !== undefined);
  const correct = assessed.filter((question) => outcomes[question.id]).length;
  const topics = [...new Set(items.map((question) => question.topic))];
  const weak = assessed.filter((question) => outcomes[question.id] === false);
  return <div className="test-results"><section className="result-hero"><span className="section-kicker">Toetsanalyse</span><h1>Ingeleverd. Nu wordt het leerzaam.</h1><div className="score-circle"><strong>{assessed.length ? Math.round((correct / assessed.length) * 100) : "—"}%</strong><span>{correct} / {assessed.length} beoordeeld goed</span></div><p>{items.length - assessed.length ? `${items.length - assessed.length} open vragen wachten nog op je zelfbeoordeling.` : "Alle vragen zijn beoordeeld."}</p></section><section className="topic-score-grid">{topics.map((topic) => { const topicItems = items.filter((question) => question.topic === topic && outcomes[question.id] !== undefined); const topicCorrect = topicItems.filter((question) => outcomes[question.id]).length; return <div className="topic-score" key={topic}><span>{topic}</span><strong>{topicItems.length ? `${Math.round((topicCorrect / topicItems.length) * 100)}%` : "zelf beoordelen"}</strong><small>{topicCorrect}/{topicItems.length} goed</small></div>; })}</section>{weak.length > 0 && <section className="retry-strip"><WarningCircle size={24} weight="fill" /><div><strong>Opnieuw oefenen</strong><p>{weak.length} fout{weak.length === 1 ? "e" : "en"} zijn aan je foutenlog toegevoegd. Pak ze gericht terug.</p></div><button className="secondary-button" onClick={() => onPractice(weak[0])}><Target size={18} /> Oefen eerste fout</button></section>}<section className="result-review"><h2>Inzage per vraag</h2>{items.map((question, index) => <article className="result-question" key={question.id}><div className="result-question-head"><span>Vraag {index + 1} · {question.topic}</span>{outcomes[question.id] === true ? <span className="good-chip">goed</span> : outcomes[question.id] === false ? <span className="error-chip">opnieuw oefenen</span> : <span className="wait-chip">zelf beoordelen</span>}</div><p>{question.question}</p><FeedbackPanel question={question} correct={outcomes[question.id]} selfReview={!objectiveTypes.has(question.type)} />{outcomes[question.id] === undefined && <div className="self-actions"><button className="secondary-button" onClick={() => onSelfScore(question, true)}><CheckCircle size={18} weight="fill" /> Mijn antwoord klopt</button><button className="review-button" onClick={() => onSelfScore(question, false)}><WarningCircle size={18} weight="fill" /> Ik wil dit herhalen</button></div>}</article>)}</section><button className="primary-button" onClick={onAgain}><ListChecks size={18} /> Nieuwe toets instellen</button></div>;
}
