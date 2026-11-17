// Scenes 4–7 of "What Happens If You Don't Get Enough Sleep?" (narrated version) — GSAP timelines keyed to the narration.
import React from "react";
import { alive, mix, P, walk, type Pose } from "../Kids/rig";
import { INK, Person } from "../Sleep/people";
import { Bed, body, EnergyBar, GY, HAND, Phone, S as SCALE, SITBED, TimeTag, VH, VW } from "../Sleep/stage";
import { useTimeline } from "../Sleep/timeline";
import { Brain, Cloud, cue, FLOOR, Room, UP, type SP } from "./scenes1";

const SIT: Pose = P({ drop: 46, lL: [86, 4], lR: [80, 8], aL: [48, 90], aR: [56, 94], lean: -4 });
const Stool: React.FC<{ x: number }> = ({ x }) => (
  <g><rect x={x - 70} y={GY - 186} width={140} height={22} rx={8} fill="#8b6b4a" stroke={INK} strokeWidth={6} /><line x1={x - 46} y1={GY - 164} x2={x - 58} y2={GY} stroke={INK} strokeWidth={10} /><line x1={x + 46} y1={GY - 164} x2={x + 58} y2={GY} stroke={INK} strokeWidth={10} /></g>
);
const Say: React.FC<{ x: number; y: number; k: number; lines: string[]; tail?: "left" | "right"; color?: string; size?: number }> = ({ x, y, k, lines, tail = "left", color = INK, size = 52 }) => {
  if (k <= 0.01) return null;
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.46 + 90, h = lines.length * size * 1.15 + 50, tx = tail === "left" ? -w * 0.25 : w * 0.25;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(60, h * 0.42)} fill="#fff" stroke={INK} strokeWidth={6} />
      <path d={`M ${tx - 20} ${h / 2 - 3} L ${tx + (tail === "left" ? -34 : 34)} ${h / 2 + 46} L ${tx + 20} ${h / 2 - 3}`} fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><rect x={tx - 17} y={h / 2 - 9} width={34} height={9} fill="#fff" />
      {lines.map((l, i) => <text key={i} x={0} y={-h / 2 + 30 + size * 0.9 + i * size * 1.15} textAnchor="middle" fontFamily={HAND} fontSize={size} fill={color}>{l}</text>)}
    </g>
  );
};
const Flame: React.FC<{ x: number; y: number; s: number; f: number; seed?: number }> = ({ x, y, s, f, seed = 0 }) => s <= 0.01 ? null : (
  <g transform={`translate(${x} ${y}) scale(${s * (1 + 0.08 * Math.sin(f / 2.5 + seed))} ${s * (1 + 0.14 * Math.sin(f / 2 + seed * 2))})`}>
    <path d="M 0 0 C -70 0 -80 -80 -46 -120 C -40 -90 -20 -84 -16 -110 C -20 -150 0 -180 22 -200 C 18 -156 62 -140 62 -86 C 62 -36 40 0 0 0 Z" fill="#f97316" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 0 -8 C -30 -8 -36 -44 -16 -66 C -10 -50 6 -52 6 -72 C 26 -56 34 -36 28 -22 C 22 -10 14 -8 0 -8 Z" fill="#fde047" />
  </g>
);
const Chicken: React.FC<{ s?: number; f: number }> = ({ s = 1, f }) => (
  <g transform={`scale(${s}) rotate(${Math.sin(f / 6) * 4})`}>
    <ellipse cx={0} cy={10} rx={70} ry={56} fill="#fff" stroke={INK} strokeWidth={6} /><circle cx={56} cy={-44} r={34} fill="#fff" stroke={INK} strokeWidth={6} />
    <path d="M 40 -76 q 6 -22 18 -4 q 8 -20 18 2 q 12 -12 12 10" fill="#ef4444" stroke={INK} strokeWidth={4} /><path d="M 88 -44 L 116 -36 L 88 -28 Z" fill="#f59e0b" stroke={INK} strokeWidth={4} /><circle cx={66} cy={-50} r={5} fill={INK} />
    <path d="M -66 0 q -40 -30 -30 -60 q 20 20 34 24" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -16 64 l 0 30 m -12 0 l 24 0 M 22 64 l 0 30 m -12 0 l 24 0" stroke="#f59e0b" strokeWidth={7} strokeLinecap="round" />
  </g>
);
const Marks: React.FC<{ x: number; y: number; f: number; k: number; t?: string; color?: string }> = ({ x, y, f, k, t = "?", color = INK }) => k <= 0.01 ? null : (
  <text x={x} y={y - Math.sin(f / 7) * 6} textAnchor="middle" fontFamily={HAND} fontSize={96 * k} fill={color} stroke="#fff" strokeWidth={8} paintOrder="stroke fill">{t}</text>
);

