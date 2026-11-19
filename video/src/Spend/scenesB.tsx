// Scenes 5–8: Yuki the "I'll check later" student, Otto the borrower, Gus the super saver, the end of the month.
import React from "react";
import { useTimeline } from "../Sleep/timeline";
import { INK } from "../Toon/Lily";
import { Cam, Rays, Spark, Zs } from "../Toon/props";
import { Flash } from "../Toon/scenes";
import { Big } from "../Free/scenes1";
import { Balance, Calendar, COLOR, Noodle, PhoneP, Student, Wallet, type Who } from "./cast";
import { E, END, HUD, mouth, T, type SP } from "./scenesA";
import { DormTop, Hallway, ORDER, Road, Room, Table } from "./sets";

/* ---------- 5. Yuki: "I'll check later" ---------- */
export const S5: React.FC<SP> = ({ sc }) => {
  const cB = 3.0, cC = E(sc, 1) + 0.2, cD = T(sc, 2) - 0.1, cE = T(sc, 3) + 0.9, cF = T(sc, 4) - 0.15;
  const s = useTimeline({ swipe: 0, day: 14, flip: 0, wipe: 0, faint: 0, zF: 1.5 }, (tl, v) => {
    tl.to(v, { swipe: 1, duration: 0.3, yoyo: true, repeat: 7 }, 0.4)
      .to(v, { day: 20, duration: 1.4, ease: "power1.in" }, cC + 0.2).to(v, { flip: 1, duration: 0.22, repeat: 5 }, cC + 0.2)
      .to(v, { wipe: 1, duration: 0.8, ease: "power1.inOut" }, cD + 0.3)
      .to(v, { faint: 1, duration: 0.3, ease: "power2.in" }, cF + 0.1).to(v, { zF: 2.3, duration: 0.2, ease: "power4.out" }, T(sc, 4) - 0.05);
  });
  const { f } = s, t = f / 30, mo = mouth(sc, "Yuki", t);
  // hammock: back canvas, Yuki lying in the sag (head end raised), front canvas wrapping over his body
  const sw = Math.sin(f / 18) * 8;
  const hammock = (kids: React.ReactNode) => <g><path d="M 120 880 L 120 1320 M 960 880 L 960 1320" stroke="#78350f" strokeWidth={22} />{[120, 960].map((x) => <circle key={x} cx={x} cy={880} r={16} fill="#78350f" />)}
    <path d={`M 120 960 Q 540 ${1360 + sw} 960 960 Q 540 ${1290 + sw} 120 960 Z`} fill="#eab308" stroke={INK} strokeWidth={7} strokeLinejoin="round" />{kids}
    <path d={`M 135 972 Q 540 ${1400 + sw} 945 972 Q 540 ${1260 + sw} 135 972 Z`} fill="#fde68a" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={300 + i * 120} y1={1100 + sw - Math.abs(i - 2) * 26} x2={300 + i * 120} y2={1170 + sw - Math.abs(i - 2) * 34} stroke="#d97706" strokeWidth={5} />)}</g>;
  const lying = (expr: React.ComponentProps<typeof Student>["expr"], arm: [number, number]) => <g transform={`rotate(${8} 600 ${1100 + sw})`}><g transform={`rotate(-90 760 ${1100 + sw})`}><Student who="Yuki" id="y5" x={760} y={1100 + sw} s={0.62} expr={expr} look={{ mouth: mo }} pose={{ aF: arm, aB: [-20, -10], lB: [-4, -2], lF: [6, 2] }} holdF={s.swipe > 0.1 && t < cC ? <rect x={-30} y={-20} width={60} height={40} rx={5} fill="#facc15" stroke={INK} strokeWidth={5} /> : undefined} /></g></g>;
  const dustyPhone = (k: number) => <g transform="translate(830 1320)"><rect x={-110} y={-20} width={220} height={20} fill="#a16207" stroke={INK} strokeWidth={5} /><g transform="translate(0 -110)"><PhoneP s={0.7} screen="#dbeafe"><rect x={-40} y={-50} width={80} height={80} rx={14} fill="#16a34a" /><text y={6} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={26} fill="#fff">BANK</text><rect x={-50} y={-100} width={100} height={190} fill="#9ca3af" opacity={0.55 * (1 - k)} /></PhoneP></g></g>;
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={1050} z={1.25}><Room f={f} wall="#fef08a">{hammock(lying("sleepy", [90 + 40 * s.swipe, 120]))}{dustyPhone(0)}</Room>{s.swipe > 0.5 && <Big text="BEEP" x={820} y={760} k={1} size={70} c="#86efac" />}</Cam>;
  else if (t < cC) shot = <Cam x={430} y={1000} z={1.9}><Room f={f} wall="#fef08a">{hammock(lying(mo ? "talk" : "sleepy", [40, 20]))}{dustyPhone(0)}</Room></Cam>;
  else if (t < cD) shot = <g><rect x={-100} y={-100} width={1280} height={2120} fill="#fef3c7" /><g transform="translate(540 820) scale(2.6) translate(-175 -170)"><Calendar day={s.day} flip={s.flip % 1} /></g></g>;
  else if (t < cE) shot = <Cam x={760} y={1150} z={2.1}><Room f={f} wall="#fef08a">{hammock(lying("deadpan", [100, 60]))}{dustyPhone(s.wipe)}<g transform={`translate(${760 + s.wipe * 120} 1180)`}><circle r={22} fill="#fff" stroke={INK} strokeWidth={7} /></g></Room></Cam>;
  else if (t < cF) shot = <g><rect x={-100} y={-100} width={1280} height={2120} fill="#0f172a" /><g transform="translate(540 900) scale(3.4)"><PhoneP s={1} screen="#f8fafc"><text y={-50} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={13} fill="#64748b">BALANCE</text><text y={-10} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={24} fill="#dc2626">12,000đ</text></PhoneP></g></g>;
  else shot = <Cam x={560} y={1050} z={s.zF}><Room f={f} wall="#fef08a">{hammock(lying("shock", [140, 170]))}<Wallet x={760} y={1180 - (1 - s.faint) * 40} s={0.9} mood={s.faint > 0.5 ? "faint" : "worried"} strap={COLOR.Yuki} f={f} /></Room></Cam>;
  const known = t >= cE;
  return <g>{shot}<Calendar day={s.day} flip={s.flip % 1} /><g>{known ? <Balance who="Yuki" v={12000} /> : <g><Balance who="Yuki" v={0} /><rect x={640} y={150} width={330} height={74} rx={10} fill="#111827" /><text x={805} y={204} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={60} fill="#94a3b8">???</text></g>}</g></g>;
};

