import { ArrowRight, BookOpenText, ClipboardText, Flask, Funnel, Shuffle, Sparkle, Target, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import { questions } from "../data/questions";
import type { ModuleId, Question } from "../types";
import { buildPracticeDeck, getNextQuestion, loadPracticeDeck, markQuestionResult, resetPracticeDeck, savePracticeDeck, type PracticeDeck, type PracticeFilter } from "../utils/practiceScheduler";
import { filterQuestions, skillsFor, topicsFor } from "../utils/questionFilters";

interface PracticeProps {
  onResult: (question: Question, correct: boolean, reflection: string) => void;
  seedQuestionId?: string | null;
  onSeedHandled: () => void;
  onOpenTitrationLab: () => void;
  onOpenMistakeLog: () => void;
  mistakeQuestionIds?: string[];
}

type PracticeLevel = PracticeFilter["level"];
type PracticeSource = NonNullable<PracticeFilter["source"]>;

const moduleIds: ModuleId[] = ["M4", "M5D", "M6", "M7", "M8", "M9", "M10"];

function levelMatches(question: Question, level: PracticeLevel) {
  if (level === "basis") return question.level <= 2;
  if (level === "toets") return question.level >= 3;
  return level === "all" || question.level === level;
}

function levelText(level: PracticeLevel) {
  if (level === "basis") return "niveau 1-2";
  if (level === "toets") return "niveau 3-4";
  if (level === "all") return "alle niveaus";
  return `niveau ${level}`;
}

export function Practice({ onResult, seedQuestionId, onSeedHandled, onOpenTitrationLab, onOpenMistakeLog, mistakeQuestionIds = [] }: PracticeProps) {
  const [module, setModule] = useState<ModuleId | "all">("all");
  const [topic, setTopic] = useState("all");
  const [skill, setSkill] = useState("all");
  const [level, setLevel] = useState<PracticeLevel>("all");
  const [source, setSource] = useState<PracticeSource>("default");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [current, setCurrent] = useState<Question | null>(null);
  const [resolved, setResolved] = useState(false);
  const [deck, setDeck] = useState<PracticeDeck | null>(null);

  const mistakeIds = useMemo(() => new Set(mistakeQuestionIds), [mistakeQuestionIds]);
  const availableFor = (nextModule: ModuleId | "all", nextTopic: string, nextSkill: string, nextLevel: PracticeLevel, nextSource: PracticeSource) => {
    if (nextSource === "review") return questions.filter((question) => mistakeIds.has(question.id));
    return filterQuestions(questions, { module: nextModule, topic: nextTopic, skill: nextSkill, level: "all" }).filter((question) => levelMatches(question, nextLevel));
  };

  const available = useMemo(() => availableFor(module, topic, skill, level, source), [level, mistakeIds, module, skill, source, topic]);
  const filter = useMemo<PracticeFilter>(() => ({ module, topic, skill, level, source }), [level, module, skill, source, topic]);
  const topics = topicsFor(questions, module);
  const skills = skillsFor(questions, module, topic);
  const basisCount = useMemo(() => questions.filter((question) => question.level <= 2).length, []);
  const testCount = useMemo(() => questions.filter((question) => question.level >= 3).length, []);
  const reviewCount = useMemo(() => questions.filter((question) => mistakeIds.has(question.id)).length, [mistakeIds]);

  useEffect(() => { setTopic("all"); setSkill("all"); }, [module]);
  useEffect(() => { setSkill("all"); }, [topic]);
  useEffect(() => {
    const loaded = loadPracticeDeck(available, filter);
    setDeck(loaded);
    if (current && !available.some((item) => item.id === current.id)) setCurrent(null);
  }, [available, current, filter]);
  useEffect(() => {
    if (!seedQuestionId) return;
    const found = questions.find((question) => question.id === seedQuestionId);
    if (found) {
      setSource("default");
      setModule(found.module);
      setTopic(found.topic);
      setSkill("all");
      setLevel("all");
      setCurrent(found);
      setResolved(false);
    }
    onSeedHandled();
  }, [onSeedHandled, seedQuestionId]);

  const chooseFrom = (items: Question[], nextFilter: PracticeFilter) => {
    if (!items.length) return;
    const activeDeck = loadPracticeDeck(items, nextFilter);
    const { deck: nextDeck, question } = getNextQuestion(activeDeck, items);
    setDeck(nextDeck);
    setCurrent(question);
    setResolved(false);
  };

  const choose = () => {
    if (!available.length) return;
    const activeDeck = deck ?? loadPracticeDeck(available, filter);
    const { deck: nextDeck, question } = getNextQuestion(activeDeck, available);
    setDeck(nextDeck);
    setCurrent(question);
    setResolved(false);
  };

  const startQuick = (nextLevel: PracticeLevel) => {
    const nextFilter: PracticeFilter = { module: "all", topic: "all", skill: "all", level: nextLevel, source: "default" };
    const items = availableFor("all", "all", "all", nextLevel, "default");
    setModule("all");
    setTopic("all");
    setSkill("all");
    setLevel(nextLevel);
    setSource("default");
    chooseFrom(items, nextFilter);
  };

  const startReview = () => {
    const nextFilter: PracticeFilter = { module: "all", topic: "all", skill: "all", level: "all", source: "review" };
    const items = availableFor("all", "all", "all", "all", "review");
    if (!items.length) {
      onOpenMistakeLog();
      return;
    }
    setModule("all");
    setTopic("all");
    setSkill("all");
    setLevel("all");
    setSource("review");
    chooseFrom(items, nextFilter);
  };

  const setDefaultFilter = () => {
    if (source === "review") setSource("default");
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
  const activeSummary = source === "review" ? "fouten opnieuw" : levelText(level);

  return <div className="practice-page">
    <section className="page-intro intro-inline">
      <div>
        <span className="section-kicker">Oefenen</span>
        <h1>Kies een rustige oefenroute.</h1>
        <p>Start snel met basis, toetsniveau of je foutenlog. Gebruik daarna pas filters als je heel gericht wilt oefenen.</p>
      </div>
      <div className="question-count"><strong>{available.length}</strong><span>{source === "review" ? "foutvragen" : "beschikbare vragen"}</span></div>
    </section>

    <section className="practice-quick-start" aria-label="Snelle start">
      <button className="quick-start-card" onClick={() => startQuick("basis")}>
        <BookOpenText size={25} weight="duotone" />
        <span><strong>Basis oefenen</strong><small>niveau 1-2 · {basisCount} vragen</small></span>
        <ArrowRight size={18} />
      </button>
      <button className="quick-start-card" onClick={() => startQuick("toets")}>
        <ClipboardText size={25} weight="duotone" />
        <span><strong>Toetsniveau</strong><small>niveau 3-4 · {testCount} vragen</small></span>
        <ArrowRight size={18} />
      </button>
      <button className="quick-start-card quick-start-review" onClick={startReview}>
        <WarningCircle size={25} weight="duotone" />
        <span><strong>Mijn fouten opnieuw</strong><small>{reviewCount ? `${reviewCount} opgeslagen foutvragen` : "open je foutenlog"}</small></span>
        <ArrowRight size={18} />
      </button>
    </section>

    <section className="titration-practice-card">
      <Flask size={24} weight="duotone" />
      <div>
        <span className="section-kicker">M10 practicumvaardigheid</span>
        <h2>TitratieLab oefenen</h2>
        <p>Wil je buret aflezen, eindpunt herkennen en rekenen met je eigen meting?</p>
      </div>
      <button className="secondary-button" onClick={onOpenTitrationLab}>Open TitratieLab</button>
    </section>

    <section className="filter-panel practice-filter-panel">
      <div className="filter-panel-title"><Funnel size={20} /><strong>Selecteer je oefening</strong><span>{activeSummary}</span></div>
      <div className="filter-field filter-field-module">
        <label htmlFor="practice-module">Module</label>
        <select id="practice-module" value={module} onChange={(event) => { setDefaultFilter(); setModule(event.target.value as ModuleId | "all"); }}>
          <option value="all">Alle modules met vragen</option>
          {moduleIds.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <details className="advanced-filter-drawer" open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}>
        <summary>Geavanceerde filters</summary>
        <div className="advanced-filter-grid">
          <div className="filter-field">
            <label htmlFor="practice-topic">Onderwerp</label>
            <select id="practice-topic" value={topic} onChange={(event) => { setDefaultFilter(); setTopic(event.target.value); }}>
              <option value="all">Alle onderwerpen</option>
              {topics.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="practice-skill">Vaardigheid</label>
            <select id="practice-skill" value={skill} onChange={(event) => { setDefaultFilter(); setSkill(event.target.value); }}>
              <option value="all">Alle vaardigheden</option>
              {skills.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="practice-level">Niveau</label>
            <select id="practice-level" value={level} onChange={(event) => {
              setDefaultFilter();
              const value = event.target.value;
              setLevel((value === "all" || value === "basis" || value === "toets" ? value : Number(value)) as PracticeLevel);
            }}>
              <option value="all">Alle niveaus</option>
              <option value="basis">Niveau 1-2</option>
              <option value="toets">Niveau 3-4</option>
              <option value="1">1 - basisbegrip</option>
              <option value="2">2 - toepassen</option>
              <option value="3">3 - toetsniveau</option>
              <option value="4">4 - 8+ combinatie</option>
            </select>
          </div>
        </div>
      </details>
      <button className="primary-button" onClick={choose} disabled={!available.length}><Shuffle size={18} /> Start oefening</button>
    </section>

    <div className="practice-round-bar">
      <span>{available.length ? `Vraag ${Math.max(roundPosition, current ? 1 : 0)} van ${available.length} in deze ronde` : "Geen vragen in deze selectie"}</span>
      <button className="ghost-button" onClick={newRound} disabled={!available.length}>Nieuwe ronde starten</button>
    </div>

    {!current ? <div className="practice-empty">
      <Sparkle size={30} weight="duotone" />
      <h2>Kies een vraag om te beginnen</h2>
      <p>De snelle start of filters bepalen welke vragen in je ronde terechtkomen.</p>
    </div> : <>
      {!resolved && <div className="practice-question-toolbar">
        <button className="ghost-button" onClick={skipCurrent}><Target size={17} /> Later opnieuw</button>
        <button className="ghost-button" onClick={masterCurrent}>Ik beheers dit</button>
      </div>}
      <QuestionCard key={current.id} question={current} onPracticeResult={runResult} />
      {resolved && <div className="next-question">
        <div><span className="section-kicker">Volgende stap</span><strong>De planner kiest nu een vraag die niet direct hetzelfde is.</strong></div>
        <button className="primary-button" onClick={choose}>Volgende vraag <ArrowRight size={18} /></button>
      </div>}
    </>}
  </div>;
}