/* ---------- 4. Mood ---------- */
export const Tom4: React.FC<SP> = ({ sc }) => {
  const { T } = cue(sc);
  const s = useTimeline({ mx: 1250, hi: 0, turn: 0, fire: 0, back: 0 }, (tl, v) => {
    tl.to(v, { mx: 760, duration: 2.2, ease: "power1.out" }, T(0) + 0.6)
      .to(v, { hi: 1, duration: 0.35, ease: "back.out(2.5)" }, T(1) + 0.5).to(v, { hi: 0, duration: 0.25 }, T(2) - 0.6)
      .to(v, { turn: 1, duration: 0.5, ease: "power2.inOut" }, T(1) + 1.9)
      .to(v, { fire: 0.55, duration: 0.5, ease: "power2.out" }, T(1) + 2.2).to(v, { fire: 1, duration: 0.4, ease: "back.out(3)" }, T(2))
      .to(v, { back: 1, duration: 2.4, ease: "power1.in" }, T(2) + 0.5);
  });
  const { f } = s;
  const turned = s.turn > 0.5;
  const tx = 330;
  const tomPose = alive(turned ? P({ aL: [-30, -70], aR: [30, 70], lean: -6 * s.fire }) : P({ aL: [-14, -6], aR: [40, 100], tilt: 10 }), f, 0.5);
  const j = body(tx, GY, tomPose, !turned);
  const mx = s.mx + s.back * 330;
  const walking = s.mx > 765 || s.back > 0.02;
  const w = walk(f, s.back > 0 ? 34 : 22, s.back > 0 ? 0.4 : 0.8);
  const matePose = alive(P({ ...(walking ? { lL: w.lL, lR: w.lR, dy: w.dy } : {}), aL: s.back > 0 ? [-40, -110] : [-14, -6], aR: s.back > 0 ? [40, 110] : s.hi > 0.3 ? [150, 180 + Math.sin(f / 3) * 16] : [14, 6] }), f, 0.6, 9);
  const mj = body(mx, GY, matePose, true, SCALE * 1);
  return (
    <Room wall="#e0e7ff" floor="#a5b4fc">
      <rect x={380} y={470} width={220} height={170} rx={10} fill="#fff" stroke={INK} strokeWidth={7} />{[0, 1, 2].map((i) => <rect key={i} x={410 + i * 60} y={620 - (40 + i * 34)} width={40} height={40 + i * 34} fill={["#93c5fd", "#86efac", "#fca5a5"][i]} stroke={INK} strokeWidth={4} />)}
      <rect x={640} y={500} width={280} height={300} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={8} /><line x1={780} y1={500} x2={780} y2={800} stroke={INK} strokeWidth={6} /><circle cx={860} cy={570} r={34} fill="#fde047" />
      <g transform={`translate(520 ${GY})`}><rect x={-40} y={-120} width={80} height={120} rx={10} fill="#a16207" stroke={INK} strokeWidth={6} /><path d="M 0 -120 q -60 -90 -20 -180 q 30 70 20 180 q 60 -70 50 -150 q -10 90 -50 150" fill="#22c55e" stroke={INK} strokeWidth={5} strokeLinejoin="round" /></g>
      {/* small flames behind Tom */}
      {[[-90, 0.8, 0], [0, 1.25, 2], [90, 0.9, 4]].map(([dx, k, sd], i) => <Flame key={i} x={tx + dx} y={GY - 250 + Math.abs(dx) * 0.9} s={s.fire * k * 1.5} f={f} seed={sd} />)}
      <Person who="me" x={tx} y={GY} s={SCALE} pose={tomPose} f={f} flip={!turned} face={{ eyes: turned ? "tired" : "tired", mouth: turned ? "frown" : "flat", brows: turned ? "angry" : "none", look: 0.8 }} />
      {turned && [-1, 1].map((sx) => <circle key={sx} cx={j.head[0] + sx * 21 + 9} cy={j.head[1] - 2} r={15} fill="#ef4444" opacity={0.45 + 0.3 * s.fire} />)}
      {/* coffee mug in hand until the turn */}
      {!turned && <g transform={`translate(${j.handR[0] - 4} ${j.handR[1] - 6})`}><rect x={-20} y={-44} width={40} height={48} rx={6} fill="#fff" stroke={INK} strokeWidth={5} /><path d="M -20 -30 q -22 4 -18 20 q 4 12 18 8" fill="none" stroke={INK} strokeWidth={5} /></g>}
      <Person who="mate" x={mx} y={GY} s={SCALE} pose={matePose} f={f} flip face={{ eyes: s.back > 0 ? "wide" : "happy", mouth: s.back > 0 ? "wavy" : "grin", look: 0.8, sweat: s.back > 0, brows: s.back > 0 ? "worried" : "none" }} />
      <Say x={mx - 150} y={mj.head[1] - 190} k={s.hi} lines={["Good morning!"]} tail="right" />
      {s.fire > 0.9 && <Marks x={tx + 150} y={j.head[1] - 150} f={f} k={1} t="!!" color="#ef4444" />}
      <EnergyBar x={j.head[0]} y={j.head[1] - 170 - s.fire * 150} pct={10} shake={s.fire * Math.sin(f * 1.3) * 5} />
      <g transform={`translate(0 ${UP})`}><TimeTag time="08:30" /></g>
    </Room>
  );
};

