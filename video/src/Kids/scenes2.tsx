// Scenes 6–10: mistakes, grown-up superpowers, evening together, bedtime, the lesson.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { SceneData } from "./data";
import { alive, BLUE, DAD, Figure, INK, joints, mix, ORANGE, P, pop, poseAt, STAND, tw, walk } from "./rig";
import { Bed, Blanket, Bubble, Cloud, cue, PortraitCtx, GROUND, H, HAND, Heart, Label, MID, Phone, QMark, RabbitCloud, Shield, Split, Star, Table, Tag, Tear, W, Zzz } from "./stage";

const MS = 0.62;
type SP = { sc: SceneData };

/* ---------- 6. Mistakes ---------- */
export const Scene6: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const spill = tw(f, S(0) + 50, S(0) + 96);
  const fish = (i: number) => pop(f, S(1) + 62 + i * 16, 12);
  const paint = f > S(1) + 56 && f < S(1) + 150 ? 1 : 0;
  const miaPose = alive(poseAt(f, [[0, P({ aR: [70, 110] })], [S(0) + 44, P({ aR: [70, 110] })], [S(0) + 60, P({ aL: [-140, -160], aR: [140, 160], lean: -8 })], [S(1), P({ aL: [-30, 30], aR: [30, -30], tilt: 10 })], [S(1) + 54, P({ aL: [-30, 30], aR: [30, -30], tilt: 10 })], [S(1) + 70, P({ aR: [84, 100 + Math.sin(f / 3) * 14], lean: 8 })], [S(1) + 150, P({ aR: [84, 100 + Math.sin(f / 3) * 14], lean: 8 })], [S(1) + 170, P({ aL: [-150, -165], aR: [150, 165], dy: -Math.abs(Math.sin(f / 6)) * 22 })], [S(2), P({ aL: [-150, -165], aR: [150, 165], dy: -Math.abs(Math.sin(f / 6)) * 22 })], [S(2) + 30, P({ aR: [60, 100] })]]), f, 1.2, 6);
  const mj = joints("mia", 1290, GROUND, MS, miaPose);
  const oops = f > S(2) + 30;
  const grip = tw(f, S(2) + 50, S(2) + 80);
  const dadPose = alive(mix(P({ drop: 62, lL: [84, 4], lR: [74, 8], aL: [50, 96], aR: [62, 100], lean: 6 }), P({ drop: 62, lL: [84, 4], lR: [74, 8], aL: [-132, -214], aR: [132, 214], lean: 12, tilt: 10 + Math.sin(f / 7) * 3 }), grip), f, 0.6);
  const dj = joints("dad", 690, GROUND, 1, dadPose, true);
  const gloom = tw(f, S(2) + 60, S(3), 0, 1.3);
  return (
    <g>
      <Split f={f} />
      <Label f={f} text="3:00 PM · Mistakes" />
      {/* Dad: one wrong number, replayed for three hours */}
      <Table x={110} y={610} w={470} color="#cbd5e1" />
      <g transform="translate(330 470)">
        <rect x={-150} y={-110} width={300} height={200} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
        <rect x={-20} y={90} width={40} height={36} fill="#9aa6b5" stroke={INK} strokeWidth={4} /><rect x={-70} y={124} width={140} height={14} rx={6} fill="#9aa6b5" stroke={INK} strokeWidth={4} />
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-126 + c * 86} y={-90 + r * 42} width={74} height={30} rx={4} fill={oops && r === 2 && c === 1 ? "#fecaca" : "#e5e7eb"} stroke={oops && r === 2 && c === 1 ? "#ef4444" : "none"} strokeWidth={5} />))}
        {oops && <g transform={`translate(-3 9) scale(${pop(f, S(2) + 30, 12)})`}><path d="M -14 -12 L 14 12 M 14 -12 L -14 12" stroke="#ef4444" strokeWidth={8} strokeLinecap="round" /></g>}
      </g>
      <rect x={640} y={GROUND - 78} width={100} height={18} rx={6} fill="#9aa6b5" stroke={INK} strokeWidth={5} />
      <line x1={690} y1={GROUND - 60} x2={690} y2={GROUND} stroke={INK} strokeWidth={8} />
      <Figure kind="dad" x={690} y={GROUND} pose={dadPose} f={f} flip face={{ eyes: grip > 0.5 ? "sad" : "tired", mouth: oops ? "wavy" : "flat", brows: oops ? "worried" : "none", look: 0.6 }} />
      {grip > 0.5 && [0, 1, 2].map((i) => { const a = f / 14 + i * 2.1; return (<g key={i} transform={`translate(${dj.head[0] + Math.cos(a) * 120} ${dj.head[1] - 20 + Math.sin(a) * 66}) scale(${0.8 + 0.2 * Math.sin(a)})`} opacity={tw(f, S(2) + 70 + i * 20, S(2) + 84 + i * 20)}><rect x={-26} y={-16} width={52} height={32} rx={5} fill="#fecaca" stroke="#ef4444" strokeWidth={4} /><path d="M -8 -7 L 8 7 M 8 -7 L -8 7" stroke="#ef4444" strokeWidth={5} strokeLinecap="round" /></g>); })}
      <Cloud x={dj.head[0]} y={dj.head[1] - 190} s={gloom} fill="#6b7280" stroke={INK} />
      {f > S(2) + 110 && (<g transform={`translate(830 330) scale(${pop(f, S(2) + 110, 14)})`}><circle r={62} fill="#fff" stroke={INK} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-42} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${(f - S(2)) * 9})`} /><line x1={0} y1={0} x2={26} y2={0} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${(f - S(2) - 110) * 0.75})`} /><text x={0} y={112} textAnchor="middle" fontFamily={HAND} fontSize={50} fill="#ef4444">3 hours…</text></g>)}
      <Bubble x={330} y={250} w={440} h={104} k={pop(f, S(4) + 40, 16)} tail="right" thought><text x={0} y={15} textAnchor="middle" fontFamily={HAND} fontSize={46} fill="#6b7280">"not good enough…"</text></Bubble>
      {/* Mia: spilled paint becomes a fish */}
      <line x1={1470} y1={600} x2={1420} y2={GROUND} stroke={INK} strokeWidth={8} strokeLinecap="round" /><line x1={1730} y1={600} x2={1780} y2={GROUND} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <rect x={1410} y={290} width={380} height={310} rx={8} fill="#fff" stroke={INK} strokeWidth={6} />
      <path d="M 1450 560 q 40 -50 80 0 M 1690 350 l 20 -30 l 20 30" fill="none" stroke="#86efac" strokeWidth={6} strokeLinecap="round" />
      <g transform={`translate(1600 450) scale(${spill})`}>
        <path d="M -92 6 Q -100 -50 -40 -58 Q 10 -84 56 -50 Q 104 -40 92 10 Q 100 56 40 60 Q -20 80 -60 52 Q -100 48 -92 6 Z" fill="#60a5fa" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path transform={`scale(${fish(0)})`} d="M 86 0 L 150 -50 L 136 4 L 150 54 Z" fill="#60a5fa" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <g transform={`scale(${fish(1)})`}><circle cx={-46} cy={-14} r={15} fill="#fff" stroke={INK} strokeWidth={4} /><circle cx={-48} cy={-14} r={6} fill={INK} /></g>
        <path d="M -78 18 q 14 14 30 4" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={fish(2)} />
        <path transform={`scale(${fish(3)})`} d="M 0 -60 q 20 -40 44 -18 q -10 14 -30 20 Z" fill="#3b82f6" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <circle key={i} cx={-130 - i * 16} cy={-50 - i * 40 - ((f / 2) % 20)} r={9 + i * 4} fill="none" stroke="#60a5fa" strokeWidth={4} opacity={fish(4)} />)}
      </g>
      <g transform={`translate(${1440 + spill * 40} ${290 - 26}) rotate(${tw(f, S(0) + 30, S(0) + 56, 0, 105)})`}>
        <rect x={-22} y={-40} width={44} height={50} rx={6} fill="#bfdbfe" stroke={INK} strokeWidth={5} />
      </g>
      <Figure kind="mia" x={1290} y={GROUND} s={MS} pose={miaPose} f={f} face={{ eyes: f > S(0) + 50 && f < S(1) + 56 ? "wide" : f > S(1) + 150 ? "happy" : "open", mouth: f > S(0) + 50 && f < S(1) + 56 ? "o" : "grin", look: 0.9 }} />
      <g transform={`translate(${mj.handR[0]} ${mj.handR[1]}) rotate(${-50 + paint * Math.sin(f / 3) * 12})`}><line x1={0} y1={10} x2={0} y2={-70} stroke="#b08968" strokeWidth={8} strokeLinecap="round" /><path d="M -8 -70 L 8 -70 L 0 -96 Z" fill="#60a5fa" stroke={INK} strokeWidth={3} /></g>
      {f > S(1) && f < S(1) + 56 && <Tag x={1290} y={GROUND - 290} text="…" k={pop(f, S(1) + 4, 10)} size={90} />}
      <Tag x={1600} y={250} text="oops → fish!" k={pop(f, S(3) + 20, 14)} size={64} color={ORANGE} rot={-4} />
      {f > S(3) && [0, 1, 2].map((i) => <Star key={i} x={1440 + i * 160} y={640 + Math.sin(f / 9 + i) * 10} s={pop(f, S(3) + 30 + i * 8)} rot={f * 2} />)}
    </g>
  );
};

