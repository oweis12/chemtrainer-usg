/**
 * TitrationScene2D.tsx
 * Isolated 2D titration lab scene component.
 * Scene = drawing + limited interaction via props/callbacks only.
 * No chemistry logic here — all endpoint/color/score decisions stay in the engine.
 *
 * Props contract mirrors CONTRACT.md:
 *   - currentAddedMl, valveSetting, endpointState, liquidColor
 *   - onValveChange, onDrop
 *   - buretStartMl, showSchellbach
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ValveSetting = "closed" | "slow" | "fast";

export type EndpointState = "before" | "near" | "at" | "over";

export interface TitrationScene2DProps {
  /** mL already added from buret (drives liquid level + scale reading) */
  currentAddedMl: number;
  /** buret capacity in mL, typically 50 */
  buretCapacityMl?: number;
  /** starting reading on buret (mL), e.g. 0.00 */
  buretStartMl: number;
  /** current valve position */
  valveSetting: ValveSetting;
  /** endpoint state supplied by engine — drives flask color */
  endpointState: EndpointState;
  /** RGB/hex color for flask liquid (engine-computed) */
  liquidColor: string;
  /** show Schellbach stripe on buret */
  showSchellbach?: boolean;
  /** whether setup components are placed */
  burette?: boolean;
  flask?: boolean;
  pipet?: boolean;
  /** callbacks */
  onValveChange?: (setting: ValveSetting) => void;
  /** called each animation frame a drop falls — engine increments volume */
  onDropInterval?: (mlPerDrop: number) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BURET_HEIGHT_PX = 340;
const BURET_TOP_Y = 60;
const BURET_X = 210;
const FLASK_CX = 210;
const FLASK_TOP_Y = 460;
const VALVE_Y = BURET_TOP_Y + BURET_HEIGHT_PX + 8;
const TILE_Y = 540;

const ML_PER_DROP_SLOW = 0.05;
const ML_PER_DROP_FAST = 0.5;
const DROP_INTERVAL_SLOW_MS = 600;
const DROP_INTERVAL_FAST_MS = 120;

// Buret scale: 0 at top, 50 at bottom (standard chemistry buret)
function mlToY(ml: number, capacity = 50): number {
  return BURET_TOP_Y + (ml / capacity) * BURET_HEIGHT_PX;
}

function flaskFillHeight(volumeMl: number): number {
  // Flask holds ~150 mL analyte; extra titrant raises level slightly
  const base = 48; // px of starting analyte
  const extra = Math.min(volumeMl * 0.6, 40);
  return base + extra;
}

// ─── Drop animation state ─────────────────────────────────────────────────────

