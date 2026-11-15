// Scenes 1–3 of "POV: A Day in the Life of a Med Student" — native 9:16 (1080x1920), action between y 200 and 1300.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alive, mix, P, pop, poseAt, STAND, tw, walk } from "../Kids/rig";
import { Bubble, Star } from "../Kids/stage";
import type { SceneData } from "./data";
import { INK, joints, Person, RED } from "./people";

export const VW = 1080, VH = 1920, GY = 1240, HAND = "KidsHand";
export const cue = (sc: SceneData) => ({ S: (i: number) => Math.round((sc.sentences[Math.min(i, sc.sentences.length - 1)]?.t0 ?? 0) * 30) });
export type SP = { sc: SceneData };
export const pulse = (f: number, at: number, len = 16) => { const t = (f - at) / len; return t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI); };
export const Txt: React.FC<{ x: number; y: number; t: string; k?: number; size?: number; color?: string; rot?: number; anchor?: "start" | "middle" | "end"; outline?: string }> = ({ x, y, t, k = 1, size = 60, color = INK, rot = 0, anchor = "middle", outline }) =>
  k <= 0.01 ? null : <text transform={`translate(${x} ${y}) scale(${k}) rotate(${rot})`} textAnchor={anchor} fontFamily={HAND} fontSize={size} fill={color} stroke={outline} strokeWidth={outline ? size * 0.12 : 0} paintOrder="stroke fill" strokeLinejoin="round">{t}</text>;
