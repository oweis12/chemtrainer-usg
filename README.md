# ChemTrainer USG

Vite + React + TypeScript oefenapp voor scheikunde bovenbouw.

## Lokaal draaien

```bash
npm install
npm run dev
```

## Productiebuild controleren

```bash
npm run build
```

## Schone zip maken zonder schoolbronnen

Gebruik deze command wanneer je het project wilt delen zonder `node_modules`, `dist`, `reference` of oude zipbestanden:

```bash
zip -r chemtrainer-clean.zip src public package.json package-lock.json index.html vite.config.mjs tsconfig.json tsconfig.app.json tsconfig.node.json AGENTS.md design-qa.md NIGHTLY_REPORT.md HIGH_PRIORITY_IMAGES_TO_GENERATE.md VISUAL_ASSET_AUDIT.md README.md -x "node_modules/*" "dist/*" "reference/*" "__MACOSX/*" "*.zip"
```

Let op: bestanden in `reference/` bevatten schooldocumenten en horen niet publiek op GitHub.
