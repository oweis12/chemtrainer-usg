import { Atom, BookBookmark, BookOpenText, ClipboardText, DotsThree, Flask, Gift, House, ListChecks, Moon, Sun, Target, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { FloatingCompanion } from "./game/FloatingCompanion";
import { PointsBadge } from "./game/PointsBadge";
import { RewardToast, type RewardToastMessage } from "./game/RewardToast";
import { ProfileSwitcher } from "./ProfileSwitcher";
import type { AppPage, LocalProfile, ThemeMode } from "../types";

const navigationGroups = [
  {
    label: "Leren",
    links: [
      { id: "home", label: "Dashboard", icon: House },
      { id: "learn", label: "Leren", icon: BookOpenText },
      { id: "practice", label: "Oefenen", icon: ListChecks },
      { id: "test", label: "Toetsmodus", icon: ClipboardText },
    ],
  },
  {
    label: "Hulpmiddelen",
    links: [
      { id: "titrationlab", label: "TitratieLab", icon: Flask },
      { id: "structurelab", label: "StructuurLab", icon: Atom },
      { id: "binas", label: "BINAS-wijzer", icon: BookBookmark },
    ],
  },
  {
    label: "Voortgang",
    links: [
      { id: "coverage", label: "Leerdoelen", icon: Target },
      { id: "mistakes", label: "Foutenlog", icon: WarningCircle },
    ],
  },
] as const;

const pageLabels: Record<AppPage, string> = {
  home: "Dashboard",
  learn: "Leren",
  practice: "Oefenen",
  test: "Toetsmodus",
  mistakes: "Foutenlog",
  structurelab: "StructuurLab",
  titrationlab: "TitratieLab",
  binas: "BINAS-wijzer",
  coverage: "Leerdoelen",
  visualaudit: "Visuele controle",
  rewards: "Beloningen",
  privacy: "Privacy",
};

interface LayoutProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeProfile: LocalProfile;
  profiles: LocalProfile[];
  rewardToasts: RewardToastMessage[];
  onDismissToast: (toastId: string) => void;
  onOpenRewards: () => void;
  onSwitchProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
  onRenameProfile: (profileId: string, name: string) => void;
  onResetProfile: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onExportCurrentProfile: () => void;
  onExportAllProfiles: () => void;
  onImportBackup: (file: File) => Promise<void> | void;
  children: React.ReactNode;
}

