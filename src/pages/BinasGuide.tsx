import { ArrowRight, BookBookmark, CheckCircle, Compass, GraduationCap, Info, ListChecks, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { BinasBox } from "../components/BinasBox";
import { binasFindingChallenges, binasReferenceMap, binasReferences } from "../data/binasReferences";
import type { BinasFindingChallenge } from "../data/binasReferences";
import type { ModuleId } from "../types";

type GuideMode = "guide" | "practice";

const modules: Array<ModuleId | "all"> = ["all", "M4", "M6", "M7", "M8", "M9", "M10"];

export function BinasGuide() {
  const [mode, setMode] = useState<GuideMode>("guide");
  const [module, setModule] = useState<ModuleId | "all">("all");
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string>();
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const visible = useMemo(() => binasReferences.filter((reference) => module === "all" || reference.module === module), [module]);
  const challenges = useMemo(() => binasFindingChallenges.filter((challenge) => module === "all" || challenge.module === module), [module]);
  const current = challenges[index % Math.max(challenges.length, 1)];

  const choose = (referenceId: string) => {
    if (!current || chosen) return;
    setChosen(referenceId);
    setScore((currentScore) => ({ correct: currentScore.correct + Number(referenceId === current.referenceId), answered: currentScore.answered + 1 }));
  };

  const next = () => { setChosen(undefined); setIndex((currentIndex) => currentIndex + 1); };
  const setFilter = (nextModule: ModuleId | "all") => { setModule(nextModule); setIndex(0); setChosen(undefined); };

  return <div className="binas-guide-page">
    <section className="page-intro intro-inline">
      <div><span className="section-kicker">BINAS-wijzer</span><h1>Vind de tabel vóór je gaat rekenen.</h1><p>Geen gekopieerde BINAS-inhoud: wel een rustige wegwijzer die vertelt welke tabel je opent, wanneer je dat doet en waar je niet in moet trappen.</p></div>
      <div className="binas-guide-stamp"><BookBookmark size={28} weight="duotone" /><span>eerst zoeken<br />dan redeneren</span></div>
    </section>

    <div className="binas-mode-tabs"><button className={mode === "guide" ? "active" : ""} onClick={() => setMode("guide")}><Compass size={18} /> Wijzer</button><button className={mode === "practice" ? "active" : ""} onClick={() => setMode("practice")}><GraduationCap size={18} /> BINAS vinden</button></div>
    <div className="binas-module-tabs">{modules.map((item) => <button key={item} className={module === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "all" ? "Alle relevante modules" : item}</button>)}</div>

    {mode === "guide" ? <section className="binas-guide-layout">
      <article className="binas-start-card"><span className="learning-layer">Zo gebruik je deze wijzer</span><h2>Drie stappen, geen tabelstress.</h2><ol className="binas-method"><li><span>1</span><p><b>Lees de vraag.</b> Gaat het om naam/formule, oplosbaarheid, een constante, een redoxcel of een indicator?</p></li><li><span>2</span><p><b>Kies één tabel.</b> Open niet vijf tabellen tegelijk; zoek eerst de grootheid of waarneming die de vraag echt nodig heeft.</p></li><li><span>3</span><p><b>Gebruik de uitkomst in je redenering.</b> BINAS geeft gegevens, maar jij schrijft de vergelijking, eenheden en conclusie.</p></li></ol><div className="binas-edition-note"><Info size={18} weight="fill" /><span>BINAS-edities kunnen in indeling verschillen. Controleer daarom altijd de kop en legenda van jouw exemplaar.</span></div></article>
      <div className="binas-reference-list">{visible.map((reference) => <article className="binas-reference-card" key={reference.id}><div className="binas-reference-card-head"><span>{reference.module}</span><strong>{reference.tabel}</strong></div><h2>{reference.onderwerp}</h2><p>{reference.wanneerGebruikJeDezeTabel}</p><div className="binas-example"><small>Voorbeeldvraag</small><p>{reference.voorbeeldvraag}</p></div><div className="binas-card-warning"><WarningCircle size={16} weight="fill" /><span>{reference.waarschuwing}</span></div></article>)}</div>
    </section> : <BinasFindingPractice challenge={current} selected={chosen} score={score} onChoose={choose} onNext={next} />}
  </div>;
}

function BinasFindingPractice({ challenge, selected, score, onChoose, onNext }: { challenge?: BinasFindingChallenge; selected?: string; score: { correct: number; answered: number }; onChoose: (referenceId: string) => void; onNext: () => void }) {
  if (!challenge) return <div className="practice-empty"><ListChecks size={30} weight="duotone" /><h2>Geen oefenvraag in deze filter</h2><p>Kies een andere module om BINAS-vragen te oefenen.</p></div>;
  const correct = selected === challenge.referenceId;
  const solution = binasReferenceMap[challenge.referenceId];
  return <section className="binas-finding-card"><div className="binas-finding-head"><div><span className="section-kicker">BINAS vinden · {challenge.module}</span><h2>Welke tabel open je?</h2></div><div className="binas-score"><strong>{score.correct}/{score.answered}</strong><span>goed gekozen</span></div></div><p className="binas-finding-question">{challenge.prompt}</p><div className="binas-choice-list">{challenge.optionIds.map((referenceId) => { const reference = binasReferenceMap[referenceId]; const state = selected ? referenceId === challenge.referenceId ? "correct" : referenceId === selected ? "wrong" : "" : ""; return <button key={referenceId} className={state} disabled={Boolean(selected)} onClick={() => onChoose(referenceId)}><span>{reference.tabel}</span><strong>{reference.onderwerp}</strong></button>; })}</div>{selected && <div className={`binas-answer-panel ${correct ? "good" : "review"}`}>{correct ? <CheckCircle size={23} weight="fill" /> : <WarningCircle size={23} weight="fill" />}<div><strong>{correct ? "Precies de juiste ingang." : "Bijna — kijk naar wat de vraag echt vraagt."}</strong><p><b>{solution.tabel}</b>: {solution.wanneerGebruikJeDezeTabel}</p><p>{solution.waarschuwing}</p></div></div>}<div className="binas-next-row"><BinasBox references={[solution]} heading="Waarom deze tabel?" compact /><button className="primary-button" onClick={onNext}>Volgende BINAS-vraag <ArrowRight size={18} /></button></div></section>;
}
