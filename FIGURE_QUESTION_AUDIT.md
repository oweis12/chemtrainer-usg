# FIGURE QUESTION AUDIT

## Samenvatting
- Focus: M8, M10, M6, M9 en officiële oefentoetsen met figuren.
- Gecontroleerd: vragen met `visual`, bronfiguren in `figureQuestions`, prioriteitsvragen met spectrum/chromatogram/titratiebeeld en officiële toetsfiguren.
- Hoofdingreep: algemene titratieopstellingen zijn uit berekenvragen gehaald of vervangen door meetdata/flow/verdunningsschema. GC/MS-oefenvragen gebruiken nu native oefendiagrammen zonder antwoord-lekkende labels waar dat nodig is.
- Vervolg-QA: `validateFigureQuestionQuality` is teruggebracht van 65 waarschuwingen naar 0 waarschuwingen.

## Audit Per Vraag

| Vraag id | Module | Vraagtekst verkort | Visual | Oordeel | Actie |
|---|---|---|---|---|---|
| priority-m10-01 | M10 | begin/eindstand buret berekenen | QuestionTitrationDataFigure | goed | herschreven, behouden |
| priority-m10-04 | M10 | mL niet naar L omzetten | geen visual | decoratief risico opgelost | visual verwijderd |
| priority-m10-05 | M10 | titratiestappen volgorde | QuestionTitrationDataFigure flow | goed | visual vervangen |
| priority-m10-06 | M10 | azijnzuur molariteit | geen visual | decoratief risico opgelost | visual verwijderd, antwoord uitgebreid |
| priority-m10-07 | M10 | H2SO4 molariteit | geen visual | decoratief risico opgelost | visual verwijderd, antwoord uitgebreid |
| priority-m10-08 | M10 | concordante waarden | geen visual | goed | decoratieve buret verwijderd |
| priority-m10-09 | M10 | buret nat met demiwater | geen visual | goed | decoratieve setup verwijderd |
| priority-m10-10 | M10 | beginstand te laag | geen visual | goed | decoratieve beginstand verwijderd |
| priority-m10-11 | M10 | massa% CH3COOH | geen visual | goed | decoratieve setup verwijderd |
| priority-m10-12 | M10 | significantie buret | geen visual | goed | decoratieve setup verwijderd |
| priority-m10-13 | M10 | equivalentiepunt/eindpunt | geen visual | goed | decoratieve setup verwijderd |
| priority-m10-14 | M10 | natuurazijn verdunnen/titreren | QuestionTitrationDataFigure dilution | goed | algemene opstelling vervangen |
| priority-m10-15 | M10 | blanco-correctie | geen visual | goed | decoratieve buret verwijderd |
| figure-m10-01 | M10 | meniscus aflezen | echte meniscusfiguur | goed | behouden |
| figure-m10-02 | M10 | Schellbachstreep | echte Schellbachfiguur | goed | behouden |
| figure-m10-03 | M10 | titratiestappen | titratiestappenfiguur | goed | behouden |
| figure-m8-01 | M8 | basispiek en M-piek | QuestionMassSpectrum | goed | antwoord-lekkende labels vervangen |
| figure-m8-02 | M8 | M+2 3:1 | QuestionMassSpectrum chlorine | goed | native oefenspectrum gebruikt |
| figure-m8-03 | M8 | fragment als basispiek | QuestionMassSpectrum | goed | native oefenspectrum gebruikt |
| figure-m8-04 | M8 | M+2 chloor/broom | QuestionMassSpectrum bromine | goed | lesfiguur vervangen door oefenspectrum |
| figure-m8-05 | M8 | aantal GC-componenten | QuestionGcChromatogram | goed | antwoord-lekkende componentlabels verwijderd |
| priority-m8-01 | M8 | basispiek en M-piek | QuestionMassSpectrum | goed | modelantwoord uitgebreid |
| priority-m8-02 | M8 | M+1 en C-atomen | QuestionMassSpectrum carbon | goed | modelantwoord uitgebreid |
| priority-m8-08 | M8 | retentietijd verklaren | QuestionGcChromatogram | goed | gelabeld GC-schema vervangen |
| priority-m8-10 | M8 | IR C=O | geen visual | decoratief risico opgelost | misplaatste MS-visual verwijderd |
| priority-m8-14 | M8 | M, M+1 en basispiek combineren | QuestionMassSpectrum carbon | goed | antwoord uitgebreid |
| figure-m6-01 | M6 | protonoverdracht | zuur-base figuur | goed | behouden |
| figure-m6-02 | M6 | sterk/zwak vs geconcentreerd/verdund | begripsfiguur | goed | behouden als uitlegvraag |
| figure-m6-03 | M6 | NaCl(aq) geleiding | hydratatiefiguur | goed | behouden |
| figure-m9-01 | M9 | waterstofbrug vs dipool | krachtenfiguur | goed | behouden |
| figure-m5d-01 | M5D | codon en translatie | transcriptie/translatiefiguur | goed | behouden |
| figure-m5d-02 | M5D | DNA-verandering naar enzymwerking | transcriptie/translatiefiguur | goed | behouden |
| official-09 | M5D | asparagusinezuur structuur | native structuurdiagram | goed | behouden |
| official-10 | M5D | ethylester tekenen | native reactieschema | goed | behouden |
| official-18 | M9 | cellulose waterstofbruggen | native cellulose-schema | goed | behouden |
| official-22 | M9 | Ca2+ hydratatie | native hydratatieschema | goed | behouden |

## Acties Uitgevoerd
- Decoratieve titratieopstellingen verwijderd bij berekeningen.
- Antwoord-lekkende GC-labels vervangen door onlabeld oefenchromatogram.
- Lesfiguur voor M+2 vervangen door configureerbaar oefenmassaspectrum waar de vraag om interpretatie vraagt.
- Modelantwoorden bij M8/M10 uitgebreid met eindantwoord, gegevens, stappen en chemische verklaring.
- `purpose` toegevoegd aan nieuwe oefenvisuals zodat de validator figuurdoel kan controleren.
- `purpose` toegevoegd aan resterende actieve bronvisuals, coverage-QA en officiële oefentoetsfiguren.
- Verouderde duplicate replacements verwijderd; `qualityReplacementQuestions` heeft nu 68 unieke records en 0 orphan IDs.

## Nog Later
- Enkele lesfiguren zijn bewust behouden in conceptuele figuurvragen omdat de vraag om uitleg vraagt, niet om blind tellen.
- Verdere inhoudelijke verfijning kan later per module, maar de huidige figuurwarning-validator geeft geen open waarschuwingen meer.
