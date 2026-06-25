import type { ValveSetting } from "../../types";

const settings: Array<{ id: ValveSetting; label: string; help: string }> = [
  { id: "dicht", label: "dicht", help: "geen druppels" },
  { id: "langzaam", label: "langzaam druppelen", help: "veilig bij eindpunt" },
  { id: "normaal", label: "normaal", help: "voor beginfase" },
  { id: "snel", label: "snel", help: "risico op overshoot" },
];

export function ValveControl({ value, onChange }: { value: ValveSetting; onChange: (next: ValveSetting) => void }) {
  return <div className="valve-control">
    <span className="section-kicker">Kraantje</span>
    <div className="valve-options">
      {settings.map((setting) => <button key={setting.id} className={value === setting.id ? "active" : ""} onClick={() => onChange(setting.id)}>
        <strong>{setting.label}</strong>
        <small>{setting.help}</small>
      </button>)}
    </div>
  </div>;
}
