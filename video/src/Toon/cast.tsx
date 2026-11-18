// The rest of the cast and the props for scenes 3–7 (same drawing grammar: thick ink, flat fills, soft shade).
import React from "react";
import { INK, type Outfit } from "./Lily";

// Mom: grey-brown bun, purple cardigan, white apron
export const MOM: Outfit = { top: "#a78bfa", topDark: "#7c3aed", legs: "#475569", shoes: "#57534e", apron: "#fff" };
export const MomHair = ({ r }: { r: number }) => (
  <g>
    <circle cx={0} cy={-r * 1.12} r={r * 0.42} fill="#6b5b53" stroke={INK} strokeWidth={r * 0.06} />
    <path d={`M ${-r * 1.0} ${-r * 0.1} Q ${-r * 0.98} ${-r * 1.06} 0 ${-r * 1.04} Q ${r * 0.98} ${-r * 1.06} ${r * 1.0} ${-r * 0.1} Q ${r * 0.5} ${-r * 0.7} ${-r * 0.2} ${-r * 0.56} Q ${-r * 0.7} ${-r * 0.5} ${-r * 1.0} ${-r * 0.1} Z`} fill="#6b5b53" stroke={INK} strokeWidth={r * 0.06} strokeLinejoin="round" />
    <path d={`M ${-r * 0.5} ${-r * 0.88} Q 0 ${-r * 1.0} ${r * 0.5} ${-r * 0.84}`} stroke="#9a8a80" strokeWidth={r * 0.05} fill="none" />
  </g>
);
// Max: red backwards cap, blue hoodie
export const MAX: Outfit = { top: "#3b82f6", topDark: "#1d4ed8", legs: "#1e293b", shoes: "#f8fafc", shoeTrim: "#ef4444", hood: true };
export const MaxHair = ({ r }: { r: number }) => (
  <g>
    <path d={`M ${-r * 0.98} ${-r * 0.3} Q ${-r * 0.9} ${-r * 1.12} 0 ${-r * 1.1} Q ${r * 0.9} ${-r * 1.12} ${r * 0.98} ${-r * 0.3} Z`} fill="#ef4444" stroke={INK} strokeWidth={r * 0.06} strokeLinejoin="round" />
    <path d={`M ${-r * 0.9} ${-r * 0.36} Q ${-r * 1.5} ${-r * 0.4} ${-r * 1.42} ${-r * 0.14} Q ${-r * 1.1} ${-r * 0.14} ${-r * 0.92} ${-r * 0.22} Z`} fill="#dc2626" stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />
    <circle cx={0} cy={-r * 1.1} r={r * 0.08} fill="#fff" stroke={INK} strokeWidth={r * 0.03} />
  </g>
);

