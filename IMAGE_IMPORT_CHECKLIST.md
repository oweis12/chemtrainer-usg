# IMAGE IMPORT CHECKLIST — ChemTrainer USG

Gebruik deze checklist wanneer je rechtenveilige beelden toevoegt aan `public/assets/chemtrainer/`.

## Veiligheidsregels

- Gebruik geen BINAS-scans, toetsbijlage-scans, methodepagina’s of screenshots uit boeken.
- Gebruik alleen zelfgemaakte, gebruikersaangeleverde of aantoonbaar rechtenvrije beelden.
- Laat bestandsnamen exact overeenkomen met:
  - `MISSING_VISUAL_ASSETS.md`
  - `HIGH_PRIORITY_IMAGES_TO_GENERATE.md`
  - `src/data/visualAssetRegistry.ts`
- Zet afbeeldingen onder `public/assets/chemtrainer/...`, niet in `src/`.
- Laat `src/data/visualAssetRegistry.ts` de bron van waarheid blijven.

## Importvolgorde

1. `public/assets/chemtrainer/titratie/titratie-opstelling-callouts.webp`
2. `public/assets/chemtrainer/titratie/buret-meniscus-ooghoogte.webp`
3. `public/assets/chemtrainer/titratie/schellbachstreep-detail.webp`
4. `public/assets/chemtrainer/titratie/titratie-stappen.webp`
5. `public/assets/chemtrainer/analyse/massaspectrum-m-mplus1-fragment.webp`
6. `public/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp`

Batch 1 status: deze 6 bestanden zijn aanwezig. `glaswerk-spoelen-do-dont.webp` is bewust geen verplicht Batch 1-bestand meer; spoelen blijft tekstueel uitgelegd.

## Per bestand controleren

- [ ] Bestand staat in de juiste map.
- [ ] Bestandsnaam is exact gelijk, inclusief hoofdletters, streepjes en extensie.
- [ ] Beeld bevat geen logo’s, watermark, scanranden of bronverwijzingen uit beschermde bronnen.
- [ ] Labels zijn Nederlands en leesbaar op laptop én telefoon.
- [ ] Contrast werkt in light mode en dark mode.
- [ ] Alt-tekst en caption in `visualAssetRegistry.ts` passen nog bij het beeld.
- [ ] Als het echte bestand is geplaatst: zet `status` in `src/data/visualAssetRegistry.ts` op `done`.
- [ ] Run daarna:

```bash
node scripts/validateHintQuality.mjs
node scripts/validateLearningCoverage.mjs
node scripts/validateChemGraph.mjs
npm run build
```

## Statusregels in visualAssetRegistry.ts

- `needs-image`: er is nog geen bestand en ook geen voldoende vervangende losse asset.
- `placeholder`: de app heeft een native SVG/HTML fallback of conceptdiagram, maar er is nog geen los bestand.
- `done`: het echte bestand bestaat fysiek onder `public/assets/chemtrainer/...` en is gecontroleerd.

## Wat externe AI wel/niet mag doen

Wel:

- Alleen losse beeldbestanden of geïsoleerde componentbestanden aanleveren.
- Exacte bestandsnamen gebruiken uit `MISSING_VISUAL_ASSETS.md`.
- Geen routing, globale CSS of vraagdata wijzigen tenzij expliciet gevraagd.

Niet:

- De hele app herstructureren.
- Bestaande vragenbank, officiële oefentoets of leerdoelen overschrijven.
- Afbeeldingen uit BINAS, examens of methodes kopiëren.
