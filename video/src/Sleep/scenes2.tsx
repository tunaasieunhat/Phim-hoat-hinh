// Scenes 4–6 of "What Happens If You Don't Get Enough Sleep?" — motion choreographed with GSAP timelines.
import React from "react";
import { alive, mix, P, walk, type Pose } from "../Kids/rig";
import { INK, Person } from "./people";
import { Bed, body, EnergyBar, GY, HAND, Label, S, TimeTag, VH, VW } from "./stage";
import { useTimeline } from "./timeline";

export const SIT: Pose = P({ drop: 46, lL: [86, 4], lR: [80, 8], aL: [48, 90], aR: [56, 94], lean: -4 });
const Stool: React.FC<{ x: number }> = ({ x }) => (
  <g><rect x={x - 70} y={GY - 186} width={140} height={22} rx={8} fill="#8b6b4a" stroke={INK} strokeWidth={6} /><line x1={x - 46} y1={GY - 164} x2={x - 58} y2={GY} stroke={INK} strokeWidth={10} /><line x1={x + 46} y1={GY - 164} x2={x + 58} y2={GY} stroke={INK} strokeWidth={10} /></g>
);
const Table: React.FC<{ x: number; w: number; top: number; color?: string }> = ({ x, w, top, color = "#c79a6b" }) => (
  <g><rect x={x} y={top} width={w} height={30} rx={10} fill={color} stroke={INK} strokeWidth={6} /><line x1={x + 36} y1={top + 30} x2={x + 36} y2={GY} stroke={INK} strokeWidth={11} strokeLinecap="round" /><line x1={x + w - 36} y1={top + 30} x2={x + w - 36} y2={GY} stroke={INK} strokeWidth={11} strokeLinecap="round" /></g>
);
const Zs: React.FC<{ x: number; y: number; f: number; k?: number }> = ({ x, y, f, k = 1 }) => k <= 0 ? null : (
  <g opacity={k}>{[0, 1, 2].map((i) => { const t = ((f + i * 20) % 60) / 60; return <text key={i} x={x + t * 50} y={y - t * 110} fontFamily={HAND} fontSize={50 + t * 30} fill="#94a3b8" opacity={1 - t}>z</text>; })}</g>
);
export const StarRing: React.FC<{ x: number; y: number; f: number; k?: number }> = ({ x, y, f, k = 1 }) => k <= 0 ? null : (
  <g opacity={k}>{[0, 1, 2, 3].map((i) => { const a = f / 7 + (i * Math.PI) / 2; const px = x + Math.cos(a) * 80, py = y + Math.sin(a) * 26; return i % 2 ? <path key={i} transform={`translate(${px} ${py}) rotate(${f * 6})`} d="M 0 -18 L 5 -5 L 18 -5 L 8 4 L 12 17 L 0 9 L -12 17 L -8 4 L -18 -5 L -5 -5 Z" fill="#facc15" stroke={INK} strokeWidth={3} /> : <g key={i} transform={`translate(${px} ${py})`}><ellipse rx={13} ry={9} fill="#60a5fa" stroke={INK} strokeWidth={3} /><path d="M 10 -2 l 10 -3 l -8 7 Z" fill="#fbbf24" /><path d={`M -4 -6 q -10 ${-10 * Math.sin(f / 2)} -16 0`} stroke={INK} strokeWidth={3} fill="none" /></g>; })}</g>
);

