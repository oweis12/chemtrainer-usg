# VISUAL ASSET AUDIT — ChemTrainer USG

Status: voorbereid op rechtenveilige toevoegingen. De bestaande native SVG-diagrammen blijven de actieve fallback totdat een asset in `public/assets/chemtrainer/` bestaat.

## Hoge prioriteit

1. Volledige titratieopstelling met labels — `titratie/titratie-opstelling-callouts.webp`
2. Buretmeniscus op ooghoogte — `titratie/buret-meniscus-ooghoogte.webp`
3. Schellbachstreep-close-up — `titratie/schellbachstreep-detail.webp`
4. Glaswerk spoelen: doen/niet-doen — `titratie/glaswerk-spoelen-do-dont.webp`
5. Titratiestappen — `titratie/titratie-stappen.webp`
6. Gelabeld massaspectrum — `analyse/massaspectrum-m-mplus1-fragment.webp`
7. Transcriptie en translatie — `dna/transcriptie-translatie-stappen.webp`

## Auditregels

- Gebruik alleen zelfgemaakte, gebruikersaangeleverde of rechtenveilige beelden.
- Geen scans, screenshots of letterlijke overnames uit BINAS of lesmethodes.
- Iedere asset krijgt een informatieve alt-tekst en een didactisch bijschrift.
- De volledige, machineleesbare lijst staat in `src/data/visualAssetRegistry.ts`.
