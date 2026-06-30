import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Learn } from "./pages/Learn";
import { BinasGuide } from "./pages/BinasGuide";
import { CoveragePage } from "./pages/CoveragePage";
import { MistakeLog } from "./pages/MistakeLog";
import { Practice } from "./pages/Practice";
import { Rewards } from "./pages/Rewards";
import { StructureLab } from "./pages/StructureLab";
import { TitrationLab } from "./pages/TitrationLab";
import { TestMode } from "./pages/TestMode";
import { VisualAssetAudit } from "./pages/VisualAssetAudit";
import type { AppPage, LocalProfile, Question, TitrationLabProgress } from "./types";
import { createProfile, deleteProfile, parseProfilesBackup, readActiveProfile, readProfiles, renameProfile, resetProfileProgress, serializeProfilesBackup, setActiveProfile, writeProfiles } from "./utils/storage";
import { applyDailyStreakReward, completeLessonWithRewards, purchaseShopItem, recordQuestionResultWithRewards, setCompanionHidden, toggleEquippedItem, type RewardGrant } from "./utils/gameRewards";

type ProfileSession = { profiles: LocalProfile[]; activeProfileId: string };
type RewardToastMessage = { id: string; label: string; points: number };

function loadProfileSession(): ProfileSession {
  const profiles = readProfiles();
  return {
    profiles,
    activeProfileId: readActiveProfile(profiles),
  };
}

