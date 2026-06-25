# Contract — TitratieLab isolated scene

Dit contract is bedoeld voor toekomstige uitbreiding van de 2D-labscene zonder de rest van ChemTrainer USG te veranderen.

## Doel

Bouw of verbeter alleen een geïsoleerde scene-component, bijvoorbeeld:

- `src/components/titration/TitrationScene2D.tsx`

De component tekent de labopstelling en geeft gebruikersinteracties door via callbacks.

## Props die een scene mag verwachten

```ts
import type { EndpointState, TitrationSimulation, ValveSetting } from "../../types";
import type { TitrationSetupSelection } from "../../features/titrationLab/titrationEngine";

export interface TitrationScene2DProps {
  simulation: TitrationSimulation;
  setup: TitrationSetupSelection;
  currentAddedMl: number;
  startReadingMl: number;
  endReadingMl: number;
  valveSetting: ValveSetting;
  endpointState: EndpointState;
  hasIndicator: boolean;
  onToggleSetup?: (key: keyof TitrationSetupSelection) => void;
  onValveChange?: (next: ValveSetting) => void;
}
```

## Scheiding van verantwoordelijkheden

- Scene = draw/interact only.
- Engine = endpoint/color/volume/error feedback.
- Page = data/state/scoring/localStorage.

De scene mag dus niet zelf equivalentievolume, score, berekening of localStorage beheren.

## Verboden wijzigingen

Build only the isolated TitrationScene component against the provided props/types. Do not change routing, global CSS, questions, lessons, or app navigation. Return only the files for the isolated feature.

## Acceptatiecriteria

- Werkt in lichte én donkere modus.
- Gebruikt de bestaande notebook/examenbundel-stijl.
- Geen neon, geen glassmorphism, geen 3D-library.
- Responsief op laptop en telefoon.
- `npm run build` blijft slagen.

