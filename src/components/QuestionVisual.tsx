import type { QuestionVisual as QuestionVisualData } from "../types";
import { AtomicModelsDiagram } from "./diagrams/AtomicModelsDiagram";
import { BondPolarityDiagram } from "./diagrams/BondPolarityDiagram";
import { DnaExpressionDiagram } from "./diagrams/DnaExpressionDiagram";
import { DnaPolymerDiagram } from "./diagrams/DnaPolymerDiagram";
import { DnaRnaDiagram } from "./diagrams/DnaRnaDiagram";
import { GcChromatogramDiagram } from "./diagrams/GcChromatogramDiagram";
import { GcMsDiagram } from "./diagrams/GcMsDiagram";
import { GcMsWorkflowDiagram } from "./diagrams/GcMsWorkflowDiagram";
import { HydrationIonDipoleDiagram } from "./diagrams/HydrationIonDipoleDiagram";
import { IrSpectrumDiagram } from "./diagrams/IrSpectrumDiagram";
import { FragmentationReasoningDiagram } from "./diagrams/FragmentationReasoningDiagram";
import { IsotopePatternDiagram } from "./diagrams/IsotopePatternDiagram";
import { MassSpectrometerRouteDiagram } from "./diagrams/MassSpectrometerRouteDiagram";
import { MassSpectrumReadingDiagram } from "./diagrams/MassSpectrumReadingDiagram";
import { MassSpectrometerDiagram } from "./diagrams/MassSpectrometerDiagram";
import { MassSpectrumDiagram } from "./diagrams/MassSpectrumDiagram";
import { MicelleDiagram } from "./diagrams/MicelleDiagram";
import { NmrSignalDiagram } from "./diagrams/NmrSignalDiagram";
import { NucleotideDiagram } from "./diagrams/NucleotideDiagram";
import { AsparagusicAcidDiagram, CalciumHydrationDiagram, CelluloseHydrogenBondDiagram, EthylEsterFormationDiagram } from "./diagrams/OfficialExamDiagrams";
import { PeptideBondDiagram } from "./diagrams/PeptideBondDiagram";
import { PeptideBondFormationDiagram } from "./diagrams/PeptideBondFormationDiagram";
import { ProteinStructureDiagram } from "./diagrams/ProteinStructureDiagram";
import { QuestionGcChromatogram } from "./diagrams/QuestionGcChromatogram";
import { QuestionMassSpectrum } from "./diagrams/QuestionMassSpectrum";
import { QuestionTitrationDataFigure } from "./diagrams/QuestionTitrationDataFigure";
import { RutherfordScatteringDiagram } from "./diagrams/RutherfordScatteringDiagram";
import { TitrationCurveDiagram } from "./diagrams/TitrationCurveDiagram";
import { TitrationSetupDiagram } from "./diagrams/TitrationSetupDiagram";
import { FigureBlock } from "./content/FigureBlock";
import { getFigureByPath } from "../data/figureRegistry";

