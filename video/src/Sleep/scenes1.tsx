// Scenes 1–3 of "What Happens If You Don't Get Enough Sleep?" — no words, only action, labels and sound.
import React from "react";
import { useCurrentFrame } from "remotion";
import { alive, mix, P, pop, tw, walk } from "../Kids/rig";
import { INK, Person } from "./people";
import { Bed, body, EnergyBar, GY, HAND, Label, Phone, S, SITBED, TimeTag, VH, VW } from "./stage";

/* ---------- 1. "Just one more video" (20 s) ---------- */
export const SC1_LEN = 600;
// clock times and when the hero turns down the bed
export const SC1 = { times: [0, 150, 300, 450] as const, beg: [[60, 190], [320, 420]] as const, ding: 468 };
export const Sleep1: React.FC = () => {
  const f = useCurrentFrame();
  const ti = f < 150 ? 0 : f < 300 ? 1 : f < 450 ? 2 : 3;
  const time = ["23:00", "00:30", "02:00", "03:47"][ti];
  const begging = SC1.beg.some(([a, b]) => f >= a && f < b);
  const shake = SC1.beg.some(([a, b]) => f >= a + 30 && f < b) ? Math.sin(f * 0.7) * 14 : 0;
  const frozen = f >= SC1.ding;
  const swipe = frozen ? 0 : Math.sin(f * (0.5 + f / 900)) * 8;
  const pose = alive({ ...SITBED, lean: 22, tilt: -14 + shake, aL: [64, 150], aR: [74, 160 + swipe] }, f, frozen ? 0 : 0.6);
  const hx = 330, hy = GY - 40; // hips on the mattress
  const j = body(hx, hy, pose);
  const eyes = frozen ? "spiral" : f > 300 ? "tired" : "open";
  const zoom = 1 + 0.18 * tw(f, SC1.ding, SC1.ding + 24);
  return (
    <g>
      <rect width={VW} height={VH} fill="#1b2140" />
      <g transform={`translate(${j.head[0]} ${j.head[1]}) scale(${zoom}) translate(${-j.head[0]} ${-j.head[1]})`}>
        {/* window with the moon, and the wall clock spinning faster and faster */}
        <rect x={500} y={540} width={200} height={200} rx={10} fill="#0f172a" stroke={INK} strokeWidth={8} />
        <circle cx={640} cy={610} r={34} fill="#fde68a" /><circle cx={656} cy={598} r={30} fill="#0f172a" />{[[540, 600], [580, 690], [670, 700], [530, 680]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />)}<line x1={600} y1={540} x2={600} y2={740} stroke={INK} strokeWidth={6} /><line x1={500} y1={640} x2={700} y2={640} stroke={INK} strokeWidth={6} />
        <g transform="translate(850 680)">
          <circle r={96} fill="#fff" stroke={INK} strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-78} x2={0} y2={-66} stroke={INK} strokeWidth={5} transform={`rotate(${i * 30})`} />)}
          <line x1={0} y1={0} x2={0} y2={-70} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${frozen ? 280 : f * f * 0.02})`} />
          <line x1={0} y1={0} x2={0} y2={-44} stroke="#ef4444" strokeWidth={9} strokeLinecap="round" transform={`rotate(${frozen ? 110 : f * f * 0.0017 - 30})`} />
          <circle r={8} fill={INK} />
        </g>
        <rect x={0} y={GY} width={VW} height={VH - GY} fill="#111633" />
        <Bed x={70} f={f} wave={begging ? 1 : 0} mood={begging ? "smile" : "sad"} blanket={false} w={720} />
        <Person who="me" x={hx} y={hy} s={S} pose={pose} f={f} face={{ eyes, mouth: frozen ? "flat" : f > 300 ? "flat" : "smile", look: 0.7, brows: f > 300 && !frozen ? "worried" : "none" }} />
        {/* the phone light on the face */}
        <circle cx={j.head[0]} cy={j.head[1]} r={62} fill="#38bdf8" opacity={0.22} />
        <path d={`M ${j.handR[0] + 10} ${j.handR[1] - 40} L ${j.head[0] + 50} ${j.head[1] - 60} L ${j.head[0] + 40} ${j.head[1] + 50} Z`} fill="#7dd3fc" opacity={0.18} />
        <Phone x={j.handR[0] + 6} y={j.handR[1] - 30} f={frozen ? 0 : f} />
        {/* blanket over the legs, its corner waving: "come to sleep" */}
        <path d={`M 360 ${GY - 196} Q 400 ${GY - 270} 560 ${GY - 260} Q 760 ${GY - 250} 790 ${GY - 160} L 790 ${GY - 110} L 360 ${GY - 110} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <g transform={`translate(780 ${GY - 190}) rotate(${begging ? -40 - 40 * (0.5 + 0.5 * Math.sin(f / 4)) : -10})`}><path d="M 0 0 Q 30 -20 70 -10 Q 110 0 120 30 Q 90 40 60 34 Q 20 30 0 40 Z" fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></g>
        {begging && <text x={120} y={GY - 470} fontFamily={HAND} fontSize={60} fill="#c7d2fe" opacity={0.6 + 0.4 * Math.sin(f / 5)}>♥</text>}
        <EnergyBar x={j.head[0]} y={j.head[1] - 140} pct={interp(f, [0, 590], [100, 55])} />
        {frozen && <text x={j.head[0] + 120} y={j.head[1] - 40} fontFamily={HAND} fontSize={80} fill="#fde68a" stroke={INK} strokeWidth={6} paintOrder="stroke fill" transform={`scale(1)`} opacity={pop(f, SC1.ding + 6, 10)}>...</text>}
      </g>
      <TimeTag time={time} pulse={[150, 300, 450].some((t) => f >= t && f < t + 10) ? 1 - ((f % 150) / 10) : 0} dark />
      <Label f={f} at={8} dur={90} en="23:00 – Just one more video" vi="23:00 – Thêm một video nữa thôi" />
    </g>
  );
};
const interp = (f: number, a: [number, number], b: [number, number]) => b[0] + (b[1] - b[0]) * Math.min(1, Math.max(0, (f - a[0]) / (a[1] - a[0])));

