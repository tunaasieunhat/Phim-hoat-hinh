// Scenes 1–2 of the rainy-day toon: fast cuts (≈2–3 s), camera pushes/pans, a top-down insert, a low-angle hero shot.
// All motion is a paused GSAP timeline seeked per frame (useTimeline); shot changes are hard cuts keyed to the words.
import React from "react";
import { Tear } from "../Rain/stage";
import { useTimeline } from "../Sleep/timeline";
import type { SceneData } from "./data";
import { INK, Toon, toonJoints, type ToonPose } from "./Lily";
import { Book, Cam, Cloud, Grade, Mug, Phone, Rays, Spark, Stamp, Zs } from "./props";
import { Desk, H, RainyRoom, W } from "./sets";

export type SP = { sc: SceneData };
export const lines = (sc: SceneData) => ({
  T: (i: number) => sc.lines[i].t0, E: (i: number) => sc.lines[i].t1,
  word: (w: string) => sc.lines.flatMap((l) => l.words).find((x) => x.w.toLowerCase().startsWith(w))?.t0 ?? 0,
});
// mouth flap while the character's own words are being spoken
export const talking = (sc: SceneData, who: string, t: number) => {
  const w = sc.lines.filter((l) => l.who === who).flatMap((l) => l.words).find((x) => t >= x.t0 && t < x.t1 + 0.04);
  return w ? 0.35 + 0.65 * Math.abs(Math.sin((t - w.t0) * 18)) : 0;
};
export const Flash: React.FC<{ k: number; color?: string }> = ({ k, color = "#fff" }) => k <= 0.01 ? null : <rect width={W} height={H} fill={color} opacity={k} />;
export const Label: React.FC<{ en: string; vi: string; k: number }> = ({ en, vi, k }) => k <= 0.01 ? null : (
  <g transform={`translate(540 480) scale(${0.85 + 0.15 * k})`} opacity={k} textAnchor="middle" fontFamily="ToonSans" fontWeight={800}>
    <rect x={-440} y={-64} width={880} height={140} rx={30} fill="rgba(23,22,28,0.72)" />
    <text y={-6} fontSize={56} fill="#fde68a">{en}</text><text y={50} fontSize={42} fill="#fff">{vi}</text>
  </g>
);
export const SIT: ToonPose = { sit: 1.235, lB: [80, 6], lF: [86, 10] };

export const cuts1 = (sc: SceneData) => ({ cB: sc.lines[1].t0 - 0.25, cC: sc.lines[2].t0 - 0.05, cD: sc.lines[3].t0 - 0.1, better: lines(sc).word("better") });
export const cuts2 = (sc: SceneData) => ({ tear: sc.tear ?? sc.lines[0].t0 - 0.8, cF: 1.9, cH: sc.lines[1].t0 - 0.2, cH2: 8.0, cI: sc.lines[2].t0 - 0.15, cI2: 11.4 });

