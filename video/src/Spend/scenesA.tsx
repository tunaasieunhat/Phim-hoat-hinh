// Scenes 1–4: payday, Ray the first-week millionaire, Pia the sale hunter, Bea the self-investor.
// Hard cuts every ~2–3 s keyed to the voices; motion = paused GSAP timelines (useTimeline); HUD on every shot.
import React from "react";
import { useTimeline } from "../Sleep/timeline";
import { INK, Toon } from "../Toon/Lily";
import { Cam, Rays, Spark } from "../Toon/props";
import { Flash, talking } from "../Toon/scenes";
import { townie, TownHair } from "../Free/cast";
import { Big } from "../Free/scenes1";
import type { SceneData } from "./data";
import { Balance, BubbleTea, Calendar, COLOR, Noodle, PhoneP, Student, Wallet, type Who } from "./cast";
import { DormTop, Hallway, ORDER, Room, TeaShop } from "./sets";

export type SP = { sc: SceneData };
export const T = (sc: SceneData, i: number) => sc.lines[Math.min(i, sc.lines.length - 1)].t0;
export const E = (sc: SceneData, i: number) => sc.lines[Math.min(i, sc.lines.length - 1)].t1;
export const END = (sc: SceneData) => sc.frames / 30;
export const mouth = (sc: SceneData, who: string, t: number) => talking(sc, who, t);
export const HUD: React.FC<{ day: number; flip?: number; who: Who | "All"; v: number; drop?: number }> = ({ day, flip, who, v, drop }) => <g><Calendar day={day} flip={flip} /><Balance who={who} v={v} drop={drop} /></g>;
const Crowd: React.FC<{ n: number; y: number; f: number; cheer?: number; x0?: number; gap?: number; s?: number }> = ({ n, y, f, cheer = 0, x0 = 80, gap = 150, s = 0.62 }) => (
  <g>{Array.from({ length: n }).map((_, i) => { const up = cheer * (0.5 + 0.5 * Math.sin(f / 3 + i * 1.7)); return <Toon key={i} id={`cr${i}`} x={x0 + i * gap} y={y - up * 30} s={s} outfit={townie(i)} hair={(r) => <TownHair r={r} i={i} />} hairBack={() => null} expr={cheer > 0.3 ? "happy" : "smug"} pose={{ aF: [140 + 20 * up, 170], aB: [-140 - 20 * up, -170] }} />; })}</g>
);
const Bills: React.FC<{ k: number; x: number; y: number }> = ({ k, x, y }) => (
  <g>{Array.from({ length: 8 }).map((_, i) => { const q = (k * 1.4 + i * 0.13) % 1; return <g key={i} transform={`translate(${x + Math.cos(i * 2.1) * 420 * q} ${y - 380 * q + 200 * q * q}) rotate(${q * 400 + i * 40})`} opacity={k > 0 ? 1 - q : 0}><rect x={-46} y={-24} width={92} height={48} rx={6} fill="#86efac" stroke={INK} strokeWidth={5} /><circle r={12} fill="#bbf7d0" stroke={INK} strokeWidth={3} /></g>; })}</g>
);

