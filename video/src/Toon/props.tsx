// Props, effects and the camera for the rainy-day toon.
import React from "react";
import { INK } from "./Lily";

// camera: put world point (x, y) at the centre of the 1080×1920 frame, zoom z, roll r (deg)
export const Cam: React.FC<{ x?: number; y?: number; z?: number; r?: number; shake?: number; f?: number; children: React.ReactNode }> = ({ x = 540, y = 960, z = 1, r = 0, shake = 0, f = 0, children }) => {
  const sx = shake ? Math.sin(f * 2.1) * shake + Math.sin(f * 3.7) * shake * 0.5 : 0, sy = shake ? Math.cos(f * 2.7) * shake : 0;
  return <g transform={`translate(${540 + sx} ${960 + sy}) rotate(${r}) scale(${z}) translate(${-x} ${-y})`}>{children}</g>;
};

// REALITY grade: drained colour, cold blue cast (wrap a world in it)
export const Grade: React.FC<{ k: number; id: string; children: React.ReactNode }> = ({ k, id, children }) => k <= 0.001 ? <>{children}</> : (
  <g>
    <filter id={`gr${id}`}><feColorMatrix type="saturate" values={`${1 - 0.65 * k}`} /></filter>
    <g filter={`url(#gr${id})`}>{children}</g>
    <rect width={1080} height={1920} fill="#2b3b55" opacity={0.28 * k} style={{ mixBlendMode: "multiply" }} />
  </g>
);

