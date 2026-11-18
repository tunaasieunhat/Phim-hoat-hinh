// Scenes 1–3 of "What if everything was free?": the decree, Bob's first day, everyone else had the same idea.
// Hard cuts every ~2–3 s keyed to the narration (words from Edge TTS); motion = paused GSAP timelines (useTimeline).
import React from "react";
import { useTimeline } from "../Sleep/timeline";
import { INK } from "../Toon/Lily";
import { Cam, Rays, Spark } from "../Toon/props";
import { Flash, talking } from "../Toon/scenes";
import type { SceneData } from "./data";
import { Bob, Gus, King, Megaphone, Townie } from "./cast";
import { Car, Cart, DollarNo, Horse, Notice, Piano, Shelf3, Sweat, TV } from "./props";
import { Shop, W, H } from "./sets";
import { Living, Palace, Street, TopCity } from "./sets2";

export type FP = { sc: SceneData };
export const T = (sc: SceneData, i: number) => sc.lines[Math.min(i, sc.lines.length - 1)].t0;
export const END = (sc: SceneData) => sc.frames / 30;
export const Big: React.FC<{ text: string; x?: number; y?: number; k: number; c?: string; size?: number; r?: number }> = ({ text, x = 540, y = 400, k, c = "#fde047", size = 110, r = -6 }) => k <= 0.01 ? null : (
  <text transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={size} fill={c} stroke={INK} strokeWidth={16} paintOrder="stroke fill">{text}</text>
);
export const Speed: React.FC<{ x: number; y: number; dir?: number; k?: number }> = ({ x, y, dir = -1, k = 1 }) => (
  <g opacity={k}>{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={x + dir * 60} y1={y - 220 + i * 90} x2={x + dir * (260 + (i % 2) * 120)} y2={y - 220 + i * 90} stroke="#fff" strokeWidth={12} strokeLinecap="round" />)}</g>
);
// the loot pile in the cart, item by item (0 TV, 1 car, 2 horse, 3 piano)
export const Loot: React.FC<{ n: number; pop?: number }> = ({ n, pop = 1 }) => {
  const items = [<TV key="tv" s={0.8} />, <Car key="car" s={0.62} />, <Horse key="h" s={0.5} />, <Piano key="p" s={0.6} />];
  const ys = [-160, -310, -420, -620];
  return <g>{items.map((it, i) => i >= n ? null : <g key={i} transform={`translate(${(i % 2 ? -10 : 10)} ${ys[i]}) rotate(${(i % 2 ? -4 : 5)}) scale(${i === n - 1 ? pop : 1})`}>{it}</g>)}</g>;
};
export const Crown = () => null;