/* ---------- 7. But grown-ups have superpowers too ---------- */
export const Scene7: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const merge = tw(f, S(0) + 10, S(0) + 70);
  const B = S(5) + 36; // the toy breaks
  const fix = tw(f, S(7) + 10, S(7) + 70);
  const give = tw(f, S(7) + 86, S(7) + 120);
  const hug = tw(f, S(7) + 130, S(7) + 170);
  const broken = f > B ? 1 - fix : 0;
  const crying = f > B + 10 && give < 0.6;
  const badges = tw(f, S(5) - 16, S(5), 1, 0);
  const dadX = 700 + tw(f, S(6), S(6) + 40, 0, 170);
  const kneel = P({ drop: 86, lean: 14, lL: [82, -8], lR: [8, 92], aL: [60, 80], aR: [70, 86] });
  const working = P({ ...kneel, aL: [56, 76 + Math.sin(f / 3) * 10], aR: [66, 84 - Math.sin(f / 3) * 10], tilt: 12 });
  const hugP = P({ ...kneel, aR: [84, 60], aL: [70, 40], tilt: 8, lean: 18 });
  const dadPose = alive(poseAt(f, [[0, P({ aL: [-40, 20], aR: [40, -20] })], [S(5), STAND], [B + 6, P({ aL: [-20, -10], aR: [40, 60], tilt: 6 })], [S(6), STAND], [S(6) + 40, kneel], [S(7) + 10, working], [S(7) + 70, working], [S(7) + 100, kneel], [S(7) + 170, hugP]]), f, 0.7);
  const miaX = 1250 - give * 60 - hug * 86;
  const cry = P({ aL: [-126, -214], aR: [126, 214], lean: -2, tilt: 10, dy: Math.sin(f / 3) * 3 });
  const miaPose = alive(poseAt(f, [[0, STAND], [S(5), P({ aL: [-40, -70], aR: [-20, -60] })], [B, P({ aL: [-40, -70], aR: [-20, -60] })], [B + 14, cry], [S(7) + 84, cry], [S(7) + 112, P({ aL: [-60, -90], aR: [-50, -80], tilt: -4 })], [S(7) + 170, P({ aL: [-70, -100], aR: [-80, -60], lean: -10 })]]), f, 1, 8);
  const mj = joints("mia", miaX, GROUND, MS, miaPose);
  const toyX = 1100 - give * 30 - hug * 60, toyY = GROUND - 50 - give * 70;
  const icon = (i: number) => {
    if (i === 0) return <g><path d="M -22 -32 L 22 -32 L 4 0 L 22 32 L -22 32 L -4 0 Z" fill="#fde68a" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><path d={`M -10 26 L 10 26 L 0 ${14 - ((f / 3) % 10)} Z`} fill="#f59e0b" /></g>;
    if (i === 1) return <Shield x={0} y={0} s={0.86} />;
    return <path d="M -34 0 q 11 -18 22 0 t 22 0 t 22 0 M -34 18 q 11 -18 22 0 t 22 0 t 22 0" fill="none" stroke={BLUE} strokeWidth={7} strokeLinecap="round" />;
  };
  return (
    <g>
      <Split f={f} merge={merge} />
      <Label f={f} text="5:00 PM" />
      {/* patience, responsibility, staying calm */}
      {["patience", "responsibility", "staying calm"].map((t, i) => (
        <g key={t} transform={`translate(${430 + i * 270} 300) scale(${pop(f, S(2 + i) + 4, 16) * badges})`}>
          <circle r={68} fill="#fff" stroke={INK} strokeWidth={6} />{icon(i)}
          <text x={0} y={122} textAnchor="middle" fontFamily={HAND} fontSize={48} fill={DAD}>{t}</text>
        </g>
      ))}
      <Tag x={700} y={170} text="grown-up superpowers" k={pop(f, S(1) + 6, 16) * badges} size={70} color={BLUE} rot={-2} />
      {/* the favourite toy breaks */}
      <g transform={`translate(${toyX} ${toyY})`} opacity={tw(f, S(5) - 6, S(5) + 8)}>
        <g transform={`translate(${-broken * 26} 0) rotate(${-broken * 24})`}>
          <path d="M -4 -44 Q -40 -48 -40 -14 L -40 46 L -4 46 Z" fill="#fca5a5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={-34} cy={-52} r={13} fill="#fca5a5" stroke={INK} strokeWidth={5} /><circle cx={-20} cy={-14} r={5} fill={INK} />
        </g>
        <g transform={`translate(${broken * 26} ${broken * 8}) rotate(${broken * 30})`}>
          <path d="M 4 -44 Q 40 -48 40 -14 L 40 46 L 4 46 Z" fill="#fca5a5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={34} cy={-52} r={13} fill="#fca5a5" stroke={INK} strokeWidth={5} /><circle cx={20} cy={-14} r={5} fill={INK} />
        </g>
        {broken < 0.1 && <path d="M -12 10 q 12 12 24 0" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />}
        {fix > 0.9 && [0, 1, 2, 3].map((i) => <Star key={i} x={Math.cos(i * 1.6 + f / 20) * 76} y={Math.sin(i * 1.6 + f / 20) * 76 - 10} s={0.9 * tw(f, S(7) + 64, S(7) + 76) * tw(f, S(7) + 120, S(7) + 140, 1, 0)} rot={f * 3} />)}
      </g>
      {f > B && f < B + 34 && <Tag x={toyX} y={toyY - 110} text="crack!" k={pop(f, B, 10)} size={70} color="#ef4444" rot={-8} />}
      <Figure kind="dad" x={dadX} y={GROUND} pose={dadPose} f={f} face={{ eyes: hug > 0.5 ? "happy" : f > S(1) ? "open" : "tired", mouth: f > S(6) ? "smile" : "flat", look: 0.8 }} />
      <Figure kind="mia" x={miaX} y={GROUND} s={MS} pose={miaPose} f={f} face={{ eyes: crying ? "closed" : hug > 0.3 ? "happy" : "open", mouth: crying ? "frown" : give > 0.6 ? "grin" : "smile", brows: crying ? "worried" : "none", look: -0.8 }} />
      {crying && [-1, 1].map((s, i) => <Tear key={s} x={mj.head[0] + s * 26} y={mj.head[1] + 10} f={f} phase={i * 13} />)}
      <Heart x={(dadX + miaX) / 2 + 40} y={GROUND - 470 - Math.sin(f / 10) * 8} s={pop(f, S(7) + 176, 16) * 1.3} />
      {/* a hundred quiet worries, carried so she doesn't have to */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Cloud key={i} x={dadX - 190 - (i % 3) * 74} y={GROUND - 330 - Math.floor(i / 3) * 62 + Math.sin(f / 16 + i) * 5} s={0.42 * pop(f, S(7) + 150 + i * 9, 12)} fill="#d1d5db" stroke="#6b7280" />)}
    </g>
  );
};

