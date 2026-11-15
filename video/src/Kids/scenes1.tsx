// Scenes 1–5: intro, waking up, breakfast, the way to work and school, questions.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { SceneData } from "./data";
import { alive, BLUE, DAD, Figure, INK, joints, mix, ORANGE, P, pop, poseAt, STAND, tw, walk } from "./rig";
import { Alarm, Bed, Blanket, Bubble, Car, Cloud, COOL, cue, Envelope, GROUND, H, HAND, Heart, Label, MID, Mug, Phone, QMark, RabbitCloud, Split, Star, Table, Tag, W, WARM, Zzz } from "./stage";

const MS = 0.62; // Mia's scale
type SP = { sc: SceneData };
const pulse = (f: number, at: number, len = 16) => { const t = (f - at) / len; return t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI); };

/* ---------- 1. Intro ---------- */
export const Scene1: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const split = tw(f, S(1), S(1) + 45);
  const dadX = tw(f, 0, 58, -140, 700), miaX = tw(f, 10, 62, W + 140, 1230);
  const wave = (k: number) => P({ aR: [150, 165 + Math.sin(f / 4) * 22 * k], tilt: 4 });
  const dadPose = f < 58 ? walk(f, 24) : alive(poseAt(f, [[58, STAND], [S(2) + 30, STAND], [S(2) + 48, wave(1)], [S(2) + 150, wave(1)], [S(2) + 170, STAND]]), f);
  const miaPose = f < 62 ? walk(f, 16, 1.2) : alive(poseAt(f, [[62, STAND], [S(2) + 10, STAND], [S(2) + 26, P({ aL: [-150, -165 - Math.sin(f / 3) * 24], aR: [150, 165 + Math.sin(f / 3) * 24], dy: -Math.abs(Math.sin(f / 5)) * 26 })], [S(2) + 170, P({ aL: [-150, -165 - Math.sin(f / 3) * 24], aR: [150, 165 + Math.sin(f / 3) * 24], dy: -Math.abs(Math.sin(f / 5)) * 26 })], [S(2) + 190, STAND]]), f, 1.5, 9);
  const icons = tw(f, S(1) - 10, S(1) + 20, 1, 0);
  const arc = tw(f, S(2) + 70, S(2) + 230);
  return (
    <g>
      <rect width={W} height={H} fill="#fdfcf8" />
      <rect x={0} y={0} width={MID} height={H} fill={COOL} opacity={split} />
      <rect x={MID} y={0} width={MID} height={H} fill={WARM} opacity={split} />
      <line x1={40} y1={GROUND} x2={W - 40} y2={GROUND} stroke="#9aa6b5" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <line x1={MID} y1={0} x2={MID} y2={H * split} stroke={INK} strokeWidth={6} strokeDasharray="2 18" strokeLinecap="round" opacity={0.55} />
      {/* same house, same breakfast, same sun */}
      <g opacity={icons}>
        <g transform={`translate(700 330) scale(${pop(f, S(0) + 46)})`}>
          <path d="M -70 0 L 0 -62 L 70 0 Z" fill="#f87171" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <rect x={-52} y={0} width={104} height={76} fill="#fff" stroke={INK} strokeWidth={6} />
          <rect x={-14} y={30} width={28} height={46} fill={BLUE} stroke={INK} strokeWidth={4} />
        </g>
        <g transform={`translate(960 340) scale(${pop(f, S(0) + 96)})`}>
          <path d="M -46 -30 Q -60 -56 -30 -58 Q 0 -72 30 -58 Q 60 -56 46 -30 L 44 46 L -44 46 Z" fill="#f2c078" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <rect x={-16} y={-8} width={32} height={26} rx={6} fill="#fde68a" />
        </g>
        <g transform={`translate(1220 320) scale(${pop(f, S(0) + 140)}) rotate(${f * 0.5})`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={0} y1={-62} x2={0} y2={-84} stroke="#f59e0b" strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
          <circle r={48} fill="#fbbf24" stroke={INK} strokeWidth={6} />
        </g>
      </g>
      {/* title */}
      <Tag x={MID} y={196} text="A Day in the Life" k={pop(f, S(2) + 4, 18)} size={92} rot={-2} />
      <g transform={`translate(${MID} 330) scale(${pop(f, S(2) + 26, 18)})`}>
        <text textAnchor="end" x={-70} fontFamily={HAND} fontSize={132} fill={DAD}>Grown-ups</text>
        <text textAnchor="middle" x={0} y={-8} fontFamily={HAND} fontSize={84} fill={INK}>vs.</text>
        <text textAnchor="start" x={70} fontFamily={HAND} fontSize={132} fill={ORANGE} stroke={INK} strokeWidth={2}>Kids</text>
      </g>
      {/* from sunrise to bedtime */}
      {arc > 0 && (
        <g>
          <path d="M 150 440 Q 960 -260 1770 440" fill="none" stroke={INK} strokeWidth={5} strokeDasharray="4 20" strokeLinecap="round" pathLength={1} strokeDashoffset={0} opacity={0.35} clipPath="url(#s1arc)" />
          <clipPath id="s1arc"><rect x={0} y={0} width={150 + 1620 * arc} height={H} /></clipPath>
          <circle cx={150} cy={440} r={38} fill="#fbbf24" stroke={INK} strokeWidth={5} transform={`translate(0 0) scale(1)`} opacity={tw(f, S(2) + 70, S(2) + 84)} />
          <path transform={`translate(1770 440) scale(${pop(f, S(2) + 216)})`} d="M 14 -40 A 42 42 0 1 0 40 22 A 32 32 0 1 1 14 -40 Z" fill="#fde68a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        </g>
      )}
      <Figure kind="dad" x={dadX} y={GROUND} pose={dadPose} f={f} face={{ eyes: f > S(2) + 30 ? "open" : "tired", mouth: f > S(2) + 30 ? "smile" : "flat", look: 0.6 }} />
      <Figure kind="mia" x={miaX} y={GROUND} s={MS} pose={miaPose} f={f} flip={f < 62} face={{ eyes: f > S(2) + 10 ? "happy" : "open", mouth: "grin", look: f < 62 ? 0 : -0.6 }} />
    </g>
  );
};

