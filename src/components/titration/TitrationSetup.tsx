import type { EndpointState, TitrationSimulation, ValveSetting } from "../../types";
import type { TitrationProcedureState, TitrationSetupSelection } from "../../features/titrationLab/titrationEngine";
import { LabBench } from "./LabBench";
import { TitrationScene2D, type EndpointState as CloudEndpointState, type ValveSetting as CloudValveSetting } from "./TitrationScene2D";

interface TitrationSetupProps {
  simulation: TitrationSimulation;
  setup: TitrationSetupSelection;
  currentAddedMl: number;
  startReadingMl: number;
  valveSetting: ValveSetting;
  endpointState: EndpointState;
  hasIndicator: boolean;
  onValveChange?: (next: ValveSetting) => void;
  procedureAnimation?: keyof TitrationProcedureState | null;
}

const valveToCloud = (setting: ValveSetting): CloudValveSetting => setting === "dicht" ? "closed" : setting === "langzaam" ? "slow" : "fast";
const cloudToValve = (setting: CloudValveSetting): ValveSetting => setting === "closed" ? "dicht" : setting === "slow" ? "langzaam" : "snel";
const endpointToCloud = (state: EndpointState): CloudEndpointState => state === "voor" ? "before" : state === "bijna" ? "near" : state === "goed" ? "at" : "over";
const liquidColorFor = (state: EndpointState, hasIndicator: boolean) => {
  if (!hasIndicator) return "#dfe7ee";
  if (state === "voor") return "#dbeafe";
  if (state === "bijna") return "#f7b7d4";
  if (state === "goed") return "#efa2c9";
  return "#d95b97";
};

export function TitrationSetup({ simulation, setup, currentAddedMl, startReadingMl, valveSetting, endpointState, hasIndicator, onValveChange, procedureAnimation }: TitrationSetupProps) {
  return <LabBench showTile={false}>
    <div className="titration-scene-grid titration-scene-grid-cloud">
      <div className="titration-apparatus">
        <TitrationScene2D
          currentAddedMl={currentAddedMl}
          buretStartMl={startReadingMl}
          valveSetting={valveToCloud(valveSetting)}
          endpointState={endpointToCloud(endpointState)}
          liquidColor={liquidColorFor(endpointState, hasIndicator)}
          showSchellbach
          burette={setup.burette || setup.stand}
          flask={setup.erlenmeyer}
          pipet={setup.pipette}
          onValveChange={onValveChange ? (next) => onValveChange(cloudToValve(next)) : undefined}
          procedureAnimation={procedureAnimation}
        />
      </div>
      <aside className="titration-simulation-note">
        <span className="section-kicker">Gegeven</span>
        <strong>{simulation.titrantName}</strong>
        <p>molariteit titrant: {simulation.titrantMolarity.toFixed(4)} mol/L</p>
        <p>monster: {simulation.analyteVolumeMl.toFixed(2)} mL {simulation.analyteName}</p>
        <p>indicator: {simulation.indicator}</p>
        <code>{simulation.reactionEquation}</code>
      </aside>
    </div>
  </LabBench>;
}
