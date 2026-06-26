# NIGHTLY REPORT — ChemTrainer USG

Datum: 2026-06-26

## Aanvulling 2026-06-26: uitlegvideo's gekoppeld aan lessen

LESSON VIDEO MAPPING REPORT

- Aangepaste bestanden: `AGENTS.md`, `VIDEO_MAPPING_AUDIT.md`, `NIGHTLY_REPORT.md`, `src/data/lessonVideoRegistry.ts`, `src/components/content/LessonVideoCard.tsx`, `src/data/lessons.ts`, `src/types/index.ts`, `src/pages/Learn.tsx`, `src/styles.css`, `scripts/auditLessonVideos.mjs`. Daarnaast twee kleine bestaande diagram-compilefixes: `RutherfordScatteringDiagram.tsx` en `BondPolarityDiagram.tsx`.
- Video registry toegevoegd: ja, met eigen samenvattingen, bronlinks, confidence, gekoppelde modules/lessen en betrouwbaar gevonden YouTube IDs.
- LessonVideoCard toegevoegd: ja, compact, zonder autoplay, met lazy `youtube-nocookie` embed en Exact-link fallback.
- Aantal video's in registry: 34.
- Aantal lessen met high/medium confidence video: 39.
- Aantal lessen zonder goede video: 23.
- YouTube IDs gevonden: 34, allemaal rechtstreeks gecontroleerd op de Exact-pagina's.
- Exact-link fallback gebruikt: 0 actieve fallbackkaarten; fallback blijft aanwezig voor toekomstige bronnen zonder betrouwbare ID.
- Modules met video's: M4, M6, M7, M8, M9 en M10.
- M5D niet geforceerd: ja.
- Validators: `auditLessonVideos`, `validateFigureQuestionQuality`, `validateHintQuality`, `validateLearningCoverage` en `validateChemGraph` groen.
- Build: groen met `npm run build`.
- Wat bewust niet aangepast: geen TitrationLab-animaties, geen `ProcedureActionPreview`, geen MassSpectrometryLab, geen AI tutor/backend/accounts, geen grote redesign, geen transcripties of overgenomen videoteksten.
- Handmatige test voor Oweis: open M4 mol/molariteit, M6 pH/H3O+/zouten, M7 redox/Daniellcel, M8 atoommodellen, M9 polariteit/intermoleculaire krachten en M10 pH/evenwicht/groene chemie/titratierekenen; controleer ook mobiel en lessen zonder match.
- STOP

## Bronnen van deze ronde

Deze ronde gebruikte de beschikbare docentbronnen in `reference/`:

- `leerdoelen kwintaal 4 5 2026 klas 5.docx`
- `M8-9-10(titratie) Oefentoets klas 5 5e kwintaal.docx`
- voorbeeldantwoorden voor M5D en M10
- de aanwezige M8- en M9-modulebestanden

De docx-renderer kon in deze omgeving geen PNG-voorvertoning maken door een ontbrekende `pdf2image`-module. De inhoud is daarom gecontroleerd via de documenttekst en de bronstructuur. Dit blokkeerde de appimplementatie niet.

## Leerdoelen: van 21 breed naar 100 toetsbare subleerdoelen

| Module | Oude brede doelen | Nieuwe subleerdoelen |
| --- | ---: | ---: |
| M4 | 3 | 6 |
| M5D | 3 | 15 |
| M6 | 2 | 11 |
| M7 | 3 | 4 |
| M8 | 3 | 15 |
| M9 | 3 | 22 |
| M10 | 4 | 27 |
| **Totaal** | **21** | **100** |

Elk subleerdoel heeft minimaal één les en twee inhoudelijk passende oefenvragen. M10 is opgesplitst in onder meer elektrochemische cel, brandstofcel, concentratiecel, duurzaamheid, K-uitdrukkingen, zuur-base, buret aflezen, Schellbachstreep, indicator, glaswerk conditioneren, titratierekenen, massapercentage, uitschieters en titratiefouten. M5D bevat nu losse doelen voor peptidebinding, hydrolyse, nucleotide, DNA-basen, DNA/RNA, transcriptie, translatie, codontabel, eiwitstructuur en denaturatie. M8 en M9 zijn op dezelfde manier verfijnd.