/* ---------- 6. Otto the borrower ---------- */
export const S6: React.FC<SP> = ({ sc }) => {
  const cB = 2.2, cB2 = T(sc, 1) - 0.1, cC = E(sc, 2) + 0.25, cD = T(sc, 3) - 0.1, cE = T(sc, 4) - 0.2;
  const s = useTimeline({ knock: 0, bal: 0, count: 0, zE: 1.5, flash: 0 }, (tl, v) => {
    tl.to(v, { knock: 1, duration: 0.09, yoyo: true, repeat: 5 }, 0.5).to(v, { bal: 250000, duration: 1.2, ease: "power1.out" }, cD).to(v, { count: 1, duration: 1.6 }, cD)
      .to(v, { zE: 2.1, duration: 0.2, ease: "power4.out" }, T(sc, 4) + 0.6).to(v, { flash: 0.8, duration: 0.05 }, T(sc, 4) + 1.4).to(v, { flash: 0, duration: 0.4 }, T(sc, 4) + 1.45);
  });
  const { f } = s, t = f / 30, mo = mouth(sc, "Otto", t);
  const otto = (x: number, pose: Partial<React.ComponentProps<typeof Student>["pose"]> = {}, expr: React.ComponentProps<typeof Student>["expr"] = "happy", flip = false) => <Student who="Otto" id="o6" x={x} y={1640} s={0.95} flip={flip} expr={mo ? "talk" : expr} look={{ mouth: mo, look: 0.5 }} pose={{ aF: [20, 10], aB: [-20, -10], ...pose }} />;
  const door = (who: Who, k: number) => <g><Student who={who} id={`d6${who}`} x={760} y={1640} s={0.95} flip expr="worried" pose={{ aB: [40, 60], aF: [-20, -10] }} /><Wallet x={900} y={1420} s={0.55} mood="shake" strap={COLOR[who]} f={f + k * 7} /></g>;
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={420} y={1100} z={1.35}><Hallway f={f}>{otto(300, { aF: [110 + 30 * s.knock, 150] }, "happy")}</Hallway>{s.knock > 0.2 && <Big text="KNOCK" x={460} y={760} k={1} size={80} c="#fff" />}</Cam>;
  else if (t < cB2) shot = <Cam x={540} y={1050} z={1.5}><Hallway f={f}>{otto(330, { aF: [90, 140] })}{door("Ray", 0)}</Hallway></Cam>;
  else if (t < cC) shot = <Cam x={540} y={1050} z={1.5}><Hallway f={f}>{otto(330, { aF: [80, 30], aB: [-40, 30] })}{door("Pia", 1)}</Hallway></Cam>;
  else if (t < cD) shot = <g><rect x={-100} y={-100} width={1280} height={2120} fill="#e7e5e4" />{(["Ray", "Pia", "Bea", "Gus"] as Who[]).map((w, i) => <g key={w}><Student who={w} id={`m6${w}`} x={170 + i * 250} y={1250} s={0.62} expr="worried" pose={{ aB: [40, 60] }} /><Wallet x={250 + i * 250} y={1150} s={0.42} mood="shake" strap={COLOR[w]} f={f + i * 9} /></g>)}<Big text="NOPE." y={420} k={1} size={120} c="#fca5a5" /></g>;
  else if (t < cE) shot = <Cam x={540} y={1050} z={1.5}><Hallway f={f}>{otto(540, { aF: [100, 150], aB: [70, 140] }, "smug")}{Array.from({ length: 5 }).map((_, i) => <rect key={i} x={430 + i * 24} y={830 - i * 10 - s.count * i * 6} width={90} height={50} rx={6} fill="#86efac" stroke={INK} strokeWidth={5} />)}</Hallway></Cam>;
  else shot = <Cam x={540} y={950} z={s.zE}><Rays x={540} y={900} f={f} a="#fed7aa" b="#fdba74" />{[[180, 600], [900, 700]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={1.4} c="#fff" />)}<Student who="Otto" id="o6e" x={540} y={1640} s={0.95} expr="smug" pose={{ aF: [130, 165], aB: [-40, 30], head: -8 }} holdF={<g transform="translate(0 -60) rotate(10)"><PhoneP s={0.6} fancy screen="#c4b5fd" /></g>} /></Cam>;
  return <g>{shot}<Flash k={s.flash} /><HUD day={23} who="Otto" v={s.bal} /></g>;
};