/* ---------- 1. Payday ---------- */
export const S1: React.FC<SP> = ({ sc }) => {
  const s = useTimeline({ zA: 1.0, buzz: 0, jump: 0, zD: 1.0, worry: 0 }, (tl, v) => {
    tl.to(v, { zA: 1.18, duration: 3.4, ease: "none" }, 0).to(v, { buzz: 6, duration: 1.6, ease: "none" }, 3.9)
      .to(v, { jump: 1, duration: 0.35, ease: "back.out(3)" }, 6.6).to(v, { zD: 2.6, duration: 0.25, ease: "power4.out" }, T(sc, 4) - 0.1).to(v, { worry: 1, duration: 0.2 }, E(sc, 4) - 0.2);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  const heads = (i: number, cx: number, cy: number) => <g><circle cx={cx + 40} cy={cy + 60} r={44} fill="#fff" stroke={INK} strokeWidth={6} /><path d={`M ${cx} ${cy + 50} A 44 44 0 0 1 ${cx + 80} ${cy + 50} Z`} fill={["#1f1a17", "#3b1f3f", "#7c2d12", "#57534e", "#9a3412", "#4b3621"][i]} />
    {s.buzz > i && <g transform={`translate(${cx + 110} ${cy - 30}) scale(${Math.min(1, s.buzz - i)})`}><PhoneP s={0.45} screen="#bbf7d0" /><g transform="translate(-40 -120)"><rect x={-100} y={-34} width={240} height={60} rx={20} fill="#16a34a" stroke={INK} strokeWidth={5} /><text x={20} y={8} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={30} fill="#fff">+3,000,000đ</text></g></g>}</g>;
  if (t < 3.4) shot = <Cam x={540} y={960} z={s.zA} r={-4}><DormTop f={f} room={(i, cx, cy) => <circle cx={cx + 40} cy={cy + 60} r={44} fill="#fff" stroke={INK} strokeWidth={6} />} /></Cam>;
  else if (t < 6.4) shot = <Cam x={540} y={980} z={1.25} r={-2}><DormTop f={f} room={heads} /></Cam>;
  else if (t < T(sc, 4) - 0.1) {
    shot = <g><Rays x={540} y={900} f={f} a="#fde68a" b="#fcd34d" />
      {ORDER.map((w, i) => <Wallet key={w} x={190 + (i % 3) * 350} y={720 + Math.floor(i / 3) * 360 - s.jump * 60 * Math.abs(Math.sin(t * 6 + i))} s={0.8} mood="happy" strap={COLOR[w]} f={f} />)}
      <Big text="30 DAYS" y={1250} k={s.jump} size={110} c="#fff" /></g>;
  } else {
    shot = <Cam x={540} y={900} z={s.zD}><Rays x={540} y={900} f={f} a="#fde68a" b="#fcd34d" />{ORDER.map((w, i) => <Wallet key={w} x={190 + (i % 3) * 350} y={720 + Math.floor(i / 3) * 360} s={0.8} mood={i === 1 && s.worry > 0.5 ? "worried" : "happy"} strap={COLOR[w]} f={f} />)}</Cam>;
  }
  return <g>{shot}<HUD day={1} who="All" v={3000000} /></g>;
};

/* ---------- 2. Ray, the first-week millionaire ---------- */
export const S2: React.FC<SP> = ({ sc }) => {
  const cB = 2.9, cC = 5.9, cD = T(sc, 2) - 0.1, cE = T(sc, 3) - 0.2, cE2 = cE + 1.3, cF = T(sc, 4) - 0.25;
  const s = useTimeline({ walk: 0, cheer: 0, fly: 0, bal: 3000000, drop: 0, day: 1, flip: 0, zF: 1.4 }, (tl, v) => {
    tl.to(v, { walk: 1, duration: 2.2, ease: "power1.out" }, 0.3).to(v, { cheer: 1, duration: 0.3 }, T(sc, 1))
      .to(v, { fly: 1, duration: cD - cC, ease: "none" }, cC).to(v, { bal: 1200000, duration: cD - cC, ease: "power1.in" }, cC).to(v, { drop: 1, duration: 0.1 }, cC).to(v, { drop: 0, duration: 0.1 }, cD)
      .to(v, { day: 5, duration: 1.1, ease: "power1.in" }, cE).to(v, { flip: 1, duration: 0.25, repeat: 3 }, cE).to(v, { bal: 40000, duration: 1.1, ease: "power2.in" }, cE)
      .set(v, { day: 6 }, cF).to(v, { flip: 1, duration: 0.3 }, cF).to(v, { bal: 25000, duration: 0.3 }, cF).to(v, { zF: 2.3, duration: 0.2, ease: "power4.out" }, T(sc, 4) + 0.9);
  });
  const { f } = s, t = f / 30, mo = mouth(sc, "Ray", t);
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={1100} z={1.15}><TeaShop f={f} front={<Student who="Ray" id="r2a" x={-200 + 600 * s.walk} y={1700} s={0.9} expr="smug" look={{ look: 0.6 }} pose={{ lean: -6, lF: [20 * Math.sin(t * 8), 0], lB: [-20 * Math.sin(t * 8), 0], aF: [20, 10], aB: [-20, -10] }} />}><Crowd n={6} y={1600} f={f} x0={100} gap={170} /></TeaShop></Cam>;
  else if (t < cC) shot = <Cam x={540} y={1000} z={1.35}><TeaShop f={f} front={<Student who="Ray" id="r2b" x={540} y={1750} s={1.15} expr={mo ? "talk" : "happy"} look={{ mouth: mo }} pose={{ aF: [150, 168], aB: [-40, 30] }} holdF={<g transform="rotate(-20)"><rect x={-56} y={-36} width={112} height={72} rx={8} fill="#facc15" stroke={INK} strokeWidth={6} /><rect x={-56} y={-18} width={112} height={14} fill={INK} /></g>} />}><Crowd n={6} y={1640} f={f} cheer={s.cheer} x0={80} gap={180} s={0.55} /></TeaShop>
    {s.cheer > 0.3 && <Big text="YEAAAH!" y={430} k={s.cheer} size={120} c="#fde68a" />}</Cam>;
  else if (t < cD) shot = <Cam x={540} y={1000} z={1.5}><TeaShop f={f} front={<g><Wallet x={540} y={1150} s={1.4} mood="shake" strap={COLOR.Ray} f={f} /><Bills k={s.fly} x={540} y={1050} /></g>} /></Cam>;
  else if (t < cE) {
    shot = <g><Rays x={540} y={900} f={f} a="#fecaca" b="#fca5a5" />
      {Array.from({ length: 12 }).map((_, i) => <g key={i} transform={`translate(${260 + (i % 6) * 112} ${1280 - Math.floor(i / 6) * 160})`}><BubbleTea s={0.7} /></g>)}
      <Student who="Ray" id="r2d" x={540} y={1000} s={0.95} expr="smug" pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [140, 165], aB: [-40, 30] }} extra={<path d="M -70 -100 L -78 -160 L -38 -128 L 0 -175 L 38 -128 L 78 -160 L 70 -100 Z" fill="#facc15" stroke={INK} strokeWidth={7} />} />
      <Big text="KING" y={360} k={1} size={150} /></g>;
  } else if (t < cE2) shot = <g><rect x={-100} y={-100} width={1280} height={2120} fill="#fef3c7" /><g transform="translate(540 820) scale(2.6) translate(-175 -170)"><Calendar day={s.day} flip={s.flip} /></g></g>;
  else {
    const close = t >= cF;
    shot = <Cam x={close ? 330 : 470} y={close ? 900 : 1100} z={close ? s.zF : 1.4}><Room f={f} night={1} wall="#475569">
      <rect x={180} y={1180} width={420} height={24} rx={8} fill="#a16207" stroke={INK} strokeWidth={6} />
      <g transform="translate(470 1180)"><Noodle s={0.8} f={f} /></g>
      <Student who="Ray" id="r2e" x={260} y={1290} s={0.95} expr={close ? "deadpan" : "worried"} noShades={false} pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [80, 140], aB: [-30, -10] }} holdF={<line x1={0} y1={0} x2={60} y2={-120} stroke="#a16207" strokeWidth={8} strokeLinecap="round" />} />
      <Wallet x={720} y={1460} s={0.75} mood="cry" strap={COLOR.Ray} f={f} />
    </Room></Cam>;
  }
  return <g>{shot}<HUD day={s.day} flip={s.flip % 1} who="Ray" v={s.bal} drop={s.drop} /></g>;
};

