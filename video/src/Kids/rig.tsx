// Jointed stick-figure rig: every limb is a joint angle, so poses interpolate continuously (no pose swapping).
import React from "react";
import { Easing, interpolate } from "remotion";

export const INK = "#2b2f3a";
export const DAD = "#3d4f66"; // grey-blue
export const MIA = "#2e2a26";
export const ORANGE = "#f59e0b";
export const BLUE = "#4a6fa5";

// Angles in degrees. 0 = pointing down, positive swings towards +x (screen right).
export type Pose = {
  lean: number; // torso lean
  tilt: number; // extra head tilt
  aL: [number, number]; // left arm: upper, forearm (absolute)
  aR: [number, number];
  lL: [number, number]; // left leg: thigh, shin (absolute)
  lR: [number, number];
  drop: number; // hip lowered by this many units (sitting, kneeling, crouching)
  dx: number;
  dy: number;
};
export const STAND: Pose = { lean: 0, tilt: 0, aL: [-12, -6], aR: [12, 6], lL: [-7, -3], lR: [7, 3], drop: 0, dx: 0, dy: 0 };
export const P = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pair = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const mix = (a: Pose, b: Pose, t: number): Pose => ({
  lean: lerp(a.lean, b.lean, t), tilt: lerp(a.tilt, b.tilt, t), aL: pair(a.aL, b.aL, t), aR: pair(a.aR, b.aR, t),
  lL: pair(a.lL, b.lL, t), lR: pair(a.lR, b.lR, t), drop: lerp(a.drop, b.drop, t), dx: lerp(a.dx, b.dx, t), dy: lerp(a.dy, b.dy, t),
});
const EASE = Easing.bezier(0.45, 0, 0.25, 1);
// Pose keyframes [frame, pose]: eased in-out between neighbours, held outside.
export const poseAt = (f: number, keys: [number, Pose][]): Pose => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) return mix(keys[i - 1][1], keys[i][1], EASE((f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0])));
  }
  return keys[keys.length - 1][1];
};
// number tween with clamping
export const tw = (f: number, a: number, b: number, from = 0, to = 1, ease: (t: number) => number = EASE) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
// a pop: 0 -> overshoot -> 1
export const pop = (f: number, start: number, len = 14) => {
  const t = (f - start) / len;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 1.70158;
  const u = t - 1;
  return u * u * ((s + 1) * u + s) + 1;
};
// idle breathing layered on any pose
export const alive = (p: Pose, f: number, k = 1, seed = 0): Pose => ({
  ...p,
  lean: p.lean + Math.sin((f + seed) / 23) * 1.1 * k,
  tilt: p.tilt + Math.sin((f + seed) / 31) * 1.6 * k,
  aL: [p.aL[0] + Math.sin((f + seed) / 27) * 1.5 * k, p.aL[1] + Math.sin((f + seed) / 19) * 2 * k],
  aR: [p.aR[0] - Math.sin((f + seed) / 29) * 1.5 * k, p.aR[1] - Math.sin((f + seed) / 21) * 2 * k],
  dy: p.dy + Math.sin((f + seed) / 17) * 1.2 * k,
});
// a walk cycle (period in frames)
export const walk = (f: number, period = 26, amp = 1): Pose => {
  const a = Math.sin((f / period) * Math.PI * 2);
  const b = Math.cos((f / period) * Math.PI * 2);
  return P({
    lean: 4 * amp, lL: [a * 26 * amp, a * 26 * amp - Math.max(0, -b) * 26 * amp], lR: [-a * 26 * amp, -a * 26 * amp - Math.max(0, b) * 26 * amp],
    aL: [-a * 22 * amp, -a * 22 * amp + 12], aR: [a * 22 * amp, a * 22 * amp + 12], dy: -Math.abs(b) * 5 * amp,
  });
};

