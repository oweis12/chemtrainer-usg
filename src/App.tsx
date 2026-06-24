import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Learn } from "./pages/Learn";
import { BinasGuide } from "./pages/BinasGuide";
import { MistakeLog } from "./pages/MistakeLog";
import { Practice } from "./pages/Practice";
import { StructureLab } from "./pages/StructureLab";
import { TestMode } from "./pages/TestMode";
import type { AppPage, Question, StoredProgress } from "./types";
import { readProgress, writeProgress } from "./utils/storage";

export function App() {
  const [activePage, setActivePage] = useState<AppPage>("home");
  const [progress, setProgress] = useState<StoredProgress>(() => readProgress());
  const [practiceSeed, setPracticeSeed] = useState<string | null>(null);

  useEffect(() => { writeProgress(progress); }, [progress]);
  useEffect(() => { document.documentElement.dataset.theme = progress.theme; }, [progress.theme]);

  const navigate = (page: AppPage) => setActivePage(page);
  const toggleTheme = () => setProgress((current) => ({ ...current, theme: current.theme === "light" ? "dark" : "light" }));
  const completeLesson = (lessonId: string) => setProgress((current) => current.completedLessons.includes(lessonId) ? current : { ...current, completedLessons: [...current.completedLessons, lessonId] });
  const recordResult = (question: Question, correct: boolean, reflection: string) => setProgress((current) => {
    const answer = { questionId: question.id, correct, answeredAt: new Date().toISOString(), module: question.module, topic: question.topic, level: question.level };
    const mistakes = correct ? current.mistakes : [...current.mistakes, { id: `${question.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`, questionId: question.id, module: question.module, topic: question.topic, faultType: question.skill, createdAt: new Date().toISOString(), reflection }];
    return { ...current, answers: [...current.answers, answer], mistakes };
  });
  const practiceQuestion = (questionId: string) => { setPracticeSeed(questionId); setActivePage("practice"); };
  const practiceModule = () => setActivePage("practice");

  let page: React.ReactNode;
  if (activePage === "learn") page = <Learn completedLessons={progress.completedLessons} onComplete={completeLesson} onPractice={practiceModule} />;
  else if (activePage === "practice") page = <Practice onResult={(question, correct, reflection) => recordResult(question, correct, reflection)} seedQuestionId={practiceSeed} onSeedHandled={() => setPracticeSeed(null)} />;
  else if (activePage === "test") page = <TestMode onResult={recordResult} onPracticeQuestion={(question) => practiceQuestion(question.id)} />;
  else if (activePage === "mistakes") page = <MistakeLog mistakes={progress.mistakes} onRetry={practiceQuestion} />;
  else if (activePage === "binas") page = <BinasGuide />;
  else if (activePage === "structurelab") page = <StructureLab onPractice={practiceModule} />;
  else page = <Home progress={progress} onNavigate={navigate} />;

  return (
    <Layout activePage={activePage} onNavigate={navigate} theme={progress.theme} onToggleTheme={toggleTheme}>
      {page}
      <SpeedInsights />
    </Layout>
  );
}
