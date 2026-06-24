# NIGHTLY REPORT — ChemTrainer USG

Datum: 2026-06-24

## Gerichte toetskwaliteitsronde

Deze ronde beperkte zich bewust tot M10, M8 en M5D. De bestaande labnotitie-layout en bestaande oefen-/toetsflow zijn behouden.

### Audit van de bestaande kernvragen

| Module | Bestaande kernbank beoordeeld | Besluit |
| --- | ---: | --- |
| M10 titratie/mol | 57 | Behouden als fundament; korte instapvragen blijven uitsluitend niveau 1. Geen onjuiste of onduidelijke vraag hoefde te worden verwijderd. |
| M8 analysetechnieken | 15 | Vier erg compacte instappers zijn didactisch aangevuld met context- en visualisatievarianten; geen vraag als onbruikbaar gemarkeerd. |
| M5D DNA/polymeren | 15 | Behouden als startdiagnostiek en aangevuld met langere redeneer- en vergelijkingsvragen; geen vraag als onbruikbaar gemarkeerd. |

Er zijn dus **geen** vragen als `replace` gemarkeerd. De verbeteractie was `keep/improve`: bestaande basisvragen blijven bruikbaar op niveau 1, maar vormen niet langer de hoofdinhoud van de prioriteitsbanken.

## Nieuwe en verbeterde vraagbanken

- **M10:** nu **80** kernvragen, exact **20 per niveau**. Toegevoegd: 23 toetsgerichte vragen over buret, Schellbachstreep, `n = c × V`, molverhoudingen, zuur-base, verdunnen, massa%, gemiddelden/uitbijters, significantie, indicatoren en foutenanalyse.
- **M8:** nu **60** kernvragen, exact **15 per niveau**. Toegevoegd: 45 vragen over M-, M+1- en M+2-pieken, basispiek, fragmentatie, isotopen, Rutherford, GC, GC-MS, IR en NMR.
- **M5D:** nu **50** kernvragen. Toegevoegd: 35 vragen over DNA, RNA, nucleotide/polymeer, complementaire basenparing, additie- en condensatiepolymeren, ester-/amide-/peptidebindingen, eiwitten, vetten en materialenredeneren.
- De nieuwe vragen vragen vooral om uitleg op microniveau, rekenstappen, bronkritiek, vergelijking en foutenanalyse; losse definitievragen zijn alleen nog instapmateriaal.

## Nieuwe visualisaties

Nieuwe native React/SVG-componenten, zonder extra zware library:

- `MassSpectrometerDiagram`
- `MassSpectrumDiagram`
- `GcChromatogramDiagram`
- `GcMsDiagram`
- `TitrationSetupDiagram`
- `NucleotideDiagram`
- `DnaPolymerDiagram`
- `DnaRnaDiagram`
- `PeptideBondDiagram`

Vraagdata ondersteunt nu een optioneel `visual`-veld. `QuestionVisual` zet componentnamen om naar een toegankelijke figuur met bijschrift. Er zijn minstens **15 buret-/titratievragen met een visuele opstelling** toegevoegd.

## Toetsmodus

- Nieuwe **Prioriteitstoets M10–M8–M5D**.
- Tien vragen met vaste verdeling: **4× M10, 3× M8, 2× M5D, 1× M9 of M7**.
- De bestaande proeftoets, random proeftoets en 8+ challenge zijn ongewijzigd beschikbaar.

## Aangepaste bestanden

- `src/types/index.ts`
- `src/data/questions.ts`
- `src/data/priorityQuestions.ts`
- `src/components/QuestionCard.tsx`
- `src/components/QuestionVisual.tsx`
- `src/components/diagrams/MassSpectrometerDiagram.tsx`
- `src/components/diagrams/MassSpectrumDiagram.tsx`
- `src/components/diagrams/GcChromatogramDiagram.tsx`
- `src/components/diagrams/GcMsDiagram.tsx`
- `src/components/diagrams/TitrationSetupDiagram.tsx`
- `src/components/diagrams/NucleotideDiagram.tsx`
- `src/components/diagrams/DnaPolymerDiagram.tsx`
- `src/components/diagrams/DnaRnaDiagram.tsx`
- `src/components/diagrams/PeptideBondDiagram.tsx`
- `src/pages/TestMode.tsx`
- `src/styles.css`
- `AGENTS.md`
- `NIGHTLY_REPORT.md`

## Controle

- `npm run build` werkt: TypeScript-check én Vite-productiebundel zijn geslaagd.

## Nog zwak / bewust buiten scope

- M7 en M9 hebben nog niet dezelfde volledige toetskwaliteitsronde gekregen.
- Open antwoorden worden nog door de leerling met rubric zelf beoordeeld; er is bewust geen onbetrouwbare automatische taalbeoordeling toegevoegd.
- De diagrammen zijn conceptueel en toetsgericht; ze zijn geen vervanging voor echte spectra of practicumdata.

## Aanbevolen volgende stap

Voer dezelfde gerichte audit uit voor M7 redox en M9 bindingen, en voeg daarna enkele realistische bronvragen toe waarin leerlingen diagram, tekst en rekentabel combineren.
