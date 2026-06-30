import { Atom, BookBookmark, BookOpenText, ChartBar, ClipboardText, Flask, Gift, House, ListChecks, Moon, Sun, Target, WarningCircle } from "@phosphor-icons/react";
import { FloatingCompanion } from "./game/FloatingCompanion";
import { PointsBadge } from "./game/PointsBadge";
import { RewardToast, type RewardToastMessage } from "./game/RewardToast";
import { ProfileSwitcher } from "./ProfileSwitcher";
import type { AppPage, LocalProfile, ThemeMode } from "../types";

const navigation: Array<{ id: AppPage; label: string; icon: typeof House }> = [
  { id: "home", label: "Dashboard", icon: House },
  { id: "learn", label: "Leren", icon: BookOpenText },
  { id: "structurelab", label: "StructuurLab", icon: Atom },
  { id: "titrationlab", label: "TitratieLab", icon: Flask },
  { id: "binas", label: "BINAS-wijzer", icon: BookBookmark },
  { id: "coverage", label: "Leerdoelen", icon: Target },
  { id: "practice", label: "Oefenen", icon: ListChecks },
  { id: "test", label: "Toetsmodus", icon: ClipboardText },
  { id: "mistakes", label: "Foutenlog", icon: WarningCircle },
  { id: "rewards", label: "Beloningen", icon: Gift },
];

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
  return (
    <div className="app-shell">
      <aside className="side-rail">
        <button className="brand" onClick={() => onNavigate("home")} aria-label="Naar dashboard">
          <Flask size={29} weight="duotone" />
          <span>
            ChemTrainer
            <br />
            <b>USG</b>
          </span>
        </button>
        <nav className="nav-list" aria-label="Hoofdnavigatie">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-button ${activePage === id ? "is-active" : ""}`} onClick={() => onNavigate(id)}>
              <Icon size={21} weight={activePage === id ? "fill" : "regular"} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="rail-bottom">
          <ChartBar size={18} />
          <span>Modules 4–10</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="kicker">Modules 4–10</span>
            <span className="topbar-dot">•</span>
            <span>Toetsvoorbereiding</span>
          </div>
          <div className="topbar-actions">
            <span className="date-label">VWO / HAVO bovenbouw</span>
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
            <div>
              <strong>ChemTrainer USG</strong>
              <p>Je voortgang wordt lokaal opgeslagen op dit apparaat. Gebruik het profielmenu voor export/import-backups.</p>
            </div>
            <div className="site-footer-links">
              <a href="/over-chemtrainer.html" target="_blank" rel="noreferrer">
                Over ChemTrainer
              </a>
              <a href="/scheikunde-vwo.html" target="_blank" rel="noreferrer">
                Scheikunde VWO
              </a>
              <a href="/voor-docenten.html" target="_blank" rel="noreferrer">
                Voor docenten
              </a>
              <a href="/llms.txt" target="_blank" rel="noreferrer">
                llms.txt
              </a>
            </div>
          </footer>
        </main>

        <FloatingCompanion profile={activeProfile} />
      </div>

      <RewardToast toasts={rewardToasts} onDismiss={onDismissToast} />

      <nav className="mobile-nav" aria-label="Mobiele navigatie">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} className={activePage === id ? "is-active" : ""} onClick={() => onNavigate(id)}>
            <Icon size={20} weight={activePage === id ? "fill" : "regular"} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