export function Layout({
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
  activeProfile,
  profiles,
  rewardToasts,
  onDismissToast,
  onOpenRewards,
  onSwitchProfile,
  onCreateProfile,
  onRenameProfile,
  onResetProfile,
  onDeleteProfile,
  onExportCurrentProfile,
  onExportAllProfiles,
  onImportBackup,
  children,
}: LayoutProps) {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const navigate = (page: AppPage) => {
    setMobileMoreOpen(false);
    onNavigate(page);
  };
  const isPrimaryMobilePage = activePage === "home" || activePage === "learn" || activePage === "practice";

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <button className="brand" onClick={() => navigate("home")} aria-label="Naar dashboard">
          <Flask size={27} weight="duotone" />
          <span>ChemTrainer <b>USG</b></span>
        </button>

        <nav className="nav-list" aria-label="Hoofdnavigatie">
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.links.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`nav-button ${activePage === id ? "is-active" : ""}`}
                  onClick={() => navigate(id)}
                  aria-current={activePage === id ? "page" : undefined}
                >
                  <Icon size={19} weight={activePage === id ? "fill" : "regular"} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="rail-bottom">
          <span>VWO · Scheikunde</span>
          <button className="nav-rewards-link" onClick={onOpenRewards}>
            <Gift size={17} /> Beloningen
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-context">
            <span className="topbar-page">{pageLabels[activePage]}</span>
          </div>
          <div className="topbar-actions">
            <PointsBadge
              points={activeProfile.game.points}
              level={activeProfile.game.level}
              streakDays={activeProfile.game.streakDays}
              onOpenRewards={onOpenRewards}
            />
            <ProfileSwitcher
              activeProfile={activeProfile}
              profiles={profiles}
              onSwitch={onSwitchProfile}
              onCreate={onCreateProfile}
              onRename={onRenameProfile}
              onReset={onResetProfile}
              onDelete={onDeleteProfile}
              onExportCurrent={onExportCurrentProfile}
              onExportAll={onExportAllProfiles}
              onImportBackup={onImportBackup}
            />
            <button className="theme-switch" onClick={onToggleTheme} aria-label="Wissel kleurmodus">
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
              <span>{theme === "light" ? "Donker" : "Licht"}</span>
            </button>
          </div>
        </header>

        <main className="content-area">
          {children}
          <footer className="site-footer">
            <span>Voortgang wordt lokaal opgeslagen op dit apparaat.</span>
            <div className="site-footer-links">
              <a href="/privacy.html" target="_blank" rel="noreferrer">Privacy</a>
              <a href="/over-chemtrainer.html" target="_blank" rel="noreferrer">Over ChemTrainer</a>
              <a href="/scheikunde-vwo.html" target="_blank" rel="noreferrer">Scheikunde VWO</a>
              <a href="/voor-docenten.html" target="_blank" rel="noreferrer">Voor docenten</a>
            </div>
          </footer>
        </main>

        <FloatingCompanion profile={activeProfile} />
      </div>

      <RewardToast toasts={rewardToasts} onDismiss={onDismissToast} />

      <nav className="mobile-nav" aria-label="Mobiele navigatie">
        <button className={activePage === "home" ? "is-active" : ""} onClick={() => navigate("home")} aria-current={activePage === "home" ? "page" : undefined}>
          <House size={20} weight={activePage === "home" ? "fill" : "regular"} /><span>Home</span>
        </button>
        <button className={activePage === "learn" ? "is-active" : ""} onClick={() => navigate("learn")} aria-current={activePage === "learn" ? "page" : undefined}>
          <BookOpenText size={20} weight={activePage === "learn" ? "fill" : "regular"} /><span>Leren</span>
        </button>
        <button className={activePage === "practice" ? "is-active" : ""} onClick={() => navigate("practice")} aria-current={activePage === "practice" ? "page" : undefined}>
          <ListChecks size={20} weight={activePage === "practice" ? "fill" : "regular"} /><span>Oefenen</span>
        </button>
        <button className={mobileMoreOpen || !isPrimaryMobilePage ? "is-active" : ""} onClick={() => setMobileMoreOpen((open) => !open)} aria-expanded={mobileMoreOpen} aria-controls="mobile-more-menu">
          <DotsThree size={22} /><span>Meer</span>
        </button>
        {mobileMoreOpen && (
          <div className="mobile-more-menu" id="mobile-more-menu">
            <span className="mobile-more-heading">Leren</span>
            <button className={activePage === "test" ? "is-active" : ""} aria-current={activePage === "test" ? "page" : undefined} onClick={() => navigate("test")}><ClipboardText size={18} />Toetsmodus</button>
            <span className="mobile-more-heading">Hulpmiddelen</span>
            <button className={activePage === "titrationlab" ? "is-active" : ""} aria-current={activePage === "titrationlab" ? "page" : undefined} onClick={() => navigate("titrationlab")}><Flask size={18} />TitratieLab</button>
            <button className={activePage === "structurelab" ? "is-active" : ""} aria-current={activePage === "structurelab" ? "page" : undefined} onClick={() => navigate("structurelab")}><Atom size={18} />StructuurLab</button>
            <button className={activePage === "binas" ? "is-active" : ""} aria-current={activePage === "binas" ? "page" : undefined} onClick={() => navigate("binas")}><BookBookmark size={18} />BINAS-wijzer</button>
            <span className="mobile-more-heading">Voortgang</span>
            <button className={activePage === "coverage" ? "is-active" : ""} aria-current={activePage === "coverage" ? "page" : undefined} onClick={() => navigate("coverage")}><Target size={18} />Leerdoelen</button>
            <button className={activePage === "mistakes" ? "is-active" : ""} aria-current={activePage === "mistakes" ? "page" : undefined} onClick={() => navigate("mistakes")}><WarningCircle size={18} />Foutenlog</button>
            <span className="mobile-more-heading">Beloningen</span>
            <button className={activePage === "rewards" ? "is-active" : ""} aria-current={activePage === "rewards" ? "page" : undefined} onClick={() => navigate("rewards")}><Gift size={18} />Beloningen</button>
          </div>
        )}
      </nav>
    </div>
  );
}
