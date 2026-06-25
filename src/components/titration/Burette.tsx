import type { EndpointState, ValveSetting } from "../../types";

interface BuretteProps {
  startReadingMl: number;
  endReadingMl: number;
  currentAddedMl: number;
  valveSetting: ValveSetting;
  endpointState: EndpointState;
}

export function Burette({ startReadingMl, endReadingMl, currentAddedMl, valveSetting, endpointState }: BuretteProps) {
  const meniscusY = Math.min(318, 44 + endReadingMl * 5.1);
  const liquidHeight = Math.max(18, 318 - meniscusY);
  const ticks = Array.from({ length: 11 }, (_, index) => index * 5);
  const isDropping = valveSetting !== "dicht";

  return <div className="titration-burette-wrap">
    <svg className="lab-burette-svg" viewBox="0 0 150 390" role="img" aria-label="Buret met schaalverdeling, kraantje en meniscus">
      <line x1="15" y1="20" x2="15" y2="360" className="stand-line" />
      <rect x="51" y="30" width="38" height="305" rx="13" className="burette-glass" />
      <rect x="55" y={meniscusY} width="30" height={liquidHeight} className="burette-liquid" />
      <path d={`M55 ${meniscusY} C62 ${meniscusY + 5} 78 ${meniscusY + 5} 85 ${meniscusY}`} className="burette-meniscus" />
      {ticks.map((tick) => {
        const y = 44 + tick * 5.1;
        return <g key={tick}>
          <line x1="89" y1={y} x2="112" y2={y} className="burette-tick major" />
          <text x="116" y={y + 4} className="burette-tick-label">{tick}</text>
        </g>;
      })}
      {Array.from({ length: 50 }, (_, index) => index + 1).map((tick) => {
        if (tick % 5 === 0) return null;
        const y = 44 + tick * 5.1;
        return <line key={tick} x1="89" y1={y} x2="101" y2={y} className="burette-tick" />;
      })}
      <rect x="39" y="332" width="62" height="18" rx="5" className="stopcock" />
      <line x1="70" y1="350" x2="70" y2="374" className="burette-tip" />
      {isDropping && <g className={`falling-drops drops-${endpointState}`}>
        <circle cx="70" cy="374" r="4" />
        <circle cx="70" cy="392" r="3" />
      </g>}
      <text x="9" y="384" className="burette-caption">buret in statief</text>
    </svg>
    <div className="burette-readout">
      <span>beginstand {startReadingMl.toFixed(2)} mL</span>
      <strong>eindstand {endReadingMl.toFixed(2)} mL</strong>
      <span>toegevoegd {currentAddedMl.toFixed(2)} mL</span>
    </div>
  </div>;
}
