import { Atom, BookBookmark, BookOpenText, ChartBar, ClipboardText, Flask, House, ListChecks, Moon, Sun, Target, WarningCircle } from "@phosphor-icons/react";
import type { AppPage } from "../types";

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
];

interface LayoutProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export function Layout({ activePage, onNavigate, theme, onToggleTheme, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="side-rail">
        <button className="brand" onClick={() => onNavigate("home")} aria-label="Naar dashboard"><Flask size={29} weight="duotone" /><span>ChemTrainer<br /><b>USG</b></span></button>
        <nav className="nav-list" aria-label="Hoofdnavigatie">
          {navigation.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-button ${activePage === id ? "is-active" : ""}`} onClick={() => onNavigate(id)}><Icon size={21} weight={activePage === id ? "fill" : "regular"} /><span>{label}</span></button>)}
        </nav>
        <div className="rail-bottom"><ChartBar size={18} /> <span>Modules 4–10</span></div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div><span className="kicker">Modules 4–10</span><span className="topbar-dot">•</span><span>Toetsvoorbereiding</span></div>
          <div className="topbar-actions"><span className="date-label">VWO / HAVO bovenbouw</span><button className="theme-switch" onClick={onToggleTheme} aria-label="Wissel kleurmodus">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === "light" ? "Donker" : "Licht"}</span></button></div>
        </header>
        <main className="content-area">{children}</main>
      </div>
      <nav className="mobile-nav" aria-label="Mobiele navigatie">
        {navigation.map(({ id, label, icon: Icon }) => <button key={id} className={activePage === id ? "is-active" : ""} onClick={() => onNavigate(id)}><Icon size={20} weight={activePage === id ? "fill" : "regular"} /><span>{label}</span></button>)}
      </nav>
    </div>
  );
}