const Clock: React.FC<{ x: number; y: number; r?: number; color: string; ring: number; f: number; phase?: number }> = ({ x, y, r = 56, color, ring, f, phase = 0 }) => (
  <g transform={`translate(${x} ${y - Math.abs(Math.sin((f + phase) * 0.9)) * 18 * ring}) rotate(${Math.sin((f + phase) * 1.7) * 12 * ring})`}>
    <circle cx={-r * 0.62} cy={-r * 0.98} r={r * 0.32} fill="#fbbf24" stroke={INK} strokeWidth={5} /><circle cx={r * 0.62} cy={-r * 0.98} r={r * 0.32} fill="#fbbf24" stroke={INK} strokeWidth={5} />
    <circle r={r} fill={color} stroke={INK} strokeWidth={6} /><circle r={r * 0.72} fill="#fff" stroke={INK} strokeWidth={4} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={INK} strokeWidth={6} strokeLinecap="round" /><line x1={0} y1={0} x2={-r * 0.3} y2={r * 0.1} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <line x1={-r * 0.5} y1={r * 0.85} x2={-r * 0.7} y2={r * 1.15} stroke={INK} strokeWidth={6} strokeLinecap="round" /><line x1={r * 0.5} y1={r * 0.85} x2={r * 0.7} y2={r * 1.15} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    {ring > 0.3 && [-1, 1].map((sd) => <path key={sd} d={`M ${sd * r * 1.3} ${-r * 0.5} l ${sd * 22} -12 M ${sd * r * 1.38} 0 l ${sd * 26} 0 M ${sd * r * 1.3} ${r * 0.5} l ${sd * 22} 12`} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f * 1.4)} />)}
  </g>
);
export const Book: React.FC<{ x: number; y: number; w?: number; h?: number; color: string; rot?: number }> = ({ x, y, w = 150, h = 36, color, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x={-w / 2} y={-h} width={w} height={h} rx={5} fill={color} stroke={INK} strokeWidth={4} /><line x1={-w / 2 + 12} y1={-h / 2} x2={w / 2 - 12} y2={-h / 2} stroke="#fff" strokeWidth={4} opacity={0.6} /></g>
);
export const Desk: React.FC<{ x: number; w: number; y?: number; color?: string }> = ({ x, w, y = GY - 230, color = "#c79a6b" }) => (
  <g><rect x={x} y={y} width={w} height={26} rx={8} fill={color} stroke={INK} strokeWidth={5} /><line x1={x + 30} y1={y + 26} x2={x + 30} y2={GY} stroke={INK} strokeWidth={9} strokeLinecap="round" /><line x1={x + w - 30} y1={y + 26} x2={x + w - 30} y2={GY} stroke={INK} strokeWidth={9} strokeLinecap="round" /></g>
);
export const Stool: React.FC<{ x: number; y?: number }> = ({ x, y = GY - 150 }) => (
  <g><rect x={x - 55} y={y} width={110} height={20} rx={6} fill="#8b6b4a" stroke={INK} strokeWidth={5} /><line x1={x - 36} y1={y + 20} x2={x - 46} y2={GY} stroke={INK} strokeWidth={8} /><line x1={x + 36} y1={y + 20} x2={x + 46} y2={GY} stroke={INK} strokeWidth={8} /></g>
);
const SIT = P({ drop: 46, lL: [86, 4], lR: [80, 8], aL: [30, 70], aR: [40, 80] });
const Banhmi: React.FC<{ x: number; y: number; s?: number; rot?: number; bites?: number }> = ({ x, y, s = 1, rot = 0, bites = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d={`M -70 6 Q -78 -20 -40 -24 L 56 -24 Q 80 -20 74 4 Q 60 22 0 22 Q -60 22 -70 6 Z`} fill="#f2c078" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -50 -6 L 50 -6" stroke="#65a30d" strokeWidth={6} strokeLinecap="round" /><path d="M -40 2 L 40 2" stroke="#ef4444" strokeWidth={5} strokeLinecap="round" />
    {Array.from({ length: bites }).map((_, i) => <circle key={i} cx={74 - i * 22} cy={-8} r={14} fill="#fdfcf8" />)}
  </g>
);

/* ---------- 1. Alarm ---------- */
export const Med1: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const ring = f >= S(0) - 4 && f < S(1) + 30 ? 1 : 0;
  const jolt = tw(f, S(1), S(1) + 10);
  const run = f >= S(3) - 4;
  const page = f < S(2) + 50 ? 1 : 0;
  const peel = tw(f, S(2) + 50, S(2) + 80);
  const sleep = P({ drop: 122, lean: 0, tilt: 24, lL: [82, 6], lR: [72, 10], aL: [-128, 96], aR: [128, -96] }); // forearms folded on the desk as a pillow
  const up = P({ aL: [-128, -160], aR: [128, 160], lL: [-14, -2], lR: [14, 2], dy: -20 });
  const youPose = run ? mix(walk(f, 12, 1.5), P({ aR: [130, 196], lean: 14 }), 0.35) : f < S(1) ? alive(sleep, f, 0.4) : alive(mix(up, P({ aL: [-40, -20], aR: [40, 20] }), tw(f, S(1) + 40, S(2))), f, 1);
  const yx = run ? 520 : 470;
  const yj = joints("dad", yx, GY, 1, youPose);
  const scroll = run ? (f - S(3)) * 16 : 0;
  const dawn = run ? 1 : 0;
  return (
    <g>
      {/* night room, then the street at dawn */}
      <rect width={VW} height={VH} fill={dawn ? "#2c3866" : "#26304f"} />
      {dawn ? (
        <g>
          <defs><linearGradient id="m1dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c3866" /><stop offset="0.75" stopColor="#7c6fb0" /><stop offset="1" stopColor="#f6ad7b" /></linearGradient></defs>
          <rect width={VW} height={GY} fill="url(#m1dawn)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = ((i * 220 - scroll * 0.5) % 1540 + 1540) % 1540 - 230; const h = 260 + (i * 97) % 240; return <g key={i}><rect x={x} y={GY - h} width={190} height={h} fill="#3b4373" stroke="#2b2f55" strokeWidth={4} />{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 40 + c * 70} y={GY - h + 40 + r * 70} width={36} height={40} fill={(i + r + c) % 3 ? "#fcd34d" : "#4b5394"} opacity={0.85} />))}</g>; })}
          {[0, 1, 2, 3].map((i) => <line key={i} x1={((i * 300 - scroll) % 1200 + 1200) % 1200 - 60} y1={GY + 70} x2={((i * 300 - scroll) % 1200 + 1200) % 1200 + 60} y2={GY + 70} stroke="#9aa6b5" strokeWidth={8} strokeLinecap="round" />)}
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={yx - 170 - i * 18} y1={GY - 320 + i * 60} x2={yx - 290 - i * 18} y2={GY - 320 + i * 60} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
        </g>
      ) : (
        <g>
          <rect x={700} y={300} width={260} height={300} rx={10} fill="#141b36" stroke={INK} strokeWidth={8} />
          <line x1={830} y1={300} x2={830} y2={600} stroke={INK} strokeWidth={6} /><line x1={700} y1={450} x2={960} y2={450} stroke={INK} strokeWidth={6} />
          <path transform="translate(770 380)" d="M 12 -38 A 40 40 0 1 0 38 20 A 30 30 0 1 1 12 -38 Z" fill="#fde68a" />
          {[[900, 360], [880, 540], [760, 530]].map(([x, y], i) => <Star key={i} x={x} y={y} s={0.5 + 0.3 * Math.sin(f / 8 + i)} fill="#fff" />)}
          <circle cx={230} cy={GY - 380} r={160} fill="#fde68a" opacity={0.12} />
          <path d={`M 170 ${GY - 400} L 190 ${GY - 470} L 270 ${GY - 470} L 290 ${GY - 400} Z`} fill="#fbbf24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {f < S(1) && <Person who="you" x={560} y={GY} pose={alive(sleep, f, 0.4)} f={f} face={{ eyes: "closed", mouth: "o" }} />}
          <Desk x={110} w={760} />
          <g transform={`translate(${560} ${GY - 226})`}><path d="M -110 0 L -10 -14 L 0 0 Z M 0 0 L 10 -14 L 110 0 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><circle cx={-55} cy={-6} r={6} fill="none" stroke={INK} strokeWidth={3} /></g>
          <Book x={260} y={GY - 230} color="#93c5fd" /><Book x={260} y={GY - 266} color="#fca5a5" w={130} />
          <Clock x={300} y={GY - 330} color="#ef4444" ring={ring} f={f} />
          <Clock x={780} y={GY - 300} r={46} color="#60a5fa" ring={ring} f={f} phase={9} />
          <Clock x={150} y={GY - 520} r={40} color="#fbbf24" ring={ring} f={f} phase={17} />
          {f < S(1) && f > S(0) - 4 && <Txt x={760} y={GY - 520} t="BEEP BEEP!" k={pop(f, S(0) - 4, 10)} size={70} color="#fecaca" rot={-8} />}
          {f < S(1) && <Txt x={600} y={GY - 520 - ((f % 60) / 60) * 80} t="z" size={60} color="#c7d2fe" />}
        </g>
      )}
      <rect x={0} y={GY} width={VW} height={VH - GY} fill={dawn ? "#4a4f6a" : "#1c2340"} />
      {(run || f >= S(1)) && <Person who="you" x={yx} y={run ? GY - Math.abs(Math.sin(f / 6)) * 14 : GY - jolt * 30 * (1 - tw(f, S(1) + 10, S(1) + 30))} pose={youPose} f={f} backpack={run} face={{ eyes: f < S(1) ? "closed" : run ? "tired" : "wide", mouth: f < S(1) ? "o" : run ? "chew" : "scream", brows: run ? "none" : "up", look: run ? 0.9 : 0, sweat: f > S(1) && !run }} />}
      {/* the anatomy page stuck to the face */}
      {f >= S(1) && !run && page + (1 - peel) > 0 && (
        <g transform={`translate(${yj.head[0] + peel * 120} ${yj.head[1] + 10 + peel * 300}) rotate(${-8 + peel * 80})`} opacity={1 - peel * 0.8}>
          <rect x={-58} y={-70} width={116} height={140} rx={4} fill="#fffbe9" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={-34} r={18} fill="none" stroke="#9aa6b5" strokeWidth={4} /><line x1={0} y1={-16} x2={0} y2={30} stroke="#9aa6b5" strokeWidth={4} />
          {[-4, 8, 20].map((y) => <path key={y} d={`M -26 ${y} Q 0 ${y + 8} 26 ${y}`} fill="none" stroke="#9aa6b5" strokeWidth={3} />)}
          <line x1={0} y1={30} x2={-18} y2={58} stroke="#9aa6b5" strokeWidth={4} /><line x1={0} y1={30} x2={18} y2={58} stroke="#9aa6b5" strokeWidth={4} />
        </g>
      )}
      {f > S(2) && !run && <Txt x={yj.head[0] + 160} y={yj.head[1] - 60} t="again…" k={pop(f, S(2) + 10, 12)} size={64} color="#fde68a" rot={8} />}
      {run && <Banhmi x={yj.handR[0] + 10} y={yj.handR[1] - 10} s={0.8} rot={-16} bites={Math.min(3, Math.floor((f - S(3)) / 28))} />}
      {/* POV tag and the time */}
      <g transform={`translate(70 150) scale(${pop(f, S(1) - 4, 14)}) rotate(-4)`}>
        <rect x={0} y={-62} width={210} height={92} rx={16} fill={RED} stroke={INK} strokeWidth={6} /><text x={105} y={10} textAnchor="middle" fontFamily={HAND} fontSize={72} fill="#fff">POV:</text>
      </g>
      <Txt x={760} y={180} t={run ? "5:20 AM" : "5:00 AM"} k={pop(f, S(0) - 6, 14)} size={110} color="#fff" outline={INK} />
    </g>
  );
};

/* ---------- 2. Hospital rounds ---------- */
export const Med2: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const turn = f >= S(2) + 8;
  const smart = P({ tilt: -10, aL: [-30, -60], aR: [100, 150], lean: -3 });
  const hide = P({ lean: -14, tilt: 8, aL: [-50, -110], aR: [20, 60], dx: -30 });
  const swear = P({ aR: [150, 178], aL: [40, 70], tilt: -6 });
  const youPose = alive(poseAt(f, [[0, STAND], [S(1), STAND], [S(1) + 14, smart], [S(1) + 60, smart], [S(1) + 76, hide], [S(2), hide], [S(2) + 14, P({ aL: [-150, -170], aR: [150, 170], dy: -10 })], [S(3), P({ aL: [-20, -40], aR: [20, 40] })], [S(6) - 4, P({ aL: [-20, -40], aR: [20, 40] })], [S(6) + 8, swear]]), f, 1);
  const docPose = alive(turn ? P({ aR: [94, 92], aL: [-30, -60] }) : P({ aR: [40, 120], aL: [-20, -50] }), f, 0.5);
  const yj = joints("dad", 560, GY, 1, youPose);
  const bang = pop(f, S(2) + 8, 12);
  const empty = f > S(4);
  const tumble = (f - S(4)) * 4;
  return (
    <g>
      <rect width={VW} height={VH} fill="#e3f1ee" />
      <rect x={0} y={GY - 560} width={VW} height={24} fill="#b6d7cf" />
      {[0, 1].map((i) => <g key={i}><rect x={80 + i * 560} y={GY - 520} width={280} height={520} rx={10} fill="#cfe5df" stroke={INK} strokeWidth={5} /><rect x={180 + i * 560} y={GY - 470} width={80} height={110} fill="#fff" stroke={INK} strokeWidth={4} /><path d={`M ${220 + i * 560} ${GY - 450} v 70 M ${185 + i * 560} ${GY - 415} h 70`} stroke={RED} strokeWidth={14} /></g>)}
      <Txt x={540} y={300} t="Ward 3" size={60} color="#4b6b63" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#bcd8d0" />
      <Person who="friend" x={300} y={GY} pose={alive(P({ aL: [20, 60], aR: [-10, -20] }), f, 0.8, 30)} f={f} face={{ eyes: "open", mouth: turn ? "o" : "flat", look: turn ? 0.9 : 0.6 }} />
      <Person who="you" x={560} y={GY} pose={youPose} f={f} face={{ eyes: f > S(2) + 8 && f < S(6) ? "wide" : "open", mouth: f > S(2) + 8 ? (f > S(6) ? "wavy" : "scream") : f > S(1) ? "smile" : "flat", brows: f > S(2) + 8 ? "up" : f > S(1) ? "stern" : "none", look: 0.8, sweat: f > S(2) + 8 }} />
      <Person who="doctor" x={860} y={GY} pose={docPose} f={f} flip={turn} face={{ eyes: "open", mouth: "flat", brows: "stern", look: turn ? 0.4 : 0.8 }} />
      {/* the chart in the doctor's hand */}
      <rect x={turn ? 760 : 900} y={GY - 520} width={70} height={90} rx={6} fill="#fef3c7" stroke={INK} strokeWidth={4} transform={`rotate(${turn ? -10 : 8} ${turn ? 795 : 935} ${GY - 475})`} />
      {/* "!" and the ding */}
      <g transform={`translate(${yj.head[0]} ${yj.head[1] - 150}) scale(${bang})`}>
        <rect x={-36} y={-110} width={72} height={140} rx={30} fill="#fde047" stroke={INK} strokeWidth={6} /><text x={0} y={10} textAnchor="middle" fontFamily={HAND} fontSize={140} fill={INK}>!</text>
      </g>
      {/* your brain? completely empty. */}
      <Bubble x={420} y={470} w={560} h={300} k={pop(f, S(3) - 2, 14) * tw(f, S(5) - 8, S(5) + 4, 1, 0)} tail="right" thought>
        {!empty ? (
          <g><path d="M -110 10 Q -120 -70 -40 -80 Q 0 -110 50 -80 Q 120 -70 112 10 Q 120 70 40 76 Q 0 96 -50 76 Q -120 70 -110 10 Z" fill="#fbcfe8" stroke={INK} strokeWidth={5} /><path d="M 0 -84 Q -14 -20 6 20 Q 14 50 0 80" fill="none" stroke={INK} strokeWidth={4} /></g>
        ) : (
          <g><line x1={-220} y1={80} x2={220} y2={80} stroke="#c8b48a" strokeWidth={5} /><g transform={`translate(${-220 + (tumble % 440)} ${60 - Math.abs(Math.sin(tumble / 30)) * 30}) rotate(${tumble * 3})`}><circle r={28} fill="none" stroke="#a16207" strokeWidth={4} /><path d="M -20 -10 L 20 10 M -10 20 L 10 -22 M -24 8 L 22 -8" stroke="#a16207" strokeWidth={3} /></g><text x={0} y={-10} textAnchor="middle" fontFamily={HAND} fontSize={70} fill="#9ca3af">. . .</text></g>
        )}
      </Bubble>
      {/* you knew this last night */}
      <Bubble x={300} y={430} w={420} h={260} k={pop(f, S(5) - 2, 14)} tail="right" thought>
        <rect x={-150} y={10} width={300} height={16} rx={5} fill="#c79a6b" stroke={INK} strokeWidth={3} /><circle cx={-100} cy={-40} r={50} fill="#fde68a" opacity={0.5} />
        <Person who="you" x={30} y={110} s={0.36} pose={P({ drop: 92, lL: [82, 6], lR: [72, 10], aL: [70, 120], aR: [80, 130] })} f={f} face={{ eyes: "open", mouth: "smile", look: -0.6 }} />
        <text x={-60} y={-20} textAnchor="middle" fontFamily={HAND} fontSize={60} fill="#22c55e">✓</text>
      </Bubble>
      {f > S(6) && <Txt x={yj.handR[0] + 120} y={yj.handR[1] - 20} t="I swear!" k={pop(f, S(6) + 6, 12)} size={66} color={RED} rot={-6} />}
    </g>
  );
};

