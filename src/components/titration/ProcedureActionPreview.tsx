/**
 * ProcedureActionPreview.tsx
 *
 * Close-up mini cutscene shown when a procedure step button is clicked.
 * Physically correct, CSS-keyframe only, no external animation lib.
 * Respects prefers-reduced-motion.
 * Dutch labels throughout.
 *
 * Usage:
 *   <ProcedureActionPreview action={activeProcedureAnimation} />
 */

import React from "react";
import type { TitrationProcedureState } from "../../features/titrationLab/titrationEngine";
import "./ProcedureActionPreview.css";

export type ProcedureActionKey = keyof TitrationProcedureState;

interface ProcedureActionPreviewProps {
  action: ProcedureActionKey | null;
}

// ── Placeholder ────────────────────────────────────────────────────────────

const Placeholder: React.FC = () => (
  <div className="pap-placeholder">
    <svg viewBox="0 0 200 120" width="200" height="120" aria-hidden="true">
      {/* Buret outline */}
      <rect x="88" y="10" width="14" height="70" rx="2" fill="none" stroke="#9ab4cc" strokeWidth="1.5" />
      <rect x="86" y="78" width="18" height="6" rx="1" fill="none" stroke="#9ab4cc" strokeWidth="1.5" />
      <line x1="95" y1="84" x2="95" y2="95" stroke="#9ab4cc" strokeWidth="1.5" />
      {/* Flask outline */}
      <ellipse cx="95" cy="108" rx="22" ry="8" fill="none" stroke="#9ab4cc" strokeWidth="1.5" />
      <line x1="73" y1="108" x2="82" y2="96" stroke="#9ab4cc" strokeWidth="1.5" />
      <line x1="117" y1="108" x2="108" y2="96" stroke="#9ab4cc" strokeWidth="1.5" />
      <ellipse cx="95" cy="96" rx="13" ry="4" fill="none" stroke="#9ab4cc" strokeWidth="1.5" />
    </svg>
    <p className="pap-placeholder-text">Klik op een procedurestap om een animatie te zien.</p>
  </div>
);

// ── FilledBurette ──────────────────────────────────────────────────────────

const FilledBurette: React.FC = () => (
  <div className="pap-scene" aria-label="Buret vullen animatie">
    <svg viewBox="0 0 200 160" className="pap-svg" aria-hidden="true">
      {/* Funnel / bottle above buret */}
      <polygon points="80,8 120,8 108,32 92,32" fill="#d4eaf5" stroke="#7ab8d8" strokeWidth="1.5" />
      <rect x="92" y="32" width="16" height="8" rx="2" fill="#d4eaf5" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Titrant stream from funnel into buret */}
      <line x1="100" y1="40" x2="100" y2="60" className="pap-fill-stream" stroke="#5badda" strokeWidth="4" strokeLinecap="round" />
      {/* Buret tube */}
      <rect x="88" y="58" width="24" height="80" rx="3" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Rising liquid inside buret */}
      <rect x="90" y="100" width="20" height="36" rx="2" className="pap-buret-liquid" fill="#7ac8e8" />
      {/* Buret scale marks */}
      {[68, 78, 88, 98, 108, 118, 128].map((y, i) => (
        <line key={i} x1="112" y1={y} x2={i % 2 === 0 ? 118 : 115} y2={y} stroke="#5a8aa8" strokeWidth="1" />
      ))}
      {/* Valve */}
      <rect x="84" y="138" width="32" height="8" rx="3" fill="#b0d8f0" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="100" y1="146" x2="100" y2="152" stroke="#5a8aa8" strokeWidth="2" />
    </svg>
    <p className="pap-caption">De buret wordt gevuld met een oplossing met bekende molariteit.</p>
  </div>
);

// ── RinsedBurette ──────────────────────────────────────────────────────────

