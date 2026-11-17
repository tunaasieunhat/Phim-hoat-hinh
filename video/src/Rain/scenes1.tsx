// Scenes 1–2 of "Rainy day: plan vs. reality" — GSAP timelines keyed to the dialogue (src/Rain/data.ts).
import React from "react";
import { alive, mix, P, type Pose } from "../Kids/rig";
import { Person } from "../Sleep/people";
import { body, S as SCALE } from "../Sleep/stage";
import { useTimeline } from "../Sleep/timeline";
import { Badge, FLOOR, GY, HAND, INK, lines, PlanLabel, RainCloud, Tear, UP, VH, VW, Window, type SP } from "./stage";

const Room: React.FC<{ wall: string; floor: string; children?: React.ReactNode }> = ({ wall, floor, children }) => (
  <g><rect width={VW} height={VH} fill={wall} /><rect x={0} y={FLOOR} width={VW} height={VH - FLOOR} fill={floor} /><g transform={`translate(0 ${-UP})`}>{children}</g></g>
);

/* ---------- 1. It's raining. Lily has a plan. ---------- */
export const Rain1: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const s = useTimeline({ curtain: 0, pull: 0, wave: 0, list: 0, glow: 0, fist: 0, turn: 0 }, (tl, v) => {
    tl.to(v, { pull: 1, duration: 0.3 }, 0.4).to(v, { curtain: 1, duration: 0.8, ease: "power2.out" }, 0.6).to(v, { pull: 0, duration: 0.4 }, 1.5)
      .to(v, { wave: 1, duration: 0.3 }, T(0) + 0.3).to(v, { wave: 0, duration: 0.3 }, T(2))
      .to(v, { turn: 1, duration: 0.3 }, T(1) - 0.2)
      .to(v, { list: 1, duration: 0.45, ease: "back.out(2.2)" }, T(1) + 0.2).to(v, { glow: 1, duration: 0.5 }, T(2) + 0.2)
      .to(v, { list: 0, duration: 0.3 }, T(3) - 0.1)
      .to(v, { fist: 1, duration: 0.35, ease: "back.out(3)" }, T(3) + 0.3);
  });
  const { f } = s;
  const x = 300;
  const pose = alive(mix(P({ aL: [-14, -6], aR: [100 + 30 * s.pull, 120 + 30 * s.pull], lean: -4 }), P({ aL: [-20, -10], aR: [160, 200 + Math.sin(f / 4) * 6], tilt: -4, dy: -10 * Math.abs(Math.sin(f / 6)) }), s.fist), f, 0.6);
  const j = body(x, GY, pose);
  return (
    <Room wall="#cbd5e1" floor="#94a3b8">
      <Window x={470} y={470} w={480} h={460} f={f} rain={1} curtain={s.curtain}>
        <rect x={470} y={800} width={480} height={140} fill="#475569" />
        <RainCloud x={720} y={600} f={f} s={0.9} wave={s.wave} mood={s.fist > 0.5 ? "sly" : "grin"} />
      </Window>
      <rect x={80} y={GY - 200} width={150} height={200} fill="#c4a484" stroke={INK} strokeWidth={6} /><rect x={110} y={GY - 250} width={50} height={50} rx={8} fill="#fde047" stroke={INK} strokeWidth={4} />
      <Person who="lily" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: f < 12 ? "closed" : s.fist > 0.5 ? "big" : "open", mouth: s.fist > 0.5 ? "grin" : f < 40 ? "o" : "smile", brows: s.fist > 0.5 ? "angry" : "none", look: s.turn > 0.5 ? 0 : 0.8 }} />
      {/* the plan */}
      {s.list > 0.01 && <g transform={`translate(250 560) rotate(-4) scale(${s.list})`}>
        <circle r={260} fill="#fde047" opacity={0.25 * s.glow} />
        <rect x={-190} y={-170} width={380} height={340} rx={16} fill="#fffdf5" stroke={INK} strokeWidth={6} />
        <text y={-110} textAnchor="middle" fontFamily={HAND} fontSize={56} fill="#db2777">TODAY'S PLAN</text>
        {["Read a book", "Work out", "Clean my room", "Cook healthy"].map((t, i) => <g key={t}><rect x={-160} y={-80 + i * 62} width={34} height={34} rx={6} fill="#fff" stroke={INK} strokeWidth={4} /><text x={-110} y={-52 + i * 62} fontFamily={HAND} fontSize={44} fill={INK}>{t}</text></g>)}
      </g>}
      {s.fist > 0.3 && [0, 1, 2, 3].map((i) => <path key={i} transform={`translate(${j.handR[0] + Math.cos(i * 1.6) * 70} ${j.handR[1] - 40 + Math.sin(i * 1.6) * 60}) scale(${0.6 + 0.4 * Math.sin(f / 4 + i)})`} d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill="#fde047" stroke={INK} strokeWidth={3} />)}
    </Room>
  );
};