type Dims = { head: number; torso: number; ua: number; fa: number; th: number; sh: number; w: number };
const DIMS: Record<"dad" | "mia", Dims> = {
  dad: { head: 46, torso: 150, ua: 74, fa: 70, th: 90, sh: 90, w: 10 },
  mia: { head: 62, torso: 112, ua: 62, fa: 58, th: 66, sh: 66, w: 11 },
};
const pt = (x: number, y: number, ang: number, len: number): [number, number] => [x + Math.sin((ang * Math.PI) / 180) * len, y + Math.cos((ang * Math.PI) / 180) * len];

export type Joints = { hip: [number, number]; neck: [number, number]; head: [number, number]; handL: [number, number]; handR: [number, number]; footL: [number, number]; footR: [number, number]; headR: number };
// joint positions in scene coordinates; (x, y) = the ground point under the figure
export const joints = (kind: "dad" | "mia", x: number, y: number, s: number, p: Pose, flip = false): Joints => {
  const d = DIMS[kind];
  const k = flip ? -1 : 1;
  const hx = p.dx * s;
  const hy = -(d.th + d.sh - p.drop) * s + p.dy * s;
  const T = (q: [number, number]): [number, number] => [x + k * q[0], y + q[1]];
  const neck = pt(hx, hy, 180 + p.lean, d.torso * s);
  const sh = pt(hx, hy, 180 + p.lean, d.torso * s * 0.9);
  const head = pt(neck[0], neck[1], 180 + p.lean + p.tilt, d.head * s * 0.95);
  const eL = pt(sh[0], sh[1], p.aL[0], d.ua * s), hL = pt(eL[0], eL[1], p.aL[1], d.fa * s);
  const eR = pt(sh[0], sh[1], p.aR[0], d.ua * s), hR = pt(eR[0], eR[1], p.aR[1], d.fa * s);
  const kL = pt(hx, hy, p.lL[0], d.th * s), fL = pt(kL[0], kL[1], p.lL[1], d.sh * s);
  const kR = pt(hx, hy, p.lR[0], d.th * s), fR = pt(kR[0], kR[1], p.lR[1], d.sh * s);
  return { hip: T([hx, hy]), neck: T(neck), head: T(head), handL: T(hL), handR: T(hR), footL: T(fL), footR: T(fR), headR: d.head * s };
};

export type Eyes = "open" | "wide" | "closed" | "happy" | "tired" | "sad";
export type Mouth = "smile" | "grin" | "flat" | "frown" | "o" | "wavy" | "laugh";
export type Face = { eyes?: Eyes; mouth?: Mouth; brows?: "none" | "worried" | "up" | "angry"; look?: number; blush?: boolean };