// the blanket: a purple quilt with a face (mood: sly / sleepy / puppy); n = 0..1 crawl phase
export const Blanket: React.FC<{ w?: number; h?: number; f: number; mood?: "sly" | "sleepy" | "puppy" | "happy"; crawl?: number; face?: boolean }> = ({ w = 420, h = 160, f, mood = "sly", crawl = 0, face = true }) => {
  const hump = Math.sin(crawl * Math.PI * 2) * 30;
  return (
    <g>
      <path d={`M ${-w / 2} 0 Q ${-w / 2 - 10} ${-h * 0.8} ${-w / 4} ${-h - Math.max(0, hump)} Q 0 ${-h * 1.1 - hump} ${w / 4} ${-h + Math.min(0, hump)} Q ${w / 2 + 14} ${-h * 0.8} ${w / 2} 0 Z`} fill="#8b5cf6" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {[-0.3, 0, 0.3].map((k, i) => <path key={i} d={`M ${w * k} ${-h * 0.15} q 8 ${-h * 0.35} 0 ${-h * 0.75}`} stroke="#c4b5fd" strokeWidth={7} fill="none" opacity={0.7} />)}
      {[-0.38, -0.12, 0.14, 0.4].map((k, i) => <circle key={i} cx={w * k} cy={-h * 0.45 + (i % 2) * 18} r={7} fill="#ddd6fe" />)}
      {face && <g transform={`translate(${w * 0.18} ${-h * 0.62})`}>
        {mood === "puppy" ? [-34, 34].map((x) => <g key={x}><ellipse cx={x} cy={0} rx={24} ry={28} fill={INK} /><circle cx={x + 8} cy={-10} r={9} fill="#fff" /><circle cx={x - 8} cy={8} r={4} fill="#fff" /></g>)
          : mood === "sleepy" || mood === "happy" ? [-34, 34].map((x) => <path key={x} d={`M ${x - 16} ${mood === "happy" ? 6 : 0} q 16 ${mood === "happy" ? -18 : 12} 32 0`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />)
          : [-34, 34].map((x, i) => <g key={x}><ellipse cx={x} cy={0} rx={10} ry={13} fill={INK} /><line x1={x - 18} y1={-22 + (i ? 6 : -2)} x2={x + 18} y2={-22 + (i ? -2 : 6)} stroke={INK} strokeWidth={8} strokeLinecap="round" /></g>)}
        {mood === "puppy" ? <path d="M -14 40 q 14 -12 28 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" /> : <path d={mood === "sly" ? "M -26 34 Q 4 52 30 28" : "M -18 34 Q 0 46 18 34"} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />}
        <ellipse cx={-56} cy={30} rx={14} ry={8} fill="#f472b6" opacity={0.6} /><ellipse cx={56} cy={30} rx={14} ry={8} fill="#f472b6" opacity={0.6} />
      </g>}
    </g>
  );
};

export const Clock: React.FC<{ turns: number; r?: number }> = ({ turns, r = 90 }) => (
  <g><circle r={r} fill="#fffdf6" stroke={INK} strokeWidth={r * 0.1} />{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-r * 0.78} x2={0} y2={-r * 0.66} stroke={INK} strokeWidth={r * 0.05} transform={`rotate(${i * 30})`} />)}
    <line x1={0} y1={0} x2={0} y2={-r * 0.7} stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" transform={`rotate(${turns * 360})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke="#ef4444" strokeWidth={r * 0.1} strokeLinecap="round" transform={`rotate(${turns * 30 + 60})`} /><circle r={r * 0.08} fill={INK} /></g>
);
export const Mat: React.FC<{ w?: number; roll?: number }> = ({ w = 560, roll = 1 }) => (
  <g><rect x={-w / 2} y={-18} width={w * roll} height={22} rx={10} fill="#22d3ee" stroke={INK} strokeWidth={7} />
    {roll < 0.98 && <circle cx={-w / 2 + w * roll} cy={-30 + roll * 12} r={42 - roll * 30} fill="#06b6d4" stroke={INK} strokeWidth={7} />}</g>
);
export const Dumbbell: React.FC<{ r?: number }> = ({ r = 0 }) => (
  <g transform={`rotate(${r})`}><rect x={-34} y={-6} width={68} height={12} rx={5} fill="#475569" stroke={INK} strokeWidth={4} /><rect x={-48} y={-22} width={20} height={44} rx={6} fill="#f43f5e" stroke={INK} strokeWidth={5} /><rect x={28} y={-22} width={20} height={44} rx={6} fill="#f43f5e" stroke={INK} strokeWidth={5} /></g>
);
export const Broom: React.FC<{ len?: number }> = ({ len = 380 }) => (
  <g><line x1={0} y1={0} x2={0} y2={len} stroke={INK} strokeWidth={18} strokeLinecap="round" /><line x1={0} y1={0} x2={0} y2={len} stroke="#b45309" strokeWidth={10} strokeLinecap="round" />
    <path d={`M -60 ${len} L 60 ${len} L 74 ${len + 60} L -74 ${len + 60} Z`} fill="#fde047" stroke={INK} strokeWidth={7} strokeLinejoin="round" />{[-44, -16, 16, 44].map((d) => <line key={d} x1={d} y1={len + 10} x2={d * 1.2} y2={len + 56} stroke="#ca8a04" strokeWidth={5} />)}</g>
);
export const Noodles: React.FC<{ s?: number; f?: number; open?: boolean; label?: string; empty?: boolean }> = ({ s = 1, f = 0, open = true, label = "NOODLE", empty }) => (
  <g transform={`scale(${s})`}>
    <path d="M -60 -120 L 60 -120 L 46 0 L -46 0 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-54} y={-86} width={108} height={34} fill="#ef4444" /><text x={0} y={-60} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={24} fill="#fff">{label}</text>
    {open ? <g><ellipse cx={0} cy={-120} rx={60} ry={12} fill={empty ? "#e5e7eb" : "#fcd34d"} stroke={INK} strokeWidth={6} />{!empty && [0, 1, 2].map((i) => <path key={i} d={`M ${-24 + i * 24} -136 q -12 -18 0 -36 q 12 -16 0 -32`} stroke="#fff" strokeWidth={7} fill="none" opacity={0.4 + 0.5 * Math.sin(f / 5 + i * 2)} strokeLinecap="round" />)}</g>
      : <ellipse cx={0} cy={-122} rx={62} ry={12} fill="#fde68a" stroke={INK} strokeWidth={6} />}
  </g>
);
export const Popcorn: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M -40 -50 L 40 -50 L 30 30 L -30 30 Z" fill="#fff" stroke={INK} strokeWidth={6} />{[-20, 0, 20].map((x) => <rect key={x} x={x - 5} y={-50} width={10} height={80} fill="#ef4444" opacity={0.85} />)}{[-28, -8, 12, 30, -16, 6, 22].map((x, i) => <circle key={i} cx={x} cy={-58 - (i % 3) * 12} r={14} fill="#fef3c7" stroke={INK} strokeWidth={4} />)}</g>
);
export const Album: React.FC<{ s?: number; turn?: number; baby?: boolean }> = ({ s = 1, turn = 0, baby = true }) => {
  const Pic = ({ x, y, c }: { x: number; y: number; c: string }) => <g transform={`translate(${x} ${y})`}><rect x={-46} y={-36} width={92} height={72} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={-38} y={-28} width={76} height={50} fill={c} />{baby && <g><circle cx={0} cy={-2} r={16} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={-5} cy={-4} r={2.5} fill={INK} /><circle cx={5} cy={-4} r={2.5} fill={INK} /><path d="M -5 5 q 5 4 10 0" stroke={INK} strokeWidth={2.5} fill="none" /><path d="M -2 -18 q 4 -8 8 -2" stroke="#2b1d1a" strokeWidth={4} fill="none" /></g>}</g>;
  return (
    <g transform={`scale(${s})`}>
      <rect x={-250} y={-150} width={500} height={300} rx={14} fill="#7c2d12" stroke={INK} strokeWidth={9} />
      <rect x={-236} y={-138} width={228} height={276} fill="#fef3c7" /><rect x={8} y={-138} width={228} height={276} fill="#fef3c7" />
      <Pic x={-170} y={-70} c="#fbcfe8" /><Pic x={-74} y={50} c="#bfdbfe" /><Pic x={74} y={-70} c="#fde68a" /><Pic x={170} y={50} c="#bbf7d0" />
      {turn > 0 && turn < 1 && <g transform={`scale(${Math.cos(turn * Math.PI)} 1)`}><rect x={4} y={-138 - 20 * Math.sin(turn * Math.PI)} width={230} height={276} fill="#fde68a" stroke={INK} strokeWidth={5} /></g>}
    </g>
  );
};
export const Glove: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <g transform={`scale(${flip ? -1 : 1} 1)`}><path d="M -60 120 L -50 -10 Q -60 -90 -40 -100 Q -24 -104 -22 -60 L -20 -130 Q -12 -150 4 -130 L 6 -70 L 10 -140 Q 22 -158 34 -138 L 32 -70 L 44 -120 Q 58 -134 66 -112 L 56 -40 Q 80 -60 92 -40 Q 70 10 60 120 Z" fill="#facc15" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><rect x={-66} y={100} width={132} height={44} rx={10} fill="#eab308" stroke={INK} strokeWidth={8} /></g>
);
export const ChefHat = () => (
  <g><rect x={-60} y={-40} width={120} height={50} rx={8} fill="#fff" stroke={INK} strokeWidth={7} /><path d="M -60 -36 Q -100 -90 -50 -110 Q -30 -160 10 -130 Q 60 -160 70 -100 Q 110 -80 60 -36 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>
);
export const Cake: React.FC<{ s?: number; bite?: boolean }> = ({ s = 1, bite }) => (
  <g transform={`scale(${s})`}><path d="M -60 0 L 60 0 L 60 -60 L -60 -76 Z" fill="#fde68a" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M -60 -76 L 60 -60 L 60 -76 L -60 -94 Z" fill="#f9a8d4" stroke={INK} strokeWidth={6} />{!bite && <circle cx={0} cy={-98} r={13} fill="#ef4444" stroke={INK} strokeWidth={4} />}</g>
);
export const BubbleTea: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M -40 -150 L 40 -150 L 30 0 L -30 0 Z" fill="#d6b38a" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><ellipse cx={0} cy={-150} rx={42} ry={10} fill="#fff" stroke={INK} strokeWidth={5} />{[-14, 4, 18, -4, 12].map((x, i) => <circle key={i} cx={x} cy={-20 - (i % 3) * 14} r={9} fill={INK} />)}<line x1={10} y1={-150} x2={24} y2={-210} stroke="#f472b6" strokeWidth={12} strokeLinecap="round" /></g>
);
export const Kettle = () => (
  <g><path d="M -90 0 Q -110 -120 0 -130 Q 110 -120 90 0 Z" fill="#ef4444" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><path d="M 80 -60 Q 150 -90 170 -140" stroke={INK} strokeWidth={26} fill="none" strokeLinecap="round" /><path d="M 80 -60 Q 150 -90 170 -140" stroke="#ef4444" strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M -60 -120 Q 0 -200 60 -120" stroke={INK} strokeWidth={14} fill="none" /><ellipse cx={0} cy={-132} rx={30} ry={10} fill="#b91c1c" stroke={INK} strokeWidth={5} /></g>
);