export function QuestionVisual({ visual }: { visual: QuestionVisualData }) {
  const component = visual.component === "AtomicModelsDiagram" ? <AtomicModelsDiagram variant={visual.variant} />
    : visual.component === "BondPolarityDiagram" ? <BondPolarityDiagram variant={visual.variant} />
    : visual.component === "RutherfordScatteringDiagram" ? <RutherfordScatteringDiagram />
      : visual.component === "MassSpectrometerDiagram" ? <MassSpectrometerDiagram />
      : visual.component === "MassSpectrometerRouteDiagram" ? <MassSpectrometerRouteDiagram variant={visual.variant} />
      : visual.component === "MassSpectrumDiagram" ? <MassSpectrumDiagram variant={visual.variant} />
      : visual.component === "MassSpectrumReadingDiagram" ? <MassSpectrumReadingDiagram variant={visual.variant} />
      : visual.component === "IsotopePatternDiagram" ? <IsotopePatternDiagram variant={visual.variant} />
      : visual.component === "IrSpectrumDiagram" ? <IrSpectrumDiagram variant={visual.variant} />
      : visual.component === "NmrSignalDiagram" ? <NmrSignalDiagram variant={visual.variant} />
      : visual.component === "FragmentationReasoningDiagram" ? <FragmentationReasoningDiagram variant={visual.variant} />
      : visual.component === "QuestionMassSpectrum" ? <QuestionMassSpectrum variant={visual.variant} />
      : visual.component === "GcChromatogramDiagram" ? <GcChromatogramDiagram />
        : visual.component === "QuestionGcChromatogram" ? <QuestionGcChromatogram variant={visual.variant} />
          : visual.component === "GcMsDiagram" ? <GcMsDiagram />
          : visual.component === "GcMsWorkflowDiagram" ? <GcMsWorkflowDiagram variant={visual.variant} />
            : visual.component === "HydrationIonDipoleDiagram" ? <HydrationIonDipoleDiagram />
              : visual.component === "MicelleDiagram" ? <MicelleDiagram />
                : visual.component === "NucleotideDiagram" ? <NucleotideDiagram />
                  : visual.component === "DnaPolymerDiagram" ? <DnaPolymerDiagram />
                    : visual.component === "DnaRnaDiagram" ? <DnaRnaDiagram />
                  : visual.component === "DnaExpressionDiagram" ? <DnaExpressionDiagram variant={visual.variant as Parameters<typeof DnaExpressionDiagram>[0]["variant"]} />
                    : visual.component === "PeptideBondDiagram" ? <PeptideBondDiagram />
                      : visual.component === "PeptideBondFormationDiagram" ? <PeptideBondFormationDiagram variant={visual.variant as Parameters<typeof PeptideBondFormationDiagram>[0]["variant"]} />
                        : visual.component === "ProteinStructureDiagram" ? <ProteinStructureDiagram variant={visual.variant as Parameters<typeof ProteinStructureDiagram>[0]["variant"]} />
                    : visual.component === "TitrationSetupDiagram" ? <TitrationSetupDiagram variant={visual.variant} />
                      : visual.component === "QuestionTitrationDataFigure" ? <QuestionTitrationDataFigure variant={visual.variant} />
                        : visual.component === "TitrationCurveDiagram" ? <TitrationCurveDiagram variant={visual.variant} />
                        : visual.component === "AsparagusicAcidDiagram" ? <AsparagusicAcidDiagram />
                          : visual.component === "EthylEsterFormationDiagram" ? <EthylEsterFormationDiagram />
                            : visual.component === "CelluloseHydrogenBondDiagram" ? <CelluloseHydrogenBondDiagram />
                              : visual.component === "CalciumHydrationDiagram" ? <CalciumHydrationDiagram />
                                : null;
  const figure = getFigureByPath(visual.src);
  const fallbackTitle = visual.component === "AtomicModelsDiagram" ? "Atoommodel bij deze vraag"
    : visual.component === "BondPolarityDiagram" ? "Binding en polariteit bij deze vraag"
    : visual.component === "RutherfordScatteringDiagram" ? "Rutherforddiagram bij deze vraag"
    : visual.component === "MassSpectrumDiagram" ? "Massaspectrum bij deze vraag"
    : visual.component === "MassSpectrometerRouteDiagram" ? "Route door de massaspectrometer"
    : visual.component === "MassSpectrumReadingDiagram" ? "Massaspectrum stap voor stap"
    : visual.component === "IsotopePatternDiagram" ? "Isotopenpatroon in het massaspectrum"
    : visual.component === "IrSpectrumDiagram" ? "IR-spectrum met karakteristieke gebieden"
    : visual.component === "NmrSignalDiagram" ? "NMR-signalen en H-omgevingen"
    : visual.component === "FragmentationReasoningDiagram" ? "Fragmentatie en massaverschil"
    : visual.component === "QuestionMassSpectrum" ? "Oefenmassaspectrum bij deze vraag"
    : visual.component === "GcChromatogramDiagram" ? "GC-chromatogram bij deze vraag"
      : visual.component === "QuestionGcChromatogram" ? "Oefenchromatogram bij deze vraag"
        : visual.component === "QuestionTitrationDataFigure" ? "Meetgegevens bij deze vraag"
      : visual.component === "GcMsDiagram" ? "GC-MS schema bij deze vraag"
      : visual.component === "GcMsWorkflowDiagram" ? "GC-MS: eerst scheiden, dan meten"
        : visual.component === "HydrationIonDipoleDiagram" ? "Hydratatie en ion-dipoolinteracties"
          : visual.component === "MicelleDiagram" ? "Micel van zeep in water"
          : visual.component === "DnaExpressionDiagram" ? "DNA- en eiwitroute bij deze vraag"
            : visual.component === "PeptideBondFormationDiagram" ? "Peptidebinding bij deze vraag"
              : visual.component === "ProteinStructureDiagram" ? "Eiwitstructuur bij deze vraag"
                : visual.component === "TitrationCurveDiagram" ? "Titratiecurve en omslaggebied"
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