// the rain cloud — same drawing grammar as the cast: white-grey puff, thick ink, cheeky brows
export const Cloud: React.FC<{ x: number; y: number; s?: number; f: number; mood?: "smug" | "happy" | "grumpy"; wave?: number; rain?: number }> = ({ x, y, s = 1, f, mood = "smug", wave = 0, rain = 1 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12) * 6}) scale(${s})`}>
    {rain > 0 && Array.from({ length: 8 }).map((_, i) => { const t = ((f * 0.05 + i * 0.37) % 1); return <line key={i} x1={-110 + i * 32} y1={60 + t * 240} x2={-118 + i * 32} y2={92 + t * 240} stroke="#93c5fd" strokeWidth={7} strokeLinecap="round" opacity={rain * (1 - t)} />; })}
    <g transform={`translate(150 10) rotate(${-30 - wave * (40 + 30 * Math.sin(f / 2.5))})`}><path d="M 0 0 Q 40 -6 64 -40" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" /><circle cx={66} cy={-44} r={16} fill="#fff" stroke={INK} strokeWidth={6} /></g>
    <path d="M -150 50 Q -200 50 -192 2 Q -184 -46 -130 -44 Q -126 -106 -60 -110 Q -20 -150 36 -126 Q 96 -150 122 -92 Q 186 -94 184 -22 Q 204 50 138 50 Z" fill="#cfd6e2" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M -150 40 Q -40 64 140 40" stroke="#a3adbd" strokeWidth={14} fill="none" strokeLinecap="round" />
    {[-46, 40].map((ex, i) => <g key={ex}><ellipse cx={ex} cy={-36} rx={10} ry={mood === "happy" ? 4 : 14} fill={INK} /><path d={`M ${ex - 22} ${-66 + (mood === "grumpy" ? (i ? -8 : 8) : mood === "smug" ? (i ? 6 : -8) : 0)} Q ${ex} ${-80} ${ex + 22} ${-66 + (mood === "grumpy" ? (i ? 8 : -8) : mood === "smug" ? (i ? -8 : 6) : 0)}`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" /></g>)}
    {mood === "grumpy" ? <path d="M -30 20 Q -4 4 22 20" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" /> : <path d="M -34 6 Q -4 36 30 2" stroke={INK} strokeWidth={8} fill={mood === "happy" ? INK : "none"} strokeLinecap="round" />}
  </g>
);

export const Mug: React.FC<{ s?: number; f?: number; steam?: boolean; color?: string }> = ({ s = 1, f = 0, steam = true, color = "#fde68a" }) => (
  <g transform={`scale(${s})`}>
    <path d="M 26 -40 q 26 2 22 22 q -4 18 -22 16" fill="none" stroke={INK} strokeWidth={7} />
    <path d="M -26 -52 L 26 -52 L 22 4 L -22 4 Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {steam && [0, 1].map((i) => <path key={i} d={`M ${-10 + i * 18} -64 q -9 -14 0 -26 q 9 -12 0 -24`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.45 + 0.45 * Math.sin(f / 5 + i * 2)} strokeLinecap="round" />)}
  </g>
);

// an open book seen from the front (page number optional), or closed
export const Book: React.FC<{ s?: number; page?: string; color?: string; turn?: number }> = ({ s = 1, page, color = "#f59e0b", turn = 0 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -130 10 L -130 -86 Q -66 -100 0 -80 Q 66 -100 130 -86 L 130 10 Q 66 -6 0 14 Q -66 -6 -130 10 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -118 -6 L -118 -84 Q -60 -94 -4 -74 L -4 6 Q -60 -12 -118 -6 Z" fill="#fffbeb" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 118 -6 L 118 -84 Q 60 -94 4 -74 L 4 6 Q 60 -12 118 -6 Z" fill="#fffbeb" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => <g key={i}><line x1={-102} y1={-62 + i * 14} x2={-20} y2={-56 + i * 14} stroke="#cbd5e1" strokeWidth={4} /><line x1={20} y1={-56 + i * 14} x2={102} y2={-62 + i * 14} stroke="#cbd5e1" strokeWidth={4} /></g>)}
    {page && <text x={-60} y={-10} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#ef4444">{page}</text>}
    {turn > 0 && turn < 1 && <path d={`M 0 -78 L ${118 * Math.cos(turn * Math.PI)} ${-86 - 30 * Math.sin(turn * Math.PI)} L ${118 * Math.cos(turn * Math.PI)} ${-6 - 30 * Math.sin(turn * Math.PI)} L 0 8 Z`} fill="#fff7e0" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
  </g>
);

export const Phone: React.FC<{ s?: number; screen?: string }> = ({ s = 1, screen = "#93c5fd" }) => (
  <g transform={`scale(${s})`}><rect x={-34} y={-62} width={68} height={124} rx={14} fill="#1f2937" stroke={INK} strokeWidth={6} /><rect x={-26} y={-52} width={52} height={100} rx={8} fill={screen} /><circle cx={0} cy={-44} r={4} fill="#94a3b8" /></g>
);

// comic sunburst behind a hero pose
export const Rays: React.FC<{ x: number; y: number; f: number; a?: string; b?: string; k?: number }> = ({ x, y, f, a = "#fde047", b = "#fb923c", k = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.6}) scale(${k})`}>
    <circle r={1600} fill={b} />
    {Array.from({ length: 18 }).map((_, i) => { const t0 = (i / 18) * Math.PI * 2, t1 = t0 + Math.PI / 18; return <path key={i} d={`M 0 0 L ${Math.cos(t0) * 1700} ${Math.sin(t0) * 1700} L ${Math.cos(t1) * 1700} ${Math.sin(t1) * 1700} Z`} fill={a} />; })}
  </g>
);

export const Spark: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#fde047" }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 -30 L 8 -8 L 30 0 L 8 8 L 0 30 L -8 8 L -30 0 L -8 -8 Z" fill={c} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
);

// big rubber stamp: PLAN (yellow) / REALITY (slate)
export const Stamp: React.FC<{ kind: "PLAN" | "REALITY"; k: number; x?: number; y?: number }> = ({ kind, k, x = 540, y = 300 }) => k <= 0.01 ? null : (
  <g transform={`translate(${x} ${y}) rotate(${kind === "PLAN" ? -6 : 4}) scale(${k})`}>
    <rect x={-250} y={-90} width={500} height={180} rx={26} fill={kind === "PLAN" ? "#facc15" : "#475569"} stroke={INK} strokeWidth={12} />
    <text y={30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={kind === "PLAN" ? 110 : 92} fill={kind === "PLAN" ? INK : "#f1f5f9"}>{kind}</text>
  </g>
);

export const Zs: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g>{[0, 1, 2].map((i) => { const t = ((f + i * 22) % 66) / 66; return <text key={i} x={x + t * 70 * s} y={y - t * 150 * s} fontFamily="ToonSans" fontWeight={800} fontSize={(56 + t * 40) * s} fill="#fff" stroke={INK} strokeWidth={8 * s} paintOrder="stroke fill" opacity={1 - t}>z</text>; })}</g>
);