/* ---------- 8. Evening together ---------- */
export const Scene8: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const go = tw(f, S(1), S(3) - 10);
  const lie = tw(f, S(3) + 4, S(3) + 58);
  const laugh = f > S(5) + 20 && f < S(6) + 40 ? 1 : 0;
  const dusk = tw(f, S(3), sc.frames, 0, 1);
  const dadX = 520 + go * 480, miaX = 730 + go * 480 + lie * 270;
  const walking = go > 0 && go < 1;
  const dadStand = walking ? mix(walk(f, 26, 0.7), P({ lean: -6, aR: [70, 76] }), 0.45) : P({ aL: f < S(2) + 50 ? [-36, -128] : [-12, -6], aR: go > 0 ? [70, 76] : [12, 6], tilt: f < S(2) + 50 && go === 0 ? -10 : 0 });
  const dadLie = P({ aL: [-150, -212], aR: [150, 212], lL: [-6, 0], lR: [26, -34], dy: laugh * Math.sin(f / 2) * 4 });
  const miaStand = walking ? mix(walk(f, 17, 1.1), P({ lean: 14, aL: [-70, -76] }), 0.4) : P({ lean: go === 0 && f > S(0) + 40 ? 12 + Math.sin(f / 6) * 4 : 0, aL: [-70, -76], aR: [30, 60] });
  const miaLie = P({ aL: [-150, -205], aR: f > S(4) ? [92 + Math.sin(f / 7) * 5, 88] : [150, 205], lL: [-8, 0], lR: [14, -20] });
  const dadPose = alive(mix(dadStand, dadLie, lie), f, 0.5);
  const miaPose = alive(mix(miaStand, miaLie, lie), f, 0.8, 7);
  const dj = joints("dad", dadX, GROUND, 1, dadStand);
  const rabX = 2200 - tw(f, S(3) + 40, S(4) + 50) * 1140 - Math.max(0, f - S(4) - 50) * 0.3;
  const phone = tw(f, S(2) + 40, S(2) + 70);
  const gy = GROUND + lie * 70;
  return (
    <g>
      <defs><linearGradient id="s8sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cdbdf0" /><stop offset="0.6" stopColor="#fbd3a4" /><stop offset="1" stopColor="#fde9c9" /></linearGradient></defs>
      <rect x={-1400} y={-1400} width={W + 2800} height={1400} fill="#cdbdf0" />
      <rect x={-1400} width={W + 2800} height={H} fill="url(#s8sky)" />
      <circle cx={1560} cy={GROUND - 60 + dusk * 110} r={110} fill="#fbbf24" opacity={0.9} />
      <rect x={-1400} y={-1400} width={W + 2800} height={GROUND + 1400} fill="#312e81" opacity={dusk * 0.22} />
      {[[300, 170], [820, 110], [1260, 200], [1700, 130], [560, 260], [1500, 90]].map(([x, y], i) => <Star key={i} x={x} y={y} s={dusk * (0.5 + 0.4 * Math.sin(f / 9 + i * 2))} fill="#fff" rot={f} />)}
      <Cloud x={380 + f * 0.25} y={240} s={0.9} stroke="#b5a8d6" />
      <Cloud x={1500 - f * 0.18} y={150} s={0.6} stroke="#b5a8d6" />
      <RabbitCloud x={rabX} y={300} s={1.25} />
      <path d={`M 0 ${GROUND} Q 480 ${GROUND - 46} 960 ${GROUND - 10} T 1920 ${GROUND - 20} L 1920 ${H} L 0 ${H} Z`} fill="#a9d08e" stroke="#6a994e" strokeWidth={5} />
      <rect x={-1400} y={H - 2} width={W + 2800} height={1400} fill="#a9d08e" />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${60 + i * 122} ${GROUND + 40 + (i % 3) * 40} q 6 -24 12 0 q 6 -30 12 0`} fill="none" stroke="#6a994e" strokeWidth={5} strokeLinecap="round" />)}
      <Label f={f} text="6:30 PM" />
      <g transform={`rotate(${-90 * lie} ${dadX} ${gy})`}><Figure kind="dad" x={dadX} y={gy} pose={dadPose} f={f} face={{ eyes: laugh ? "happy" : lie > 0.8 ? "open" : "tired", mouth: laugh ? "laugh" : lie > 0.8 ? "smile" : "flat", look: lie > 0.5 ? 0.9 : go > 0 ? 0.5 : -0.8 }} /></g>
      <g transform={`rotate(${-90 * lie} ${miaX} ${gy})`}><Figure kind="mia" x={miaX} y={gy} s={MS} pose={miaPose} f={f} face={{ eyes: lie > 0.8 ? "happy" : "open", mouth: "grin", look: lie > 0.5 ? 0.9 : go > 0 ? 0.6 : -0.7 }} /></g>
      {lie === 0 && <Phone x={dj.handL[0] - 2 + phone * 30} y={dj.handL[1] - 8 + phone * 150} s={1 - phone} rot={-14} />}
      <Bubble x={dadX - 60} y={GROUND - 540} w={420} h={104} k={pop(f, S(2) + 8, 14) * tw(f, S(3) - 14, S(3), 1, 0)} tail="right"><text x={0} y={16} textAnchor="middle" fontFamily={HAND} fontSize={50} fill={INK}>"Just five minutes."</text></Bubble>
      {f > S(0) + 20 && f < S(1) + 30 && [0, 1, 2, 3].map((i) => <Star key={i} x={760 + Math.cos(i * 1.6 + f / 18) * 120} y={GROUND - 330 + Math.sin(i * 1.6 + f / 18) * 80} s={pop(f, S(0) + 20 + i * 6) * tw(f, S(1), S(1) + 30, 1, 0)} rot={f * 3} />)}
      {laugh === 1 && [0, 1, 2].map((i) => <Tag key={i} x={dadX - 330 + i * 110} y={gy - 150 - i * 44 - Math.sin(f / 4 + i) * 8} text="ha!" k={pop(f, S(5) + 24 + i * 9, 10)} size={60 + i * 10} color={BLUE} rot={-10 + i * 8} />)}
      {f > S(6) && [0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={300 + i * 230 + Math.sin(f / 22 + i * 3) * 60} cy={GROUND - 150 - (i % 3) * 90 + Math.cos(f / 17 + i) * 40} r={7} fill="#fef08a" opacity={(0.5 + 0.5 * Math.sin(f / 6 + i * 2)) * tw(f, S(6), S(6) + 30)} />)}
      <Heart x={(dadX + miaX) / 2 - 150} y={gy - 250 - Math.sin(f / 10) * 8} s={pop(f, S(6) + 60, 16) * 1.1} fill="#fb7185" />
    </g>
  );
};

/* ---------- 9. Bedtime ---------- */
export const Scene9: React.FC<SP> = ({ sc }) => {
  const f = useCurrentFrame();
  const { S } = cue(sc);
  const asleep = f > S(0) + 64;
  const close = tw(f, S(1) + 16, S(1) + 44);
  const quiet = tw(f, S(2) + 6, S(2) + 90);
  const turn = tw(f, S(3) + 6, S(3) + 36);
  const dadPose = alive(P({ drop: 62, lL: [84, 4], lR: [74, 8], aL: [50, 104 - close * 40], aR: [62, 112 - close * 44], lean: 6 - turn * 8, tilt: 8 - turn * 14 }), f, 0.5);
  const dj = joints("dad", 1250, GROUND, 1, dadPose, true);
  const book: [number, number] = [(dj.handL[0] + dj.handR[0]) / 2, (dj.handL[1] + dj.handR[1]) / 2 - 10];
  return (
    <g>
      <rect x={-1400} y={-1400} width={W + 2800} height={H + 2800} fill="#dfe5f6" />
      <rect x={-1400} y={GROUND} width={W + 2800} height={H - GROUND + 1400} fill="#cfc4b4" />
      <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="#9a8f80" strokeWidth={5} />
      {/* the window: moon and stars */}
      <rect x={1440} y={150} width={330} height={330} rx={12} fill="#27325c" stroke={INK} strokeWidth={8} />
      <line x1={1605} y1={150} x2={1605} y2={480} stroke={INK} strokeWidth={6} /><line x1={1440} y1={315} x2={1770} y2={315} stroke={INK} strokeWidth={6} />
      <path transform="translate(1530 240)" d="M 14 -44 A 46 46 0 1 0 44 24 A 35 35 0 1 1 14 -44 Z" fill="#fde68a" />
      {[[1680, 210], [1720, 290], [1650, 390], [1500, 400], [1560, 440], [1730, 430]].map(([x, y], i) => <Star key={i} x={x} y={y} s={0.45 + 0.35 * Math.sin(f / (7 + turn * -2) + i * 2)} fill="#fff" rot={f} />)}
      {/* lamp */}
      <circle cx={330} cy={470} r={210} fill="#fde68a" opacity={0.28 + 0.03 * Math.sin(f / 15)} />
      <rect x={270} y={GROUND - 170} width={120} height={170} rx={8} fill="#b08968" stroke={INK} strokeWidth={5} />
      <line x1={330} y1={GROUND - 170} x2={330} y2={520} stroke={INK} strokeWidth={8} /><path d="M 270 520 L 290 440 L 370 440 L 390 520 Z" fill="#fbbf24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <Label f={f} text="9:00 PM" />
      <Bed x={450} w={600} />
      <g transform={`rotate(-90 870 ${GROUND - 112})`}><Figure kind="mia" x={870} y={GROUND - 112} s={MS} pose={P({ aL: [-8, -4], aR: [8, 4], lL: [-4, 0], lR: [4, 0], tilt: asleep ? 6 : 0 })} f={f} face={{ eyes: asleep ? "closed" : "tired", mouth: "smile", look: 0.4 }} /></g>
      <Blanket x={730} w={320} color="#fcd34d" lift={Math.sin(f / 22) * 5} />
      {asleep && <Zzz x={700} y={GROUND - 200} f={f} color={ORANGE} />}
      {/* dreaming about tomorrow */}
      <g transform={`translate(830 300) scale(${pop(f, S(0) + 110, 18)})`}>
        <ellipse rx={210} ry={120} fill="#fff" stroke={INK} strokeWidth={5} />
        {[0, 1].map((i) => <circle key={i} cx={-120 - i * 26} cy={130 + i * 34} r={16 - i * 6} fill="#fff" stroke={INK} strokeWidth={4} />)}
        <RabbitCloud x={-40} y={24} s={0.62} /><Star x={130} y={-40} s={1.3} rot={f * 2} /><Star x={150} y={40} s={0.8} rot={-f * 2} fill="#f472b6" />
      </g>
      {/* Dad stays a little longer */}
      <rect x={1200} y={GROUND - 78} width={100} height={18} rx={6} fill="#b08968" stroke={INK} strokeWidth={5} />
      <line x1={1250} y1={GROUND - 60} x2={1250} y2={GROUND} stroke={INK} strokeWidth={8} />
      <Figure kind="dad" x={1250} y={GROUND} pose={dadPose} f={f} flip face={{ eyes: f > S(4) + 10 ? "happy" : quiet > 0.6 ? "open" : "tired", mouth: quiet > 0.4 ? "smile" : "flat", look: 0.8 - turn * 1.7 }} />
      <g transform={`translate(${book[0]} ${book[1]})`}>
        <path d={`M 0 0 L ${-70 + close * 62} ${-30 + close * 22} L ${-70 + close * 62} ${20 + close * 22} L 0 ${50} Z`} fill="#93c5fd" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M 0 0 L ${70 - close * 62} ${-30 + close * 22} L ${70 - close * 62} ${20 + close * 22} L 0 ${50} Z`} fill="#bfdbfe" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>
      <Cloud x={dj.head[0]} y={dj.head[1] - 150} s={0.7 * (1 - quiet)} fill="#6b7280" stroke={INK} />
      <Heart x={dj.head[0] - 10} y={dj.head[1] - 130} s={pop(f, S(4) + 20, 16) * 0.9} fill="#fb7185" />
      <rect x={-1400} y={-1400} width={W + 2800} height={H + 2800} fill="#1e1b4b" opacity={tw(f, S(1), sc.frames, 0, 0.16)} />
    </g>
  );
};

