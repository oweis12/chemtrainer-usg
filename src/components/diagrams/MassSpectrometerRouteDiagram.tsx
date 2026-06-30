type MassSpectrometerRouteVariant = "route" | "ionization" | "deflection" | "detector";

const variants = new Set<MassSpectrometerRouteVariant>(["route", "ionization", "deflection", "detector"]);

function activeVariant(value?: string): MassSpectrometerRouteVariant {
  return value && variants.has(value as MassSpectrometerRouteVariant) ? value as MassSpectrometerRouteVariant : "route";
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <g className="ms-route-arrow"><line x1={x1} y1={y1} x2={x2 - 9} y2={y2} /><path d={`M${x2 - 10} ${y2 - 6} L${x2} ${y2} L${x2 - 10} ${y2 + 6} Z`} /></g>;
}

function Route() {
  const steps = [
    ["1 monster", "gasfase"],
    ["2 ionisatie", "maak ionen"],
    ["3 versnelling", "elektrisch veld"],
    ["4 scheiding", "op m/z"],
    ["5 detector", "signaal"],
  ];
  return <>
    {steps.map(([title, note], index) => {
      const x = 18 + index * 123;
      return <g key={title} transform={`translate(${x} 105)`}>
        <rect width="102" height="82" rx="5" className="science-box ms-route-card" />
        <text x="51" y="32" textAnchor="middle" className="ms-diagram-label">{title}</text>
        <text x="51" y="57" textAnchor="middle" className="ms-diagram-note">{note}</text>
        {index < steps.length - 1 && <Arrow x1={103} y1={41} x2={121} y2={41} />}
      </g>;
    })}
    <path d="M78 86 C172 38 265 38 356 86 S536 135 587 76" className="ms-route-beam" />
    <text x="320" y="39" textAnchor="middle" className="science-note">geladen deeltjes kunnen door velden worden gestuurd</text>
    <g transform="translate(484 235)">
      <line x1="0" y1="42" x2="112" y2="42" className="science-axis" />
      <line x1="0" y1="42" x2="0" y2="0" className="science-axis" />
      <line x1="25" y1="42" x2="25" y2="25" className="spectrum-peak peak-0" />
      <line x1="57" y1="42" x2="57" y2="5" className="spectrum-peak peak-1" />
      <line x1="91" y1="42" x2="91" y2="29" className="spectrum-peak peak-2" />
      <text x="56" y="65" textAnchor="middle" className="science-note">massaspectrum</text>
    </g>
  </>;
}

function Ionization() {
  return <>
    <g transform="translate(45 73)">
      <rect width="190" height="150" rx="6" className="science-box" />
      <text x="95" y="32" textAnchor="middle" className="ms-diagram-label">neutraal monster</text>
      {[[55, 77], [98, 101], [143, 70]].map(([x, y], index) => <g key={index} transform={`translate(${x} ${y})`}><circle r="20" className="ms-neutral-particle" /><text y="6" textAnchor="middle" className="ms-diagram-label">M</text></g>)}
    </g>
    <Arrow x1={258} y1={149} x2={362} y2={149} />
    <text x="310" y="126" textAnchor="middle" className="science-note">energie</text>
    <g transform="translate(385 73)">
      <rect width="210" height="150" rx="6" className="science-box" />
      <text x="105" y="32" textAnchor="middle" className="ms-diagram-label">geladen deeltjes</text>
      <circle cx="68" cy="92" r="29" className="ms-ion-particle" />
      <text x="68" y="99" textAnchor="middle" className="ms-diagram-label">M⁺</text>
      <circle cx="151" cy="71" r="13" className="ms-electron-particle" />
      <text x="151" y="77" textAnchor="middle" className="ms-diagram-label">e⁻</text>
      <text x="105" y="133" textAnchor="middle" className="ms-diagram-note">vaak z = +1</text>
    </g>
    <text x="320" y="272" textAnchor="middle" className="science-note">Zonder lading reageren de deeltjes niet gericht op elektrische of magnetische velden.</text>
  </>;
}

function Deflection() {
  return <>
    <text x="320" y="38" textAnchor="middle" className="ms-diagram-label">zelfde lading, ander m/z</text>
    <rect x="58" y="63" width="524" height="188" rx="8" className="ms-field" />
    <path d="M84 157 C220 157 242 89 534 89" className="ms-path ms-path-low" />
    <path d="M84 157 C244 157 326 141 534 132" className="ms-path ms-path-mid" />
    <path d="M84 157 C274 157 383 177 534 180" className="ms-path ms-path-high" />
    <text x="475" y="76" textAnchor="middle" className="ms-diagram-note">lager m/z</text>
    <text x="481" y="122" textAnchor="middle" className="ms-diagram-note">midden</text>
    <text x="478" y="207" textAnchor="middle" className="ms-diagram-note">hoger m/z</text>
    <text x="320" y="288" textAnchor="middle" className="science-note">De precieze baan hangt af van apparaat en instellingen; het meetprincipe blijft scheiding op massa/lading.</text>
  </>;
}

function Detector() {
  return <>
    <g transform="translate(48 67)">
      <text x="95" y="0" textAnchor="middle" className="ms-diagram-label">aankomende ionen</text>
      {[0, 1, 2, 3].map((index) => <g key={index}><circle cx={30 + index * 43} cy={58 + (index % 2) * 25} r="13" className="ms-ion-particle" /><path d={`M${43 + index * 43} ${58 + (index % 2) * 25} H205`} className="ms-detector-ray" /></g>)}
      <rect x="205" y="28" width="28" height="92" rx="3" className="ms-detector-plate" />
      <text x="219" y="146" textAnchor="middle" className="ms-diagram-note">detector</text>
    </g>
    <Arrow x1={305} y1={145} x2={385} y2={145} />
    <g transform="translate(404 66)">
      <line x1="0" y1="154" x2="184" y2="154" className="science-axis" />
      <line x1="0" y1="154" x2="0" y2="10" className="science-axis" />
      <line x1="34" y1="154" x2="34" y2="103" className="spectrum-peak peak-0" />
      <line x1="81" y1="154" x2="81" y2="34" className="spectrum-peak peak-1" />
      <line x1="132" y1="154" x2="132" y2="82" className="spectrum-peak peak-2" />
      <text x="92" y="181" textAnchor="middle" className="science-note">m/z</text>
      <text x="-18" y="91" textAnchor="middle" transform="rotate(-90 -18 91)" className="science-note">signaal</text>
    </g>
    <text x="320" y="281" textAnchor="middle" className="science-note">Meer gedetecteerde ionen bij dezelfde m/z geven een sterker relatief signaal.</text>
  </>;
}

export function MassSpectrometerRouteDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  return <svg className={`science-svg ms-master-svg ms-route-${selected}`} viewBox="0 0 640 320" role="img" aria-label={`Massaspectrometer: ${selected}`}>
    {selected === "route" && <Route />}
    {selected === "ionization" && <Ionization />}
    {selected === "deflection" && <Deflection />}
    {selected === "detector" && <Detector />}
  </svg>;
}