## Aanvulling 2026-06-26: M8 atoommodellen en Oefenen UX

- Toegevoegd: twee M8-lessen, `m8-atoommodellen-thomson-rutherford` en `m8-atoommodel-tekenen`.
- Toegevoegd: native `AtomicModelsDiagram` met varianten `thomson`, `rutherford`, `bohr`, `goldFoil` en `drawingGuide`.
- Toegevoegd: 10 gerichte M8-vragen over Thomson/Rutherford, goudfolie, Rutherford tekenen, Bohr/schillenmodel, isotopen, ionen en model-waarneming.
- Oefenen is rustiger gemaakt met snelle startkaarten voor basis, toetsniveau en fouten opnieuw; modulefilter blijft direct zichtbaar, onderwerp/vaardigheid/niveau zitten achter “Geavanceerde filters”.
- Vraagfeedback is opgesplitst in Eindantwoord, Stappen, Waarom dit klopt en Veelgemaakte fout / tip. BINAS-hulp verschijnt bij oefenvragen alleen nog wanneer er relevante verwijzingen zijn.
- Validatie: figure question quality 0 waarschuwingen; hint quality 522 vragen / 1501 vraag-specifieke hints / 0 verboden generieke-only hints; learning coverage 100 subleerdoelen; ChemGraph groen; build groen.

## Aanvulling 2026-06-26: lesson depth, diagram clarity en BINAS

- Toegevoegd: `DIAGRAM_READABILITY_AUDIT.md` met component/les, probleemtype, actie en status per native diagramfamilie.
- Toegevoegd: `LESSON_COMPLETENESS_AUDIT.md` met per les de status voor kernuitleg, examengerichte aanpak, figuurinterpretatie, BINAS en afsluiting.
- Toegevoegd: `src/components/content/BinasReferenceBox.tsx` voor zichtbare lesniveau-BINAS-verwijzingen zonder tabelinhoud over te nemen.
- Toegevoegd: `src/components/content/FigureExplanationBlock.tsx` plus een afsluitend lesblok, zodat leerlingen na een figuur zien wat het figuur toont, wat de conclusie is en hoe dit op de toets terugkomt.
- Toegevoegd: `BondPolarityDiagram` voor H-H, H-Cl, elektronegativiteitsbeslissing en molecuulpolariteit. De uitleg over gedeelde elektronen, δ+ / δ− en schoolgrenzen staat nu buiten het SVG.
- Toegevoegd: `RutherfordScatteringDiagram` voor goudfolievragen. Het diagram onderscheidt alfa-bron, goudfolie, meeste rechtdoor, enkele afgebogen en heel weinig sterk terug.
- Verbeterd: M9 polariteit, M8 Rutherford/atoommodellen, M4 mol/molariteit, M7 redox/BINAS 48, M8 MS/GC-MS en M10 titratie/indicatoren met explicietere BINAS- en toetsaanpak.
- Nieuwe vragen: 8 gerichte examenvragen (`m7-16`, `m7-17`, `m8-26`, `m8-27`, `m9-52`, `m9-53`, `m10-58`, `m10-59`).
- Validatie: figure question quality 437 vraagblokken / 58 visuals / 0 waarschuwingen; hint quality 522 vragen / 1501 vraag-specifieke hints / 0 verboden generieke-only hints; learning coverage groen; ChemGraph groen; build groen met alleen de bestaande Vite chunk-size waarschuwing.

## Officiële oefentoets

- **25 officiële toetsvragen toegevoegd**, in de oorspronkelijke volgorde.
- **51 punten** in totaal; de puntentoekenning staat zichtbaar bij iedere vraag.
- Elke vraag heeft module/onderwerp, antwoordtype, modelantwoord, rubric, uitleg en waar relevant BINAS-hulp via de bestaande hulpknop.
- Lange contextpassages uit de bron zijn compact geparafraseerd voor een zelfstandige appopgave. Volgorde, punten en getoetste vaardigheid zijn behouden; de app kopieert geen hele bronpassages of uitwerkbijlagen.

De officiële toets is nu startbaar als aparte toetsmodus en geeft, net als andere toetsmodi, geen directe feedback.

