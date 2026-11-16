// Scenes 4–6 of "POV: A Day in the Life of an IT Student" — native 9:16 (1080x1920).
import React from "react";
import { useCurrentFrame } from "remotion";
import { alive, mix, P, pop, tw, walk } from "../Kids/rig";
import { Bubble, Star } from "../Kids/stage";
import { cue, Desk, HAND, pulse, Stool, Txt, VH, VW, GY } from "../Med/scenes";
import { INK, Person, RED } from "./people";
import { Editor, GREEN, Laptop, MONO, SIT, typing, type SP } from "./scenes";

const Avatar: React.FC<{ x: number; y: number; r?: number; c: string; k?: number }> = ({ x, y, r = 26, c, k = 1 }) =>
  k <= 0 ? null : <g transform={`translate(${x} ${y}) scale(${k})`}><circle r={r} fill={c} stroke={INK} strokeWidth={3} /><circle cy={-r * 0.2} r={r * 0.32} fill="#fff" opacity={0.85} /><path d={`M ${-r * 0.55} ${r * 0.62} Q 0 ${r * 0.05} ${r * 0.55} ${r * 0.62}`} fill="#fff" opacity={0.85} /></g>;
const MATES = ["#f59e0b", "#a78bfa", "#34d399", "#f472b6"];

/* ---------- 4. The group project ---------- */
export const IT4: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const night = f >= S(5) - 6;
  const clones = ["Code", "Slides", "Report", "Demo", "Leader"];
  if (!night) {
    const hour = Math.floor(tw(f, S(3), S(5), 21, 25.9));
    const sent = pop(f, S(2) + 10, 12);
    const seen = tw(f, S(3), S(3) + 40);
    const tumble = tw(f, S(4) + 10, S(5) - 6, 0, 1, (t) => t);
    return (
      <g>
        <rect width={VW} height={VH} fill="#dbeafe" />
        <rect x={0} y={GY} width={VW} height={VH - GY} fill="#bfdbfe" />
        {/* the phone */}
        <rect x={170} y={130} width={740} height={1090} rx={70} fill="#111827" />
        <rect x={196} y={156} width={688} height={1038} rx={50} fill="#f8fafc" />
        <rect x={196} y={156} width={688} height={190} rx={50} fill="#e2e8f0" /><rect x={196} y={290} width={688} height={56} fill="#e2e8f0" />
        <text x={250} y={210} fontFamily={MONO} fontSize={28} fill="#475569">{`${(hour % 24).toString().padStart(2, "0")}:${hour === 21 ? "05" : "59"}`}</text>
        <text x={540} y={250} textAnchor="middle" fontFamily={HAND} fontSize={56} fill={INK}>Group Project (5)</text>
        {[...MATES, "#4f6d9a"].map((c, i) => <Avatar key={i} x={396 + i * 72} y={306} r={26} c={c} />)}
        <Bubble x={560} y={480} w={420} h={100} tail="none"><text x={0} y={14} textAnchor="middle" fontFamily={HAND} fontSize={40} fill="#64748b">Deadline: Friday</text></Bubble>
        {/* your message */}
        <g transform={`translate(640 640) scale(${sent})`}>
          <rect x={-220} y={-56} width={440} height={112} rx={44} fill="#3b82f6" />
          <text x={0} y={16} textAnchor="middle" fontFamily={HAND} fontSize={50} fill="#fff">Who's doing what?</text>
        </g>
        {seen > 0 && <g>
          <text x={860} y={740} textAnchor="end" fontFamily={HAND} fontSize={36} fill="#64748b" opacity={seen}>Seen by 4</text>
          {MATES.map((c, i) => <Avatar key={i} x={600 + i * 46} y={790} r={18} c={c} k={pop(f, S(3) + 6 + i * 6, 10)} />)}
        </g>}
        {/* nobody replies: a tumbleweed rolls through the chat */}
        {f > S(4) && <g transform={`translate(${-80 + tumble * 1240} ${980 - Math.abs(Math.sin(tumble * 18)) * 50}) rotate(${tumble * 900})`}>
          <circle r={50} fill="none" stroke="#a16207" strokeWidth={6} /><path d="M -40 -20 Q 0 30 40 -20 M -30 30 Q 0 -30 30 30 M -48 6 L 48 -6" fill="none" stroke="#a16207" strokeWidth={5} />
        </g>}
        {f > S(4) && <Txt x={540} y={900} t="0 replies" size={70} color="#94a3b8" k={pop(f, S(4) + 4, 12)} />}
        <rect x={230} y={1090} width={560} height={70} rx={35} fill="#fff" stroke="#cbd5e1" strokeWidth={4} /><text x={270} y={1136} fontFamily={HAND} fontSize={36} fill="#94a3b8">Message...</text>
      </g>
    );
  }
  // 2 a.m.: just you, then you are all five
  const split = tw(f, S(6) - 4, S(6) + 26);
  return (
    <g>
      <rect width={VW} height={VH} fill="#1e1b3a" />
      <rect x={720} y={240} width={240} height={240} rx={8} fill="#312e81" stroke={INK} strokeWidth={8} /><path d="M 880 300 A 40 40 0 1 0 900 380 A 30 30 0 1 1 880 300 Z" fill="#fde68a" />
      {[0, 1, 2].map((i) => <Star key={i} x={760 + i * 50} y={420 - (i % 2) * 70} s={0.4} fill="#fff" rot={i * 20} />)}
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#171531" />
      <Txt x={540} y={150} t="2:00 AM" size={96} color="#fde68a" outline={INK} />
      {split < 0.05 ? (
        <g>
          <Stool x={330} />
          <Person who="you" x={330} y={GY} pose={alive(P({ ...SIT, ...typing(f) }), f, 0.6)} f={f} face={{ eyes: "tired", mouth: "flat", look: 0.7 }} />
          <Desk x={390} w={560} />
          <Laptop x={650} y={GY - 230} f={f} mode="code" s={0.95} />
        </g>
      ) : (
        clones.map((lab, i) => {
          const k = pop(f, S(6) - 4 + i * 5, 12);
          const x = 540 + (i - 2) * 200 * split;
          return (
            <g key={lab} opacity={Math.min(1, k * 1.4)}>
              <Person who="you" x={x} y={GY} s={0.82} pose={alive(P({ aL: [-20 - i * 4, -10], aR: [i % 2 ? 150 : 24, i % 2 ? 170 : 14] }), f, 0.8, i * 13)} f={f} face={{ eyes: "tired", mouth: i === 4 ? "smile" : "flat", look: 0 }} />
              <g transform={`translate(${x} ${GY - 450}) scale(${k})`}><rect x={-82} y={-36} width={164} height={60} rx={14} fill={["#3b82f6", "#f59e0b", "#22c55e", "#ec4899", RED][i]} stroke={INK} strokeWidth={4} /><text y={8} textAnchor="middle" fontFamily={HAND} fontSize={40} fill="#fff">{lab}</text></g>
            </g>
          );
        })
      )}
      {split > 0.5 && <Txt x={540} y={GY - 640} t="the group." size={96} color="#fff" outline={INK} k={pop(f, S(6) + 30, 14)} rot={-3} />}
    </g>
  );
};

