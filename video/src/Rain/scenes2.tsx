// Scenes 3–7 of "Rainy day: plan vs. reality" — GSAP timelines keyed to the dialogue (src/Rain/data.ts).
import React from "react";
import { alive, mix, P, type Pose } from "../Kids/rig";
import { Person } from "../Sleep/people";
import { body, S as SCALE } from "../Sleep/stage";
import { useTimeline } from "../Sleep/timeline";
import { Book, Mug, Room, SITF } from "./scenes1";
import { Badge, GY, HAND, INK, lines, PlanLabel, RainCloud, Tear, VH, VW, Window, type SP } from "./stage";

// every PLAN frame rips 1.1 s before the first REALITY line (mix_rain.py and the "wah wah" cue use the same rule)
export const tearAt = (sc: SP["sc"]) => sc.lines[0].t0 - 1.1;

// PLAN (bright, labelled) torn away to reveal REALITY (grey)
const PlanReality: React.FC<{ f: number; plan: React.ReactNode; reality: React.ReactNode; en: string; vi: string; tear: number }> = ({ f, plan, reality, en, vi, tear }) => {
  const s = useTimeline({ badgeP: 0, label: 0, tear: 0, badgeR: 0 }, (tl, v) => {
    tl.to(v, { badgeP: 1, duration: 0.4, ease: "back.out(2.5)" }, 0.3).to(v, { label: 1, duration: 0.4 }, 0.6)
      .to(v, { tear: 1, duration: 0.75, ease: "power1.in" }, tear).to(v, { badgeR: 1, duration: 0.4, ease: "back.out(2.5)" }, tear + 0.5);
  });
  return (
    <g>
      {reality}
      <Badge kind="REALITY" k={s.badgeR} f={f} />
      <Tear p={s.tear}>{plan}<Badge kind="PLAN" k={s.badgeP} f={f} /><PlanLabel k={s.label} en={en} vi={vi} /></Tear>
    </g>
  );
};
const Sparkles: React.FC<{ f: number; pts: [number, number][]; color?: string }> = ({ f, pts, color = "#fff" }) => (
  <g>{pts.map(([x, y], i) => <path key={i} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * Math.sin(f / 6 + i)})`} d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill={color} />)}</g>
);
const Zs: React.FC<{ x: number; y: number; f: number; color?: string }> = ({ x, y, f, color = "#e2e8f0" }) => (
  <g>{[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={x + t * 50} y={y - t * 110} fontFamily={HAND} fontSize={50 + t * 30} fill={color} opacity={1 - t}>z</text>; })}</g>
);
// the blanket: purple, with a sleepy little face
const Blanket: React.FC<{ x: number; y: number; w: number; h: number; f: number; face?: boolean; rot?: number }> = ({ x, y, w, h, f, face = true, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={`M ${-w / 2} ${h / 2} Q ${-w / 2 - 10} ${-h / 2} ${-w / 4} ${-h / 2 - 6 + Math.sin(f / 9) * 3} Q 0 ${-h / 2 - 20} ${w / 4} ${-h / 2 - 4} Q ${w / 2 + 12} ${-h / 2} ${w / 2} ${h / 2} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[-w / 3, 0, w / 3].map((dx, i) => <circle key={i} cx={dx} cy={(i % 2) * 14 - 4} r={7} fill="#a5b4fc" />)}
    {face && <g transform={`translate(${w / 2 - 70} ${-h / 2 + 34})`}><path d="M -14 0 q 7 6 14 0 M 10 0 q 7 6 14 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /><path d="M -2 14 q 6 6 12 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /><ellipse cx={-18} cy={10} rx={7} ry={4} fill="#f472b6" opacity={0.6} /><ellipse cx={30} cy={10} rx={7} ry={4} fill="#f472b6" opacity={0.6} /></g>}
  </g>
);
const Clock: React.FC<{ x: number; y: number; turns: number }> = ({ x, y, turns }) => (
  <g transform={`translate(${x} ${y})`}><circle r={64} fill="#fff" stroke={INK} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-46} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${turns * 360})`} /><line x1={0} y1={0} x2={28} y2={0} stroke="#ef4444" strokeWidth={7} strokeLinecap="round" transform={`rotate(${turns * 60 - 60})`} /><circle r={6} fill={INK} /></g>
);
// lying on the back: rotate a standing figure about its feet (head to the left, face up)
const Lying: React.FC<{ who: string; x: number; f: number; pose: Pose; face: Parameters<typeof Person>[0]["face"] }> = ({ who, x, f, pose, face }) => (
  <g transform={`rotate(-90 ${x} ${GY - 24})`}><Person who={who} x={x} y={GY - 24} s={SCALE} pose={pose} f={f} face={face} /></g>
);

/* ---------- 3. Plan: home workout · Reality: the relaxing position ---------- */
export const Rain3: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const s = useTimeline({ creep: 0, cover: 0, turns: 0 }, (tl, v) => {
    tl.to(v, { creep: 1, duration: 1.4, ease: "power1.inOut" }, T(1) - 0.4).to(v, { cover: 1, duration: 0.5, ease: "back.out(1.6)" }, T(1) + 1.0)
      .to(v, { turns: 2, duration: 2.6, ease: "power1.in" }, T(1) + 0.2);
  });
  const { f } = s;
  const stretch = Math.sin(f / 10);
  const plan = (
    <Room wall="#d1fae5" floor="#a7f3d0">
      <Clock x={860} y={760} turns={0} />
      <rect x={160} y={GY - 22} width={420} height={22} rx={10} fill="#22d3ee" stroke={INK} strokeWidth={5} />
      <Person who="lily" x={370} y={GY} s={SCALE} pose={alive(P({ aL: [-150 - stretch * 10, -175], aR: [150 + stretch * 10, 175], lL: [-14, -6], lR: [14, 6], dy: -Math.abs(stretch) * 6 }), f, 0.5)} f={f} face={{ eyes: "big", mouth: "grin", look: 0, brows: "up" }} />
      <rect x={322} y={GY - 600} width={96} height={20} rx={10} fill="#f43f5e" stroke={INK} strokeWidth={4} />
      <g transform={`translate(690 ${GY})`}><rect x={-26} y={-120} width={52} height={120} rx={14} fill="#38bdf8" stroke={INK} strokeWidth={5} /><rect x={-16} y={-140} width={32} height={22} rx={6} fill="#0ea5e9" stroke={INK} strokeWidth={4} /></g>
      <Sparkles f={f} pts={[[180, 650], [580, 560], [760, 820]]} color="#fde047" />
    </Room>
  );
  const lx = 640;
  const reality = (
    <Room wall="#9aa7b8" floor="#7c8a9c">
      <Clock x={860} y={760} turns={s.turns} />
      {s.turns > 0.05 && <text x={860} y={880} textAnchor="middle" fontFamily={HAND} fontSize={48} fill="#e2e8f0">+2 h</text>}
      <rect x={120} y={GY - 22} width={600} height={22} rx={10} fill="#64748b" stroke={INK} strokeWidth={5} />
      <Lying who="lily" x={lx} f={f} pose={alive(P({ aL: [-40, -20], aR: [40, 20], lL: [-6, -2], lR: [6, 2] }), f, 0.2)} face={{ eyes: s.cover > 0.5 ? "closed" : "happy", mouth: s.cover > 0.5 ? "o" : "smile", look: 0.2 }} />
      {/* the blanket creeps in from the right and tucks her in */}
      {s.cover < 0.5 ? <Blanket x={1200 - s.creep * 560} y={GY - 50} w={260} h={90} f={f} /> : <Blanket x={430} y={GY - 50} w={560} h={100} f={f} />}
      {s.cover > 0.5 && <Zs x={150} y={GY - 160} f={f} />}
    </Room>
  );
  return <PlanReality f={f} tear={tearAt(sc)} plan={plan} reality={reality} en="Plan: home workout" vi="Kế hoạch: tập thể dục tại nhà" />;
};

/* ---------- 4. Plan: clean my room · Reality: the photo album ---------- */
const Mess: React.FC<{ k: number; f: number }> = ({ k, f }) => (
  <g>{[[150, "#f87171", -20], [700, "#60a5fa", 15], [260, "#fde047", 30], [800, "#a78bfa", -10], [560, "#34d399", 25], [90, "#fb923c", 5], [940, "#f472b6", -30], [470, "#94a3b8", 12]].map(([x, c, r], i) => i >= k * 8 ? null : (
    <g key={i} transform={`translate(${x} ${GY - 10 - (i % 3) * 8}) rotate(${(r as number) + Math.sin(f / 30 + i) * 2})`}>{i % 3 === 0 ? <path d="M -50 0 L -36 -40 L 0 -30 L 36 -44 L 50 0 Z" fill={c as string} stroke={INK} strokeWidth={4} strokeLinejoin="round" /> : i % 3 === 1 ? <rect x={-34} y={-46} width={68} height={46} rx={4} fill={c as string} stroke={INK} strokeWidth={4} /> : <ellipse cx={0} cy={-16} rx={44} ry={16} fill={c as string} stroke={INK} strokeWidth={4} />}</g>
  ))}</g>
);
const Album: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y}) rotate(-8)`}>
    <rect x={-120} y={-80} width={240} height={150} rx={8} fill="#7c2d12" stroke={INK} strokeWidth={5} />
    <rect x={-112} y={-74} width={108} height={138} fill="#fef3c7" /><rect x={4} y={-74} width={108} height={138} fill="#fef3c7" />
    {[[-58, -30], [58, -30], [-58, 30], [58, 30]].map(([px, py], i) => <g key={i}><rect x={px - 40} y={py - 26} width={80} height={52} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={px} cy={py - 4} r={9} fill={["#f472b6", "#60a5fa", "#fbbf24", "#34d399"][i]} /><path d={`M ${px - 12} ${py + 18} Q ${px} ${py + 4} ${px + 12} ${py + 18}`} fill={["#f472b6", "#60a5fa", "#fbbf24", "#34d399"][i]} /></g>)}
    {[0, 1].map((i) => <text key={i} x={-40 + i * 80} y={-100 - Math.sin(f / 8 + i) * 8} fontFamily={HAND} fontSize={44} fill="#fda4af">♥</text>)}
  </g>
);
export const Rain4: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const s = useTimeline({ mess: 0.25, mom: 1260, look: 0, sun: 0 }, (tl, v) => {
    tl.to(v, { mess: 1, duration: 8, ease: "none" }, tearAt(sc) + 0.4).to(v, { sun: 1, duration: 9, ease: "none" }, tearAt(sc) + 0.4)
      .to(v, { mom: 900, duration: 0.7, ease: "power2.out" }, T(0) - 0.6)
      .to(v, { look: 1, duration: 0.3 }, T(2) - 0.3);
  });
  const { f } = s;
  const x = 380;
  const plan = (
    <Room wall="#ede9fe" floor="#c4b5fd">
      <rect x={560} y={560} width={300} height={260} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={8} /><line x1={710} y1={560} x2={710} y2={820} stroke={INK} strokeWidth={6} />
      <Person who="lily" x={x} y={GY} s={SCALE} pose={alive(P({ aL: [-30, -60], aR: [70, 150], lL: [-14, -6], lR: [14, 6] }), f, 0.6)} f={f} face={{ eyes: "big", mouth: "grin", brows: "angry", look: 0.6 }} />
      {/* the broom and the yellow gloves */}
      {(() => { const j = body(x, GY, P({ aL: [-30, -60], aR: [70, 150] })); return <g><g transform={`translate(${j.handR[0]} ${j.handR[1]}) rotate(${20 + Math.sin(f / 6) * 6})`}><rect x={-6} y={-200} width={12} height={300} rx={5} fill="#a16207" stroke={INK} strokeWidth={4} /><path d="M -50 100 L 50 100 L 36 160 L -36 160 Z" fill="#fde047" stroke={INK} strokeWidth={5} /></g>{[j.handL, j.handR].map((h, i) => <circle key={i} cx={h[0]} cy={h[1]} r={18} fill="#facc15" stroke={INK} strokeWidth={4} />)}</g>; })()}
      <Sparkles f={f} pts={[[180, 640], [640, 900], [880, 660], [240, 980]]} color="#a78bfa" />
    </Room>
  );
  const pose = alive(P({ ...SITF, aL: [60, 120], aR: [70, 130], tilt: s.look > 0.5 ? -4 : 10 }), f, 0.5);
  const j = body(x, GY, pose);
  const reality = (
    <Room wall="#9aa7b8" floor="#7c8a9c">
      <rect x={140} y={560} width={300} height={260} rx={10} fill={s.sun > 0.5 ? "#fdba74" : "#cbd5e1"} stroke={INK} strokeWidth={8} /><line x1={290} y1={560} x2={290} y2={820} stroke={INK} strokeWidth={6} />
      <circle cx={180 + s.sun * 220} cy={620 + s.sun * 150} r={30} fill="#fb923c" opacity={0.6} />
      {/* the door, and Mom in it */}
      <rect x={840} y={GY - 640} width={240} height={640} fill="#57534e" />
      <Person who="mom" x={s.mom} y={GY} s={SCALE} pose={alive(P({ aL: [60, -40], aR: [-60, 40], lean: -4 }), f, 0.5, 7)} f={f} flip face={{ eyes: "open", mouth: "flat", brows: "stern", look: 0.6 }} />
      <rect x={1060} y={GY - 660} width={40} height={660} fill="#a16207" stroke={INK} strokeWidth={6} />
      <Mess k={s.mess} f={f} />
      <Person who="lily" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: s.look > 0.5 ? "big" : "happy", mouth: s.look > 0.5 ? "grin" : "smile", look: s.look > 0.5 ? 0.9 : 0.3, sweat: s.look > 0.5, blush: s.look < 0.5 }} />
      <Album x={(j.handL[0] + j.handR[0]) / 2 + 30} y={(j.handL[1] + j.handR[1]) / 2 - 30} f={f} />
    </Room>
  );
  return <PlanReality f={f} tear={tearAt(sc)} plan={plan} reality={reality} en="Plan: clean my room" vi="Kế hoạch: dọn phòng" />;
};