/* ---------- 7. Gus the super saver ---------- */
export const S7: React.FC<SP> = ({ sc }) => {
  const cB = 3.0, cC = E(sc, 2) + 0.05, cD = T(sc, 4) - 0.6, cE = T(sc, 5) - 0.2, cF = T(sc, 6) - 0.2;
  const s = useTimeline({ bus: -1600, walk: 0, collapse: 0, zF: 1.4 }, (tl, v) => {
    tl.to(v, { bus: 2400, duration: 1.4, ease: "none" }, cC + 0.6).to(v, { walk: 1, duration: cD - cC, ease: "none" }, cC)
      .to(v, { collapse: 1, duration: 0.35, ease: "power2.in" }, cF + 0.1).to(v, { zF: 2.0, duration: 0.2, ease: "power4.out" }, T(sc, 6) + 0.1);
  });
  const { f } = s, t = f / 30, mo = mouth(sc, "Gus", t);
  const gus = (x: number, y: number, sc2: number, pose: object, expr: React.ComponentProps<typeof Student>["expr"], hold?: React.ReactNode) => <Student who="Gus" id="g7" x={x} y={y} s={sc2} expr={mo ? "talk" : expr} look={{ mouth: mo, look: 0.4 }} pose={pose} holdF={hold} />;
  const book = <g transform="translate(0 -10)"><rect x={-60} y={-80} width={120} height={150} rx={8} fill="#166534" stroke={INK} strokeWidth={6} /><rect x={-48} y={-66} width={96} height={20} fill="#bbf7d0" /></g>;
  const sign = <g transform="translate(820 900)"><line x1={0} y1={0} x2={0} y2={380} stroke="#374151" strokeWidth={16} /><rect x={-170} y={-120} width={340} height={200} rx={16} fill="#1d4ed8" stroke={INK} strokeWidth={9} /><text y={-40} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={60} fill="#fff">PARKING</text><text y={40} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={66} fill="#fde047">2,000đ</text></g>;
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={1100} z={1.2}><Road f={f}>{sign}{gus(380, 1500, 0.95, { aF: [100, 150], aB: [-30, -10] }, "worried", book)}</Road></Cam>;
  else if (t < cC) shot = <Cam x={520} y={950} z={1.9}><Road f={f}>{sign}{gus(380, 1500, 0.95, { aF: [100, 150], aB: [-30, -10] }, "shock", book)}</Road></Cam>;
  else if (t < cD) {
    const x = -100 + 900 * s.walk, ph = Math.sin(t * 9);
    shot = <Cam x={540} y={1150} z={1.1}><Road f={f} busX={s.bus}>
      <g transform="translate(160 1250)"><line x1={0} y1={0} x2={0} y2={-260} stroke="#374151" strokeWidth={12} /><rect x={-90} y={-330} width={180} height={90} rx={10} fill="#16a34a" stroke={INK} strokeWidth={7} /><text y={-270} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={50} fill="#fff">5 KM</text></g>
      {gus(x, 1390, 0.85, { lean: -10, lB: [-24 * ph, -8], lF: [24 * ph, 8], aF: [-20 * ph + 20, 10], aB: [20 * ph - 20, -10] }, "worried", book)}
      {[0, 1].map((i) => { const k = (t * 1.6 + i * 0.5) % 1; return <path key={i} d="M 0 -18 Q 12 0 0 12 Q -12 0 0 -18 Z" transform={`translate(${x - 60 + i * 40} ${700 + k * 60}) scale(1.6)`} fill="#7dd3fc" stroke={INK} strokeWidth={3} opacity={1 - k} />; })}
    </Road></Cam>;
  } else if (t < cE) {
    shot = <Cam x={700} y={1000} z={1.55}><Room f={f} wall="#bbf7d0">
      <g transform="translate(830 960)"><rect x={-170} y={-140} width={340} height={210} rx={12} fill="#1f2937" stroke={INK} strokeWidth={8} /><rect x={-154} y={-126} width={308} height={182} fill="#f8fafc" />{Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1={-154} y1={-126 + i * 30} x2={154} y2={-126 + i * 30} stroke="#86efac" strokeWidth={3} />)}{Array.from({ length: 6 }).map((_, i) => <line key={`v${i}`} x1={-154 + i * 52} y1={-126} x2={-154 + i * 52} y2={56} stroke="#86efac" strokeWidth={3} />)}<text y={-90} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={18} fill="#166534">SPREADSHEET OF SPREADSHEETS</text></g>
      <g transform="translate(600 1000) rotate(-8)"><rect x={-90} y={-30} width={180} height={60} fill="#166534" stroke={INK} strokeWidth={6} />{[0, 1, 2, 3].map((i) => <rect key={i} x={-86} y={-30 - (i + 1) * 14} width={172} height={14} fill="#fef3c7" stroke={INK} strokeWidth={3} />)}</g>
      {gus(470, 1640, 0.95, { aF: [70, 110], aB: [-30, -10] }, "smug")}
    </Room></Cam>;
  } else if (t < cF) shot = <g><Rays x={540} y={900} f={f} a="#bbf7d0" b="#86efac" /><Wallet x={540} y={1000} s={1.6} mood="fat" strap={COLOR.Gus} f={f} /><Zs x={720} y={760} f={f} s={1.3} /><Big text="RICHEST" y={430} k={1} size={130} c="#fde68a" /></g>;
  else shot = <Cam x={600} y={1080} z={s.zF}><Room f={f} wall="#bbf7d0"><g transform={`rotate(${90 * s.collapse} 300 1240)`}>{gus(300, 1240, 0.9, { aF: [-30, -10], aB: [30, 10] }, s.collapse > 0.5 ? "sleepy" : "deadpan")}</g>{s.collapse > 0.9 && <Zs x={760} y={1050} f={f} />}</Room></Cam>;
  return <g>{shot}<HUD day={28} who="Gus" v={2950000} /></g>;
};