/* ---------- 3. Pia, the sale hunter ---------- */
export const S3: React.FC<SP> = ({ sc }) => {
  const cB = 3.4, cC = T(sc, 1) + 1.9, cD = T(sc, 2) - 0.2, cE = T(sc, 3) - 0.2, cF = T(sc, 4) - 0.2, cG = T(sc, 5) - 0.3;
  const s = useTimeline({ day: 8, flip: 0, bal: 2400000, drop: 0, tags: 0, door: 0, boxes: 0, zG: 1.3 }, (tl, v) => {
    tl.to(v, { tags: 1, duration: cC - cB, ease: "none" }, cB).to(v, { bal: 900000, duration: cC - cB, ease: "power1.in" }, cB).to(v, { drop: 1, duration: 0.1 }, cB).to(v, { drop: 0, duration: 0.1 }, cC)
      .to(v, { day: 11, duration: 0.6 }, cC).to(v, { flip: 1, duration: 0.2, repeat: 2 }, cC).to(v, { door: 1, duration: 0.4, ease: "power2.out" }, cC + 0.9).to(v, { boxes: 1, duration: 0.9, ease: "power2.out" }, cC + 1.1)
      .to(v, { bal: 300000, duration: 0.6 }, cG).to(v, { zG: 2.4, duration: 0.2, ease: "power4.out" }, T(sc, 5) - 0.05);
  });
  const { f } = s, t = f / 30, mo = mouth(sc, "Pia", t);
  const blink = Math.floor(t * 4) % 2 === 0;
  const sale = <g transform="translate(540 430) rotate(-5)" opacity={blink ? 1 : 0.5}><rect x={-330} y={-80} width={660} height={160} rx={20} fill="#ef4444" stroke={INK} strokeWidth={10} /><text y={36} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={110} fill="#fde047">FLASH SALE</text></g>;
  const glow = <ellipse cx={0} cy={0} rx={260} ry={200} fill="#93c5fd" opacity={0.35} />;
  let shot: React.ReactNode;
  if (t < cB) shot = <g><Cam x={420} y={1150} z={1.3}><Room f={f} night={1} dark={0.9} wall="#6d28d9"><g transform="translate(330 1080)">{glow}</g></Room>
    <Student who="Pia" id="p3a" x={300} y={1300} s={0.95} expr="determined" look={{ look: 0.5 }} pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [80, 150], aB: [70, 140] }} holdF={<PhoneP s={0.45} screen="#e0f2fe" />} /></Cam>{sale}</g>;
  else if (t < cC) {
    shot = <g><Cam x={330} y={980} z={2.0}><Room f={f} night={1} dark={0.85} wall="#6d28d9"><g transform="translate(330 1000)">{glow}</g></Room>
      <Student who="Pia" id="p3b" x={300} y={1300} s={0.95} expr={mo ? "talk" : "happy"} look={{ mouth: mo, look: 0.5 }} pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [80, 150], aB: [70, 140] }} holdF={<g transform={`translate(0 ${Math.sin(t * 30) * 3})`}><PhoneP s={0.45} screen="#e0f2fe" /></g>} /></Cam>
      {Array.from({ length: 6 }).map((_, i) => { const q = (s.tags * 2 + i / 6) % 1; return <g key={i} transform={`translate(${120 + (i * 167) % 860} ${1250 - q * 900}) rotate(${-15 + i * 7})`} opacity={1 - q}><path d="M -90 -44 L 70 -44 L 110 0 L 70 44 L -90 44 Z" fill="#fde047" stroke={INK} strokeWidth={7} /><text x={-6} y={18} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={46} fill="#dc2626">-70%</text></g>; })}{sale}</g>;
  } else if (t < cD) {
    shot = <Cam x={420} y={1050} z={1.25}><Hallway f={f}>
      <g transform={`translate(120 560) scale(${1 - s.door * 0.85} 1)`}><rect x={0} y={0} width={300} height={690} rx={10} fill="#b07a4f" stroke={INK} strokeWidth={9} /></g>
      {Array.from({ length: 9 }).map((_, i) => { const k = Math.max(0, Math.min(1, s.boxes * 1.4 - i * 0.05)); return <g key={i} transform={`translate(${200 + (i % 3) * 120 + k * (i % 4) * 90} ${1150 + Math.floor(i / 3) * 70 - (i % 2) * 40 + k * 60}) rotate(${(i % 3 - 1) * 12})`}><rect x={-60} y={-60} width={120} height={100} rx={6} fill="#d6a273" stroke={INK} strokeWidth={6} /><line x1={-60} y1={-30} x2={60} y2={-30} stroke="#a16207" strokeWidth={8} /></g>; })}
    </Hallway></Cam>;
  } else if (t < cE) {
    shot = <g><rect x={-100} y={-100} width={1280} height={2120} fill="#1e1b4b" /><ellipse cx={540} cy={880} rx={420} ry={360} fill="#fde047" opacity={0.25} />
      <g transform="translate(540 1060)"><rect x={-90} y={0} width={180} height={50} rx={12} fill="#f8fafc" stroke={INK} strokeWidth={7} /><ellipse cx={0} cy={-120} rx={170} ry={120} fill="#fde047" stroke={INK} strokeWidth={9} /><circle cx={110} cy={-250} r={80} fill="#fde047" stroke={INK} strokeWidth={9} /><path d="M 180 -240 L 260 -220 L 182 -200 Z" fill="#f97316" stroke={INK} strokeWidth={6} /><circle cx={130} cy={-270} r={11} fill={INK} /></g>
      <Big text="?" x={840} y={520} k={1} size={180} c="#fff" /></g>;
  } else if (t < cF) {
    shot = <Cam x={540} y={1100} z={1.3}><Room f={f} wall="#ddd6fe">
      {Array.from({ length: 7 }).map((_, i) => <g key={i} transform={`translate(${160 + i * 115} 1180) rotate(${(i % 2 ? 6 : -6)})`}><rect x={-44} y={-90} width={88} height={160} rx={18} fill={["#f472b6", "#60a5fa", "#facc15", "#34d399", "#a78bfa", "#fb923c", "#f87171"][i]} stroke={INK} strokeWidth={6} /><circle cx={-18} cy={-62} r={10} fill={INK} /></g>)}
      <Big text="×7" x={860} y={960} k={1} size={130} c="#fde68a" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={60 + i * 160} y={1400 + (i % 2) * 40} width={140} height={110} rx={6} fill="#d6a273" stroke={INK} strokeWidth={6} />)}
    </Room></Cam>;
  } else if (t < cG) {
    shot = <Cam x={540} y={1050} z={1.5}><Room f={f} wall="#ddd6fe"><Student who="Pia" id="p3f" x={480} y={1600} s={1.0} expr="happy" pose={{ aF: [140, 168], aB: [-40, 30] }} holdF={<g transform="translate(0 -60)"><rect x={-80} y={-110} width={160} height={220} fill="#fff" stroke={INK} strokeWidth={6} /><text y={-50} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={30} fill={INK}>SAVED</text><text y={20} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={60} fill="#16a34a">70%</text></g>} /><Spark x={760} y={760} s={1.4} /></Room></Cam>;
  } else {
    shot = <Cam x={540} y={1200} z={s.zG}><Room f={f} wall="#ddd6fe"><Wallet x={540} y={1250} s={1.2} mood="cry" strap={COLOR.Pia} f={f} />{Array.from({ length: 7 }).map((_, i) => <rect key={i} x={300 + i * 70} y={1040 - (i % 2) * 20} width={56} height={90} fill="#fff" stroke={INK} strokeWidth={4} transform={`rotate(${i * 6 - 18} ${330 + i * 70} 1100)`} />)}</Room></Cam>;
  }
  return <g>{shot}<HUD day={s.day} flip={s.flip % 1} who="Pia" v={s.bal} drop={s.drop} /></g>;
};

