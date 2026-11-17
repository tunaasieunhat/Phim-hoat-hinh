// The cast of "What Happens If You Don't Get Enough Sleep?" (adapted from ../Teams/people): big round eyes, spiral eyes, built on the jointed rig in ../Kids/rig (continuous poses).
import React from "react";
import { joints, type Pose } from "../Kids/rig";

export const INK = "#2b2f3a";
export const RED = "#e5484d";
export type Who = string;
type Look = { color: string; s: number; coat?: boolean; steth?: boolean; glasses?: boolean; thick?: boolean; hair: "messy" | "bob" | "bald" | "bun" | "wild"; hairColor: string; bags?: boolean; tie?: string; cardigan?: string; hood?: boolean; phones?: boolean; apron?: boolean; big?: boolean };
const p = (cardigan: string, hair: Look["hair"], hairColor: string, extra: Partial<Look> = {}): Look => ({ color: INK, s: 1, cardigan, hair, hairColor, ...extra });
export const CAST: Record<string, Look> = {
  me: p("#60a5fa", "messy", INK, { big: true }),
  teacher: p("#e2e8f0", "bald", "#6b7280", { glasses: true, thick: true, tie: "#b91c1c", s: 1.08 }),
};

export type Eyes = "wink" | "spiral" | "big" | "open" | "wide" | "closed" | "happy" | "tired" | "sad" | "dizzy";
export type Mouth = "smile" | "grin" | "flat" | "frown" | "o" | "wavy" | "chew" | "scream";
export type Face = { eyes?: Eyes; mouth?: Mouth; brows?: "none" | "worried" | "up" | "angry" | "stern"; look?: number; blush?: boolean; sweat?: boolean };

const pt = (x: number, y: number, ang: number, len: number): [number, number] => [x + Math.sin((ang * Math.PI) / 180) * len, y + Math.cos((ang * Math.PI) / 180) * len];