## Harde vraagbank-audit en echte vervangingen

De actieve vragenbank overschrijft de onderstaande oude vraag-ID's met nieuwe, toetswaardige records. Oude tekst blijft niet naast de vervanging in de gebruikersflow bestaan.

| Module | Vervangen | Verwijderd uit actieve bank | Nieuwe nadruk |
| --- | ---: | --- | --- |
| M10 | 20 | `m10-01` t/m `m10-20` | buret, Schellbach, molariteit, molverhouding, massa-aandeel, pH, indicator, verdunnen, uitschieters, systematische fout |
| M8 | 15 | `priority-m8-01` t/m `priority-m8-15` | pseudo-spectra, M/M+1/M+2, fragmentatie, GC, GC-MS, IR, NMR, BINAS 39D |
| M5D | 15 | `priority-m5d-01` t/m `priority-m5d-15` | peptidebinding, hydrolyse, nucleotide, transcriptie, translatie, eiwitstructuur, denaturatie, polymerisatie |

Totaal zijn **50 actieve vragen echt vervangen**. Daarnaast houdt M10 voor iedere rekenvraag zonder eigen stappen alsnog een zichtbaar standaard-stappenplan in de actieve vraagdata. De validator controleert deze borging.

## Notatie en didactiek

- Vraagteksten gebruiken `molmassa`, niet `M = ...` voor molmassa.
- `molariteit` is de voorkeursformulering bij mol/L.
- Verboden cryptische formuleringen zoals `Bereken c(...)`, `Bereken n(...)` en `Bereken massa%` komen niet meer voor.
- M10-berekeningen tonen formule, invullen, eenheden en eindantwoord/stappenplan.
- M8-spectrumvragen hebben modeluitleg; M5D-DNA-vragen hebben rubric en modelantwoord via de vraagfactories.

## Visuals

- `VISUAL_ASSET_AUDIT.md` bevat **23** audititems.
- Nieuw: `HIGH_PRIORITY_IMAGES_TO_GENERATE.md` met per item bestandsnaam, plek in de app, formaat, labels, alt-tekst en exacte image prompt.
- Nieuw: vier rechtenveilige SVG-schema’s voor officiële oefentoetsvragen: asparagusinezuur, ethylestervorming, cellulose-waterstofbruggen en Ca²⁺-hydratatie.
- Batch 1 is nu geïmporteerd: zes rechtenveilige `.webp`-beelden bestaan fysiek onder `public/assets/chemtrainer/`.
- Glaswerk spoelen is bewust geen verplicht beeld meer in Batch 1. De toetsregel blijft als duidelijke tekst in de M10-les en TitratieLab-uitleg aanwezig.
- De hoge-prioriteit-assetlijst bevat nu zes afgeronde beelden: titratieopstelling, meniscus, Schellbachstreep, titratiestappen, massaspectrum en transcriptie/translatie.

## Vervolg-QA beeldassets en TitratieLab V1

Deze ronde is bewust geen algemene contentuitbreiding geweest. De focus lag op QA, beeldasset-consistentie en een eerste titratiepracticum-simulatie.

### Beeldasset-QA

- Nieuw/geüpdatet: `MISSING_VISUAL_ASSETS.md` met per asset: assetId, module, onderwerp, prioriteit, exact pad onder `public/assets/chemtrainer/`, fysieke bestandsstatus, huidige status, gebruiksplek, gewenste inhoud, labels, alt, caption, prompt, aanbevolen formaat en type.
- Nieuw/geüpdatet: `IMAGE_IMPORT_CHECKLIST.md` met importregels en exacte bestandsnamen voor de hoogste prioriteit.
- `src/data/visualAssetRegistry.ts` is geharmoniseerd met de rapporten: paden en voorgestelde bestandsnamen verwijzen nu consequent naar `public/assets/chemtrainer/...`.
- Belangrijk onderscheid: assets die als `done` staan, bestaan nu fysiek als bestand of zijn native app-SVG/diagrammen; ontbrekende latere beelden blijven `placeholder` of `needs-image`.
- Huidige fysieke Batch 1-status:
  1. `public/assets/chemtrainer/titratie/titratie-opstelling-callouts.webp` — aanwezig en gebruikt.
  2. `public/assets/chemtrainer/titratie/buret-meniscus-ooghoogte.webp` — aanwezig en gebruikt.
  3. `public/assets/chemtrainer/titratie/schellbachstreep-detail.webp` — aanwezig en gebruikt.
  4. `public/assets/chemtrainer/titratie/titratie-stappen.webp` — aanwezig en gebruikt.
  5. `public/assets/chemtrainer/analyse/massaspectrum-m-mplus1-fragment.webp` — aanwezig en gebruikt.
  6. `public/assets/chemtrainer/dna/transcriptie-translatie-stappen.webp` — aanwezig en gebruikt.
