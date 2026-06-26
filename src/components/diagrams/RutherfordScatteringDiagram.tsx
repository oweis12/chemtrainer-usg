export function RutherfordScatteringDiagram() {
  const markerId = "rutherford-alpha-arrow";
  const straight = [76, 112, 148, 184];

  return <svg className="science-svg rutherford-scattering-svg" viewBox="0 0 760 300" role="img" aria-label="Rutherford goudfolie-experiment met alfadeeltjes">
    <defs>
      <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="currentColor" /></marker>
    </defs>
    <rect x="42" y="118" width="92" height="60" className="science-box rutherford-source" />
    <text x="88" y="143" textAnchor="middle" className="science-label">alfa</text>
    <text x="88" y="162" textAnchor="middle" className="science-note">bron</text>

    <rect x="328" y="48" width="20" height="188" className="rutherford-foil" />
    <text x="338" y="260" textAnchor="middle" className="science-note">goudfolie</text>

    <circle cx="510" cy="142" r="118" className="rutherford-detector" />
    <path d="M510 24 A118 118 0 0 1 510 260" className="rutherford-screen" />
    <text x="595" y="42" textAnchor="middle" className="science-note">detectiescherm</text>

    {straight.map((y) => <line key={y} x1="146" y1={y} x2="680" y2={y} className="rutherford-ray rutherford-ray-straight" markerEnd={`url(#${markerId})`} />)}
    <path d="M146 52 C234 53 301 57 338 72 C397 95 452 42 512 28" className="rutherford-ray rutherford-ray-deflect" markerEnd={`url(#${markerId})`} />
    <path d="M146 220 C236 219 302 214 338 198 C397 173 448 238 512 258" className="rutherford-ray rutherford-ray-deflect" markerEnd={`url(#${markerId})`} />
    <path d="M148 28 C230 45 295 82 337 116 C300 142 240 137 184 100" className="rutherford-ray rutherford-ray-back" markerEnd={`url(#${markerId})`} />

    <g className="rutherford-label-card" transform="translate(474 101)">
      <rect width="120" height="34" />
      <text x="60" y="22" textAnchor="middle" className="science-note">meeste</text>
    </g>
    <g className="rutherford-label-card" transform="translate(486 214)">
      <rect width="120" height="34" />
      <text x="60" y="22" textAnchor="middle" className="science-note">enkele</text>
    </g>
    <g className="rutherford-label-card" transform="translate(164 51)">
      <rect width="120" height="34" />
      <text x="60" y="22" textAnchor="middle" className="science-note">heel weinig</text>
    </g>
  </svg>;
}
