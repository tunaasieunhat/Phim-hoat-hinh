// "Rainy day" toon cast — big round white heads with thick ink, cheeky brows and dot eyes, stick limbs,
// each character in their own outfit. Every part is its own layer (back arm, legs, outfit, near arm, head,
// hair, face) so scenes can pose and animate them with GSAP. Origin = point between the feet; −y is up.
import React from "react";

export const INK = "#17161c";
export type Expr = "smug" | "happy" | "sleepy" | "shock" | "determined" | "chew" | "talk";
export type ToonPose = {
  lean?: number;              // torso tilt (deg, + = toward +x)
  head?: number;              // extra head tilt
  aB?: [number, number];      // back arm: upper, forearm (deg, 0 = down, + toward +x)
  aF?: [number, number];      // front arm
  lB?: [number, number];      // back leg: thigh, shin
  lF?: [number, number];
  sit?: number;               // 0 stand → 1 sit (hips drop)
  dy?: number;                // whole-body hop
};
export type Look = { look?: number; blink?: number; mouth?: number }; // look −1..1, blink 0..1, mouth open 0..1

const rad = (a: number) => (a * Math.PI) / 180;
const pt = (x: number, y: number, a: number, l: number): [number, number] => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];

// --- the head: white disc, ink outline, soft shade, then hair and face on top
export const Head: React.FC<{ r: number; hair: React.ReactNode; back?: React.ReactNode; expr: Expr; look?: Look; blush?: boolean; extra?: React.ReactNode; id: string }> = ({ r, hair, back, expr, look = {}, blush, extra, id }) => {
  const lx = (look.look ?? 0) * r * 0.12;
  const bl = look.blink ?? 0;
  const ey = -r * 0.02, ex = r * 0.34;
  const eyeH = (open: number) => Math.max(0.06, open * (1 - bl));
  // eye openness and brow shapes per expression
  const E: Record<Expr, { eyes: [number, number]; brow: [number, number, number, number]; mouth: string }> = {
    smug: { eyes: [0.55, 0.85], brow: [-6, 8, 14, -16], mouth: `M ${-r * 0.22} ${r * 0.42} Q ${r * 0.05} ${r * 0.56} ${r * 0.3} ${r * 0.34}` },
    happy: { eyes: [1, 1], brow: [-10, -10, 10, 10], mouth: `M ${-r * 0.28} ${r * 0.36} Q 0 ${r * 0.66} ${r * 0.28} ${r * 0.36} Z` },
    sleepy: { eyes: [0.2, 0.2], brow: [6, 4, -4, -6], mouth: `M ${-r * 0.12} ${r * 0.46} Q 0 ${r * 0.52} ${r * 0.12} ${r * 0.46}` },
    shock: { eyes: [1.35, 1.35], brow: [-22, -14, 14, 22], mouth: "" },
    determined: { eyes: [0.95, 0.95], brow: [14, 8, -8, -14], mouth: `M ${-r * 0.26} ${r * 0.4} Q 0 ${r * 0.6} ${r * 0.26} ${r * 0.4} Z` },
    chew: { eyes: [0.15, 0.15], brow: [-8, -6, 6, 8], mouth: "" },
    talk: { eyes: [1, 1], brow: [-8, -4, 4, 8], mouth: "" },
  };
  const e = E[expr];
  const mo = look.mouth ?? 0;
  return (
    <g>
      <defs>
        <radialGradient id={`hs${id}`} cx="0.38" cy="0.32" r="0.75"><stop offset="0.6" stopColor="#ffffff" /><stop offset="1" stopColor="#dfe3ee" /></radialGradient>
      </defs>
      {back}
      <circle r={r} fill={`url(#hs${id})`} stroke={INK} strokeWidth={r * 0.085} />
      {hair}
      {/* eyes: dot eyes with a glint; "happy"/"chew" close into arcs */}
      {[-1, 1].map((sd, i) => {
        const cx = sd * ex + lx, h = r * 0.15 * eyeH(e.eyes[i]);
        if ((expr === "happy" || expr === "chew") && bl < 0.5) return <path key={sd} d={`M ${cx - r * 0.12} ${ey + r * 0.04} Q ${cx} ${ey - r * 0.12} ${cx + r * 0.12} ${ey + r * 0.04}`} stroke={INK} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />;
        return <g key={sd}><ellipse cx={cx} cy={ey} rx={r * 0.085 * (expr === "shock" ? 1.25 : 1)} ry={h} fill={INK} />{h > r * 0.06 && <circle cx={cx + r * 0.03} cy={ey - h * 0.45} r={r * 0.028} fill="#fff" />}{e.eyes[i] < 0.7 && expr !== "sleepy" && <line x1={cx - r * 0.13} y1={ey - h} x2={cx + r * 0.13} y2={ey - h} stroke={INK} strokeWidth={r * 0.05} strokeLinecap="round" />}</g>;
      })}
      {/* brows: thick, rounded, very expressive */}
      {[-1, 1].map((sd, i) => {
        const cx = sd * ex + lx * 0.6, cy = ey - r * 0.3 - (expr === "shock" ? r * 0.08 : 0);
        const a = e.brow[i * 2], b = e.brow[i * 2 + 1];
        return <path key={sd} d={`M ${cx - r * 0.15} ${cy + a * r * 0.006} Q ${cx} ${cy - r * 0.05 + (a + b) * r * 0.002} ${cx + r * 0.15} ${cy + b * r * 0.006}`} stroke={INK} strokeWidth={r * 0.085} fill="none" strokeLinecap="round" />;
      })}
      {blush && [-1, 1].map((sd) => <ellipse key={sd} cx={sd * r * 0.55 + lx * 0.4} cy={r * 0.28} rx={r * 0.13} ry={r * 0.07} fill="#fb7185" opacity={0.45} />)}
      {/* mouth */}
      {expr === "shock" ? <ellipse cx={lx * 0.5} cy={r * 0.47} rx={r * 0.11} ry={r * 0.15} fill={INK} />
        : expr === "chew" ? <ellipse cx={lx * 0.5} cy={r * 0.45} rx={r * 0.12} ry={r * (0.04 + 0.06 * mo)} fill={INK} />
        : expr === "talk" ? <g><path d={`M ${-r * 0.2 + lx * 0.5} ${r * 0.38} Q ${lx * 0.5} ${r * (0.42 + 0.3 * mo)} ${r * 0.2 + lx * 0.5} ${r * 0.38} Z`} fill={INK} stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />{mo > 0.4 && <ellipse cx={lx * 0.5} cy={r * (0.42 + 0.18 * mo)} rx={r * 0.08} ry={r * 0.04} fill="#f87171" />}</g>
        : <path d={e.mouth} transform={`translate(${lx * 0.5} 0)`} fill={e.mouth.endsWith("Z") ? INK : "none"} stroke={INK} strokeWidth={r * 0.06} strokeLinecap="round" strokeLinejoin="round" />}
      {extra}
    </g>
  );
};

