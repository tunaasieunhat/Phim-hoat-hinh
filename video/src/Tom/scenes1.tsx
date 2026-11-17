// Scenes 1–3 of "What Happens If You Don't Get Enough Sleep?" (narrated version, 9:16).
// Motion is choreographed with GSAP timelines keyed to the narration (sentence start times from data.ts).
import React from "react";
import { alive, mix, P, walk } from "../Kids/rig";
import { INK, Person } from "../Sleep/people";
import { Bed, body, EnergyBar, GY, HAND, Phone, S as SCALE, SITBED, TimeTag, VH, VW } from "../Sleep/stage";
import { useTimeline } from "../Sleep/timeline";
import type { SceneData } from "./data";

export type SP = { sc: SceneData };
export const UP = 110; // the action sits 110 px higher than in the wordless version, clear of the subtitles
const FLOOR = GY - UP;
export const cue = (sc: SceneData) => ({ S: (i: number) => Math.round(sc.sentences[Math.min(i, sc.sentences.length - 1)].t0 * 30), T: (i: number) => sc.sentences[Math.min(i, sc.sentences.length - 1)].t0, E: (i: number) => sc.sentences[Math.min(i, sc.sentences.length - 1)].t1 });
const Room: React.FC<{ wall: string; floor: string; children?: React.ReactNode }> = ({ wall, floor, children }) => (
  <g><rect width={VW} height={VH} fill={wall} /><rect x={0} y={FLOOR} width={VW} height={VH - FLOOR} fill={floor} /><g transform={`translate(0 ${-UP})`}>{children}</g></g>
);

