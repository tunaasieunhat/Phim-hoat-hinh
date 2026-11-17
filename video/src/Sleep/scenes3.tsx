// Scenes 7–9 of "What Happens If You Don't Get Enough Sleep?" — motion choreographed with GSAP timelines.
import React from "react";
import { alive, mix, P, walk } from "../Kids/rig";
import { INK, Person } from "./people";
import { Bed, body, EnergyBar, GY, HAND, Label, Phone, S, TimeTag, VH, VW } from "./stage";
import { useTimeline } from "./timeline";

const Hair: React.FC<{ x: number; y: number; k: number; f: number }> = ({ x, y, k, f }) => k <= 0 ? null : (
  <g transform={`translate(${x} ${y})`}>{Array.from({ length: 9 }).map((_, i) => { const a = (-70 + i * 17.5) * (Math.PI / 180); const L = (40 + (i % 2) * 18) * k; return <line key={i} x1={Math.sin(a) * 56} y1={-Math.cos(a) * 56} x2={Math.sin(a) * (56 + L) + Math.sin(f + i) * 3} y2={-Math.cos(a) * (56 + L)} stroke={INK} strokeWidth={9} strokeLinecap="round" />; })}</g>
);
const Mug: React.FC<{ x: number; y: number; s: number; f: number; tilt?: number }> = ({ x, y, s, f, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    <path d="M 30 -60 q 34 4 30 30 q -4 24 -30 22" fill="none" stroke={INK} strokeWidth={8} />
    <path d="M -36 -80 L 36 -80 L 30 0 L -30 0 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <ellipse cx={0} cy={-80} rx={36} ry={8} fill="#7c2d12" stroke={INK} strokeWidth={4} />
    <circle cx={-10} cy={-48} r={4} fill={INK} /><circle cx={10} cy={-48} r={4} fill={INK} /><path d="M -12 -34 Q 0 -24 12 -34" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
    {[0, 1].map((i) => <path key={i} d={`M ${-10 + i * 18} -96 q -8 -14 0 -26 q 8 -12 0 -24`} stroke="#9ca3af" strokeWidth={4} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />)}
  </g>
);

/* ---------- 7. Coffee x5 (15 s) ---------- */
export const SC7_LEN = 450;
const CUPS = [{ t: 1.0, hold: 0.7, s: 1 }, { t: 3.2, hold: 0.6, s: 1.3 }, { t: 5.1, hold: 0.5, s: 1.7 }, { t: 6.6, hold: 0.45, s: 2.2 }, { t: 7.9, hold: 1.7, s: 3.0 }];
export const SC7 = { gulps: [...CUPS.slice(0, 4).map((c) => Math.round((c.t + 0.35) * 30)), ...[0, 0.35, 0.7, 1.05, 1.4].map((d) => Math.round((7.9 + 0.35 + d) * 30))], rush: 165, buzz: 300 };
export const Sleep7: React.FC = () => {
  const s = useTimeline({ l0: 0, l1: 0, l2: 0, l3: 0, l4: 0, hyper: 0 }, (tl, s) => {
    CUPS.forEach((c, i) => {
      const k = `l${i}` as "l0";
      tl.to(s, { [k]: 1, duration: 0.35, ease: "power2.out" }, c.t).to(s, { [k]: 2, duration: 0.3, ease: "power2.in" }, c.t + 0.35 + c.hold);
    });
    tl.to(s, { hyper: 1, duration: 0.4, ease: "back.out(3)" }, 10.0);
  });
  const { f } = s;
  const lifts = [s.l0, s.l1, s.l2, s.l3, s.l4];
  const active = lifts.findIndex((v) => v > 0 && v < 2);
  const lk = active >= 0 ? Math.min(1, lifts[active]) * (lifts[active] > 1 ? 2 - lifts[active] : 1) : 0;
  const shake = s.hyper * Math.sin(f * 2.7) * 10;
  const pose = alive(mix(P({ aL: [-16, -8], aR: [40, 70] }), P({ aL: [-16, -8], aR: [150, 225], tilt: -14 }), lk), f, 0.6);
  const hyperPose = P({ aL: [-60 + shake * 3, -100 - shake * 4], aR: [60 - shake * 3, 100 + shake * 4], dy: Math.abs(shake) * -0.8 });
  const fp = s.hyper > 0 ? mix(pose, hyperPose, s.hyper) : pose;
  const x = 380 + shake * 0.6;
  const j = body(x, GY, fp);
  const top = GY - 330;
  let cx = 600;
  const spots = CUPS.map((c) => { const p = cx + 36 * c.s; cx += 72 * c.s + 20; return p; });
  return (
    <g>
      <rect width={VW} height={VH} fill="#ecfccb" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#bef264" />
      <rect x={500} y={top} width={580} height={30} rx={10} fill="#a16207" stroke={INK} strokeWidth={6} /><rect x={520} y={top + 30} width={540} height={GY - top - 30} fill="#ca8a04" stroke={INK} strokeWidth={6} />
      <Person who="me" x={x} y={GY} s={S} pose={fp} f={f} face={{ eyes: s.hyper > 0.3 ? "wide" : lk > 0.5 ? "closed" : "tired", mouth: s.hyper > 0.3 ? "grin" : lk > 0.5 ? "o" : "flat", look: 0.7, sweat: s.hyper > 0.5 }} />
      <Hair x={j.head[0]} y={j.head[1]} k={s.hyper} f={f} />
      {CUPS.map((c, i) => {
        const v = lifts[i];
        if (v >= 2 || f < (c.t - 0.7) * 30) return null;
        const k = Math.min(1, v);
        const mx = spots[i] + (j.head[0] + 50 - spots[i]) * k, my = top + (j.head[1] + 60 + 40 * c.s - top) * k;
        return <Mug key={i} x={mx} y={my} s={c.s * (v > 1 ? 1 - (v - 1) * 0.3 : 1)} f={f} tilt={-60 * k} />;
      })}
      {s.hyper > 0 && [-1, 1].map((sd) => <path key={sd} d={`M ${j.head[0] + sd * 110} ${j.head[1] - 20} l ${sd * 20} -14 m ${-sd * 20} 34 l ${sd * 24} 0`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.7} />)}
      <EnergyBar x={j.head[0]} y={j.head[1] - (s.hyper > 0 ? 260 : 170)} pct={s.hyper > 0 ? 30 + ((f * 37) % 70) : 2 + Math.max(0, active) * 6} text={s.hyper > 0 ? "???%" : undefined} shake={shake} />
      <TimeTag time="13:00" />
      <Label f={f} at={10} en="Coffee x5" vi="Cà phê x5" />
    </g>
  );
};

/* ---------- 8. Battery: 0% (10 s) ---------- */
export const SC8_LEN = 300;
export const SC8 = { off: 75, thud: 168, snore: 195 };
export const Sleep8: React.FC = () => {
  const s = useTimeline({ batt: 0, fall: 0 }, (tl, s) => {
    tl.to(s, { batt: 1, duration: 0.35, ease: "back.out(2)" }, 2.9).to(s, { batt: 0, duration: 0.3 }, 5.0)
      .to(s, { fall: 1, duration: 0.6, ease: "power2.in" }, 5.0);
  });
  const { f } = s;
  const frozen = f >= SC8.off;
  const sh = frozen ? 0 : Math.sin(f * 2.7) * 10;
  const pose = frozen ? P({ aL: [-70, -120], aR: [70, 120] }) : P({ aL: [-60 + sh * 3, -100 - sh * 4], aR: [60 - sh * 3, 100 + sh * 4], dy: -Math.abs(sh) });
  const x = 700;
  const ang = -90 * s.fall; // falls back like a plank, head to the left
  const j = body(x, GY, pose);
  const down = s.fall >= 1;
  const rot = (p: [number, number]): [number, number] => { const a = (ang * Math.PI) / 180, dx = p[0] - x, dy = p[1] - GY; return [x + dx * Math.cos(a) - dy * Math.sin(a), GY + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const head = rot(j.head);
  return (
    <g>
      <rect width={VW} height={VH} fill={frozen ? "#e2e8f0" : "#ecfccb"} />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill={frozen ? "#94a3b8" : "#bef264"} />
      <g transform={`rotate(${ang} ${x} ${GY})`}>
        <Person who="me" x={x + sh * 0.6} y={GY} s={S} pose={pose} f={f} face={{ eyes: down ? "closed" : frozen ? "open" : "wide", mouth: down ? "o" : frozen ? "flat" : "grin", look: 0 }} />
        <Hair x={j.head[0] + sh * 0.6} y={j.head[1]} k={frozen ? 0.4 : 1} f={frozen ? 0 : f} />
      </g>
      {f > SC8.thud && f < SC8.thud + 14 && <g>{[-1, 1].map((sd) => <path key={sd} d={`M ${x - 220 + sd * 60} ${GY - 10} l ${sd * 30} -30 m ${-sd * 10} 40 l ${sd * 40} -6`} stroke={INK} strokeWidth={7} strokeLinecap="round" />)}</g>}
      {down && f > SC8.thud + 20 && [0, 1, 2].map((i) => { const t = ((f + i * 22) % 66) / 66; return <g key={i} opacity={1 - t}><circle cx={head[0] + 60 + t * 40} cy={head[1] - 60 - t * 130} r={18 + t * 26} fill="#e0f2fe" stroke="#93c5fd" strokeWidth={4} /><text x={head[0] + 48 + t * 40} y={head[1] - 50 - t * 130} fontFamily={HAND} fontSize={30 + t * 20} fill="#3b82f6">z</text></g>; })}
      {s.batt > 0.01 && <g transform={`translate(540 760) scale(${s.batt})`}>
        <rect x={-210} y={-110} width={400} height={220} rx={30} fill="#fff" stroke={INK} strokeWidth={14} /><rect x={190} y={-46} width={40} height={92} rx={10} fill={INK} />
        <rect x={-186} y={-86} width={Math.floor(f / 8) % 2 ? 40 : 0} height={172} rx={12} fill="#ef4444" />
        <text x={0} y={30} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={96} fill="#ef4444">0%</text>
      </g>}
      <EnergyBar x={down ? head[0] + 60 : j.head[0]} y={down ? head[1] - 230 : j.head[1] - 260} pct={frozen ? 0 : 30 + ((f * 37) % 70)} text={frozen ? "0%" : "???%"} shake={sh} />
      <TimeTag time="13:05" />
      <Label f={f} at={SC8.off + 4} en="Battery: 0%" vi="Pin: 0%" />
    </g>
  );
};

/* ---------- 9. The lesson (20 s) ---------- */
export const SC9_LEN = 600;
export const SC9 = { lock: 75, bed: 186, charge: 285, morning: 300, street: 405, wink: 495, card: 510 };
const Card: React.FC<{ k: number; f: number }> = ({ k, f }) => k <= 0 ? null : (
  <g transform={`translate(540 640) scale(${k})`}>
    <rect x={-470} y={-190} width={940} height={380} rx={40} fill="#1e1b4b" stroke={INK} strokeWidth={8} />
    <path transform="translate(-340 -40)" d="M 20 -60 A 62 62 0 1 0 64 34 A 46 46 0 1 1 20 -60 Z" fill="#fde68a" />
    {[0, 1, 2].map((i) => <text key={i} x={-300 + i * 34} y={-90 - i * 30 - Math.sin(f / 8 + i) * 6} fontFamily={HAND} fontSize={40 + i * 10} fill="#c7d2fe">z</text>)}
    <text x={60} y={-30} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={66} fill="#fde68a">Go to sleep.</text>
    <text x={60} y={50} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={66} fill="#fde68a">Seriously.</text>
    <text x={0} y={140} textAnchor="middle" fontFamily="MedSans" fontWeight={700} fontSize={50} fill="#fff">Đi ngủ đi. Nghiêm túc đấy.</text>
  </g>
);
export const Sleep9: React.FC = () => {
  const s = useTimeline({ reach: 0, drawer: 1, key: 0, x: 360, lie: 0, charge: 0, jump: 0, brush: 0, x2: 120, spin: 0, wink: 0, card: 0 }, (tl, s) => {
    tl.to(s, { reach: 1, duration: 0.6, ease: "power2.out" }, 0.5).to(s, { reach: 0, duration: 0.4 }, 1.6)
      .to(s, { drawer: 0, duration: 0.35, ease: "power2.in" }, 1.8).to(s, { key: 1, duration: 0.25 }, 2.4)
      .to(s, { x: 600, duration: 1.2, ease: "power1.inOut" }, 5.0).to(s, { lie: 1, duration: 0.5, ease: "power2.inOut" }, 6.2)
      .to(s, { charge: 1, duration: 2.6, ease: "none" }, 6.9)
      .to(s, { jump: 1, duration: 0.5, ease: "back.out(2.5)" }, 10.2)
      .to(s, { brush: 1, duration: 0.3 }, 11.8).to(s, { brush: 0, duration: 0.3 }, 13.0)
      .to(s, { x2: 860, duration: 3.0, ease: "none" }, 13.6).to(s, { spin: 1, duration: 0.9, ease: "power1.inOut" }, 14.6)
      .to(s, { wink: 1, duration: 0.3 }, 16.5).to(s, { card: 1, duration: 0.5, ease: "back.out(1.6)" }, 17.0);
  });
  const { f } = s;
  const night = f < SC9.morning;
  const street = f >= SC9.street;
  // night: phone into the drawer, then off to bed
  if (night) {
    const walking = f > 150 && f < 186;
    const pose = alive(P({ ...(walking ? walk(f, 26, 0.7) : {}), aR: [40 + 60 * s.reach, 70 + 30 * s.reach], aL: [-16, -8] }), f, 0.6);
    const j = body(s.x, GY, pose);
    const lying = s.lie > 0.5;
    return (
      <g>
        <rect width={VW} height={VH} fill="#1e2346" />
        <rect x={140} y={560} width={220} height={220} rx={10} fill="#0f172a" stroke={INK} strokeWidth={8} /><circle cx={290} cy={620} r={30} fill="#fde68a" /><circle cx={304} cy={608} r={26} fill="#0f172a" />
        <rect x={0} y={GY} width={VW} height={VH - GY} fill="#151a36" />
        {/* desk with a drawer that locks */}
        <rect x={40} y={GY - 300} width={240} height={300} fill="#8b6b4a" stroke={INK} strokeWidth={6} />
        <rect x={60} y={GY - 270} width={200} height={90} fill="#a47b54" stroke={INK} strokeWidth={5} transform={`translate(${s.drawer * 120} 0)`} />
        <circle cx={160 + s.drawer * 120} cy={GY - 225} r={10} fill="#fde047" stroke={INK} strokeWidth={3} />
        {s.key > 0 && <g transform={`translate(160 ${GY - 225}) rotate(${90 * s.key})`}><rect x={-4} y={-30} width={8} height={30} fill="#fbbf24" stroke={INK} strokeWidth={2} /><circle cx={0} cy={-36} r={10} fill="none" stroke="#fbbf24" strokeWidth={5} /></g>}
        <Bed x={520} f={f} wave={f > 140 && !lying ? 1 : 0} mood="smile" blanket={!lying} w={520} />
        {!lying && <Person who="me" x={s.x} y={GY} s={S} pose={pose} f={f} face={{ eyes: "tired", mouth: "smile", look: f > 140 ? 0.7 : -0.5 }} />}
        {!lying && f < 60 && <Phone x={j.handR[0]} y={j.handR[1] - 20} f={f} rot={0} />}
        {lying && <g>
          <g transform={`translate(660 ${GY - 290}) rotate(-80)`}><circle r={58} fill="#fffdf8" stroke={INK} strokeWidth={11} /><path d="M -50 -18 L -56 -48 L -26 -42 L -18 -70 L 8 -50 L 28 -76 L 38 -48 L 56 -20 Q 0 -38 -50 -18 Z" fill={INK} /><path d="M -18 0 q 8 6 16 0 M 12 0 q 8 6 16 0" stroke={INK} strokeWidth={5} fill="none" /><path d="M -10 22 q 10 8 20 0" stroke={INK} strokeWidth={4} fill="none" /></g>
          <path d={`M 690 ${GY - 196} Q 720 ${GY - 290} 860 ${GY - 280} Q 1020 ${GY - 270} 1040 ${GY - 196} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {/* the blanket hugs */}
          <path d={`M 940 ${GY - 250} Q 860 ${GY - 360} 720 ${GY - 330}`} stroke="#818cf8" strokeWidth={46} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => <text key={i} x={760 + i * 70} y={GY - 420 - Math.sin(f / 10 + i) * 14} fontFamily={HAND} fontSize={50} fill="#fda4af">♥</text>)}
          {[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={`z${i}`} x={620 + t * 40} y={GY - 380 - t * 100} fontFamily={HAND} fontSize={44 + t * 26} fill="#c7d2fe" opacity={1 - t}>z</text>; })}
        </g>}
        <EnergyBar x={lying ? 760 : j.head[0]} y={lying ? GY - 560 : j.head[1] - 170} pct={lying ? 5 + 95 * s.charge : 6} text={lying && s.charge > 0 && s.charge < 1 ? `⚡ ${Math.round(5 + 95 * s.charge)}%` : undefined} />
        <TimeTag time={f < 150 ? "22:30" : "23:00"} day="Day 2 / Ngày 2" dark />
        <Label f={f} at={30} dur={90} en="Adults need 7–9 hours of sleep" vi="Người lớn cần ngủ 7–9 tiếng mỗi đêm" />
        <Label f={f} at={180} dur={90} en="Sleep is not lazy. It's recharging." vi="Ngủ không phải lười. Đó là sạc pin." />
      </g>
    );
  }
  // morning: up at 100%, brushing properly, dodging the pole in style, a wink
  const pose = alive(street
    ? (s.wink > 0 ? P({ aL: [-14, -6], aR: [120, 200] }) : P({ ...walk(f, 24, 0.9), lean: 0 }))
    : mix(P({ aL: [-150, -175], aR: [150, 175], dy: -60 * Math.sin(Math.min(1, s.jump) * Math.PI) }), P({ aL: [-16, -8], aR: [150, 222], tilt: -6 }), s.brush), f, 0.6);
  const px = street ? s.x2 : 420;
  const j = body(px, GY, pose);
  return (
    <g>
      {!street ? (
        <g>
          <rect width={VW} height={VH} fill="#fef9c3" />
          <rect x={140} y={560} width={220} height={220} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={8} /><circle cx={290} cy={620} r={34} fill="#fde047" />
          <rect x={0} y={GY} width={VW} height={VH - GY} fill="#fde68a" />
          <Bed x={560} f={f} mood="smile" blanket={false} w={480} />
        </g>
      ) : (
        <g>
          <rect width={VW} height={VH} fill="#e0f2fe" />
          {[[40, 600, 220], [320, 680, 200], [600, 620, 240], [880, 700, 200]].map(([bx, by, bw], i) => <rect key={i} x={bx} y={by} width={bw} height={GY - by} fill={["#c7d2fe", "#bfdbfe", "#ddd6fe", "#c7d2fe"][i]} stroke={INK} strokeWidth={5} />)}
          <rect x={0} y={GY} width={VW} height={VH - GY} fill="#94a3b8" />
          <g><rect x={686} y={GY - 900} width={28} height={900} fill="#64748b" stroke={INK} strokeWidth={6} /><ellipse cx={820} cy={GY - 890} rx={34} ry={16} fill="#fde68a" stroke={INK} strokeWidth={5} /><path d={`M 700 ${GY - 890} Q 770 ${GY - 960} 820 ${GY - 900}`} stroke={INK} strokeWidth={10} fill="none" /></g>
        </g>
      )}
      <g transform={`rotate(${360 * s.spin} ${px} ${GY - 230}) translate(0 ${street ? -Math.sin(s.spin * Math.PI) * 80 : 0})`}>
        <Person who="me" x={px} y={GY} s={S} pose={pose} f={f} face={{ eyes: s.wink > 0.5 ? "wink" : "big", mouth: s.brush > 0.3 ? "o" : "grin", look: s.wink > 0.5 ? 0 : 0.7, blush: true }} />
      </g>
      {s.brush > 0.2 && <g transform={`translate(${j.handR[0]} ${j.handR[1]}) rotate(${-70 + Math.sin(f * 1.6) * 12})`}><rect x={-8} y={-100} width={16} height={100} rx={6} fill="#22c55e" stroke={INK} strokeWidth={4} /><rect x={-14} y={-124} width={28} height={28} rx={4} fill="#fff" stroke={INK} strokeWidth={4} /></g>}
      {s.brush > 0.2 && [0, 1, 2].map((i) => <path key={i} transform={`translate(${j.head[0] + 80 + i * 30} ${j.head[1] + 30 - i * 40}) scale(${0.6 + 0.4 * Math.abs(Math.sin(f / 5 + i))})`} d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" fill="#fde047" />)}
      {s.wink > 0.5 && <text x={j.head[0] + 90} y={j.head[1] - 70} fontFamily={HAND} fontSize={70} fill="#f59e0b">✦</text>}
      <EnergyBar x={j.head[0]} y={j.head[1] - 170} pct={100} />
      <TimeTag time={street ? "07:40" : "06:30"} day="Day 2 / Ngày 2" />
      <Card k={s.card} f={f} />
    </g>
  );
};

export { Phone };
