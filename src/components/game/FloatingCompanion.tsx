import type { LocalProfile } from "../../types";
import { shopItemMap } from "../../data/shopItems";

function equipped(profile: LocalProfile, slot: "pet" | "effect" | "theme") {
  return profile.game.equippedItemIds.find((itemId) => shopItemMap[itemId]?.cosmeticSlot === slot);
}

export function FloatingCompanion({ profile }: { profile: LocalProfile }) {
  if (profile.game.companionHidden) return null;
  const petId = equipped(profile, "pet");
  if (!petId) return null;
  const effectId = equipped(profile, "effect");
  const themeId = equipped(profile, "theme");

  return (
    <div
      className={`floating-companion pet-${petId} ${effectId ? `effect-${effectId}` : ""} ${themeId ? `theme-${themeId}` : ""}`}
      aria-hidden="true"
    >
      <div className="floating-companion-core">
        {petId === "pet-beaker" && <span className="pet-beaker-shape"><i /></span>}
        {petId === "pet-atom" && <span className="pet-atom-shape"><i /><i /><i /></span>}
        {petId === "pet-flame" && <span className="pet-flame-shape" />}
      </div>
      {effectId === "trail-bubbles" && <div className="companion-bubbles"><i /><i /><i /></div>}
      {effectId === "confetti-small" && <div className="companion-confetti"><i /><i /><i /></div>}
    </div>
  );
}