const FaceArt: React.FC<{ r: number; face: Face; f: number; color: string; bags?: boolean; glasses?: boolean; thick?: boolean; seed: number; big?: boolean }> = ({ r, face, f, color, bags, glasses, thick, seed, big }) => {
  const look = (face.look ?? 0) * r * 0.16;
  let eyes = face.eyes ?? "open";
  if (big && eyes === "open") eyes = "big";
  if ((eyes === "open" || eyes === "big" || eyes === "tired" || eyes === "wide") && (f + seed) % 109 < 4) eyes = "closed";
  const ex = r * 0.36, ey = -r * 0.04, sw = Math.max(3, r * 0.08);
  const eye = (sx: number) => {
    const cx = sx * ex + look;
    if (eyes === "closed") return <path d={`M ${cx - r * 0.15} ${ey} Q ${cx} ${ey + r * 0.12} ${cx + r * 0.15} ${ey}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    if (eyes === "happy") return <path d={`M ${cx - r * 0.16} ${ey + r * 0.05} Q ${cx} ${ey - r * 0.17} ${cx + r * 0.16} ${ey + r * 0.05}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    if (eyes === "dizzy") return <path d={`M ${cx - r * 0.12} ${ey - r * 0.12} L ${cx + r * 0.12} ${ey + r * 0.12} M ${cx + r * 0.12} ${ey - r * 0.12} L ${cx - r * 0.12} ${ey + r * 0.12}`} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    if (eyes === "wink") return sx > 0 ? <path d={`M ${cx - r * 0.18} ${ey + r * 0.02} Q ${cx} ${ey - r * 0.14} ${cx + r * 0.18} ${ey + r * 0.02}`} fill="none" stroke={color} strokeWidth={sw * 1.1} strokeLinecap="round" /> : (<g><circle cx={cx} cy={ey} r={r * 0.25} fill="#fff" stroke={color} strokeWidth={sw * 0.8} /><circle cx={cx + look * 0.4} cy={ey + r * 0.02} r={r * 0.13} fill={color} /><circle cx={cx + look * 0.4 + r * 0.05} cy={ey - r * 0.04} r={r * 0.045} fill="#fff" /></g>);
    if (eyes === "big") return (<g><circle cx={cx} cy={ey} r={r * 0.25} fill="#fff" stroke={color} strokeWidth={sw * 0.8} /><circle cx={cx + look * 0.4} cy={ey + r * 0.02} r={r * 0.13} fill={color} /><circle cx={cx + look * 0.4 + r * 0.05} cy={ey - r * 0.04} r={r * 0.045} fill="#fff" /></g>);
    if (eyes === "spiral") return <path transform={`translate(${cx} ${ey}) rotate(${sx * f * 12})`} d={`M 0 0 m ${r * 0.03} 0 a ${r * 0.03} ${r * 0.03} 0 1 1 ${-r * 0.06} 0 a ${r * 0.08} ${r * 0.08} 0 1 1 ${r * 0.14} 0 a ${r * 0.13} ${r * 0.13} 0 1 1 ${-r * 0.24} 0 a ${r * 0.18} ${r * 0.18} 0 1 1 ${r * 0.34} 0`} fill="none" stroke={color} strokeWidth={sw * 0.8} strokeLinecap="round" />;
    if (eyes === "wide") return (<g><circle cx={cx} cy={ey} r={r * 0.2} fill="#fff" stroke={color} strokeWidth={sw * 0.8} /><circle cx={cx} cy={ey} r={r * 0.08} fill={color} /></g>);
    return (
      <g>
        <ellipse cx={cx} cy={ey + (eyes === "tired" ? r * 0.04 : 0)} rx={r * 0.1} ry={eyes === "tired" ? r * 0.08 : r * 0.13} fill={color} />
        {eyes === "tired" && <line x1={cx - r * 0.17} y1={ey - r * 0.05} x2={cx + r * 0.17} y2={ey - r * 0.03} stroke={color} strokeWidth={sw} strokeLinecap="round" />}
      </g>
    );
  };
  const brow = (sx: number) => {
    const b = face.brows ?? "none"; if (b === "none") return null;
    const cx = sx * ex + look, by = ey - r * 0.36;
    const d = b === "worried" ? [0.08, -0.08] : b === "angry" ? [-0.1, 0.07] : b === "stern" ? [-0.04, 0.04] : [-0.1, -0.12];
    return <line x1={cx - sx * r * 0.18} y1={by + d[0] * r} x2={cx + sx * r * 0.14} y2={by + d[1] * r} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
  };
  const m = face.mouth ?? "smile", mx = look * 0.8, my = r * 0.42;
  const chew = Math.abs(Math.sin(f / 3));
  const mouth =
    m === "smile" ? <path d={`M ${mx - r * 0.22} ${my - r * 0.06} Q ${mx} ${my + r * 0.18} ${mx + r * 0.22} ${my - r * 0.06}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    : m === "grin" ? <path d={`M ${mx - r * 0.28} ${my - r * 0.1} Q ${mx} ${my + r * 0.36} ${mx + r * 0.28} ${my - r * 0.1} Z`} fill="#fff" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    : m === "flat" ? <line x1={mx - r * 0.18} y1={my} x2={mx + r * 0.18} y2={my + r * 0.02} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    : m === "frown" ? <path d={`M ${mx - r * 0.2} ${my + r * 0.1} Q ${mx} ${my - r * 0.1} ${mx + r * 0.2} ${my + r * 0.1}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    : m === "o" ? <ellipse cx={mx} cy={my} rx={r * 0.1} ry={r * 0.14} fill={color} />
    : m === "scream" ? <ellipse cx={mx} cy={my + r * 0.04} rx={r * 0.17} ry={r * 0.22} fill="#5a2a28" stroke={color} strokeWidth={sw * 0.7} />
    : m === "chew" ? <ellipse cx={mx} cy={my} rx={r * 0.16} ry={r * (0.04 + 0.08 * chew)} fill="#5a2a28" stroke={color} strokeWidth={sw * 0.7} />
    : <path d={`M ${mx - r * 0.24} ${my} q ${r * 0.06} ${-r * 0.1} ${r * 0.12} 0 t ${r * 0.12} 0 t ${r * 0.12} 0 t ${r * 0.12} 0`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
  return (
    <g>
      {bags && [-1, 1].map((sx) => <path key={sx} d={`M ${sx * ex + look - r * 0.15} ${ey + r * 0.2} Q ${sx * ex + look} ${ey + r * 0.32} ${sx * ex + look + r * 0.15} ${ey + r * 0.2}`} fill="none" stroke="#7c6f9b" strokeWidth={sw * 0.8} strokeLinecap="round" opacity={0.75} />)}
      {eye(-1)}{eye(1)}{brow(-1)}{brow(1)}{mouth}
      {glasses && (<g fill={thick ? "#e0f2fe" : "none"} fillOpacity={0.35} stroke={color} strokeWidth={sw * (thick ? 1.6 : 0.8)}><circle cx={-ex + look} cy={ey} r={r * (thick ? 0.27 : 0.24)} /><circle cx={ex + look} cy={ey} r={r * (thick ? 0.27 : 0.24)} /><line x1={-ex + look + r * 0.24} y1={ey} x2={ex + look - r * 0.24} y2={ey} /></g>)}
      {face.blush && [-1, 1].map((sx) => <ellipse key={sx} cx={sx * r * 0.58 + look} cy={r * 0.26} rx={r * 0.13} ry={r * 0.08} fill="#f87171" opacity={0.35} />)}
      {face.sweat && <path transform={`translate(${r * 0.95} ${-r * 0.4 + ((f % 30) / 30) * r * 0.5})`} d={`M 0 ${-r * 0.16} Q ${r * 0.14} ${r * 0.04} 0 ${r * 0.12} Q ${-r * 0.14} ${r * 0.04} 0 ${-r * 0.16} Z`} fill="#93c5fd" stroke={color} strokeWidth={2.5} />}
    </g>
  );
};

// (x, y) = ground point. pose angles as in ../Kids/rig (0 = down, + towards +x).
export const Person: React.FC<{ who: Who; x: number; y: number; pose: Pose; face?: Face; f: number; flip?: boolean; s?: number; opacity?: number; backpack?: boolean }> = ({ who, x, y, pose, face = {}, f, flip, s: sc = 1, opacity = 1, backpack }) => {
  const L = CAST[who];
  const s = L.s * sc;
  const color = L.color;
  const j = joints("dad", 0, 0, s, pose, false);
  const sh = pt(j.hip[0], j.hip[1], 180 + pose.lean, 150 * s * 0.9);
  // arms hang from two shoulders a little either side of the spine (not one point), as outlined sleeves with a hand
  const lr = (pose.lean * Math.PI) / 180, perp: [number, number] = [Math.cos(lr), -Math.sin(lr)];
  const limb = (side: number, a: [number, number]): [number, number][] => {
    const o: [number, number] = [sh[0] + side * perp[0] * 17 * s, sh[1] + side * perp[1] * 17 * s + 4 * s];
    const e = pt(o[0], o[1], a[0], 72 * s);
    return [o, e, pt(e[0], e[1], a[1], 66 * s)];
  };
  const armL = limb(-1, pose.aL), armR = limb(1, pose.aR);
  const kL = pt(j.hip[0], j.hip[1], pose.lL[0], 90 * s), kR = pt(j.hip[0], j.hip[1], pose.lR[0], 90 * s);
  const w = 10 * s, r = 46 * s;
  const line = (p: [number, number][], c = color, ww = w) => <polyline points={p.map((q) => q.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={ww} strokeLinecap="round" strokeLinejoin="round" />;
  const sleeve = L.coat ? "#fff" : L.cardigan;
  const arm = (q: [number, number][]) => (
    <g>
      {sleeve ? <>{line(q, INK, w * 2.2 + 6 * s)}{line(q, sleeve, w * 2.2)}</> : line(q)}
      <circle cx={q[2][0]} cy={q[2][1]} r={w * 1.0} fill="#fffdf8" stroke={color} strokeWidth={w * 0.45} />
    </g>
  );
  const flap = Math.sin(f / 7) * 6 * s + pose.lean * 0.5;
  const coatPts = (side: number) => {
    const top: [number, number] = [sh[0] + side * 12 * s, sh[1] + 4 * s];
    return `M ${top[0]} ${top[1]} L ${sh[0] + side * 30 * s} ${sh[1] + 12 * s} L ${j.hip[0] + side * (44 * s + Math.max(0, side * flap))} ${j.hip[1] + 46 * s} L ${j.hip[0] + side * 6 * s} ${j.hip[1] + 46 * s} L ${sh[0] + side * 4 * s} ${sh[1] + 40 * s} Z`;
  };
  const headRot = pose.lean + pose.tilt;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} opacity={opacity}>
      {backpack && <rect x={sh[0] - 64 * s} y={sh[1] + 6 * s} width={52 * s} height={92 * s} rx={16 * s} fill="#6d8fb5" stroke={INK} strokeWidth={4 * s} transform={`rotate(${pose.lean} ${sh[0]} ${sh[1]})`} />}
      {line([j.hip, kL, j.footL])}
      {line([j.hip, kR, j.footR])}
      {[j.footL, j.footR].map((q, i) => <ellipse key={i} cx={q[0] + 10 * s} cy={q[1]} rx={15 * s} ry={7 * s} fill={color} />)}
      {arm(armL)}
      {line([j.hip, j.neck])}
      {L.coat && [-1, 1].map((side) => <path key={side} d={coatPts(side)} fill="#fff" stroke={INK} strokeWidth={4 * s} strokeLinejoin="round" />)}
      {L.cardigan && <path d={`M ${sh[0] - 32 * s} ${sh[1] + 8 * s} L ${sh[0] + 32 * s} ${sh[1] + 8 * s} L ${j.hip[0] + 40 * s} ${j.hip[1] + 30 * s} L ${j.hip[0] - 40 * s} ${j.hip[1] + 30 * s} Z`} fill={L.cardigan} stroke={INK} strokeWidth={4 * s} strokeLinejoin="round" />}
      {L.apron && <g><path d={`M ${j.neck[0] - 16 * s} ${j.neck[1] + 4 * s} L ${j.neck[0] - 22 * s} ${j.neck[1] + 46 * s} M ${j.neck[0] + 16 * s} ${j.neck[1] + 4 * s} L ${j.neck[0] + 22 * s} ${j.neck[1] + 46 * s}`} stroke={INK} strokeWidth={3 * s} /><path d={`M ${j.neck[0] - 26 * s} ${j.neck[1] + 46 * s} L ${j.neck[0] + 26 * s} ${j.neck[1] + 46 * s} L ${j.hip[0] + 34 * s} ${j.hip[1] + 40 * s} L ${j.hip[0] - 34 * s} ${j.hip[1] + 40 * s} Z`} fill="#fff" stroke={INK} strokeWidth={4 * s} strokeLinejoin="round" /><rect x={j.hip[0] - 16 * s} y={j.hip[1] - 4 * s} width={32 * s} height={22 * s} rx={4 * s} fill="#fde68a" stroke={INK} strokeWidth={3 * s} /></g>}
      {L.hood && <g><path d={`M ${j.neck[0] - 34 * s} ${j.neck[1] + 2 * s} Q ${j.neck[0]} ${j.neck[1] + 44 * s} ${j.neck[0] + 34 * s} ${j.neck[1] + 2 * s} Q ${j.neck[0]} ${j.neck[1] + 20 * s} ${j.neck[0] - 34 * s} ${j.neck[1] + 2 * s} Z`} fill="#3d5680" stroke={INK} strokeWidth={4 * s} strokeLinejoin="round" /><path d={`M ${j.neck[0] - 8 * s} ${j.neck[1] + 26 * s} l -2 ${26 * s} M ${j.neck[0] + 8 * s} ${j.neck[1] + 26 * s} l 2 ${26 * s}`} stroke="#e5e7eb" strokeWidth={3 * s} strokeLinecap="round" /><rect x={j.hip[0] - 26 * s} y={j.hip[1] - 2 * s} width={52 * s} height={24 * s} rx={8 * s} fill="#3d5680" stroke={INK} strokeWidth={3 * s} /></g>}
      {L.phones && <g><path d={`M ${j.neck[0] - 30 * s} ${j.neck[1] + 6 * s} Q ${j.neck[0]} ${j.neck[1] + 40 * s} ${j.neck[0] + 30 * s} ${j.neck[1] + 6 * s}`} fill="none" stroke="#111827" strokeWidth={7 * s} strokeLinecap="round" />{[-1, 1].map((sd) => <rect key={sd} x={j.neck[0] + sd * 32 * s - 11 * s} y={j.neck[1] - 6 * s} width={22 * s} height={28 * s} rx={9 * s} fill="#ef4444" stroke={INK} strokeWidth={4 * s} />)}</g>}
      {L.tie && <path d={`M ${j.neck[0] - 7 * s} ${j.neck[1] + 10 * s} L ${j.neck[0] + 7 * s} ${j.neck[1] + 10 * s} L ${j.neck[0] + 10 * s} ${j.neck[1] + 70 * s} L ${j.neck[0]} ${j.neck[1] + 84 * s} L ${j.neck[0] - 10 * s} ${j.neck[1] + 70 * s} Z`} fill={L.tie} stroke={INK} strokeWidth={3 * s} />}
      {L.steth && (<g><path d={`M ${j.neck[0] - 22 * s} ${j.neck[1] + 4 * s} Q ${j.neck[0] - 26 * s} ${j.neck[1] + 70 * s} ${j.neck[0] - 2 * s} ${j.neck[1] + 86 * s} M ${j.neck[0] + 22 * s} ${j.neck[1] + 4 * s} Q ${j.neck[0] + 26 * s} ${j.neck[1] + 54 * s} ${j.neck[0] + 14 * s} ${j.neck[1] + 70 * s}`} fill="none" stroke={RED} strokeWidth={6 * s} strokeLinecap="round" /><circle cx={j.neck[0] - 2 * s} cy={j.neck[1] + 92 * s} r={9 * s} fill="#d1d5db" stroke={INK} strokeWidth={3 * s} /></g>)}
      {L.coat && <rect x={j.neck[0] + 14 * s} y={j.neck[1] + 46 * s} width={24 * s} height={30 * s} rx={3 * s} fill="#fff" stroke={INK} strokeWidth={3 * s} transform={`rotate(${pose.lean} ${j.neck[0]} ${j.neck[1]})`} />}
      {arm(armR)}
      <g transform={`translate(${j.head[0]} ${j.head[1]}) rotate(${headRot})`}>
        {L.hair === "bun" && <circle cx={0} cy={-r * 1.05} r={r * 0.36} fill={L.hairColor} stroke={INK} strokeWidth={4 * s} />}
        {L.hair === "bob" && <path d={`M ${-r * 1.08} ${r * 0.5} Q ${-r * 1.2} ${-r * 1.15} 0 ${-r * 1.12} Q ${r * 1.2} ${-r * 1.15} ${r * 1.08} ${r * 0.5} Z`} fill={L.hairColor} />}
        <circle r={r} fill="#fffdf8" stroke={color} strokeWidth={w * 0.9} />
        {L.hair === "messy" && <path d={`M ${-r * 0.92} ${-r * 0.3} L ${-r * 0.9} ${-r * 0.82} L ${-r * 0.6} ${-r * 0.74} L ${-r * 0.5} ${-r * 1.2} L ${-r * 0.2} ${-r * 0.9} L ${r * 0.05} ${-r * 1.28} L ${r * 0.3} ${-r * 0.92} L ${r * 0.62} ${-r * 1.16} L ${r * 0.66} ${-r * 0.76} L ${r * 0.94} ${-r * 0.74} L ${r * 0.92} ${-r * 0.3} Q ${r * 0.3} ${-r * 0.62} ${-r * 0.92} ${-r * 0.3} Z`} fill={L.hairColor} />}
        {L.hair === "wild" && <path d={`M ${-r * 1.0} ${-r * 0.1} L ${-r * 1.25} ${-r * 0.5} L ${-r * 0.85} ${-r * 0.7} L ${-r * 1.0} ${-r * 1.2} L ${-r * 0.45} ${-r * 0.95} L ${-r * 0.3} ${-r * 1.45} L ${r * 0.05} ${-r * 1.0} L ${r * 0.45} ${-r * 1.4} L ${r * 0.55} ${-r * 0.9} L ${r * 1.1} ${-r * 1.1} L ${r * 0.9} ${-r * 0.6} L ${r * 1.28} ${-r * 0.45} L ${r * 1.0} ${-r * 0.1} Q ${r * 0.2} ${-r * 0.6} ${-r * 1.0} ${-r * 0.1} Z`} fill={L.hairColor} stroke={INK} strokeWidth={3 * s} strokeLinejoin="round" />}
        {L.hair === "bob" && <path d={`M ${-r * 0.95} ${-r * 0.2} Q ${-r * 0.7} ${-r * 1.05} 0 ${-r * 1.0} Q ${r * 0.7} ${-r * 1.05} ${r * 0.95} ${-r * 0.2} Q ${r * 0.2} ${-r * 0.7} ${-r * 0.95} ${-r * 0.2} Z`} fill={L.hairColor} />}
        {L.hair === "bun" && <path d={`M ${-r * 0.96} ${-r * 0.1} Q ${-r * 0.8} ${-r * 1.0} 0 ${-r * 0.98} Q ${r * 0.8} ${-r * 1.0} ${r * 0.96} ${-r * 0.1} Q ${r * 0.3} ${-r * 0.55} ${-r * 0.96} ${-r * 0.1} Z`} fill={L.hairColor} stroke={INK} strokeWidth={3 * s} />}
        {L.hair === "bald" && <path d={`M ${-r * 0.98} ${r * 0.05} Q ${-r * 1.02} ${-r * 0.45} ${-r * 0.75} ${-r * 0.55} M ${r * 0.98} ${r * 0.05} Q ${r * 1.02} ${-r * 0.45} ${r * 0.75} ${-r * 0.55}`} fill="none" stroke={L.hairColor} strokeWidth={10 * s} strokeLinecap="round" />}
        {false && [-1, 1].map((sx) => <path key={sx} d={`M ${sx * r * 0.3} ${r * 0.62} q ${sx * r * 0.1} ${r * 0.06} ${sx * r * 0.2} 0`} fill="none" stroke={color} strokeWidth={2.5 * s} opacity={0.6} />)}
        <g transform={`scale(${flip ? -1 : 1} 1)`}>
          <FaceArt r={r} face={{ ...face, look: (face.look ?? 0) * (flip ? -1 : 1) }} f={f} color={color} bags={L.bags} glasses={L.glasses} thick={L.thick} big={L.big} seed={who.length * 17} />
        </g>
      </g>
    </g>
  );
};
export { joints };