/* ---------- 8. End of the month ---------- */
export const S8: React.FC<SP> = ({ sc }) => {
  const cB = T(sc, 2) - 1.0, cC = T(sc, 3) + 0.5, cD = E(sc, 3) + 0.4, cE = T(sc, 4) - 0.3, cF = E(sc, 4) + 0.5;
  const s = useTimeline({ zA: 1.0, share: 0, rows: 0, end: 0, zE: 1.6 }, (tl, v) => {
    tl.to(v, { zA: 1.5, duration: cB, ease: "power1.in" }, 0).to(v, { share: 1, duration: 1.4, ease: "power1.inOut" }, cC)
      .to(v, { rows: 4, duration: 1.6, ease: "none" }, cD).to(v, { zE: 2.1, duration: 0.2, ease: "power4.out" }, T(sc, 4) + 1.4).to(v, { end: 1, duration: 0.45, ease: "back.out(1.8)" }, cF + 0.2);
  });
  const { f } = s, t = f / 30;
  // the round table: four students along the back, Gus and Otto at the near corners turned inward; the tabletop hides
  // their legs, a hanging lamp lights the middle, a noodle cup in front of everyone
  const seats: [Who, number, number, number, boolean][] = [["Gus", 120, 1270, 0.72, false], ["Pia", 300, 1180, 0.62, false], ["Ray", 450, 1170, 0.62, false], ["Bea", 630, 1170, 0.62, true], ["Yuki", 780, 1180, 0.62, true], ["Otto", 960, 1270, 0.72, true]];
  const table = (gusShare: number, expr: (w: Who) => React.ComponentProps<typeof Student>["expr"], wallets = false) => (
    <Table f={f}>
      <rect x={-900} y={1290} width={2900} height={1500} fill="#2a2347" />
      <line x1={540} y1={-200} x2={540} y2={560} stroke={INK} strokeWidth={6} />
      <path d="M 450 640 Q 540 520 630 640 Z" fill="#f59e0b" stroke={INK} strokeWidth={8} /><ellipse cx={540} cy={642} rx={34} ry={12} fill="#fff7d6" />
      <path d="M 470 646 L 110 1250 L 970 1250 L 610 646 Z" fill="#ffd27f" opacity={0.12} />
      {seats.map(([w, x, y, sz, fl]) => <Student key={w} who={w} id={`t8${w}`} x={x} y={y} s={sz} flip={fl} expr={expr(w)} look={{ look: 0.3 }} pose={{ sit: 1.235, lB: [80, 6], lF: [86, 10], aF: [70, 120], aB: [50, 100] }} />)}
      <path d="M 40 1270 Q 40 1340 540 1350 Q 1040 1340 1040 1270 L 1040 1310 Q 1040 1400 540 1410 Q 40 1400 40 1310 Z" fill="#92400e" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <ellipse cx={540} cy={1270} rx={500} ry={90} fill="#ca8a04" stroke={INK} strokeWidth={9} /><ellipse cx={540} cy={1262} rx={330} ry={52} fill="#fbbf24" opacity={0.45} />
      {seats.map(([w, x], i) => <g key={w} transform={`translate(${x + (x < 540 ? 70 : -70) * (i === 0 || i === 5 ? 1 : 0.3)} ${1290 - (i === 0 || i === 5 ? 10 : 50)})`}><Noodle s={0.36} f={f} /></g>)}
      {gusShare > 0 && <g transform={`translate(${200 + 340 * gusShare} 1270)`}><rect x={-80} y={-40} width={160} height={60} rx={10} fill="#fef3c7" stroke={INK} strokeWidth={6} />{[-40, 0, 40].map((dx) => <circle key={dx} cx={dx} cy={-34} r={18} fill="#fff" stroke={INK} strokeWidth={4} />)}</g>}
      {wallets && seats.map(([w], i) => <Wallet key={w} x={330 + i * 76} y={1220 + (i % 2) * 8} s={0.2} mood="smile" strap={COLOR[w]} f={f} />)}
    </Table>
  );
  let shot: React.ReactNode;
  if (t < cB) shot = <Cam x={540} y={960} z={s.zA} r={-4}><DormTop f={f} night={1} middle={<g><circle cx={540} cy={960} r={150} fill="#a16207" stroke={INK} strokeWidth={8} />{ORDER.map((w, i) => { const a = (i / 6) * Math.PI * 2; return <g key={w}><circle cx={540 + Math.cos(a) * 190} cy={960 + Math.sin(a) * 190} r={46} fill="#fff" stroke={INK} strokeWidth={6} /><path d={`M ${540 + Math.cos(a) * 190 - 44} ${960 + Math.sin(a) * 190 - 6} A 44 44 0 0 1 ${540 + Math.cos(a) * 190 + 44} ${960 + Math.sin(a) * 190 - 6} Z`} fill={COLOR[w]} /><circle cx={540 + Math.cos(a) * 95} cy={960 + Math.sin(a) * 95} r={24} fill="#fcd34d" stroke={INK} strokeWidth={4} /></g>; })}</g>} /></Cam>;
  else if (t < cC) shot = <Cam x={540} y={1120} z={1.15}>{table(0, () => "sleepy")}</Cam>;
  else if (t < cD) shot = <Cam x={460} y={1100} z={1.3}>{table(s.share, (w) => (w === "Gus" ? "deadpan" : s.share > 0.5 ? "happy" : "worried"), s.share > 0.6)}</Cam>;
  else if (t < cE) {
    const rows: [string, string, string][] = [["Bubble teas bought", "Ly trà sữa đã mua", "47"], ["Duck lamps", "Đèn con vịt", "1"], ["Courses finished", "Khóa học hoàn thành", "0"], ["Money left", "Còn tiền", "Gus only"]];
    shot = <g><rect x={-100} y={-100} width={1280} height={2120} fill="#312e81" /><g transform="translate(540 820)"><rect x={-480} y={-420} width={960} height={840} rx={40} fill="#fffdf5" stroke={INK} strokeWidth={12} /><text y={-320} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={62} fill="#db2777">END-OF-MONTH REPORT</text>
      {rows.map(([en, vi, val], i) => { const k = Math.max(0, Math.min(1, s.rows - i)); return k <= 0 ? null : <g key={en} transform={`translate(0 ${-200 + i * 150}) scale(${k})`}><text x={-420} y={0} fontFamily="ToonSans" fontWeight={800} fontSize={46} fill={INK}>{en}</text><text x={-420} y={44} fontFamily="ToonSans" fontWeight={800} fontSize={32} fill="#64748b">{vi}</text><text x={420} y={22} textAnchor="end" fontFamily="ToonSans" fontWeight={800} fontSize={62} fill={i === 3 ? "#16a34a" : "#ef4444"}>{val}</text></g>; })}</g></g>;
  } else if (t < cF) {
    const mo = mouth(sc, "Ray", t);
    const stare = t > T(sc, 4) + 1.4;
    shot = stare ? <Cam x={540} y={1120} z={1.15}>{table(1, (w) => (w === "Ray" ? "smug" : "deadpan"))}</Cam>
      : <Cam x={450} y={1020} z={s.zE}>{table(1, (w) => (w === "Ray" ? (mo ? "talk" : "smug") : "happy"))}</Cam>;
  } else {
    shot = <g><Rays x={540} y={1200} f={f} a="#c7d2fe" b="#a5b4fc" />
      {(["Ray", "Pia", "Bea", "Yuki", "Otto", "Gus"] as Who[]).map((w, i) => <Student key={w} who={w} id={`e8${w}`} x={110 + i * 172} y={1640} s={0.55} expr="smug" pose={{ aF: [20, 10], aB: [-20, -10] }} />)}
      {s.end > 0.01 && <g transform={`translate(540 560) scale(${s.end})`}><rect x={-450} y={-170} width={900} height={340} rx={40} fill="#1e1b4b" stroke={INK} strokeWidth={10} /><text y={-60} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={60} fill="#fde68a">Tip: save first, spend later.</text><text y={30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={74} fill="#fff">Which one are YOU?</text><text y={110} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={46} fill="#cbd5e1">Bạn là kiểu nào?</text>
        <path transform={`translate(0 ${260 + Math.sin(t * 6) * 14})`} d="M -40 -50 L 40 -50 L 40 0 L 80 0 L 0 80 L -80 0 L -40 0 Z" fill="#fde047" stroke={INK} strokeWidth={9} strokeLinejoin="round" /></g>}</g>;
  }
  void END;
  return <g>{shot}<Calendar day={30} /><Balance who="Gus" v={2950000} /></g>;
};
