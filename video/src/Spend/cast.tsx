// Cast for "6 Types of Students When Spending Money" — the toon grammar of the rainy-day film (big round heads,
// thick ink, cheeky brows), each student in their own outfit, plus the wallets with faces and the HUD
// (calendar "Day X" that flips, account balance that counts down and turns red when it runs low).
import React from "react";
import { INK, Toon, type Expr, type Look, type Outfit, type ToonPose } from "../Toon/Lily";

type HairFn = (r: number) => React.ReactNode;
const cap = (c: string, d = 1.08): HairFn => (r) => <path d={`M ${-r * 0.98} ${-r * 0.2} Q ${-r * 0.92} ${-r * d} 0 ${-r * d} Q ${r * 0.92} ${-r * d} ${r * 0.98} ${-r * 0.2} Q ${r * 0.4} ${-r * 0.62} ${-r * 0.98} ${-r * 0.2} Z`} fill={c} stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />;
const spiky = (c: string): HairFn => (r) => <path d={`M ${-r * 0.98} ${-r * 0.25} L ${-r * 1.05} ${-r * 0.7} L ${-r * 0.7} ${-r * 0.82} L ${-r * 0.62} ${-r * 1.22} L ${-r * 0.28} ${-r * 0.98} L ${-r * 0.05} ${-r * 1.32} L ${r * 0.22} ${-r * 1.0} L ${r * 0.55} ${-r * 1.24} L ${r * 0.62} ${-r * 0.86} L ${r * 1.02} ${-r * 0.78} L ${r * 0.98} ${-r * 0.25} Q ${r * 0.3} ${-r * 0.6} ${-r * 0.98} ${-r * 0.25} Z`} fill={c} stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />;
export const Shades = ({ r = 112 }: { r?: number }) => <g><path d={`M ${-r * 0.62} ${-r * 0.12} L ${-r * 0.08} ${-r * 0.12} L ${-r * 0.12} ${r * 0.12} Q ${-r * 0.35} ${r * 0.22} ${-r * 0.56} ${r * 0.1} Z M ${r * 0.08} ${-r * 0.12} L ${r * 0.62} ${-r * 0.12} L ${r * 0.56} ${r * 0.1} Q ${r * 0.35} ${r * 0.22} ${r * 0.12} ${r * 0.12} Z`} fill="#111" stroke={INK} strokeWidth={r * 0.04} /><line x1={-r * 0.1} y1={-r * 0.1} x2={r * 0.1} y2={-r * 0.1} stroke={INK} strokeWidth={r * 0.05} /><path d={`M ${-r * 0.5} ${-r * 0.05} l ${r * 0.18} 0`} stroke="#fff" strokeWidth={r * 0.04} opacity={0.6} /></g>;
export const Round = ({ r = 112 }: { r?: number }) => <g>{[-1, 1].map((sd) => <circle key={sd} cx={sd * r * 0.34} cy={-r * 0.02} r={r * 0.22} fill="#fff" fillOpacity={0.15} stroke={INK} strokeWidth={r * 0.05} />)}<line x1={-r * 0.12} y1={-r * 0.04} x2={r * 0.12} y2={-r * 0.04} stroke={INK} strokeWidth={r * 0.05} /></g>;

