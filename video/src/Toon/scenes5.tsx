// Scenes 5–7 of the rainy-day toon: healthy cooking → noodles in a blanket; Max calls; the rainy-day report.
import React from "react";
import { useTimeline } from "../Sleep/timeline";
import { Head, INK, LilyHair, LilyHairBack, Toon, toonJoints, type Expr } from "./Lily";
import { Blanket, BubbleTea, Cake, ChefHat, Kettle, MAX, MaxHair, Noodles, Popcorn } from "./cast";
import { Cam, Cloud, Grade, Mug, Phone, Rays, Spark, Zs } from "./props";
import { Flash, lines, PlanReality, SIT, talking, type SP } from "./scenes";
import { Bedroom, Kitchen, NightHouse } from "./sets2";
import { Desk, H, Outside, RainyRoom, W } from "./sets";

const Big: React.FC<{ text: string; x?: number; y?: number; k: number; c?: string; size?: number; r?: number }> = ({ text, x = 540, y = 400, k, c = "#fde047", size = 110, r = -6 }) => k <= 0.01 ? null : (
  <text transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={size} fill={c} stroke={INK} strokeWidth={16} paintOrder="stroke fill">{text}</text>
);
const Hearts: React.FC<{ x: number; y: number; t: number; k?: number }> = ({ x, y, t, k = 1 }) => <g>{[0, 1, 2].map((i) => { const q = ((t * 0.7 + i * 0.33) % 1); return <text key={i} x={x + i * 40 + Math.sin(t * 3 + i) * 10} y={y - q * 170} fontFamily="ToonSans" fontWeight={800} fontSize={56} fill="#f472b6" stroke={INK} strokeWidth={5} paintOrder="stroke fill" opacity={k * (1 - q)}>♥</text>; })}</g>;
// Lily on the sofa, arms tucked inside a purple blanket wrap; only the hands peek out (hold = what they hold)
// Lily wrapped in the blanket like a cosy burrito: a hood behind her head, the front wrap closed from the chin down
// to the knees (shins and slippers peek out underneath), hands out at the opening. hood 0 → 1 pulls the whole
// blanket over her head until only her eyes peek out of a dark gap.
const Burrito: React.FC<{ f: number; expr: Expr; mouth?: number; hold?: React.ReactNode; hood?: number; head?: number; id: string }> = ({ f, expr, mouth = 0, hold, hood = 0, head = 0, id }) => {
  const pose = { ...SIT, head };
  const j = toonJoints(250, 1360, 0.98, pose);
  const n = j.neck, hp = j.hip, h = j.head, r = j.r;
  const base = hp[1] + 34, L = hp[0] - 175, R = hp[0] + 205;
  const breathe = Math.sin(f / 16) * 4;
  // the closed cocoon (head covered), rising from the seat as hood goes 0 → 1
  const cocoon = (
    <g clipPath={`url(#cc${id})`}><clipPath id={`cc${id}`}><rect x={L - 200} y={h[1] - r * 3} width={R - L + 400} height={base - h[1] + r * 3 + 12} /></clipPath><g transform={`translate(0 ${(1 - hood) * (base - h[1] + r * 1.6)})`}>
      <path d={`M ${L} ${base} Q ${L - 30} ${n[1]} ${h[0] - r * 1.25} ${h[1] - r * 0.2} Q ${h[0] - r * 1.1} ${h[1] - r * 1.55 + breathe} ${h[0] + r * 0.1} ${h[1] - r * 1.5 + breathe} Q ${h[0] + r * 1.4} ${h[1] - r * 1.4} ${h[0] + r * 1.3} ${h[1] + r * 0.2} Q ${R + 20} ${n[1] + 80} ${R} ${base} Z`} fill="#8b5cf6" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d={`M ${h[0] - r * 0.95} ${h[1] - r * 0.95} Q ${h[0] - r * 0.2} ${h[1] - r * 1.25} ${h[0] + r * 0.6} ${h[1] - r * 0.9}`} stroke="#a78bfa" strokeWidth={10} fill="none" strokeLinecap="round" />
      {[[-0.7, 0.9], [0.1, 1.4], [0.9, 1.0], [-0.3, 2.0], [0.6, 2.1]].map(([dx, dy], i) => <circle key={i} cx={h[0] + r * dx} cy={h[1] + r * dy} r={8} fill="#ddd6fe" />)}
      {/* the gap the eyes peek through */}
      <ellipse cx={h[0] + 8} cy={h[1] - 4} rx={r * 0.62} ry={r * 0.26} fill="#1e1b4b" stroke={INK} strokeWidth={6} />
      {hood > 0.85 && [-1, 1].map((sd) => <g key={sd}><ellipse cx={h[0] + 8 + sd * r * 0.26} cy={h[1] - 4} rx={r * 0.1} ry={r * 0.13 * (f % 90 < 4 ? 0.15 : 1)} fill="#fff" /><circle cx={h[0] + 11 + sd * r * 0.26} cy={h[1] - 2} r={r * 0.05} fill={INK} /></g>)}
    </g></g>
  );
  return (
    <g>
      {/* hood behind the head */}
      <path d={`M ${h[0] - r * 1.32} ${h[1] + r * 0.5} Q ${h[0] - r * 1.45} ${h[1] - r * 1.35} ${h[0]} ${h[1] - r * 1.42} Q ${h[0] + r * 1.45} ${h[1] - r * 1.35} ${h[0] + r * 1.32} ${h[1] + r * 0.5} Q ${R} ${n[1] + 40} ${R} ${base} L ${L} ${base} Q ${L} ${n[1] + 40} ${h[0] - r * 1.32} ${h[1] + r * 0.5} Z`} fill="#6d28d9" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <Toon id={id} x={250} y={1360} s={0.98} pose={pose} expr={expr} blush look={{ mouth, look: 0.4 }} arms={false} />
      {/* the front wrap: closed from the chin down to the knees, with a folded lapel */}
      <path d={`M ${h[0] - r * 1.25} ${h[1] + r * 0.55} Q ${h[0]} ${h[1] + r * 1.25} ${h[0] + r * 1.25} ${h[1] + r * 0.55} Q ${R + 30} ${n[1] + 60 + breathe} ${R} ${base} Q ${hp[0] + 10} ${base + 26} ${L} ${base} Q ${L - 20} ${n[1] + 60 + breathe} ${h[0] - r * 1.25} ${h[1] + r * 0.55} Z`} fill="#8b5cf6" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d={`M ${h[0] + r * 0.35} ${h[1] + r * 1.1} Q ${h[0] + r * 0.8} ${n[1] + 140} ${hp[0] + 60} ${base + 8}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M ${h[0] - r * 1.05} ${h[1] + r * 0.75} Q ${h[0]} ${h[1] + r * 1.35} ${h[0] + r * 1.05} ${h[1] + r * 0.75}`} stroke="#c4b5fd" strokeWidth={9} fill="none" strokeLinecap="round" />
      {[[-110, 40], [-40, 90], [130, 60], [-120, 150], [150, 160]].map(([dx, dy], i) => <circle key={i} cx={hp[0] + dx} cy={n[1] + dy + 60} r={8} fill="#ddd6fe" />)}
      {hold && hood < 0.5 && <g transform={`translate(${n[0] + 70} ${n[1] + 150})`}>{hold}<circle cx={-46} cy={-30} r={17} fill="#fff" stroke={INK} strokeWidth={7} /><circle cx={46} cy={-34} r={17} fill="#fff" stroke={INK} strokeWidth={7} /></g>}
      {hood > 0.02 && cocoon}
    </g>
  );
};
const Table: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g><rect x={480} y={1440} width={420} height={26} rx={10} fill="#7a5038" stroke={INK} strokeWidth={7} /><line x1={510} y1={1466} x2={510} y2={1600} stroke={INK} strokeWidth={12} /><line x1={870} y1={1466} x2={870} y2={1600} stroke={INK} strokeWidth={12} />{children}</g>
);

