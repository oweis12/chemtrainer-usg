type AtomicModelVariant = "thomson" | "rutherford" | "bohr" | "goldFoil" | "drawingGuide";

const variants = new Set<AtomicModelVariant>(["thomson", "rutherford", "bohr", "goldFoil", "drawingGuide"]);

function activeVariant(value?: string): AtomicModelVariant {
  return value && variants.has(value as AtomicModelVariant) ? value as AtomicModelVariant : "rutherford";
}

function Label({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return <text x={x} y={y} className="science-label">{children}</text>;
}

function Note({ x, y, children, anchor = "start" }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} textAnchor={anchor} className="science-note">{children}</text>;
}

function Electron({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r="9" className="atomic-electron" /><text y="4" textAnchor="middle" className="atomic-electron-label">e-</text></g>;
}

function Nucleus({ x = 360, y = 126, compact = false }: { x?: number; y?: number; compact?: boolean }) {
  const radius = compact ? 28 : 38;
  return <g transform={`translate(${x} ${y})`}>
    <circle r={radius} className="atomic-nucleus" />
    <text y="-4" textAnchor="middle" className="science-label">kern</text>
    <text y="14" textAnchor="middle" className="science-note">p+ / n</text>
  </g>;
}

function Thomson({ markerId }: { markerId: string }) {
  const electrons = [[300, 106], [352, 76], [405, 114], [333, 162], [432, 158], [385, 196]];
  return <>
    <circle cx="360" cy="138" r="96" className="atomic-positive-cloud" />
    <circle cx="360" cy="138" r="68" className="atomic-cloud-inner" />
    {electrons.map(([x, y]) => <Electron key={`${x}-${y}`} x={x} y={y} />)}
    <line x1="224" y1="72" x2="300" y2="100" className="science-arrow" markerEnd={`url(#${markerId})`} />
    <Label x={36} y={68}>positieve massa verspreid</Label>
    <Note x={36} y={88}>geen kleine kern in dit model</Note>
    <line x1="548" y1="92" x2="410" y2="116" className="science-arrow" markerEnd={`url(#${markerId})`} />
    <Label x={553} y={87}>elektronen zitten erin</Label>
    <Note x={553} y={107}>als rozijnen in een bol</Note>
  </>;
}

function Rutherford({ markerId }: { markerId: string }) {
  return <>
    <circle cx="360" cy="132" r="96" className="atomic-empty-space" />
    <Nucleus />
    <Electron x={240} y={76} />
    <Electron x={504} y={96} />
    <Electron x={282} y={204} />
    <Electron x={470} y={202} />
    <line x1="470" y1="126" x2="398" y2="126" className="science-arrow" markerEnd={`url(#${markerId})`} />
    <Label x={482} y={119}>kleine positieve kern</Label>
    <Note x={482} y={139}>bijna alle massa hier</Note>
    <line x1="214" y1="192" x2="306" y2="165" className="science-arrow" markerEnd={`url(#${markerId})`} />
    <Label x={42} y={194}>veel lege ruimte</Label>
    <Note x={42} y={214}>de meeste deeltjes gaan erdoor</Note>
  </>;
}

function Bohr({ markerId }: { markerId: string }) {
  return <>
    <circle cx="360" cy="132" r="60" className="atomic-shell" />
    <circle cx="360" cy="132" r="105" className="atomic-shell" />
    <Nucleus compact />
    <Electron x={304} y={132} />
    <Electron x={416} y={132} />
    <Electron x={360} y={27} />
    <Electron x={453} y={181} />
    <Electron x={267} y={181} />
    <line x1="518" y1="48" x2="386" y2="38" className="science-arrow" markerEnd={`url(#${markerId})`} />
    <Label x={524} y={43}>elektronen per schil</Label>
    <Note x={524} y={63}>vaste banen in het model</Note>
    <line x1="166" y1="108" x2="320" y2="123" className="science-arrow" markerEnd={`url(#${markerId})`} />
    <Label x={42} y={105}>kern blijft centraal</Label>
    <Note x={42} y={125}>p+ en n in het midden</Note>
  </>;
}

function GoldFoil({ markerId }: { markerId: string }) {
  const straightY = [74, 108, 144, 180];
  return <>
    <rect x="312" y="42" width="18" height="172" className="atomic-foil" />
    <text x="321" y="232" textAnchor="middle" className="science-note">dun goudfolie</text>
    <rect x="42" y="100" width="74" height="56" className="science-box" />
    <text x="79" y="125" textAnchor="middle" className="science-label">alfa</text>
    <text x="79" y="144" textAnchor="middle" className="science-note">bron</text>
    {straightY.map((y) => <line key={y} x1="126" y1={y} x2="646" y2={y} className="atomic-alpha-ray" markerEnd={`url(#${markerId})`} />)}
    <path d="M126 56 C230 56 286 56 320 66 C370 80 430 34 484 18" className="atomic-alpha-ray atomic-deflected" markerEnd={`url(#${markerId})`} />
    <path d="M126 206 C230 206 286 206 320 196 C374 178 420 230 470 240" className="atomic-alpha-ray atomic-deflected" markerEnd={`url(#${markerId})`} />
    <path d="M128 28 C228 44 288 72 319 100 C284 126 226 116 172 88" className="atomic-alpha-ray atomic-backscatter" markerEnd={`url(#${markerId})`} />
    <Label x={438} y={114}>meeste deeltjes rechtdoor</Label>
    <Note x={438} y={134}>atoom is grotendeels leeg</Note>
    <Label x={384} y={221}>enkele sterk afgebogen</Label>
    <Note x={384} y={241}>kleine positieve kern</Note>
  </>;
}

function DrawingGuide({ markerId }: { markerId: string }) {
  const cards = [
    { title: "1 kern", note: "midden", x: 42 },
    { title: "2 p+ / n", note: "in de kern", x: 208 },
    { title: "3 e- / schillen", note: "buiten de kern", x: 374 },
    { title: "4 labels check", note: "lading klopt", x: 540 },
  ];
  return <>
    {cards.map((card, index) => <g key={card.title} transform={`translate(${card.x} 48)`}>
      <rect width="132" height="150" className="science-box" />
      <text x="66" y="25" textAnchor="middle" className="science-label">{card.title}</text>
      <text x="66" y="138" textAnchor="middle" className="science-note">{card.note}</text>
      {index === 0 && <g transform="translate(66 78)"><circle r="25" className="atomic-nucleus" /><text y="5" textAnchor="middle" className="science-note">kern</text></g>}
      {index === 1 && <g transform="translate(66 78)"><circle r="31" className="atomic-nucleus" /><text y="-4" textAnchor="middle" className="science-note">p+</text><text y="14" textAnchor="middle" className="science-note">n</text></g>}
      {index === 2 && <g transform="translate(66 78)"><circle r="28" className="atomic-shell" /><circle r="47" className="atomic-shell" /><circle cx="-28" cy="0" r="6" className="atomic-electron" /><circle cx="28" cy="0" r="6" className="atomic-electron" /><circle cx="0" cy="-47" r="6" className="atomic-electron" /></g>}
      {index === 3 && <g transform="translate(66 78)"><path d="M-40 -26 H40 M-40 0 H40 M-40 26 H18" className="atomic-check-lines" /><circle cx="42" cy="26" r="9" className="atomic-check-dot" /></g>}
      {index < cards.length - 1 && <line x1="137" y1="75" x2="158" y2="75" className="science-arrow" markerEnd={`url(#${markerId})`} />}
    </g>)}
  </>;
}

export function AtomicModelsDiagram({ variant }: { variant?: string }) {
  const selected = activeVariant(variant);
  const markerId = `atomic-arrow-${selected}`;

  return <svg className={`science-svg atomic-model-svg atomic-model-${selected}`} viewBox="0 0 720 270" role="img" aria-label={`Atoommodel diagram: ${selected}`}>
    <defs>
      <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="currentColor" /></marker>
    </defs>
    {selected === "thomson" && <Thomson markerId={markerId} />}
    {selected === "rutherford" && <Rutherford markerId={markerId} />}
    {selected === "bohr" && <Bohr markerId={markerId} />}
    {selected === "goldFoil" && <GoldFoil markerId={markerId} />}
    {selected === "drawingGuide" && <DrawingGuide markerId={markerId} />}
  </svg>;
}