/* ---------- 4. Bea, the self-investor ---------- */
export const S4: React.FC<SP> = ({ sc }) => {
  const cB = 2.0, cC = E(sc, 1) + 0.3, cD = T(sc, 2) - 0.1, cE = T(sc, 3) - 0.2, cF = T(sc, 4) - 0.2;
  const s = useTimeline({ bal: 2600000, drop: 0, web: 0, zF: 1.5, flash: 0 }, (tl, v) => {
    tl.to(v, { bal: 600000, duration: 2.6, ease: "power1.in" }, 0.6).to(v, { drop: 1, duration: 0.1 }, 0.6).to(v, { drop: 0, duration: 0.1 }, 3.2)
      .to(v, { web: 1, duration: 1.6 }, cC + 0.2).to(v, { zF: 2.2, duration: 0.2, ease: "power4.out" }, T(sc, 4) + 0.7)
      .to(v, { flash: 0.8, duration: 0.05 }, T(sc, 4) + 0.7).to(v, { flash: 0, duration: 0.4 }, T(sc, 4) + 0.75);
  });
  const { f } = s, t = f / 30, mo = mouth(sc, "Bea", t);
  const stack = (dusty: number) => <g>{[["ENGLISH 101", "#60a5fa"], ["LEARN CODING", "#34d399"], ["GYM 12 MONTHS", "#f87171"], ["SKILLS", "#facc15"]].map(([txt, c], i) => <g key={txt} transform={`translate(0 ${-i * 92}) rotate(${(i % 2 ? 3 : -3)})`}><rect x={-150} y={-84} width={300} height={84} rx={8} fill={c} stroke={INK} strokeWidth={7} /><text y={-30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={30} fill={INK}>{txt}</text><path d="M -150 -42 L 150 -42" stroke="#fff" strokeWidth={6} opacity={0.7} /></g>)}
    {dusty > 0 && <g opacity={dusty}><rect x={-160} y={-380} width={320} height={380} fill="#9ca3af" opacity={0.35} />{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={150} y1={-380} x2={150 - Math.cos(i * 0.3) * 200} y2={-380 + Math.sin(i * 0.3) * 200} stroke="#f8fafc" strokeWidth={3} />)}{[60, 120, 180].map((r) => <path key={r} d={`M ${150 - r} -380 A ${r} ${r} 0 0 0 150 ${-380 + r}`} stroke="#f8fafc" strokeWidth={3} fill="none" />)}</g>}</g>;
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={1150} z={1.25}><Room f={f} wall="#bfdbfe"><Student who="Bea" id="b4a" x={420} y={1650} s={0.95} expr="determined" pose={{ aF: [100, 150], aB: [-100, -150], lean: 4 * Math.sin(t * 6) }} /><g transform={`translate(430 ${960}) rotate(${Math.sin(t * 6) * 4})`}>{stack(0)}</g></Room></Cam>;
  else if (t < cC) shot = <Cam x={420} y={1000} z={1.7}><Room f={f} wall="#bfdbfe"><g transform="translate(720 1430)">{stack(0)}</g><Student who="Bea" id="b4b" x={360} y={1650} s={0.95} expr={mo ? "talk" : "smug"} look={{ mouth: mo, look: 0.4 }} pose={{ aF: [70, 120], aB: [-40, 30] }} /></Room></Cam>;
  else if (t < cE) {
    shot = <Cam x={540} y={1150} z={1.3}><Room f={f} wall="#93a4c4" night={1}>
      <g transform="translate(760 1450)">{stack(s.web)}</g>
      <g transform="rotate(-90 300 1120)"><Student who="Bea" id="b4c" x={300} y={1120} s={0.8} expr="happy" pose={{ aB: [-150, -170], aF: [-150, -170] }} /></g>
      <g transform="translate(340 1000)"><rect x={-90} y={-60} width={180} height={110} rx={8} fill="#1f2937" stroke={INK} strokeWidth={6} /><rect x={-76} y={-48} width={152} height={86} fill="#93c5fd" opacity={0.6 + 0.3 * Math.sin(t * 7)} /></g>
      {t >= cD && <g transform="translate(760 760)"><rect x={-250} y={-80} width={500} height={150} rx={20} fill="#111827" stroke={INK} strokeWidth={8} /><text y={-16} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill="#cbd5e1">COURSES OPENED</text><text y={52} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={70} fill="#f87171">0</text></g>}
    </Room></Cam>;
  } else {
    const close = t >= cF;
    shot = <Cam x={close ? 560 : 540} y={close ? 900 : 1100} z={close ? s.zF : 1.3}>
      <rect x={-800} y={-800} width={2700} height={3600} fill="#e5e7eb" /><rect x={-800} y={1300} width={2700} height={1400} fill="#9ca3af" />
      <g transform="translate(160 1200)"><rect x={-60} y={-200} width={40} height={200} fill="#374151" /><rect x={-140} y={-220} width={200} height={40} rx={20} fill="#111827" /></g>
      <rect x={480} y={320} width={460} height={980} rx={20} fill="#cbd5e1" stroke={INK} strokeWidth={10} /><path d="M 520 360 L 640 360 L 520 520 Z" fill="#fff" opacity={0.5} />
      <Student who="Bea" id="b4e" x={700} y={1500} s={0.9} expr={close ? "smug" : "happy"} blush pose={{ aF: [150, 175], aB: [-40, 30], head: -8 }} holdF={<PhoneP s={0.45} />} />
      <text x={540} y={400} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={72} fill="#fff" stroke={INK} strokeWidth={12} paintOrder="stroke fill">GYM VISITS: 1</text>
    </Cam>;
  }
  return <g>{shot}<Flash k={s.flash} /><HUD day={12} who="Bea" v={s.bal} drop={s.drop} /></g>;
};
