# NIGHTLY REPORT — ChemTrainer USG

Datum: 2026-06-23

## StructuurLab toegevoegd

- Nieuwe navigatiesectie **StructuurLab** met vier tabs: Herkennen, Bouwen, Functionele groepen en Toetsvragen.
- De pagina legt eerst rustig uit hoe leerlingen atomen, enkele/dubbele bindingen, OH, COOH, ester en amide in een structuurformule lezen.
- De bestaande lichte labnotitie-/examenbundelstijl is aangehouden; er is geen grote layoutwijziging gedaan.

## Nieuwe structuurcomponenten

- `StructureRenderer` tekent nu `MoleculeGraph`-data als responsive SVG: atoomlabels, enkele/dubbele/drievoudige bindingen en formele ladingen.
- Oude tekstformules blijven werken als terugvaloptie voor bestaande vragen.
- Nieuwe interactieve builder-onderdelen:
  - `MoleculePuzzleBuilder`
  - `AtomPalette`
  - `BondSelector`
  - `MoleculeCanvas`
  - `StructureFeedbackPanel`
- Leerlingen kunnen losse C/H/O/N/Cl/S/P-atomen of snelle fragmenten plaatsen, verslepen, verbinden, verwijderen, resetten, nakijken en het model tonen.
- Studentenstructuren worden per bouwopdracht lokaal als JSON bewaard met `localStorage`.

## Nieuwe vraagtypen en data

- Toegevoegd: `structure_view`, `structure_click`, `structure_build` en `structure_complete`.
- **20** interactieve bouwopdrachten zijn toegevoegd, verdeeld over niveau 1 t/m 4 (water tot polyamide, nucleotide, triglyceride en zeep).
- **40** SVG-structuurformulevragen zijn toegevoegd voor alcoholen, carbonzuren, esters, amiden/peptidebindingen, aminozuren, hydrofiel/hydrofoob, H-bruggen, polariteit en nucleotiden.
- Bouwopdrachten kunnen nu in **Oefenen** verschijnen; een fout wordt via dezelfde resultaatstroom in het foutenlog opgeslagen.
- Bouwopdrachten zijn bewust uitgesloten van de **Proeftoets**, omdat die modus lineair en zonder interactieve editor hoort te blijven.

## Aangepaste bestanden

- `src/types/index.ts`
- `src/utils/chemGraph.ts`
- `src/components/StructureRenderer.tsx`
- `src/components/QuestionCard.tsx`
- `src/components/chem/AtomPalette.tsx`
- `src/components/chem/BondSelector.tsx`
- `src/components/chem/MoleculeCanvas.tsx`
- `src/components/chem/MoleculePuzzleBuilder.tsx`
- `src/components/chem/StructureFeedbackPanel.tsx`
- `src/data/structureBuildTasks.ts`
- `src/data/structureGraphQuestions.ts`
- `src/data/questions.ts`
- `src/pages/StructureLab.tsx`
- `src/pages/TestMode.tsx`
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/styles.css`
- `AGENTS.md`

## Controle

- `npm run build` werkt: TypeScript-check en productiebuild zijn geslaagd.
- Ontwikkelserver draait lokaal op `http://127.0.0.1:5173/`.
- Een live browsercontrole kon in deze sessie niet worden afgerond doordat de lokale browser-URL door de browserbeveiliging werd geblokkeerd; de productiebuild en typecheck zijn wel volledig geslaagd.

## Nog beperkt in deze V1

- De structuurvergelijker gebruikt praktische grafvergelijking en functionele-groepdetectie; hij is geen volledige RDKit-achtige chemie-engine.
- Fragmenten zijn bewuste snelbouwstenen. Daardoor is bijvoorbeeld een COOH- of esterfragment één klikbaar puzzelstuk, geen atoom-voor-atoom editor.
- `structure_click` is in deze versie een gerichte herkenningsvraag bij het SVG-model; er is nog geen individuele klik-hotspot per atoomgroep.

## Aanbevolen volgende stap

Voeg, alleen als daar later behoefte aan is, interactieve klik-hotspots toe aan SVG-groepen en breid vervolgens de grafvergelijker uit met een kleinere isomorfisme-check voor moleculen zonder snelle fragmenten.