const Firework: React.FC<{ x: number; y: number; t: number; c: string }> = ({ x, y, t, c }) =>
  t <= 0 || t >= 1 ? null : (
    <g transform={`translate(${x} ${y})`} opacity={1 - t * t}>
      {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2, r0 = 30 + t * 120, r1 = 60 + t * 170; return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={c} strokeWidth={9} strokeLinecap="round" />; })}
    </g>
  );

/* ---------- 5. The miracle at 3 a.m. ---------- */
export const IT5: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const run = pulse(f, S(2) + 18, 12);
  const ok = f >= S(3);
  const hop = ok && f < S(4) ? Math.abs(Math.sin((f - S(3)) / 6)) : 0;
  const freeze = tw(f, S(4), S(4) + 6);
  const back = tw(f, S(5), S(6) + 10);
  const handsOff = tw(f, S(1), S(1) + 10) * (1 - tw(f, S(2), S(2) + 8));
  const seat = P({ ...SIT, ...typing(f, f < S(1) ? 1 : 0) });
  const standJump = P({ aL: [-150, -170], aR: [150, 170], tilt: -6, dy: -hop * 60 });
  const standBack = P({ aL: [-60, -150], aR: [60, 150], lean: 6 });
  let pose = mix(seat, P({ ...SIT, aL: [-30, -150], aR: [30, 150] }), handsOff);
  if (ok) pose = mix(mix(standJump, P({ aL: [-20, -10], aR: [20, 10] }), freeze), standBack, tw(f, S(5), S(5) + 10));
  const x = 300 - back * 170;
  const tape = pop(f, S(6), 12);
  return (
    <g>
      <rect width={VW} height={VH} fill="#151a2e" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#10142a" />
      <Editor f={f} errors={1} run={run} state={ok ? "ok" : "error"} flood={0} title="final_v3_REAL.py" />
      {ok && f < S(5) && [[220, 330, "#f472b6", 0], [860, 300, "#fde047", 6], [540, 220, "#60a5fa", 12], [300, 600, "#4ade80", 18], [800, 620, "#fb923c", 24]].map(([fx, fy, c, d], i) => <Firework key={i} x={fx as number} y={fy as number} t={((f - S(3) - (d as number)) % 40) / 40 * (f - S(3) - (d as number) > 0 ? 1 : 0)} c={c as string} />)}
      {ok && <Txt x={540} y={540} t="IT WORKS?!" size={120} color="#4ade80" outline={INK} k={pop(f, S(3) + 4, 12) * (1 - freeze * 0.999)} rot={-4} />}
      {!ok && <Stool x={300} />}
      {ok && <Stool x={300} />}
      <Person who="you" x={ok ? x : 300} y={GY} pose={alive(pose, f, 0.6)} f={f} face={{ eyes: ok ? (freeze > 0.5 ? "wide" : "happy") : "tired", mouth: ok ? (freeze > 0.5 ? "flat" : "grin") : "flat", brows: freeze > 0.5 ? "up" : "none", look: back > 0 ? 0.9 : 0.7 }} />
      {!ok && <Desk x={360} w={640} />}
      {!ok && <rect x={470} y={GY - 250} width={240} height={20} rx={6} fill="#475569" stroke={INK} strokeWidth={4} />}
      {ok && <><Desk x={360} w={640} /><rect x={470} y={GY - 250} width={240} height={20} rx={6} fill="#475569" stroke={INK} strokeWidth={4} /></>}
      {freeze > 0 && f < S(6) + 30 && <Txt x={x + 130} y={GY - 210} t="?" size={170} color="#fde68a" outline={INK} k={pop(f, S(4) + 2, 12)} />}
      {/* never touch it again */}
      {tape > 0 && <g transform={`translate(540 520) rotate(-12) scale(${tape})`}>
        {[-1, 1].map((sd) => <g key={sd} transform={`translate(0 ${sd * 150}) rotate(${sd * 20})`}>
          <rect x={-560} y={-40} width={1120} height={80} fill="#facc15" stroke={INK} strokeWidth={5} />
          {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-560 + i * 70} 40 l 34 -80 l 26 0 l -34 80 Z`} fill={INK} opacity={0.85} />)}
          <rect x={-250} y={-30} width={500} height={60} rx={8} fill="#facc15" /><text y={18} textAnchor="middle" fontFamily={MONO} fontWeight={900} fontSize={46} fill={INK}>DO NOT TOUCH</text>
        </g>)}
      </g>}
      <Txt x={540} y={110} t="3:00 AM" size={84} color="#fde68a" outline={INK} />
    </g>
  );
};

const Printer: React.FC<{ x: number; y: number; f: number; eyes: number; grind: number; s?: number }> = ({ x, y, f, eyes, grind, s = 1 }) => {
  const jig = grind > 0 ? Math.sin(f * 3.1) * 4 * grind : 0;
  const blink = (f % 70) < 4;
  return (
    <g transform={`translate(${x + jig} ${y}) scale(${s})`}>
      <rect x={-130} y={-190} width={260} height={50} rx={10} fill="#e2e8f0" stroke={INK} strokeWidth={6} />
      <rect x={-100} y={-210} width={200} height={30} fill="#fff" stroke={INK} strokeWidth={4} />
      <rect x={-160} y={-150} width={320} height={150} rx={18} fill="#cbd5e1" stroke={INK} strokeWidth={6} />
      <rect x={-110} y={-62} width={220} height={22} rx={6} fill={INK} />
      <circle cx={120} cy={-118} r={10} fill={grind > 0 ? (Math.floor(f / 6) % 2 ? RED : "#fca5a5") : GREEN} stroke={INK} strokeWidth={3} />
      {eyes > 0 && [-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 56} -102) scale(${eyes})`}>{blink ? <line x1={-22} y1={0} x2={22} y2={0} stroke={INK} strokeWidth={7} strokeLinecap="round" /> : <><circle r={24} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={-sd * 6} r={10} fill={INK} /></>}</g>)}
      {eyes > 0 && <path d="M -80 -134 L -30 -122 M 80 -134 L 30 -122" stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={eyes} />}
      {grind > 0 && <path d={`M -60 -40 l 0 ${30 + grind * 30} l 20 -10 l 20 14 l 20 -12 l 20 12 l 20 -10 l 0 ${-30 - grind * 30}`} fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
    </g>
  );
};