export type Who = "Ray" | "Gus" | "Pia" | "Yuki" | "Bea" | "Otto";
export const COLOR: Record<Who, string> = { Ray: "#ef4444", Gus: "#22c55e", Pia: "#a855f7", Yuki: "#eab308", Bea: "#3b82f6", Otto: "#f97316" };
const LOOK: Record<Who, { outfit: Outfit; hair: HairFn; back?: HairFn; face?: (r: number) => React.ReactNode }> = {
  Ray: { outfit: { top: "#ef4444", topDark: "#b91c1c", legs: "#1f2937", shoes: "#f8fafc", shoeTrim: "#ef4444", hood: true, pocket: true }, hair: spiky("#1f1a17"), face: (r) => <Shades r={r} /> },
  Gus: { outfit: { top: "#22c55e", topDark: "#15803d", legs: "#78716c", shoes: "#3f2a1d" }, hair: (r) => <g>{cap("#4b3621", 1.0)(r)}<path d={`M ${-r * 0.3} ${-r * 0.95} q ${r * 0.1} ${r * 0.3} ${-r * 0.5} ${r * 0.5}`} stroke={INK} strokeWidth={r * 0.04} fill="none" /></g>, face: (r) => <Round r={r} /> },
  Pia: { outfit: { top: "#a855f7", topDark: "#7e22ce", legs: "#334155", shoes: "#f9a8d4", shoeTrim: "#fff", pocket: false }, hair: cap("#3b1f3f", 1.1), back: (r) => <g><path d={`M ${r * 0.7} ${-r * 0.7} Q ${r * 1.6} ${-r * 0.9} ${r * 1.5} ${r * 0.3} Q ${r * 1.3} ${-r * 0.2} ${r * 0.8} ${-r * 0.3} Z`} fill="#3b1f3f" stroke={INK} strokeWidth={r * 0.05} /><circle cx={r * 0.85} cy={-r * 0.6} r={r * 0.12} fill="#f472b6" stroke={INK} strokeWidth={r * 0.03} /></g> },
  Yuki: { outfit: { top: "#facc15", topDark: "#ca8a04", legs: "#64748b", shoes: "#fde68a" }, hair: (r) => <g>{cap("#57534e", 1.15)(r)}{[-0.6, -0.2, 0.2, 0.6].map((x, i) => <path key={i} d={`M ${r * x} ${-r * 1.0} l ${r * 0.12} ${-r * 0.25}`} stroke="#57534e" strokeWidth={r * 0.1} strokeLinecap="round" />)}</g> },
  Bea: { outfit: { top: "#2563eb", topDark: "#1e40af", legs: "#1e293b", shoes: "#111827", apron: "#f8fafc" }, hair: cap("#7c2d12", 1.12), back: (r) => <path d={`M ${-r * 1.08} ${-r * 0.2} Q ${-r * 1.15} ${r * 0.6} ${-r * 0.82} ${r * 0.72} L ${r * 0.82} ${r * 0.72} Q ${r * 1.15} ${r * 0.6} ${r * 1.08} ${-r * 0.2} Z`} fill="#7c2d12" stroke={INK} strokeWidth={r * 0.05} /> },
  Otto: { outfit: { top: "#f97316", topDark: "#c2410c", legs: "#1e3a8a", shoes: "#f8fafc", shoeTrim: "#f97316", hood: true }, hair: spiky("#9a3412") },
};
export const Student: React.FC<{ who: Who; id: string; x: number; y: number; s?: number; flip?: boolean; pose?: ToonPose; expr?: Expr; look?: Look; blush?: boolean; holdF?: React.ReactNode; holdB?: React.ReactNode; extra?: React.ReactNode; fistF?: boolean; noShades?: boolean }> = ({ who, extra, noShades, ...p }) => {
  const L = LOOK[who];
  return <Toon {...p} expr={p.expr ?? (who === "Yuki" ? "sleepy" : "smug")} outfit={L.outfit} hair={(r) => L.hair(r)} hairBack={(r) => (L.back ? L.back(r) : null)} faceExtra={<g>{L.face && !(noShades && who === "Ray") ? L.face(112) : null}{extra}</g>} />;
};