/* ---------- 5. Plan: cook something healthy · Reality: noodles in a blanket ---------- */
export const Toon5: React.FC<SP> = ({ sc }) => {
  const s = useTimeline({ page: 0, chop: 0, cut: 0, veg: 0, show: 0, zD: 1.3, pour: 0, slurp: 0, drop: 0, two: 0, items: 0, pat: 0, zJ: 1.55 }, (tl, v) => {
    tl.to(v, { page: 1, duration: 0.5 }, 1.0)
      .to(v, { chop: 1, duration: 0.14, yoyo: true, repeat: 13, ease: "power2.in" }, 2.5).to(v, { cut: 7, duration: 2.0, ease: "none" }, 2.5)
      .to(v, { veg: 7, duration: 2.0, ease: "none" }, 4.9)
      .to(v, { show: 1, duration: 0.3, ease: "back.out(2.5)" }, 7.05).to(v, { zD: 1.6, duration: 0.18, ease: "power4.out" }, 7.7)
      .to(v, { pour: 1, duration: 0.4, ease: "power2.out" }, 9.6)
      .to(v, { slurp: 1, duration: 0.35, yoyo: true, repeat: 7, ease: "sine.inOut" }, 12.2)
      .to(v, { drop: 1, duration: 0.35, ease: "bounce.out" }, 18.1).to(v, { two: 1, duration: 0.3, ease: "back.out(3)" }, 18.4)
      .to(v, { items: 6, duration: 2.4, ease: "none" }, 20.9)
      .to(v, { pat: 1, duration: 0.25, yoyo: true, repeat: 5 }, 24.2).to(v, { zJ: 1.25, duration: 3.2, ease: "power1.out" }, 23.8);
  });
  const { f } = s, t = f / 30;
  let plan: React.ReactNode = null;
  const chef = <g transform="translate(0 -118) scale(0.95)"><ChefHat /></g>;
  if (t < 2.4) {
    plan = (
      <Cam x={540} y={1020} z={1.25}><Kitchen f={f}>
        <Toon id="l5a" x={540} y={1420} s={0.95} pose={{ aF: [50, 110], aB: [-40, -130] }} expr="determined" blush faceExtra={chef}
          holdF={<g transform="translate(-20 30) rotate(-6) scale(0.85)"><rect x={-90} y={-120} width={180} height={130} rx={10} fill="#16a34a" stroke={INK} strokeWidth={7} /><text y={-60} textAnchor="middle" fontFamily="KidsHand" fontSize={36} fill="#fff">HEALTHY</text><text y={-24} textAnchor="middle" fontFamily="KidsHand" fontSize={36} fill="#fff">RECIPES</text></g>} />
      </Kitchen></Cam>
    );
  } else if (t < 4.8) {
    const kx = 700 - s.cut * 34;
    plan = (
      <g>
        <Cam x={540} y={1150} z={2.2}><Kitchen f={f} /></Cam>
        <rect x={140} y={1080} width={800} height={70} rx={16} fill="#fcd34d" stroke={INK} strokeWidth={10} />
        <path d={`M 230 1050 L ${kx - 10} 1030 L ${kx - 10} 1090 L 230 1080 Z`} fill="#f97316" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M 230 1050 l -60 -40 M 230 1066 l -70 10" stroke="#16a34a" strokeWidth={14} strokeLinecap="round" />
        {Array.from({ length: Math.floor(s.cut) }).map((_, i) => { const a = Math.min(1, s.cut - i - 0.2); return <ellipse key={i} cx={kx + 40 + i * 26 + a * 40} cy={1060 - Math.sin(a * Math.PI) * 120} rx={14} ry={26} fill="#fb923c" stroke={INK} strokeWidth={5} transform={`rotate(${a * 200} ${kx + 40 + i * 26 + a * 40} ${1060 - Math.sin(a * Math.PI) * 120})`} />; })}
        <g transform={`translate(${kx + 20} ${880 + 140 * s.chop})`}><path d="M -14 0 L 40 0 L 40 200 L -14 150 Z" fill="#e5e7eb" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><rect x={-22} y={-110} width={60} height={120} rx={14} fill="#7c2d12" stroke={INK} strokeWidth={9} /><line x1={8} y1={-60} x2={420} y2={-700} stroke={INK} strokeWidth={22} strokeLinecap="round" /><circle cx={8} cy={-60} r={40} fill="#fff" stroke={INK} strokeWidth={10} /></g>
        <line x1={190} y1={1040} x2={-60} y2={700} stroke={INK} strokeWidth={22} strokeLinecap="round" /><circle cx={190} cy={1040} r={40} fill="#fff" stroke={INK} strokeWidth={10} />
        <Big text="CHOP CHOP!" y={1640} k={1} size={100} c="#fde68a" />
      </g>
    );
  } else if (t < 7.0) {
    const veg: [string, number, number][] = [["#22c55e", -120, -40], ["#ef4444", 60, -80], ["#84cc16", 130, 30], ["#f97316", -40, 60], ["#16a34a", -150, 60], ["#facc15", 20, -10], ["#dc2626", 150, -40]];
    plan = (
      <Cam x={540} y={960} z={1.05} r={3 * Math.sin(t)}>
        <rect width={W} height={H} fill="#f8fafc" />{Array.from({ length: 10 }).map((_, i) => <line key={i} x1={0} y1={i * 200} x2={W} y2={i * 200} stroke="#e2e8f0" strokeWidth={8} />)}
        <circle cx={540} cy={960} r={400} fill="#fff" stroke={INK} strokeWidth={14} /><circle cx={540} cy={960} r={330} fill="#ecfccb" stroke="#d9f99d" strokeWidth={10} />
        {veg.map(([c, x, y], i) => { const k = Math.max(0, Math.min(1, s.veg - i)); return k <= 0 ? null : <g key={i} transform={`translate(${540 + x} ${960 + y - (1 - k) * 700}) scale(${0.6 + 0.4 * k})`}><circle r={70} fill={c} stroke={INK} strokeWidth={8} /><circle cx={-18} cy={-20} r={16} fill="#fff" opacity={0.35} /></g>; })}
        {s.veg > 6.9 && <><Spark x={300} y={600} s={1.4} /><Spark x={800} y={1350} s={1.2} /></>}
        <Big text="SO HEALTHY!" y={1600} k={Math.min(1, s.veg / 3)} c="#86efac" size={96} />
      </Cam>
    );
  } else {
    plan = (
      <Cam x={540} y={1000 - (s.zD - 1.3) * 200} z={s.zD}>
        <Rays x={540} y={800} f={f} a="#d9f99d" b="#bef264" />
        <Toon id="l5d" x={540} y={1800} s={1.3} pose={{ aF: [70, 120], aB: [-150 * s.show, -200 * s.show] }} expr="happy" blush faceExtra={chef}
          holdF={<g transform="translate(20 -20)"><path d="M -110 0 Q -110 80 0 80 Q 110 80 110 0 Z" fill="#fff" stroke={INK} strokeWidth={8} />{[["#22c55e", -60], ["#ef4444", -10], ["#84cc16", 40], ["#f97316", 80]].map(([c, x], i) => <circle key={i} cx={x as number} cy={-10 - (i % 2) * 14} r={26} fill={c as string} stroke={INK} strokeWidth={5} />)}</g>} />
        {[[200, 700], [880, 760], [180, 1200]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={1 + 0.3 * Math.sin(f / 4 + i)} c="#fff" />)}
      </Cam>
    );
  }
  // REALITY
  let real: React.ReactNode = null;
  const living = (z: number, x: number, y: number, kids: React.ReactNode, cloud?: React.ReactNode) => <Cam x={x} y={y} z={z}><Grade k={1} id={`g5${Math.round(z * 10)}${x}`}><RainyRoom f={f} lamp={0.4} fg={false} cloud={cloud} /></Grade>{kids}</Cam>;
  if (t < 12.0) {
    plan = plan as React.ReactNode;
    real = (
      <g>
        <Grade k={1} id="g5e"><Cam x={540} y={1150} z={1.8}><Kitchen f={f} /></Cam></Grade>
        <g transform="translate(520 1500)"><Noodles s={2.2} f={f} /></g>
        <g transform={`translate(${380} ${900 - 30 * s.pour}) rotate(${-10 + 40 * s.pour})`}><Kettle /></g>
        {s.pour > 0.6 && <path d={`M 560 ${830} Q 600 ${1000} 560 1220`} stroke="#bae6fd" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.85} />}
        <g transform="translate(860 520) rotate(6)"><rect x={-130} y={-70} width={260} height={130} rx={24} fill="#111827" stroke={INK} strokeWidth={8} /><text y={30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={84} fill="#4ade80">3:00</text></g>
      </g>
    );
  } else if (t < 15.2) {
    const sl = s.slurp;
    real = living(1.75, 330, 1080, <g>
      <Burrito id="l5f" f={f} expr="chew" mouth={sl} hold={<g><Noodles s={0.75} f={f} /><line x1={-20} y1={-90} x2={-60 - 30 * sl} y2={-260 + 40 * sl} stroke="#a16207" strokeWidth={8} strokeLinecap="round" /><path d={`M 0 -90 Q -40 ${-200 - 30 * sl} -70 -250`} stroke="#fde68a" strokeWidth={9} fill="none" /></g>} />
      <Hearts x={360} y={880} t={t} />
    </g>);
  } else if (t < 18.0) {
    real = living(2.1, 540, 640, null, <g><Cloud x={540} y={600} s={1.05} f={f} mood="happy" /><g transform={`translate(${380} ${660 + Math.sin(f / 4) * 6})`}><Popcorn s={1.4} /></g>{[0, 1].map((i) => { const k = ((t * 1.4 + i * 0.5) % 1); return <circle key={i} cx={380 + 40 * i + k * 60} cy={560 - k * 120} r={14} fill="#fef3c7" stroke={INK} strokeWidth={4} opacity={1 - k} />; })}</g>);
  } else if (t < 20.8) {
    real = (
      <g>
        {living(2.4, 690, 1380, <Table />)}
        <g transform={`translate(560 ${1560 - (1 - s.drop) * 900}) rotate(${(1 - s.drop) * 30})`}><Noodles s={2.3} f={f} open={false} /></g>
        <Big text="#2" x={860} y={900} k={s.two} c="#fde68a" size={260} r={8} />
        {s.two > 0.5 && <><Spark x={250} y={800} s={1.6} /><Spark x={920} y={1300} s={1.3} /></>}
      </g>
    );
  } else if (t < 23.8) {
    const it = (i: number) => Math.max(0, Math.min(1, s.items - i));
    real = (
      <Cam x={540} y={960} z={1.05} r={-6}>
        <Grade k={1} id="g5i"><rect width={W} height={H} fill="#4a3426" /><rect x={90} y={360} width={900} height={1200} rx={40} fill="#7a5038" stroke={INK} strokeWidth={14} /></Grade>
        {[[300, 620, 0], [700, 600, 1], [520, 1000, 2], [300, 1300, 3], [780, 1260, 4], [560, 1440, 5]].map(([x, y, i]) => it(i) <= 0 ? null : (
          <g key={i} transform={`translate(${x} ${y}) scale(${it(i)}) rotate(${(i % 2 ? 10 : -12)})`}>
            {i < 2 ? <g><ellipse rx={110} ry={110} fill="#fff" stroke={INK} strokeWidth={9} /><ellipse rx={84} ry={84} fill="#e5e7eb" /><text y={14} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#ef4444">{i + 1}</text></g>
              : i === 2 ? <Cake s={2} bite /> : i === 3 ? <g><circle r={80} fill="#d6b38a" stroke={INK} strokeWidth={8} /><circle r={18} fill="#f472b6" stroke={INK} strokeWidth={5} /></g>
              : <path d="M -80 -40 L 80 -50 L 70 40 L -70 50 Z" fill={i === 4 ? "#fca5a5" : "#93c5fd"} stroke={INK} strokeWidth={7} strokeLinejoin="round" />}
          </g>
        ))}
      </Cam>
    );
  } else {
    real = living(s.zJ, 340, 1120, <g>
      <Burrito id="l5j" f={f} expr="happy" hold={<g transform={`translate(0 ${-10 * s.pat})`}><circle r={1} /></g>} />
      <Hearts x={330} y={900} t={t} />
      <text x={520} y={880} fontFamily="KidsHand" fontSize={70} fill="#fde68a" stroke={INK} strokeWidth={6} paintOrder="stroke fill" opacity={s.pat > 0 ? 1 : 0}>*pat pat*</text>
    </g>);
  }
  return <PlanReality sc={sc} plan={plan} reality={real} en="Plan: cook something healthy" vi="Kế hoạch: nấu món lành mạnh" />;
};