- Glaswerk spoelen/conditioneren is verlaagd naar lage prioriteit en blijft tekstuele toetsstof: buret spoelen met titrant, pipet met monsteroplossing, erlenmeyer mag met demiwater.
- Volgende visuele maakvolgorde: losse labmaterialen, structuurformules, hydratatie/ion-dipool, redox-elektronenroute, composieten en GC-chromatogram.

### Asparagusinezuurdiagram

- `src/components/diagrams/OfficialExamDiagrams.tsx` is aangepast voor de asparagusinezuur-SVG:
  - twee S-labels staan nu los van de ringpunten;
  - de oude carbon-dot op de sulfurpositie is verwijderd;
  - ringbindingen lopen niet meer door de S-labels heen;
  - labelachtergrondjes (`atom-label-back`) maken de letters leesbaar op licht en donker.
- `src/styles.css` gebruikt nu theme-aware kleuren voor `.structure-atom-text.sulfur` en het labelachtergrondje.
- Browsercheck: officiële oefentoets vraag 9 rendert met twee S-labels, twee labelachtergrondjes en geen console-errors. Donkere modus gaf `rgb(232, 227, 215)` voor de S-labels; lichte modus gaf `rgb(23, 36, 58)`.

### TitratieLab V1

Toegevoegd:

- `src/pages/TitrationLab.tsx`
- `src/data/titrationSimulations.ts`
- `src/features/titrationLab/titrationEngine.ts`
- `src/features/titrationLab/CONTRACT.md`
- `AI_HANDOFF_TITRATIONLAB.md`
- `src/components/titration/LabBench.tsx`
- `src/components/titration/Burette.tsx`
- `src/components/titration/Erlenmeyer.tsx`
- `src/components/titration/Pipette.tsx`
- `src/components/titration/IndicatorBottle.tsx`
- `src/components/titration/ValveControl.tsx`
- `src/components/titration/TitrationSetup.tsx`
- `src/components/titration/TitrationStepPanel.tsx`
- `src/components/titration/BuretteReadingPanel.tsx`
- `src/components/titration/TitrationCalculationPanel.tsx`
- `src/components/titration/TitrationFeedbackPanel.tsx`

Functionaliteit:

- Nieuwe nav-route: **TitratieLab**.
- Extra ingang vanuit M10-lessen over titratie.
- Extra kaart in Oefenen: **TitratieLab oefenen**.
- Vijf simulaties in `titrationSimulations.ts`, waaronder azijnzuur/NaOH, zoutzuur/NaOH, natronloog/HCl, massa-aandeel azijnzuur en meerdere metingen/gemiddelde.
- 2D labscene met buret, schaalverdeling, stopkraan, druppels, erlenmeyer, vloeistofkleur, pipet, indicatorflesje, statief en witte tegel.
- Opstelling bouwen met klikbare onderdelen: statief, buret, kraantje, erlenmeyer, pipet en indicator.
- Procedurecheck met waarschuwingen voor spoelen, pipetteren, indicator, beginstand, langzaam titreren, stoppen bij eindpunt en eindstand.
- Kraantje met standen `dicht`, `langzaam`, `normaal`, `snel`.
- Verborgen equivalentievolume: de leerling ziet het doelvolume niet tijdens het titreren.
- Eindpuntgedrag voor fenolftaleïne: kleurloos → bijna lichtroze → blijvend lichtroze → te fel/donkerroze.
- Buretaflezing met beginstand, eindstand, onderkant meniscus, ooghoogte, decimalen en Schellbach-keuze.
- Berekenpaneel gebruikt eigen gemeten volume en accepteert kommagetallen en eenvoudige wetenschappelijke notatie.
- Score op opstelling, procedure, titratienauwkeurigheid, aflezen, berekening en eindantwoord.
- LocalStorage voor TitratieLab: afgeronde simulaties, beste afwijking, gemiddelde score, veelgemaakte fouten en laatste simulatie.
- AI-handoffdocumentatie borgt: scene = draw/interact only, engine = endpoint/kleur/volume/fouten, pagina = data/state/scoring/localStorage.