/* ---------- 1. It's raining. Lily has a plan. ---------- */
export const Toon1: React.FC<SP> = ({ sc }) => {
  const { T, word } = lines(sc);
  const cB = T(1) - 0.25, cC = T(2) - 0.05, cD = T(3) - 0.1;
  const s = useTimeline({ zA: 1.55, flash: 0, wave: 0, curtain: 0, pull: 0, zB: 1.15, wake: 0, write: 0, zC: 1.0, rC: -3, fist: 0, zD: 1.0, hop: 0 }, (tl, v) => {
    tl.to(v, { zA: 1.95, duration: cB, ease: "none" }, 0).to(v, { flash: 0.85, duration: 0.05 }, 0.12).to(v, { flash: 0, duration: 0.5 }, 0.17)
      .to(v, { wave: 1, duration: 0.3 }, 0.9)
      .to(v, { pull: 1, duration: 0.18, ease: "power2.out" }, cB + 0.1).to(v, { curtain: 1, duration: 0.35, ease: "power3.out" }, cB + 0.22).to(v, { pull: 0, duration: 0.3 }, cB + 0.6)
      .to(v, { zB: 1.42, duration: cC - cB, ease: "power1.inOut" }, cB).to(v, { wake: 1, duration: 0.2 }, cB + 0.5)
      .to(v, { write: 4, duration: 1.55, ease: "none" }, cC + 0.1).to(v, { zC: 1.14, rC: 2, duration: cD - cC, ease: "none" }, cC)
      .to(v, { fist: 1, duration: 0.3, ease: "back.out(2.5)" }, cD + 0.05).to(v, { hop: 1, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, cD + 0.05)
      .to(v, { zD: 1.3, duration: 0.16, ease: "power4.out" }, word("better") - 0.05);
  });
  const { f } = s, t = f / 30;
  let shot: React.ReactNode;
  if (t < cB) {
    // A · close on the rainy window: the cloud outside waves hello
    shot = <Cam x={540} y={650} z={s.zA}><RainyRoom f={f} fg={false} cloud={<Cloud x={540} y={560} s={0.9} f={f} mood="smug" wave={s.wave} />} /></Cam>;
  } else if (t < cC) {
    // B · Lily yanks the curtains open; the cloud grins at her
    const pose: ToonPose = { lean: -4 - 6 * s.pull, aF: [70 + 40 * s.pull, 80 + 40 * s.pull], aB: [-20, -10], lB: [-10, -4], lF: [8, 4] };
    shot = (
      <Cam x={700} y={1080} z={s.zB}>
        <RainyRoom f={f} curtain={s.curtain} cloud={<Cloud x={560} y={560} s={0.9} f={f} mood="happy" wave={1} />}>
          <Toon id="l1b" x={860} y={1560} s={0.98} flip pose={pose} expr={s.wake > 0.5 ? (talking(sc, "Lily", t) ? "talk" : "smug") : "sleepy"} look={{ look: 0.6 }} blush={s.wake > 0.5} />
        </RainyRoom>
      </Cam>
    );
  } else if (t < cD) {
    // C · top-down: the plan gets written
    const items = ["Read a book", "Work out", "Clean my room", "Cook healthy"];
    const i = Math.min(3, Math.floor(s.write)), fr = s.write >= 4 ? 1 : s.write - i;
    const tip: [number, number] = [330 + fr * 420, 760 + i * 130];
    shot = (
      <Cam x={540} y={960} z={s.zC} r={s.rC}>
        <Desk f={f}>
          <g transform="translate(860 330)"><circle r={86} fill="#fef3c7" stroke={INK} strokeWidth={8} /><circle r={62} fill="#7c4a2a" /><circle cx={-18} cy={-16} r={10} fill="#a8734d" /><path d="M 84 -10 q 46 4 40 40" stroke={INK} strokeWidth={10} fill="none" /></g>
          <g transform="translate(170 1600) rotate(-20)"><Phone s={2.2} screen="#1f2937" /></g>
          <g transform="rotate(-4 540 960)">
            <rect x={190} y={460} width={700} height={900} rx={10} fill="#fffdf6" stroke={INK} strokeWidth={8} />
            {Array.from({ length: 11 }).map((_, k) => <line key={k} x1={210} y1={580 + k * 70} x2={870} y2={580 + k * 70} stroke="#bfdbfe" strokeWidth={3} />)}
            <line x1={270} y1={460} x2={270} y2={1360} stroke="#fca5a5" strokeWidth={4} />
            <text x={540} y={560} textAnchor="middle" fontFamily="KidsHand" fontSize={84} fill="#db2777">TODAY'S PLAN</text>
            {items.map((it, k) => (
              <g key={it}>
                <clipPath id={`wr${k}`}><rect x={280} y={700 + k * 130} width={k < i ? 700 : k === i ? 60 + fr * 520 : 0} height={110} /></clipPath>
                <g clipPath={`url(#wr${k})`}><rect x={290} y={720 + k * 130} width={50} height={50} rx={8} fill="#fff" stroke={INK} strokeWidth={5} /><text x={370} y={768 + k * 130} fontFamily="KidsHand" fontSize={70} fill={INK}>{it}</text></g>
              </g>
            ))}
            {/* hand and pencil */}
            <g transform={`translate(${tip[0]} ${tip[1] + Math.sin(f * 1.3) * 6})`}>
              <line x1={30} y1={40} x2={460} y2={900} stroke={INK} strokeWidth={16} strokeLinecap="round" />
              <g transform="rotate(-32)"><rect x={-12} y={-190} width={24} height={170} fill="#facc15" stroke={INK} strokeWidth={5} /><path d="M -12 -20 L 12 -20 L 0 6 Z" fill="#fde68a" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><rect x={-12} y={-210} width={24} height={22} fill="#f9a8d4" stroke={INK} strokeWidth={5} /></g>
              <circle cx={30} cy={40} r={34} fill="#fff" stroke={INK} strokeWidth={8} />
            </g>
          </g>
          {s.write > 3.98 && <Spark x={860} y={560} s={1.4 + 0.2 * Math.sin(f / 3)} />}
        </Desk>
      </Cam>
    );
  } else {
    // D · low-angle hero shot: fist up, sunburst behind
    const talk = talking(sc, "Lily", t);
    shot = (
      <Cam x={540} y={1000 - (s.zD - 1) * 300} z={s.zD}>
        <Rays x={540} y={760} f={f} a="#fbcfe8" b="#f9a8d4" />
        <Cloud x={880} y={330} s={0.7} f={f} mood="grumpy" rain={1} />
        {[[180, 520], [930, 820], [150, 1100], [880, 1250]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={0.9 + 0.3 * Math.sin(f / 4 + i)} c="#fff" />)}
        <Toon id="l1d" x={540} y={1960 - s.hop * 40} s={1.6} pose={{ lean: -2, head: -4, aF: [120 * s.fist + 20 * (1 - s.fist), 150 * s.fist + 10 * (1 - s.fist)], aB: [-40, 30], lB: [-12, -6], lF: [12, 6] }} fistF
          expr={talk ? "talk" : "determined"} look={{ mouth: talk }} blush />
      </Cam>
    );
  }
  return <g>{shot}<Flash k={s.flash} /></g>;
};

/* ---------- 2. Plan: read a book · Reality: page one, fifteen photos, asleep ---------- */
export const Toon2: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const tear = sc.tear ?? T(0) - 0.8, cF = 1.9, cH = T(1) - 0.2, cH2 = 8.0, cI = T(2) - 0.15, cI2 = 11.4;
  const s = useTimeline({ stampP: 0, label: 0, pan: 0, turn: 0, sip: 0, tear: 0, stampR: 0, zG: 1.55, yawn: 0, flashN: 0, grid: 0, zI: 1.25, breathe: 0 }, (tl, v) => {
    tl.to(v, { stampP: 1, duration: 0.3, ease: "back.out(3)" }, 0.15).to(v, { label: 1, duration: 0.3 }, 0.4).to(v, { pan: 1, duration: cF, ease: "none" }, 0)
      .to(v, { turn: 1, duration: 0.6, ease: "power1.inOut" }, 0.9)
      .to(v, { sip: 1, duration: 0.45, ease: "power2.out" }, cF + 0.3)
      .to(v, { tear: 1, duration: 0.75, ease: "power1.in" }, tear).to(v, { stampR: 1, duration: 0.3, ease: "back.out(3)" }, tear + 0.45)
      .to(v, { zG: 1.75, duration: cH - tear, ease: "none" }, tear).to(v, { yawn: 1, duration: 0.35, yoyo: true, repeat: 1 }, T(0) + 0.5)
      .to(v, { flashN: 15, duration: 1.5, ease: "none" }, cH + 0.1)
      .to(v, { grid: 15, duration: 0.9, ease: "power1.in" }, cH2 + 0.05)
      .to(v, { zI: 1.02, duration: cI2 - cI, ease: "power1.out" }, cI);
  });
  const { f } = s, t = f / 30;
  const plan = t < tear + 0.8;
  let world: React.ReactNode = null, top: React.ReactNode = null;
  const sitPose = (o: Partial<ToonPose>): ToonPose => ({ ...SIT, aB: [60, 130], aF: [70, 140], ...o });
  // PLAN: E wide pan, F close-up sip — torn away at `tear`
  const planShot = t < cF ? (() => {
    const pose = sitPose({});
    const j = toonJoints(250, 1360, 0.98, pose);
    return (
      <Cam x={360 + 180 * s.pan} y={1200} z={1.3}>
        <RainyRoom f={f}>
          <rect x={540} y={1380} width={150} height={20} rx={8} fill="#7a5038" stroke={INK} strokeWidth={6} /><line x1={560} y1={1400} x2={560} y2={1500} stroke={INK} strokeWidth={10} /><line x1={670} y1={1400} x2={670} y2={1500} stroke={INK} strokeWidth={10} />
          <g transform="translate(615 1380)"><Mug s={1.1} f={f} /></g>
          <Toon id="l2e" x={250} y={1360} s={0.98} pose={pose} expr="happy" blush look={{ look: 0.4 }} />
          <g transform={`translate(${(j.handB[0] + j.handF[0]) / 2 + 20} ${(j.handB[1] + j.handF[1]) / 2 + 10}) rotate(-6)`}><Book s={0.8} turn={s.turn} /></g>
          {[[120, 900], [450, 820], [700, 1100]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={0.6 + 0.3 * Math.sin(f / 5 + i)} c="#fde68a" />)}
        </RainyRoom>
        <rect x={0} y={0} width={W} height={H} fill="#ffd27f" opacity={0.12} />
      </Cam>
    );
  })() : (() => {
    const pose = sitPose({ aF: [60 + 70 * s.sip, 150 + 40 * s.sip], head: -6 * s.sip });
    return (
      <Cam x={300} y={1080} z={2.3}>
        <RainyRoom f={f} fg={false}>
          <Toon id="l2f" x={250} y={1360} s={0.98} pose={pose} expr="happy" blush holdF={<g transform="translate(16 -4)"><Mug s={0.9} f={f} /></g>} holdB={<g transform="translate(40 10) rotate(-10)"><Book s={0.55} /></g>} />
          {[0, 1, 2].map((i) => { const k = ((t * 0.7 + i * 0.33) % 1); return <text key={i} x={340 + i * 30} y={980 - k * 160} fontFamily="ToonSans" fontWeight={800} fontSize={54} fill="#f472b6" stroke={INK} strokeWidth={5} paintOrder="stroke fill" opacity={s.sip * (1 - k)}>♥</text>; })}
        </RainyRoom>
        <rect x={0} y={0} width={W} height={H} fill="#ffd27f" opacity={0.14} />
      </Cam>
    );
  })();
  // REALITY shots
  if (t >= tear - 0.01 && t < cH) {
    const pose = sitPose({ aB: [50, 120], aF: [60, 130], head: 10 * s.yawn, lean: 6 });
    const j = toonJoints(250, 1360, 0.98, pose);
    world = (
      <Cam x={300} y={1150} z={s.zG}>
        <Grade k={1} id="g2"><RainyRoom f={f} lamp={0.3} fg={false} /></Grade>
        <g opacity={0.92}>
          <Toon id="l2g" x={250} y={1360} s={0.98} pose={pose} expr={s.yawn > 0.3 ? "shock" : "sleepy"} look={{ look: 0.3 }} />
          <g transform={`translate(${(j.handB[0] + j.handF[0]) / 2 + 20} ${(j.handB[1] + j.handF[1]) / 2 + 10}) rotate(-6)`}><Book s={0.8} page="1" /></g>
        </g>
      </Cam>
    );
  } else if (t >= cH && t < cH2) {
    const n = Math.floor(s.flashN), fl = s.flashN > 0 && s.flashN < 15 && s.flashN % 1 < 0.4;
    const alt = n % 2 === 0;
    const pose = sitPose({ aF: [118, alt ? 150 : 160], aB: [alt ? -150 : -135, alt ? -170 : -160], head: alt ? -10 : 8, lean: alt ? -4 : 4 });
    world = (
      <g>
        <Cam x={330} y={1060} z={1.85} shake={fl ? 4 : 0} f={f}>
          <Grade k={1} id="g3"><RainyRoom f={f} lamp={0.3} fg={false} /></Grade>
          <Toon id="l2h" x={250} y={1360} s={0.98} pose={pose} expr={alt ? "smug" : "happy"} blush look={{ look: 0.4 }}
            holdF={<g transform="translate(14 -50) rotate(-12)"><Phone s={1.25} screen={fl ? "#fff" : "#93c5fd"} /></g>} holdB={<path d="M -6 -12 l -10 -44 M 8 -12 l 16 -42" stroke={INK} strokeWidth={10} strokeLinecap="round" />} />
        </Cam>
        {s.flashN > 0.3 && <g transform="translate(830 560)"><rect x={-130} y={-70} width={260} height={140} rx={30} fill="#fff" stroke={INK} strokeWidth={8} /><rect x={-104} y={-34} width={70} height={56} rx={10} fill={INK} /><circle cx={-69} cy={-6} r={16} fill="#fff" /><text x={50} y={26} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={78} fill="#db2777">{Math.max(1, Math.min(15, n + 1))}</text></g>}
        <Flash k={fl ? 0.7 : 0} />
      </g>
    );
  } else if (t >= cH2 && t < cI) {
    // phone screen: the gallery fills up, posted with a hashtag
    const shown = Math.floor(s.grid);
    world = (
      <g>
        <Grade k={1} id="g4"><Cam x={300} y={1100} z={1.6}><RainyRoom f={f} lamp={0.3} fg={false} /></Cam></Grade>
        <rect width={W} height={H} fill="#0f172a" opacity={0.45} />
        <g transform={`translate(540 980) rotate(${-3 + Math.sin(f / 8)})`}>
          <rect x={-330} y={-640} width={660} height={1280} rx={70} fill="#111827" stroke={INK} strokeWidth={12} />
          <rect x={-300} y={-600} width={600} height={1200} rx={44} fill="#f8fafc" />
          <text x={0} y={-520} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill={INK}>#rainyday #chill ☕</text>
          {Array.from({ length: 15 }).map((_, k) => k >= shown ? null : (
            <g key={k} transform={`translate(${-190 + (k % 3) * 190} ${-380 + Math.floor(k / 3) * 190})`}>
              <rect x={-86} y={-86} width={172} height={172} rx={14} fill={["#fbcfe8", "#bfdbfe", "#fde68a", "#c4b5fd", "#bbf7d0"][k % 5]} />
              <circle cx={-10} cy={-6} r={38} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M -50 -12 Q -48 -52 -10 -50 Q 30 -52 30 -12 Q 10 -34 -10 -30 Q -30 -34 -50 -12 Z" fill="#2b1d1a" />
              <circle cx={-22} cy={-4} r={4} fill={INK} /><circle cx={2} cy={-4} r={4} fill={INK} /><path d="M -22 12 Q -10 20 2 12" stroke={INK} strokeWidth={4} fill="none" />
              <g transform="translate(46 50) scale(0.5)"><Mug steam={false} /></g>
            </g>
          ))}
          {shown >= 15 && <text x={0} y={560} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={52} fill="#ef4444">♥ 1.2K</text>}
        </g>
      </g>
    );
  } else if (t >= cI && t < cI2) {
    // high angle, looking down on the sofa: asleep under the blanket, book tented on her face, arm dangling with the phone
    const br = Math.sin(f / 14);
    world = (
      <Cam x={540} y={980} z={s.zI} r={-10}>
        <Grade k={1} id="g5">
          <rect width={W} height={H} fill="#4a3426" />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={H} stroke="#3a281d" strokeWidth={6} />)}
          <ellipse cx={540} cy={1180} rx={600} ry={460} fill="#8b5cf6" opacity={0.85} stroke={INK} strokeWidth={8} />
          <g transform="translate(540 960)">
            <rect x={-480} y={-300} width={960} height={560} rx={100} fill="#1d5150" stroke={INK} strokeWidth={10} />
            <rect x={-430} y={-200} width={860} height={420} rx={70} fill="#2f7a78" stroke={INK} strokeWidth={8} />
          </g>
        </Grade>
        {/* pillow, head, book, blanket body, slippers, dangling arm */}
        <rect x={140} y={790} width={260} height={210} rx={70} fill="#f1f5f9" stroke={INK} strokeWidth={8} transform="rotate(-6 270 895)" />
        <g transform="translate(270 900) rotate(-90)"><circle r={112} fill="#fff" stroke={INK} strokeWidth={10} /><path d="M -114 -10 Q -120 -124 0 -122 Q 120 -124 114 -10 Q 60 -70 0 -60 Q -60 -76 -114 -10 Z" fill="#2b1d1a" /><ellipse cx={0} cy={50} rx={22} ry={18 + 8 * br} fill={INK} /></g>
        <g transform={`translate(${300} ${900}) rotate(-96) scale(${1 + 0.04 * br})`}><path d="M -120 -70 L 120 -70 L 120 70 L -120 70 Z" fill="#f59e0b" stroke={INK} strokeWidth={9} /><line x1={0} y1={-70} x2={0} y2={70} stroke={INK} strokeWidth={9} /><text x={-60} y={10} textAnchor="middle" fontFamily="KidsHand" fontSize={34} fill={INK} transform="rotate(90 -60 0)">BOOK</text></g>
        <path d={`M 380 ${820 - br * 6} Q 640 ${770 - br * 10} 900 820 Q 960 940 900 1080 Q 640 ${1140 + br * 6} 380 ${1080 + br * 6} Q 340 950 380 ${820 - br * 6} Z`} fill="#a78bfa" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${460 + i * 140} 830 q 30 120 0 240`} stroke="#c4b5fd" strokeWidth={8} fill="none" />)}
        {[[930, 880], [945, 1010]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={46} ry={34} fill="#fbcfe8" stroke={INK} strokeWidth={8} />)}
        <path d="M 520 1090 Q 540 1220 580 1300" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
        <circle cx={582} cy={1306} r={22} fill="#fff" stroke={INK} strokeWidth={8} />
        <g transform="translate(640 1380) rotate(24)"><Phone s={1.3} screen="#1f2937" /></g>
        <Zs x={160} y={720} f={f} s={1.2} />
      </Cam>
    );
  } else if (t >= cI2) {
    // close-up: the book rises and falls with every snore, a bubble grows at her nose
    const br = Math.sin(f / 14);
    world = (
      <g>
        <Grade k={1} id="g6"><rect width={W} height={H} fill="#2f7a78" /><rect y={1180} width={W} height={740} fill="#1d5150" /></Grade>
        <rect x={60} y={420} width={960} height={760} rx={200} fill="#e2e8f0" stroke={INK} strokeWidth={14} />
        <g transform="translate(540 820) rotate(-14)">
          <path d="M -330 -60 Q -350 -420 0 -400 Q 350 -420 330 -60 Z" fill="#2b1d1a" />
          <circle r={330} fill="#fff" stroke={INK} strokeWidth={26} />
          <path d="M -330 -60 Q -320 -370 0 -360 Q 320 -370 330 -60 Q 160 -230 0 -210 Q -170 -250 -330 -60 Z" fill="#2b1d1a" />
          <ellipse cx={0} cy={170} rx={60} ry={40 + 22 * (0.5 + 0.5 * br)} fill={INK} />
          <g transform={`translate(0 ${-30 - br * 16}) rotate(${br * 2})`}><path d="M -400 100 L 0 -170 L 400 100 L 360 150 L 0 -110 L -360 150 Z" fill="#f59e0b" stroke={INK} strokeWidth={18} strokeLinejoin="round" /><path d="M -340 110 L 0 -130 L 340 110" fill="none" stroke="#fff" strokeWidth={12} /></g>
          <circle cx={120} cy={80} r={34 + 30 * (0.5 + 0.5 * br)} fill="#bfdbfe" stroke={INK} strokeWidth={7} opacity={0.85} />
        </g>
        <Zs x={760} y={420} f={f} s={1.8} />
      </g>
    );
  }
  if (plan) top = <Tear p={s.tear}>{planShot}<Stamp kind="PLAN" k={s.stampP} /><Label en="Plan: read a book" vi="Kế hoạch: đọc sách" k={s.label} /></Tear>;
  return <g>{world}<Stamp kind="REALITY" k={t < cH ? s.stampR : 0} />{top}</g>;
};


// PLAN (bright, stamped, labelled) torn away at sc.tear to reveal REALITY underneath
export const PlanReality: React.FC<{ sc: SceneData; plan: React.ReactNode; reality: React.ReactNode; en: string; vi: string }> = ({ sc, plan, reality, en, vi }) => {
  const tear = sc.tear ?? 0;
  const s = useTimeline({ stampP: 0, label: 0, tear: 0, stampR: 0 }, (tl, v) => {
    tl.to(v, { stampP: 1, duration: 0.3, ease: "back.out(3)" }, 0.15).to(v, { label: 1, duration: 0.3 }, 0.4)
      .to(v, { tear: 1, duration: 0.75, ease: "power1.in" }, tear).to(v, { stampR: 1, duration: 0.3, ease: "back.out(3)" }, tear + 0.45).to(v, { stampR: 0, duration: 0.25 }, tear + 3.2);
  });
  const t = s.f / 30;
  return <g>{t >= tear - 0.02 && reality}<Stamp kind="REALITY" k={s.stampR} />{t < tear + 0.8 && <Tear p={s.tear}>{plan}<Stamp kind="PLAN" k={s.stampP} /><Label en={en} vi={vi} k={s.label} /></Tear>}</g>;
};
