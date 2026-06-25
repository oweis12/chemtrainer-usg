import type { QuestionVisual as QuestionVisualData } from "../types";
import { DnaPolymerDiagram } from "./diagrams/DnaPolymerDiagram";
import { DnaRnaDiagram } from "./diagrams/DnaRnaDiagram";
import { GcChromatogramDiagram } from "./diagrams/GcChromatogramDiagram";
import { GcMsDiagram } from "./diagrams/GcMsDiagram";
import { MassSpectrometerDiagram } from "./diagrams/MassSpectrometerDiagram";
import { MassSpectrumDiagram } from "./diagrams/MassSpectrumDiagram";
import { NucleotideDiagram } from "./diagrams/NucleotideDiagram";
import { AsparagusicAcidDiagram, CalciumHydrationDiagram, CelluloseHydrogenBondDiagram, EthylEsterFormationDiagram } from "./diagrams/OfficialExamDiagrams";
import { PeptideBondDiagram } from "./diagrams/PeptideBondDiagram";
import { QuestionGcChromatogram } from "./diagrams/QuestionGcChromatogram";
import { QuestionMassSpectrum } from "./diagrams/QuestionMassSpectrum";
import { QuestionTitrationDataFigure } from "./diagrams/QuestionTitrationDataFigure";
import { TitrationSetupDiagram } from "./diagrams/TitrationSetupDiagram";
import { FigureBlock } from "./content/FigureBlock";
import { getFigureByPath } from "../data/figureRegistry";

export function QuestionVisual({ visual }: { visual: QuestionVisualData }) {
  const component = visual.component === "MassSpectrometerDiagram" ? <MassSpectrometerDiagram />
    : visual.component === "MassSpectrumDiagram" ? <MassSpectrumDiagram variant={visual.variant} />
      : visual.component === "QuestionMassSpectrum" ? <QuestionMassSpectrum variant={visual.variant} />
      : visual.component === "GcChromatogramDiagram" ? <GcChromatogramDiagram />
        : visual.component === "QuestionGcChromatogram" ? <QuestionGcChromatogram variant={visual.variant} />
          : visual.component === "GcMsDiagram" ? <GcMsDiagram />
            : visual.component === "NucleotideDiagram" ? <NucleotideDiagram />
              : visual.component === "DnaPolymerDiagram" ? <DnaPolymerDiagram />
                : visual.component === "DnaRnaDiagram" ? <DnaRnaDiagram />
                  : visual.component === "PeptideBondDiagram" ? <PeptideBondDiagram />
                    : visual.component === "TitrationSetupDiagram" ? <TitrationSetupDiagram variant={visual.variant} />
                      : visual.component === "QuestionTitrationDataFigure" ? <QuestionTitrationDataFigure variant={visual.variant} />
                        : visual.component === "AsparagusicAcidDiagram" ? <AsparagusicAcidDiagram />
                          : visual.component === "EthylEsterFormationDiagram" ? <EthylEsterFormationDiagram />
                            : visual.component === "CelluloseHydrogenBondDiagram" ? <CelluloseHydrogenBondDiagram />
                              : visual.component === "CalciumHydrationDiagram" ? <CalciumHydrationDiagram />
                                : null;
  const figure = getFigureByPath(visual.src);
  const fallbackTitle = visual.component === "MassSpectrumDiagram" ? "Massaspectrum bij deze vraag"
    : visual.component === "QuestionMassSpectrum" ? "Oefenmassaspectrum bij deze vraag"
    : visual.component === "GcChromatogramDiagram" ? "GC-chromatogram bij deze vraag"
      : visual.component === "QuestionGcChromatogram" ? "Oefenchromatogram bij deze vraag"
        : visual.component === "QuestionTitrationDataFigure" ? "Meetgegevens bij deze vraag"
          : visual.component === "GcMsDiagram" ? "GC-MS schema bij deze vraag"
            : visual.component ? "Schema bij deze vraag"
              : "Figuur bij deze vraag";

  return <div className="question-visual">
    <div className="question-visual-heading">Gegeven / schema</div>
    <FigureBlock
      src={visual.src}
      alt={visual.alt}
      title={figure?.title ?? fallbackTitle}
      figureNumber={figure?.number}
      caption={visual.caption ?? figure?.shortReference ?? visual.alt}
      fallback={component}
      status={visual.src ? "done" : undefined}
    />
  </div>;
}
