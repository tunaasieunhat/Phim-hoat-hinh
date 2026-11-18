// Scenes 4–7 of "What if everything was free?": nobody works, the empty store, the economics lesson, the refund.
import React from "react";
import { useTimeline } from "../Sleep/timeline";
import { INK, Toon } from "../Toon/Lily";
import { Cam, Rays, Spark, Zs } from "../Toon/props";
import { talking } from "../Toon/scenes";
import { BAKER, Bob, FARMER, Gus, King, Megaphone, Townie } from "./cast";
import { ChefCap, Cucumber, Glasses, Horse, Piano, PriceTag, Rod, Spider, StrawHat, Sweat } from "./props";
import { Big, END, T, type FP } from "./scenes1";
import { Shop } from "./sets";
import { Bakery, Classroom, Factory, Farm, Lake, Living, Palace, Street } from "./sets2";

const Lying: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => <g transform={`rotate(-90 ${x} ${y})`}>{children}</g>;

/* ---------- 4. Nobody goes to work ---------- */
export const Free4: React.FC<FP> = ({ sc }) => {
  const cB = T(sc, 1) - 0.2, cC = T(sc, 2) - 0.25, cD = T(sc, 3) - 0.25, cE = T(sc, 4) - 0.25, cF = cE + 2.2, cG = T(sc, 5) - 0.1;
  const s = useTimeline({ zA: 1.1, throw: 0, zE: 1.3, bob: 0, zG: 1.3 }, (tl, v) => {
    tl.to(v, { zA: 1.35, duration: cB, ease: "none" }, 0).to(v, { throw: 1, duration: 0.6, ease: "power1.out" }, cB + 1.6)
      .to(v, { zE: 2.1, duration: cF - cE, ease: "power2.in" }, cE).to(v, { bob: 1, duration: 0.5, yoyo: true, repeat: 9, ease: "sine.inOut" }, cF)
      .to(v, { zG: 1.0, duration: END(sc) - cG, ease: "power1.out" }, cG);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={1000} z={s.zA}><Factory f={f} /><g transform="translate(540 520)"><circle r={90} fill="#fff" stroke={INK} strokeWidth={9} /><line x1={0} y1={0} x2={0} y2={-64} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${t * 60})`} /></g></Cam>;
  else if (t < cC) {
    shot = <Cam x={540} y={1150} z={1.45}><Living f={f}>
      <Townie i={1} id="t4b" x={430} y={1600} s={1.0} expr="deadpan" pose={{ aF: [120, 60], aB: [-120, -60] }} />
      <g transform={`translate(${720 + 500 * s.throw} ${1300 - Math.sin(s.throw * Math.PI) * 400}) rotate(${s.throw * 540})`}><circle r={60} fill="#ef4444" stroke={INK} strokeWidth={8} /><circle r={42} fill="#fff" /><circle cx={-40} cy={-56} r={18} fill="#fde047" stroke={INK} strokeWidth={5} /><circle cx={40} cy={-56} r={18} fill="#fde047" stroke={INK} strokeWidth={5} /></g>
      <Big text="WORK?" x={430} y={720} k={1} size={110} c="#fde68a" /><Big text="WHY?" x={760} y={880} k={t > cB + 1.0 ? 1 : 0} size={90} c="#fca5a5" r={8} />
    </Living></Cam>;
  } else if (t < cD) {
    shot = <Cam x={420} y={1080} z={1.5}><Bakery f={f}>
      <Lying x={420} y={1170}><Toon id="t4c" x={420} y={1170} s={0.85} outfit={BAKER} hair={(r) => <ChefCap r={r} />} hairBack={() => null} expr="sleepy" pose={{ aB: [-40, -20], aF: [40, 20], lB: [-6, -2], lF: [6, 2] }} /></Lying>
      <Zs x={200} y={880} f={f} s={1.1} />
    </Bakery></Cam>;
  } else if (t < cE) {
    shot = <Cam x={540} y={1250} z={1.35}><Farm f={f}>
      <path d="M 300 1500 Q 540 1600 780 1500" stroke="#a16207" strokeWidth={10} fill="none" />
      <Lying x={720} y={1460}><Toon id="t4d" x={720} y={1460} s={0.8} outfit={FARMER} hair={(r) => <StrawHat r={r} />} hairBack={() => null} expr="sleepy" pose={{ aB: [-150, -170], aF: [150, 170], lB: [-6, -2], lF: [10, 4] }} /></Lying>
      <Zs x={300} y={1230} f={f} />
    </Farm></Cam>;
  } else if (t < cF) shot = <Cam x={810} y={1150} z={s.zE}><Street f={f} closed sign="Closed. Why would I work?" /></Cam>;
  else if (t < cG) {
    shot = <Cam x={300} y={1080} z={1.5}><Lake f={f}>
      <Gus id="g4f" x={60} y={1230} s={0.9} expr="happy" droop={0} pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [80, 120], aB: [60, 100] }} extra={<StrawHat />} holdF={<g transform="rotate(-10)"><Rod bob={s.bob} /></g>} />
    </Lake></Cam>;
  } else {
    shot = <Cam x={460} y={1000} z={s.zG}><Lake f={f} sunset={1}>
      <path d="M 160 520 L 160 1240 M 880 520 L 880 1240" stroke="#78350f" strokeWidth={22} />
      {[160, 880].map((x) => <circle key={x} cx={x} cy={500} r={110} fill="#166534" stroke={INK} strokeWidth={6} />)}
      <path d={`M 160 760 Q 520 ${1020 + Math.sin(f / 15) * 10} 880 760`} stroke="#fde68a" strokeWidth={70} fill="none" />
      <Lying x={620} y={960}><Gus id="g4g" x={620} y={960} s={0.75} expr="sleepy" pose={{ aB: [-150, -170], aF: [-150, -170], lB: [-4, -2], lF: [6, 2] }} extra={<StrawHat />} /></Lying>
      <path d={`M 160 760 Q 520 ${1060 + Math.sin(f / 15) * 10} 880 760`} stroke="#fcd34d" strokeWidth={30} fill="none" opacity={0.8} />
      <Zs x={320} y={780} f={f} />
    </Lake></Cam>;
  }
  return <g>{shot}</g>;
};

/* ---------- 5. Out of stuff ---------- */
export const Free5: React.FC<FP> = ({ sc }) => {
  const cB = T(sc, 0), cC = T(sc, 1) - 0.2, cD = T(sc, 2) - 0.2, cE = T(sc, 3) - 0.15, cF = T(sc, 4) - 0.25, cG = cF + 4.4;
  const s = useTimeline({ pages: 0, door: 0, walk: 0, web: 0, bite: 0, zF: 1.3 }, (tl, v) => {
    tl.to(v, { pages: 7, duration: 2.0, ease: "power1.in" }, 0.2).to(v, { door: 1, duration: 0.5, ease: "back.out(1.6)" }, cB + 0.3)
      .to(v, { walk: 1, duration: cD - cC, ease: "none" }, cC).to(v, { web: 1, duration: 1.8, ease: "none" }, cD)
      .to(v, { zF: 1.6, duration: cG - cF, ease: "none" }, cF).to(v, { bite: 0.75, duration: END(sc) - cF - 0.5, ease: "steps(5)" }, cF + 0.4);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  if (t < cB) {
    shot = <g><rect x={-200} y={-200} width={1480} height={2320} fill="#fde68a" />{Array.from({ length: 7 }).map((_, i) => { const k = Math.max(0, Math.min(1, s.pages - i)); return <g key={i} transform={`translate(${540 + k * 700} ${880 - k * 500}) rotate(${k * 60})`} opacity={1 - k}><rect x={-260} y={-300} width={520} height={600} rx={20} fill="#fff" stroke={INK} strokeWidth={10} /><rect x={-260} y={-300} width={520} height={130} rx={20} fill="#ef4444" stroke={INK} strokeWidth={10} /><text y={120} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={220} fill={INK}>{i + 1}</text></g>; })}
      <Big text="1 WEEK LATER…" y={1560} k={1} size={96} /></g>;
  } else if (t < cC) {
    shot = <Cam x={540} y={1050} z={1.2}>
      <rect x={-900} y={-900} width={2900} height={3800} fill="#cbd5e1" />
      <rect x={160} y={300} width={760} height={1100} rx={40} fill="#f1f5f9" stroke={INK} strokeWidth={12} />
      <rect x={200} y={340} width={680} height={1020} rx={20} fill="#fffde7" />
      <ellipse cx={540} cy={420} rx={300} ry={90} fill="#fff9c4" opacity={0.8} />
      {[640, 900, 1160].map((y) => <rect key={y} x={210} y={y} width={660} height={14} fill="#bfdbfe" stroke={INK} strokeWidth={4} />)}
      <g transform="translate(540 870) rotate(-8)"><Cucumber s={1.4} /></g>
      <g transform={`translate(920 340) scale(${1 - s.door * 1.4} 1)`}><rect x={-760} y={0} width={760} height={1100} rx={40} fill="#e2e8f0" stroke={INK} strokeWidth={12} /></g>
      <Bob id="b5b" x={160} y={1800} s={1.1} expr="worried" pose={{ aF: [90, 80], aB: [-20, -10] }} />
      <Big text="GRRR…" x={300} y={1440} k={t > cB + 1.2 ? 1 : 0} size={80} c="#fca5a5" r={-4} />
    </Cam>;
  } else if (t < cD) {
    const x = 100 + 560 * s.walk, ph = Math.sin(t * 9);
    shot = <Cam x={560} y={1150} z={1.15}><Street f={f} closed empty dusk={0.6}>
      <Bob id="b5c" x={x} y={1480} s={0.95} expr="worried" pose={{ lB: [-24 * ph, -8], lF: [24 * ph, 8], aB: [20 * ph, 10], aF: [-20 * ph, -10] }} />
      <g transform={`translate(${((t * 300) % 1600) - 300} ${1440 - Math.abs(Math.sin(t * 5)) * 40}) rotate(${t * 300})`}><circle r={46} fill="none" stroke="#a16207" strokeWidth={7} /><path d="M -36 -18 L 36 18 M -26 28 L 26 -28" stroke="#a16207" strokeWidth={6} /></g>
    </Street></Cam>;
  } else if (t < cE) {
    shot = <Cam x={380} y={900} z={1.4}><Shop f={f} stock={0} noShelves lights={0.4} web={s.web}>
      <g transform={`translate(300 ${400 + s.web * 240})`}><line x1={0} y1={-400} x2={0} y2={-30} stroke="#e5e7eb" strokeWidth={3} /><Spider s={1.6} f={f} /></g>
    </Shop><rect x={-900} y={-900} width={2900} height={3800} fill="#0f172a" opacity={0.25} /></Cam>;
  } else if (t < cF) {
    shot = <Cam x={540} y={1050} z={1.25}><Factory f={f} grass={1.2}>
      <Bob id="b5e" x={540} y={1560} s={0.95} expr="worried" pose={{ aF: [20, 10], aB: [-20, -10] }} />
      <g transform="translate(540 560)"><rect x={-330} y={-80} width={660} height={160} rx={20} fill="#111827" stroke={INK} strokeWidth={9} /><text y={-14} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill="#94a3b8">FOOD MADE TODAY</text><text y={58} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={70} fill="#ef4444">0</text></g>
    </Factory></Cam>;
  } else {
    const close = t >= cG;
    shot = <Cam x={close ? 540 : 520} y={close ? 900 : 1150} z={close ? 2.3 : s.zF}><Living f={f} dim={0.5}>
      <g transform="translate(560 1560)"><Piano s={1.0} /></g>
      <g transform="translate(980 1640) scale(-1 1)"><Horse s={0.8} /></g>
      <Bob id="b5f" x={560} y={1290} s={0.95} expr="chew" look={{ mouth: Math.abs(Math.sin(t * 6)) }} pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [100, 150], aB: [-30, -10] }} holdF={<g transform="translate(30 -10) rotate(-30)"><Cucumber s={0.6} bite={s.bite} /></g>} />
    </Living></Cam>;
  }
  return <g>{shot}</g>;
};

/* ---------- 6. The economics lesson ---------- */
export const Free6: React.FC<FP> = ({ sc }) => {
  const cB = T(sc, 1) - 0.35, cC = T(sc, 2) - 0.6, cD = T(sc, 3) - 0.4, cE = T(sc, 3) + 3.2;
  const s = useTimeline({ write: 0, tags: 0, cyc: 0, sig: 0, pull: 0, stop: 0 }, (tl, v) => {
    tl.to(v, { write: 1, duration: 1.2, ease: "none" }, 2.0).to(v, { tags: 1, duration: 0.3, ease: "back.out(3)" }, cB + 0.4)
      .to(v, { cyc: 4, duration: 2.4, ease: "none" }, cC + 0.2).to(v, { sig: 1, duration: 0.25, ease: "back.out(3)" }, cC + 2.7)
      .to(v, { pull: 1, duration: 0.6, ease: "power2.in" }, cD + 1.0).to(v, { stop: 1, duration: 0.6, ease: "power2.out" }, cD + 1.6);
  });
  const { f } = s, t = f / 30;
  const chalk = (txt: string, x: number, y: number, size = 70, k = 1, c = "#fff") => <text x={x} y={y} textAnchor="middle" fontFamily="KidsHand" fontSize={size} fill={c} opacity={k}>{txt}</text>;
  const signal = (y: number) => s.sig > 0.01 && <g transform={`translate(540 ${y}) scale(${s.sig})`} opacity={0.75 + 0.25 * Math.sin(t * 10)}><rect x={-330} y={-70} width={660} height={130} rx={16} fill="#fde047" stroke={INK} strokeWidth={9} /><text y={30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={76} fill={INK}>PRICE = SIGNAL</text></g>;
  const teacher = (expr: React.ComponentProps<typeof Bob>["expr"], x = 860) => <Bob id="b6" x={x} y={1640} s={1.0} expr={expr} extra={<Glasses />} pose={{ aF: [-150, -160], aB: [-30, -10] }} holdF={<line x1={0} y1={0} x2={-200} y2={-120} stroke="#a16207" strokeWidth={10} strokeLinecap="round" />} />;
  let shot: React.ReactNode;
  if (t < cB) {
    shot = <Cam x={540} y={1000} z={1.15}><Classroom board={<g><g transform="translate(400 600) rotate(-4)"><rect x={-220} y={-110} width={440} height={220} rx={16} fill="#86efac" stroke={INK} strokeWidth={9} /><circle r={70} fill="#bbf7d0" stroke={INK} strokeWidth={7} /><text y={34} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={96} fill="#166534">$</text></g>
      <clipPath id="wr6"><rect x={100} y={760} width={840 * s.write} height={160} /></clipPath><g clipPath="url(#wr6)">{chalk("money ≠ just paper", 520, 860, 76)}</g></g>}>{teacher(talking(sc, "Narrator", t) ? "talk" : "smug")}</Classroom></Cam>;
  } else if (t < cC) {
    shot = <Cam x={540} y={680} z={1.55}><Classroom board={<g>
      <g transform="translate(320 560)"><path d="M -80 -40 L -40 -90 L 40 -90 L 80 -40 L 0 70 Z" fill="#a5f3fc" stroke="#fff" strokeWidth={8} strokeLinejoin="round" /><g transform={`translate(0 170) scale(${s.tags})`}><PriceTag text="$$$$$" c="#fde047" /></g>{chalk("rare", 0, -120, 60, s.tags)}</g>
      <g transform="translate(760 580)"><ellipse rx={90} ry={60} fill="#9ca3af" stroke="#fff" strokeWidth={8} /><g transform={`translate(0 150) scale(${s.tags})`}><PriceTag text="$" c="#e5e7eb" /></g>{chalk("everywhere", 0, -100, 60, s.tags)}</g>
    </g>} /></Cam>;
  } else if (t < cD) {
    const nodes: [string, number, number][] = [["WORK", 540, 380], ["MONEY", 860, 620], ["BUY", 540, 860], ["MAKE", 220, 620]];
    shot = <Cam x={540} y={760} z={1.3}><Classroom board={<g>
      {nodes.map(([txt, x, y], i) => <g key={txt} opacity={s.cyc > i ? 1 : 0.2}><circle cx={x} cy={y} r={92} fill="none" stroke="#fff" strokeWidth={7} />{chalk(txt, x, y + 20, 56)}</g>)}
      {nodes.map(([, x, y], i) => { const [, x2, y2] = nodes[(i + 1) % 4]; const k = Math.max(0, Math.min(1, s.cyc - i)); return <line key={i} x1={x + (x2 - x) * 0.3} y1={y + (y2 - y) * 0.3} x2={x + (x2 - x) * (0.3 + 0.4 * k)} y2={y + (y2 - y) * (0.3 + 0.4 * k)} stroke="#fde68a" strokeWidth={10} strokeLinecap="round" markerEnd="" />; })}
      {signal(200)}
    </g>} /></Cam>;
  } else if (t < cE) {
    const spin = (1 - s.stop) * t * 120;
    const G = ({ x, y, r, lab, dir = 1, k = 1 }: { x: number; y: number; r: number; lab: string; dir?: number; k?: number }) => <g transform={`translate(${x} ${y})`} opacity={k}><g transform={`rotate(${spin * dir})`}><circle r={r} fill="#f59e0b" stroke={INK} strokeWidth={9} />{Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-16} y={-r - 26} width={32} height={34} fill="#f59e0b" stroke={INK} strokeWidth={6} transform={`rotate(${i * 36})`} />)}<circle r={r * 0.35} fill="#fde68a" stroke={INK} strokeWidth={6} /></g><text y={r + 70} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke fill">{lab}</text></g>;
    shot = <Cam x={540} y={950} z={1.05}><Classroom>
      <rect x={70} y={290} width={940} height={660} rx={10} fill="#1f4d3a" />
      <G x={300} y={560} r={120} lab="WORK" /><G x={780} y={560} r={120} lab="MAKE" />
      <g transform={`translate(${540 + s.pull * 260} ${760 - s.pull * 120}) rotate(${s.pull * 40})`}><G x={0} y={0} r={90} lab="PRICE" dir={-1} /></g>
      <Bob id="b6d" x={560 + s.pull * 330} y={1640} s={1.0} expr={s.stop > 0.5 ? "shock" : "determined"} extra={<Glasses />} pose={{ aF: [150, 160], aB: [-30, -10], lean: -8 * s.pull }} />
      {s.stop > 0.5 && <><Big text="CLUNK." y={1180} k={s.stop} size={110} c="#fca5a5" />{[0, 1, 2].map((i) => <circle key={i} cx={420 + i * 120} cy={420 - s.stop * 80 - i * 20} r={40 + i * 10} fill="#9ca3af" opacity={0.6 * (1 - s.stop * 0.5)} />)}</>}
    </Classroom></Cam>;
  } else {
    shot = <Cam x={540} y={950} z={1.15}><Classroom board={<g>{chalk("no prices", 540, 520, 90)}{chalk("= no reason to make stuff", 540, 640, 64)}{signal(820)}</g>}>{teacher(t % 1 < 0.5 ? "smug" : "happy")}</Classroom></Cam>;
  }
  return <g>{shot}</g>;
};

/* ---------- 7. Prices are back — and the refund ---------- */
export const Free7: React.FC<FP> = ({ sc }) => {
  const cB = T(sc, 1) - 0.25, cC = T(sc, 2) - 0.4, cD = T(sc, 3) - 0.2, cE = T(sc, 5) - 0.35, cF = T(sc, 6) - 0.15, cG = T(sc, 6) + 3.6;
  const s = useTimeline({ flip: 0, push: 0, receipt: 0, end: 0 }, (tl, v) => {
    tl.to(v, { flip: 1, duration: 0.4, ease: "power2.inOut" }, cC + 0.5).to(v, { push: 1, duration: cE - cD, ease: "none" }, cD)
      .to(v, { receipt: 1, duration: 0.3, ease: "back.out(2.5)" }, cF + 0.4).to(v, { end: 1, duration: 0.45, ease: "back.out(1.8)" }, cG + 0.2);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  const kingTalk = talking(sc, "King", t);
  if (t < cB) shot = <Cam x={540} y={1080} z={1.15}><Palace f={f}><King id="k7a" x={540} y={1560} s={1.0} expr="worried" pose={{ aF: [100, 110], aB: [-40, 30] }} holdF={<g transform="rotate(-20)"><Megaphone /></g>} /><Sweat x={420} y={760} t={t} /></Palace></Cam>;
  else if (t < cC) shot = <Cam x={560} y={880} z={2.0}><Palace f={f}><King id="k7b" x={540} y={1560} s={1.0} expr={kingTalk ? "talk" : "worried"} look={{ mouth: kingTalk }} pose={{ aF: [100, 110], aB: [-40, 30] }} holdF={<g transform="rotate(-20)"><Megaphone /></g>} /><Sweat x={400} y={720} t={t} s={1.3} /></Palace></Cam>;
  else if (t < cD) {
    shot = <Cam x={760} y={1060} z={1.55}><Street f={f} closed={s.flip < 0.5}>
      <Gus id="g7c" x={560} y={1480} s={0.95} expr="happy" pose={{ aF: [100 + 40 * s.flip, 130], aB: [-30, -10] }} />
      {s.flip > 0.5 && [[160, 960, "$2"], [300, 1060, "$5"], [440, 960, "$1"]].map(([x, y, p], i) => <g key={i} transform={`translate(${x} ${y}) rotate(-8)`}><PriceTag s={0.8} text={p as string} /></g>)}
      {s.flip > 0.5 && <Spark x={820} y={930} s={1.3} />}
    </Street></Cam>;
  } else if (t < cE) {
    shot = <Cam x={520} y={1150} z={1.2}><Street f={f}>
      <g transform={`translate(${260 + 420 * s.push} 1640)`}><Piano s={1.0} /></g>
      <Bob id="b7d" x={-30 + 420 * s.push} y={1640} s={1.0} expr="determined" pose={{ lean: 20, aF: [80, 80], aB: [70, 70], lF: [30, -10], lB: [-30, 8] }} />
      <Sweat x={-20 + 420 * s.push} y={780} t={t} />
    </Street></Cam>;
  } else if (t < cF) {
    const mo = talking(sc, "Bob", t);
    shot = <Cam x={480} y={1060} z={1.35}><Shop f={f} behind={<Gus id="g7e" x={330} y={1240} s={0.95} expr="deadpan" pose={{ aB: [-40, 30], aF: [40, -30] }} />}>
      <g transform="translate(760 1720)"><Piano s={0.9} /></g>
      <Bob id="b7e" x={560} y={1720} s={0.95} flip expr={mo ? "talk" : "smug"} look={{ mouth: mo }} pose={{ aF: [80, 120], aB: [-20, -10] }} />
    </Shop></Cam>;
  } else if (t < cG) {
    shot = <Cam x={420} y={980} z={2.0}><Shop f={f} behind={<Gus id="g7f" x={330} y={1240} s={0.95} expr="smug" pose={{ aF: [110, 150], aB: [-40, 30] }} holdF={<g transform={`translate(30 -150) scale(${s.receipt})`}><rect x={-110} y={-140} width={220} height={280} fill="#fff" stroke={INK} strokeWidth={8} /><text y={-80} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill={INK}>PAID</text><text y={-30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill={INK}>$0.00</text><text y={40} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill="#dc2626">REFUND</text><text y={96} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#dc2626">$0.00</text></g>} />} /></Cam>;
  } else {
    shot = <g><Rays x={540} y={1150} f={f} a="#bae6fd" b="#93c5fd" />
      <g transform="translate(540 1560)"><Piano s={1.2} /></g>
      <g transform="translate(940 1680) scale(-1 1)"><Horse s={0.75} /></g>
      <Bob id="b7g" x={540} y={1250} s={1.0} expr="smug" blush pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [130, 165], aB: [-40, 30] }} fistF />
      {s.end > 0.01 && <g transform={`translate(540 430) scale(${s.end})`}>
        <rect x={-470} y={-160} width={940} height={320} rx={40} fill="#1e3a8a" stroke={INK} strokeWidth={10} />
        <text y={-50} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={70} fill="#fde68a">What would YOU</text>
        <text y={30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={70} fill="#fde68a">take first?</text>
        <text y={112} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={46} fill="#fff">Bạn sẽ lấy gì đầu tiên?</text>
        <path transform={`translate(0 ${230 + Math.sin(t * 6) * 14})`} d="M -40 -50 L 40 -50 L 40 0 L 80 0 L 0 80 L -80 0 L -40 0 Z" fill="#fde047" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      </g>}</g>;
  }
  return <g>{shot}</g>;
};