/* ---------- 6. The printer ---------- */
export const IT6: React.FC<SP & { hold: number }> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const walkIn = tw(f, 0, S(0) + 40, 0, 1, (t) => t);
  const momX = 1180 - walkIn * 380;
  const handed = tw(f, S(1) - 10, S(1) + 14);
  const card = f >= S(5) - 4;
  const stare = tw(f, S(3), S(3) + 20);
  const grind = f > S(4) + 6 ? Math.min(1, (f - S(4) - 6) / 10) : 0;
  const momPose = walkIn < 1 ? mix(walk(f, 22, 0.8), P({ aL: [-100, -96], aR: [100, 96] }), 0.7) : mix(P({ aL: [-100, -96], aR: [100, 96] }), P({ aL: [-40, 60], aR: [40, -60] }), handed);
  const youPose = mix(P({ aL: [-14, -6], aR: [14, 6], tilt: -4 }), P({ aL: [-20, -60], aR: [60, 110], lean: -8, tilt: -8 }), stare);
  // printer: carried in by mom, then on the little table between you two
  const px = handed < 1 ? momX - 120 : 540, py = handed < 1 ? GY - 280 : GY - 210;
  return (
    <g>
      <rect width={VW} height={VH} fill="#fdf2e3" />
      <rect x={80} y={240} width={300} height={340} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={8} /><line x1={230} y1={240} x2={230} y2={580} stroke={INK} strokeWidth={6} /><line x1={80} y1={410} x2={380} y2={410} stroke={INK} strokeWidth={6} />
      <circle cx={320} cy={300} r={40} fill="#fde047" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#e7d2b4" />
      <Txt x={760} y={170} t="next morning" size={70} color={INK} rot={-3} />
      {/* the little table */}
      {handed >= 1 && <g><rect x={420} y={GY - 210} width={240} height={22} rx={6} fill="#a16207" stroke={INK} strokeWidth={5} /><line x1={450} y1={GY - 188} x2={450} y2={GY} stroke={INK} strokeWidth={9} /><line x1={630} y1={GY - 188} x2={630} y2={GY} stroke={INK} strokeWidth={9} /></g>}
      <Person who="you" x={260} y={GY} pose={alive(youPose, f, 0.7)} f={f} face={{ eyes: stare > 0.5 ? "open" : "tired", mouth: "flat", brows: stare > 0.5 ? "stern" : "none", look: 0.9 }} />
      <Person who="mom" x={handed >= 1 ? 860 : momX} y={GY} pose={alive(momPose, f, 0.6, 9)} f={f} flip face={{ eyes: "happy", mouth: "smile", look: 0.6 }} />
      <Printer x={px} y={py} f={f} eyes={tw(f, S(4), S(4) + 10)} grind={grind} s={handed < 1 ? 0.6 : 0.62 + 0.12 * stare} />
      <Bubble x={760} y={700} w={500} h={170} k={pop(f, S(1), 12) * (1 - tw(f, S(3) - 6, S(3)))} tail="right">
        <text x={0} y={18} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={INK}>{f < S(2) ? "You study IT, right?" : "Fix it."}</text>
      </Bubble>
      {f > S(3) && f < S(5) && [-1, 1].map((sd) => <path key={sd} d={`M ${540 + sd * 90} ${GY - 520} l ${-sd * 30} 30 M ${540 + sd * 110} ${GY - 490} l ${-sd * 40} 10`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
      {card && <g transform={`translate(540 520) scale(${pop(f, S(5) - 4, 16)}) rotate(-2)`}>
        <rect x={-470} y={-230} width={940} height={460} rx={34} fill="#fffdf5" stroke={INK} strokeWidth={8} />
        <text x={0} y={-120} textAnchor="middle" fontFamily={HAND} fontSize={68} fill={INK}>IT students:</text>
        <text x={0} y={-30} textAnchor="middle" fontFamily={HAND} fontSize={72} fill={RED}>we fix bugs,</text>
        <text x={0} y={60} textAnchor="middle" fontFamily={HAND} fontSize={72} fill={RED}>not printers.</text>
        <g opacity={tw(f, S(6) - 10, S(6) + 10)}>
          <line x1={-300} y1={100} x2={300} y2={100} stroke="#e5e7eb" strokeWidth={4} />
          <text x={0} y={150} textAnchor="middle" fontFamily={HAND} fontSize={42} fill="#475569">To every IT student: keep debugging.</text>
          <text x={0} y={200} textAnchor="middle" fontFamily={HAND} fontSize={46} fill={GREEN}>You've got this.</text>
        </g>
      </g>}
      {grind > 0 && !card && <Txt x={540} y={GY - 560} t="*grrrk*" size={64} color="#64748b" rot={4} />}
    </g>
  );
};