/* ---------- 3. Lecture hall, then the library ---------- */
export const Med3: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const lib = f >= S(2) - 6;
  const slide = Math.max(1, Math.min(247, Math.round(1 + 246 * tw(f, S(0) + 10, S(1) + 60, 0, 1, (t) => t * t))));
  const write = P({ ...SIT, aR: [54, 92 + Math.sin(f * 1.3) * 10], aL: [46, 88], lean: -6, tilt: -6 });
  const youLecture = alive(write, f, 0.6);
  // library: sit up at the desk, one hand on the open book, the other propping up a heavy head; then head in both hands
  const LSIT = P({ drop: 46, lL: [86, 4], lR: [80, 8] });
  const youLib = alive(mix(P({ ...LSIT, aL: [52, 92 + Math.sin(f / 9) * 4], aR: [36, 196], lean: -6, tilt: -10 }), P({ ...LSIT, aL: [26, 200], aR: [40, 192], lean: -10, tilt: -16 }), tw(f, S(3), S(3) + 14)), f, 0.6);
  const yj = joints("dad", 380, GY, 1, lib ? youLib : youLecture);
  return lib ? (
    <g>
      <rect width={VW} height={VH} fill="#3a2f45" />
      <rect x={0} y={GY - 700} width={VW} height={560} fill="#4a3c58" />
      {[0, 1, 2].map((r) => Array.from({ length: 9 }).map((_, i) => <rect key={`${r}${i}`} x={40 + i * 112} y={GY - 680 + r * 180} width={90} height={150} rx={6} fill={["#7c3aed", "#b45309", "#0f766e", "#be123c"][(i + r) % 4]} opacity={0.55} />))}
      <circle cx={710} cy={GY - 380} r={300} fill="#fde68a" opacity={0.18} />
      <g transform="translate(860 430)"><circle r={78} fill="#fff" stroke={INK} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-54} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 14})`} /><line x1={0} y1={0} x2={36} y2={0} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${f * 1.2})`} /></g>
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#2c2335" />
      <Stool x={380} />
      <Person who="you" x={380} y={GY} pose={youLib} f={f} face={{ eyes: f < S(3) ? "tired" : "sad", mouth: f < S(3) ? "flat" : "frown", brows: f < S(3) ? "none" : "worried", look: f < S(3) ? 0.6 : -0.3 }} />
      <Desk x={420} w={560} color="#a0764c" />
      <line x1={710} y1={GY - 230} x2={710} y2={GY - 360} stroke={INK} strokeWidth={7} /><path d={`M 660 ${GY - 360} L 680 ${GY - 420} L 740 ${GY - 420} L 760 ${GY - 360} Z`} fill="#fbbf24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path transform={`translate(555 ${GY - 230})`} d="M -120 0 L -8 -16 L 0 0 Z M 0 0 L 8 -16 L 120 0 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {/* the pile of books, taller than you */}
      {Array.from({ length: 16 }).map((_, i) => <Book key={i} x={880 + ((i * 37) % 30) - 15} y={GY - 230 - i * 44 * pop(f, S(2) - 6 + i * 3, 10)} w={180 - (i % 4) * 14} h={42} color={["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"][i % 5]} rot={((i * 13) % 7) - 3} />)}
      {f > S(3) && <Bubble x={300} y={560} w={440} h={210} k={pop(f, S(3) + 6, 14)} tail="right" thought><text x={0} y={-6} textAnchor="middle" fontFamily={HAND} fontSize={48} fill={INK}>why did I</text><text x={0} y={52} textAnchor="middle" fontFamily={HAND} fontSize={48} fill={INK}>choose this?</text></Bubble>}
      <Txt x={540} y={200} t="9:30 PM · Library" size={84} color="#fde68a" outline={INK} />
    </g>
  ) : (
    <g>
      <rect width={VW} height={VH} fill="#eef0f6" />
      {/* the projector screen */}
      <rect x={140} y={260} width={800} height={470} rx={10} fill="#fff" stroke={INK} strokeWidth={7} />
      <rect x={190} y={320} width={430} height={34} rx={6} fill="#c7d2fe" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={190} y={384 + i * 50} width={300 + ((i * 97 + slide * 13) % 300)} height={20} rx={6} fill="#e5e7eb" />)}
      <g transform={`translate(840 690)`}><rect x={-120} y={-56} width={240} height={80} rx={14} fill={slide > 200 ? RED : INK} /><text x={0} y={6} textAnchor="middle" fontFamily={HAND} fontSize={60} fill="#fff">{slide}/247</text></g>
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#c9cede" />
      <Stool x={380} />
      <Person who="you" x={380} y={GY} pose={youLecture} f={f} face={{ eyes: "wide", mouth: "wavy", brows: "worried", look: 0.6, sweat: true }} />
      {/* your friend: four coffees, still asleep */}
      <Stool x={820} />
      <Person who="friend" x={820} y={GY} pose={alive(P({ drop: 108, tilt: 24, lL: [100, 0], lR: [96, 4], aL: [-128, 96], aR: [128, -96] }), f, 0.4, 11)} f={f} flip face={{ eyes: "closed", mouth: "o" }} />
      <Desk x={300} w={700} />
      <rect x={480} y={GY - 252} width={200} height={20} rx={3} fill="#fff" stroke={INK} strokeWidth={3} transform={`rotate(-4 580 ${GY - 242})`} />
      {[0, 1, 2].map((i) => { const t = ((f + i * 12) % 36) / 36; return <circle key={i} cx={yj.handR[0] + 10 + t * 30} cy={yj.handR[1] - 30 - t * 70} r={10 + t * 14} fill="#9ca3af" opacity={0.6 * (1 - t)} />; })}
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${640 + i * 62} ${GY - 230}) scale(${pop(f, S(1) + 4 + i * 8, 10)})`}><path d="M -22 -60 L 22 -60 L 16 0 L -16 0 Z" fill="#fff" stroke={INK} strokeWidth={4} /><rect x={-24} y={-70} width={48} height={12} rx={4} fill="#7c4a2d" stroke={INK} strokeWidth={3} /><rect x={-19} y={-42} width={38} height={14} fill="#a16207" /></g>)}
      {f > S(1) && [0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={860 + t * 60} y={GY - 520 - t * 110} fontFamily={HAND} fontSize={50 + t * 30} fill="#6b7280" opacity={1 - t}>z</text>; })}
      <Txt x={540} y={180} t="2:00 PM · Lecture" size={84} color="#fff" outline={INK} />
    </g>
  );
};