/* ---------- 6. Max calls: the rain stopped! ---------- */
export const Toon6: React.FC<SP> = ({ sc }) => {
  const s = useTimeline({ sun: 0, cloudX: -500, boom: 0, dark: 0, nod: 0, hood: 0, zE: 1.6, zI: 1.2 }, (tl, v) => {
    tl.to(v, { sun: 1, duration: 1.2, ease: "power1.out" }, 0.6)
      .to(v, { zE: 2.3, duration: 1.5, ease: "power2.in" }, 9.0)
      .to(v, { cloudX: 560, duration: 1.4, ease: "power3.out" }, 14.1).to(v, { boom: 1, duration: 0.06 }, 15.6).to(v, { boom: 0, duration: 0.6 }, 15.7).to(v, { dark: 1, duration: 0.5 }, 15.6)
      .to(v, { nod: 1, duration: 0.2, yoyo: true, repeat: 3 }, 17.4).to(v, { hood: 1, duration: 0.7, ease: "power2.inOut" }, 18.6)
      .to(v, { zI: 1.45, duration: 2.5, ease: "power1.inOut" }, 19.8);
  });
  const { f } = s, t = f / 30;
  const sunny = <g>{[0, 1, 2].map((i) => <path key={i} d={`M ${300 + i * 120} ${520 + (i % 2) * 40} q 14 -14 28 0 q 14 -14 28 0`} stroke={INK} strokeWidth={6} fill="none" transform={`translate(${Math.sin(f / 10 + i) * 30} 0)`} />)}<path d="M 300 900 A 260 260 0 0 1 820 900" stroke="#f87171" strokeWidth={22} fill="none" opacity={0.8} /><path d="M 322 900 A 238 238 0 0 1 798 900" stroke="#fde047" strokeWidth={22} fill="none" opacity={0.8} /><path d="M 344 900 A 216 216 0 0 1 776 900" stroke="#60a5fa" strokeWidth={22} fill="none" opacity={0.8} /></g>;
  const living = (z: number, x: number, y: number, kids: React.ReactNode, opts: { sunny?: number; rain?: number; cloud?: React.ReactNode } = {}) => (
    <Cam x={x} y={y} z={z}><RainyRoom f={f} sunny={opts.sunny ?? 1} rain={opts.rain ?? 0} lamp={0.5} fg={false} cloud={opts.cloud} />{kids}</Cam>
  );
  let shot: React.ReactNode;
  if (t < 2.6) {
    const vib = Math.sin(f * 2.6) * 6;
    shot = (
      <g>
        {living(2.6, 690, 1420, <Table />)}
        <rect width={W} height={H} fill="#fde68a" opacity={0.2 * s.sun} />
        <path d="M 1080 0 L 1080 600 L 200 1920 L -200 1920 Z" fill="#fff7d6" opacity={0.25 * s.sun} />
        <g transform={`translate(${540 + vib} 1000) rotate(${-8 + vib * 0.5})`}><Phone s={5.2} screen="#bbf7d0" /><circle cy={-50} r={70} fill="#3b82f6" stroke={INK} strokeWidth={7} /><text y={110} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={58} fill={INK}>Max</text></g>
        {[-1, 1].map((sd) => <path key={sd} d={`M ${540 + sd * 220} 760 l ${sd * 50} -40 M ${540 + sd * 230} 900 l ${sd * 60} 0 M ${540 + sd * 220} 1040 l ${sd * 50} 40`} stroke={INK} strokeWidth={10} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f)} />)}
      </g>
    );
  } else if (t < 5.6) {
    const mo = talking(sc, "Max", t);
    shot = (
      <g>
        <clipPath id="top6"><rect width={W} height={960} /></clipPath><clipPath id="bot6"><rect y={960} width={W} height={960} /></clipPath>
        <g clipPath="url(#top6)">
          <rect width={W} height={960} fill="#7dd3fc" /><circle cx={880} cy={180} r={90} fill="#fde047" stroke={INK} strokeWidth={8} />
          <path d="M 120 700 A 420 420 0 0 1 960 700" stroke="#f87171" strokeWidth={30} fill="none" opacity={0.7} /><path d="M 150 700 A 390 390 0 0 1 930 700" stroke="#fde047" strokeWidth={30} fill="none" opacity={0.7} />
          <rect y={760} width={W} height={200} fill="#4ade80" />
          <Toon id="m6" x={540} y={1000} s={0.95} outfit={MAX} hair={(r) => <MaxHair r={r} />} hairBack={() => null} pose={{ aF: [140, 170 + Math.sin(f / 3) * 15], aB: [-30, -10] }} expr={mo ? "talk" : "happy"} look={{ mouth: mo }} />
        </g>
        <g clipPath="url(#bot6)">{living(1.6, 330, 941, <Burrito id="l6b" f={f} expr="shock" hold={<g transform="translate(0 -60)"><Phone s={1.3} /></g>} />, { sunny: 1, rain: 0 })}</g>
        <rect y={950} width={W} height={20} fill="#fff" stroke={INK} strokeWidth={6} />
      </g>
    );
  } else if (t < 7.4 || (t >= 9.0 && t < 10.6)) {
    const z = t < 7.4 ? 1.7 : s.zE;
    shot = living(z, 540, 680, null, { sunny: 1, rain: 0, cloud: sunny });
  } else if (t < 9.0) {
    shot = living(2.6, 360, 1300, <g><Blanket w={420} h={170} f={f} mood="puppy" /><Spark x={140} y={1180} s={0.8} c="#fff" /><Spark x={600} y={1200} s={0.7} c="#fff" /></g>);
    shot = <g>{living(2.2, 300, 1250, null)}<g transform={`translate(540 1250) scale(${2.1 + 0.03 * Math.sin(f / 5)})`}><Blanket w={420} h={170} f={f} mood="puppy" /></g><Spark x={200} y={820} s={1.2} c="#fff" /><Spark x={880} y={760} s={1} c="#fff" /></g>;
  } else if (t < 14.0) {
    const mo = talking(sc, "Lily", t);
    shot = living(2.4, 280, 1080, <Burrito id="l6f" f={f} expr={mo ? "talk" : "deadpan"} mouth={mo} hold={<g transform="translate(0 -60)"><Phone s={1.2} /></g>} />, { sunny: 1, rain: 0 });
  } else if (t < 17.2) {
    const k = s.dark;
    shot = (
      <g>
        <rect width={W} height={H} fill={k > 0.5 ? "#55657d" : "#7dd3fc"} />
        <circle cx={850} cy={300} r={110} fill="#fde047" stroke={INK} strokeWidth={8} opacity={1 - k} />
        <rect y={1500} width={W} height={420} fill={k > 0.5 ? "#3f5246" : "#4ade80"} />
        <g transform="translate(540 1500)"><rect x={-260} y={-520} width={520} height={520} fill="#c2847a" stroke={INK} strokeWidth={10} /><rect x={-150} y={-420} width={300} height={260} fill="#ffd27f" stroke={INK} strokeWidth={9} /><line x1={0} y1={-420} x2={0} y2={-160} stroke={INK} strokeWidth={7} /><path d="M -320 -500 L 0 -760 L 320 -500 Z" fill="#7c2d12" stroke={INK} strokeWidth={10} strokeLinejoin="round" /></g>
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={s.cloudX - 300 - i * 30} y1={500 + i * 40} x2={s.cloudX - 600 - i * 60} y2={500 + i * 40} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={s.cloudX < 540 ? 0.8 : 0} />)}
        <Cloud x={s.cloudX} y={620} s={1.3} f={f} mood={k > 0.5 ? "smug" : "grumpy"} rain={k} />
        <Big text="BOOM!" y={300} k={k > 0 ? Math.min(1, k * 2) : 0} c="#fde047" size={150} r={-8} />
        <Flash k={s.boom} />
      </g>
    );
  } else if (t < 19.8) {
    shot = living(2.4, 280, 1080, <Burrito id="l6h" f={f} expr={s.hood > 0.5 ? "happy" : "smug"} head={s.nod * 14} hood={s.hood} />, { sunny: 0, rain: 1 });
  } else {
    shot = living(s.zI, 420, 1000, <Burrito id="l6i" f={f} expr="happy" hood={1} />, { sunny: 0, rain: 1, cloud: <Cloud x={560} y={600} s={0.9} f={f} mood="smug" wave={1} /> });
  }
  return <g>{shot}</g>;
};

