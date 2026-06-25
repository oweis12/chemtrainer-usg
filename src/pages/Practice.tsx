import { ArrowRight, Flask, Funnel, Shuffle, Sparkle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { questions } from "../data/questions";
import type { ModuleId, Question } from "../types";
import { QuestionCard } from "../components/QuestionCard";
import { filterQuestions, skillsFor, topicsFor } from "../utils/questionFilters";
import { buildPracticeDeck, getNextQuestion, loadPracticeDeck, markQuestionResult, resetPracticeDeck, savePracticeDeck, type PracticeDeck, type PracticeFilter } from "../utils/practiceScheduler";

interface PracticeProps {
  onResult: (question: Question, correct: boolean, reflection: string) => void;
  seedQuestionId?: string | null;
  onSeedHandled: () => void;
  onOpenTitrationLab: () => void;
}

export function Practice({ onResult, seedQuestionId, onSeedHandled, onOpenTitrationLab }: PracticeProps) {
  const [module, setModule] = useState<ModuleId | "all">("all");
  const [topic, setTopic] = useState("all");
  const [skill, setSkill] = useState("all");
  const [level, setLevel] = useState<number | "all">("all");
  const [current, setCurrent] = useState<Question | null>(null);
  const [resolved, setResolved] = useState(false);
  const [deck, setDeck] = useState<PracticeDeck | null>(null);
  const available = useMemo(() => filterQuestions(questions, { module, topic, skill, level }), [level, module, skill, topic]);
  const filter = useMemo<PracticeFilter>(() => ({ module, topic, skill, level }), [level, module, skill, topic]);
  const topics = topicsFor(questions, module);
  const skills = skillsFor(questions, module, topic);

  useEffect(() => { setTopic("all"); setSkill("all"); }, [module]);
  useEffect(() => { setSkill("all"); }, [topic]);
  useEffect(() => {
    const loaded = loadPracticeDeck(available, filter);
    setDeck(loaded);
    if (current && !available.some((item) => item.id === current.id)) setCurrent(null);
  }, [available, current, filter]);
  useEffect(() => { if (seedQuestionId) { const found = questions.find((question) => question.id === seedQuestionId); if (found) { setModule(found.module); setTopic(found.topic); setCurrent(found); setResolved(false); } onSeedHandled(); } }, [onSeedHandled, seedQuestionId]);

  const choose = () => {
    if (!available.length) return;
    const activeDeck = deck ?? loadPracticeDeck(available, filter);
    const { deck: nextDeck, question } = getNextQuestion(activeDeck, available);
    setDeck(nextDeck);
    setCurrent(question);
    setResolved(false);
  };
  const runResult = ({ question, correct, reflection }: { question: Question; correct: boolean; reflection: string }) => {
    onResult(question, correct, reflection);
    if (deck) setDeck(markQuestionResult(deck, question.id, correct));
    setResolved(true);
  };
  const skipCurrent = () => {
    if (!current || !deck) return;
    const nextDeck = markQuestionResult(deck, current.id, "skipped");
    const next = getNextQuestion(nextDeck, available);
    setDeck(next.deck);
    setCurrent(next.question);
    setResolved(false);
  };
  const masterCurrent = () => {
    if (!current || !deck) return;
    onResult(current, true, "Leerling markeerde deze vraag als beheerst in oefenmodus.");
    const nextDeck = markQuestionResult(deck, current.id, "mastered");
    const next = getNextQuestion(nextDeck, available);
    setDeck(next.deck);
    setCurrent(next.question);
    setResolved(false);
  };
  const newRound = () => {
    resetPracticeDeck(filter);
    const fresh = buildPracticeDeck(available, filter);
    savePracticeDeck(fresh);
    setDeck(fresh);
    setCurrent(null);
    setResolved(false);
  };
  const roundPosition = deck ? Math.min(deck.seenQuestionIds.length + (current && !deck.seenQuestionIds.includes(current.id) ? 1 : 0), available.length) : 0;

  return <div className="practice-page"><section className="page-intro intro-inline"><div><span className="section-kicker">Oefenen</span><h1>Stel je eigen oefenronde samen.</h1><p>Kies smal wanneer je achterloopt, of laat de app een mix trekken als je wilt testen wat blijft hangen.</p></div><div className="question-count"><strong>{available.length}</strong><span>beschikbare vragen</span></div></section><section className="titration-practice-card"><Flask size={24} weight="duotone" /><div><span className="section-kicker">M10 practicumvaardigheid</span><h2>TitratieLab oefenen</h2><p>Wil je niet alleen vragen maken, maar ook buret aflezen, eindpunt herkennen en rekenen met je eigen meting?</p></div><button className="secondary-button" onClick={onOpenTitrationLab}>Open TitratieLab</button></section><section className="filter-panel"><div className="filter-panel-title"><Funnel size={20} /><strong>Selecteer je oefening</strong></div><div className="filter-field"><label htmlFor="practice-module">Module</label><select id="practice-module" value={module} onChange={(event) => setModule(event.target.value as ModuleId | "all")}><option value="all">Alle modules met vragen</option>{["M4", "M5D", "M6", "M7", "M8", "M9", "M10"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-field"><label htmlFor="practice-topic">Onderwerp</label><select id="practice-topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">Alle onderwerpen</option>{topics.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-field"><label htmlFor="practice-skill">Vaardigheid</label><select id="practice-skill" value={skill} onChange={(event) => setSkill(event.target.value)}><option value="all">Alle vaardigheden</option>{skills.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-field"><label htmlFor="practice-level">Niveau</label><select id="practice-level" value={level} onChange={(event) => setLevel(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">Alle niveaus</option><option value="1">1 — basisbegrip</option><option value="2">2 — toepassen</option><option value="3">3 — toetsniveau</option><option value="4">4 — 8+ combinatie</option></select></div><button className="primary-button" onClick={choose} disabled={!available.length}><Shuffle size={18} /> Start oefening</button></section><div className="practice-round-bar"><span>{available.length ? `Vraag ${Math.max(roundPosition, current ? 1 : 0)} van ${available.length} in deze ronde` : "Geen vragen in deze filter"}</span><button className="ghost-button" onClick={newRound} disabled={!available.length}>Nieuwe ronde starten</button></div>{!current ? <div className="practice-empty"><Sparkle size={30} weight="duotone" /><h2>Kies een vraag om te beginnen</h2><p>Je filters bepalen welke vragen in je ronde terechtkomen.</p></div> : <><div className="practice-question-toolbar"><button className="ghost-button" onClick={skipCurrent}>Deze vraag later opnieuw</button><button className="secondary-button" onClick={masterCurrent}>Ik beheers deze</button></div><QuestionCard key={current.id} question={current} onPracticeResult={runResult} />{resolved && <div className="next-question"><div><span className="section-kicker">Volgende stap</span><strong>De planner kiest nu een vraag die niet direct hetzelfde is.</strong></div><button className="primary-button" onClick={choose}>Volgende vraag <ArrowRight size={18} /></button></div>}</>}</div>;
}