const RinsedBurette: React.FC = () => (
  <div className="pap-scene" aria-label="Buret spoelen animatie">
    <svg viewBox="0 0 200 170" className="pap-svg" aria-hidden="true">
      {/* Buret tube */}
      <rect x="88" y="20" width="24" height="90" rx="3" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Liquid inside buret */}
      <rect x="90" y="22" width="20" height="40" rx="2" fill="#7ac8e8" />
      {/* Valve open */}
      <rect x="84" y="110" width="32" height="8" rx="3" fill="#b0d8f0" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="100" y1="118" x2="100" y2="128" stroke="#5a8aa8" strokeWidth="2" />
      {/* Rinse stream going DOWN to waste beaker */}
      <line x1="100" y1="128" x2="100" y2="148" className="pap-rinse-stream" stroke="#5badda" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="100" cy="152" rx="3" ry="2" className="pap-rinse-drop pap-rinse-drop-1" fill="#5badda" />
      <ellipse cx="100" cy="152" rx="3" ry="2" className="pap-rinse-drop pap-rinse-drop-2" fill="#5badda" />
      {/* Waste beaker (afvalbekertje) */}
      <rect x="76" y="152" width="48" height="14" rx="2" fill="#e8f0f5" stroke="#7ab8d8" strokeWidth="1.5" />
      <text x="100" y="162" textAnchor="middle" className="pap-label-small">afval</text>
      {/* Arrow indicating down */}
      <text x="110" y="140" className="pap-label-small" fill="#5a8aa8">↓</text>
    </svg>
    <p className="pap-caption">Je spoelt de buret met titrant en laat dit naar afval lopen.</p>
  </div>
);

// ── RinsedPipette ──────────────────────────────────────────────────────────

const RinsedPipette: React.FC = () => (
  <div className="pap-scene" aria-label="Pipet spoelen animatie">
    <svg viewBox="0 0 200 160" className="pap-svg" aria-hidden="true">
      {/* Pipet — stays static/visible the entire time */}
      {/* Bulb */}
      <ellipse cx="100" cy="68" rx="16" ry="22" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Top stem */}
      <rect x="97" y="10" width="6" height="48" rx="2" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Bottom stem */}
      <rect x="97" y="90" width="6" height="50" rx="2" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Tip */}
      <polygon points="97,140 103,140 101,152 99,152" fill="#c8dcea" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Liquid filling the bulb (animated) */}
      <ellipse cx="100" cy="78" rx="13" ry="10" className="pap-pipet-fill" fill="#7ac8e8" />
      {/* Drain drop from tip */}
      <ellipse cx="100" cy="154" rx="3" ry="2.5" className="pap-pipet-drain" fill="#5badda" />
    </svg>
    <p className="pap-caption">Je spoelt de pipet met monsteroplossing.</p>
  </div>
);

// ── PipettedSample ─────────────────────────────────────────────────────────

const PipettedSample: React.FC = () => (
  <div className="pap-scene" aria-label="Pipetteren animatie">
    <svg viewBox="0 0 200 170" className="pap-svg" aria-hidden="true">
      {/* Pipet tip above erlenmeyer mouth — close-up */}
      {/* Pipet bottom stem */}
      <rect x="97" y="10" width="6" height="40" rx="2" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Bulb */}
      <ellipse cx="100" cy="62" rx="16" ry="20" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Liquid in bulb */}
      <ellipse cx="100" cy="70" rx="13" ry="12" fill="#7ac8e8" />
      {/* Lower stem */}
      <rect x="97" y="82" width="6" height="40" rx="2" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Tip */}
      <polygon points="97,122 103,122 101,134 99,134" fill="#c8dcea" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Drops falling into erlenmeyer */}
      <ellipse cx="100" cy="138" rx="3" ry="2.5" className="pap-sample-drop pap-sample-drop-1" fill="#5badda" />
      <ellipse cx="100" cy="138" rx="3" ry="2.5" className="pap-sample-drop pap-sample-drop-2" fill="#5badda" />
      <ellipse cx="100" cy="138" rx="3" ry="2.5" className="pap-sample-drop pap-sample-drop-3" fill="#5badda" />
      {/* Erlenmeyer mouth - close-up */}
      <ellipse cx="100" cy="152" rx="20" ry="5" fill="#d8ecf5" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="80" y1="152" x2="68" y2="168" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="120" y1="152" x2="132" y2="168" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Highlight in flask */}
      <ellipse cx="100" cy="163" rx="16" ry="4" className="pap-flask-highlight" fill="#aaddf0" />
    </svg>
    <p className="pap-caption">Je brengt een nauwkeurig volume monsteroplossing in de erlenmeyer.</p>
  </div>
);

// ── AddedIndicator ─────────────────────────────────────────────────────────