/* ---------- 2. Plan: read a book · Reality: page one, fifteen photos, asleep ---------- */
const SITF: Pose = P({ drop: 146, lL: [96, 92], lR: [90, 96], aL: [62, 140], aR: [72, 150], lean: 6, tilt: -8 });
const Book: React.FC<{ x: number; y: number; rot?: number; s?: number; flip?: number; color?: string }> = ({ x, y, rot: r = 0, s = 1, flip = 0, color = "#ef4444" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -80 0 L -6 -10 L 0 0 Z M 0 0 L 6 -10 L 80 0 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -84 4 L 0 6 L 84 4 L 84 12 L 0 14 L -84 12 Z" fill={color} stroke={INK} strokeWidth={4} />
    {flip > 0 && flip < 1 && <path d={`M 0 0 L ${80 * Math.cos(flip * Math.PI)} ${-10 - 50 * Math.sin(flip * Math.PI)} L ${6 * Math.cos(flip * Math.PI)} -10 Z`} fill="#fffbeb" stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
  </g>
);
const Mug: React.FC<{ x: number; y: number; f: number; steam?: boolean; color?: string }> = ({ x, y, f, steam = true, color = "#fff" }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 26 -44 q 26 2 22 22 q -4 18 -22 16" fill="none" stroke={INK} strokeWidth={6} />
    <path d="M -28 -56 L 28 -56 L 24 0 L -24 0 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {steam && [0, 1].map((i) => <path key={i} d={`M ${-8 + i * 16} -66 q -8 -14 0 -26 q 8 -12 0 -24`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />)}
  </g>
);
const Den: React.FC<{ f: number; plan: boolean; children: React.ReactNode }> = ({ f, plan, children }) => (
  <Room wall={plan ? "#fde4cf" : "#9aa7b8"} floor={plan ? "#f5c6a5" : "#7c8a9c"}>
    <Window x={560} y={560} w={420} h={400} f={f} rain={1} curtain={1}><rect x={560} y={850} width={420} height={120} fill={plan ? "#94a3b8" : "#475569"} /></Window>
    {plan && <g>{Array.from({ length: 11 }).map((_, i) => <circle key={i} cx={520 + i * 46} cy={540 + Math.sin(i * 0.9) * 18 + 12} r={9} fill={["#fde047", "#f9a8d4", "#a7f3d0"][i % 3]} opacity={0.6 + 0.4 * Math.sin(f / 6 + i)} />)}<path d="M 520 550 Q 760 600 1000 550" stroke={INK} strokeWidth={3} fill="none" /></g>}
    {plan && <g transform={`translate(160 ${GY - 260})`}><path d="M -30 0 L 30 0 L 40 -40 L -40 -40 Z" fill="#a16207" stroke={INK} strokeWidth={4} /><path d="M 0 -40 C -50 -110 -30 -170 0 -200 C 30 -170 50 -110 0 -40" fill="#4ade80" stroke={INK} strokeWidth={4} /></g>}
    {/* cushion and low table */}
    <ellipse cx={380} cy={GY - 14} rx={150} ry={34} fill={plan ? "#f472b6" : "#64748b"} stroke={INK} strokeWidth={6} />
    <rect x={590} y={GY - 120} width={200} height={20} rx={8} fill={plan ? "#c79a6b" : "#6b7280"} stroke={INK} strokeWidth={5} /><line x1={610} y1={GY - 100} x2={610} y2={GY} stroke={INK} strokeWidth={8} /><line x1={770} y1={GY - 100} x2={770} y2={GY} stroke={INK} strokeWidth={8} />
    {children}
  </Room>
);
export const Rain2: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const s = useTimeline({ label: 0, tear: 0, badgeP: 0, badgeR: 0, flip: 0, phone: 0, flashN: 0, sleep: 0 }, (tl, v) => {
    tl.to(v, { badgeP: 1, duration: 0.4, ease: "back.out(2.5)" }, 0.3).to(v, { label: 1, duration: 0.4 }, 0.6)
      .to(v, { tear: 1, duration: 0.75, ease: "power1.in" }, 5.1)
      .to(v, { badgeR: 1, duration: 0.4, ease: "back.out(2.5)" }, 5.6)
      .to(v, { flip: 1, duration: 0.6, ease: "power1.inOut" }, T(0) + 0.1)
      .to(v, { phone: 1, duration: 0.4, ease: "power2.out" }, T(0) + 1.0)
      .to(v, { flashN: 15, duration: 2.9, ease: "none" }, T(0) + 1.5)
      .to(v, { phone: 0, duration: 0.4 }, T(2) - 0.6)
      .to(v, { sleep: 1, duration: 0.9, ease: "power2.inOut" }, T(2) + 0.2);
  });
  const { f } = s;
  const x = 380;
  // PLAN: the picture-perfect reading corner
  const planPose = alive(SITF, f, 0.5);
  const pj = body(x, GY, planPose);
  const plan = (
    <Den f={f} plan>
      <circle cx={pj.head[0] + 40} cy={pj.head[1] + 60} r={260} fill="#fde68a" opacity={0.3} />
      <Person who="lily" x={x} y={GY} s={SCALE} pose={planPose} f={f} face={{ eyes: "happy", mouth: "smile", look: 0.7, blush: true }} />
      <Book x={(pj.handL[0] + pj.handR[0]) / 2 + 10} y={(pj.handL[1] + pj.handR[1]) / 2 - 6} rot={-14} s={1.1} color="#f59e0b" />
      <Mug x={690} y={GY - 120} f={f} color="#fbcfe8" />
      {[0, 1, 2].map((i) => <path key={i} transform={`translate(${200 + i * 120} ${560 + (i % 2) * 70}) scale(${0.6 + 0.4 * Math.sin(f / 7 + i)})`} d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill="#fff" />)}
    </Den>
  );
  // REALITY: one page, fifteen selfies, asleep under the book
  const phoneUp = s.phone > 0.05;
  // asleep: the upper body falls back (lean is positive backwards), arms flop, the legs stay put
  const awake = phoneUp ? P({ ...SITF, aR: [140, 210], aL: [62, 120], tilt: -2 }) : SITF;
  const realPose = alive(mix(awake, P({ ...SITF, drop: 150, lean: 74, tilt: 10, aL: [-40, -10], aR: [40, 70] }), s.sleep), f, s.sleep > 0.5 ? 0.15 : 0.5);
  const rj = body(x, GY, realPose);
  const head = rj.head;
  const n = Math.floor(s.flashN);
  const flash = phoneUp && s.flashN > 0 && s.flashN < 15.2 && (s.flashN % 1) < 0.35;
  const yawning = s.flip > 0.2 && s.phone < 0.05 && s.sleep < 0.05;
  return (
    <g>
      <Den f={f} plan={false}>
        {/* tea gone cold, a crumpled tissue */}
        <Mug x={690} y={GY - 120} f={f} steam={false} color="#cbd5e1" />
        <g>
          <Person who="lily" x={x} y={GY} s={SCALE} pose={realPose} f={f} face={{ eyes: s.sleep > 0.6 ? "closed" : phoneUp ? "happy" : "tired", mouth: s.sleep > 0.6 ? "o" : phoneUp ? "grin" : yawning ? "o" : "flat", look: phoneUp ? -0.2 : 0.7 }} />
        </g>
        {s.sleep < 0.4 && !phoneUp && <Book x={(rj.handL[0] + rj.handR[0]) / 2 + 10} y={(rj.handL[1] + rj.handR[1]) / 2 - 6} rot={-14} s={1.1} flip={s.flip} color="#f59e0b" />}
        {phoneUp && <g><Book x={rj.handL[0] + 20} y={rj.handL[1]} rot={-30} s={0.9} color="#f59e0b" /><g transform={`translate(${rj.handR[0]} ${rj.handR[1] - 20}) rotate(-10)`}><rect x={-30} y={-52} width={60} height={104} rx={10} fill="#111827" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-36} r={7} fill="#94a3b8" /></g></g>}
        {s.sleep >= 0.4 && <g transform={`translate(${head[0] + 6} ${head[1] - 4}) rotate(${-8 + Math.sin(f / 20) * 2})`}><path d="M -78 22 L 0 -34 L 78 22 L 66 28 L 0 -20 L -66 28 Z" fill="#f59e0b" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M -60 18 L 0 -24 L 60 18" fill="none" stroke="#fff" strokeWidth={4} /></g>}
        {s.sleep > 0.8 && [0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={head[0] + 40 + t * 50} y={head[1] - 70 - t * 110} fontFamily={HAND} fontSize={50 + t * 30} fill="#e2e8f0" opacity={1 - t}>z</text>; })}
        {/* photo counter */}
        {s.flashN > 0.5 && s.sleep < 0.5 && <g transform={`translate(${rj.handR[0] + 150} ${rj.handR[1] - 110})`}><rect x={-100} y={-50} width={200} height={100} rx={20} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={-70} y={-24} width={50} height={40} rx={8} fill={INK} /><circle cx={-45} cy={-4} r={11} fill="#fff" /><text x={40} y={18} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={50} fill="#db2777">{Math.max(1, Math.min(15, n))}</text></g>}
        {/* "#rainyday #chill" posts */}
        {n >= 15 && s.sleep < 0.5 && <text x={rj.handR[0] + 150} y={rj.handR[1] - 190} textAnchor="middle" fontFamily={HAND} fontSize={44} fill="#e2e8f0">#rainyday #chill</text>}
      </Den>
      {flash && <rect width={VW} height={VH} fill="#fff" opacity={0.75} />}
      <Badge kind="REALITY" k={s.badgeR} f={f} />
      <Tear p={s.tear}>
        {plan}
        <Badge kind="PLAN" k={s.badgeP} f={f} />
        <PlanLabel k={s.label} en="Plan: read a book" vi="Kế hoạch: đọc sách" />
      </Tear>
    </g>
  );
};