/* ---------- 5. Plan: cook something healthy · Reality: noodles in a blanket ---------- */
const Noodles: React.FC<{ x: number; y: number; f: number; s?: number; open?: boolean }> = ({ x, y, f, s = 1, open = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -44 -90 L 44 -90 L 34 0 L -34 0 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-40} y={-64} width={80} height={26} fill="#ef4444" /><text x={0} y={-44} textAnchor="middle" fontFamily={HAND} fontSize={22} fill="#fff">NOODLE</text>
    {open ? [0, 1].map((i) => <path key={i} d={`M ${-10 + i * 18} -96 q -8 -14 0 -26 q 8 -12 0 -24`} stroke="#e2e8f0" strokeWidth={4} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />) : <ellipse cx={0} cy={-92} rx={46} ry={8} fill="#fde68a" stroke={INK} strokeWidth={4} />}
  </g>
);
export const Rain5: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const s = useTimeline({ cup2: 0, cake: 0, tea: 0, slurp: 0 }, (tl, v) => {
    tl.to(v, { slurp: 1, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, T(0) + 0.3)
      .to(v, { slurp: 1, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, T(1) + 0.2)
      .to(v, { cup2: 1, duration: 0.4, ease: "back.out(2.5)" }, T(2) + 0.1)
      .to(v, { cake: 1, duration: 0.35, ease: "back.out(2.5)" }, T(2) + 2.2).to(v, { tea: 1, duration: 0.35, ease: "back.out(2.5)" }, T(2) + 2.8);
  });
  const { f } = s;
  const x = 360;
  const plan = (
    <Room wall="#ecfccb" floor="#bef264">
      <rect x={560} y={GY - 300} width={500} height={30} rx={10} fill="#a16207" stroke={INK} strokeWidth={6} /><rect x={580} y={GY - 270} width={460} height={270} fill="#ca8a04" stroke={INK} strokeWidth={6} />
      <Person who="lily" x={x} y={GY} s={SCALE} pose={alive(P({ aL: [60, 140], aR: [70, 150] }), f, 0.6)} f={f} face={{ eyes: "big", mouth: "grin", look: 0.6 }} />
      {(() => { const j = body(x, GY, P({ aL: [60, 140], aR: [70, 150] })); return <g transform={`translate(${(j.handL[0] + j.handR[0]) / 2 + 20} ${(j.handL[1] + j.handR[1]) / 2})`}><rect x={-80} y={-110} width={160} height={110} rx={8} fill="#16a34a" stroke={INK} strokeWidth={5} /><text x={0} y={-62} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#fff">HEALTHY</text><text x={0} y={-28} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#fff">RECIPES</text></g>; })()}
      <g transform={`translate(800 ${GY - 300})`}><path d="M -90 0 Q -90 70 0 70 Q 90 70 90 0 Z" fill="#fff" stroke={INK} strokeWidth={6} />{[[-50, -10, "#22c55e"], [-10, -22, "#ef4444"], [30, -12, "#84cc16"], [60, -4, "#f97316"], [0, -6, "#16a34a"]].map(([dx, dy, c], i) => <circle key={i} cx={dx as number} cy={dy as number} r={22} fill={c as string} stroke={INK} strokeWidth={3} />)}</g>
      <Sparkles f={f} pts={[[200, 640], [700, 600], [920, 820]]} color="#fde047" />
    </Room>
  );
  const pose = alive(P({ ...SITF, aL: [70, 150], aR: [80, 160 + s.slurp * 20], tilt: -6 + s.slurp * -6 }), f, 0.5);
  const j = body(x, GY, pose);
  const cup: [number, number] = [(j.handL[0] + j.handR[0]) / 2 + 6, (j.handL[1] + j.handR[1]) / 2 + 40];
  const reality = (
    <Room wall="#9aa7b8" floor="#7c8a9c">
      <Window x={600} y={520} w={420} h={400} f={f} rain={1} curtain={1}><rect x={600} y={820} width={420} height={110} fill="#475569" /><RainCloud x={820} y={660} f={f} s={0.75} mood="chew" popcorn /></Window>
      <rect x={560} y={GY - 120} width={280} height={20} rx={8} fill="#6b7280" stroke={INK} strokeWidth={5} /><line x1={580} y1={GY - 100} x2={580} y2={GY} stroke={INK} strokeWidth={8} /><line x1={820} y1={GY - 100} x2={820} y2={GY} stroke={INK} strokeWidth={8} />
      <Person who="lily" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: "happy", mouth: s.slurp > 0.2 ? "chew" : "smile", look: 0.5, blush: true }} />
      {/* wrapped in the blanket */}
      <path d={`M ${j.hip[0] - 170} ${GY - 10} Q ${j.hip[0] - 190} ${j.neck[1] + 20} ${j.neck[0] - 40} ${j.neck[1] + 16} Q ${j.neck[0] + 50} ${j.neck[1] + 6} ${j.neck[0] + 110} ${j.neck[1] + 50} Q ${j.hip[0] + 230} ${j.hip[1]} ${j.hip[0] + 190} ${GY - 10} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <Noodles x={cup[0]} y={cup[1]} f={f} s={1.1} />
      {[j.handL, j.handR].map((h, i) => <circle key={i} cx={h[0]} cy={h[1] + 20} r={12} fill="#fffdf8" stroke={INK} strokeWidth={4} />)}
      {/* chopsticks and a noodle that reaches the mouth */}
      <g><line x1={cup[0] - 10} y1={cup[1] - 100} x2={j.head[0] + 50} y2={j.head[1] + 10 - s.slurp * 20} stroke="#a16207" strokeWidth={6} strokeLinecap="round" /><path d={`M ${cup[0] - 4} ${cup[1] - 96} Q ${cup[0] + 30} ${cup[1] - 150 - s.slurp * 20} ${j.head[0] + 34} ${j.head[1] + 24}`} stroke="#fde68a" strokeWidth={7} fill="none" /></g>
      {s.cup2 > 0.01 && <g transform={`translate(640 ${GY - 120}) scale(${s.cup2})`}><Noodles x={0} y={0} f={f} s={0.9} open={false} /><text x={0} y={-130} textAnchor="middle" fontFamily={HAND} fontSize={52} fill="#fde68a" stroke={INK} strokeWidth={6} paintOrder="stroke fill">#2</text></g>}
      {s.cake > 0.01 && <g transform={`translate(730 ${GY - 120}) scale(${s.cake})`}><path d="M -40 0 L 40 0 L 40 -40 L -40 -50 Z" fill="#fde68a" stroke={INK} strokeWidth={4} /><path d="M -40 -50 L 40 -40 L 40 -50 L -40 -62 Z" fill="#f9a8d4" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-64} r={9} fill="#ef4444" /></g>}
      {s.tea > 0.01 && <g transform={`translate(800 ${GY - 120}) scale(${s.tea})`}><path d="M -26 -100 L 26 -100 L 20 0 L -20 0 Z" fill="#d6b38a" stroke={INK} strokeWidth={4} />{[-10, 4, 14].map((dx, i) => <circle key={i} cx={dx} cy={-14 - i * 6} r={6} fill={INK} />)}<line x1={8} y1={-100} x2={18} y2={-140} stroke="#f472b6" strokeWidth={8} strokeLinecap="round" /></g>}
    </Room>
  );
  return <PlanReality f={f} tear={tearAt(sc)} plan={plan} reality={reality} en="Plan: cook something healthy" vi="Kế hoạch: nấu món lành mạnh" />;
};

/* ---------- 6. Max calls: the rain stopped! ---------- */
export const Rain6: React.FC<SP> = ({ sc }) => {
  const { T, E } = lines(sc);
  const s = useTimeline({ pick: 0, call: 0, look: 0, cloud: 0, rain: 0, nod: 0, hide: 0 }, (tl, v) => {
    tl.to(v, { pick: 1, duration: 0.35, ease: "power2.out" }, 1.2).to(v, { call: 1, duration: 0.35, ease: "back.out(2)" }, T(0) - 0.3).to(v, { call: 0, duration: 0.25 }, E(1) + 0.3)
      .to(v, { look: 1, duration: 0.2 }, E(1) + 0.15).to(v, { look: 2, duration: 0.2 }, E(1) + 0.55).to(v, { look: 3, duration: 0.2 }, E(1) + 0.95)
      .to(v, { cloud: 1, duration: 0.8, ease: "power3.out" }, E(2) + 0.2).to(v, { rain: 1, duration: 0.3 }, E(2) + 0.9)
      .to(v, { nod: 1, duration: 0.25, yoyo: true, repeat: 3 }, E(2) + 1.3).to(v, { hide: 1, duration: 0.8, ease: "power2.inOut" }, E(2) + 2.4);
  });
  const { f } = s;
  const x = 380;
  const lookDir = s.look < 0.5 ? 0.3 : s.look < 1.5 ? 0.9 : s.look < 2.5 ? -0.9 : 0.9;
  const ring = s.pick < 0.5 && f > 6;
  const pose = alive(P({ ...SITF, aL: [70, 150], aR: s.pick > 0.5 && s.call > 0.05 ? [130, 200] : [80, 150], tilt: s.nod * 12 }), f, 0.5);
  const j = body(x, GY, pose);
  return (
    <Room wall={s.rain > 0.5 ? "#9aa7b8" : "#fef9c3"} floor={s.rain > 0.5 ? "#7c8a9c" : "#fde68a"}>
      <Window x={600} y={520} w={420} h={400} f={f} rain={s.rain} curtain={1}>
        <rect x={600} y={820} width={420} height={110} fill={s.rain > 0.5 ? "#475569" : "#86efac"} />
        <RainCloud x={1260 - s.cloud * 450} y={640} f={f} s={0.8} mood="sly" rain={s.rain} />
      </Window>
      {s.rain > 0.5 && <text x={810} y={480} textAnchor="middle" fontFamily={HAND} fontSize={64} fill="#fde68a" stroke={INK} strokeWidth={6} paintOrder="stroke fill" opacity={Math.min(1, (f - (E(2) + 0.9) * 30) / 8)}>BOOM!</text>}
      <Person who="lily" x={x} y={GY} s={SCALE} pose={pose} f={f} face={{ eyes: s.nod > 0.1 || s.hide > 0.3 ? "happy" : "open", mouth: s.hide > 0.3 ? "smile" : s.look > 0.5 && s.look < 3 ? "flat" : "smile", look: lookDir, brows: s.look > 2.5 && s.rain < 0.5 ? "up" : "none" }} />
      {/* the blanket around her, pulled over the head at the end */}
      <path d={`M ${j.hip[0] - 170} ${GY - 10} Q ${j.hip[0] - 190} ${j.neck[1] + 20 - s.hide * 190} ${j.neck[0] - 40} ${j.neck[1] + 16 - s.hide * 210} Q ${j.neck[0] + 50} ${j.neck[1] + 6 - s.hide * 210} ${j.neck[0] + 110} ${j.neck[1] + 50 - s.hide * 150} Q ${j.hip[0] + 230} ${j.hip[1]} ${j.hip[0] + 190} ${GY - 10} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {s.hide > 0.8 && <g transform={`translate(${j.head[0] + 30} ${j.head[1] + 6})`}><circle cx={-14} cy={0} r={7} fill={INK} /><circle cx={14} cy={0} r={7} fill={INK} /></g>}
      {/* the phone: ringing on the floor, then Max on screen */}
      {s.pick < 0.5 ? <g transform={`translate(${560 + (ring ? Math.sin(f * 2.4) * 5 : 0)} ${GY - 20}) rotate(-90)`}><rect x={-26} y={-46} width={52} height={92} rx={9} fill="#111827" stroke={INK} strokeWidth={4} />{ring && [-1, 1].map((sd) => <path key={sd} d={`M ${sd * 40} -30 l ${sd * 14} -10 M ${sd * 44} 0 l ${sd * 18} 0`} stroke={INK} strokeWidth={4} strokeLinecap="round" />)}</g>
        : s.call > 0.01 ? <g transform={`translate(${j.handR[0] + 210} ${j.handR[1] - 140}) scale(${s.call})`}>
          <rect x={-120} y={-200} width={240} height={400} rx={32} fill="#111827" stroke={INK} strokeWidth={6} /><rect x={-104} y={-180} width={208} height={360} rx={18} fill="#bae6fd" />
          <circle cx={0} cy={-40} r={70} fill="#60a5fa" stroke={INK} strokeWidth={5} /><circle cx={-22} cy={-50} r={8} fill={INK} /><circle cx={22} cy={-50} r={8} fill={INK} /><path d="M -26 -16 Q 0 12 26 -16" stroke={INK} strokeWidth={5} fill="#fff" />
          <text x={0} y={80} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={44} fill={INK}>Max</text><text x={0} y={130} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={30} fill="#16a34a">calling…</text>
        </g> : null}
      {s.pick > 0.5 && s.call < 0.05 && s.hide < 0.3 && <g transform={`translate(${j.handR[0]} ${j.handR[1] - 20})`}><rect x={-22} y={-40} width={44} height={80} rx={8} fill="#111827" stroke={INK} strokeWidth={4} /></g>}
    </Room>
  );
};

/* ---------- 7. The rainy-day report ---------- */
export const RAIN_HOLD = 90; // the closing question holds three more seconds
export const Rain7: React.FC<SP> = ({ sc }) => {
  const { T, E } = lines(sc);
  const s = useTimeline({ board: 0, r0: 0, r1: 0, r2: 0, r3: 0, end: 0 }, (tl, v) => {
    tl.to(v, { board: 1, duration: 0.45, ease: "back.out(1.8)" }, T(0) - 0.2);
    ["r0", "r1", "r2", "r3"].forEach((k, i) => tl.to(v, { [k]: 1, duration: 0.3, ease: "back.out(2.5)" }, T(0) + 0.4 + i * 0.5));
    tl.to(v, { board: 0, duration: 0.3 }, T(4) - 0.3).to(v, { end: 1, duration: 0.5, ease: "back.out(1.6)" }, E(5) + 0.2);
  });
  const { f } = s;
  const rows: [string, string, string][] = [["Books read", "Sách đã đọc", "0.001"], ["Workouts", "Bài tập", "0"], ["Noodles", "Mì gói", "2"], ["Happiness", "Hạnh phúc", "100%"]];
  const vals = [s.r0, s.r1, s.r2, s.r3];
  const talking = f / 30 >= T(4) - 0.1 && f / 30 < E(5) + 0.1;
  return (
    <Room wall="#1e2346" floor="#151a36">
      <Window x={560} y={520} w={420} h={420} f={f} rain={1} curtain={1}><rect x={560} y={850} width={420} height={110} fill="#1e293b" /><RainCloud x={770} y={640} f={f} s={0.7} mood="smile" rain={1} /></Window>
      {/* in bed, under the blanket, listening to the rain */}
      <rect x={60} y={GY - 210} width={30} height={210} rx={8} fill="#8b6b4a" stroke={INK} strokeWidth={5} />
      <rect x={80} y={GY - 150} width={500} height={70} rx={14} fill="#e2e8f0" stroke={INK} strokeWidth={5} />
      <line x1={110} y1={GY - 80} x2={110} y2={GY} stroke={INK} strokeWidth={9} /><line x1={550} y1={GY - 80} x2={550} y2={GY} stroke={INK} strokeWidth={9} />
      <rect x={96} y={GY - 196} width={130} height={56} rx={24} fill="#f8fafc" stroke={INK} strokeWidth={5} />
      <g transform={`translate(190 ${GY - 214}) rotate(-80)`}><circle r={58} fill="#fffdf8" stroke={INK} strokeWidth={11} /><path d="M -60 10 Q -64 -64 0 -62 Q 64 -64 60 10 Q 40 -40 0 -40 Q -40 -40 -60 10 Z" fill="#3f2a1d" />
        {talking ? <g><circle cx={-18} cy={2} r={8} fill={INK} /><circle cx={18} cy={2} r={8} fill={INK} /><ellipse cx={0} cy={28} rx={9} ry={6 + 5 * Math.abs(Math.sin(f / 3))} fill={INK} /></g> : <g><path d="M -26 2 q 8 7 16 0 M 10 2 q 8 7 16 0" stroke={INK} strokeWidth={5} fill="none" /><path d="M -10 24 q 10 9 20 0" stroke={INK} strokeWidth={5} fill="none" /></g>}
      </g>
      <Blanket x={400} y={GY - 168} w={380} h={90} f={f} face />
      {/* the report */}
      {s.board > 0.01 && <g transform={`translate(540 600) scale(${s.board})`}>
        <rect x={-440} y={-250} width={880} height={500} rx={30} fill="#fffdf5" stroke={INK} strokeWidth={8} />
        <text y={-180} textAnchor="middle" fontFamily={HAND} fontSize={60} fill="#db2777">RAINY DAY REPORT</text>
        {rows.map(([en, vi, val], i) => vals[i] <= 0.01 ? null : (
          <g key={en} transform={`translate(0 ${-110 + i * 92}) scale(${vals[i]})`}>
            <text x={-390} y={0} fontFamily="MedSans" fontWeight={700} fontSize={40} fill={INK}>{en}</text>
            <text x={-390} y={36} fontFamily="MedSans" fontWeight={700} fontSize={28} fill="#64748b">{vi}</text>
            <text x={390} y={18} textAnchor="end" fontFamily="MedSans" fontWeight={700} fontSize={56} fill={i === 3 ? "#16a34a" : i === 2 ? "#f59e0b" : "#ef4444"}>{val}</text>
          </g>
        ))}
      </g>}
      {/* the closing question */}
      {s.end > 0.01 && <g transform={`translate(540 560) scale(${s.end})`}>
        <rect x={-450} y={-170} width={900} height={340} rx={36} fill="#312e81" stroke={INK} strokeWidth={8} />
        <g transform="translate(-330 -40) scale(0.55)"><RainCloud x={0} y={0} f={f} mood="grin" rain={1} /></g>
        <text x={80} y={-60} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={56} fill="#fde68a">What do YOU do</text>
        <text x={80} y={6} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={56} fill="#fde68a">on rainy days?</text>
        <text x={80} y={100} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={40} fill="#fff">Ngày mưa bạn thường làm gì?</text>
      </g>}
    </Room>
  );
};

export { Book, Mug, mix, VH, VW };