// Tom's brain: small, pink, with a face and tiny arms — the funniest supporting character
export const Brain: React.FC<{ f: number; mood?: "sleep" | "load" | "shock" | "cool" | "sugar"; s?: number }> = ({ f, mood = "sleep", s = 1 }) => (
  <g transform={`scale(${s}) translate(0 ${Math.sin(f / 12) * 4})`}>
    <path d="M -84 10 C -100 -40 -60 -86 -14 -74 C 10 -100 70 -92 78 -46 C 108 -20 96 40 54 50 C 30 76 -30 74 -50 52 C -78 50 -92 34 -84 10 Z" fill="#f9a8d4" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -6 -72 C -16 -40 8 -30 -4 -6 M -52 -40 C -30 -44 -30 -20 -50 -16 M 40 -62 C 26 -44 50 -34 40 -14 M 62 6 C 40 2 36 24 54 30" fill="none" stroke="#ec4899" strokeWidth={5} strokeLinecap="round" />
    {mood === "sleep" ? <path d="M -40 8 q 10 8 20 0 M 12 8 q 10 8 20 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      : mood === "cool" ? <g><rect x={-50} y={-6} width={42} height={24} rx={8} fill={INK} /><rect x={6} y={-6} width={42} height={24} rx={8} fill={INK} /><line x1={-8} y1={2} x2={6} y2={2} stroke={INK} strokeWidth={5} /></g>
      : <g>{[-30, 22].map((x) => <g key={x}><circle cx={x} cy={8} r={mood === "shock" ? 15 : 12} fill="#fff" stroke={INK} strokeWidth={4} /><circle cx={x + (mood === "load" ? Math.sin(f / 6) * 4 : 0)} cy={8 + (mood === "load" ? -3 : 0)} r={5} fill={INK} /></g>)}</g>}
    {mood === "shock" ? <ellipse cx={-4} cy={36} rx={8} ry={10} fill={INK} /> : mood === "cool" || mood === "sugar" ? <path d="M -18 30 Q -4 44 12 30" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /> : mood === "sleep" ? <ellipse cx={-4} cy={34} rx={6} ry={5} fill={INK} /> : <line x1={-14} y1={34} x2={8} y2={34} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
  </g>
);
// a thought cloud with small circles trailing down towards (tx, ty)
export const Cloud: React.FC<{ x: number; y: number; k: number; w?: number; h?: number; tail?: [number, number]; children?: React.ReactNode }> = ({ x, y, k, w = 420, h = 320, tail = [-150, 190], children }) => k <= 0.01 ? null : (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    {[0, 1].map((i) => <circle key={i} cx={tail[0] * (0.75 + i * 0.35)} cy={tail[1] * (0.8 + i * 0.3)} r={20 - i * 8} fill="#fff" stroke={INK} strokeWidth={5} />)}
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.42} fill="#fff" stroke={INK} strokeWidth={6} />
    {children}
  </g>
);
const Spinner: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>{Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; const on = (Math.floor(f / 3) - i + 80) % 8; return <circle key={i} cx={Math.cos(a) * 30} cy={Math.sin(a) * 30} r={8} fill="#3b82f6" opacity={0.2 + (on / 8) * 0.8} />; })}</g>
);
/* ---------- 1. "Just five more minutes" ---------- */
export const Tom1: React.FC<SP> = ({ sc }) => {
  const { S, T, E } = cue(sc);
  const s = useTimeline({ name: 0, say: 0, ff: 0, peng: 0, dead: 0, zoom: 0 }, (tl, v) => {
    tl.to(v, { name: 1, duration: 0.4, ease: "back.out(2.5)" }, T(0)).to(v, { name: 0, duration: 0.25 }, T(1) - 0.2)
      .to(v, { say: 1, duration: 0.35, ease: "back.out(2)" }, T(1) + 1.6).to(v, { say: 0, duration: 0.25 }, E(1) + 0.4)
      .to(v, { ff: 1, duration: T(2) - E(1) + 0.9, ease: "power2.in" }, E(1) - 0.9)     // the night fast-forwards to 3:47
      .to(v, { peng: 1, duration: 0.4, ease: "back.out(2)" }, T(3) + 0.4).to(v, { peng: 0, duration: 0.25 }, T(4) - 0.5)
      .to(v, { dead: 1, duration: 0.15 }, T(4)).to(v, { zoom: 1, duration: 0.7, ease: "power2.out" }, T(4));
  });
  const { f } = s;
  const mins = Math.round(23 * 60 + s.ff * (4 * 60 + 47));
  const time = `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const dead = s.dead > 0.5;
  const swipe = dead ? 0 : Math.sin(f * (0.5 + s.ff * 0.9)) * 8;
  const pose = alive({ ...SITBED, lean: 22, tilt: -14, aL: [64, 150], aR: [74, 160 + swipe] }, f, dead ? 0 : 0.6);
  const hx = 330, hy = GY - 40, j = body(hx, hy, pose);
  const pct = 100 - 85 * s.ff;
  return (
    <g>
      <rect width={VW} height={VH} fill="#1b2140" /><rect x={0} y={FLOOR} width={VW} height={VH - FLOOR} fill="#111633" />
      <g transform={`translate(0 ${-UP}) translate(${j.head[0]} ${j.head[1]}) scale(${1 + 0.14 * s.zoom}) translate(${-j.head[0]} ${-j.head[1]})`}>
        <rect x={500} y={540} width={200} height={200} rx={10} fill="#0f172a" stroke={INK} strokeWidth={8} /><circle cx={640} cy={610} r={34} fill="#fde68a" /><circle cx={656} cy={598} r={30} fill="#0f172a" />
        <g transform="translate(850 680)">
          <circle r={96} fill="#fff" stroke={INK} strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-78} x2={0} y2={-66} stroke={INK} strokeWidth={5} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-70} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${s.ff * 360 * 4.78})`} />
          <line x1={0} y1={0} x2={0} y2={-44} stroke="#ef4444" strokeWidth={9} strokeLinecap="round" transform={`rotate(${-30 + s.ff * 143})`} />
          <circle r={8} fill={INK} />
        </g>
        <Bed x={70} f={f} wave={f > S(0) && f < S(1) ? 1 : 0} mood={dead ? "sad" : "smile"} blanket={false} w={720} />
        <Person who="me" x={hx} y={hy} s={SCALE} pose={pose} f={f} face={{ eyes: dead ? "spiral" : s.ff > 0.6 ? "tired" : "open", mouth: dead ? "flat" : s.say > 0.5 ? "o" : "smile", look: 0.7 }} />
        <circle cx={j.head[0]} cy={j.head[1]} r={62} fill="#38bdf8" opacity={0.22} />
        <path d={`M ${j.handR[0] + 10} ${j.handR[1] - 40} L ${j.head[0] + 50} ${j.head[1] - 60} L ${j.head[0] + 40} ${j.head[1] + 50} Z`} fill="#7dd3fc" opacity={0.18} />
        <Phone x={j.handR[0] + 6} y={j.handR[1] - 30} f={dead ? 0 : f * (1 + s.ff * 2)} />
        <path d={`M 360 ${GY - 196} Q 400 ${GY - 270} 560 ${GY - 260} Q 760 ${GY - 250} 790 ${GY - 160} L 790 ${GY - 110} L 360 ${GY - 110} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* "This is Tom." */}
        <g transform={`translate(${j.head[0] + 230} ${j.head[1] - 150}) scale(${s.name})`}><rect x={-90} y={-44} width={180} height={88} rx={20} fill="#fde68a" stroke={INK} strokeWidth={6} /><text y={22} textAnchor="middle" fontFamily={HAND} fontSize={68} fill={INK}>TOM</text><path d="M -60 44 L -130 110 L -20 44 Z" fill="#fde68a" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></g>
        {/* "Just five more minutes." */}
        <g transform={`translate(${j.head[0] + 250} ${j.head[1] - 250}) scale(${s.say})`}><rect x={-230} y={-80} width={460} height={160} rx={64} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M -150 76 L -200 136 L -100 76 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><text y={-6} textAnchor="middle" fontFamily={HAND} fontSize={54} fill={INK}>Just five more</text><text y={50} textAnchor="middle" fontFamily={HAND} fontSize={54} fill={INK}>minutes.</text></g>
        {/* what Tom learned instead of sleeping */}
        <Cloud x={j.handR[0] + 250} y={j.handR[1] - 330} k={s.peng} w={380} h={300} tail={[-170, 180]}>
          <ellipse cx={0} cy={40} rx={70} ry={90} fill="#1f2937" stroke={INK} strokeWidth={5} /><ellipse cx={0} cy={56} rx={44} ry={66} fill="#fff" />
          <path d="M -22 -6 q 8 8 16 0 M 6 -6 q 8 8 16 0" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /><path d="M -10 10 L 10 10 L 0 24 Z" fill="#f59e0b" stroke={INK} strokeWidth={3} />
          <path d="M -70 30 q -26 30 -10 70 M 70 30 q 26 30 10 70" stroke="#1f2937" strokeWidth={16} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => <text key={i} x={70 + i * 26} y={-40 - i * 26 - Math.sin(f / 8 + i) * 5} fontFamily={HAND} fontSize={36 + i * 8} fill="#64748b">z</text>)}
        </Cloud>
        <EnergyBar x={j.head[0]} y={j.head[1] - 140} pct={pct} shake={dead ? Math.sin(f * 0.9) * 3 : 0} />
      </g>
      <TimeTag time={time} dark pulse={f >= S(2) - 2 && f < S(2) + 10 ? 1 - (f - S(2) + 2) / 12 : 0} />
    </g>
  );
};

/* ---------- 2. Awake — the brain is not ---------- */
export const Tom2: React.FC<SP> = ({ sc }) => {
  const { S, T } = cue(sc);
  const s = useTimeline({ up: 0, cloud: 0, sign: 0, slap: 0 }, (tl, v) => {
    tl.to(v, { slap: 1, duration: 0.2, ease: "power2.in" }, T(1) - 0.5).to(v, { slap: 0, duration: 0.3 }, T(1) - 0.2)
      .to(v, { up: 1, duration: 1.1, ease: "power2.inOut" }, T(1))
      .to(v, { cloud: 1, duration: 0.45, ease: "back.out(2)" }, T(2) + 0.2)
      .to(v, { sign: 1, duration: 0.7, ease: "bounce.out" }, T(3) + 1.0);
  });
  const { f } = s;
  const ringing = f > 8 && f < S(1) - 12;
  const zombie = P({ aL: [86, 92], aR: [80, 96], lean: -10, tilt: 14 });
  const lying = P({ ...SITBED, drop: 140, lean: 60, aR: [40 + 80 * s.slap, 60 + 50 * s.slap] });
  const sway = s.up >= 1 ? Math.sin(f / 14) * 3 : 0;
  const pose = alive(mix(lying, { ...zombie, lean: zombie.lean + sway }, s.up), f, 0.4);
  const x = 380 + s.up * 60, y = GY - 170 + 170 * s.up;
  const j = body(x, y, pose);
  return (
    <Room wall="#cfe3f5" floor="#9fb8d3">
      <rect x={90} y={520} width={260} height={240} rx={10} fill="#fef9c3" stroke={INK} strokeWidth={8} /><line x1={220} y1={520} x2={220} y2={760} stroke={INK} strokeWidth={6} /><line x1={90} y1={640} x2={350} y2={640} stroke={INK} strokeWidth={6} />
      <rect x={880} y={GY - 200} width={70} height={200} fill="#b08968" stroke={INK} strokeWidth={5} />
      <g transform={`translate(${ringing ? 915 + Math.sin(f * 2.2) * 8 : 915} ${GY - 250}) rotate(${ringing ? Math.sin(f * 1.7) * 14 : 0})`}>
        <circle cx={-26} cy={-50} r={16} fill="#fbbf24" stroke={INK} strokeWidth={4} /><circle cx={26} cy={-50} r={16} fill="#fbbf24" stroke={INK} strokeWidth={4} />
        <circle r={48} fill="#ef4444" stroke={INK} strokeWidth={5} /><circle r={34} fill="#fff" stroke={INK} strokeWidth={3} />
        <line x1={0} y1={0} x2={0} y2={-24} stroke={INK} strokeWidth={5} /><line x1={0} y1={0} x2={18} y2={0} stroke={INK} strokeWidth={5} />
        {ringing && [-1, 1].map((sd) => <path key={sd} d={`M ${sd * 64} -30 l ${sd * 20} -12 M ${sd * 70} 0 l ${sd * 26} 0 M ${sd * 64} 30 l ${sd * 20} 12`} stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      </g>
      <Bed x={60} f={f} mood={s.up > 0.5 ? "sad" : "smile"} blanket={s.up > 0.5} w={620} />
      <Person who="me" x={x} y={y} s={SCALE} pose={pose} f={f} face={{ eyes: s.up < 0.3 ? "closed" : "tired", mouth: s.up > 0.5 ? "o" : "wavy", look: 0.6 }} />
      {s.up < 0.5 && <path d={`M 230 ${GY - 196} Q 300 ${GY - 300} 470 ${GY - 290} Q 660 ${GY - 280} 660 ${GY - 196} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
      {/* Tom's brain: in bed, closed for the day */}
      <Cloud x={770} y={j.head[1] - 230} k={s.cloud} w={480} h={380} tail={[-200, 210]}>
        <g transform="translate(-30 20)">
          <rect x={-150} y={50} width={300} height={40} rx={12} fill="#b08968" stroke={INK} strokeWidth={5} />
          <rect x={-150} y={-4} width={84} height={56} rx={24} fill="#f8fafc" stroke={INK} strokeWidth={5} />
          <g transform="translate(-70 -40)"><Brain f={f} mood="sleep" s={0.95} /></g>
          <path d="M -40 52 Q -20 -30 60 -20 Q 150 -14 150 52 Z" fill="#a5b4fc" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={-10 + t * 40} y={-90 - t * 60} fontFamily={HAND} fontSize={34 + t * 20} fill="#94a3b8" opacity={1 - t}>z</text>; })}
        </g>
        <g transform={`translate(110 ${-150 + s.sign * 130}) rotate(${(1 - s.sign) * -30 + Math.sin(f / 10) * 3})`} opacity={Math.min(1, s.sign * 4)}>
          <line x1={-60} y1={-60} x2={0} y2={-100} stroke={INK} strokeWidth={4} /><line x1={60} y1={-60} x2={0} y2={-100} stroke={INK} strokeWidth={4} />
          <rect x={-100} y={-60} width={200} height={90} rx={12} fill="#ef4444" stroke={INK} strokeWidth={6} /><text y={2} textAnchor="middle" fontFamily={HAND} fontSize={54} fill="#fff">CLOSED</text>
        </g>
      </Cloud>
      {s.up > 0.6 && s.cloud < 0.2 && <text x={j.head[0] + 70} y={j.head[1] - 60} fontFamily={HAND} fontSize={56} fill="#64748b" opacity={0.5 + 0.5 * Math.sin(f / 8)}>uuughh</text>}
      <EnergyBar x={j.head[0] - (s.cloud > 0.2 ? 60 : 0)} y={j.head[1] - 150} pct={15} shake={Math.sin(f * 0.9) * 3} />
      <g transform={`translate(0 ${UP})`}><TimeTag time="06:00" pulse={f < 12 ? 1 - f / 12 : 0} /></g>
    </Room>
  );
};