interface Drop {
  id: number;
  y: number;
  opacity: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const TitrationScene2D: React.FC<TitrationScene2DProps> = ({
  currentAddedMl,
  buretCapacityMl = 50,
  buretStartMl,
  valveSetting,
  endpointState,
  liquidColor,
  showSchellbach = false,
  burette = true,
  flask = true,
  pipet = false,
  onValveChange,
  onDropInterval,
}) => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const dropIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // ── Drop animation loop ──────────────────────────────────────────────────
  const spawnDrop = useCallback(() => {
    const id = dropIdRef.current++;
    setDrops((prev) => [...prev, { id, y: VALVE_Y + 12, opacity: 1 }]);
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (valveSetting === "closed") {
      setDrops([]);
      return;
    }

    const intervalMs =
      valveSetting === "slow" ? DROP_INTERVAL_SLOW_MS : DROP_INTERVAL_FAST_MS;
    const mlPerDrop =
      valveSetting === "slow" ? ML_PER_DROP_SLOW : ML_PER_DROP_FAST;

    intervalRef.current = setInterval(() => {
      spawnDrop();
      onDropInterval?.(mlPerDrop);
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [valveSetting, spawnDrop, onDropInterval]);

  // Animate drops falling
  useEffect(() => {
    const animate = () => {
      setDrops((prev) =>
        prev
          .map((d) => ({ ...d, y: d.y + 4, opacity: d.y > FLASK_TOP_Y - 10 ? 0 : d.opacity }))
          .filter((d) => d.y < FLASK_TOP_Y + 10)
      );
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // ── Derived geometry ─────────────────────────────────────────────────────
  const currentReadingMl = buretStartMl + currentAddedMl;
  const liquidTopY = mlToY(currentReadingMl, buretCapacityMl);
  const fillH = flaskFillHeight(currentAddedMl);

  // Flask liquid color transition
  const flaskLiquidColor = liquidColor;

  // ── Scale ticks ──────────────────────────────────────────────────────────
  const scaleTicks: React.ReactNode[] = [];
  for (let ml = 0; ml <= buretCapacityMl; ml += 1) {
    const y = mlToY(ml, buretCapacityMl);
    const isMajor = ml % 5 === 0;
    const isMid = ml % 1 === 0 && !isMajor;
    scaleTicks.push(
      <line
        key={`tick-${ml}`}
        x1={BURET_X + 8}
        y1={y}
        x2={BURET_X + 8 + (isMajor ? 10 : 6)}
        y2={y}
        stroke="#334"
        strokeWidth={isMajor ? 1.2 : 0.7}
        opacity={isMid ? 0.5 : 1}
      />
    );
    if (isMajor) {
      scaleTicks.push(
        <text
          key={`label-${ml}`}
          x={BURET_X + 22}
          y={y + 3.5}
          fontSize="8"
          fill="#334"
          fontFamily="'Courier New', monospace"
        >
          {ml}
        </text>
      );
    }
  }

  // ── Valve handle path ────────────────────────────────────────────────────
  const valveRotation =
    valveSetting === "closed" ? 90 : valveSetting === "slow" ? 30 : 0;

  const handleValveClick = () => {
    if (!onValveChange) return;
    const cycle: ValveSetting[] =
      valveSetting === "closed"
        ? ["slow"]
        : valveSetting === "slow"
        ? ["fast"]
        : ["closed"];
    onValveChange(cycle[0]);
  };

  // ── Schellbach stripe ────────────────────────────────────────────────────
  const schellbachStripe = showSchellbach ? (
    <rect
      x={BURET_X - 1}
      y={BURET_TOP_Y}
      width={2}
      height={BURET_HEIGHT_PX}
      fill="rgba(180,0,0,0.55)"
    />
  ) : null;

  // ── Endpoint glow on flask ────────────────────────────────────────────────
  const flaskGlowOpacity =
    endpointState === "at" ? 0.35 : endpointState === "over" ? 0.5 : 0;
  const flaskGlowColor =
    endpointState === "over" ? "#d81b60" : "#f48fb1";

  return (
    <div className="titration-scene-wrapper" aria-label="Titratielab 2D scene">
      <svg
        viewBox="0 0 420 640"
        width="100%"
        height="100%"
        className="titration-scene-svg"
        role="img"
        aria-label="2D titratieopstelling"
      >
        <defs>
          {/* Glass gradient for buret */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8e6f5" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#e8f4fd" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b0d4ea" stopOpacity="0.6" />
          </linearGradient>

          {/* Liquid in buret */}
          <linearGradient id="buretLiquid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a8d8f0" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#c5e8f8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#90c8e8" stopOpacity="0.9" />
          </linearGradient>

          {/* Flask liquid */}
          <linearGradient id="flaskLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={flaskLiquidColor} stopOpacity="0.75" />
            <stop offset="100%" stopColor={flaskLiquidColor} stopOpacity="0.95" />
          </linearGradient>

          {/* Tile shadow */}
          <filter id="tileShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>

          {/* Flask glow for endpoint */}
          <filter id="flaskGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Clip for buret liquid */}
          <clipPath id="buretClip">
            <rect x={BURET_X - 7} y={BURET_TOP_Y} width={16} height={BURET_HEIGHT_PX} />
          </clipPath>

          {/* Clip for flask liquid */}
          <clipPath id="flaskClip">
            <path d="M175,498 Q160,520 152,540 Q148,560 210,560 Q272,560 268,540 Q260,520 245,498 Z" />
          </clipPath>
        </defs>

        {/* ── Background: bench surface ── */}
        <rect x="0" y="590" width="420" height="50" fill="#d9cfc3" rx="0" />
        <rect x="0" y="585" width="420" height="8" fill="#c8bdb0" />

        {/* ── White ceramic tile ── */}
        <rect
          x="148"
          y={TILE_Y}
          width="124"
          height="46"
          rx="3"
          fill="#f9f9f7"
          stroke="#ccc"
          strokeWidth="1"
          filter="url(#tileShadow)"
        />
        {/* Tile grout lines */}
        {[166, 184, 202, 220, 238, 256].map((x) => (
          <line key={x} x1={x} y1={TILE_Y} x2={x} y2={TILE_Y + 46} stroke="#ddd" strokeWidth="0.5" />
        ))}
        <line x1="148" y1={TILE_Y + 23} x2="272" y2={TILE_Y + 23} stroke="#ddd" strokeWidth="0.5" />

        {/* ── Statief (stand) ── */}
        {/* Vertical rod */}
        <rect x="310" y="80" width="8" height="500" rx="4" fill="#222" />
        {/* Horizontal clamp arm for buret */}
        <rect x="220" y="95" width="92" height="7" rx="3" fill="#333" />
        {/* Clamp ring around buret */}
        <rect x="216" y="88" width="14" height="22" rx="4" fill="none" stroke="#444" strokeWidth="2.5" />
        {/* Base */}
        <rect x="270" y="575" width="64" height="14" rx="4" fill="#1a1a2e" />

        {/* ── Buret ── */}
        {burette && (
          <g className="titration-buret">
            {/* Outer glass tube */}
            <rect
              x={BURET_X - 8}
              y={BURET_TOP_Y}
              width={16}
              height={BURET_HEIGHT_PX}
              rx="3"
              fill="url(#glassGrad)"
              stroke="#8ab4cc"
              strokeWidth="1"
            />

            {/* Liquid fill in buret (clips to tube) */}
            <rect
              x={BURET_X - 6}
              y={liquidTopY}
              width={12}
              height={Math.max(0, BURET_TOP_Y + BURET_HEIGHT_PX - liquidTopY)}
              fill="url(#buretLiquid)"
              clipPath="url(#buretClip)"
            />

            {/* Meniscus curve */}
            <ellipse
              cx={BURET_X}
              cy={liquidTopY}
              rx={6}
              ry={2.5}
              fill="#9dd0ea"
              opacity="0.7"
            />

            {/* Scale ticks */}
            {scaleTicks}

            {/* Schellbach stripe */}
            {schellbachStripe}

            {/* Buret tip (narrow capillary) */}
            <rect
              x={BURET_X - 2}
              y={BURET_TOP_Y + BURET_HEIGHT_PX}
              width={4}
              height={20}
              rx="1"
              fill="#9ab"
              stroke="#8ab4cc"
              strokeWidth="0.8"
            />

            {/* Glass highlight */}
            <rect
              x={BURET_X - 7}
              y={BURET_TOP_Y + 10}
              width={2.5}
              height={BURET_HEIGHT_PX - 20}
              rx="1"
              fill="white"
              opacity="0.45"
            />
          </g>
        )}

        {/* ── Kraantje / Valve ── */}
        {burette && (
          <g
            className="titration-valve"
            onClick={handleValveClick}
            style={{ cursor: onValveChange ? "pointer" : "default" }}
            role="button"
            aria-label={`Kraantje: ${valveSetting}. Klik om te wisselen.`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleValveClick()}
          >
            {/* Valve body */}
            <rect
              x={BURET_X - 9}
              y={VALVE_Y - 5}
              width={18}
              height={10}
              rx="3"
              fill="#e8c060"
              stroke="#c09030"
              strokeWidth="1.2"
            />
            {/* Rotating handle */}
            <g transform={`rotate(${valveRotation}, ${BURET_X}, ${VALVE_Y})`}>
              <rect
                x={BURET_X - 14}
                y={VALVE_Y - 2.5}
                width={28}
                height={5}
                rx="2.5"
                fill="#d4a017"
                stroke="#a07810"
                strokeWidth="1"
              />
            </g>
            {/* Valve state label */}
            <text
              x={BURET_X + 16}
              y={VALVE_Y + 4}
              fontSize="7.5"
              fill="#665500"
              fontFamily="sans-serif"
            >
              {valveSetting === "closed" ? "dicht" : valveSetting === "slow" ? "druppel" : "snel"}
            </text>
          </g>
        )}

        {/* ── Falling drops ── */}
        {drops.map((drop) => (
          <ellipse
            key={drop.id}
            cx={BURET_X}
            cy={drop.y}
            rx={2.5}
            ry={3.5}
            fill="#7ec8e3"
            opacity={drop.opacity}
          />
        ))}

        {/* ── Erlenmeyer flask ── */}
        {flask && (
          <g className="titration-flask">
            {/* Endpoint glow behind flask */}
            {flaskGlowOpacity > 0 && (
              <ellipse
                cx={FLASK_CX}
                cy={FLASK_TOP_Y + 40}
                rx={55}
                ry={45}
                fill={flaskGlowColor}
                opacity={flaskGlowOpacity}
                filter="url(#flaskGlow)"
              />
            )}

            {/* Flask body (Erlenmeyer shape) */}
            <path
              d="M198,462 L198,498 Q183,520 170,542 Q162,562 210,562 Q258,562 250,542 Q237,520 222,498 L222,462 Z"
              fill="url(#glassGrad)"
              stroke="#8ab4cc"
              strokeWidth="1.2"
            />

            {/* Liquid inside flask */}
            <clipPath id="flaskLiquidClip">
              <path d="M170,542 Q162,562 210,562 Q258,562 250,542 Q240,525 224,505 L196,505 Q180,525 170,542 Z" />
            </clipPath>
            <rect
              x="155"
              y={562 - fillH}
              width="110"
              height={fillH}
              fill={`url(#flaskLiquid)`}
              clipPath="url(#flaskLiquidClip)"
            />

            {/* Liquid surface / meniscus */}
            <ellipse
              cx={FLASK_CX}
              cy={562 - fillH}
              rx={Math.min(50, 28 + currentAddedMl * 0.4)}
              ry={3}
              fill={flaskLiquidColor}
              opacity="0.5"
            />

            {/* Neck */}
            <rect
              x="198"
              y="440"
              width="24"
              height="24"
              rx="2"
              fill="url(#glassGrad)"
              stroke="#8ab4cc"
              strokeWidth="1.2"
            />
            {/* Neck opening rim */}
            <ellipse cx={FLASK_CX} cy={440} rx={13} ry={3} fill="#c8dde8" stroke="#8ab4cc" strokeWidth="1" />

            {/* Glass highlight */}
            <path
              d="M202,465 L202,500 Q192,520 183,540"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>
        )}

        {/* ── Pipet (optional, shown during setup) ── */}
        {pipet && (
          <g className="titration-pipet" transform="translate(80, 400) rotate(-15)">
            <rect x="-3" y="-80" width="6" height="100" rx="3" fill="url(#glassGrad)" stroke="#8ab4cc" strokeWidth="1" />
            <ellipse cx="0" cy="-80" rx="6" ry="3" fill="#c8dde8" stroke="#8ab4cc" strokeWidth="1" />
            <rect x="-2" y="20" width="4" height="20" rx="2" fill="#9ab" stroke="#8ab4cc" strokeWidth="0.8" />
          </g>
        )}

        {/* ── Current reading indicator ── */}
        {burette && (
          <g className="titration-reading-indicator">
            <line
              x1={BURET_X + 8}
              y1={liquidTopY}
              x2={BURET_X + 50}
              y2={liquidTopY}
              stroke="#e05040"
              strokeWidth="0.8"
              strokeDasharray="3,2"
              opacity="0.7"
            />
            <rect x={BURET_X + 50} y={liquidTopY - 8} width={38} height={16} rx="3" fill="#fff3f0" stroke="#e05040" strokeWidth="0.8" opacity="0.9" />
            <text
              x={BURET_X + 69}
              y={liquidTopY + 4}
              fontSize="8.5"
              fill="#c03020"
              fontFamily="'Courier New', monospace"
              textAnchor="middle"
            >
              {currentReadingMl.toFixed(2)}
            </text>
          </g>
        )}

        {/* ── Volume added badge ── */}
        <g className="titration-volume-badge">
          <rect x="8" y="8" width="94" height="32" rx="5" fill="#f0f7ff" stroke="#9cc" strokeWidth="1" opacity="0.95" />
          <text x="16" y="20" fontSize="7" fill="#557788" fontFamily="sans-serif">
            Toegevoegd
          </text>
          <text x="16" y="34" fontSize="11" fill="#224466" fontFamily="'Courier New', monospace" fontWeight="bold">
            {currentAddedMl.toFixed(2)} mL
          </text>
        </g>

        {/* ── Endpoint state indicator ── */}
        {endpointState !== "before" && (
          <g className="titration-endpoint-badge">
            <rect x="310" y="8" width="100" height="32" rx="5"
              fill={endpointState === "at" ? "#fce4ec" : endpointState === "over" ? "#f8bbd0" : "#fff9c4"}
              stroke={endpointState === "at" ? "#e91e63" : endpointState === "over" ? "#c2185b" : "#f9a825"}
              strokeWidth="1"
              opacity="0.95"
            />
            <text x="360" y="20" fontSize="7" fill="#555" fontFamily="sans-serif" textAnchor="middle">
              {endpointState === "near" ? "Bijna eindpunt" : endpointState === "at" ? "✓ Eindpunt" : "⚠ Overshoot"}
            </text>
            <text x="360" y="34" fontSize="9" fill="#333" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              {endpointState === "near" ? "Voorzichtig!" : endpointState === "at" ? "Lichtroze!" : "Te donker"}
            </text>
          </g>
        )}
      </svg>

      {/* ── Valve control buttons (outside SVG for accessibility) ── */}
      {onValveChange && (
        <div className="titration-valve-controls" aria-label="Kraantje instelling">
          {(["closed", "slow", "fast"] as ValveSetting[]).map((s) => (
            <button
              key={s}
              className={`titration-valve-btn${valveSetting === s ? " titration-valve-btn--active" : ""}`}
              onClick={() => onValveChange(s)}
              aria-pressed={valveSetting === s}
            >
              {s === "closed" ? "● Dicht" : s === "slow" ? "◎ Druppel" : "▼ Snel"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TitrationScene2D;