// the wallet: leather with a coloured strap (its owner's), a face and little arms
export type WMood = "happy" | "smile" | "shake" | "cry" | "faint" | "sleep" | "fat" | "worried";
export const Wallet: React.FC<{ x: number; y: number; s?: number; mood?: WMood; strap?: string; f: number }> = ({ x, y, s = 1, mood = "smile", strap = "#ef4444", f }) => {
  const shake = mood === "shake" ? Math.sin(f * 2.3) * 7 : 0;
  const fat = mood === "fat" ? 1.35 : 1;
  const lie = mood === "faint";
  return (
    <g transform={`translate(${x + shake} ${y}) rotate(${lie ? -90 : 0}) scale(${s * fat} ${s})`}>
      <ellipse cx={0} cy={86} rx={110} ry={14} fill="#000" opacity={0.18} />
      {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * 118} 10 Q ${sd * 165} ${mood === "happy" ? -50 : 30} ${sd * 170} ${mood === "happy" ? -80 : 70}`} stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />)}
      <rect x={-120} y={-80} width={240} height={160} rx={30} fill="#9a6232" stroke={INK} strokeWidth={8} />
      <path d="M -120 -40 L 120 -40" stroke="#7c4a20" strokeWidth={6} />
      <rect x={40} y={-30} width={90} height={56} rx={10} fill={strap} stroke={INK} strokeWidth={6} /><circle cx={112} cy={-2} r={9} fill="#fde047" stroke={INK} strokeWidth={4} />
      {mood === "fat" && [0, 1].map((i) => <rect key={i} x={-110 + i * 40} y={-104 - i * 6} width={90} height={40} rx={4} fill="#86efac" stroke={INK} strokeWidth={4} transform={`rotate(${-10 + i * 14})`} />)}
      {/* face */}
      {mood === "faint" ? <g>{[-50, 0].map((ex) => <path key={ex} d={`M ${ex - 14} -16 l 28 28 M ${ex + 14} -16 l -28 28`} stroke={INK} strokeWidth={7} strokeLinecap="round" />)}<ellipse cx={-24} cy={44} rx={16} ry={10} fill={INK} /></g>
        : mood === "sleep" ? <g>{[-50, 0].map((ex) => <path key={ex} d={`M ${ex - 16} 0 q 16 12 32 0`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />)}<path d="M -36 40 q 12 8 24 0" stroke={INK} strokeWidth={6} fill="none" /></g>
        : <g>
          {[-50, 0].map((ex) => mood === "happy" || mood === "fat" ? <path key={ex} d={`M ${ex - 16} 4 q 16 -18 32 0`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" /> : <g key={ex}><ellipse cx={ex} cy={0} rx={mood === "shake" || mood === "worried" ? 14 : 11} ry={mood === "shake" ? 17 : 14} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={ex + 2} cy={2} r={6} fill={INK} /></g>)}
          {(mood === "shake" || mood === "worried" || mood === "cry") && [-50, 0].map((ex, i) => <line key={ex} x1={ex - 16} y1={-26 + (i ? -6 : 6)} x2={ex + 16} y2={-26 + (i ? 6 : -6)} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}
          {mood === "happy" || mood === "fat" ? <path d="M -60 30 Q -24 70 12 30 Z" fill={INK} /> : mood === "smile" ? <path d="M -52 32 Q -24 54 4 32" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
            : mood === "shake" ? <path d={`M -56 42 l 8 -8 l 8 8 l 8 -8 l 8 8 l 8 -8 l 8 8`} stroke={INK} strokeWidth={6} fill="none" strokeLinejoin="round" />
            : <path d="M -52 48 Q -24 26 4 48" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />}
          {mood === "cry" && [-50, 0].map((ex, i) => { const k = ((f / 20 + i * 0.5) % 1); return <path key={ex} d="M 0 -10 Q 8 2 0 10 Q -8 2 0 -10 Z" transform={`translate(${ex} ${16 + k * 60}) scale(1.6)`} fill="#7dd3fc" stroke={INK} strokeWidth={2} opacity={1 - k} />; })}
        </g>}
      {(mood === "happy" || mood === "smile" || mood === "fat") && [-82, 30].map((cx) => <ellipse key={cx} cx={cx} cy={24} rx={14} ry={8} fill="#f472b6" opacity={0.6} />)}
      {mood === "sleep" && [0, 1, 2].map((i) => { const k = ((f + i * 22) % 66) / 66; return <text key={i} x={60 + k * 40} y={-90 - k * 90} fontFamily="ToonSans" fontWeight={800} fontSize={40 + k * 20} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke fill" opacity={1 - k}>z</text>; })}
    </g>
  );
};

// HUD: tear-off calendar (top-left) and the account balance of the student in focus (top-right)
export const Calendar: React.FC<{ day: number; flip?: number }> = ({ day, flip = 0 }) => (
  <g transform="translate(70 70)">
    <rect x={0} y={0} width={210} height={200} rx={18} fill="#fff" stroke={INK} strokeWidth={7} />
    <rect x={0} y={0} width={210} height={56} rx={18} fill="#ef4444" stroke={INK} strokeWidth={7} /><rect x={4} y={36} width={202} height={20} fill="#ef4444" />
    <text x={105} y={42} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={32} fill="#fff">DAY</text>
    <text x={105} y={164} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={100} fill={INK}>{Math.max(1, Math.round(day))}</text>
    {flip > 0.02 && flip < 0.98 && <g transform={`translate(105 56) scale(1 ${Math.cos(flip * Math.PI)})`}><rect x={-102} y={0} width={204} height={140} fill="#f1f5f9" stroke={INK} strokeWidth={6} /></g>}
    {[50, 160].map((x) => <circle key={x} cx={x} cy={0} r={11} fill="#94a3b8" stroke={INK} strokeWidth={5} />)}
  </g>
);
export const vnd = (v: number) => `${Math.max(0, Math.round(v / 1000) * 1000).toLocaleString("en-US")}đ`;
export const Balance: React.FC<{ who: Who | "All"; v: number; drop?: number }> = ({ who, v, drop = 0 }) => {
  const low = v < 400000;
  return (
    <g transform={`translate(${590} 80)`}>
      <rect x={0} y={0} width={430} height={150} rx={26} fill="#111827" stroke={INK} strokeWidth={6} opacity={0.92} />
      <rect x={18} y={18} width={who === "All" ? 120 : 110} height={42} rx={21} fill={who === "All" ? "#475569" : COLOR[who]} /><text x={18 + (who === "All" ? 60 : 55)} y={48} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={28} fill="#fff">{who === "All" ? "Each" : who}</text>
      <circle cx={392} cy={40} r={22} fill="#facc15" stroke={INK} strokeWidth={4} /><text x={392} y={50} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={28} fill={INK}>đ</text>
      <text x={215} y={124} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={64} fill={low ? "#f87171" : "#4ade80"} transform={`translate(${drop > 0.01 ? Math.sin(drop * 40) * 4 : 0} 0)`}>{vnd(v)}</text>
      {drop > 0.01 && <text x={410} y={130} textAnchor="end" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill="#f87171">▼</text>}
    </g>
  );
};
export const BubbleTea: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M -40 -150 L 40 -150 L 30 0 L -30 0 Z" fill="#d6b38a" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><ellipse cx={0} cy={-150} rx={42} ry={10} fill="#fff" stroke={INK} strokeWidth={5} />{[-14, 4, 18, -4, 12].map((x, i) => <circle key={i} cx={x} cy={-20 - (i % 3) * 14} r={9} fill={INK} />)}<line x1={10} y1={-150} x2={24} y2={-210} stroke="#f472b6" strokeWidth={12} strokeLinecap="round" /></g>
);
export const Noodle: React.FC<{ s?: number; f?: number }> = ({ s = 1, f = 0 }) => (
  <g transform={`scale(${s})`}><path d="M -60 -120 L 60 -120 L 46 0 L -46 0 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><rect x={-54} y={-86} width={108} height={34} fill="#ef4444" /><text x={0} y={-60} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={24} fill="#fff">NOODLE</text><ellipse cx={0} cy={-120} rx={60} ry={12} fill="#fcd34d" stroke={INK} strokeWidth={6} />{[0, 1].map((i) => <path key={i} d={`M ${-16 + i * 30} -136 q -12 -18 0 -36 q 12 -16 0 -32`} stroke="#fff" strokeWidth={7} fill="none" opacity={0.4 + 0.5 * Math.sin(f / 5 + i * 2)} strokeLinecap="round" />)}</g>
);
export const PhoneP: React.FC<{ s?: number; screen?: string; children?: React.ReactNode; fancy?: boolean }> = ({ s = 1, screen = "#bfdbfe", children, fancy }) => (
  <g transform={`scale(${s})`}><rect x={-60} y={-110} width={120} height={220} rx={22} fill={fancy ? "#c0c4cc" : "#1f2937"} stroke={INK} strokeWidth={8} /><rect x={-48} y={-94} width={96} height={188} rx={12} fill={screen} />{fancy && [[-30, -80], [-10, -80], [-30, -60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#111" stroke="#9ca3af" strokeWidth={3} />)}{children}</g>
);