const AddedIndicator: React.FC = () => (
  <div className="pap-scene" aria-label="Indicator toevoegen animatie">
    <svg viewBox="0 0 200 170" className="pap-svg" aria-hidden="true">
      {/* Indicator dropper bottle */}
      <rect x="84" y="10" width="32" height="40" rx="4" fill="#f9e8f8" stroke="#c078c0" strokeWidth="1.5" />
      <rect x="93" y="6" width="14" height="10" rx="2" fill="#f0c8f0" stroke="#c078c0" strokeWidth="1.5" />
      <rect x="96" y="16" width="8" height="8" rx="1" fill="#e0a0e0" stroke="#c078c0" strokeWidth="1" />
      {/* Bottle label */}
      <text x="100" y="38" textAnchor="middle" className="pap-label-small" fill="#9030a0">ind.</text>
      {/* Dropper tip */}
      <polygon points="96,50 104,50 102,62 98,62" fill="#f0c8f0" stroke="#c078c0" strokeWidth="1.5" />
      {/* Colored drops */}
      <ellipse cx="100" cy="68" rx="3.5" ry="3" className="pap-indicator-drop pap-indicator-drop-1" fill="#cc66cc" />
      <ellipse cx="100" cy="68" rx="3.5" ry="3" className="pap-indicator-drop pap-indicator-drop-2" fill="#cc66cc" />
      <ellipse cx="100" cy="68" rx="3.5" ry="3" className="pap-indicator-drop pap-indicator-drop-3" fill="#cc66cc" />
      <ellipse cx="100" cy="68" rx="3.5" ry="3" className="pap-indicator-drop pap-indicator-drop-4" fill="#cc66cc" />
      {/* Erlenmeyer mouth */}
      <ellipse cx="100" cy="110" rx="28" ry="7" fill="#e8f5fa" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="72" y1="110" x2="56" y2="135" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="128" y1="110" x2="144" y2="135" stroke="#7ab8d8" strokeWidth="1.5" />
      <ellipse cx="56" cy="140" rx="22" ry="8" fill="#e8f5fa" stroke="#7ab8d8" strokeWidth="1.5" />
      <line x1="56" y1="140" x2="78" y2="140" stroke="#7ab8d8" strokeWidth="0.5" />
      <line x1="56" y1="140" x2="144" y2="140" stroke="#7ab8d8" strokeWidth="0.5" />
      <ellipse cx="144" cy="140" rx="22" ry="8" fill="#e8f5fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Flask liquid with pink hint */}
      <ellipse cx="100" cy="126" rx="24" ry="6" className="pap-indicator-highlight" fill="#f0c0f0" />
    </svg>
    <p className="pap-caption">De indicator laat straks het eindpunt zien.</p>
  </div>
);

// ── ReadingPanel (shared for readStart / readEnd) ──────────────────────────

const ReadingPanel: React.FC = () => (
  <div className="pap-scene" aria-label="Buret aflezen animatie">
    <svg viewBox="0 0 200 160" className="pap-svg" aria-hidden="true">
      {/* Buret close-up */}
      <rect x="78" y="10" width="44" height="120" rx="3" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Liquid */}
      <rect x="80" y="12" width="40" height="55" rx="2" fill="#7ac8e8" />
      {/* Meniscus curve */}
      <path d="M80,67 Q100,78 120,67" fill="#5badda" className="pap-meniscus" />
      {/* Scale marks with numbers */}
      {[
        [18, "0"],
        [29, ""],
        [40, "5"],
        [51, ""],
        [62, "10"],
        [73, ""],
        [84, "15"],
        [95, ""],
        [106, "20"],
      ].map(([y, label], i) => (
        <g key={i}>
          <line x1="122" y1={Number(y)} x2={i % 2 === 0 ? 130 : 126} y2={Number(y)} stroke="#5a8aa8" strokeWidth={i % 2 === 0 ? 1.5 : 1} />
          {label && <text x="133" y={Number(y) + 3} className="pap-scale-text" fill="#3a6a88">{label}</text>}
        </g>
      ))}
      {/* Eye-level line at meniscus bottom */}
      <line x1="30" y1="73" x2="170" y2="73" className="pap-eye-line" stroke="#e04040" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Eye icon */}
      <ellipse cx="22" cy="73" rx="8" ry="5" fill="#fff" stroke="#c03030" strokeWidth="1.2" />
      <circle cx="22" cy="73" r="3" fill="#c03030" />
      {/* Label */}
      <text x="36" y="88" className="pap-label-small" fill="#c03030">onderkant meniscus</text>
    </svg>
    <p className="pap-caption">Lees de onderkant van de meniscus af op ooghoogte.</p>
  </div>
);

// ── TitratedSlowly ─────────────────────────────────────────────────────────

