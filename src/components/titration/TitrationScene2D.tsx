import { useEffect, useState } from "react";
import type { TitrationProcedureState } from "../../features/titrationLab/titrationEngine";
import "./TitrationScene2D.css";
export type ValveSetting = "closed" | "slow" | "fast";
export type EndpointState = "before" | "near" | "at" | "over";
export interface TitrationScene2DProps {
  currentAddedMl: number; buretCapacityMl?: number; buretStartMl: number;
  valveSetting: ValveSetting; endpointState: EndpointState; liquidColor: string;
  showSchellbach?: boolean; burette?: boolean; flask?: boolean; pipet?: boolean;
  mixedColor?: string;
  filled?: boolean; hasSample?: boolean; canDose?: boolean;
  onValveChange?: (setting: ValveSetting) => void;
  onDrop?: () => void;
  procedureAnimation?: keyof TitrationProcedureState | null;
}
const fmt = (n: number) => n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function TitrationScene2D({ currentAddedMl, buretCapacityMl = 50, buretStartMl, valveSetting, liquidColor, mixedColor, burette = true, flask = true, pipet = true, filled = true, hasSample = true, canDose = true, onValveChange, onDrop, procedureAnimation }: TitrationScene2DProps) {
  const [swirl, setSwirl] = useState(0);
  const [mixed, setMixed] = useState(false);
  useEffect(() => setMixed(false), [currentAddedMl, liquidColor]);
  const observedColor = mixed && mixedColor ? mixedColor : liquidColor;
  const reading = buretStartMl + currentAddedMl;
  const y = 60 + reading / buretCapacityMl * 280;
  const running = valveSetting !== "closed";
  const centre = Math.floor(reading * 10) / 10;
  return <div className="titration-scene-wrapper">
    <div className="lab-scene-heading"><span>WERKBANK / 01</span><span className={running ? "lab-running" : ""}>{running ? "Kraan open" : "Kraan gesloten"}</span></div>
    <svg viewBox="0 0 720 510" className="titration-scene-svg" role="img" aria-label={`Titratieopstelling. Buretstand ${fmt(reading)} milliliter. Kraan ${running ? "open" : "dicht"}.`}>
      <defs>
        <pattern id="lab-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#dce4de" strokeWidth=".6" /></pattern>
        <linearGradient id="lab-glass"><stop stopColor="#d5e8e5" stopOpacity=".65"/><stop offset=".4" stopColor="white" stopOpacity=".25"/><stop offset=".75" stopColor="white" stopOpacity=".85"/><stop offset="1" stopColor="#aac9c8" stopOpacity=".65"/></linearGradient>
        <linearGradient id="lab-metal"><stop stopColor="#596964"/><stop offset=".45" stopColor="#b5c3ba"/><stop offset="1" stopColor="#687971"/></linearGradient>
        <clipPath id="lab-flask"><path d="M318 372V401L277 462Q270 478 330 478Q390 478 383 462L342 401V372Z"/></clipPath>
      </defs>
      <rect width="720" height="510" fill="#f5f6ef"/><rect width="720" height="482" fill="url(#lab-grid)"/>
      <rect y="482" width="720" height="28" fill="#d9ddd1"/><path d="M0 482H720" stroke="#acb5a5"/>
      <ellipse cx="345" cy="481" rx="140" ry="7" fill="#344d3f" opacity=".08"/>
      <rect x="425" y="40" width="9" height="430" rx="4" fill="url(#lab-metal)"/>
      <path d="M399 476H472L460 464H408Z" fill="#53665b"/>
      <rect x="336" y="88" width="94" height="7" rx="3" fill="url(#lab-metal)"/><rect x="315" y="83" width="27" height="18" rx="4" fill="none" stroke="#53665b" strokeWidth="4"/>
      {burette && <g>
        <rect x="320" y="50" width="20" height="292" rx="4" fill="url(#lab-glass)" stroke="#83a6a1"/>
        {filled && <><rect x="323" y={y} width="14" height={Math.max(0,340-y)} fill="#bad9d9" opacity=".8"/><path d={`M323 ${y} Q330 ${y+4} 337 ${y}`} fill="none" stroke="#3f7e85" strokeWidth="1.5"/></>}
        <path d="M330 60V340" stroke="#428b9a" strokeWidth="1.5" opacity=".55"/>
        {Array.from({length:51},(_,i)=><g key={i}><path d={`M340 ${60+i*5.6}h${i%5===0?12:6}`} stroke="#647d74" strokeWidth=".8"/>{i%5===0&&<text x="359" y={63+i*5.6} className="lab-scale">{i}</text>}</g>)}
        <path d="M325 342V354H335V342M330 354V370" fill="url(#lab-glass)" stroke="#83a6a1"/>
        <g transform={`rotate(${running?0:90} 330 349)`}><rect x="314" y="345" width="32" height="8" rx="3" fill="#365f50"/><circle cx="330" cy="349" r="3" fill="#c9dacf"/></g>
        {running && [0,1,2].map(i=><circle key={i} cx="330" cy="363" r="2.5" fill="#80afb5" className="lab-falling-drop" style={{animationDelay:`${i*.22}s`}}/>)}
        <path d={`M318 ${y+2}H221L195 120`} fill="none" stroke="#819b8b" strokeDasharray="4 4"/>
      </g>}
      <g>
        <rect x="44" y="63" width="153" height="190" rx="3" fill="#fffef9" stroke="#bccbbd"/>
        <text x="59" y="86" className="lab-label">MENISCUS · 10×</text>
        <rect x="87" y="100" width="40" height="111" fill="url(#lab-glass)" stroke="#96b6af"/>
        {filled && <><rect x="89" y="153" width="36" height="57" fill="#d0e6e3"/><path d="M108 100V145L102 153L108 157L114 153L108 145M108 157V210" fill="#287b90"/><path d="M89 149Q108 164 125 149" fill="none" stroke="#346970" strokeWidth="1.6"/></>}
        {Array.from({length:7},(_,i)=>{const value=centre+(i-3)*.1;const tickY=157+(value-reading)*180;return value>=0&&value<=50&&tickY>=103&&tickY<=206?<g key={i}><path d={`M127 ${tickY}h10`} stroke="#536b60"/><text x="142" y={tickY+3} className="lab-scale">{value.toFixed(1).replace('.',',')}</text></g>:null;})}
        <text x="120" y="236" textAnchor="middle" className="lab-reading">{filled?`${fmt(reading)} mL`:"Buret leeg"}</text>
      </g>
      <rect x="260" y="472" width="140" height="10" rx="2" fill="#fffefa" stroke="#bbc5b5"/>
      {flask && <g key={swirl} className={swirl ? "lab-swirl" : ""}>
        <path d="M318 372V401L277 462Q270 478 330 478Q390 478 383 462L342 401V372Z" fill="url(#lab-glass)" stroke="#8aaca4" strokeWidth="1.6"/>
        {hasSample && <g clipPath="url(#lab-flask)"><rect x="273" y={443-Math.min(currentAddedMl*.5,25)} width="114" height="60" fill={observedColor} opacity=".8"/><ellipse cx="330" cy={443-Math.min(currentAddedMl*.5,25)} rx="58" ry="4" fill={observedColor}/></g>}
        <path d="M323 378V401L290 457" fill="none" stroke="white" strokeWidth="3" opacity=".9"/><ellipse cx="330" cy="373" rx="13" ry="3" fill="#f6faf6" stroke="#8aaca4"/>
      </g>}
      {pipet && <g transform="translate(106 350) rotate(-18)"><path d="M0 -45V0Q-9 5 -7 25Q-5 32 0 33V90H3V33Q10 29 10 15Q10 3 3 0V-45Z" fill="url(#lab-glass)" stroke="#7b9c96"/><path d="M-2 -23H5" stroke="#365e50"/></g>}
      <text x="492" y="104" className="lab-label">BURET</text><text x="492" y="123" className="lab-small">50 mL · titrant</text><path d="M479 109H446" stroke="#9cad9e"/>
      <text x="492" y="355" className="lab-label">KRAAN</text><text x="492" y="374" className="lab-small">Doseer hieronder</text>
      <text x="492" y="440" className="lab-label">ERLENMEYER</text><text x="492" y="459" className="lab-small">{hasSample?"Monsteroplossing":"Nog geen monster"}</text>
      <text x="44" y="296" className="lab-label">V = EIND − BEGIN</text><text x="44" y="319" className="lab-reading">{fmt(currentAddedMl)} mL</text>
      {procedureAnimation && <text x="44" y="38" className="lab-label">{({rinsedBurette:"Buret gespoeld",rinsedPipette:"Pipet gespoeld",pipettedSample:"Monster overgebracht",addedIndicator:"Indicator toegevoegd",filledBurette:"Buret gevuld",readStart:"Beginstand genoteerd",titratedSlowly:"Druppelsgewijs doseren",stoppedAtEndpoint:"Meting gestopt",readEnd:"Eindstand genoteerd"})[procedureAnimation]}</text>}
    </svg>
    <div className="titration-valve-controls" aria-label="Kraan bedienen">
      {(["closed","slow","fast"] as const).map(s=><button key={s} disabled={s!=="closed"&&!canDose} className={`titration-valve-btn ${valveSetting===s?"titration-valve-btn--active":""}`} aria-pressed={valveSetting===s} onClick={()=>onValveChange?.(s)}>{s==="closed"?"Stop":s==="slow"?"Druppelen":"Doorlopen"}</button>)}
      <button className="titration-valve-btn" disabled={!canDose||running} onClick={onDrop}>+ 1 druppel · 0,03 mL</button>
      <button className="titration-valve-btn" disabled={!hasSample} onClick={()=>{setSwirl(n=>n+1);setMixed(true);}}>Zwenken</button>
    </div>
    <p className="lab-control-note">{canDose?"Lees de onderkant van de meniscus af. Doseer bij de omslag één druppel tegelijk.":"Bereid het monster voor, vul de buret en noteer de beginstand voordat je doseert."}</p>
  </div>;
}
