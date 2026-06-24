import { ArrowRight, Funnel, Shuffle, Sparkle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { questions } from "../data/questions";
import type { ModuleId, Question } from "../types";
import { QuestionCard } from "../components/QuestionCard";
import { filterQuestions, skillsFor, topicsFor } from "../utils/questionFilters";

interface PracticeProps {
  onResult: (question: Question, correct: boolean, reflection: string) => void;
  seedQuestionId?: string | null;
  onSeedHandled: () => void;
}

export function Practice({ onResult, seedQuestionId, onSeedHandled }: PracticeProps) {
  const [module, setModule] = useState<ModuleId | "all">("all");
  const [topic, setTopic] = useState("all");
  const [skill, setSkill] = useState("all");
  const [level, setLevel] = useState<number | "all">("all");
  const [current, setCurrent] = useState<Question | null>(null);
  const [resolved, setResolved] = useState(false);
  const available = useMemo(() => filterQuestions(questions, { module, topic, skill, level }), [level, module, skill, topic]);
  const topics = topicsFor(questions, module);
  const skills = skillsFor(questions, module, topic);

  useEffect(() => { setTopic("all"); setSkill("all"); }, [module]);
  useEffect(() => { setSkill("all"); }, [topic]);
  useEffect(() => { if (available.length && current && !available.some((item) => item.id === current.id)) setCurrent(null); }, [available, current]);
  useEffect(() => { if (seedQuestionId) { const found = questions.find((question) => question.id === seedQuestionId); if (found) { setModule(found.module); setTopic(found.topic); setCurrent(found); setResolved(false); } onSeedHandled(); } }, [onSeedHandled, seedQuestionId]);

  const choose = (random = false) => { if (!available.length) return; const next = random ? available[Math.floor(Math.random() * available.length)] : available.find((item) => item.id !== current?.id) ?? available[0]; setCurrent(next); setResolved(false); };
  const runResult = ({ question, correct, reflection }: { question: Question; correct: boolean; reflection: string }) => { onResult(question, correct, reflection); setResolved(true); };

  return <div className="practice-page"><section className="page-intro intro-inline"><div><span className="section-kicker">Oefenen</span><h1>Stel je eigen oefenronde samen.</h1><p>Kies smal wanneer je achterloopt, of laat de app een mix trekken als je wilt testen wat blijft hangen.</p></div><div className="question-count"><strong>{available.length}</strong><span>beschikbare vragen</span></div></section><section className="filter-panel"><div className="filter-panel-title"><Funnel size={20} /><strong>Selecteer je oefening</strong></div><div className="filter-field"><label htmlFor="practice-module">Module</label><select id="practice-module" value={module} onChange={(event) => setModule(event.target.value as ModuleId | "all")}><option value="all">Alle modules met vragen</option>{["M4", "M5D", "M6", "M7", "M8", "M9", "M10"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-field"><label htmlFor="practice-topic">Onderwerp</label><select id="practice-topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">Alle onderwerpen</option>{topics.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-field"><label htmlFor="practice-skill">Vaardigheid</label><select id="practice-skill" value={skill} onChange={(event) => setSkill(event.target.value)}><option value="all">Alle vaardigheden</option>{skills.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-field"><label htmlFor="practice-level">Niveau</label><select id="practice-level" value={level} onChange={(event) => setLevel(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">Alle niveaus</option><option value="1">1 — basisbegrip</option><option value="2">2 — toepassen</option><option value="3">3 — toetsniveau</option><option value="4">4 — 8+ combinatie</option></select></div><button className="primary-button" onClick={() => choose(true)} disabled={!available.length}><Shuffle size={18} /> Start oefening</button></section>{!current ? <div className="practice-empty"><Sparkle size={30} weight="duotone" /><h2>Kies een vraag om te beginnen</h2><p>Je filters bepalen welke vragen in je ronde terechtkomen.</p></div> : <><QuestionCard key={current.id} question={current} onPracticeResult={runResult} />{resolved && <div className="next-question"><div><span className="section-kicker">Volgende stap</span><strong>Pak een nieuwe vraag of scherp je filters verder aan.</strong></div><button className="primary-button" onClick={() => choose(true)}>Volgende vraag <ArrowRight size={18} /></button></div>}</>}</div>;
}
