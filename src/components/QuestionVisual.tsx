import type { QuestionVisual as QuestionVisualData } from "../types";
import { DnaPolymerDiagram } from "./diagrams/DnaPolymerDiagram";
import { DnaRnaDiagram } from "./diagrams/DnaRnaDiagram";
import { GcChromatogramDiagram } from "./diagrams/GcChromatogramDiagram";
import { GcMsDiagram } from "./diagrams/GcMsDiagram";
import { MassSpectrometerDiagram } from "./diagrams/MassSpectrometerDiagram";
import { MassSpectrumDiagram } from "./diagrams/MassSpectrumDiagram";
import { NucleotideDiagram } from "./diagrams/NucleotideDiagram";
import { PeptideBondDiagram } from "./diagrams/PeptideBondDiagram";
import { TitrationSetupDiagram } from "./diagrams/TitrationSetupDiagram";

export function QuestionVisual({ visual }: { visual: QuestionVisualData }) {
  const component = visual.component === "MassSpectrometerDiagram" ? <MassSpectrometerDiagram />
    : visual.component === "MassSpectrumDiagram" ? <MassSpectrumDiagram variant={visual.variant} />
      : visual.component === "GcChromatogramDiagram" ? <GcChromatogramDiagram />
        : visual.component === "GcMsDiagram" ? <GcMsDiagram />
          : visual.component === "NucleotideDiagram" ? <NucleotideDiagram />
            : visual.component === "DnaPolymerDiagram" ? <DnaPolymerDiagram />
              : visual.component === "DnaRnaDiagram" ? <DnaRnaDiagram />
                : visual.component === "PeptideBondDiagram" ? <PeptideBondDiagram />
                  : visual.component === "TitrationSetupDiagram" ? <TitrationSetupDiagram variant={visual.variant} />
                    : visual.src ? <img src={visual.src} alt={visual.alt} /> : null;
  if (!component) return null;
  return <figure className="question-visual"><div className="question-visual-heading">Gegeven / schema</div>{component}<figcaption>{visual.caption ?? visual.alt}</figcaption></figure>;
}
