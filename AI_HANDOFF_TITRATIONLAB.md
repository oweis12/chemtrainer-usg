# AI-handoff — TitratieLab V1

ChemTrainer USG bevat nu een geïsoleerde 2D-titratiefeature. Gebruik dit document wanneer een andere AI of ontwikkelaar alleen de labscene verder moet verfijnen.

## Belangrijkste bestanden

- `src/pages/TitrationLab.tsx` — pagina, React-state, simulatiekeuze, lokale voortgang en score-opslag.
- `src/data/titrationSimulations.ts` — titratiecasussen met titrant, monster, molverhouding, indicator en verborgen equivalentievolume.
- `src/features/titrationLab/titrationEngine.ts` — chemische/logische engine voor eindpunt, volume, aflezen, berekenen, fouten en score.
- `src/features/titrationLab/CONTRACT.md` — technische contractgrens voor externe scene-bouw.
- `src/components/titration/` — losse 2D componenten voor buret, erlenmeyer, pipet, indicator, kraantje, stappen, aflezen, berekening en feedback.
- `src/styles.css` — TitratieLab-styling in de bestaande labnotitie/examenbundel-stijl.

## Architectuurprincipe

- Scene = tekenen en beperkte interactie.
- Engine = endpoint, kleur, volume, foutfeedback, aflezen, berekening en score.
- Page = data, state, routing binnen de app, localStorage en panels.

De scene mag dus niet zelf scheikundige regels verzinnen. Als kleur/eindpunt/score anders moet, pas dan de engine aan.

## State en acties blijven app-managed

De pagina beheert onder meer:

- gekozen simulatie;
- geplaatste opstellingsonderdelen;
- procedurestappen;
- `currentAddedMl`;
- `startReadingMl` en berekende eindstand;
- `valveSetting`;
- `endpointState`;
- buret-invoer;
- Schellbach-keuze;
- berekeninvoer;
- score en lokale voortgang.

Een externe scene-component hoort deze waarden als props te krijgen en callbacks terug te geven. Geen eigen globale store toevoegen.

## Exacte opdracht voor externe AI-scene

“Build only the isolated TitrationScene component against the provided props/types. Do not change routing, global CSS, questions, lessons, or app navigation. Return only the files for the isolated feature.”

## Wat externe AI wél mag doen

- Een geïsoleerde `TitrationScene2D.tsx` bouwen onder `src/components/titration/`.
- SVG-details verbeteren: schaalverdeling, kraantje, druppels, statief, witte tegel, vloeistofkleur.
- Interactieve hotspots toevoegen binnen de scene, mits callbacks via props lopen.
- Alleen scene-specifieke CSS toevoegen, bij voorkeur met `titration-` prefix.

## Wat externe AI niet mag doen

- Geen routing wijzigen.
- Geen globale navigatie wijzigen.
- Geen lessen of vragenbank aanpassen.
- Geen officiële oefentoetsdata aanpassen.
- Geen global CSS-reset of redesign uitvoeren.
- Geen externe zware 3D- of canvas-library toevoegen.
- Geen localStorage-schema wijzigen zonder migratieplan.

## Chemische afspraken

- Gebruik volumes in liter bij molberekeningen.
- Titratieberekening loopt via molariteit × volume.
- Molverhouding komt uit de reactievergelijking.
- Fenolftaleïne bij azijnzuur/NaOH: kleurloos vóór eindpunt, lichtroze rond correct eindpunt, te fel/donkerroze bij overshoot.
- Equivalentievolume blijft tijdens het titreren verborgen voor de leerling.

