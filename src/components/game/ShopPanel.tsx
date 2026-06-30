import { CheckCircle, Lock, ShoppingCartSimple } from "@phosphor-icons/react";
import { shopItems } from "../../data/shopItems";
import type { GameState, ShopItemCategory } from "../../types";

const categories: Array<{ id: ShopItemCategory; label: string }> = [
  { id: "pets", label: "Companions" },
  { id: "badges", label: "Badges" },
  { id: "themes", label: "Thema's" },
  { id: "effects", label: "Effecten" },
  { id: "avatars", label: "Avatars" },
];

export function ShopPanel({
  game,
  onPurchase,
  onToggleEquip,
}: {
  game: GameState;
  onPurchase: (itemId: string) => void;
  onToggleEquip: (itemId: string) => void;
}) {
  return (
    <div className="shop-panel">
      {categories.map((category) => {
        const items = shopItems.filter((item) => item.category === category.id);
        if (!items.length) return null;
        return (
          <section className="shop-category" key={category.id}>
            <div className="section-title-row">
              <div>
                <span className="section-kicker">Shop</span>
                <h2>{category.label}</h2>
              </div>
            </div>
            <div className="shop-grid">
              {items.map((item) => {
                const unlocked = game.unlockedItemIds.includes(item.id);
                const equipped = game.equippedItemIds.includes(item.id);
                const affordable = game.points >= item.price;
                return (
                  <article className={`shop-card shop-${item.accent}`} key={item.id}>
                    <div className="shop-card-head">
                      <span className="shop-chip">{item.shortLabel}</span>
                      <strong>{item.price === 0 ? "Start" : `${item.price} p`}</strong>
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="shop-card-foot">
                      {!unlocked ? (
                        <button className="secondary-button" disabled={!affordable} onClick={() => onPurchase(item.id)}>
                          {affordable ? <ShoppingCartSimple size={17} /> : <Lock size={17} />}
                          {affordable ? "Kopen" : "Spaar door"}
                        </button>
                      ) : (
                        <button className={equipped ? "ghost-button" : "secondary-button"} onClick={() => onToggleEquip(item.id)}>
                          <CheckCircle size={17} weight={equipped ? "fill" : "regular"} />
                          {equipped ? "Uitgerust" : "Uitrusten"}
                        </button>
                      )}
                      <span className={equipped ? "good-chip" : unlocked ? "wait-chip" : "weak-chip"}>
                        {equipped ? "uitgerust" : unlocked ? "gekocht" : "locked"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