/* ---------- 4. Breakfast (15 s) ---------- */
export const SC4_LEN = 450;
export const SC4 = { pour: 33, coffee: 111, splash: 300, boing: 348 };
export const Sleep4: React.FC = () => {
  const s = useTimeline({ box: 0, boxTilt: 0, glass: 0, pot: 0, potTilt: 0, bowl: 0, fork: 0, droop: 0, plunge: 0, up: 0 }, (tl, s) => {
    tl.to(s, { box: 1, duration: 0.5, ease: "power2.out" }, 0.5).to(s, { boxTilt: 1, duration: 0.35 }, 1.0).to(s, { glass: 1, duration: 1.2, ease: "none" }, 1.15)
      .to(s, { boxTilt: 0, duration: 0.3 }, 2.4).to(s, { box: 0, duration: 0.4 }, 2.6)
      .to(s, { pot: 1, duration: 0.5, ease: "power2.out" }, 3.1).to(s, { potTilt: 1, duration: 0.35 }, 3.6).to(s, { bowl: 1, duration: 1.1, ease: "none" }, 3.75)
      .to(s, { potTilt: 0, duration: 0.3 }, 4.9).to(s, { pot: 0, duration: 0.4 }, 5.1)
      .to(s, { fork: 1, duration: 0.22, ease: "power1.inOut", yoyo: true, repeat: 5 }, 5.6)
      .to(s, { droop: 1, duration: 2.2, ease: "power1.in" }, 7.6)
      .to(s, { plunge: 1, duration: 0.22, ease: "power3.in" }, 9.8)
      .to(s, { up: 1, duration: 0.45, ease: "back.out(3)" }, 11.6);
  });
  const { f } = s;
  const x = 300;
  const arm = (k: number): Partial<Pose> => ({ aR: [56 + 64 * k, 94 + 66 * k] });
  const stab = s.fork > 0 ? { aR: [74 + 14 * s.fork, 112 - 36 * s.fork] as [number, number] } : {};
  const sitPose = P({ ...SIT, ...arm(Math.max(s.box, s.pot)), ...stab });
  const droopPose = P({ ...SIT, drop: 70, lean: -34, tilt: -26, aL: [40, 64], aR: [44, 70] });
  const plungePose = P({ ...SIT, drop: 86, lean: -52, tilt: -34, aL: [30, 40], aR: [34, 46] });
  const upPose = P({ ...SIT, lean: 6, tilt: 4, aL: [-30, -70], aR: [30, 70], dy: -10 });
  let pose = mix(mix(sitPose, droopPose, s.droop), plungePose, s.plunge);
  pose = alive(mix(pose, upPose, s.up), f, s.droop > 0.1 && s.up < 0.5 ? 0.2 : 0.6);
  const j = body(x, GY, pose);
  const hb = body(x, GY, plungePose).head;
  const top = Math.round(hb[1] + 104);
  const bowlX = hb[0], glassX = 640;
  const messy = s.up > 0.3;
  return (
    <g>
      <rect width={VW} height={VH} fill="#fff7ed" />
      <rect x={640} y={560} width={300} height={260} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={8} /><line x1={790} y1={560} x2={790} y2={820} stroke={INK} strokeWidth={6} />
      <circle cx={880} cy={610} r={30} fill="#fde047" />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#fed7aa" />
      <Stool x={x} />
      <Person who="me" x={x} y={GY} s={S} pose={pose} f={f} face={{ eyes: messy ? "spiral" : s.droop > 0.5 ? "closed" : s.fork > 0 ? "big" : "tired", mouth: messy ? "wavy" : s.droop > 0.2 ? "o" : "flat", look: 0.7, brows: s.fork > 0 && s.droop < 0.2 ? "worried" : "none" }} />
      {messy && <g>{[[-30, -30], [20, -42], [36, -6], [-40, 8], [6, 14], [-12, -50], [30, 26]].map(([dx, dy], i) => <circle key={i} cx={j.head[0] + dx} cy={j.head[1] + dy} r={9} fill="#f59e0b" stroke={INK} strokeWidth={3} />)}{[[-20, 40], [24, 44]].map(([dx, dy], i) => <path key={i} d={`M ${j.head[0] + dx} ${j.head[1] + dy} q 4 ${16 + (f % 20)} 0 ${24 + (f % 20)}`} stroke="#7c2d12" strokeWidth={7} strokeLinecap="round" fill="none" />)}</g>}
      <Table x={420} w={600} top={top} />
      {/* the glass (gets the cereal) and the bowl (gets the coffee) */}
      <g transform={`translate(${glassX} ${top})`}>
        <path d="M -40 0 L -48 -150 L 48 -150 L 40 0 Z" fill="#e0f2fe" opacity={0.7} stroke={INK} strokeWidth={5} />
        <clipPath id="glassfill"><path d="M -40 0 L -48 -150 L 48 -150 L 40 0 Z" /></clipPath>
        <g clipPath="url(#glassfill)">{Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-38 + (i * 23) % 76} cy={-8 - Math.floor(i / 4) * 15} r={9} fill="#f59e0b" stroke={INK} strokeWidth={2} opacity={i < s.glass * 30 ? 1 : 0} />)}</g>
      </g>
      <g transform={`translate(${bowlX} ${top})`}>
        <ellipse cx={0} cy={-62} rx={90} ry={16} fill={s.bowl > 0.05 ? "#7c2d12" : "#f8fafc"} />
        <path d="M -95 -62 Q -90 0 0 0 Q 90 0 95 -62" fill="#f8fafc" stroke={INK} strokeWidth={6} />
        <ellipse cx={0} cy={-62} rx={95} ry={18} fill="none" stroke={INK} strokeWidth={6} />
        {f > SC4.splash && f < SC4.splash + 30 && [-1, 1].map((sd) => [0, 1, 2].map((k) => <circle key={`${sd}${k}`} cx={sd * (60 + (f - SC4.splash) * (4 + k))} cy={-80 - (f - SC4.splash) * (6 - k) + (f - SC4.splash) ** 2 * 0.4} r={10 - k * 2} fill="#7c2d12" />))}
      </g>
      {/* cereal box and coffee pot follow the right hand */}
      {s.box > 0.01 && <g transform={`translate(${j.handR[0] + 10} ${j.handR[1] - 20}) rotate(${110 * s.boxTilt})`} opacity={Math.min(1, s.box * 3)}>
        <rect x={-46} y={-130} width={92} height={150} rx={8} fill="#ef4444" stroke={INK} strokeWidth={5} /><circle cx={0} cy={-60} r={26} fill="#fde047" /><text x={0} y={-52} textAnchor="middle" fontFamily={HAND} fontSize={26} fill={INK}>O's</text>
      </g>}
      {s.boxTilt > 0.8 && s.glass < 1 && Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={glassX - 10 + (i % 3) * 10} cy={top - 300 + ((f * 9 + i * 30) % 160)} r={8} fill="#f59e0b" stroke={INK} strokeWidth={2} />)}
      {s.pot > 0.01 && <g transform={`translate(${j.handR[0] + 10} ${j.handR[1] - 20}) rotate(${100 * s.potTilt})`} opacity={Math.min(1, s.pot * 3)}>
        <path d="M -40 10 L -50 -100 L 50 -100 L 40 10 Z" fill="#1f2937" stroke={INK} strokeWidth={5} /><path d="M 50 -90 L 76 -110 L 56 -70 Z" fill="#1f2937" stroke={INK} strokeWidth={4} /><rect x={-50} y={-120} width={100} height={22} rx={6} fill="#475569" stroke={INK} strokeWidth={4} />
      </g>}
      {s.potTilt > 0.8 && s.bowl < 1 && <path d={`M ${bowlX + 30} ${top - 340} Q ${bowlX + 10} ${top - 200} ${bowlX} ${top - 70}`} stroke="#7c2d12" strokeWidth={14} fill="none" strokeLinecap="round" />}
      {/* eating cereal with a fork */}
      {s.fork > 0 && <g transform={`translate(${j.handR[0]} ${j.handR[1]}) rotate(${-150 + 40 * s.fork})`}><rect x={-4} y={-110} width={8} height={110} rx={3} fill="#cbd5e1" stroke={INK} strokeWidth={3} />{[-8, 0, 8].map((dx) => <rect key={dx} x={dx - 2} y={-140} width={4} height={34} fill="#cbd5e1" stroke={INK} strokeWidth={2} />)}</g>}
      {f > SC4.splash + 10 && f < SC4.boing && [0, 1, 2].map((i) => { const t = ((f + i * 12) % 36) / 36; return <circle key={i} cx={bowlX - 20 + i * 20} cy={top - 90 - t * 60} r={6 + t * 6} fill="none" stroke="#7c2d12" strokeWidth={3} opacity={1 - t} />; })}
      <Zs x={j.head[0] + 70} y={j.head[1] - 60} f={f} k={s.droop > 0.3 && s.plunge < 0.5 ? 1 : 0} />
      <EnergyBar x={j.head[0]} y={j.head[1] - 170} pct={5} />
      <TimeTag time="07:00" />
      <Label f={f} at={10} en="Breakfast" vi="Bữa sáng" />
    </g>
  );
};

