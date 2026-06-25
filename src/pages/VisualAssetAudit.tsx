import { ImageSquare, Sparkle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { highPriorityVisuals, visualAssetRegistry } from "../data/visualAssetRegistry";
import type { ModuleId } from "../types";

export function VisualAssetAudit() {
  const [module, setModule] = useState<ModuleId | "all">("all");
  const assets = useMemo(() => visualAssetRegistry.filter((asset) => module === "all" || asset.module === module), [module]);
  const [filePresence, setFilePresence] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    Promise.all(assets.map(async (asset) => {
      if (!asset.path) return [asset.id, false] as const;
      try {
        const response = await fetch(asset.path, { method: "HEAD" });
        return [asset.id, response.ok] as const;
      } catch {
        return [asset.id, false] as const;
      }
    })).then((entries) => {
      if (active) setFilePresence(Object.fromEntries(entries));
    });
    return () => { active = false; };
  }, [assets]);

  const resolvedStatus = (assetStatus: string, present: boolean) => {
    if (assetStatus === "done" && present) return "done";
    if (assetStatus === "placeholder") return "placeholder";
    return "needs-image";
  };

  const grouped = {
    ready: assets.filter((asset) => asset.status === "done" && filePresence[asset.id]),
    needsImage: assets.filter((asset) => asset.status === "needs-image"),
    placeholder: assets.filter((asset) => asset.status === "placeholder"),
    mismatch: assets.filter((asset) => asset.status === "done" && !filePresence[asset.id]),
  };

  const renderCard = (asset: typeof assets[number]) => {
    const present = Boolean(filePresence[asset.id]);
    const status = resolvedStatus(asset.status, present);
    return (
      <article key={asset.id} className="visual-audit-card">
        <header>
          <span>{asset.module}</span>
          <span className={`priority priority-${asset.priority}`}>{asset.priority}</span>
          <span className={`status status-${status}`}>{status}</span>
          <span>{present ? "bestand: ja" : "bestand: nee"}</span>
        </header>
        <h2>{asset.topic}</h2>
        <p><b>Nu:</b> {asset.currentProblem}</p>
        <p><b>Gewenst:</b> {asset.desiredVisual}</p>
        <dl>
          <div><dt>Bestand</dt><dd>{asset.proposedFilename}</dd></div>
          <div><dt>Type</dt><dd>{asset.type}</dd></div>
          <div><dt>Alt-tekst</dt><dd>{asset.alt}</dd></div>
        </dl>
        <details>
          <summary>Prompt en gebruiksnotitie</summary>
          <p>{asset.prompt}</p>
          <p>{asset.caption}</p>
        </details>
      </article>
    );
  };

  return (
    <div className="visual-audit-page">
      <section className="page-intro">
        <span className="section-kicker">Visuele audit</span>
        <h1>Beelden die nog leerwinst kunnen geven.</h1>
        <p>Deze lijst vervangt geen bestaande veilige SVG’s. Hij bewaakt welke foto’s, stappenplaten en structuurbeelden later rechtenveilig mogen worden toegevoegd.</p>
      </section>

      <section className="visual-audit-summary">
        <div><Sparkle size={24} weight="fill" /><strong>{visualAssetRegistry.length}</strong><span>totaal aantal visual audit items</span></div>
        <div><ImageSquare size={24} /><strong>{highPriorityVisuals.length}</strong><span>hoge prioriteit</span></div>
        <div><strong>{grouped.ready.length}</strong><span>done</span></div>
        <div><strong>{grouped.placeholder.length}</strong><span>placeholder</span></div>
        <div><strong>{grouped.needsImage.length}</strong><span>needs-image</span></div>
        <div><strong>{grouped.mismatch.length}</strong><span>status-fout</span></div>
      </section>

      <label className="visual-module-filter">Module
        <select value={module} onChange={(event) => setModule(event.target.value as ModuleId | "all")}>
          <option value="all">Alle modules</option>
          {(["M4", "M5D", "M6", "M7", "M8", "M9", "M10"] as ModuleId[]).map((id) => <option key={id} value={id}>{id}</option>)}
        </select>
      </label>

      <section className="visual-audit-section">
        <h2>Batch 1 toegevoegd</h2>
        <div className="visual-audit-list">{grouped.ready.filter((asset) => ["visual-titration-setup", "visual-titration-meniscus", "visual-titration-schellbach", "visual-titration-steps", "visual-dna-expression", "visual-ms-spectrum"].includes(asset.id)).map(renderCard)}</div>
      </section>

      <section className="visual-audit-section">
        <h2>Nieuwe visuals toegevoegd</h2>
        <div className="visual-audit-list">{grouped.ready.filter((asset) => !["visual-titration-setup", "visual-titration-meniscus", "visual-titration-schellbach", "visual-titration-steps", "visual-dna-expression", "visual-ms-spectrum"].includes(asset.id)).map(renderCard)}</div>
      </section>

      <section className="visual-audit-section">
        <h2>Nog te maken later</h2>
        <div className="visual-audit-list">
          {[...grouped.placeholder, ...grouped.needsImage].map(renderCard)}
        </div>
      </section>

      {grouped.mismatch.length > 0 && (
        <section className="visual-audit-section">
          <h2>Status-fouten</h2>
          <div className="visual-audit-list">{grouped.mismatch.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
}