const TitratedSlowly: React.FC = () => (
  <div className="pap-scene" aria-label="Langzaam druppelen animatie">
    <svg viewBox="0 0 200 160" className="pap-svg" aria-hidden="true">
      {/* Buret tip close-up */}
      <rect x="88" y="10" width="24" height="60" rx="3" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Liquid */}
      <rect x="90" y="12" width="20" height="30" rx="2" fill="#7ac8e8" />
      {/* Valve */}
      <rect x="84" y="70" width="32" height="8" rx="3" fill="#aacce8" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Valve handle rotated slightly (open) */}
      <rect x="96" y="66" width="8" height="16" rx="2" fill="#5a8aa8" />
      {/* Tip */}
      <line x1="100" y1="78" x2="100" y2="92" stroke="#5a8aa8" strokeWidth="2.5" />
      {/* Slow separated drops — 3 drops at different stages */}
      <ellipse cx="100" cy="96" rx="3.5" ry="4" className="pap-slow-drop pap-slow-drop-1" fill="#5badda" />
      <ellipse cx="100" cy="96" rx="3.5" ry="4" className="pap-slow-drop pap-slow-drop-2" fill="#5badda" />
      <ellipse cx="100" cy="96" rx="3.5" ry="4" className="pap-slow-drop pap-slow-drop-3" fill="#5badda" />
      {/* Label showing spacing */}
      <line x1="118" y1="100" x2="140" y2="100" stroke="#9ab4cc" strokeWidth="1" strokeDasharray="3 2" />
      <text x="142" y="104" className="pap-label-small" fill="#5a8aa8">druppels</text>
      <text x="142" y="114" className="pap-label-small" fill="#5a8aa8">gescheiden</text>
    </svg>
    <p className="pap-caption">Rond het eindpunt voorkom je overshoot door langzaam te druppelen.</p>
  </div>
);

// ── StoppedAtEndpoint ──────────────────────────────────────────────────────

const StoppedAtEndpoint: React.FC = () => (
  <div className="pap-scene" aria-label="Eindpunt animatie">
    <svg viewBox="0 0 200 170" className="pap-svg" aria-hidden="true">
      {/* Buret bottom */}
      <rect x="88" y="10" width="24" height="50" rx="3" fill="#e8f3fa" stroke="#7ab8d8" strokeWidth="1.5" />
      {/* Valve CLOSED - handle horizontal */}
      <rect x="84" y="60" width="32" height="8" rx="3" fill="#aacce8" stroke="#7ab8d8" strokeWidth="1.5" />
      <rect x="82" y="62" width="36" height="4" rx="2" fill="#5a8aa8" />
      {/* Tip with no drop */}
      <line x1="100" y1="68" x2="100" y2="80" stroke="#5a8aa8" strokeWidth="2" />
      {/* Erlenmeyer with light pink color */}
      <ellipse cx="100" cy="100" rx="20" ry="5" fill="#f5e0f5" stroke="#c0a0c0" strokeWidth="1.5" />
      <line x1="80" y1="100" x2="64" y2="128" stroke="#c0a0c0" strokeWidth="1.5" />
      <line x1="120" y1="100" x2="136" y2="128" stroke="#c0a0c0" strokeWidth="1.5" />
      <ellipse cx="100" cy="133" rx="36" ry="10" fill="#fce8fc" stroke="#c0a0c0" strokeWidth="1.5" />
      {/* Light pink liquid */}
      <ellipse cx="100" cy="125" rx="32" ry="7" className="pap-endpoint-pink" fill="#f5c8f0" />
      {/* Checkmark */}
      <circle cx="158" cy="90" r="12" fill="#4caf50" opacity="0.9" />
      <polyline points="152,90 157,96 166,83" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Label */}
      <text x="100" y="158" textAnchor="middle" className="pap-label-small" fill="#9030a0">licht roze ✓</text>
    </svg>
    <p className="pap-caption">Stop bij een blijvende lichte kleur, niet bij felroze.</p>
  </div>
);

// ── Action map ─────────────────────────────────────────────────────────────

const ACTION_COMPONENTS: Record<ProcedureActionKey, React.FC> = {
  filledBurette: FilledBurette,
  rinsedBurette: RinsedBurette,
  rinsedPipette: RinsedPipette,
  pipettedSample: PipettedSample,
  addedIndicator: AddedIndicator,
  readStart: ReadingPanel,
  readEnd: ReadingPanel,
  titratedSlowly: TitratedSlowly,
  stoppedAtEndpoint: StoppedAtEndpoint,
};

// ── Main export ────────────────────────────────────────────────────────────

export const ProcedureActionPreview: React.FC<ProcedureActionPreviewProps> = ({ action }) => {
  const ActionComponent = action ? ACTION_COMPONENTS[action] : null;

  return (
    <div className="pap-wrapper" role="region" aria-label="Procedure animatie">
      {ActionComponent ? <ActionComponent /> : <Placeholder />}
    </div>
  );
};