Browsercheck TitratieLab:

- Mobiele viewport: TitratieLab-route bereikbaar via bottom-nav.
- Scene rendert met buret, erlenmeyer en kraantje.
- Kraantje “langzaam” laat druppels zien en verhoogt het toegevoegde volume.
- Opstelling-feedback reageert wanneer alleen de buret wordt aangeklikt.
- Geen browser-console-errors.

## Strenge laatste inhoudelijke QA

- `scripts/validateLearningCoverage.mjs` gebruikt nu een veilige parser voor `q({...})` en `s({...})`, zodat replacement-vragen niet per ongeluk aan de verkeerde tekst worden gekoppeld.
- Leerdoel-koppelingen zijn aangescherpt voor M5D hydrolyse/DNA/RNA/transcriptie/translatie, M6 ionen/oplossen/geleidbaarheid/pH, M8 isotopen/MS/GC, M9 bindingen/intermoleculaire krachten en M10 concentratiecel/zuur-base/evenwicht/massa-aandeel.
- Toegevoegd als gerichte QA-gatvulling, niet als grote contentuitbreiding: `qa-m5d-hydrolyse-01`, `qa-m8-gc-01`, `qa-m9-covalent-01` en `qa-m10-elektro-08`.
- Leerlinggerichte vraagteksten gebruiken nu `mol/L` en formuleringen als “molariteit” en “hoeveel mol”, in plaats van cryptische vraagstarts zoals `c(...)` of `n(...)`.
- Details staan in `COVERAGE_GAP_REPORT.md`.

## StructuurLab

Nieuwe check: `node scripts/validateChemGraph.mjs`.

De check is geslaagd voor:

- COOH uit losse C, O, O en H versus het COOH-fragment
- OH los versus het OH-fragment
- herkenning van los C=O
- herkenning van los gebouwde ester
- herkenning van los gebouwde amide
- modelantwoord blijft geblokkeerd totdat **Controleer structuur** is gebruikt

De bouwer beoordeelt dus bindingen en genormaliseerde chemische grafen, niet de keuze voor een prefabblokje.

## Batch 1 beeldimport, hints en oefenscheduler

Deze ronde stopte de algemene contentuitbreiding en werkte gericht aan didactiek, herhaling en visuele ondersteuning.

### Batch 1 assets in de app

- Zes beeldbestanden zijn fysiek gecontroleerd en gekoppeld aan `src/data/visualAssetRegistry.ts`.
- M10 TitratieLab-uitleg toont vier beelden: volledige opstelling, titratiestappen, meniscus op ooghoogte en Schellbachstreep.
- M8 massaspectrometrie toont het gelabelde massaspectrum in de leeromgeving.
- M5D eiwitsynthese toont het transcriptie/translatie-stappenschema in de leeromgeving.
- Browsercheck: alle zes gecontroleerde beelden laden met `naturalWidth > 0`; geen console-errors.

### TitratieLab V1 — didactische modus en Cloud-scène

- Toegevoegd/geïntegreerd: `src/components/titration/TitrationScene2D.tsx` en `src/components/titration/TitrationScene2D.css`.
- De Cloud-scène is aangesloten als visuele/interactieve labscene; de bestaande titratie-engine blijft verantwoordelijk voor volume, eindpunt, kleur en scoring.
- TitratieLab heeft nu drie modi:
  - **Uitleg**: beelden, begrippenlijst, video/infographic-placeholder en spoelregels.
  - **Begeleid oefenen**: basisopstelling staat klaar, met hulptekst en waarschuwingen.
  - **Zelf oefenen**: minder directe hulp; setup-builder blijft optioneel.