/* ---------- 2. Waking up ---------- */
export const Scene2: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const slaps = [S(2) + 10, S(2) + 42, S(2) + 74];
  const G = S(2) + 122; // Dad gets up
  const hit = Math.max(...slaps.map((t) => pulse(f, t, 18)));
  const nSlap = slaps.filter((t) => f > t + 9).length;
  const ringing = f >= S(0) && f < G + 20 && !slaps.some((t) => f > t + 8 && f < t + 30) ? 1 : 0;
  const hand: [number, number] = [470 - 105 * hit, GROUND - 150 - 268 * hit];
  const up = tw(f, G, G + 36);
  const zombie = P({ lean: 10, tilt: 14, aL: [62, 84], aR: [78, 92], lL: [-10 + Math.sin(f / 9) * 8, -4], lR: [10 - Math.sin(f / 9) * 8, 4], dx: tw(f, G + 40, G + 300, 0, 110) });
  const J = S(3) - 6; // Mia pops up before any alarm
  const jump = f < J ? 0 : Math.abs(Math.sin((f - J) / 8.5));
  const miaJump = mix(P({ drop: 34, lL: [-34, 20], lR: [34, -20], aL: [-60, -40], aR: [60, 40] }), P({ aL: [-150, -168], aR: [150, 168], lL: [-22, 8], lR: [22, -8] }), jump);
  const gift = pop(f, S(3) + 46), lid = tw(f, S(3) + 66, S(3) + 84);
  return (
    <g>
      <Split f={f} />
      <Label f={f} text="6:30 AM" />
      {/* Dad's side */}
      <line x1={290} y1={556} x2={440} y2={556} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <Alarm x={365} y={492} ring={ringing} f={f} />
      <Bed x={230} w={480} />
      {f < G + 12 && (
        <g transform={`rotate(-90 690 ${GROUND - 112})`} opacity={tw(f, G, G + 12, 1, 0)}>
          <Figure kind="dad" x={690} y={GROUND - 112} pose={P({ aL: [-8, -4], aR: [8, 4], lL: [-4, 0], lR: [4, 0], tilt: Math.sin(f / 20) * 3 })} f={f} face={{ eyes: hit > 0.2 ? "tired" : "closed", mouth: ringing ? "frown" : "flat", brows: ringing ? "angry" : "none" }} />
        </g>
      )}
      <Blanket x={400} w={300} color="#9db4d0" lift={f < G ? Math.sin(f / 20) * 4 : -20} />
      {f < G && (<g><polyline points={`430,${GROUND - 118} ${(430 + hand[0]) / 2 + 30},${(GROUND - 118 + hand[1]) / 2 - 20} ${hand[0]},${hand[1]}`} fill="none" stroke={DAD} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /><circle cx={hand[0]} cy={hand[1]} r={9} fill="#fff" stroke={DAD} strokeWidth={5} /></g>)}
      {nSlap > 0 && f < G + 60 && <Tag x={560} y={470} text={`snooze ×${nSlap}`} k={pop(f, slaps[nSlap - 1] + 9, 10)} size={60} color="#ef4444" rot={-6} />}
      {f < S(2) && f > S(0) && <Zzz x={300} y={GROUND - 190} f={f} />}
      {up > 0 && <Figure kind="dad" x={770} y={GROUND} pose={alive(mix(P({ drop: 130, lean: 30, lL: [70, 10], lR: [60, 16], aL: [20, 40], aR: [30, 50] }), zombie, up), f, 0.6)} f={f} opacity={tw(f, G, G + 10)} face={{ eyes: "tired", mouth: "wavy", brows: "worried" }} />}
      {/* the to-do list: his first thought */}
      <g transform={`translate(600 300) scale(${pop(f, G + 30, 16)}) rotate(-4)`}>
        <rect x={-110} y={-130} width={220} height={260} rx={10} fill="#fff" stroke={INK} strokeWidth={5} />
        <text x={0} y={-84} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={INK}>TO-DO</text>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} opacity={tw(f, G + 46 + i * 12, G + 54 + i * 12)}>
            <rect x={-86} y={-58 + i * 36} width={22} height={22} rx={4} fill="none" stroke={INK} strokeWidth={4} />
            <line x1={-50} y1={-46 + i * 36} x2={-50 + 60 + ((i * 37) % 70)} y2={-46 + i * 36} stroke="#9aa6b5" strokeWidth={7} strokeLinecap="round" />
          </g>
        ))}
      </g>
      {/* Mia's side */}
      <line x1={1620} y1={556} x2={1770} y2={556} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <Alarm x={1695} y={492} ring={0} f={f} color={ORANGE} asleep />
      {f > S(4) - 4 && <Zzz x={1740} y={440} f={f} color={ORANGE} />}
      <Bed x={1110} w={420} />
      {f < J ? (
        <g>
          <g transform={`rotate(-90 1430 ${GROUND - 112})`}><Figure kind="mia" x={1430} y={GROUND - 112} s={MS} pose={P({ aL: [-8, -4], aR: [8, 4], lL: [-4, 0], lR: [4, 0] })} f={f} face={{ eyes: "closed", mouth: "smile" }} /></g>
          <Blanket x={1290} w={240} color="#fcd34d" lift={Math.sin(f / 18) * 4} />
          <Zzz x={1250} y={GROUND - 190} f={f + 20} color={ORANGE} />
        </g>
      ) : (
        <g>
          <Blanket x={1290} w={240} color="#fcd34d" lift={-22} />
          <Figure kind="mia" x={1330} y={GROUND - 96 - jump * 120} s={MS} pose={miaJump} f={f} face={{ eyes: "happy", mouth: "grin" }} />
        </g>
      )}
      {/* waking up is like opening a present */}
      <g transform={`translate(1650 ${GROUND - 60}) scale(${gift})`}>
        <rect x={-56} y={-44} width={112} height={90} rx={6} fill="#f87171" stroke={INK} strokeWidth={5} />
        <rect x={-10} y={-44} width={20} height={90} fill="#fde68a" stroke={INK} strokeWidth={3} />
        <g transform={`translate(${lid * 34} ${-lid * 70}) rotate(${lid * 26})`}>
          <rect x={-64} y={-70} width={128} height={30} rx={6} fill="#ef4444" stroke={INK} strokeWidth={5} />
          <path d="M 0 -70 q -30 -40 -44 -12 q 20 16 44 12 q 30 -40 44 -12 q -20 16 -44 12" fill="#fde68a" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
        {lid > 0 && [0, 1, 2, 3, 4].map((i) => <Star key={i} x={(i - 2) * 46 * lid} y={-70 - lid * (90 + (i % 2) * 50)} s={lid * 1.4} rot={f * 3 + i * 30} fill={i % 2 ? "#fbbf24" : "#f472b6"} />)}
      </g>
      <Bubble x={1560} y={250} w={470} h={120} k={pop(f, S(5) + 20, 16)} tail="left" thought>
        <text x={0} y={16} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={INK}>What fun today?</text>
      </Bubble>
    </g>
  );
};