const FaceArt: React.FC<{ r: number; face: Face; kind: "dad" | "mia"; f: number; color: string }> = ({ r, face, kind, f, color }) => {
  const look = (face.look ?? 0) * r * 0.16;
  let eyes = face.eyes ?? (kind === "dad" ? "tired" : "open");
  if ((eyes === "open" || eyes === "tired" || eyes === "wide") && (f + (kind === "dad" ? 37 : 0)) % 113 < 4) eyes = "closed";
  const ex = r * 0.36, ey = -r * 0.06, big = kind === "mia" ? 1.45 : 1;
  const sw = Math.max(3, r * 0.075);
  const eye = (sx: number) => {
    const cx = sx * ex + look;
    if (eyes === "closed") return <path d={`M ${cx - r * 0.15} ${ey} Q ${cx} ${ey + r * 0.12} ${cx + r * 0.15} ${ey}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    if (eyes === "happy") return <path d={`M ${cx - r * 0.16} ${ey + r * 0.05} Q ${cx} ${ey - r * 0.16} ${cx + r * 0.16} ${ey + r * 0.05}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
    if (eyes === "wide") return (<g><circle cx={cx} cy={ey} r={r * 0.2 * big * 0.8} fill="#fff" stroke={color} strokeWidth={sw * 0.8} /><circle cx={cx + look * 0.5} cy={ey} r={r * 0.08 * big} fill={color} /></g>);
    return (
      <g>
        <ellipse cx={cx} cy={ey + (eyes === "tired" || eyes === "sad" ? r * 0.04 : 0)} rx={r * 0.095 * big} ry={(eyes === "tired" ? r * 0.085 : r * 0.14) * big} fill={color} />
        {kind === "mia" && <circle cx={cx + r * 0.04} cy={ey - r * 0.06} r={r * 0.04} fill="#fff" />}
        {eyes === "tired" && <line x1={cx - r * 0.17} y1={ey - r * 0.06} x2={cx + r * 0.17} y2={ey - r * 0.04} stroke={color} strokeWidth={sw} strokeLinecap="round" />}
      </g>
    );
  };
  const brow = (sx: number) => {
    const cx = sx * ex + look, by = ey - r * 0.34;
    const b = face.brows ?? "none";
    if (b === "none") return null;
    const dy = b === "worried" ? [0.08, -0.08] : b === "angry" ? [-0.1, 0.06] : [-0.1, -0.12];
    return <line x1={cx - sx * r * 0.18} y1={by + dy[0] * r} x2={cx + sx * r * 0.14} y2={by + dy[1] * r} stroke={color} strokeWidth={sw} strokeLinecap="round" />;
  };
  const m = face.mouth ?? "smile", mx = look * 0.8, my = r * 0.42;
  const mouth =
    m === "smile" ? <path d={`M ${mx - r * 0.24} ${my - r * 0.06} Q ${mx} ${my + r * 0.2} ${mx + r * 0.24} ${my - r * 0.06}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    : m === "grin" || m === "laugh" ? <path d={`M ${mx - r * 0.3} ${my - r * 0.1} Q ${mx} ${my + r * (m === "laugh" ? 0.5 : 0.36)} ${mx + r * 0.3} ${my - r * 0.1} Z`} fill="#fff" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    : m === "flat" ? <line x1={mx - r * 0.2} y1={my} x2={mx + r * 0.2} y2={my + r * 0.02} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    : m === "frown" ? <path d={`M ${mx - r * 0.22} ${my + r * 0.1} Q ${mx} ${my - r * 0.12} ${mx + r * 0.22} ${my + r * 0.1}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    : m === "o" ? <ellipse cx={mx} cy={my} rx={r * 0.11} ry={r * 0.15} fill={color} />
    : <path d={`M ${mx - r * 0.26} ${my} q ${r * 0.065} ${-r * 0.1} ${r * 0.13} 0 t ${r * 0.13} 0 t ${r * 0.13} 0 t ${r * 0.13} 0`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />;
  return (
    <g>
      {kind === "dad" && (eyes === "tired" || eyes === "closed") && [-1, 1].map((sx) => (
        <path key={sx} d={`M ${sx * ex + look - r * 0.15} ${ey + r * 0.2} Q ${sx * ex + look} ${ey + r * 0.3} ${sx * ex + look + r * 0.15} ${ey + r * 0.2}`} fill="none" stroke={color} strokeWidth={sw * 0.6} strokeLinecap="round" opacity={0.55} />
      ))}
      {eye(-1)}{eye(1)}{brow(-1)}{brow(1)}{mouth}
      {(face.blush || kind === "mia") && [-1, 1].map((sx) => <ellipse key={sx} cx={sx * r * 0.58 + look} cy={r * 0.26} rx={r * 0.13} ry={r * 0.08} fill="#f87171" opacity={0.35} />)}
    </g>
  );
};

export const Figure: React.FC<{
  kind: "dad" | "mia"; x: number; y: number; s?: number; pose: Pose; face?: Face; f: number; flip?: boolean; opacity?: number; hideTie?: boolean;
}> = ({ kind, x, y, s = 1, pose, face = {}, f, flip = false, opacity = 1, hideTie }) => {
  const d = DIMS[kind];
  const color = kind === "dad" ? DAD : MIA;
  const j = joints(kind, 0, 0, s, pose, false);
  const sh = pt(j.hip[0], j.hip[1], 180 + pose.lean, d.torso * s * 0.9);
  const eL = pt(sh[0], sh[1], pose.aL[0], d.ua * s), eR = pt(sh[0], sh[1], pose.aR[0], d.ua * s);
  const kL = pt(j.hip[0], j.hip[1], pose.lL[0], d.th * s), kR = pt(j.hip[0], j.hip[1], pose.lR[0], d.th * s);
  const w = d.w * s, r = d.head * s;
  const line = (pts: [number, number][]) => <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
  const headRot = pose.lean + pose.tilt;
  const sway = Math.sin(f / 6) * 4 + pose.tilt * 0.6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} opacity={opacity}>
      {line([j.hip, kL, j.footL])}
      {line([j.hip, kR, j.footR])}
      {[j.footL, j.footR].map((q, i) => <ellipse key={i} cx={q[0] + 10 * s} cy={q[1]} rx={15 * s} ry={7 * s} fill={color} />)}
      {line([sh, eL, j.handL])}
      {kind === "mia" && (
        <path d={`M ${sh[0] - 4 * s} ${sh[1] + 16 * s} L ${j.hip[0] - 46 * s} ${j.hip[1] + 14 * s} L ${j.hip[0] + 46 * s} ${j.hip[1] + 14 * s} L ${sh[0] + 4 * s} ${sh[1] + 16 * s} Z`}
          fill={ORANGE} fillOpacity={0.9} stroke={color} strokeWidth={w * 0.55} strokeLinejoin="round" transform={`rotate(${pose.lean * 0.4} ${j.hip[0]} ${j.hip[1]})`} />
      )}
      {line([j.hip, j.neck])}
      {kind === "dad" && !hideTie && (
        <g transform={`translate(${j.neck[0]} ${j.neck[1]}) rotate(${pose.lean * 0.6 + Math.sin(f / 14) * 2})`}>
          <path d={`M ${-9 * s} ${10 * s} L ${9 * s} ${10 * s} L ${5 * s} ${24 * s} L ${12 * s} ${74 * s} L 0 ${90 * s} L ${-12 * s} ${74 * s} L ${-5 * s} ${24 * s} Z`} fill={BLUE} stroke={color} strokeWidth={w * 0.4} strokeLinejoin="round" />
        </g>
      )}
      {line([sh, eR, j.handR])}
      {[j.handL, j.handR].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={w * 0.85} fill="#fff" stroke={color} strokeWidth={w * 0.5} />)}
      <g transform={`translate(${j.head[0]} ${j.head[1]}) rotate(${headRot})`}>
        {kind === "mia" && [-1, 1].map((sx) => (
          <g key={sx} transform={`translate(${sx * r * 0.98} ${-r * 0.28}) rotate(${sx * 24 + sway * sx})`}>
            <ellipse cx={sx * r * 0.3} cy={r * 0.16} rx={r * 0.2} ry={r * 0.36} fill={color} />
            <circle cx={sx * r * 0.06} cy={-r * 0.06} r={r * 0.12} fill={ORANGE} />
          </g>
        ))}
        <circle r={r} fill="#fffdf8" stroke={color} strokeWidth={w * 0.9} />
        {kind === "dad" && <path d={`M ${-r * 0.82} ${-r * 0.56} Q ${-r * 0.3} ${-r * 1.12} ${r * 0.5} ${-r * 0.9} Q ${r * 0.9} ${-r * 0.74} ${r * 0.9} ${-r * 0.42} Q ${r * 0.2} ${-r * 0.8} ${-r * 0.82} ${-r * 0.56} Z`} fill={color} />}
        {kind === "mia" && <path d={`M ${-r * 0.92} ${-r * 0.38} Q ${-r * 0.5} ${-r * 1.12} ${r * 0.1} ${-r * 0.98} Q ${r * 0.8} ${-r * 0.95} ${r * 0.94} ${-r * 0.34} Q ${r * 0.4} ${-r * 0.7} ${-r * 0.1} ${-r * 0.56} Q ${-r * 0.5} ${-r * 0.5} ${-r * 0.92} ${-r * 0.38} Z`} fill={color} />}
        <g transform={`scale(${flip ? -1 : 1} 1)`}>
          <FaceArt r={r} face={{ ...face, look: (face.look ?? 0) * (flip ? -1 : 1) }} kind={kind} f={f} color={color} />
        </g>
      </g>
    </g>
  );
};