- Setup bouwen is dus geen blokkade meer voor leerlingen die eerst titreren willen leren.
- Browsercheck: kraanstand “Druppel” verhoogde het toegevoegde volume van `0.00 mL` naar `0.09 mL`; geen console-errors.

### Hints

- Nieuw: `src/utils/questionEnhancements.ts`.
- Nieuw: `scripts/validateHintQuality.mjs`.
- De actieve vraagdata en officiële proeftoetsvragen krijgen centraal verrijkte hints via `enhanceQuestion(...)`.
- Validatorstatus: **522 vragen gecontroleerd**, **1501 vraag-specifieke hints actief**, **0 verboden generieke-only hints over**.
- Oude generieke hintpatronen zoals “kijk goed naar de vraag” of “markeer de gegevens” worden in de actieve runtime vervangen door hints met vaktaal, bijvoorbeeld liter/molverhouding bij M10, piek/m/z bij M8 en functionele groep bij structuurvragen.

### Oefenherhaling

- Nieuw: `src/utils/practiceScheduler.ts`.
- De oefenmodus gebruikt nu een lokale deck-status per filter in `localStorage`.
- Het deck bewaart `unseenQuestionIds`, `seenQuestionIds`, `masteredQuestionIds`, `weakQuestionIds`, `skippedQuestionIds`, `lastQuestionIds`, `currentQuestionId` en `deckCreatedAt`.
- Selectieregel: eerst ongeziene vragen, geen directe herhaling van de huidige of laatste vijf vragen, beheerste vragen uit de actieve ronde, zwakke/overgeslagen vragen later opnieuw.
- Browsercheck: na “Ik beheers deze” ging de oefenronde van vraag 1 naar vraag 2 met een andere vraagtekst.

### Virtuele labs — planstatus

- Nieuw: `src/features/virtualLabs/README.md`.
- Nieuw: `src/features/virtualLabs/massSpectrometryLabPlan.md`.
- Er is bewust nog geen nieuw MassaspectrometrieLab gebouwd. Het plan beschrijft alleen een latere interactieve simulatie met verdampen, ioniseren, versnellen, afbuigen, detecteren en spectrumopbouw.

## Gerichte QA- en didactiekronde: figuren, TitratieLab en M8

Deze ronde loste de concrete QA-punten uit de bijlage op zonder grote redesign en zonder accounts/leaderboards.

### Placeholder/figuurslot bug

- Opgelost: echte afbeeldingen renderen nu via `FigureBlock` als genummerde figuren met titel en onderschrift.
- De tekst **“Beeldslot voor latere foto/illustratie”** staat niet meer boven echte afbeeldingen in lessen.
- Browsercheck: M8 massaspectrometrie toont figuur 6 zonder placeholderkop; TitratieLab toont figuur 1 t/m 4 zonder placeholderkop.

### Universeel figuursysteem

- Toegevoegd: `src/components/content/FigureBlock.tsx`.
- Toegevoegd: `src/data/figureRegistry.ts`.
- Vaste figuren:
  1. Volledige titratieopstelling.
  2. Buret aflezen op ooghoogte.
  3. Schellbachstreep bij de meniscus.
  4. Titratie in 6 stappen.
  5. Transcriptie en translatie.
  6. Massaspectrum met M-piek, M+1 en basispiek.
- Les- en TitratieLab-tekst verwijzen nu expliciet naar “figuur 1” t/m “figuur 6”.

### TitratieLab dubbele UI opgeschoond

- Opgelost: de oude `ValveControl` staat niet meer naast de Cloud-scène.
- Opgelost: de oude losse toolcomponenten staan niet meer als tweede hoofdmodel naast de Cloud-scène.
- Begeleid en Zelf oefenen gebruiken één primaire hoofdscene: `TitrationScene2D`.
- Setup bouwen blijft alleen zichtbaar als optionele challenge via “Extra oefenen: stel zelf de opstelling samen”.
- Browsercheck: in begeleide modus was `sceneCount = 1`, `oldValveControlCount = 0`, `setupBuilderButtons = 0` zolang de challenge uit staat.

### Procedurestappen interactiever gemaakt

- De oude passieve checkboxlijst is vervangen door actie-/feedbackkaarten.
- Elke procedurestap heeft nu:
  - actieknop;
  - status;
  - inhoudelijke feedback;
  - foutuitleg;
  - herstelmogelijkheid.