/* ---------- 3. Breakfast ---------- */
export const Scene3: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const sip = Math.max(pulse(f, S(0) + 60, 50), pulse(f, S(1) + 150, 50), pulse(f, S(4) + 6, 44));
  const dadPose = alive(mix(P({ aR: [34, 118], aL: [-36, -128], tilt: -8, lean: -2 }), P({ aR: [70, 172], aL: [-36, -128], tilt: 6, lean: -2 }), sip), f, 0.7);
  const dj = joints("dad", 470, GROUND, 1, dadPose);
  const toastT = tw(f, S(1) + 84, S(1) + 108);
  const toast: [number, number] = [700 + (dj.head[0] - 690) * toastT, 566 + (dj.head[1] + 20 - 566) * toastT - Math.sin(toastT * Math.PI) * 120];
  const reach = 0.5 + 0.5 * Math.sin(f / 13);
  const miaPose = alive(P({ drop: 55, lL: [80, 4], lR: [68, 8], aR: [mix(P({ aR: [50, 96] }), P({ aR: [74, 110] }), reach).aR[0], 100 + reach * 14], aL: [-30, 40], lean: 6, tilt: 4 }), f, 1.2, 5);
  const dots: [number, number][] = [[-40, -14], [40, -14], [-52, 16], [-30, 30], [0, 36], [30, 30], [52, 16]];
  const talk = f > S(2) + 110 ? Math.floor((f - S(2)) / 34) % 2 : -1;
  return (
    <g>
      <Split f={f} />
      <Label f={f} text="7:00 AM · Breakfast" />
      {/* Dad: standing, coffee in one hand, phone in the other */}
      <Table x={610} y={596} w={250} color="#cbd5e1" />
      <ellipse cx={720} cy={590} rx={70} ry={12} fill="#fff" stroke={INK} strokeWidth={4} />
      {toastT < 1 && (
        <g transform={`translate(${toast[0]} ${toast[1]}) rotate(${toastT * 300}) scale(${1 - toastT * 0.4})`}>
          <path d="M -34 -22 Q -44 -42 -22 -44 Q 0 -54 22 -44 Q 44 -42 34 -22 L 32 34 L -32 34 Z" fill="#f2c078" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        </g>
      )}
      <Figure kind="dad" x={470} y={GROUND} pose={dadPose} f={f} face={{ eyes: "tired", look: -0.9, mouth: toastT > 0.7 && toastT < 1 ? "o" : sip > 0.5 ? "o" : "flat" }} />
      <Mug x={dj.handR[0] + 4} y={dj.handR[1] - 2} f={f} />
      <Phone x={dj.handL[0] - 2} y={dj.handL[1] - 8} rot={-14} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = ((f - S(1) - i * 22) % 132) / 132;
        if (f < S(1) + i * 22 || f > S(4)) return null;
        return <Envelope key={i} x={dj.handL[0] - 30 - i * 14 + Math.sin(t * 6 + i) * 20} y={dj.handL[1] - 60 - t * 300} s={0.6 + t * 0.7} opacity={1 - t} />;
      })}
      {/* Mia: cereal smiley and a chat with a banana */}
      <rect x={1240} y={GROUND - 78} width={100} height={18} rx={6} fill="#e7c9a0" stroke={INK} strokeWidth={5} />
      <line x1={1290} y1={GROUND - 60} x2={1290} y2={GROUND} stroke={INK} strokeWidth={8} />
      <Figure kind="mia" x={1290} y={GROUND} s={MS} pose={miaPose} f={f} face={{ eyes: f > S(5) ? "happy" : "open", mouth: talk === 0 ? "o" : "grin", look: 0.8 }} />
      <Table x={1380} y={610} w={470} />
      <g transform="translate(1540 548)">
        <ellipse cx={0} cy={18} rx={132} ry={66} fill="#fff" stroke={INK} strokeWidth={6} />
        <ellipse cx={0} cy={10} rx={112} ry={52} fill="#fef9c3" stroke={INK} strokeWidth={4} />
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y + 4} r={11 * pop(f, S(2) + 24 + i * 9, 10)} fill="#f59e0b" stroke={INK} strokeWidth={3} />)}
      </g>
      <g transform={`translate(1760 590) rotate(${Math.sin(f / 7) * (talk === 1 ? 10 : 3)})`}>
        <path d="M -16 6 Q -46 -70 4 -118 Q 14 -124 18 -112 Q -6 -66 22 -2 Q 6 14 -16 6 Z" fill="#fde047" stroke={INK} strokeWidth={5} strokeLinejoin="round" transform={`scale(${pop(f, S(2) + 70, 14)})`} />
        {f > S(2) + 84 && (<g><circle cx={-14} cy={-66} r={4.5} fill={INK} /><circle cx={0} cy={-70} r={4.5} fill={INK} /><path d={talk === 1 ? "M -14 -52 q 8 12 16 -2 Z" : "M -14 -52 q 8 8 16 -2"} fill={talk === 1 ? INK : "none"} stroke={INK} strokeWidth={3.5} strokeLinecap="round" /></g>)}
      </g>
      {talk >= 0 && <Bubble x={talk === 0 ? 1380 : 1790} y={talk === 0 ? 400 : 400} w={110} h={76} k={pop(f, S(2) + Math.floor((f - S(2)) / 34) * 34, 10)} tail={talk === 0 ? "left" : "right"}><text x={0} y={16} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={INK}>{["hi!", "…", "ha!", "?", "yum"][Math.floor((f - S(2)) / 34) % 5]}</text></Bubble>}
      {/* same table, same food */}
      <g transform={`translate(${MID} 430) scale(${pop(f, S(3) + 6, 14) * tw(f, S(4) - 10, S(4) + 6, 1, 0)})`}>
        <circle r={56} fill="#fff" stroke={INK} strokeWidth={6} />
        <text x={0} y={26} textAnchor="middle" fontFamily={HAND} fontSize={90} fill={INK}>=</text>
      </g>
      {f > S(5) && [0, 1, 2].map((i) => { const t = ((f - S(5) + i * 30) % 90) / 90; return <Heart key={i} x={1400 + i * 150} y={420 - t * 150} s={0.5 * Math.sin(t * Math.PI)} fill="#fb7185" />; })}
    </g>
  );
};

