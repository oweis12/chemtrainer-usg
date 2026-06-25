import type { EndpointState } from "../../types";

export function Erlenmeyer({ endpointState, hasIndicator }: { endpointState: EndpointState; hasIndicator: boolean }) {
  const colorClass = hasIndicator ? `solution-${endpointState}` : "solution-no-indicator";
  const label = !hasIndicator ? "geen indicator" : endpointState === "voor" ? "kleurloos" : endpointState === "bijna" ? "licht roze" : endpointState === "goed" ? "blijvend lichtroze" : "te fel roze";

  return <div className="erlenmeyer-scene" aria-label="Erlenmeyer onder de buret">
    <svg className="erlenmeyer-svg" viewBox="0 0 230 210" role="img" aria-label={`Erlenmeyer met vloeistof: ${label}`}>
      <path d="M92 20 H138 L146 82 L205 188 H25 L84 82 Z" className="erlenmeyer-outline" />
      <path d="M68 152 C94 138 130 169 162 149 C178 140 194 145 204 153 L222 188 H8 L26 153 C40 142 52 141 68 152 Z" className={`erlenmeyer-solution ${colorClass}`} />
      <path d="M82 82 H148" className="erlenmeyer-neck-line" />
      <text x="54" y="202" className="erlenmeyer-label">erlenmeyer · {label}</text>
    </svg>
  </div>;
}