- Voorbeelden van nieuwe feedback:
  - buret niet gespoeld: titrant kan verdund raken;
  - pipet niet gespoeld: hoeveelheid onderzochte stof kan veranderen;
  - indicator ontbreekt: eindpuntkleur wordt gemist;
  - snel bij eindpunt: kans op overshoot;
  - begin/eindstand ontbreekt: gebruikt volume is niet betrouwbaar te berekenen.
- De stap “Titreer langzaam” wordt ook gekoppeld aan de echte kraanactie in de Cloud-scène.

### M8 massaspectrometrie didactisch uitgebreid

- De M8-les is uitgebreid van compacte uitleg naar een volledige leesroute:
  - x-as = m/z;
  - y-as = relatieve intensiteit;
  - basispiek;
  - M-piek;
  - M+1;
  - M+2;
  - fragmentpieken;
  - vaste leesvolgorde;
  - voorzichtig conclusies trekken.
- Aantal uitgebreide massaspectrometrievoorbeelden: **3**.
  - Voorbeeld met M en M+1.
  - Voorbeeld met M en M+2.
  - Voorbeeld met fragmentatie/basispiek.
- Browsercheck: M8-les toont 3 extra voorbeeldblokken en noemt zichtbaar x-as, relatieve intensiteit, M+2, Cl en Br.

### Vragen met figuren

- Toegevoegd: `src/data/figureQuestions.ts`.
- Aantal nieuwe figuurvragen: **8**.
  - M8 massaspectrometrie: 3.
  - M5D transcriptie/translatie: 2.
  - M10 buret/Schellbach/titratiestappen: 3.
- Browsercheck: M8-oefenmodus toont een vraag met figuur 6 en figuurcaption.

### Antwoorduitleg uitgebreid

- `FeedbackPanel` toont voor prioriteitsvragen nu extra lagen:
  1. wat wordt gevraagd;
  2. welke info is relevant;
  3. welke tussenstap komt eerst;
  4. waarom dit chemisch klopt.
- Aantal antwoorduitlegblokken uitgebreid via het centrale feedbackpaneel: **341** vragen, inclusief M10, M8, M5D, structuurvragen en figuurvragen.
- Browsercheck: M8-oefenvraag toont de vier nieuwe antwoordlagen na modelantwoord.

## Aangepaste kernbestanden

- `src/data/officialPracticeTest.ts`
- `src/data/learningObjectives.ts`
- `src/data/coverageQaQuestions.ts`
- `src/data/qualityReplacementQuestions.ts`
- `src/data/questionAudit.ts`
- `src/data/questions.ts`
- `src/data/extendedQuestions.ts`
- `src/data/priorityQuestions.ts`
- `src/types/index.ts`
- `src/components/QuestionVisual.tsx`
- `src/components/diagrams/OfficialExamDiagrams.tsx`
- `src/pages/TestMode.tsx`
- `src/pages/TitrationLab.tsx`
- `src/styles.css`
- `src/data/titrationSimulations.ts`
- `src/features/titrationLab/titrationEngine.ts`
- `src/features/titrationLab/CONTRACT.md`
- `src/components/titration/*`
- `src/data/visualAssetRegistry.ts`
- `src/utils/storage.ts`
- `src/utils/practiceScheduler.ts`
- `src/utils/questionEnhancements.ts`
- `src/components/content/FigureBlock.tsx`
- `src/data/figureRegistry.ts`
- `src/data/figureQuestions.ts`
- `scripts/validateLearningCoverage.mjs`
- `scripts/validateChemGraph.mjs`
- `scripts/validateHintQuality.mjs`
- `HIGH_PRIORITY_IMAGES_TO_GENERATE.md`
- `MISSING_VISUAL_ASSETS.md`
- `IMAGE_IMPORT_CHECKLIST.md`
- `src/features/virtualLabs/README.md`
- `src/features/virtualLabs/massSpectrometryLabPlan.md`
- `AI_HANDOFF_TITRATIONLAB.md`
- `COVERAGE_GAP_REPORT.md`

## Validatie