/* ---------- 4. The way to work and school ---------- */
export const Scene4: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const gloom = tw(f, S(0), S(0) + 150, 0.5, 1.25);
  const honk = Math.floor(f / 44) % 3 === 0 ? pulse(f % 44, 0, 20) : 0;
  const stop = S(1) - 6;
  const walking = f < stop ? 1 : f > S(1) + 96 && f < S(1) + 120 ? 0 : 0;
  const crouch = P({ drop: 62, lean: 28, tilt: 14, lL: [66, -24], lR: [44, -8], aR: [36, 62], aL: [-10, 20] });
  const catchLeaf = P({ aL: [-120, -150], tilt: -8 });
  const point = P({ aR: [146, 152], tilt: -12, lean: -4 });
  const miaPose = f < stop ? walk(f, 18, 1.1) : alive(poseAt(f, [[stop, STAND], [stop + 16, crouch], [S(1) + 84, crouch], [S(1) + 104, catchLeaf], [S(1) + 150, catchLeaf], [S(1) + 172, point], [S(2) + 60, point], [S(2) + 90, STAND]]), f, 1.2, 3);
  const scroll = f < stop ? f * 7 : stop * 7;
  const antX = 1470 + Math.max(0, f - S(1)) * 0.35;
  const leafT = tw(f, S(1) + 70, S(1) + 112);
  const mj = joints("mia", 1300, GROUND, MS, miaPose);
  const leaf: [number, number] = [1180 + leafT * (mj.handL[0] - 1180) + Math.sin(leafT * 9) * 40 * (1 - leafT), 120 + leafT * (mj.handL[1] - 20 - 120)];
  const rab = tw(f, S(1) + 140, S(1) + 210);
  const spark = (x: number, y: number, i: number) => { const k = f > S(2) ? 0.6 + 0.6 * Math.abs(Math.sin(f / 8 + i)) : 0; return <Star key={i} x={x} y={y} s={k} rot={f * 2} />; };
  const Ant: React.FC<{ s: number }> = ({ s }) => (
    <g transform={`scale(${s})`}>
      <rect x={-2} y={-46} width={34} height={30} rx={5} fill="#fcd34d" stroke={INK} strokeWidth={3} transform="rotate(-8)" />
      {[-16, 0, 16].map((x, i) => <ellipse key={i} cx={x} cy={0} rx={i === 1 ? 7 : 9} ry={i === 1 ? 6 : 8} fill={INK} />)}
      {[-10, 0, 10].map((x, i) => <path key={i} d={`M ${x} 4 l ${-5 + Math.sin(f / 2 + i * 2) * 4} 12 M ${x} -4 l ${-4} -8`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
      <path d="M 22 -6 q 8 -10 14 -8" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <Split f={f} />
      <Label f={f} text="8:00 AM · On the way" />
      {/* Dad: traffic, red lights, minutes slipping away */}
      <clipPath id="s4left"><rect x={0} y={0} width={MID - 6} height={H} /></clipPath>
      <g clipPath="url(#s4left)">
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={60 + i * 160} y1={GROUND + 44} x2={140 + i * 160} y2={GROUND + 44} stroke="#9aa6b5" strokeWidth={6} strokeLinecap="round" />)}
        <line x1={905} y1={GROUND} x2={905} y2={400} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <rect x={870} y={250} width={70} height={170} rx={16} fill="#374151" stroke={INK} strokeWidth={5} />
        <circle cx={905} cy={290} r={20} fill="#ef4444" opacity={0.6 + 0.4 * Math.sin(f / 5)} />
        <circle cx={905} cy={290} r={34} fill="#ef4444" opacity={0.18 + 0.12 * Math.sin(f / 5)} />
        <circle cx={905} cy={336} r={20} fill="#6b7280" /><circle cx={905} cy={382} r={20} fill="#6b7280" />
        <Car x={690} y={GROUND - 30} color="#cbd5e1" s={0.8} />
        <Car x={310} y={GROUND - 32} color="#9db4d0" bounce={Math.sin(f / 3) * 1.5 + honk * -6}>
          <clipPath id="s4win"><path d="M -70 -66 L -46 -108 L 44 -108 L 78 -66 Z" /></clipPath>
          <g clipPath="url(#s4win)"><Figure kind="dad" x={0} y={118} s={0.56} pose={P({ aL: [40, 80], aR: [50, 90] })} f={f} face={{ eyes: "tired", mouth: "frown", brows: "angry", look: 0.8 }} /></g>
        </Car>
        {honk > 0.1 && (<g><Tag x={500} y={560} text="BEEP!" k={honk} size={64} color="#ef4444" rot={-8} />{[0, 1, 2].map((i) => <path key={i} d={`M ${476 + i * 16} ${640 + i * 22} l ${26 + i * 8} ${-8 + i * 8}`} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={honk} />)}</g>)}
        <g transform="translate(190 300)">
          <circle r={70} fill="#fff" stroke={INK} strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-48} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 4})`} />
          <line x1={0} y1={0} x2={30} y2={0} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${f * 0.34})`} />
          {[0, 1, 2].map((i) => { const t = ((f + i * 30) % 90) / 90; return f > S(0) + 80 ? <text key={i} x={70 + t * 40} y={-40 - t * 110} fontFamily={HAND} fontSize={38} fill="#ef4444" opacity={1 - t}>−1 min</text> : null; })}
        </g>
        <Cloud x={330} y={470} s={gloom} fill="#6b7280" stroke={INK} />
        {gloom > 1 && [0, 1, 2].map((i) => { const t = ((f + i * 9) % 27) / 27; return <line key={i} x1={270 + i * 60} y1={520 + t * 60} x2={262 + i * 60} y2={544 + t * 60} stroke="#60a5fa" strokeWidth={5} strokeLinecap="round" opacity={1 - t} />; })}
      </g>
      {/* Mia: an ant, a heart-shaped leaf, a rabbit cloud */}
      {[0, 1, 2, 3, 4, 5].map((i) => { const x = MID + 40 + ((i * 190 - scroll) % 900 + 900) % 900; return <path key={i} d={`M ${x} ${GROUND} q 6 -22 12 0 q 6 -30 12 0 q 6 -18 12 0`} fill="none" stroke="#65a30d" strokeWidth={5} strokeLinecap="round" />; })}
      <Cloud x={1150 - (f * 0.3) % 300} y={250} s={0.8} />
      <RabbitCloud x={1900 - rab * 330} y={280} s={1.05} opacity={tw(f, S(1) + 140, S(1) + 160)} />
      <Figure kind="mia" x={1300} y={GROUND} s={MS} pose={miaPose} f={f} face={{ eyes: f > S(1) && f < S(1) + 84 ? "wide" : f > S(2) ? "happy" : "open", mouth: f > S(1) ? "grin" : "smile", look: f > S(1) + 150 ? 0.9 : 0.7 }} />
      {walking === 1 && null}
      {f > S(1) - 30 && <g transform={`translate(${antX} ${GROUND - 9})`} opacity={tw(f, S(1) - 30, S(1) - 14)}><Ant s={0.55} /></g>}
      {/* magnifier */}
      <g transform={`translate(1660 600) scale(${pop(f, S(1) + 12, 16)})`}>
        <line x1={84} y1={84} x2={150} y2={150} stroke={INK} strokeWidth={16} strokeLinecap="round" />
        <circle r={118} fill="#fff" stroke={INK} strokeWidth={8} />
        <clipPath id="s4mag"><circle r={112} /></clipPath>
        <g clipPath="url(#s4mag)"><line x1={-120} y1={46} x2={120} y2={46} stroke="#9aa6b5" strokeWidth={4} /><g transform={`translate(${-30 + ((f - S(1)) * 0.5) % 40} 24)`}><Ant s={2.3} /></g></g>
      </g>
      {leafT > 0 && (
        <g transform={`translate(${leaf[0]} ${leaf[1]}) rotate(${Math.sin(f / 9) * 30 * (1 - leafT)})`}>
          <path d="M 0 30 C -52 -6 -34 -46 0 -20 C 34 -46 52 -6 0 30 Z" fill="#84cc16" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 0 30 L 0 -14" stroke="#3f6212" strokeWidth={3} />
        </g>
      )}
      {spark(antX, GROUND - 60, 0)}{spark(leaf[0] + 40, leaf[1] - 40, 1)}{spark(1500, 190, 2)}{spark(1720, 420, 3)}
    </g>
  );
};