/* ---------- 5. On the street (20 s) ---------- */
export const SC5_LEN = 600;
export const SC5 = { bonk1: 90, bonk2: 348, turtle: 390 };
const Pole: React.FC<{ x: number; wobble?: number }> = ({ x, wobble = 0 }) => (
  <g transform={`rotate(${wobble} ${x} ${GY})`}><rect x={x - 14} y={GY - 900} width={28} height={900} fill="#64748b" stroke={INK} strokeWidth={6} /><path d={`M ${x} ${GY - 890} Q ${x + 70} ${GY - 960} ${x + 120} ${GY - 900}`} stroke={INK} strokeWidth={10} fill="none" /><ellipse cx={x + 120} cy={GY - 890} rx={34} ry={16} fill="#fde68a" stroke={INK} strokeWidth={5} /></g>
);
const Turtle: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g transform={`translate(${x} ${GY})`}>
    <ellipse cx={0} cy={-60} rx={80} ry={56} fill="#65a30d" stroke={INK} strokeWidth={6} />
    {[[-30, -80], [10, -90], [40, -66], [-10, -50]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={14} fill="#84cc16" stroke={INK} strokeWidth={3} />)}
    <circle cx={100} cy={-50 + Math.sin(f / 10) * 3} r={28} fill="#a3e635" stroke={INK} strokeWidth={5} /><circle cx={110} cy={-56} r={5} fill={INK} /><path d="M 108 -38 q 8 6 14 0" stroke={INK} strokeWidth={3} fill="none" />
    {[-50, 50].map((dx, i) => <rect key={dx} x={dx - 14} y={-14 + (Math.sin(f / 8 + i * 3) > 0 ? -6 : 0)} width={28} height={20} rx={8} fill="#a3e635" stroke={INK} strokeWidth={4} />)}
  </g>
);
export const Sleep5: React.FC = () => {
  const s = useTimeline({ x: 110, fall: 0, x2: 0, turtle: -200, wob1: 0, wob2: 0 }, (tl, s) => {
    tl.to(s, { x: 470, duration: 2.7, ease: "none" }, 0.3)
      .to(s, { wob1: 1, duration: 0.08, yoyo: true, repeat: 5 }, 3.0)
      .to(s, { fall: 1, duration: 0.45, ease: "bounce.out" }, 3.0)
      .to(s, { fall: 0, duration: 0.7, ease: "power2.out" }, 7.0)
      .to(s, { x: 790, duration: 3.3, ease: "none" }, 8.3)
      .to(s, { wob2: 1, duration: 0.08, yoyo: true, repeat: 7 }, 11.6)
      .to(s, { fall: 1, duration: 0.5, ease: "bounce.out" }, 11.6)
      .to(s, { turtle: 1260, duration: 6.6, ease: "none" }, 13.0);
  });
  const { f } = s;
  const walking = (f > 9 && f < 90) || (f > 249 && f < 348);
  const pose = alive(walking ? P({ ...walk(f, 30, 0.75), aL: walk(f, 30, 0.75).aL, tilt: 8 }) : s.fall > 0.5 ? P({ aL: [-150, -170], aR: [150, 170] }) : P({ aL: [-20, -10], aR: [20, 10] }), f, 0.5);
  const fallAng = -86 * s.fall;
  const j = body(s.x, GY, pose);
  // where the head is once fallen (rotate the head point around the feet)
  const rot = (p: [number, number]): [number, number] => { const a = (fallAng * Math.PI) / 180, dx = p[0] - s.x, dy = p[1] - GY; return [s.x + dx * Math.cos(a) - dy * Math.sin(a), GY + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const head = rot(j.head);
  const down = s.fall > 0.6;
  return (
    <g>
      <rect width={VW} height={VH} fill="#dbeafe" />
      {[[40, 560, 220, 520], [300, 660, 180, 420], [520, 600, 240, 480], [800, 680, 200, 400]].map(([bx, by, bw, bh], i) => <g key={i}><rect x={bx} y={by} width={bw} height={bh + 200} fill={["#c7d2fe", "#bfdbfe", "#ddd6fe", "#c7d2fe"][i]} stroke={INK} strokeWidth={5} />{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={bx + 30 + c * (bw / 2)} y={by + 40 + r * 110} width={bw / 2 - 60} height={60} fill="#fff" opacity={0.7} />))}</g>)}
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#94a3b8" /><rect x={0} y={GY} width={VW} height={20} fill="#cbd5e1" />
      <Pole x={560} wobble={s.wob1 * 4} />
      <g transform={`rotate(${fallAng} ${s.x} ${GY})`}>
        <Person who="me" x={s.x} y={GY} s={S} pose={pose} f={f} face={{ eyes: down ? "spiral" : "tired", mouth: down ? "wavy" : "flat", look: 0.8 }} />
      </g>
      <Pole x={880} wobble={s.wob2 * 5} />
      <StarRing x={head[0]} y={head[1] - 70} f={f} k={down ? 1 : 0} />
      {(f > SC5.bonk1 && f < SC5.bonk1 + 24) || (f > SC5.bonk2 && f < SC5.bonk2 + 24) ? <text x={f > SC5.bonk2 ? 900 : 590} y={GY - 640} fontFamily={HAND} fontSize={f > SC5.bonk2 ? 110 : 84} fill="#ef4444" stroke={INK} strokeWidth={6} paintOrder="stroke fill">BONK!</text> : null}
      <Turtle x={s.turtle} f={f} />
      {f > SC5.turtle + 60 && s.turtle < 1100 && <text x={s.turtle + 40} y={GY - 200} fontFamily={HAND} fontSize={48} fill={INK}>excuse me</text>}
      <EnergyBar x={down ? head[0] + 140 : j.head[0]} y={down ? head[1] - 120 : j.head[1] - 170} pct={4} />
      <TimeTag time="07:45" />
      <Label f={f} at={10} en="Reaction time: turtle" vi="Phản xạ: rùa bò" />
    </g>
  );
};