/* ---------- 3. Memory: the keys ---------- */
const Keys: React.FC<{ x: number; y: number; f: number; still?: boolean; glow?: number }> = ({ x, y, f, still, glow = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {glow > 0 && <circle r={90 * glow} fill="#fde047" opacity={0.45} />}
    {glow > 0 && Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} y1={-100 * glow} x2={0} y2={-130 * glow} stroke="#f59e0b" strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 45 + f * 2})`} />)}
    <g transform={`rotate(${still ? 0 : Math.sin(f / 3) * 14})`}>
      <circle cy={14} r={14} fill="none" stroke="#64748b" strokeWidth={6} />
      {[-18, 14].map((r, i) => <g key={i} transform={`translate(0 26) rotate(${r})`}><rect x={-5} y={0} width={10} height={52} rx={3} fill={i ? "#fbbf24" : "#cbd5e1"} stroke={INK} strokeWidth={3} /><rect x={5} y={30} width={10} height={8} fill={i ? "#fbbf24" : "#cbd5e1"} stroke={INK} strokeWidth={2} /></g>)}
    </g>
  </g>
);
export const Tom3: React.FC<SP> = ({ sc }) => {
  const { S, T } = cue(sc);
  const s = useTimeline({ x: 420, cloud: 0, drawer: 0, bend: 0, face: 1, junk: 0, found: 0, look: 0 }, (tl, v) => {
    tl.to(v, { cloud: 1, duration: 0.45, ease: "back.out(2)" }, T(0) + 0.5)
      .to(v, { x: 300, duration: 0.9, ease: "power1.inOut" }, T(1) - 0.6).to(v, { face: -1, duration: 0.01 }, T(1) - 0.6)
      .to(v, { drawer: 1, duration: 0.3, ease: "power2.out" }, T(1) + 0.3).to(v, { junk: 1, duration: 1.2, ease: "none" }, T(1) + 0.4)
      .to(v, { drawer: 0, duration: 0.25 }, T(1) + 1.5)
      .to(v, { face: 1, duration: 0.01 }, T(1) + 1.6).to(v, { x: 640, duration: 1.1, ease: "power1.inOut" }, T(1) + 1.6)
      .to(v, { bend: 1, duration: 0.35, ease: "power2.out" }, T(1) + 2.7).to(v, { bend: 0, duration: 0.35 }, T(1) + 3.6)
      .to(v, { x: 480, duration: 0.7, ease: "power1.inOut" }, T(1) + 3.9).to(v, { face: -1, duration: 0.01 }, T(1) + 3.9)
      .to(v, { face: 1, duration: 0.01 }, T(2) - 0.4)
      .to(v, { found: 1, duration: 0.35, ease: "back.out(2.5)" }, T(2) + 0.1).to(v, { look: 1, duration: 0.3 }, T(2) + 0.9);
  });
  const { f } = s;
  const flip = s.face < 0;
  const found = s.found > 0.3;
  const moving = !found && f > S(1) - 18 && s.bend < 0.05 && s.drawer < 0.05 && f < S(2) - 20;
  const w = walk(f, 20, 0.8);
  const base = moving ? { lL: w.lL, lR: w.lR, dy: w.dy } : {};
  // the left hand always holds the keys; the right hand does the searching
  const pose = alive(P({ ...base, aL: found ? [-60, -150] : [-18, -8], aR: found ? [30, 60] : s.bend > 0 ? [70, 60] : s.drawer > 0 ? [70, 96] : [150, 200], lean: -30 * s.bend, tilt: found ? -10 * s.look : -8 * s.bend, drop: 40 * s.bend }), f, found ? 0.2 : 0.6);
  const j = body(s.x, GY, pose, flip);
  const kx = j.handL[0], ky = j.handL[1] + 6;
  return (
    <Room wall="#fef3c7" floor="#e7d2b4">
      {/* kitchen: counter with a drawer, a table, the fridge */}
      <rect x={0} y={GY - 330} width={300} height={330} fill="#f8fafc" stroke={INK} strokeWidth={7} /><rect x={-10} y={GY - 350} width={330} height={30} rx={8} fill="#94a3b8" stroke={INK} strokeWidth={6} />
      <g transform={`translate(${s.drawer * 90} 0)`}><rect x={40} y={GY - 290} width={220} height={90} rx={8} fill="#e2e8f0" stroke={INK} strokeWidth={6} /><rect x={120} y={GY - 256} width={60} height={14} rx={7} fill={INK} /></g>
      <rect x={40} y={GY - 180} width={220} height={150} rx={8} fill="#e2e8f0" stroke={INK} strokeWidth={6} />
      <rect x={840} y={GY - 700} width={260} height={700} rx={16} fill="#e0f2fe" stroke={INK} strokeWidth={8} /><line x1={840} y1={GY - 440} x2={1100} y2={GY - 440} stroke={INK} strokeWidth={6} /><rect x={870} y={GY - 560} width={16} height={90} rx={8} fill={INK} /><rect x={870} y={GY - 400} width={16} height={120} rx={8} fill={INK} />
      <rect x={520} y={GY - 250} width={280} height={24} rx={8} fill="#c79a6b" stroke={INK} strokeWidth={6} /><line x1={550} y1={GY - 226} x2={550} y2={GY} stroke={INK} strokeWidth={10} /><line x1={770} y1={GY - 226} x2={770} y2={GY} stroke={INK} strokeWidth={10} />
      <g transform="translate(600 620)"><circle r={70} fill="#fff" stroke={INK} strokeWidth={7} /><line x1={0} y1={0} x2={0} y2={-50} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${s.junk * 60 + (f > S(1) ? (f - S(1)) * 0.5 : 0)})`} /><line x1={0} y1={0} x2={32} y2={0} stroke={INK} strokeWidth={7} strokeLinecap="round" /></g>
      {/* things fly out of the drawer */}
      {s.junk > 0 && s.junk < 1 && [0, 1, 2, 3].map((i) => { const t = Math.min(1, Math.max(0, s.junk * 1.6 - i * 0.18)); return t <= 0 || t >= 1 ? null : <g key={i} transform={`translate(${200 + t * (120 + i * 60)} ${GY - 300 - Math.sin(t * Math.PI) * (260 + i * 40)}) rotate(${t * 500})`}>{i % 2 ? <rect x={-8} y={-40} width={16} height={80} rx={8} fill="#cbd5e1" stroke={INK} strokeWidth={4} /> : <path d="M -24 -30 L 10 -30 L 10 10 L 34 10 L 34 30 L -24 30 Z" fill={["#f87171", "", "#60a5fa"][i]} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}</g>; })}
      <Person who="me" x={s.x} y={GY} s={SCALE} pose={pose} f={f} flip={flip} face={{ eyes: found && s.look > 0.5 ? "wide" : found ? "open" : "tired", mouth: found ? "o" : "wavy", brows: found ? "up" : "worried", look: found ? -0.9 * s.look : 0.7, sweat: !found && f > S(1) }} />
      <Keys x={kx} y={ky} f={f} still={found} glow={s.found} />
      {found && <g transform={`translate(${kx + 190} ${ky + 150}) scale(${s.found})`}><text textAnchor="middle" fontFamily={HAND} fontSize={72} fill="#ef4444" stroke="#fff" strokeWidth={9} paintOrder="stroke fill">keys!</text><path d="M -70 -50 Q -110 -70 -130 -110 m 4 34 l -4 -34 l 34 8" stroke="#ef4444" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
      {!found && f > S(1) && [0, 1].map((i) => <text key={i} x={j.head[0] + (flip ? -110 : 80) + i * 40} y={j.head[1] - 70 - i * 46} fontFamily={HAND} fontSize={70} fill={INK} opacity={0.5 + 0.5 * Math.sin(f / 5 + i * 2)}>?</text>)}
      {/* the brain is still loading */}
      <Cloud x={found ? 760 : Math.min(820, Math.max(280, s.x + (flip ? 230 : -40)))} y={560} k={s.cloud} w={360} h={280} tail={[found ? -180 : flip ? -120 : 60, 170]}>
        <g transform="translate(-60 10)"><Brain f={f} mood={found ? "shock" : "load"} s={0.9} /></g>
        {found ? <text x={100} y={30} textAnchor="middle" fontFamily={HAND} fontSize={110} fill="#ef4444">!</text> : <g transform="translate(96 0)"><Spinner f={f} s={1} /></g>}
        {!found && <text x={0} y={116} textAnchor="middle" fontFamily={HAND} fontSize={38} fill="#64748b">loading…</text>}
      </Cloud>
      <EnergyBar x={j.head[0]} y={j.head[1] - 170} pct={12} />
      <g transform={`translate(0 ${UP})`}><TimeTag time={f < S(1) ? "06:40" : `06:${String(Math.min(50, 40 + Math.round(s.junk * 4 + s.bend * 2 + (f > S(1) + 80 ? 6 : 0)))).padStart(2, "0")}`} /></g>
    </Room>
  );
};