/* ---------- 5. Questions ---------- */
export const Scene5: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const qs = ["Why is the sky blue?", "Where do dreams go?", "Can fish get thirsty?"];
  const hero = tw(f, S(8), S(8) + 26);
  const miaSit = P({ drop: 55, lL: [80, 4], lR: [68, 8], aR: [162, 172 + Math.sin(f / 5) * 10], aL: [-30, 40], tilt: -4 });
  const miaHero = P({ aL: [-52, 34], aR: [52, -34], lL: [-16, -8], lR: [16, 8], tilt: -6, dy: -4 });
  const miaPose = alive(mix(miaSit, miaHero, hero), f, 1.2, 4);
  const swallow = tw(f, S(6) + 10, S(6) + 60);
  const gulp = pulse(f, S(6) + 58, 16);
  const dadPose = alive(P({ drop: 62, lL: [84, 4], lR: [74, 8], aL: [40, 96], aR: [62, 108], tilt: Math.sin(f / 12) * 5 + (f > S(7) ? 8 : 0), lean: 4, dy: gulp * 8 }), f, 0.6);
  const dj = joints("dad", 640, GROUND, 1, dadPose);
  const qPos: [number, number] = [dj.head[0] + 6, dj.head[1] - 120 + swallow * 138];
  const rate = f > S(4) ? 2 : 1;
  const colors = [ORANGE, "#f472b6", "#60a5fa", "#34d399", "#a78bfa"];
  return (
    <g>
      <Split f={f} />
      <Label f={f} text="12:00 · Questions" />
      {/* Dad: a meeting; a tiny question, swallowed */}
      <g transform="translate(120 190)">
        <rect width={300} height={210} rx={10} fill="#fff" stroke={INK} strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={40 + i * 60} y={170 - (40 + i * 32)} width={36} height={40 + i * 32} fill={i === 3 ? BLUE : "#cbd5e1"} stroke={INK} strokeWidth={3} />)}
        <path d="M 40 110 L 110 84 L 170 60 L 250 24" fill="none" stroke="#ef4444" strokeWidth={5} strokeLinecap="round" />
      </g>
      {[220, 400].map((x, i) => <Figure key={x} kind="dad" x={x} y={GROUND} pose={alive(P({ drop: 62, lL: [84, 4], lR: [74, 8], aL: [40, 96], aR: [62, 108], tilt: Math.sin((f + i * 40) / 16) * 4 }), f, 0.5, i * 50)} f={f + i * 31} opacity={0.4} hideTie face={{ eyes: "open", mouth: "flat", look: f > S(7) ? 0.9 : -0.4 }} />)}
      <Figure kind="dad" x={640} y={GROUND} pose={dadPose} f={f} face={{ eyes: f > S(7) ? "sad" : "tired", mouth: gulp > 0.2 ? "o" : f > S(6) ? "flat" : "wavy", brows: f > S(5) ? "worried" : "none", look: f > S(7) ? Math.sin(f / 9) : -0.3, blush: f > S(7) }} />
      <Table x={130} y={610} w={640} color="#cbd5e1" />
      {f > S(5) && swallow < 1 && <QMark x={qPos[0]} y={qPos[1]} s={pop(f, S(5) + 6, 14) * (1 - swallow * 0.8)} color="#60a5fa" rot={Math.sin(f / 6) * 8} />}
      {f > S(7) && <path transform={`translate(${dj.head[0] + 58} ${dj.head[1] - 20 + ((f - S(7)) % 40)})`} d="M 0 -12 Q 10 4 0 10 Q -10 4 0 -12 Z" fill="#60a5fa" stroke={INK} strokeWidth={3} opacity={1 - ((f - S(7)) % 40) / 40} />}
      {/* Mia: a hundred questions */}
      <rect x={1220} y={GROUND - 78} width={100} height={18} rx={6} fill="#e7c9a0" stroke={INK} strokeWidth={5} opacity={1 - hero} />
      <line x1={1270} y1={GROUND - 60} x2={1270} y2={GROUND} stroke={INK} strokeWidth={8} opacity={1 - hero} />
      {hero > 0 && <path d={`M 1262 ${GROUND - 196} Q ${1180 - Math.sin(f / 7) * 16} ${GROUND - 140} ${1150 + Math.sin(f / 5) * 14} ${GROUND - 40} L 1250 ${GROUND - 70} Z`} fill="#ef4444" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={hero} />}
      <Figure kind="mia" x={1270} y={GROUND} s={MS} pose={miaPose} f={f} face={{ eyes: hero > 0.5 ? "happy" : "open", mouth: "grin", look: 0.3 }} />
      <Table x={1340} y={640} w={230} />
      {Array.from({ length: 10 * rate }).map((_, i) => {
        const period = 150, t = (((f - S(0)) / period + i / (10 * rate)) % 1 + 1) % 1;
        if (f < S(0) + (i * period) / (10 * rate)) return null;
        return <QMark key={i} x={1250 - 60 + Math.sin(i * 2.4) * 110 + Math.sin(t * 5 + i) * 26} y={GROUND - 300 - t * 430} s={(0.5 + (i % 3) * 0.22) * Math.sin(Math.min(1, t * 4) * Math.PI / 2)} color={colors[i % 5]} rot={Math.sin(t * 6 + i) * 16} opacity={1 - t * t} />;
      })}
      {qs.map((q, i) => (
        <Bubble key={i} x={1640} y={250 + i * 124} w={500} h={96} k={pop(f, S(1 + i) + 4, 14) * (1 - hero)} tail="left">
          <text x={0} y={15} textAnchor="middle" fontFamily={HAND} fontSize={46} fill={INK}>{q}</text>
        </Bubble>
      ))}
      {hero > 0 && (<g transform={`translate(1640 380) scale(${pop(f, S(8) + 30, 18)})`}><circle r={130} fill="#fde68a" stroke={INK} strokeWidth={8} /><text x={0} y={62} textAnchor="middle" fontFamily={HAND} fontSize={200} fill={ORANGE} stroke={INK} strokeWidth={3}>?</text>{[0, 1, 2, 3, 4, 5].map((i) => <Star key={i} x={Math.cos(i * 1.05 + f / 40) * 190} y={Math.sin(i * 1.05 + f / 40) * 190} s={1.1} rot={f * 2} />)}</g>)}
      {hero > 0 && <Tag x={1640} y={600} text="superpower!" k={pop(f, S(8) + 60, 14)} size={72} color="#ef4444" rot={-4} />}
    </g>
  );
};