/* ---------- 10. The lesson ---------- */
export const Scene10: React.FC<SP & { hold: number }> = ({ sc }) => {
  const f = useCurrentFrame();
  const portrait = React.useContext(PortraitCtx);
  const { S } = cue(sc);
  const lessons = tw(f, S(4) - 24, S(4) - 6, 1, 0);
  const kid = ["Be curious", "Make mistakes", "Notice the small things"];
  const grown = ["patient", "brave", "responsible"];
  const fin = f > S(4);
  const dadPose = alive(fin ? P({ aR: [70, 76], aL: [-150, -165 - Math.sin(f / 5) * 20] }) : P({ aR: [70, 76], tilt: f > S(3) + 60 ? -14 : 0 }), f, 0.8);
  const miaPose = alive(fin ? P({ aL: [-70, -76], aR: [150, 165 + Math.sin(f / 4) * 22], dy: -Math.abs(Math.sin(f / 6)) * 18 }) : P({ aL: [-70, -76], aR: f > S(3) + 10 && f < S(3) + 90 ? [150, 160] : [20, 30] }), f, 1.2, 5);
  // landscape: figures left, words right. 9:16: words stacked above the figures (crop centred on x 960)
  const L = portrait
    ? { dad: 830, mia: 1000, kx: 960, ky: [-150, -50, 50], line: [560, 1360, 120], gx: [690, 930, 1200], gy: 210, gs: 50, heart: [1290, 560], bub: [1250, 420], rab: [1330, -60], fx: 960, fy: [-110, 60], fs: [140, 104] }
    : { dad: 300, mia: 470, kx: 1240, ky: [240, 352, 464], line: [900, 1580, 556], gx: [930, 1200, 1500], gy: 650, gs: 60, heart: [760, 500], bub: [640, 250], rab: [1700, 130], fx: 1180, fy: [330, 540], fs: [190, 150] };
  return (
    <g>
      <rect x={-1400} y={-1400} width={W + 2800} height={H + 2800} fill="#fdfcf8" />
      <line x1={-400} y1={GROUND} x2={W + 400} y2={GROUND} stroke="#9aa6b5" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <Figure kind="dad" x={L.dad} y={GROUND} pose={dadPose} f={f} face={{ eyes: fin ? "happy" : "open", mouth: fin ? "grin" : "smile", look: f > S(3) + 60 && !fin ? 0.5 : 0.3 }} />
      <Figure kind="mia" x={L.mia} y={GROUND} s={MS} pose={miaPose} f={f} face={{ eyes: "happy", mouth: "grin", look: 0.2 }} />
      <g opacity={lessons}>
        {kid.map((t, i) => <Tag key={t} x={L.kx} y={L.ky[i]} text={t} k={pop(f, S(0) + 16 + i * 52, 16)} size={portrait ? 88 : 96} color={ORANGE} rot={-2 + i} />)}
        <line x1={L.line[0]} y1={L.line[2]} x2={L.line[1]} y2={L.line[2]} stroke={INK} strokeWidth={5} strokeDasharray="2 16" strokeLinecap="round" opacity={tw(f, S(1), S(1) + 20) * 0.5} />
        {grown.map((t, i) => <Tag key={t} x={L.gx[i]} y={L.gy} text={`Be ${t}`} k={pop(f, S(1) + 30 + i * 38, 16)} size={L.gs} color={BLUE} rot={i - 1} />)}
        <Heart x={L.heart[0]} y={L.heart[1]} s={pop(f, S(2) + 40, 18) * (1.3 + 0.1 * Math.sin(f / 6))} />
        <Bubble x={L.bub[0]} y={L.bub[1]} w={130} h={110} k={pop(f, S(3) + 30, 14)} tail="left"><QMark x={0} y={30} s={1} /></Bubble>
        <RabbitCloud x={L.rab[0]} y={L.rab[1]} s={0.7} opacity={tw(f, S(3) + 80, S(3) + 100)} />
      </g>
      {fin && (
        <g>
          <Tag x={L.fx} y={L.fy[0]} text="Grow up," k={pop(f, S(4) + 6, 18)} size={L.fs[0]} color={DAD} rot={-2} />
          <Tag x={L.fx} y={L.fy[1]} text="but don't grow old." k={pop(f, S(4) + 40, 18)} size={L.fs[1]} color={ORANGE} rot={-1} />
          {[0, 1, 2, 3, 4, 5].map((i) => <Star key={i} x={(portrait ? 470 : 760) + i * (portrait ? 190 : 170)} y={(portrait ? -260 : 130) + (i % 2) * (portrait ? 420 : 520) + Math.sin(f / 9 + i) * 10} s={pop(f, S(4) + 70 + i * 6) * 1.3} rot={f * 2} fill={i % 2 ? "#fbbf24" : "#f472b6"} />)}
        </g>
      )}
    </g>
  );
};
export { MID };