/* ---------- 5. Hunger ---------- */
const Food: React.FC<{ kind: number; s?: number }> = ({ kind, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {kind === 0 && <g><path d="M -60 0 L 60 0 L 50 -70 L -50 -70 Z" fill="#fbbf24" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d="M -50 -70 q 50 -40 100 0" fill="#fef3c7" stroke={INK} strokeWidth={5} /><circle cx={0} cy={-96} r={12} fill="#ef4444" stroke={INK} strokeWidth={4} /></g>}
    {kind === 1 && <g>{[-30, -15, 0, 15, 30].map((x, i) => <rect key={i} x={x - 6} y={-110 + (i % 2) * 14} width={12} height={70} rx={4} fill="#fde047" stroke={INK} strokeWidth={3} transform={`rotate(${(i - 2) * 7} ${x} -40)`} />)}<path d="M -46 0 L 46 0 L 54 -60 L -54 -60 Z" fill="#ef4444" stroke={INK} strokeWidth={5} strokeLinejoin="round" /></g>}
    {kind === 2 && <g><path d="M -30 -50 L 0 30 L 30 -50 Z" fill="#d6a76b" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={-16} cy={-66} r={26} fill="#f9a8d4" stroke={INK} strokeWidth={5} /><circle cx={18} cy={-66} r={26} fill="#fef3c7" stroke={INK} strokeWidth={5} /><circle cx={0} cy={-96} r={24} fill="#a5f3fc" stroke={INK} strokeWidth={5} /></g>}
    {kind === 3 && <g>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(0 ${-i * 34})`}><rect x={-90} y={-30} width={180} height={30} rx={12} fill={["#d6a76b", "#ef4444", "#84cc16", "#fde047", "#d6a76b"][i]} stroke={INK} strokeWidth={5} /></g>)}<line x1={0} y1={-200} x2={0} y2={-150} stroke={INK} strokeWidth={5} /><circle cx={0} cy={-206} r={10} fill="#84cc16" stroke={INK} strokeWidth={4} /></g>}
  </g>
);
export const Tom5: React.FC<SP> = ({ sc }) => {
  const { T } = cue(sc);
  const t1 = T(1);
  const s = useTimeline({ cloud: 0, a: 0, b: 0, c: 0 }, (tl, v) => {
    tl.to(v, { cloud: 1, duration: 0.45, ease: "back.out(2)" }, T(0) + 0.5)
      .to(v, { a: 1, duration: 0.4, ease: "back.out(2.5)" }, t1 + 2.3).to(v, { b: 1, duration: 0.4, ease: "back.out(2.5)" }, t1 + 3.2).to(v, { c: 1, duration: 0.5, ease: "back.out(2)" }, t1 + 4.7);
  });
  const { f } = s;
  const x = 360;
  const pose = alive(P({ aL: [60, 150], aR: [70, 160], lean: 4 }), f, 0.6);
  const j = body(x, GY, pose);
  const top = GY - 260;
  return (
    <Room wall="#fef3c7" floor="#e7d2b4">
      {/* the open fridge */}
      <rect x={760} y={GY - 720} width={300} height={720} rx={16} fill="#f8fafc" stroke={INK} strokeWidth={8} />
      <rect x={780} y={GY - 700} width={260} height={680} rx={8} fill="#fef9c3" />{[0, 1, 2].map((i) => <line key={i} x1={780} y1={GY - 520 + i * 170} x2={1040} y2={GY - 520 + i * 170} stroke="#94a3b8" strokeWidth={6} />)}
      {[[820, 560, "#f87171"], [900, 560, "#60a5fa"], [980, 560, "#4ade80"], [840, 390, "#fbbf24"], [940, 390, "#c084fc"]].map(([bx, dy, c], i) => <rect key={i} x={bx as number} y={GY - (dy as number)} width={50} height={40} rx={8} fill={c as string} stroke={INK} strokeWidth={4} />)}
      <path d={`M 760 ${GY - 720} L 620 ${GY - 760} L 620 ${GY + 30} L 760 ${GY} Z`} fill="#e2e8f0" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={880} cy={GY - 360} r={420} fill="#fef08a" opacity={0.2} />
      <Person who="me" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: "tired", mouth: "chew", look: 0.6 }} />
      {/* an armful of junk food */}
      <g transform={`translate(${j.handR[0] - 20} ${j.handR[1] + 30}) rotate(${Math.sin(f / 9) * 3})`}><g transform="translate(-50 0)"><Food kind={0} s={0.9} /></g><g transform="translate(40 -6)"><Food kind={1} s={0.9} /></g><g transform="translate(0 -70)"><Food kind={2} s={0.9} /></g></g>
      {[0, 1, 2].map((i) => { const tt = ((f + i * 13) % 40) / 40; return <circle key={i} cx={j.head[0] + 60 + tt * 50} cy={j.head[1] + 30 + tt * 70} r={6} fill="#fbbf24" opacity={1 - tt} />; })}
      {/* the brain wants sugar */}
      <Cloud x={470} y={j.head[1] - 330} k={s.cloud} w={520} h={300} tail={[-150, 190]}>
        <g transform="translate(-140 10)"><Brain f={f} mood="sugar" s={0.9} /></g>
        <g transform={`translate(100 0) rotate(${Math.sin(f / 5) * 5})`}><rect x={-140} y={-74} width={280} height={148} rx={14} fill="#f472b6" stroke={INK} strokeWidth={6} /><text y={-8} textAnchor="middle" fontFamily={HAND} fontSize={58} fill="#fff">MORE</text><text y={50} textAnchor="middle" fontFamily={HAND} fontSize={58} fill="#fff">SUGAR!</text></g>
      </Cloud>
      {/* breakfast, second breakfast, and a "small" snack */}
      <rect x={520} y={top} width={220} height={22} rx={8} fill="#c79a6b" stroke={INK} strokeWidth={6} /><line x1={545} y1={top + 22} x2={545} y2={GY} stroke={INK} strokeWidth={10} /><line x1={715} y1={top + 22} x2={715} y2={GY} stroke={INK} strokeWidth={10} />
      {[[s.a, 548, "#1", 0.72, 2], [s.b, 636, "#2", 0.72, 0], [s.c, 700, '"small"', 1.1, 3]].map(([k, px, lab, sz, kind], i) => (k as number) <= 0.01 ? null : (
        <g key={i} transform={`translate(${px} ${top}) scale(${k})`}>
          <ellipse cx={0} cy={-4} rx={50 * (i === 2 ? 2 : 1)} ry={10} fill="#fff" stroke={INK} strokeWidth={4} />
          <g transform="translate(0 -8)"><Food kind={kind as number} s={sz as number} /></g>
          <text x={0} y={i === 2 ? -262 : -140} textAnchor="middle" fontFamily={HAND} fontSize={i === 2 ? 64 : 58} fill={i === 2 ? "#ef4444" : INK} stroke="#fff" strokeWidth={7} paintOrder="stroke fill">{lab as string}</text>
        </g>
      ))}
      <EnergyBar x={j.head[0] - 130} y={j.head[1] - 60} pct={9} />
      <g transform={`translate(0 ${UP})`}><TimeTag time="10:00" /></g>
    </Room>
  );
};

/* ---------- 6. The meeting ---------- */
export const Tom6: React.FC<SP> = ({ sc }) => {
  const { S, T, E } = cue(sc);
  const say = T(2) + 1.15; // "Tom says," then the quote
  const s = useTimeline({ nod: 0, ask: 0, jolt: 0, ans: 0, hen: 0, q: 0, q2: 0 }, (tl, v) => {
    tl.to(v, { nod: 1, duration: 2.5, ease: "power1.in" }, T(0) + 0.3)
      .to(v, { ask: 1, duration: 0.35, ease: "back.out(2)" }, T(1) + 0.3).to(v, { ask: 0, duration: 0.25 }, say - 0.3)
      .to(v, { nod: 0, duration: 0.12 }, T(2) + 0.1).to(v, { jolt: 1, duration: 0.12, ease: "power4.out" }, T(2) + 0.1).to(v, { jolt: 0, duration: 0.5, ease: "bounce.out" }, T(2) + 0.25)
      .to(v, { ans: 1, duration: 0.3, ease: "back.out(3)" }, say).to(v, { hen: 1, duration: 0.4, ease: "back.out(2)" }, say + 0.15)
      .to(v, { ans: 0, duration: 0.25 }, T(3) - 0.2)
      .to(v, { q: 1, duration: 0.35, ease: "back.out(2.5)" }, T(3) + 0.1)
      .to(v, { q2: 1, duration: 0.35, ease: "back.out(2.5)" }, T(4) + 0.1);
  });
  const { f } = s;
  const x = 200;
  const said = f / 30 >= say;
  const swing = s.nod * Math.sin(f / 12) * 22;
  const pose = alive(P({ ...SIT, tilt: swing, lean: -4 + s.nod * 4, dy: -s.jolt * 44, ...(s.q2 > 0.3 ? { aL: [-50, -120] as [number, number], aR: [50, 120] as [number, number] } : {}) }), f, 0.5);
  const j = body(x, GY, pose);
  const top = GY - 300;
  const stare = said;
  const others: [string, number][] = [["mate", 470], ["pal", 660]];
  const asking = s.ask > 0.3;
  return (
    <Room wall="#ecfeff" floor="#a5f3fc">
      <rect x={300} y={470} width={420} height={280} rx={12} fill="#fff" stroke={INK} strokeWidth={8} />
      <path d="M 340 690 L 430 620 L 510 650 L 600 540 L 680 520" fill="none" stroke="#ef4444" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /><text x={510} y={520} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={INK}>Q3 results</text>
      {others.map(([who, ox], i) => <Person key={who} who={who} x={ox} y={GY} s={SCALE} pose={alive(P({ drop: 46, lL: [-30, -10], lR: [30, 10], aL: [-34, -14], aR: [34, 14] }), f, 0.6, i * 17)} f={f} face={{ eyes: stare ? "wide" : "open", mouth: stare ? "flat" : "smile", look: stare ? -0.9 : 0.6 }} />)}
      <Stool x={x} />
      <Person who="me" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: said ? "wide" : s.nod > 0.5 && Math.abs(swing) > 14 ? "closed" : "tired", mouth: s.ans > 0.3 ? "o" : said ? "wavy" : "flat", look: 0.7, sweat: said, brows: said ? "worried" : "none" }} />
      <rect x={290} y={top} width={520} height={30} rx={10} fill="#c79a6b" stroke={INK} strokeWidth={6} /><line x1={326} y1={top + 30} x2={326} y2={GY} stroke={INK} strokeWidth={11} /><line x1={774} y1={top + 30} x2={774} y2={GY} stroke={INK} strokeWidth={11} />
      <Person who="boss" x={930} y={GY} s={SCALE} pose={alive(asking ? P({ aR: [96, 92], aL: [-20, -10], lean: -4 }) : stare ? P({ aL: [60, -40], aR: [-60, 40] }) : P({ aR: [-150, -170], aL: [-14, -6] }), f, 0.5, 5)} f={f} flip face={{ eyes: stare ? "wide" : "open", mouth: asking ? (Math.floor(f / 4) % 2 ? "o" : "flat") : "flat", brows: stare ? "up" : "stern", look: 0.8 }} />
      <Say x={700} y={GY - 760} k={s.ask} lines={["Tom, what do", "you think?"]} tail="right" size={50} />
      <Say x={x + 250} y={j.head[1] - 220} k={s.ans} lines={["Yes, chicken."]} tail="left" size={62} color="#ef4444" />
      {/* what the brain supplied */}
      <Cloud x={x + 130} y={j.head[1] - 250} k={s.hen * (s.ans < 0.3 && said ? 1 : 0)} w={300} h={250} tail={[-90, 160]}><g transform="translate(-10 10)"><Chicken s={0.8} f={f} /></g></Cloud>
      {others.map(([who, ox], i) => <Marks key={who} x={ox + 80} y={GY - 640 - i * 20} f={f + i * 9} k={s.q} />)}
      <Marks x={930} y={GY - 700} f={f + 5} k={s.q} />
      <Marks x={j.head[0] - 100} y={j.head[1] - 120} f={f} k={s.q2} color="#ef4444" />
      {said && f < S(3) && [0, 1, 2].map((i) => <circle key={i} cx={500 + i * 50} cy={GY - 480} r={10} fill="#94a3b8" opacity={0.3 + 0.7 * ((Math.floor(f / 8) + i) % 3 === 0 ? 1 : 0)} />)}
      <EnergyBar x={j.head[0]} y={j.head[1] - 170 - (said ? 0 : 0)} pct={6} />
      <g transform={`translate(0 ${UP})`}><TimeTag time="14:00" /></g>
      {E(0) < 0 && null}
    </Room>
  );
};

/* ---------- 7. The lesson ---------- */
export const Tom7: React.FC<SP> = ({ sc }) => {
  const { S, T } = cue(sc);
  const s = useTimeline({ hrs: 0, reach: 0, drawer: 1, tx: 330, lie: 0, charge: 0, brain: 0, keys: 0, mate: 1300, wave: 0, no: 0, card: 0 }, (tl, v) => {
    tl.to(v, { hrs: 1, duration: 0.45, ease: "back.out(2)" }, T(0) + 0.3).to(v, { hrs: 0, duration: 0.3 }, T(1) - 0.2)
      .to(v, { reach: 1, duration: 0.5, ease: "power2.out" }, T(1) + 0.2).to(v, { reach: 0, duration: 0.3 }, T(1) + 0.9).to(v, { drawer: 0, duration: 0.3, ease: "power2.in" }, T(1) + 1.0)
      .to(v, { tx: 560, duration: 0.8, ease: "power1.inOut" }, T(1) + 1.3).to(v, { lie: 1, duration: 0.4, ease: "power2.inOut" }, T(1) + 2.1)
      .to(v, { charge: 1, duration: T(2) - T(1) - 2.7, ease: "none" }, T(1) + 2.5)
      .to(v, { brain: 1, duration: 0.45, ease: "back.out(2.5)" }, T(2) + 0.3)
      .to(v, { keys: 1, duration: 0.35, ease: "back.out(3)" }, T(3))
      .to(v, { mate: 800, duration: 0.9, ease: "power2.out" }, T(4) - 0.6).to(v, { wave: 1, duration: 0.3 }, T(4))
      .to(v, { no: 1, duration: 0.35, ease: "back.out(3)" }, T(5))
      .to(v, { card: 1, duration: 0.5, ease: "back.out(1.6)" }, T(6) - 0.2);
  });
  const { f } = s;
  if (f < S(2) - 6) {
    // that night: phone away, into bed, the battery fills up
    const lying = s.lie > 0.5;
    const walking = s.tx > 332 && s.tx < 558;
    const pose = alive(P({ ...(walking ? walk(f, 22, 0.7) : {}), aR: [40 + 60 * s.reach, 70 + 30 * s.reach], aL: [-16, -8] }), f, 0.6);
    const j = body(s.tx, GY, pose, s.reach > 0.05);
    return (
      <g>
        <rect width={VW} height={VH} fill="#1e2346" /><rect x={0} y={FLOOR} width={VW} height={VH - FLOOR} fill="#151a36" />
        <g transform={`translate(0 ${-UP})`}>
          <rect x={420} y={520} width={220} height={220} rx={10} fill="#0f172a" stroke={INK} strokeWidth={8} /><circle cx={570} cy={590} r={30} fill="#fde68a" /><circle cx={584} cy={578} r={26} fill="#0f172a" />
          <rect x={30} y={GY - 300} width={220} height={300} fill="#8b6b4a" stroke={INK} strokeWidth={6} />
          <rect x={48} y={GY - 270} width={184} height={90} fill="#a47b54" stroke={INK} strokeWidth={5} transform={`translate(${s.drawer * 90} 0)`} /><circle cx={140 + s.drawer * 90} cy={GY - 225} r={10} fill="#fde047" stroke={INK} strokeWidth={3} />
          <Bed x={500} f={f} wave={!lying && f > S(1) ? 1 : 0} mood="smile" blanket={!lying} w={540} />
          {!lying && <Person who="me" x={s.tx} y={GY} s={SCALE} pose={pose} f={f} flip={s.reach > 0.05} face={{ eyes: "tired", mouth: "smile", look: 0.7 }} />}
          {!lying && f < S(1) + 26 && <Phone x={j.handR[0]} y={j.handR[1] - 20} f={0} rot={0} glow={0} />}
          {lying && <g>
            <g transform={`translate(640 ${GY - 290}) rotate(-80)`}><circle r={58} fill="#fffdf8" stroke={INK} strokeWidth={11} /><path d="M -50 -18 L -56 -48 L -26 -42 L -18 -70 L 8 -50 L 28 -76 L 38 -48 L 56 -20 Q 0 -38 -50 -18 Z" fill={INK} /><path d="M -18 0 q 8 6 16 0 M 12 0 q 8 6 16 0" stroke={INK} strokeWidth={5} fill="none" /><path d="M -10 22 q 10 8 20 0" stroke={INK} strokeWidth={4} fill="none" /></g>
            <path d={`M 670 ${GY - 196} Q 700 ${GY - 290} 850 ${GY - 280} Q 1030 ${GY - 270} 1040 ${GY - 196} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            {[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={600 + t * 40} y={GY - 380 - t * 100} fontFamily={HAND} fontSize={44 + t * 26} fill="#c7d2fe" opacity={1 - t}>z</text>; })}
          </g>}
          <EnergyBar x={lying ? 760 : j.head[0]} y={lying ? GY - 520 : j.head[1] - 170} pct={lying ? 6 + 94 * s.charge : 6} />
          {/* 7–9 hours */}
          <g transform={`translate(700 ${GY - 900}) scale(${s.hrs})`}><rect x={-230} y={-90} width={460} height={180} rx={36} fill="#312e81" stroke={INK} strokeWidth={7} /><text x={0} y={-6} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={84} fill="#fde68a">7–9 h</text><text x={0} y={56} textAnchor="middle" fontFamily={HAND} fontSize={44} fill="#c7d2fe">of sleep, every night</text></g>
        </g>
        <TimeTag time={lying ? "22:30" : "22:00"} day="Day 1 / Ngày 1" dark />
      </g>
    );
  }
  // the next day: keys found, coworkers safe, no chicken
  const x = 330;
  const pose = alive(s.card > 0.3 ? P({ aL: [-150, -175], aR: [150, 175] }) : P({ aL: s.keys > 0.3 ? [-140, -170] : [-14, -6], aR: s.wave > 0.3 ? [150, 180 + Math.sin(f / 3) * 16] : [14, 6] }), f, 0.7);
  const j = body(x, GY, pose);
  const kx = j.handL[0], ky = j.handL[1] - 10;
  return (
    <Room wall="#fef9c3" floor="#fde68a">
      <rect x={640} y={500} width={280} height={300} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={8} /><line x1={780} y1={500} x2={780} y2={800} stroke={INK} strokeWidth={6} /><circle cx={860} cy={570} r={38} fill="#fde047" />
      <Person who="me" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: "big", mouth: "grin", look: 0.6, blush: true }} />
      {s.keys > 0.01 && s.card < 0.3 && <g transform={`translate(${kx} ${ky}) scale(${s.keys})`}><circle r={70} fill="#fde047" opacity={0.4} /><circle cy={0} r={14} fill="none" stroke="#64748b" strokeWidth={6} />{[-18, 14].map((r, i) => <g key={i} transform={`translate(0 12) rotate(${r})`}><rect x={-5} y={0} width={10} height={52} rx={3} fill={i ? "#fbbf24" : "#cbd5e1"} stroke={INK} strokeWidth={3} /></g>)}<path d="M 50 -50 l 18 18 l 34 -40" stroke="#16a34a" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
      <Person who="mate" x={s.mate} y={GY} s={SCALE} pose={alive(P({ aL: [-14, -6], aR: s.wave > 0.3 ? [150, 180 - Math.sin(f / 3) * 16] : [14, 6] }), f, 0.7, 9)} f={f} flip face={{ eyes: "happy", mouth: "grin", look: 0.8 }} />
      {s.wave > 0.3 && s.card < 0.3 && [0, 1].map((i) => <text key={i} x={540 + i * 70} y={GY - 520 - Math.sin(f / 8 + i) * 12} fontFamily={HAND} fontSize={60} fill="#fb7185">♥</text>)}
      {/* no chicken */}
      {s.no > 0.01 && s.card < 0.3 && <g transform={`translate(570 ${GY - 760}) scale(${s.no})`}><circle r={120} fill="#fff" stroke="#ef4444" strokeWidth={16} /><g transform="translate(-8 14)"><Chicken s={0.7} f={0} /></g><line x1={-84} y1={-84} x2={84} y2={84} stroke="#ef4444" strokeWidth={16} strokeLinecap="round" /></g>}
      {/* the brain is back, in sunglasses */}
      <g transform={`translate(${j.head[0] + 20} ${j.head[1] - 330 - Math.abs(Math.sin(f / 9)) * 14}) scale(${s.brain * (s.card > 0.3 ? 0 : 1)})`}><Brain f={f} mood="cool" s={1.1} /></g>
      <EnergyBar x={j.head[0]} y={j.head[1] - 170} pct={100} />
      {/* final card */}
      {s.card > 0.01 && <g transform={`translate(540 ${GY - 800}) scale(${s.card})`}>
        <rect x={-480} y={-230} width={960} height={460} rx={40} fill="#1e1b4b" stroke={INK} strokeWidth={8} />
        <g transform="translate(-340 -70)"><Brain f={f} mood="cool" s={1} /></g>
        <text x={100} y={-110} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={62} fill="#fde68a">Sleep 7–9 hours.</text>
        <text x={100} y={-34} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={50} fill="#fde68a">Your brain will</text>
        <text x={100} y={30} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={50} fill="#fde68a">thank you.</text>
        <line x1={-400} y1={80} x2={400} y2={80} stroke="#4338ca" strokeWidth={4} />
        <text x={0} y={136} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={42} fill="#fff">Ngủ 7–9 tiếng mỗi đêm.</text>
        <text x={0} y={190} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={42} fill="#fff">Não bạn sẽ cảm ơn bạn đấy.</text>
      </g>}
      {s.card < 0.3 && <g transform={`translate(0 ${UP})`}><TimeTag time="07:00" day="Day 2 / Ngày 2" /></g>}
    </Room>
  );
};

export { SITBED, mix, VH };
