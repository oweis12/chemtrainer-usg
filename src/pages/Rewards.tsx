import { ShieldCheck, Sparkle, TrendUp } from "@phosphor-icons/react";
import { ShopPanel } from "../components/game/ShopPanel";
import type { LocalProfile } from "../types";

const achievementLabels: Record<string, string> = {
  "first-lesson": "Eerste les afgerond",
  "ten-correct": "10 vragen goed beantwoord",
  "twentyfive-correct": "25 vragen goed beantwoord",
  "first-titration-correct": "Eerste titratievraag goed",
  "streak-5": "5-daagse leerstreak",
};

function achievementText(id: string) {
  if (achievementLabels[id]) return achievementLabels[id];
  if (id.startsWith("module-complete-")) return `Alle lessen van ${id.replace("module-complete-", "")} afgerond`;
  return id;
}

export function Rewards({
  profile,
  onPurchase,
  onToggleEquip,
  onToggleCompanion,
}: {
  profile: LocalProfile;
  onPurchase: (itemId: string) => void;
  onToggleEquip: (itemId: string) => void;
  onToggleCompanion: (hidden: boolean) => void;
}) {
  return (
    <div className="rewards-page">
      <section className="page-intro intro-inline">
        <div>
          <span className="section-kicker">Beloningen</span>
          <h1>Rustige gamification die het leren ondersteunt.</h1>
          <p>Verdien punten met lessen, oefenvragen en streaks. Koop daarna alleen lokale, cosmetische extra's.</p>
        </div>
        <div className="rewards-stats">
          <div>
            <Sparkle size={22} weight="duotone" />
            <strong>{profile.game.points}</strong>
            <span>beschikbare punten</span>
          </div>
          <div>
            <TrendUp size={22} weight="duotone" />
            <strong>Level {profile.game.level}</strong>
            <span>{profile.game.streakDays}-daagse streak</span>
          </div>
        </div>
      </section>

      <section className="privacy-panel">
        <ShieldCheck size={22} weight="duotone" />
        <p>
          Je voortgang, punten en beloningen worden lokaal opgeslagen in deze browser. Er is geen online account en er
          worden geen wachtwoorden opgeslagen. Als je browserdata wist, kan voortgang verdwijnen. Gebruik export/import
          om een backup te maken.
        </p>
      </section>

      <section className="reward-settings">
        <div className="section-title-row">
          <div>
            <span className="section-kicker">Companion</span>
            <h2>Cosmetische weergave</h2>
          </div>
        </div>
        <button className="ghost-button" onClick={() => onToggleCompanion(!profile.game.companionHidden)}>
          {profile.game.companionHidden ? "Companion weer tonen" : "Companion verbergen"}
        </button>
      </section>

      <ShopPanel game={profile.game} onPurchase={onPurchase} onToggleEquip={onToggleEquip} />

      <section className="rewards-bottom-grid">
        <div className="achievement-panel panel-lined">
          <div className="section-title-row">
            <div>
              <span className="section-kicker">Achievements</span>
              <h2>Behaald</h2>
            </div>
          </div>
          {profile.game.achievements.length ? (
            <div className="achievement-list">
              {profile.game.achievements.map((achievementId) => (
                <div className="achievement-row" key={achievementId}>
                  <strong>{achievementText(achievementId)}</strong>
                  <span>eenmalig ontgrendeld</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Nog geen achievements vrijgespeeld. Begin met een les en een paar oefenvragen.</p>
          )}
        </div>

        <div className="activity-panel panel-lined">
          <div className="section-title-row">
            <div>
              <span className="section-kicker">Puntenlog</span>
              <h2>Recente activiteit</h2>
            </div>
          </div>
          {profile.game.eventLog.length ? (
            <div className="reward-log">
              {profile.game.eventLog.map((event) => (
                <div className="reward-log-row" key={event.id}>
                  <div>
                    <strong>{event.label}</strong>
                    <small>{new Date(event.createdAt).toLocaleDateString("nl-NL", { day: "2-digit", month: "short" })}</small>
                  </div>
                  <span className={event.points >= 0 ? "good-chip" : "wait-chip"}>
                    {event.points >= 0 ? `+${event.points}` : `${event.points}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Je puntenlog verschijnt zodra je lessen afrondt of vragen goed beantwoordt.</p>
          )}
        </div>
      </section>
    </div>
  );
}