/* ---------- 2. The alarm (15 s) ---------- */
export const SC2_LEN = 450;
export const SC2 = { slap: 75, up: 100, walk0: 150, walk1: 420, groans: [130, 300] };
export const Sleep2: React.FC = () => {
  const f = useCurrentFrame();
  const ringing = f < SC2.slap;
  const k = tw(f, SC2.walk0, SC2.walk1, 0, 1, (t) => t);
  const meX = 380 + k * 470;
  const bedX = 60 + Math.max(0, k - 0.08) * 400;
  const standing = tw(f, SC2.up, SC2.walk0);
  const zombie = P({ aL: [86, 92], aR: [80, 96], lean: -10, tilt: 14 });
  const w = walk(f, 44, 0.45);
  const pose = alive(f < SC2.up ? P({ ...SITBED, drop: 140, lean: 60, aR: [f > SC2.slap - 20 ? 120 : 40, f > SC2.slap - 20 ? 110 : 60] }) : mix(P({ ...SITBED, ...zombie }), { ...zombie, lL: w.lL, lR: w.lR, dy: w.dy }, standing), f, 0.4);
  const y = f < SC2.walk0 ? GY - 170 + 170 * standing : GY;
  const j = body(meX, y, pose);
  return (
    <g>
      <rect width={VW} height={VH} fill="#cfe3f5" />
      <rect x={560} y={560} width={300} height={280} rx={10} fill="#fef9c3" stroke={INK} strokeWidth={8} />
      <line x1={710} y1={560} x2={710} y2={840} stroke={INK} strokeWidth={6} /><line x1={560} y1={700} x2={860} y2={700} stroke={INK} strokeWidth={6} />
      {/* the door on the right */}
      <rect x={940} y={GY - 640} width={180} height={640} fill="#a16207" stroke={INK} strokeWidth={8} /><circle cx={965} cy={GY - 320} r={12} fill="#fde047" stroke={INK} strokeWidth={4} />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#9fb8d3" />
      {/* nightstand + alarm clock */}
      <rect x={880} y={GY - 200} width={60} height={200} fill="#b08968" stroke={INK} strokeWidth={5} opacity={f < SC2.walk0 ? 1 : 0} />
      {f < SC2.walk0 && <g transform={`translate(${ringing ? 905 + Math.sin(f * 2.2) * 8 : 905} ${GY - 250}) rotate(${ringing ? Math.sin(f * 1.7) * 14 : 0})`}>
        <circle cx={-26} cy={-50} r={16} fill="#fbbf24" stroke={INK} strokeWidth={4} /><circle cx={26} cy={-50} r={16} fill="#fbbf24" stroke={INK} strokeWidth={4} />
        <circle r={48} fill="#ef4444" stroke={INK} strokeWidth={5} /><circle r={34} fill="#fff" stroke={INK} strokeWidth={3} />
        <line x1={0} y1={0} x2={0} y2={-24} stroke={INK} strokeWidth={5} /><line x1={0} y1={0} x2={18} y2={0} stroke={INK} strokeWidth={5} />
        {ringing && [-1, 1].map((sd) => <path key={sd} d={`M ${sd * 64} -30 l ${sd * 20} -12 M ${sd * 70} 0 l ${sd * 26} 0 M ${sd * 64} 30 l ${sd * 20} 12`} stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      </g>}
      {/* the bed follows, dragged by the blanket stuck on your foot */}
      <Bed x={bedX} f={f} wave={f > SC2.walk0 ? 0.6 : 0} mood={f > SC2.walk0 ? "sad" : "smile"} blanket={f < SC2.up} w={560} tilt={f > SC2.walk0 ? Math.sin(f / 3) * 1.2 : 0} />
      {f >= SC2.up && <path d={`M ${bedX + 300} ${GY - 196} Q ${(bedX + 300 + j.footL[0]) / 2} ${GY - 120} ${j.footL[0] - 10} ${j.footL[1] - 20} L ${j.footL[0] + 26} ${j.footL[1] + 4} L ${j.footL[0] - 30} ${j.footL[1] + 6} Q ${(bedX + 300 + j.footL[0]) / 2} ${GY - 80} ${bedX + 300} ${GY - 120} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
      <Person who="me" x={meX} y={y} s={S} pose={pose} f={f} face={{ eyes: f < SC2.up ? "closed" : "tired", mouth: f >= SC2.up && (f % 150) < 70 ? "o" : "wavy", look: 0.6 }} />
      {f < SC2.up && <path d={`M 230 ${GY - 196} Q 300 ${GY - 300} 470 ${GY - 290} Q 640 ${GY - 280} 620 ${GY - 196} Z`} fill="#818cf8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
      {f >= SC2.up && <text x={j.head[0] + 70} y={j.head[1] - 60} fontFamily={HAND} fontSize={56} fill="#64748b" opacity={0.5 + 0.5 * Math.sin(f / 8)}>uuughh</text>}
      <EnergyBar x={j.head[0]} y={j.head[1] - 150} pct={10} shake={Math.sin(f * 0.9) * 3} />
      <TimeTag time="06:00" pulse={f < 12 ? 1 - f / 12 : 0} />
    </g>
  );
};

/* ---------- 3. Brushing (15 s) ---------- */
export const SC3_LEN = 450;
export const SC3 = { paste: 40, brush0: 80, brush1: 200, load: 200, realize: 300 };
const Spinner: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; const on = (Math.floor(f / 3) - i + 80) % 8; return <circle key={i} cx={Math.cos(a) * 34} cy={Math.sin(a) * 34} r={9} fill="#3b82f6" opacity={0.2 + (on / 8) * 0.8} />; })}
  </g>
);
export const Sleep3: React.FC = () => {
  const f = useCurrentFrame();
  const brushing = f >= SC3.brush0 && f < SC3.brush1;
  const real = f >= SC3.realize;
  const lookMirror = f >= SC3.load;
  const brushA = brushing ? Math.sin(f * 0.8) * 22 : 0;
  // left hand: the comb (with toothpaste); right hand: the toothbrush on the head, then down
  const pose = alive(P({
    aL: [44, 100], aR: brushing ? [150, 230 + brushA] : f < SC3.brush0 ? [50, 110] : [30, 60],
    tilt: brushing ? -6 : 0, lean: real ? 8 : 0,
  }), f, 0.6);
  const mx = 330, j = body(mx, GY, pose), jr = body(830, GY, pose, true);
  const foam = tw(f, SC3.brush0 + 20, SC3.brush1);
  const comb = (x: number, y: number, rot = -20) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1.3)`}>
      <rect x={-10} y={-70} width={20} height={70} rx={6} fill="#f472b6" stroke={INK} strokeWidth={4} />
      <rect x={-10} y={-150} width={20} height={84} fill="#f9a8d4" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={10} y1={-146 + i * 14} x2={30} y2={-146 + i * 14} stroke={INK} strokeWidth={4} />)}
      {f >= SC3.paste && <path d="M 12 -150 q 22 -10 18 20 q 10 20 -6 40 q 14 20 -4 36" fill="none" stroke="#e0f2fe" strokeWidth={14} strokeLinecap="round" />}
      {f >= SC3.paste && <path d="M 12 -150 q 22 -10 18 20 q 10 20 -6 40 q 14 20 -4 36" fill="none" stroke="#38bdf8" strokeWidth={4} strokeLinecap="round" opacity={0.6} />}
    </g>
  );
  const brush = (x: number, y: number, rot: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x={-8} y={-110} width={16} height={110} rx={6} fill="#22c55e" stroke={INK} strokeWidth={4} /><rect x={-14} y={-136} width={28} height={30} rx={4} fill="#fff" stroke={INK} strokeWidth={4} /></g>
  );
  const foamBlobs = (cx: number, cy: number, k: number) => k <= 0 ? null : <g>{[[-30, -40], [0, -54], [28, -42], [-12, -30], [16, -28]].map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={(14 + (i % 2) * 6) * Math.min(1, k * 2 - i * 0.2)} fill="#f0f9ff" stroke="#bae6fd" strokeWidth={3} />)}</g>;
  return (
    <g>
      <rect width={VW} height={VH} fill="#e0f2fe" />
      {Array.from({ length: 10 }).map((_, r) => Array.from({ length: 10 }).map((__, c) => <rect key={`${r}${c}`} x={c * 110} y={480 + r * 110} width={106} height={106} fill="#bae6fd" opacity={0.35} />))}
      {/* the mirror and your reflection */}
      <rect x={590} y={520} width={420} height={520} rx={30} fill="#f8fafc" stroke={INK} strokeWidth={10} />
      <clipPath id="mirror"><rect x={600} y={530} width={400} height={500} rx={24} /></clipPath>
      <g clipPath="url(#mirror)">
        <rect x={600} y={530} width={400} height={500} fill="#dbeafe" />
        <Person who="me" x={830} y={GY} s={S} pose={pose} f={f} flip face={{ eyes: real ? "wide" : "tired", mouth: real ? "o" : "flat", look: 0.5 }} />
        {foamBlobs(jr.head[0], jr.head[1] - 30, foam)}
        {lookMirror && f < SC3.realize + 60 && <Spinner x={jr.head[0]} y={jr.head[1] - 130} f={f} s={1.3} />}
        <path d="M 640 560 L 700 560 L 620 680 Z" fill="#fff" opacity={0.6} />
      </g>
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#93c5fd" />
      {/* sink */}
      <rect x={600} y={GY - 300} width={400} height={50} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
      <rect x={720} y={GY - 250} width={160} height={250} fill="#f1f5f9" stroke={INK} strokeWidth={6} />
      <Person who="me" x={mx} y={GY} s={S} pose={pose} f={f} face={{ eyes: real ? "wide" : "tired", mouth: real ? "o" : "flat", look: lookMirror ? 0.9 : 0.4, brows: real ? "up" : "none" }} />
      {foamBlobs(j.head[0], j.head[1] - 30, foam)}
      {comb(j.handL[0] + 4, j.handL[1] + 10, -30)}
      {f >= SC3.brush0 ? brush(j.handR[0], j.handR[1] + 6, brushing ? -110 + brushA : 160) : <g transform={`translate(${j.handR[0]} ${j.handR[1]}) rotate(-30)`}><rect x={-14} y={-60} width={28} height={70} rx={8} fill="#fff" stroke={INK} strokeWidth={4} /><rect x={-8} y={-74} width={16} height={16} fill="#38bdf8" stroke={INK} strokeWidth={3} /></g>}
      {real && <text x={j.head[0] + 90} y={j.head[1] - 120} fontFamily={HAND} fontSize={130} fill="#ef4444" stroke={INK} strokeWidth={7} paintOrder="stroke fill" transform={`rotate(10 ${j.head[0] + 90} ${j.head[1] - 120})`} opacity={pop(f, SC3.realize, 10)}>!</text>}
      <EnergyBar x={j.head[0]} y={j.head[1] - 170} pct={7} />
      <TimeTag time="06:20" />
      <Label f={f} at={SC3.load + 4} dur={90} en="Brain: loading…" vi="Não: đang tải…" y={400} />
    </g>
  );
};

export { INK };