/* ---------- 6. In class (20 s) ---------- */
export const SC6_LEN = 600;
export const SC6 = { dream: 150, teacher: 345, alert: 390, ping: [405, 411] };
export const Sleep6: React.FC = () => {
  const s = useTimeline({ nod: 0, dream: 0, teach: -220, jolt: 0, picks: 0, alertK: 0 }, (tl, s) => {
    tl.to(s, { nod: 1, duration: 3, ease: "power1.in" }, 0.5)
      .to(s, { dream: 1, duration: 0.5, ease: "back.out(2)" }, 5.0)
      .to(s, { dream: 0, duration: 0.25 }, 13.0)
      .to(s, { teach: 150, duration: 1.4, ease: "power2.out" }, 11.5)
      .to(s, { nod: 0, duration: 0.15 }, 13.0)
      .to(s, { jolt: 1, duration: 0.12, ease: "power4.out" }, 13.0).to(s, { jolt: 0, duration: 0.6, ease: "bounce.out" }, 13.15)
      .to(s, { picks: 1, duration: 0.45, ease: "power3.out" }, 13.05)
      .to(s, { alertK: 1, duration: 0.2, ease: "back.out(3)" }, 13.0);
  });
  const { f } = s;
  const x = 360;
  const swing = s.nod * Math.sin(f / 13) * 26;
  const pose = alive(P({ ...SIT, aL: [48, 92], aR: [56, 96], tilt: swing - (s.nod > 0.5 ? 4 : 0), lean: -4 + s.nod * 4, dy: -s.jolt * 50 }), f, 0.5);
  const j = body(x, GY, pose);
  const r = 46 * S, rot = pose.lean + pose.tilt;
  const eye = (sx: number) => { const a = (rot * Math.PI) / 180, ex = sx * r * 0.36, ey = -r * 0.04; return [j.head[0] + ex * Math.cos(a) - ey * Math.sin(a), j.head[1] + ex * Math.sin(a) + ey * Math.cos(a)]; };
  const awake = f > SC6.alert;
  return (
    <g>
      <rect width={VW} height={VH} fill="#fef3c7" />
      <rect x={0} y={500} width={VW} height={34} fill="#a16207" stroke={INK} strokeWidth={5} />
      <g transform="translate(900 680)"><circle r={74} fill="#fff" stroke={INK} strokeWidth={7} /><line x1={0} y1={0} x2={0} y2={-52} stroke={INK} strokeWidth={6} transform={`rotate(${Math.floor(f / 30) * 6})`} /><line x1={0} y1={0} x2={34} y2={0} stroke={INK} strokeWidth={7} /></g>
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#e7d2b4" />
      {/* the teacher sneaks up behind */}
      <Person who="teacher" x={s.teach} y={GY} s={S} pose={alive(P({ aL: [60, -40], aR: [-60, 40], lean: -4 }), f, 0.4)} f={f} face={{ eyes: "open", mouth: "flat", brows: "angry", look: 0.8 }} />
      <Stool x={x} />
      <Person who="me" x={x} y={GY} s={S} pose={pose} f={f} face={{ eyes: awake ? "wide" : s.nod > 0.6 && Math.abs(swing) > 18 ? "closed" : "big", mouth: awake ? "o" : "flat", look: 0.6, sweat: awake, brows: awake ? "up" : "none" }} />
      <Table x={430} w={560} top={GY - 300} />
      <rect x={560} y={GY - 316} width={200} height={16} rx={3} fill="#fff" stroke={INK} strokeWidth={3} />
      {/* toothpicks holding the eyes open, then flying up into the ceiling */}
      {[-1, 1].map((sx) => {
        const [ex, ey] = eye(sx);
        const fly = s.picks;
        const px = ex + sx * 40 * fly, py = ey + (534 - ey + 40) * fly;
        return <g key={sx} transform={`translate(${px} ${py}) rotate(${(fly > 0 ? sx * 20 * fly : rot)})`}><rect x={-3} y={-28} width={6} height={56} rx={3} fill="#d6a76b" stroke={INK} strokeWidth={2} /></g>;
      })}
      {/* dream bubble: the bed on a cloud, waving */}
      {s.dream > 0.01 && <g transform={`translate(720 790) scale(${s.dream})`}>
        {[[-150, 120, 14], [-120, 160, 9]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill="#fff" stroke={INK} strokeWidth={4} />)}
        <path d="M -200 40 Q -230 -60 -130 -90 Q -90 -170 10 -140 Q 100 -190 160 -110 Q 250 -90 220 10 Q 250 100 140 110 Q 60 150 -40 120 Q -170 140 -200 40 Z" fill="#fff" stroke={INK} strokeWidth={5} />
        <g transform="scale(0.4) translate(-300 -1340)"><Bed x={0} f={f} wave={1} mood="smile" w={600} /></g>
        <path d="M -170 80 Q -100 50 -30 80 Q 40 50 110 80 Q 170 60 190 90 L -180 100 Z" fill="#e0f2fe" />
      </g>}
      {s.alertK > 0 && f < SC6.alert + 60 && <text x={x + 110} y={j.head[1] - 60} fontFamily={HAND} fontSize={140 * s.alertK} fill="#ef4444" stroke={INK} strokeWidth={7} paintOrder="stroke fill">!!</text>}
      <EnergyBar x={j.head[0]} y={j.head[1] - 170} pct={3} />
      <TimeTag time="09:30" />
      <Label f={f} at={10} en="Focus: 0%" vi="Tập trung: 0%" />
    </g>
  );
};
