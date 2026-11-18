// "What if everything was free?" cast — same toon grammar as src/Toon (big round heads, thick ink, cheeky brows):
// Bob (yellow cap worn forward, orange tee, jeans, sneakers), Mr. Gus (bald with side tufts, huge moustache, apron),
// the King (crown, red robe, megaphone). Every part stays a separate layer of <Toon>.
import React from "react";
import { INK, Toon, type Outfit, type ToonPose, type Expr, type Look } from "../Toon/Lily";

export const BOB: Outfit = { top: "#fb923c", topDark: "#ea580c", legs: "#3b5b8f", shoes: "#f8fafc", shoeTrim: "#ef4444" };
export const BobHair = ({ r }: { r: number }) => (
  <g>
    <path d={`M ${-r * 0.98} ${-r * 0.28} Q ${-r * 0.92} ${-r * 1.14} 0 ${-r * 1.12} Q ${r * 0.92} ${-r * 1.14} ${r * 0.98} ${-r * 0.28} Z`} fill="#facc15" stroke={INK} strokeWidth={r * 0.06} strokeLinejoin="round" />
    <path d={`M ${r * 0.2} ${-r * 0.34} Q ${r * 1.15} ${-r * 0.5} ${r * 1.5} ${-r * 0.2} Q ${r * 1.1} ${-r * 0.08} ${r * 0.3} ${-r * 0.2} Z`} fill="#eab308" stroke={INK} strokeWidth={r * 0.055} strokeLinejoin="round" />
    <path d={`M ${-r * 0.5} ${-r * 0.95} Q 0 ${-r * 1.08} ${r * 0.5} ${-r * 0.95}`} stroke="#fde68a" strokeWidth={r * 0.06} fill="none" />
    <circle cx={0} cy={-r * 1.1} r={r * 0.08} fill="#ef4444" stroke={INK} strokeWidth={r * 0.03} />
    <circle cx={-r * 0.1} cy={-r * 0.66} r={r * 0.17} fill="#ef4444" stroke={INK} strokeWidth={r * 0.04} /><circle cx={-r * 0.1} cy={-r * 0.66} r={r * 0.07} fill="#fff" />
    <path d={`M ${-r * 0.98} ${-r * 0.2} q ${-r * 0.1} ${r * 0.2} ${r * 0.05} ${r * 0.3} M ${-r * 0.86} ${-r * 0.24} q ${-r * 0.02} ${r * 0.2} ${r * 0.1} ${r * 0.24}`} stroke="#5b3a29" strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />
  </g>
);

export const GUS: Outfit = { top: "#60a5fa", topDark: "#2563eb", legs: "#57534e", shoes: "#3f2a1d", apron: "#fef3c7" };
export const GusHair = ({ r }: { r: number }) => (
  <g>{[-1, 1].map((sd) => <path key={sd} d={`M ${sd * r * 0.96} ${-r * 0.05} Q ${sd * r * 1.16} ${-r * 0.42} ${sd * r * 0.78} ${-r * 0.68} Q ${sd * r * 0.9} ${-r * 0.36} ${sd * r * 0.7} ${-r * 0.18} Z`} fill="#9ca3af" stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />)}
    <path d={`M ${-r * 0.3} ${-r * 0.8} q ${r * 0.1} ${-r * 0.12} ${r * 0.2} 0`} stroke="#cbd5e1" strokeWidth={r * 0.05} fill="none" /></g>
);
// the moustache sits on the face layer (faceExtra), droops when he is tired
export const Moustache: React.FC<{ r?: number; droop?: number }> = ({ r = 112, droop = 0 }) => (
  <path d={`M 0 ${r * 0.26} Q ${-r * 0.3} ${r * 0.14} ${-r * 0.58} ${r * (0.3 + 0.2 * droop)} Q ${-r * 0.7} ${r * (0.42 + 0.22 * droop)} ${-r * 0.5} ${r * (0.5 + 0.18 * droop)} Q ${-r * 0.24} ${r * 0.44} 0 ${r * 0.36} Q ${r * 0.24} ${r * 0.44} ${r * 0.5} ${r * (0.5 + 0.18 * droop)} Q ${r * 0.7} ${r * (0.42 + 0.22 * droop)} ${r * 0.58} ${r * (0.3 + 0.2 * droop)} Q ${r * 0.3} ${r * 0.14} 0 ${r * 0.26} Z`} fill="#6b7280" stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />
);