/* ---------- 1. The decree ---------- */
export const Free1: React.FC<FP> = ({ sc }) => {
  const c1 = T(sc, 1) - 0.1, c2 = T(sc, 2) - 0.3, c3 = T(sc, 3) - 0.1, c4 = T(sc, 4) - 0.15;
  const s = useTimeline({ zA: 1.0, fall: 0, zC: 1.3, money: 0, bill: 0, grin: 0, zF: 1.0, flash: 0 }, (tl, v) => {
    tl.to(v, { zA: 1.3, duration: 2.4, ease: "power1.in" }, 0)
      .to(v, { fall: 1, duration: c2 - c1, ease: "power1.inOut" }, c1).to(v, { zC: 2.2, duration: c2 - c1, ease: "power2.in" }, c1)
      .to(v, { money: 1, duration: 0.25, ease: "back.out(3)" }, T(sc, 2) - 0.05)
      .to(v, { bill: 1, duration: 0.25, ease: "back.out(3)" }, T(sc, 3) - 0.05)
      .to(v, { grin: 1, duration: 0.3, ease: "back.out(2.5)" }, T(sc, 4)).to(v, { zF: 1.35, duration: 0.16, ease: "power4.out" }, T(sc, 4) + 0.3)
      .to(v, { flash: 0.7, duration: 0.05 }, T(sc, 4) + 0.3).to(v, { flash: 0, duration: 0.4 }, T(sc, 4) + 0.35);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  if (t < 2.4) shot = <Cam x={540} y={760} z={s.zA}><TopCity f={f} /></Cam>;
  else if (t < c1) {
    const mo = talking(sc, "Narrator", t) ? 0.4 + 0.6 * Math.abs(Math.sin(t * 16)) : 0;
    shot = <Cam x={560} y={1050} z={1.25}><Palace f={f}><King id="k1" x={540} y={1560} s={1.0} expr={mo ? "talk" : "smug"} look={{ mouth: mo }} pose={{ aF: [100, 110], aB: [-40, 30] }} holdF={<g transform="rotate(-20)"><Megaphone /></g>} /></Palace>
      {mo > 0 && [0, 1, 2].map((i) => <path key={i} d={`M ${830 + i * 40} ${880 - i * 30} q 30 60 0 120`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.7} />)}</Cam>;
  } else if (t < c2) {
    const k = s.fall;
    shot = <g><Cam x={540} y={760} z={s.zC}><TopCity f={f} /></Cam>
      <g transform={`translate(${540 + Math.sin(k * 9) * 160 * (1 - k)} ${-300 + k * 1300}) rotate(${Math.sin(k * 7) * 25 * (1 - k)}) scale(${1.4 - 0.5 * k})`}><Notice /></g></g>;
  } else if (t < c4) {
    // D/E · Bob reads the decree; "No money." "No bills." pop up
    const reading = t < c3;
    shot = reading ? (
      <Cam x={600} y={1000} z={1.45}><Street f={f}>
        <Bob id="b1d" x={420} y={1480} s={1.0} expr="shock" pose={{ aF: [70, 130], aB: [-70, -130] }} holdF={<g transform="translate(-110 -40) scale(0.5)"><Notice /></g>} />
      </Street><g transform="translate(800 760)"><DollarNo s={1.1} k={s.money} kind="money" /></g></Cam>
    ) : (
      <g><Rays x={540} y={900} f={f} a="#fecaca" b="#fca5a5" /><g transform="translate(540 820) rotate(-6)"><DollarNo s={2.2} k={s.bill} kind="bill" /></g></g>
    );
  } else {
    shot = <Cam x={540} y={1000 - (s.zF - 1) * 300} z={s.zF}><Rays x={540} y={760} f={f} a="#fde68a" b="#fcd34d" />
      {[[160, 520], [920, 640], [180, 1160], [900, 1180]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={1 + 0.3 * Math.sin(f / 4 + i)} c="#fff" />)}
      <Bob id="b1f" x={540} y={1960} s={1.6} expr={s.grin > 0.5 ? "happy" : "smug"} pose={{ aF: [140, 160], aB: [-140, -160] }} fistF />
      <Big text="FREE?!" y={380} k={s.grin} size={170} /></Cam>;
  }
  return <g>{shot}<Flash k={s.flash} /></g>;
};

/* ---------- 2. Day one: a TV, a car, a horse, a piano ---------- */
export const Free2: React.FC<FP> = ({ sc }) => {
  const tTV = T(sc, 1), tCar = T(sc, 2), tHorse = T(sc, 3), tPiano = T(sc, 4), tCant = T(sc, 5), tFree = T(sc, 6);
  const cB = 2.6, cG = tPiano + 1.1, cH = tCant - 0.2, cI = tFree - 0.1, cJ = cI + 3.4;
  const s = useTimeline({ dash: 0, run: 0, n: 0, pop: 1, push: 0, press: -1, zI: 1.4, chew: 0 }, (tl, v) => {
    tl.to(v, { dash: 1, duration: 1.2, ease: "power2.in" }, 0.6).to(v, { run: 1, duration: 1.6, ease: "power1.inOut" }, cB + 0.2);
    [tTV, tCar, tHorse, tPiano].forEach((x, i) => tl.set(v, { n: i + 1, pop: 0.2 }, x - 0.05).to(v, { pop: 1, duration: 0.25, ease: "back.out(3)" }, x - 0.05));
    tl.to(v, { push: 1, duration: cH - cG, ease: "none" }, cG)
      .set(v, { press: 3 }, cH + 0.3).set(v, { press: 9 }, cH + 0.7).set(v, { press: 5 }, cH + 1.1).set(v, { press: -1 }, cH + 1.5)
      .to(v, { zI: 1.1, duration: cJ - cI, ease: "power1.out" }, cI).to(v, { chew: 1, duration: 0.18, yoyo: true, repeat: 15 }, cJ + 0.2);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  if (t < cB) {
    shot = <Cam x={540} y={1100} z={1.15}><Street f={f}>
      {s.dash < 0.95 && <><Speed x={-200 + 1100 * s.dash} y={1300} dir={-1} k={s.dash > 0.05 ? 1 : 0} /><Bob id="b2a" x={-200 + 1100 * s.dash} y={1480} s={0.95} expr="determined" pose={{ lean: 18 * s.dash, aF: [100, 60], aB: [-60, -100], lF: [50, -20], lB: [-40, 10] }} /></>}
      {s.dash >= 0.95 && [0, 1, 2].map((i) => <circle key={i} cx={810 + (i - 1) * 90} cy={1320 - i * 20} r={60 + i * 10} fill="#e7e5e4" opacity={0.85} stroke={INK} strokeWidth={4} />)}
    </Street></Cam>;
  } else if (t < tTV - 0.1) {
    const x = 120 + 760 * s.run;
    shot = <Cam x={540} y={1150} z={1.2}><Shop f={f} behind={<Gus id="g2b" x={330} y={1240} s={0.95} expr="shock" pose={{ aB: [-130, -160], aF: [130, 160] }} />}>
      <Speed x={x - 200} y={1500} dir={-1} /><g transform={`translate(${x + 200} 1700)`}><Cart s={0.9} /></g>
      <Bob id="b2b" x={x} y={1700} s={0.9} expr="determined" pose={{ lean: 14, aF: [80, 70], aB: [70, 60], lF: [40, -10], lB: [-30, 10] }} /></Shop>
      <g transform="translate(860 560)"><circle r={100} fill="#fff" stroke={INK} strokeWidth={10} /><line x1={0} y1={0} x2={0} y2={-70} stroke="#ef4444" strokeWidth={10} strokeLinecap="round" transform={`rotate(${t * 900})`} /><text y={160} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={54} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke fill">0.5 sec</text></g></Cam>;
  } else if (t < cG) {
    // TV / car / horse / piano: each lands in the cart with a ka-ching; the camera angle changes on every item
    const k = Math.max(1, Math.round(s.n));
    const angle = [[1.6, 0, 1250], [1.45, -4, 1180], [1.35, 3, 1120], [1.2, -2, 1050]][k - 1];
    shot = <Cam x={620} y={angle[2]} z={angle[0]} r={angle[1]}><Shop f={f}>
      <Bob id="b2c" x={380} y={1700} s={0.9} expr="happy" blush pose={{ aF: [70, 40], aB: [60, 30] }} />
      <g transform="translate(720 1700)"><Cart s={1.0}><Loot n={s.n} pop={s.pop} /></Cart></g>
    </Shop></Cam>;
    shot = <g>{shot}<Big text={["TV!", "CAR!", "HORSE!", "PIANO!"][k - 1]} x={720} y={520} k={s.pop} size={130} r={-8} c="#86efac" /></g>;
  } else if (t < cH) {
    const wob = Math.sin(t * 5) * 4;
    shot = <Cam x={560} y={1150} z={1.05} r={-3}><Street f={f}>
      <Gus id="g2g" x={810} y={1330} s={0.85} expr="shock" pose={{ aB: [-120, -170], aF: [120, 170] }} />
      <g transform={`translate(${300 + 160 * s.push} 1650) rotate(${wob})`}><Cart s={1.25}><Loot n={4} /></Cart></g>
      <Bob id="b2g" x={60 + 160 * s.push} y={1650} s={1.0} expr="determined" pose={{ lean: 16, aF: [80, 80], aB: [70, 70], lF: [30, -10], lB: [-26, 6] }} />
      <Sweat x={70 + 160 * s.push} y={760} t={t} />
    </Street></Cam>;
  } else if (t < cI) {
    shot = <Cam x={520} y={1150} z={1.7}><Living f={f}>
      <g transform="translate(520 1500)"><Piano s={1.2} press={s.press} /></g>
      <Bob id="b2h" x={300} y={1600} s={1.0} expr={s.press >= 0 ? "worried" : "deadpan"} pose={{ aF: [80, 110], aB: [60, 100] }} />
      {s.press >= 0 && <Big text="BONK" x={720} y={900} k={1} size={90} c="#fca5a5" r={10} />}
    </Living></Cam>;
  } else {
    const chew = t >= cJ;
    shot = chew ? (
      <Cam x={560} y={1000} z={1.8}><Living f={f}>
        <Bob id="b2j" x={430} y={1600} s={1.0} expr="deadpan" pose={{ aF: [20, 10], aB: [-20, -10] }} />
        <g transform="translate(860 1640) scale(-1 1)"><Horse s={1.0} chew={s.chew} /></g>
      </Living></Cam>
    ) : (
      <Cam x={540} y={1180} z={s.zI}><Living f={f}>
        <g transform="translate(250 1280)"><TV s={0.9} /></g>
        <g transform="translate(860 1620) scale(-1 1)"><Horse s={0.85} /></g>
        <g transform="translate(560 1560)"><Piano s={0.9} /></g>
        <g transform="translate(200 1800)"><Car s={0.7} c="#ef4444" /></g>
        <Bob id="b2i" x={560} y={1640} s={0.9} expr="smug" blush pose={{ aF: [130, 165], aB: [-40, 30] }} fistF />
      </Living></Cam>
    );
  }
  return <g>{shot}</g>;
};

/* ---------- 3. Everyone else had the same idea ---------- */
export const Free3: React.FC<FP> = ({ sc }) => {
  const cB = T(sc, 1) - 0.2, cC = cB + 2.9, cD = T(sc, 2) + 1.4, cE = T(sc, 3) - 0.15, cF = T(sc, 4) - 0.1;
  const s = useTimeline({ ppl: 0, rush: 0, zB: 1.7, wave: 0, gus: 0, stock: 1, sneak: 0 }, (tl, v) => {
    tl.to(v, { ppl: 1, duration: 1.4, ease: "power1.out" }, 0.4)
      .to(v, { rush: 1, duration: cC - cB, ease: "power2.in" }, cB).to(v, { zB: 1.05, duration: cC - cB, ease: "power1.out" }, cB)
      .to(v, { wave: 1, duration: 1.1, ease: "power2.out" }, cC).to(v, { gus: 1, duration: 1.0, ease: "power1.out" }, cC + 0.3)
      .to(v, { stock: 0, duration: cD - (cC + 1.6), ease: "power1.in" }, cC + 1.6)
      .to(v, { sneak: 1, duration: END(sc) - cF, ease: "none" }, cF);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={800} z={1.25}><TopCity f={f} people={s.ppl} /></Cam>;
  else if (t < cC) shot = <Cam x={540} y={780} z={s.zB} r={-6 * (1 - s.rush)}><TopCity f={f} people={1} rush={s.rush} /></Cam>;
  else if (t < cE) {
    const crowd = t < cD;
    shot = <Cam x={540} y={1150} z={1.15} shake={crowd && s.wave < 1 ? 6 : 0} f={f}><Shop f={f} stock={s.stock}
      behind={s.gus < 0.05 ? <Gus id="g3" x={330} y={1240} s={0.95} expr="shock" pose={{ aB: [-130, -160], aF: [130, 160] }} /> : null}>
      {crowd && Array.from({ length: 12 }).map((_, i) => { const x = 1500 - s.wave * (900 + (i % 4) * 160) + (i % 3) * 120, y = 1560 + (i % 4) * 70; return <Townie key={i} i={i} id={`t3${i}`} x={x} y={y} s={0.75} flip expr={i % 2 ? "shock" : "determined"} pose={{ lean: -14, aF: [140, 170], aB: [100, 140], lF: [30, 0], lB: [-30, 10] }} />; })}
      {s.gus > 0.02 && s.gus < 0.99 && <g transform={`translate(${330 - 500 * s.gus} ${900 - Math.sin(s.gus * Math.PI) * 500}) rotate(${-720 * s.gus})`}><Gus id="g3f" x={0} y={300} s={0.7} expr="shock" pose={{ aB: [-150, -170], aF: [150, 170], lB: [-40, -20], lF: [40, 20] }} /></g>}
      {!crowd && [0, 1, 2, 3].map((i) => <circle key={i} cx={120 + i * 130 + Math.sin(t * 9 + i) * 40} cy={600 + (i % 2) * 160} r={22} fill="#fff" stroke={INK} strokeWidth={7} />)}
    </Shop>
      {!crowd && <g transform="translate(860 520)"><circle r={110} fill="#fff" stroke={INK} strokeWidth={10} /><line x1={0} y1={0} x2={0} y2={-80} stroke={INK} strokeWidth={12} strokeLinecap="round" /><line x1={0} y1={0} x2={0} y2={-55} stroke={INK} strokeWidth={12} strokeLinecap="round" transform="rotate(-6)" /><text y={180} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={60} fill="#fde68a" stroke={INK} strokeWidth={12} paintOrder="stroke fill">LUNCHTIME</text></g>}
    </Cam>;
  } else if (t < cF) {
    shot = <Cam x={420} y={1250} z={1.4}><Shop f={f} stock={0} noShelves>
      <Gus id="g3e" x={330} y={1560} s={0.9} droop={1} expr="deadpan" pose={{ sit: 1.235, lB: [70, -30], lF: [84, -40], aB: [-30, -10], aF: [30, 10] }} />
      {[0, 1, 2].map((i) => <circle key={i} cx={330 + Math.cos(t * 4 + i * 2) * 140} cy={760 + Math.sin(t * 5 + i) * 50} r={6} fill={INK} />)}
    </Shop></Cam>;
  } else {
    shot = <Cam x={560} y={1120} z={1.2}><Street f={f} empty>
      <Gus id="g3g" x={810} y={1330} s={0.85} expr={t > cF + 1.4 ? "shock" : "deadpan"} droop={1} pose={{ aF: t > cF + 1.4 ? [-100, -100] : [20, 10], aB: [-20, -10] }} flip />
      <g transform={`translate(${620 - 480 * s.sneak} 0)`}>
        <Townie i={5} id="t3g" x={0} y={1620} s={0.95} expr="smug" pose={{ lean: -10, aF: [150, 180], aB: [-150, -180], lF: [20 * Math.sin(t * 8), 0], lB: [-20 * Math.sin(t * 8), 0] }} flip />
        <g transform="translate(0 1180)"><Shelf3 s={1.2} /></g>
      </g>
      {t > cF + 1.4 && <Big text="HEY!" x={820} y={720} k={1} size={120} c="#fca5a5" />}
    </Street></Cam>;
  }
  return <g>{shot}<rect width={W} height={H} fill="none" /></g>;
};
