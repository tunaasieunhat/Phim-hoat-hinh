// Scenes 4–6: the memory of bed twelve, turning the page, walking home under the stars.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alive, mix, P, pop, tw, walk } from "../Kids/rig";
import { Bubble, Heart, Star } from "../Kids/stage";
import { Book, cue, Desk, GY, HAND, type SP, Stool, Txt, VH, VW } from "./scenes";
import { INK, joints, Person, RED } from "./people";

const SIT = P({ drop: 92, lL: [82, 6], lR: [72, 10], aL: [30, 70], aR: [40, 80] });

/* ---------- 4. The moment that changes things ---------- */
export const Med4: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const drink = tw(f, S(2) + 40, S(2) + 70) * tw(f, S(3) - 10, S(3) + 10, 1, 0);
  const hold = tw(f, S(3) + 10, S(3) + 40);
  const blush = f > S(4);
  const youPose = alive(mix(mix(P({ ...SIT, aL: [40, 80], aR: [60, 96], lean: 6 }), P({ ...SIT, aL: [40, 80], aR: [96, 118], lean: 14 }), drink), P({ ...SIT, aL: [40, 80], aR: [86, 98], lean: 10, tilt: blush ? -8 : 0 }), hold), f, 0.6);
  const yj = joints("dad", 300, GY, 1, youPose);
  // grandma sits up in bed (her hips on the mattress at x 640)
  const gPose = alive(P({ drop: 150, lL: [86, 10], lR: [84, 12], lean: -8, aL: [-30, 20], aR: [mix(P({ aR: [-60, -20] }), P({ aR: [-90, -100] }), hold).aR[0], mix(P({ aR: [-60, -20] }), P({ aR: [-90, -100] }), hold).aR[1]], tilt: -6 }), f, 0.5, 23);
  const gj = joints("dad", 640, GY - 210, 0.92, gPose, true);
  const story = Math.floor(Math.max(0, f - S(2) - 4) / 34) % 3;
  const cup: [number, number] = [yj.handR[0] + 6, yj.handR[1] - 20];
  return (
    <g>
      <rect width={VW} height={VH} fill="#f6ead8" />
      <rect x={0} y={GY - 640} width={VW} height={30} fill="#e8d3b5" />
      <rect x={740} y={250} width={220} height={220} rx={10} fill="#bfe3f5" stroke={INK} strokeWidth={7} />
      <circle cx={810} cy={320} r={36} fill="#fde68a" /><line x1={850} y1={250} x2={850} y2={470} stroke={INK} strokeWidth={5} /><line x1={740} y1={360} x2={960} y2={360} stroke={INK} strokeWidth={5} />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#e2cfb3" />
      {/* the bed and its number */}
      <rect x={470} y={GY - 280} width={30} height={280} rx={8} fill="#cbd5e1" stroke={INK} strokeWidth={5} />
      <rect x={480} y={GY - 200} width={520} height={60} rx={14} fill="#fff" stroke={INK} strokeWidth={5} />
      <line x1={510} y1={GY - 140} x2={510} y2={GY} stroke={INK} strokeWidth={8} /><line x1={970} y1={GY - 140} x2={970} y2={GY} stroke={INK} strokeWidth={8} />
      <g transform={`translate(560 ${GY - 330})`}><rect x={-46} y={-40} width={92} height={70} rx={10} fill="#fff" stroke={INK} strokeWidth={5} /><text x={0} y={18} textAnchor="middle" fontFamily={HAND} fontSize={56} fill={RED}>12</text></g>
      <rect x={520} y={GY - 250} width={130} height={56} rx={22} fill="#fff" stroke={INK} strokeWidth={5} />
      <Person who="grandma" x={640} y={GY - 210} s={1} pose={gPose} f={f} flip face={{ eyes: hold > 0.4 ? "happy" : "open", mouth: f > S(2) && f < S(3) ? (Math.floor(f / 6) % 2 ? "o" : "smile") : "smile", look: 0.8, blush: true }} />
      <path d={`M 600 ${GY - 196} Q 780 ${GY - 236} 990 ${GY - 196} L 990 ${GY - 150} L 600 ${GY - 150} Z`} fill="#c7d2fe" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <Stool x={300} />
      <Person who="you" x={300} y={GY} pose={youPose} f={f} face={{ eyes: hold > 0.4 ? "happy" : "open", mouth: "smile", look: 0.7, blush }} />
      {/* the water cup */}
      <g transform={`translate(${cup[0]} ${cup[1]})`}><path d="M -18 -34 L 18 -34 L 14 10 L -14 10 Z" fill="#dbeafe" stroke={INK} strokeWidth={4} /><rect x={-15} y={-20} width={30} height={26} fill="#93c5fd" opacity={0.8} /></g>
      {/* her stories */}
      {f > S(2) && f < S(3) + 10 && (
        <Bubble x={810} y={720} w={300} h={180} k={pop(f, S(2) + 4, 12)} tail="left">
          {story === 0 && <g><path d="M -50 30 L -50 -10 L 0 -50 L 50 -10 L 50 30 Z" fill="#fca5a5" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><rect x={-12} y={0} width={24} height={30} fill="#fff" stroke={INK} strokeWidth={3} /></g>}
          {story === 1 && <g>{[0, 1, 2].map((i) => <path key={i} d={`M ${-70 + i * 50} 40 q 10 -50 22 -70`} fill="none" stroke="#65a30d" strokeWidth={6} strokeLinecap="round" />)}<circle cx={70} cy={-40} r={24} fill="#fbbf24" /></g>}
          {story === 2 && <g>{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 26} cy={Math.sin((a * Math.PI) / 180) * 26} r={20} fill="#f9a8d4" stroke={INK} strokeWidth={3} />)}<circle r={14} fill="#fde047" stroke={INK} strokeWidth={3} /></g>}
        </Bubble>
      )}
      {/* "Thank you, little doctor." */}
      <Heart x={(yj.handR[0] + gj.handR[0]) / 2} y={GY - 520 - Math.sin(f / 10) * 10} s={pop(f, S(3) + 40, 16) * 1.7} fill="#fb7185" />
      <Txt x={520} y={GY - 640} t={'"Thank you, little doctor."'} k={pop(f, S(3) + 60, 16)} size={66} color="#9a3412" rot={-3} />
      {blush && [0, 1, 2, 3].map((i) => <Star key={i} x={180 + i * 110} y={GY - 560 - (i % 2) * 60 + Math.sin(f / 8 + i) * 10} s={pop(f, S(4) + 20 + i * 8) * 1.1} fill="#fbbf24" rot={f * 2} />)}
      {/* a warm memory: sepia vignette and the tag */}
      <rect width={VW} height={VH} fill="#b45309" opacity={0.07} />
      <g transform={`translate(70 180) scale(${pop(f, 6, 14)}) rotate(-4)`}><rect x={0} y={-60} width={360} height={90} rx={18} fill="#fff7ed" stroke={INK} strokeWidth={5} /><text x={180} y={8} textAnchor="middle" fontFamily={HAND} fontSize={60} fill="#9a3412">this morning…</text></g>
    </g>
  );
};