export const KING: Outfit = { top: "#b91c1c", topDark: "#7f1d1d", legs: "#1f2937", shoes: "#111827" };
export const KingHair = ({ r }: { r: number }) => (
  <g>
    <path d={`M ${-r * 0.7} ${-r * 0.78} L ${-r * 0.78} ${-r * 1.42} L ${-r * 0.38} ${-r * 1.1} L 0 ${-r * 1.55} L ${r * 0.38} ${-r * 1.1} L ${r * 0.78} ${-r * 1.42} L ${r * 0.7} ${-r * 0.78} Z`} fill="#facc15" stroke={INK} strokeWidth={r * 0.06} strokeLinejoin="round" />
    {[-0.5, 0, 0.5].map((x, i) => <circle key={i} cx={r * x} cy={-r * 0.95} r={r * 0.08} fill={["#ef4444", "#3b82f6", "#22c55e"][i]} stroke={INK} strokeWidth={r * 0.03} />)}
    {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * r * 0.95} ${-r * 0.3} Q ${sd * r * 1.12} ${-r * 0.05} ${sd * r * 0.92} ${r * 0.2}`} stroke="#f8fafc" strokeWidth={r * 0.14} fill="none" strokeLinecap="round" />)}
  </g>
);
export const KingBeard = ({ r = 112 }: { r?: number }) => <path d={`M ${-r * 0.62} ${r * 0.42} Q 0 ${r * 1.25} ${r * 0.62} ${r * 0.42} Q 0 ${r * 0.72} ${-r * 0.62} ${r * 0.42} Z`} fill="#f8fafc" stroke={INK} strokeWidth={r * 0.05} />;
export const Megaphone = () => (
  <g><path d="M 0 -18 L 90 -60 L 90 60 L 0 18 Z" fill="#f8fafc" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><rect x={-26} y={-20} width={30} height={40} rx={8} fill="#ef4444" stroke={INK} strokeWidth={7} /><ellipse cx={90} cy={0} rx={14} ry={60} fill="#e5e7eb" stroke={INK} strokeWidth={7} /></g>
);

type P = { x: number; y: number; s?: number; flip?: boolean; pose?: ToonPose; expr?: Expr; look?: Look; id: string; holdF?: React.ReactNode; holdB?: React.ReactNode; blush?: boolean; extra?: React.ReactNode; fistF?: boolean; arms?: boolean };
export const Bob: React.FC<P> = (p) => <Toon {...p} outfit={BOB} hair={(r) => <BobHair r={r} />} hairBack={() => null} faceExtra={p.extra} />;
export const Gus: React.FC<P & { droop?: number }> = ({ droop = 0, ...p }) => <Toon {...p} outfit={GUS} hair={(r) => <GusHair r={r} />} hairBack={() => null} faceExtra={<g><Moustache droop={droop} />{p.extra}</g>} />;
export const King: React.FC<P> = (p) => <Toon {...p} outfit={KING} hair={(r) => <KingHair r={r} />} hairBack={() => null} faceExtra={<g><KingBeard />{p.extra}</g>} />;

// townsfolk for the crowd scenes: a palette of outfits and simple hair / caps
const TOPS = ["#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#14b8a6", "#f59e0b", "#ec4899", "#64748b"];
export const townie = (i: number): Outfit => ({ top: TOPS[i % 8], topDark: TOPS[(i + 3) % 8], legs: ["#1e293b", "#475569", "#78350f"][i % 3], shoes: "#1f2937" });
export const TownHair = ({ r, i }: { r: number; i: number }) => i % 3 === 0
  ? <path d={`M ${-r * 0.98} ${-r * 0.28} Q ${-r * 0.92} ${-r * 1.14} 0 ${-r * 1.12} Q ${r * 0.92} ${-r * 1.14} ${r * 0.98} ${-r * 0.28} Z`} fill={TOPS[(i + 5) % 8]} stroke={INK} strokeWidth={r * 0.06} />
  : <path d={`M ${-r * 0.96} ${-r * 0.2} Q ${-r * 0.9} ${-r * 1.08} 0 ${-r * 1.06} Q ${r * 0.9} ${-r * 1.08} ${r * 0.96} ${-r * 0.2} Q ${r * 0.4} ${-r * 0.62} ${-r * 0.96} ${-r * 0.2} Z`} fill={["#2b1d1a", "#78350f", "#fde68a", "#9ca3af"][i % 4]} stroke={INK} strokeWidth={r * 0.05} />;
export const Townie: React.FC<P & { i: number }> = ({ i, ...p }) => <Toon {...p} outfit={townie(i)} hair={(r) => <TownHair r={r} i={i} />} hairBack={() => null} faceExtra={p.extra} />;
export const BAKER: Outfit = { top: "#f8fafc", topDark: "#cbd5e1", legs: "#334155", shoes: "#1f2937", apron: "#fde68a" };
export const FARMER: Outfit = { top: "#ef4444", topDark: "#b91c1c", legs: "#2563eb", shoes: "#78350f", apron: "#3b82f6" };
