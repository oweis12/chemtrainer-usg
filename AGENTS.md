# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable prototype decisions

- Keep the existing light lab-notebook / examenbundel visual language and avoid broad layout redesigns.
- Do not expand generic lessons or the general questions bank unless explicitly asked. Current priority is real SVG structure formulas and the interactive StructuurLab puzzle builder.
- Keep molecule tooling deliberately lightweight and native to React/SVG; no heavy chemistry-editor dependency is wanted for this V1.
- Keep BINAS support as an original reference guide only: show relevant table references and how to use them, never copied table contents, screenshots, or literal table reproductions.
- Current content priority: improve test quality, contextual reasoning and visual interpretation in M10, M8 and M5D before adding broad new features or generic content.
- Keep the light lab-notebook identity intact during future quality passes. Prioritise teacher-aligned coverage, explicit `molmassa` and `molariteit` language, source transparency, and didactic depth over unrelated features.
- For exact chemistry processes such as DNA/transcriptie/translatie, peptidebinding, hydrolyse, redox and titration logic, prefer native React/SVG diagrams first; use static/generated images only for broader illustrative overviews where label precision is less critical.
- New lesson figures should ship with a caption plus a learner-facing explanation block beneath them; question figures should support reasoning without leaking the answer directly in the labels.
- Real images should render as numbered figures with title and caption; do not show “Beeldslot voor latere foto/illustratie” once an image exists.
- TitratieLab should have one clear primary Cloud-scene simulation; setup building belongs behind an optional challenge, not beside a second main interface.
- Procedure steps in TitratieLab should behave as action/feedback cards tied to actual lab state, not as passive checkboxes.
- The Leerdoelen page should be learner-facing first: show what the student must know, which lesson fits, which questions to practise, and personal checklist progress. Developer coverage and visual QA stay clearly separate.
- M6 is foundational for M10 titration and should stay expanded into calm, step-by-step lessons on ionen, hydratatie, zuur-base, pH, names-to-formulas, and the bridge to titration.
- Uitlegvideo's in lessen stay supplementary and curated: maximaal 1 passende Exact wat je zoekt / Sisters in Science-video per les, na de basisuitleg, geen low-confidence/random matches, geen transcripties, en een Exact-link fallback als een YouTube-id niet betrouwbaar is.
- Voor M5D DNA/transcriptie/translatie zijn curated YouTube-video's toegestaan wanneer Exact geen goede match heeft, maar nog steeds maximaal 1 hoofdvideo per les en alleen bij duidelijke inhoudelijke fit.
- Bij M5D DNA -> mRNA -> aminozuurketen-vragen moet BINAS-hulp expliciet blijven: verwijs naar de codontabel/genetische-code-tabel (voor deze koers vaak 117E/G; soms 71E/71G/71J als editie-alias) en zeg daar niet dat BINAS overbodig is.
- Accounts in ChemTrainer blijven lokale profielen in dezelfde browser: geen echte online login, geen backend-auth en duidelijke lokale opslag/backup-tekst.
- SEO-uitbreidingen voor ChemTrainer blijven eerlijk en openbaar: indexeerbare tekstpagina's, duidelijke metadata en geen keyword stuffing, cloaking of verborgen content.
- Gamification blijft ondersteunend en rustig: subtiele punten, streaks, achievements en cosmetische shop-items mogen leren niet overheersen of kinderachtig/chaotisch maken.