/* ---------- 5. Turning the page ---------- */
export const Med5: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const flip = tw(f, S(0) + 20, S(0) + 44);
  const warm = tw(f, S(0), S(1) + 60);
  const youPose = alive(P({ drop: 92, lL: [82, 6], lR: [72, 10], aL: [60, 120], aR: [mix(P({ aR: [70, 126] }), P({ aR: [110, 140] }), Math.sin(flip * Math.PI)).aR[0], 130], lean: 8, tilt: 6 }), f, 0.6);
  const bx = 640, by = GY - 236;
  return (
    <g>
      <rect width={VW} height={VH} fill="#3a2f45" />
      <rect x={0} y={GY - 700} width={VW} height={560} fill="#4a3c58" />
      {[0, 1, 2].map((r) => Array.from({ length: 9 }).map((_, i) => <rect key={`${r}${i}`} x={40 + i * 112} y={GY - 680 + r * 180} width={90} height={150} rx={6} fill={["#7c3aed", "#b45309", "#0f766e", "#be123c"][(i + r) % 4]} opacity={0.55} />))}
      <circle cx={480} cy={GY - 360} r={300 + warm * 200} fill="#fde68a" opacity={0.18 + warm * 0.22} />
      <rect width={VW} height={VH} fill="#fbbf24" opacity={warm * 0.1} />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#2c2335" />
      <Stool x={380} />
      <Person who="you" x={380} y={GY} pose={youPose} f={f} face={{ eyes: "happy", mouth: "smile", look: 0.6 }} />
      <Desk x={420} w={560} color="#a0764c" />
      <line x1={480} y1={GY - 230} x2={480} y2={GY - 360} stroke={INK} strokeWidth={7} /><path d={`M 430 ${GY - 360} L 450 ${GY - 420} L 520 ${GY - 420} L 540 ${GY - 360} Z`} fill="#fbbf24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {Array.from({ length: 10 }).map((_, i) => <Book key={i} x={880} y={GY - 230 - i * 44} w={170} h={42} color={["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"][i % 5]} rot={((i * 13) % 7) - 3} />)}
      {/* the open book; a page turns */}
      <g transform={`translate(${bx} ${by})`}>
        <path d="M -150 0 L -10 -20 L 0 0 Z M 0 0 L 10 -20 L 150 0 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <line key={i} x1={-130 + i * 8} y1={-6 - i * 4} x2={-40} y2={-14 - i * 4} stroke="#cbd5e1" strokeWidth={3} />)}
        {flip > 0 && flip < 1 && <path d={`M 0 0 L ${150 * Math.cos(flip * Math.PI)} ${-(20 + 70 * Math.sin(flip * Math.PI))} L ${10 * Math.cos(flip * Math.PI)} -20 Z`} fill="#fffbeb" stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
      </g>
      {/* someone like her will need you */}
      <Bubble x={720} y={520} w={340} h={230} k={pop(f, S(1) + 50, 16)} tail="left" thought>
        <Person who="grandma" x={-40} y={130} s={0.38} pose={P({ aL: [-30, -40], aR: [40, 60] })} f={f} face={{ eyes: "happy", mouth: "smile", blush: true }} />
        <Heart x={80} y={-20} s={0.7} fill="#fb7185" />
      </Bubble>
      <Txt x={540} y={200} t="10:45 PM" size={90} color="#fde68a" outline={INK} />
    </g>
  );
};