function downloadJson(filename: string, raw: string) {
  const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [activePage, setActivePage] = useState<AppPage>("home");
  const [profileSession, setProfileSession] = useState<ProfileSession>(loadProfileSession);
  const [practiceSeed, setPracticeSeed] = useState<string | null>(null);
  const [rewardToasts, setRewardToasts] = useState<RewardToastMessage[]>([]);

  const activeProfile = profileSession.profiles.find((profile) => profile.id === profileSession.activeProfileId) ?? profileSession.profiles[0];
  const progress = activeProfile.progress;

  function queueRewardToasts(grants: RewardGrant[]) {
    const nextToasts = grants
      .filter((grant) => grant.points !== 0)
      .map((grant) => ({ id: grant.id, label: grant.label, points: grant.points }));
    if (!nextToasts.length) return;
    setRewardToasts((current) => [...current, ...nextToasts].slice(-4));
  }

  function updateActiveProfile(updater: (profile: LocalProfile) => LocalProfile) {
    setProfileSession((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => profile.id === current.activeProfileId ? updater(profile) : profile),
    }));
  }

  function applyRewardedProfileChange(updater: (profile: LocalProfile) => { profile: LocalProfile; grants: RewardGrant[] }) {
    let granted: RewardGrant[] = [];
    setProfileSession((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => {
        if (profile.id !== current.activeProfileId) return profile;
        const result = updater(profile);
        granted = result.grants;
        return result.profile;
      }),
    }));
    queueRewardToasts(granted);
  }

  useEffect(() => {
    writeProfiles(profileSession.profiles);
    setActiveProfile(profileSession.activeProfileId);
  }, [profileSession]);

  useEffect(() => {
    document.documentElement.dataset.theme = progress.theme;
  }, [progress.theme]);

  useEffect(() => {
    if (!activeProfile) return;
    const resolution = applyDailyStreakReward(activeProfile);
    if (!resolution.grants.length) return;
    setProfileSession((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => profile.id === current.activeProfileId ? resolution.profile : profile),
    }));
    queueRewardToasts(resolution.grants);
  }, [activeProfile.id, activeProfile.game.lastActiveDate]);

  const navigate = (page: AppPage) => setActivePage(page);
  const toggleTheme = () => updateActiveProfile((profile) => ({
    ...profile,
    progress: {
      ...profile.progress,
      theme: profile.progress.theme === "light" ? "dark" : "light",
    },
  }));
  const completeLesson = (lessonId: string) => applyRewardedProfileChange((profile) => completeLessonWithRewards(profile, lessonId));
  const recordResult = (question: Question, correct: boolean, reflection: string, source: "practice" | "test") => {
    applyRewardedProfileChange((profile) => recordQuestionResultWithRewards(profile, question, correct, reflection, source));
  };
  const practiceQuestion = (questionId: string) => {
    setPracticeSeed(questionId);
    setActivePage("practice");
  };
  const practiceModule = () => setActivePage("practice");
  const saveTitrationProgress = (titrationLab: TitrationLabProgress) => updateActiveProfile((profile) => ({
    ...profile,
    progress: {
      ...profile.progress,
      titrationLab,
    },
  }));

  let page: React.ReactNode;
  if (activePage === "learn") {
    page = (
      <Learn
        completedLessons={progress.completedLessons}
        onComplete={completeLesson}
        onPractice={practiceModule}
        onTitrationLab={() => setActivePage("titrationlab")}
      />
    );
  } else if (activePage === "practice") {
    page = (
      <Practice
        onResult={(question, correct, reflection) => recordResult(question, correct, reflection, "practice")}
        seedQuestionId={practiceSeed}
        onSeedHandled={() => setPracticeSeed(null)}
        onOpenTitrationLab={() => setActivePage("titrationlab")}
        onOpenMistakeLog={() => setActivePage("mistakes")}
        mistakeQuestionIds={progress.mistakes.map((mistake) => mistake.questionId)}
      />
    );
  } else if (activePage === "test") {
    page = (
      <TestMode
        progress={progress}
        onResult={(question, correct, reflection) => recordResult(question, correct, reflection, "test")}
        onPracticeQuestion={(question) => practiceQuestion(question.id)}
      />
    );
  } else if (activePage === "mistakes") {
    page = <MistakeLog mistakes={progress.mistakes} onRetry={practiceQuestion} />;
  } else if (activePage === "binas") {
    page = <BinasGuide />;
  } else if (activePage === "structurelab") {
    page = <StructureLab onPractice={practiceModule} />;
  } else if (activePage === "titrationlab") {
    page = <TitrationLab progress={progress.titrationLab} onSaveProgress={saveTitrationProgress} />;
  } else if (activePage === "coverage") {
    page = <CoveragePage onVisualAudit={() => setActivePage("visualaudit")} />;
  } else if (activePage === "visualaudit") {
    page = <VisualAssetAudit />;
  } else if (activePage === "rewards") {
    page = (
      <Rewards
        profile={activeProfile}
        onPurchase={(itemId) => applyRewardedProfileChange((profile) => purchaseShopItem(profile, itemId))}
        onToggleEquip={(itemId) => updateActiveProfile((profile) => toggleEquippedItem(profile, itemId))}
        onToggleCompanion={(hidden) => updateActiveProfile((profile) => setCompanionHidden(profile, hidden))}
      />
    );
  } else {
    page = <Home progress={progress} onNavigate={navigate} />;
  }

  return (
    <>
      <Layout
        activePage={activePage}
        onNavigate={navigate}
        theme={progress.theme}
        onToggleTheme={toggleTheme}
        activeProfile={activeProfile}
        profiles={profileSession.profiles}
        rewardToasts={rewardToasts}
        onDismissToast={(toastId) => setRewardToasts((current) => current.filter((toast) => toast.id !== toastId))}
        onOpenRewards={() => setActivePage("rewards")}
        onSwitchProfile={(profileId) => setProfileSession((current) => ({ ...current, activeProfileId: profileId }))}
        onCreateProfile={(name) => setProfileSession((current) => {
          const nextProfile = createProfile(name, current.profiles.length);
          return {
            profiles: [...current.profiles, nextProfile],
            activeProfileId: nextProfile.id,
          };
        })}
        onRenameProfile={(profileId, name) => setProfileSession((current) => ({ ...current, profiles: renameProfile(current.profiles, profileId, name) }))}
        onResetProfile={(profileId) => {
          if (!window.confirm("Weet je zeker dat je dit profiel wilt resetten? Punten, voortgang en beloningen gaan dan lokaal verloren.")) return;
          setProfileSession((current) => ({ ...current, profiles: resetProfileProgress(current.profiles, profileId) }));
        }}
        onDeleteProfile={(profileId) => {
          if (!window.confirm("Weet je zeker dat je dit lokale profiel wilt verwijderen?")) return;
          setProfileSession((current) => deleteProfile(current.profiles, profileId, current.activeProfileId));
        }}
        onExportCurrentProfile={() => {
          const currentProfile = profileSession.profiles.find((profile) => profile.id === profileSession.activeProfileId);
          if (!currentProfile) return;
          downloadJson(
            `chemtrainer-profiel-${currentProfile.name.toLowerCase().replace(/\s+/g, "-")}.json`,
            serializeProfilesBackup([currentProfile], currentProfile.id),
          );
        }}
        onExportAllProfiles={() => downloadJson("chemtrainer-profielen-backup.json", serializeProfilesBackup(profileSession.profiles, profileSession.activeProfileId))}
        onImportBackup={async (file) => {
          try {
            const backup = parseProfilesBackup(await file.text());
            setProfileSession(backup);
            window.alert("Backup succesvol geïmporteerd.");
          } catch (error) {
            window.alert(error instanceof Error ? error.message : "De backup kon niet worden gelezen.");
          }
        }}
      >
        {page}
      </Layout>
      <Analytics />
    </>
  );
}