- `node scripts/validateChemGraph.mjs`: geslaagd.
- `node scripts/validateHintQuality.mjs`: geslaagd — 486 vragen gecontroleerd, 1387 vraag-specifieke hints actief, 0 verboden generieke-only hints over.
- `node scripts/validateLearningCoverage.mjs`: geslaagd — 94 subleerdoelen, M5D 15, M8 15, M9 22, M10 27 en 25 officiële toetsvragen.
- `npm run build`: geslaagd — TypeScript-check en Vite-productiebundel.
- Browsercheck lokaal op `http://127.0.0.1:5173/`: geslaagd — TitratieLab-route werkt op telefoonbreedte, figuren 1 t/m 4 laden zonder placeholderkop, M8 toont figuur 6 en 3 extra voorbeelden, Cloud-scène is de enige hoofdscene, procedurekaarten tonen inhoudelijke feedback, M8-oefenvraag toont figuur en uitgebreid feedbackpaneel; geen browser-console-errors.

## Grootste resterende verbeterpunt

De hoogste prioriteit ligt nu niet meer bij Batch 1-beelden maar bij verfijning: fijnere TitratieLab-interactie, nauwkeuriger visuele buretaflezing zonder de engine/pagina-architectuur te wijzigen, en daarna pas nieuwe virtuele labs voor massaspectrometrie/GC/IR/NMR.

## Fase 3 + 5 + 6 update

- Procedureanimaties toegevoegd: ja.
- Procedureacties met visuele feedback: buret spoelen, pipet spoelen, monster pipetteren, indicator toevoegen, buret vullen, beginstand aflezen, langzaam titreren, stoppen bij eindpunt, eindstand aflezen.
- ImageLightbox toegevoegd: ja.
- FigureBlock/ImageSlot/QuestionVisual klikbaar: ja voor echte afbeeldingen; placeholders blijven onveranderd.
- Validators: `validateHintQuality`, `validateLearningCoverage` en `validateChemGraph` allemaal geslaagd.
- Buildstatus: geslaagd.
- Bewust overgeslagen: fase 2 responsive/mobile overhaul, fase 4 uitgebreide dark/light contrast audit, MassSpectrometryLab implementatie.
## Vervolgpass vraagkwaliteit + M10

- M10 is opgesplitst met tien extra gerichte lessen: zuur-baseherhaling, pH, indicatoren, titratieopstelling, titratierekenen, verdunnen, titratiefouten, zwakke zuren/evenwicht, elektrochemie en duurzaamheid.
- Toegevoegd: native oefendiagrammen voor onlabelde GC-chromatogrammen, configureerbare massaspectra en titratie-meetdata/verdunningsschema's.
- Toegevoegd: `scripts/validateFigureQuestionQuality.mjs` als warning-validator voor figuurdoel, decoratieve titratievisuals, antwoord-lekkende GC-labels, expliciete figuurverwijzing en eindantwoordkwaliteit.
- Minimaal 25 zwakke figuurvragen/modelantwoorden zijn via `qualityReplacementQuestions` aangescherpt, vooral in M8 en M10.
- Visual registry cleanup: oude fallback-SVG-slots die door `.webp`-assets zijn ingehaald zijn naar lage-prioriteit placeholder gezet, niet oneerlijk op `done`.

## Warning burn-down + replacement QA

- `qualityReplacementQuestions` gecontroleerd: 68 unieke replacements, 68 effectief gekoppeld, 0 duplicate IDs en 0 orphan IDs.
- Centrale routes gecontroleerd: oefenen, modulefilters, practice scheduler, toetsmodus, leerdoelenchecklist en foutenlog gebruiken de centrale `questions`-export; officiële oefentoets blijft bewust aparte bron en is direct opgeschoond.
- `validateFigureQuestionQuality`: teruggebracht van 65 waarschuwingen naar 0 waarschuwingen.
- Extra opgeschoond: ontbrekende `purpose`-labels, figuurvragen zonder expliciete figuurverwijzing, modelantwoorden zonder duidelijk eindantwoord en decoratieve/te makkelijke M8/M10 visuals.
- Nieuwe auditdocumenten: `QUESTION_REPLACEMENT_AUDIT.md` en `FIGURE_WARNING_BURNDOWN.md`.
