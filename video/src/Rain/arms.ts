// Arm geometry that matches Person (src/Sleep/people.tsx) exactly, plus two-bone IK, so a prop
// (broom, knife, mug, phone) can be placed first and the hands sent to it — the hands always sit on the prop.
import type { Pose } from "../Kids/rig";
import { S as SCALE } from "../Sleep/stage";

type V = [number, number];
const rad = (a: number) => (a * Math.PI) / 180, deg = (a: number) => (a * 180) / Math.PI;
const pt = (x: number, y: number, a: number, l: number): V => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];
export const lerpV = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// the two shoulder points (scene coordinates) of a Person drawn at (x, y) with this pose (not flipped)
export const shoulders = (x: number, y: number, p: Pose, s = SCALE): { L: V; R: V } => {
  const hip: V = [p.dx * s, -(180 - p.drop) * s + p.dy * s];
  const sh = pt(hip[0], hip[1], 180 + p.lean, 150 * s * 0.9);
  const lr = rad(p.lean), perp: V = [Math.cos(lr), -Math.sin(lr)];
  const o = (side: number): V => [x + sh[0] + side * perp[0] * 17 * s, y + sh[1] + side * perp[1] * 17 * s + 4 * s];
  return { L: o(-1), R: o(1) };
};
// where Person draws the hands for this pose
export const handsOf = (x: number, y: number, p: Pose, s = SCALE): { L: V; R: V } => {
  const o = shoulders(x, y, p, s);
  const h = (q: V, a: [number, number]) => { const e = pt(q[0], q[1], a[0], 72 * s); return pt(e[0], e[1], a[1], 66 * s); };
  return { L: h(o.L, p.aL), R: h(o.R, p.aR) };
};
// two-bone IK: [upper, forearm] angles that put the hand on target t. bend −1 = elbow below the line, +1 = above.
export const reach = (o: V, t: V, bend = -1, s = SCALE): [number, number] => {
  const a = 72 * s, b = 66 * s;
  const d = Math.max(Math.abs(a - b) + 1, Math.min(a + b - 0.5, Math.hypot(t[0] - o[0], t[1] - o[1])));
  const base = deg(Math.atan2(t[0] - o[0], t[1] - o[1]));
  const al = deg(Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d)))));
  const up = base + bend * al;
  const e = pt(o[0], o[1], up, a);
  return [up, deg(Math.atan2(t[0] - e[0], t[1] - e[1]))];
};
// the pose with either hand sent to a target (scene coordinates)
export const grip = (x: number, y: number, p: Pose, tL?: V | null, tR?: V | null, bendL = -1, bendR = -1): Pose => {
  const o = shoulders(x, y, p);
  return { ...p, aL: tL ? reach(o.L, tL, bendL) : p.aL, aR: tR ? reach(o.R, tR, bendR) : p.aR };
};