/* ---------- 7. The rainy-day report, and tomorrow ---------- */
export const Toon7: React.FC<SP> = ({ sc }) => {
  const s = useTimeline({ zA: 1.0, x0: 0, x1: 0, x2: 0, x3: 0, r0: 0, r1: 0, r2: 0, r3: 0, zD: 1.3, lamp: 1, yawn: 0, end: 0 }, (tl, v) => {
    tl.to(v, { zA: 1.35, duration: 2.9, ease: "power1.in" }, 0);
    ["x0", "x1", "x2", "x3"].forEach((k, i) => tl.to(v, { [k]: 1, duration: 0.2, ease: "back.out(3)" }, 3.4 + i * 0.4));
    ["r0", "r1", "r2", "r3"].forEach((k, i) => tl.to(v, { [k]: 1, duration: 0.3, ease: "back.out(2.5)" }, 6.3 + i * 0.55));
    tl.to(v, { zD: 1.75, duration: 3.8, ease: "none" }, 8.8).to(v, { yawn: 1, duration: 0.4, yoyo: true, repeat: 1 }, 20.6).to(v, { lamp: 0, duration: 0.1 }, 21.6)
      .to(v, { end: 1, duration: 0.5, ease: "back.out(1.8)" }, 24.2);
  });
  const { f } = s, t = f / 30;
  const night = (z: number, x: number, y: number, kids: React.ReactNode, lamp = 1) => <Cam x={x} y={y} z={z}><Bedroom f={f} night={1} lamp={lamp} />{kids}</Cam>;
  // Lily in bed: head on the pillow, the duvet pulled up to the chin
  // Lily in bed: head upright on a big pillow, the duvet pulled up to her chin over a body-shaped bump,
  // both hands holding its edge
  const inBed = (expr: Expr, mouth = 0) => {
    const hx = 118, hy = 1012, rr = 74, br = Math.sin(f / 18) * 3;
    return (
      <g>
        <ellipse cx={hx} cy={hy + 38} rx={112} ry={58} fill="#f8fafc" stroke={INK} strokeWidth={8} />
        <path d={`M ${hx - 70} ${hy + 50} q 70 -26 140 0`} stroke="#cbd5e1" strokeWidth={6} fill="none" />
        <g transform={`translate(${hx} ${hy}) rotate(-12)`}><Head id="h7" r={rr} expr={expr} look={{ mouth, look: 0.3 }} blush hair={<LilyHair r={rr} />} back={<LilyHairBack r={rr} />} /></g>
        <path d={`M 36 ${1078 + br} Q ${hx} ${1062 + br} 200 ${1074 + br} Q 300 ${1040 + br} 360 ${1070 + br} Q 410 1050 446 1080 L 470 1262 L 20 1262 Z`} fill="#f472b6" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M 40 ${1100 + br} Q ${hx} ${1086 + br} 200 ${1096 + br}`} stroke="#fbcfe8" strokeWidth={14} fill="none" strokeLinecap="round" />
        {[[150, 1170], [260, 1140], [350, 1190], [420, 1140]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={10} fill="#fbcfe8" />)}
        {[hx - 38, hx + 34].map((x, i) => <circle key={i} cx={x} cy={1090 + br + i * 2} r={15} fill="#fff" stroke={INK} strokeWidth={6} />)}
      </g>
    );
  };
  let shot: React.ReactNode;
  if (t < 2.9) shot = <Cam x={600} y={1150} z={s.zA}><NightHouse f={f} /></Cam>;
  else if (t < 6.0) {
    const items = ["Read a book", "Work out", "Clean my room", "Cook healthy"];
    shot = (
      <Cam x={540} y={960} z={1.05} r={-3}>
        <Desk f={f}>
          <g transform="rotate(-4 540 960)">
            <rect x={190} y={460} width={700} height={900} rx={10} fill="#fffdf6" stroke={INK} strokeWidth={8} />
            <text x={540} y={560} textAnchor="middle" fontFamily="KidsHand" fontSize={84} fill="#db2777">TODAY'S PLAN</text>
            {items.map((it, k) => <g key={it}><rect x={290} y={720 + k * 130} width={50} height={50} rx={8} fill="#fff" stroke={INK} strokeWidth={5} /><text x={370} y={768 + k * 130} fontFamily="KidsHand" fontSize={70} fill={INK}>{it}</text>
              {[s.x0, s.x1, s.x2, s.x3][k] > 0.01 && <g transform={`translate(315 ${745 + k * 130}) scale(${[s.x0, s.x1, s.x2, s.x3][k] * 1.0})`}><path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke="#ef4444" strokeWidth={18} strokeLinecap="round" /></g>}</g>)}
          </g>
        </Desk>
        <rect width={W} height={H} fill="#0b1026" opacity={0.35} />
      </Cam>
    );
  } else if (t < 8.8) {
    const rows: [string, string, string, string][] = [["Books read", "Sách đã đọc", "0.001", "#ef4444"], ["Workouts", "Bài tập", "0", "#ef4444"], ["Noodles", "Mì gói", "2", "#f59e0b"], ["Happiness", "Hạnh phúc", "100%", "#16a34a"]];
    const vals = [s.r0, s.r1, s.r2, s.r3];
    shot = (
      <g>
        <rect width={W} height={H} fill="#312e81" />{Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 397) % 1920} r={4} fill="#c7d2fe" opacity={0.3} />)}
        <g transform="translate(540 820)">
          <rect x={-460} y={-420} width={920} height={840} rx={40} fill="#fffdf5" stroke={INK} strokeWidth={12} />
          <text y={-310} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={66} fill="#db2777">RAINY DAY REPORT</text>
          {rows.map(([en, vi, val, c], i) => vals[i] <= 0.01 ? null : (
            <g key={en} transform={`translate(0 ${-180 + i * 160}) scale(${vals[i]})`}>
              <text x={-400} y={0} fontFamily="ToonSans" fontWeight={800} fontSize={54} fill={INK}>{en}</text>
              <text x={-400} y={48} fontFamily="ToonSans" fontWeight={800} fontSize={36} fill="#64748b">{vi}</text>
              <text x={400} y={24} textAnchor="end" fontFamily="ToonSans" fontWeight={800} fontSize={84} fill={c}>{val}</text>
            </g>
          ))}
        </g>
      </g>
    );
  } else if (t < 12.6) shot = night(s.zD, 330, 1080, <g>{inBed("happy")}{[0, 1].map((i) => <path key={i} d={`M ${420 + i * 30} ${880 - i * 30} q 20 -10 0 -30`} stroke="#fde68a" strokeWidth={6} fill="none" opacity={0.6 + 0.4 * Math.sin(f / 8 + i)} />)}</g>);
  else if (t < 14.4) shot = night(2.3, 750, 600, null);
  else if (t < 16.6) shot = night(2.7, 560, 1150, <g transform="translate(540 1210)"><Noodles s={0.75} f={f} empty /><line x1={-30} y1={-100} x2={40} y2={-170} stroke="#a16207" strokeWidth={7} /><line x1={-14} y1={-100} x2={52} y2={-160} stroke="#a16207" strokeWidth={7} /><text x={70} y={-130} fontFamily="ToonSans" fontWeight={800} fontSize={40} fill="#f472b6" stroke={INK} strokeWidth={4} paintOrder="stroke fill">♥</text></g>);
  else if (t < 21.0) {
    const mo = talking(sc, "Lily", t);
    shot = night(2.5, 230, 1080, inBed(mo ? "talk" : s.yawn > 0.3 ? "shock" : "sleepy", mo));
  } else if (t < 24.0) shot = night(1.3, 470, 1060, <g>{inBed("sleepy")}<Zs x={200} y={900} f={f} s={0.9} /><g clipPath="url(#winbr)"><Cloud x={750} y={560} s={0.6} f={f} mood="happy" /></g></g>, s.lamp);
  else {
    shot = (
      <g>
        <rect width={W} height={H} fill="#1e1b4b" />
        {Array.from({ length: 60 }).map((_, i) => { const q = ((f * 0.02 + ((i * 0.618) % 1)) % 1); const x = (i * 97) % 1080; return <line key={i} x1={x} y1={-60 + q * 2000} x2={x - 8} y2={-20 + q * 2000} stroke="#818cf8" strokeWidth={3} opacity={0.5} />; })}
        <Cloud x={540} y={460} s={1.4} f={f} mood="happy" wave={1} />
        {s.end > 0.01 && <g transform={`translate(540 860) scale(${s.end})`}>
          <rect x={-470} y={-150} width={940} height={330} rx={40} fill="#312e81" stroke={INK} strokeWidth={10} />
          <text y={-50} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={72} fill="#fde68a">What do YOU do</text>
          <text y={36} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={72} fill="#fde68a">on rainy days?</text>
          <text y={128} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={48} fill="#fff">Ngày mưa bạn thường làm gì?</text>
        </g>}
      </g>
    );
  }
  void lines; void Mug; void Outside; void BubbleTea;
  return <g>{shot}</g>;
};
