# DIAGRAM READABILITY AUDIT

Datum: 2026-06-26

## Samenvatting

- Nieuwe diagramcomponenten: `BondPolarityDiagram` en `RutherfordScatteringDiagram`.
- Belangrijkste fix: lange uitleg is verplaatst uit de figuur naar HTML-uitlegblokken onder de figuur.
- Mobiele fix: lesson/question figure wrappers gebruiken geen `overflow: hidden` meer voor teaching diagrams.
- Mobiele fix na browsercheck: `ConceptDiagram` gebruikt geen `diagram-*` class meer op de wrapper, zodat oudere diagram-body flexregels de titel/caption niet naar buiten duwen.
- Stijl: bestaande lichte lab-notebookstijl behouden.

## Diagrammen

| Component / bestand | Module / les | Probleemtype | Actie | Status |
| --- | --- | --- | --- | --- |
| `src/components/diagrams/BondPolarityDiagram.tsx` | M9 polariteit / bindingen | Nieuwe didactische behoefte: H-H, H-Cl en EN-beslisroute waren te vaag | Toegevoegd | Gefixt |
| `BondPolarityDiagram` variant `nonpolarCovalent` | M9 `m9-polariteit` | Uitleg over gedeeld elektronenpaar moest zichtbaar zijn zonder δ-ladingen bij H-H | Toegevoegd met korte labels en HTML-uitleg | Gefixt |
| `BondPolarityDiagram` variant `polarCovalent` | M9 `m9-polariteit`, vragen `m9-52` | H-Cl elektronpaar moest duidelijk dichter bij Cl staan; tekst mocht niet in SVG verdwijnen | Toegevoegd; uitleg onder diagram noemt BINAS 40A, δ+ en δ− | Gefixt |
| `BondPolarityDiagram` variant `electronegativityDecision` | M9 `m9-polariteit` | EN-stappenplan ontbrak | Toegevoegd met korte SVG-stappen; schoolgrenzen in HTML-uitleg | Gefixt |
| `BondPolarityDiagram` variant `moleculePolarity` | M9 vraag `m9-53` | Verschil bindingspolariteit/molecuulpolariteit moest visueel toetsbaar zijn | Toegevoegd | Gefixt |
| `src/components/diagrams/RutherfordScatteringDiagram.tsx` | M8 `m8-atoommodellen-thomson-rutherford`, vragen `m8-17`, `m8-26` | Goudfolie/Rutherford was te abstract en had te veel conclusie in figuurtekst | Toegevoegd met alfa-bron, goudfolie, meeste/enkele/heel weinig routes | Gefixt |
| `src/components/diagrams/AtomicModelsDiagram.tsx` | M8 atoommodellen | GoldFoil variant had langere tekst in SVG | Nieuwe Rutherford-component gebruikt voor goudfolie-uitleg; AtomicModels blijft voor Thomson/Bohr/tekenhulp | Behouden, deels vervangen |
| `AtomicModelsDiagram` variants `thomson`, `bohr`, `drawingGuide` | M8 atoommodellen | Mobiel risico door tekstlabels, maar inhoudelijk bruikbaar | Behouden; ondersteund door nieuwe post-figure uitleg in lessen | Behouden |
| `src/components/ConceptDiagram.tsx` polarity | M9 polariteit | Lange labeltekst kon krap worden op telefoon | Vervangen door `BondPolarityDiagram` variant `polarCovalent` | Gefixt |
| `src/components/ConceptDiagram.tsx` wrapper | M7/M9/M10 inline conceptdiagrammen | Wrapper had dezelfde `diagram-*` class als de interne diagram-body; daardoor konden titel/caption op mobiel in de flexrij terechtkomen | Wrapper hernoemd naar `concept-diagram-*`; headertekst mag binnen de lesheader afbreken | Gefixt |
| `src/components/diagrams/QuestionGcChromatogram.tsx` | M8 GC-vragen | Twee-componentvraag had nog geen echte twee-piekvariant | Variant `two-components` toegevoegd | Gefixt |
| `src/components/diagrams/QuestionMassSpectrum.tsx` | M8 MS-vragen | Mobiel leesbaar; labels kort | Behouden | Behouden |
| `src/components/diagrams/MassSpectrumDiagram.tsx` | M8 lessen | Inhoudelijk nuttig, geen crop in huidige QA | Behouden met caption/uitleg | Behouden |
| `src/components/diagrams/GcChromatogramDiagram.tsx` | M8 lessen | Inhoudelijk nuttig, geen crop in huidige QA | Behouden met caption/uitleg | Behouden |
| `src/components/diagrams/GcMsDiagram.tsx` | M8 lessen | Schema is bruikbaar als procesoverzicht | Behouden | Behouden |
| `src/components/diagrams/MassSpectrometerDiagram.tsx` | M8 lessen | Schema is bruikbaar als route, niet als volledige labfoto | Behouden | Behouden |
| `src/components/diagrams/NucleotideDiagram.tsx` | M5D DNA/nucleotide | Korte labels en duidelijke bouwstenen | Behouden | Behouden |
| `src/components/diagrams/DnaRnaDiagram.tsx` | M5D DNA/RNA | Korte labels, didactische vergelijking | Behouden | Behouden |
| `src/components/diagrams/DnaPolymerDiagram.tsx` | M5D DNA/polymeer | Korte labels, voldoende mobiel | Behouden | Behouden |
| `src/components/diagrams/PeptideBondDiagram.tsx` | M5D eiwit/polymeer | Structuurgericht, geen brede redesign nodig | Behouden | Behouden |
| `src/components/diagrams/OfficialExamDiagrams.tsx` | Officiele oefentoets / M5D/M6/M9 | Rechtenveilige native SVG's; eerder QA gedaan | Behouden | Behouden |
| `src/components/diagrams/QuestionTitrationDataFigure.tsx` | M10 titratievragen | Bruikbaar voor buret/flow/verdunning; korte labels | Behouden; nieuwe vraag gebruikt bestaande `buret-readings` variant | Behouden |
| `src/components/diagrams/TitrationSetupDiagram.tsx` | M10 titratie | Setup-overzicht, niet aangepast in deze ronde | Behouden | Behouden |
| Inline diagrammen in `ConceptDiagram.tsx` | M4/M6/M7/M9/M10 | Sommige zijn abstract, maar staan vroeg in les en krijgen nu afsluitende uitleg later in les | Behouden; polariteit vervangen | Deels gefixt |

## Projectbrede regels doorgevoerd

- Belangrijke nieuwe figuren krijgen uitleg via `FigureExplanationBlock`.
- SVG's bevatten alleen korte labels; interpretatie, conclusie, toetsaanpak en fouten staan in HTML.
- `.concept-diagram` en `.question-visual` gebruiken nu `overflow: visible`.
- Nieuwe SVG's hebben ruime `viewBox`, `width: 100%`, `height: auto` en mobiele stackende uitlegblokken.
