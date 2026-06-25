export function Pipette({ active }: { active: boolean }) {
  return <div className={`pipette-visual ${active ? "active" : ""}`} aria-label="Volumepipet voor het monster">
    <svg viewBox="0 0 270 72" role="img" aria-label="Volumepipet met maatstreep">
      <line x1="16" y1="36" x2="252" y2="36" className="pipette-line" />
      <ellipse cx="132" cy="36" rx="34" ry="14" className="pipette-bulb" />
      <line x1="178" y1="22" x2="178" y2="50" className="pipette-mark" />
      <text x="76" y="66" className="pipette-label">pipet voor bekend monstervolume</text>
    </svg>
  </div>;
}