/* ---------- 6. Walking home under the stars ---------- */
export const Med6: React.FC<SP & { hold: number }> = ({ sc, hold }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const lookUp = tw(f, S(2), S(2) + 30);
  const stopped = f > S(2) + 30;
  const youPose = stopped ? alive(P({ tilt: -26 * lookUp, lean: -4, aL: [-20, -10], aR: [20, 10] }), f, 0.8) : mix(walk(f, 24, 0.9), P({ tilt: -20 }), lookUp);
  const x = 160 + Math.min(f, S(2) + 30) * 1.0;
  const card = f > S(3) - 4;
  const shoot = tw(f, S(2) + 40, S(2) + 70);
  return (
    <g>
      <defs><linearGradient id="m6sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f172a" /><stop offset="0.7" stopColor="#1e3a8a" /><stop offset="1" stopColor="#4c4f9a" /></linearGradient></defs>
      <rect width={VW} height={VH} fill="url(#m6sky)" />
      {Array.from({ length: 34 }).map((_, i) => <Star key={i} x={(i * 197) % 1040 + 20} y={(i * 131) % 820 + 80} s={(0.3 + ((i * 7) % 5) * 0.12) * (1 + lookUp * 0.5) * (0.7 + 0.3 * Math.sin(f / 7 + i))} fill="#fff" rot={i * 10} />)}
      <path transform="translate(860 300)" d="M 18 -56 A 60 60 0 1 0 56 30 A 44 44 0 1 1 18 -56 Z" fill="#fde68a" />
      {shoot > 0 && shoot < 1 && <line x1={200 + shoot * 500} y1={160 + shoot * 200} x2={120 + shoot * 500} y2={130 + shoot * 200} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={1 - shoot} />}
      {[0, 1, 2, 3].map((i) => <g key={i}><rect x={i * 280 - 20} y={GY - 300 - (i % 2) * 120} width={240} height={420} fill="#1f2547" />{[0, 1].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={i * 280 + 10 + c * 70} y={GY - 260 - (i % 2) * 120 + r * 90} width={40} height={50} fill={(i + r + c) % 2 ? "#fde68a" : "#2b3270"} opacity={0.8} />))}</g>)}
      <line x1={760} y1={GY} x2={760} y2={GY - 470} stroke="#111827" strokeWidth={10} /><circle cx={760} cy={GY - 480} r={22} fill="#fde68a" /><circle cx={760} cy={GY - 480} r={110} fill="#fde68a" opacity={0.15} />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#1c1f3a" />
      <Person who="you" x={x} y={GY} pose={youPose} f={f} backpack face={{ eyes: stopped ? "happy" : "tired", mouth: stopped ? "smile" : "flat", look: 0.6 }} />
      {f > S(1) && f < S(2) && <g transform={`translate(${x + 120} ${GY - 520})`} opacity={tw(f, S(1), S(1) + 10)}><Txt x={0} y={0} t="grrr…" size={50} color="#c7d2fe" rot={-6} /></g>}
      <Txt x={540} y={200} t="12:00 AM" size={90} color="#fde68a" outline={INK} k={card ? tw(f, S(3) - 4, S(3) + 8, 1, 0) : 1} />
      {card && (
        <g transform={`translate(540 ${560}) scale(${pop(f, S(3) - 4, 18)})`}>
          <rect x={-470} y={-230} width={940} height={420} rx={36} fill="#fffbeb" stroke={INK} strokeWidth={8} />
          <text x={0} y={-120} textAnchor="middle" fontFamily={HAND} fontSize={64} fill="#9a3412">To every med student:</text>
          <text x={0} y={-10} textAnchor="middle" fontFamily={HAND} fontSize={84} fill={INK}>you're doing better</text>
          <text x={0} y={90} textAnchor="middle" fontFamily={HAND} fontSize={84} fill={INK}>than you think.</text>
          <path d="M -200 140 Q 0 170 200 140" fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
      {hold > 0 && card && <Heart x={540 + 400} y={420} s={pop(f, S(3) + 50, 16) * 1.2} fill="#fb7185" />}
    </g>
  );
};