// Lily: black bob with bangs and a yellow star clip, oversized pink hoodie, grey joggers, fluffy slippers
export const LilyHair = ({ r }: { r: number }) => (
  <g>
    <path d={`M ${-r * 1.02} ${-r * 0.05} Q ${-r * 1.05} ${-r * 1.1} 0 ${-r * 1.08} Q ${r * 1.05} ${-r * 1.1} ${r * 1.02} ${-r * 0.05} Q ${r * 0.62} ${-r * 0.62} ${r * 0.1} ${-r * 0.5} Q ${-r * 0.2} ${-r * 0.78} ${-r * 0.42} ${-r * 0.46} Q ${-r * 0.8} ${-r * 0.5} ${-r * 1.02} ${-r * 0.05} Z`} fill="#2b1d1a" stroke={INK} strokeWidth={r * 0.06} strokeLinejoin="round" />
    <path d={`M ${-r * 0.5} ${-r * 0.86} Q ${-r * 0.1} ${-r * 1.02} ${r * 0.35} ${-r * 0.9}`} stroke="#5a4038" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" opacity={0.8} />
    <path transform={`translate(${r * 0.66} ${-r * 0.62}) rotate(18) scale(${r / 110})`} d="M 0 -22 L 7 -7 L 22 -5 L 10 6 L 14 22 L 0 13 L -14 22 L -10 6 L -22 -5 L -7 -7 Z" fill="#facc15" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
export const LilyHairBack = ({ r }: { r: number }) => (
  <path d={`M ${-r * 1.08} ${-r * 0.2} Q ${-r * 1.2} ${r * 0.62} ${-r * 0.86} ${r * 0.78} L ${r * 0.86} ${r * 0.78} Q ${r * 1.2} ${r * 0.62} ${r * 1.08} ${-r * 0.2} Z`} fill="#2b1d1a" stroke={INK} strokeWidth={r * 0.06} strokeLinejoin="round" />
);

export type Outfit = {
  top: string; topDark: string; legs: string; shoes: string; shoeTrim?: string;
  hood?: boolean; pocket?: boolean; apron?: string; cap?: string;
};
export const LILY: Outfit = { top: "#f472b6", topDark: "#db2777", legs: "#9ca3af", shoes: "#fbcfe8", shoeTrim: "#fff", hood: true, pocket: true };

// a whole figure; s scales everything (s = 1 → about 760 px tall)
export const Toon: React.FC<{
  x: number; y: number; s?: number; flip?: boolean; pose?: ToonPose; expr?: Expr; look?: Look; blush?: boolean; id: string;
  outfit?: Outfit; hair?: (r: number) => React.ReactNode; hairBack?: (r: number) => React.ReactNode;
  holdF?: React.ReactNode; holdB?: React.ReactNode; faceExtra?: React.ReactNode; arms?: boolean; fistF?: boolean;
}> = ({ x, y, s = 1, flip, pose = {}, expr = "happy", look, blush, id, outfit = LILY, hair = (r) => <LilyHair r={r} />, hairBack = (r) => <LilyHairBack r={r} />, holdF, holdB, faceExtra, arms = true, fistF }) => {
  const p = { lean: 0, head: 0, aB: [-14, -6] as [number, number], aF: [14, 6] as [number, number], lB: [-6, -2] as [number, number], lF: [6, 2] as [number, number], sit: 0, dy: 0, ...pose };
  const LEG = 105, UA = 88, FA = 82, TORSO = 205, R = 112;
  const hip: [number, number] = [0, -2 * LEG + p.sit * 170 + p.dy];
  const neck = pt(hip[0], hip[1], 180 + p.lean, TORSO);
  const sh = pt(hip[0], hip[1], 180 + p.lean, TORSO - 34);
  const head = pt(neck[0], neck[1], 180 + p.lean + p.head * 0.3, R * 0.92);
  const leg = (a: [number, number]) => { const k = pt(hip[0], hip[1], a[0], LEG); return [hip, k, pt(k[0], k[1], a[1], LEG)] as [number, number][]; };
  const arm = (side: number, a: [number, number]) => {
    const perp: [number, number] = [Math.cos(rad(p.lean)), -Math.sin(rad(p.lean))];
    const o: [number, number] = [sh[0] + side * perp[0] * 46, sh[1] + side * perp[1] * 46];
    const e = pt(o[0], o[1], a[0], UA);
    return [o, e, pt(e[0], e[1], a[1], FA)] as [number, number][];
  };
  const LB = leg(p.lB), LF = leg(p.lF), AB = arm(-1, p.aB), AF = arm(1, p.aF);
  const poly = (q: [number, number][]) => q.map((v) => v.join(",")).join(" ");
  const stick = (q: [number, number][], w = 11) => <polyline points={poly(q)} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
  // joggers: a thick grey sleeve over the thigh and most of the shin, ink-outlined
  const pants = (q: [number, number][]) => { const end = [q[1][0] + (q[2][0] - q[1][0]) * 0.72, q[1][1] + (q[2][1] - q[1][1]) * 0.72] as [number, number]; const pp = poly([q[0], q[1], end]); return <g><polyline points={pp} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" /><polyline points={pp} fill="none" stroke={outfit.legs} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" /></g>; };
  const shoe = (q: [number, number][]) => { const f = q[2]; return <g transform={`translate(${f[0]} ${f[1]})`}><ellipse cx={14} cy={-6} rx={38} ry={20} fill={outfit.shoes} stroke={INK} strokeWidth={7} />{outfit.shoeTrim && <path d="M -14 -16 q 10 -10 22 -2 q 10 -10 22 2" stroke={outfit.shoeTrim} strokeWidth={9} fill="none" strokeLinecap="round" />}</g>; };
  // short puffy sleeve, then the black stick arm, then a white mitten hand
  const limbArm = (q: [number, number][], hold?: React.ReactNode, fist?: boolean) => {
    const cuff = [q[0][0] + (q[1][0] - q[0][0]) * 0.55, q[0][1] + (q[1][1] - q[0][1]) * 0.55] as [number, number];
    return <g>{stick(q)}<polyline points={poly([q[0], cuff])} fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" /><polyline points={poly([q[0], cuff])} fill="none" stroke={outfit.top} strokeWidth={38} strokeLinecap="round" />
      {hold && <g transform={`translate(${q[2][0]} ${q[2][1]})`}>{hold}</g>}
      {fist ? <g transform={`translate(${q[2][0]} ${q[2][1]})`}><circle r={30} fill="#fff" stroke={INK} strokeWidth={8} /><path d="M -14 -10 q 6 -8 12 0 M 2 -10 q 6 -8 12 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /></g> : <circle cx={q[2][0]} cy={q[2][1]} r={17} fill="#fff" stroke={INK} strokeWidth={7} />}</g>;
  };
  // the hoodie: a soft trapezoid that follows the torso lean
  const torso = (() => {
    const L = rad(180 + p.lean), u: [number, number] = [Math.sin(L), Math.cos(L)], v: [number, number] = [-u[1], u[0]];
    const at = (t: number, w: number): [number, number] => [hip[0] + u[0] * TORSO * t + v[0] * w, hip[1] + u[1] * TORSO * t + v[1] * w];
    const a = at(0.86, -62), b = at(0.86, 62), c = at(-0.12, 82), d = at(-0.12, -82), m1 = at(0.98, 0), m2 = at(-0.2, 0);
    const pk = [at(0.32, -44), at(0.32, 44), at(0.08, 50), at(0.08, -50)];
    return (
      <g>
        <defs><linearGradient id={`tg${id}`} x1="0" x2="1"><stop offset="0" stopColor={outfit.top} /><stop offset="0.65" stopColor={outfit.top} /><stop offset="1" stopColor={outfit.topDark} /></linearGradient></defs>
        {outfit.hood && <ellipse cx={neck[0] - 4} cy={neck[1] + 16} rx={70} ry={34} fill={outfit.topDark} stroke={INK} strokeWidth={8} />}
        <path d={`M ${a[0]} ${a[1]} Q ${m1[0]} ${m1[1]} ${b[0]} ${b[1]} L ${c[0]} ${c[1]} Q ${m2[0]} ${m2[1]} ${d[0]} ${d[1]} Z`} fill={`url(#tg${id})`} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {outfit.apron && <path d={`M ${at(0.7, -40).join(" ")} L ${at(0.7, 40).join(" ")} L ${at(-0.16, 62).join(" ")} L ${at(-0.16, -62).join(" ")} Z`} fill={outfit.apron} stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
        {outfit.pocket && <path d={`M ${pk[0].join(" ")} L ${pk[1].join(" ")} L ${pk[2].join(" ")} L ${pk[3].join(" ")} Z`} fill={outfit.topDark} stroke={INK} strokeWidth={6} strokeLinejoin="round" opacity={0.9} />}
        {outfit.hood && [-14, 14].map((w) => { const q0 = at(0.84, w), q1 = at(0.6, w * 1.2); return <g key={w}><line x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke="#fff" strokeWidth={6} strokeLinecap="round" /><circle cx={q1[0]} cy={q1[1]} r={6} fill="#fff" stroke={INK} strokeWidth={3} /></g>; })}
      </g>
    );
  })();
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <ellipse cx={0} cy={4} rx={120} ry={20} fill="#000" opacity={0.18} />
      {arms && limbArm(AB, holdB)}
      {pants(LB)}{shoe(LB)}
      {pants(LF)}{shoe(LF)}
      {stick([neck, pt(neck[0], neck[1], 180 + p.lean, 30)], 12)}
      {torso}
      {arms && limbArm(AF, holdF, fistF)}
      <g transform={`translate(${head[0]} ${head[1]}) rotate(${p.lean * 0.5 + p.head})`}>
        <Head id={id} r={R} expr={expr} look={look} blush={blush} hair={hair(R)} back={hairBack(R)} extra={faceExtra} />
      </g>
    </g>
  );
};

// joint positions in scene space for a Toon drawn at (x, y) with scale s (same geometry as <Toon>)
export const toonJoints = (x: number, y: number, s: number, pose: ToonPose, flip = false) => {
  const p = { lean: 0, head: 0, aB: [-14, -6] as [number, number], aF: [14, 6] as [number, number], sit: 0, dy: 0, ...pose };
  const hip: [number, number] = [0, -210 + p.sit * 170 + p.dy];
  const neck = pt(hip[0], hip[1], 180 + p.lean, 205), sh = pt(hip[0], hip[1], 180 + p.lean, 171);
  const head = pt(neck[0], neck[1], 180 + p.lean + p.head * 0.3, 112 * 0.92);
  const perp: [number, number] = [Math.cos(rad(p.lean)), -Math.sin(rad(p.lean))];
  const hand = (side: number, a: [number, number]) => { const o: [number, number] = [sh[0] + side * perp[0] * 46, sh[1] + side * perp[1] * 46]; const e = pt(o[0], o[1], a[0], 88); return pt(e[0], e[1], a[1], 82); };
  const T = (q: [number, number]): [number, number] => [x + (flip ? -1 : 1) * s * q[0], y + s * q[1]];
  return { hip: T(hip), neck: T(neck), head: T(head), handB: T(hand(-1, p.aB)), handF: T(hand(1, p.aF)), r: 112 * s };
};
