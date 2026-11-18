// Scenes 3–4 of the rainy-day toon: workout → "the relaxing position"; cleaning → the photo album and Mom.
import React from "react";
import { useTimeline } from "../Sleep/timeline";
import { INK, Toon, toonJoints, type ToonPose } from "./Lily";
import { Album, Blanket, Clock, Dumbbell, Glove, Mat, MOM, MomHair } from "./cast";
import { Cam, Grade, Rays, Spark, Zs } from "./props";
import { lines, PlanReality, talking, type SP } from "./scenes";
import { Bedroom } from "./sets2";
import { H, RainyRoom, W } from "./sets";

const Headband = ({ r = 112 }: { r?: number }) => <path d={`M ${-r * 0.98} ${-r * 0.32} Q 0 ${-r * 0.62} ${r * 0.98} ${-r * 0.32}`} stroke="#ef4444" strokeWidth={r * 0.2} fill="none" strokeLinecap="round" />;
const Thumb = () => <g><circle r={30} fill="#fff" stroke={INK} strokeWidth={8} /><path d="M -6 -24 L -6 -66 Q 6 -78 14 -62 L 14 -24" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></g>;
// lying on the floor on her back (head to the left): a standing figure turned −90° about its feet
const Lying: React.FC<{ x: number; y: number; s?: number; children: React.ReactNode }> = ({ x, y, children }) => <g transform={`rotate(-90 ${x} ${y})`}>{children}</g>;
const Big: React.FC<{ text: string; x?: number; y?: number; k: number; c?: string; size?: number; r?: number }> = ({ text, x = 540, y = 400, k, c = "#fde047", size = 110, r = -6 }) => k <= 0.01 ? null : (
  <text transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={size} fill={c} stroke={INK} strokeWidth={16} paintOrder="stroke fill">{text}</text>
);
export const MomToon: React.FC<{ x: number; y: number; s?: number; pose?: ToonPose; expr?: React.ComponentProps<typeof Toon>["expr"]; mouth?: number; flip?: boolean; id: string; faceExtra?: React.ReactNode }> = ({ x, y, s = 1, pose, expr = "stern", mouth = 0, flip = true, id, faceExtra }) => (
  <Toon id={id} faceExtra={faceExtra} x={x} y={y} s={s} flip={flip} outfit={MOM} hair={(r) => <MomHair r={r} />} hairBack={() => null} pose={pose} expr={mouth > 0 ? "talk" : expr} look={{ mouth, look: 0.2 }} />
);

/* ---------- 3. Plan: home workout · Reality: the relaxing position ---------- */
export const Toon3: React.FC<SP> = ({ sc }) => {
  const { T, E } = lines(sc);
  const s = useTimeline({ kick: 0, roll: 0, jack: 0, curl: 0, flex: 0, zD: 1.0, crawl: 0, cx: 1150, leap: 0, cover: 0, turns: 0, plus: 0, zI: 1.3 }, (tl, v) => {
    tl.to(v, { kick: 1, duration: 0.2, yoyo: true, repeat: 1 }, 0.3).to(v, { roll: 1, duration: 1.2, ease: "power2.out" }, 0.45)
      .to(v, { jack: 1, duration: 0.27, yoyo: true, repeat: 7, ease: "sine.inOut" }, 2.45)
      .to(v, { curl: 1, duration: 0.4, yoyo: true, repeat: 4, ease: "sine.inOut" }, 4.9)
      .to(v, { flex: 1, duration: 0.3, ease: "back.out(2.5)" }, 7.05).to(v, { zD: 1.25, duration: 0.18, ease: "power4.out" }, 7.6)
      .to(v, { crawl: 4, cx: 780, duration: 2.0, ease: "none" }, 12.8)
      .to(v, { leap: 1, duration: 0.6, ease: "power1.inOut" }, 14.9).to(v, { cover: 1, duration: 0.25, ease: "back.out(2)" }, 15.45)
      .to(v, { turns: 2, duration: 2.4, ease: "power2.in" }, 17.0).to(v, { plus: 1, duration: 0.3, ease: "back.out(3)" }, 18.3)
      .to(v, { zI: 1.05, duration: 3.6, ease: "power1.out" }, 19.8);
  });
  const { f } = s, t = f / 30;
  // PLAN shots
  let plan: React.ReactNode = null;
  if (t < 2.4) {
    plan = (
      <Cam x={450} y={1250} z={1.25}><RainyRoom f={f}>
        <g transform="translate(610 1580)"><Mat w={560} roll={s.roll} /></g>
        <Toon id="l3a" x={250} y={1580} s={0.95} pose={{ lF: [10 + 50 * s.kick, 30 * s.kick], aB: [-30, -10], aF: [30, 10], lean: -4 * s.kick }} expr="determined" faceExtra={<Headband />} />
      </RainyRoom></Cam>
    );
  } else if (t < 4.8) {
    const j = s.jack;
    plan = (
      <Cam x={540} y={1200 - j * 20} z={1.4}><RainyRoom f={f}>
        <g transform="translate(540 1580)"><Mat w={560} /></g>
        <Toon id="l3b" x={540} y={1580} s={0.95} pose={{ aB: [-20 - 130 * j, -10 - 150 * j], aF: [20 + 130 * j, 10 + 150 * j], lB: [-6 - 20 * j, -2 - 18 * j], lF: [6 + 20 * j, 2 + 18 * j], dy: -40 * j }} expr={j > 0.5 ? "talk" : "determined"} look={{ mouth: 0.6 }} faceExtra={<Headband />} />
      </RainyRoom>
      <text x={860} y={1000} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={90} fill="#fff" stroke={INK} strokeWidth={14} paintOrder="stroke fill">×{Math.min(10, Math.floor((t - 2.45) / 0.27) + 1)}</text></Cam>
    );
  } else if (t < 7.0) {
    const c = s.curl;
    plan = (
      <Cam x={540} y={1120} z={2.0}><RainyRoom f={f} fg={false}>
        <Toon id="l3c" x={540} y={1580} s={0.95} pose={{ aB: [-16, -16 - 150 * c], aF: [16, 16 + 150 * c], lean: 0 }} expr="determined" blush faceExtra={<Headband />} holdF={<Dumbbell r={90} />} holdB={<Dumbbell r={90} />} />
        {[0, 1].map((i) => { const k = ((t * 1.3 + i * 0.5) % 1); return <path key={i} d="M 0 -14 Q 10 0 0 10 Q -10 0 0 -14 Z" transform={`translate(${470 + i * 150} ${880 + k * 80})`} fill="#7dd3fc" stroke={INK} strokeWidth={3} opacity={1 - k} />; })}
      </RainyRoom></Cam>
    );
  } else {
    plan = (
      <Cam x={540} y={1000 - (s.zD - 1) * 260} z={s.zD}>
        <Rays x={540} y={800} f={f} a="#bbf7d0" b="#86efac" />
        {[[160, 600], [920, 700], [200, 1200], [900, 1150]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={0.9 + 0.3 * Math.sin(f / 4 + i)} c="#fff" />)}
        <Toon id="l3d" x={540} y={1960} s={1.55} pose={{ aB: [-20 - 90 * s.flex, -10 - 160 * s.flex], aF: [20 + 90 * s.flex, 10 + 160 * s.flex] }} expr="determined" blush faceExtra={<Headband />} fistF />
      </Cam>
    );
  }
  // REALITY shots
  let real: React.ReactNode = null;
  const lyingPose: ToonPose = { aB: [-60, -30], aF: [60, 30], lB: [-14, -8], lF: [14, 8] };
  const room = (z: number, x: number, y: number, kids: React.ReactNode, r = 0) => (
    <Cam x={x} y={y} z={z} r={r}><Grade k={1} id={`g3${Math.round(z * 10)}`}><RainyRoom f={f} lamp={0.3} fg={false} /></Grade><g transform="translate(560 1580)"><Mat w={620} /></g>{kids}</Cam>
  );
  if (t < 12.8) {
    real = room(1.5, 520, 1430, <Lying x={780} y={1500}><Toon id="l3e" x={780} y={1500} s={0.9} pose={lyingPose} expr={talking(sc, "Lily", t) ? "talk" : "sleepy"} look={{ mouth: talking(sc, "Lily", t) }} /></Lying>);
  } else if (t < 14.8) {
    real = room(2.3, 720, 1450, <g>
      <Lying x={780} y={1500}><Toon id="l3f" x={780} y={1500} s={0.9} pose={lyingPose} expr="sleepy" /></Lying>
      <g transform={`translate(${s.cx} 1600)`}><Blanket w={300} h={130} f={f} mood="sly" crawl={s.crawl} /></g>
    </g>);
  } else if (t < 16.9) {
    const lx = 780 + (430 - 780) * s.leap, ly = 1600 - Math.sin(s.leap * Math.PI) * 360;
    real = room(1.5, 520, 1430, <g>
      <Lying x={780} y={1500}><Toon id="l3g" x={780} y={1500} s={0.9} pose={lyingPose} expr={s.cover > 0.5 ? "happy" : "shock"} blush={s.cover > 0.5} /></Lying>
      {s.cover < 0.5 ? <g transform={`translate(${lx} ${ly}) rotate(${-20 + 40 * s.leap})`}><Blanket w={300} h={130} f={f} mood="happy" /></g>
        : <g transform={`translate(470 1610) scale(${0.9 + 0.1 * s.cover})`}><Blanket w={640} h={150} f={f} mood="happy" /></g>}
    </g>);
  } else if (t < 19.8) {
    real = (
      <g>
        <Grade k={1} id="g3c"><rect width={W} height={H} fill="#48546e" />{Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 80 + 30} y={0} width={14} height={H} fill="#fff" opacity={0.03} />)}</Grade>
        <g transform={`translate(540 860) scale(${1 + 0.04 * Math.sin(s.turns * 20)})`}><Clock turns={s.turns} r={330} /></g>
        <Big text="+2 HOURS" y={1260} k={s.plus} c="#fde68a" size={120} />
      </g>
    );
  } else {
    real = room(s.zI, 560, 1460, <g>
      <Lying x={780} y={1500}><Toon id="l3i" x={780} y={1500} s={0.9} pose={lyingPose} expr="sleepy" /></Lying>
      <g transform="translate(470 1610)"><Blanket w={640} h={150} f={f} mood="sleepy" /></g>
      <Zs x={300} y={1250} f={f} s={1.1} />
    </g>, -7);
  }
  void T; void E;
  return <PlanReality sc={sc} plan={plan} reality={real} en="Plan: home workout" vi="Kế hoạch: tập thể dục tại nhà" />;
};

/* ---------- 4. Plan: clean my room · Reality: the photo album, and Mom ---------- */
export const Toon4: React.FC<SP> = ({ sc }) => {
  const { T } = lines(sc);
  const s = useTimeline({ glove: 0, snp: 0, sweep: -1, pan: 0, items: 0, thumb: 0, zD: 1.2, turn: 0, turn2: 0, clock: 0, later: 0, grow: 0.6, door: 0, palm: 0, leave: 0, sock: 0 }, (tl, v) => {
    tl.to(v, { glove: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.2).to(v, { snp: 1, duration: 0.15, yoyo: true, repeat: 1 }, 1.0)
      .to(v, { sweep: 1, duration: 0.4, yoyo: true, repeat: 5, ease: "sine.inOut" }, 2.45).to(v, { pan: 1, duration: 2.6, ease: "none" }, 2.4)
      .to(v, { items: 8, duration: 1.9, ease: "none" }, 5.1)
      .to(v, { thumb: 1, duration: 0.3, ease: "back.out(3)" }, 7.25).to(v, { zD: 1.45, duration: 0.18, ease: "power4.out" }, 7.7)
      .to(v, { turn: 1, duration: 0.5, ease: "power1.inOut" }, 12.2).to(v, { turn2: 1, duration: 0.5, ease: "power1.inOut" }, 13.0)
      .to(v, { clock: 3, duration: 2.4, ease: "none" }, 13.7).to(v, { later: 1, duration: 0.3, ease: "back.out(3)" }, 13.8).to(v, { grow: 1, duration: 2.0, ease: "none" }, 13.8)
      .to(v, { door: 1, duration: 0.35, ease: "power2.out" }, 16.25)
      .to(v, { palm: 1, duration: 0.3, ease: "power2.out" }, 23.2)
      .to(v, { leave: 1, duration: 0.5, ease: "power1.in" }, 25.0).to(v, { sock: 1, duration: 0.6, ease: "power1.in" }, 25.7);
  });
  const { f } = s, t = f / 30;
  let plan: React.ReactNode = null;
  if (t < 2.4) {
    plan = (
      <g>
        <Bedroom f={f} />
        <rect width={W} height={H} fill="#1e1b4b" opacity={0.35} />
        <g transform={`translate(300 ${2500 - 1400 * s.glove}) rotate(-12) scale(1.6)`}><Glove /></g>
        <g transform={`translate(780 ${2500 - 1400 * s.glove}) rotate(12) scale(1.6)`}><Glove flip /></g>
        <Big text="SNAP!" y={1520} k={s.snp} c="#fde047" size={130} />
      </g>
    );
  } else if (t < 5.0) {
    const pose: ToonPose = { lean: -10, aB: [70, 60], aF: [60, 40], lB: [-12, -4], lF: [12, 4] };
    const j = toonJoints(420, 1580, 0.95, pose);
    const brush: [number, number] = [700 + 90 * s.sweep, 1580];
    const top: [number, number] = [j.handB[0] - (brush[0] - j.handB[0]) * 0.25, j.handB[1] - (brush[1] - j.handB[1]) * 0.25];
    plan = (
      <Cam x={500 + 120 * s.pan} y={1260} z={1.3}><Bedroom f={f}>
        <line x1={top[0]} y1={top[1]} x2={brush[0]} y2={brush[1] - 50} stroke={INK} strokeWidth={18} strokeLinecap="round" /><line x1={top[0]} y1={top[1]} x2={brush[0]} y2={brush[1] - 50} stroke="#b45309" strokeWidth={10} strokeLinecap="round" />
        <path d={`M ${brush[0] - 70} ${brush[1] - 54} L ${brush[0] + 70} ${brush[1] - 54} L ${brush[0] + 84} ${brush[1]} L ${brush[0] - 84} ${brush[1]} Z`} fill="#fde047" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => <circle key={i} cx={brush[0] - Math.sign(Math.cos(t * 7.8)) * (100 + i * 40)} cy={brush[1] - 20 - i * 18} r={20 + i * 8} fill="#e5e7eb" opacity={0.6 * Math.abs(Math.cos(t * 7.8)) * (1 - i * 0.25)} />)}
        <Toon id="l4b" x={420} y={1580} s={0.95} pose={pose} expr="determined" holdF={<circle r={22} fill="#facc15" stroke={INK} strokeWidth={6} />} holdB={<circle r={22} fill="#facc15" stroke={INK} strokeWidth={6} />} />
      </Bedroom></Cam>
    );
  } else if (t < 7.2) {
    const things: [number, number, string][] = [[100, 300, "#60a5fa"], [980, 400, "#f472b6"], [80, 1500, "#34d399"], [1000, 1600, "#facc15"], [200, 1800, "#a78bfa"], [900, 200, "#fb923c"], [60, 900, "#ef4444"], [1020, 1000, "#22d3ee"]];
    plan = (
      <Cam x={540} y={960} z={1.05 + 0.05 * Math.sin(t)} r={-4}>
        <rect width={W} height={H} fill="#a1785a" />{Array.from({ length: 9 }).map((_, i) => <line key={i} x1={i * 130} y1={0} x2={i * 130} y2={H} stroke="#7e5a41" strokeWidth={6} />)}
        <g transform="translate(540 1000)"><rect x={-230} y={-200} width={460} height={400} fill="#c08a5a" stroke={INK} strokeWidth={10} /><rect x={-190} y={-160} width={380} height={320} fill="#7c5634" /><path d="M -230 -200 L -300 -320 L 160 -320 L 230 -200 Z" fill="#d6a273" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><text y={150} textAnchor="middle" fontFamily="KidsHand" fontSize={56} fill="#fde68a">STUFF</text></g>
        {things.map(([x, y, c], i) => { const k = Math.max(0, Math.min(1, s.items - i)); if (k >= 1) return null; const px = x + (540 - x) * k, py = y + (1000 - y) * k - Math.sin(k * Math.PI) * 220; return <g key={i} transform={`translate(${px} ${py}) rotate(${k * 360 + i * 30}) scale(${1 - 0.4 * k})`}>{i % 2 ? <rect x={-60} y={-40} width={120} height={80} rx={10} fill={c} stroke={INK} strokeWidth={7} /> : <path d="M -70 30 L -50 -40 L 0 -24 L 50 -44 L 70 30 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" />}</g>; })}
        {s.items > 7.9 && <Spark x={760} y={760} s={1.6} />}
      </Cam>
    );
  } else {
    plan = (
      <Cam x={520} y={1180 - (s.zD - 1.2) * 200} z={s.zD}><Bedroom f={f}>
        <Toon id="l4d" x={520} y={1580} s={0.95} pose={{ aF: [40 + 80 * s.thumb, 120 + 50 * s.thumb], aB: [-40, 30] }} expr="happy" blush holdF={s.thumb > 0.5 ? <Thumb /> : undefined} />
        {[[260, 900], [820, 980], [300, 1350], [860, 1400]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={0.8 + 0.4 * Math.sin(f / 4 + i)} c="#fff" />)}
      </Bedroom></Cam>
    );
  }
  // REALITY
  let real: React.ReactNode = null;
  const sitFloor = (o: Partial<ToonPose>): ToonPose => ({ sit: 1.235, lB: [72, -30], lF: [84, -40], aB: [60, 110], aF: [70, 120], ...o });
  const lily = (id: string, pose: ToonPose, expr: React.ComponentProps<typeof Toon>["expr"], mouth = 0) => {
    const j = toonJoints(360, 1600, 0.95, pose);
    return <g><Toon id={id} x={360} y={1600} s={0.95} pose={pose} expr={expr} blush look={{ mouth, look: 0.4 }} /><g transform={`translate(${(j.handB[0] + j.handF[0]) / 2 + 40} ${(j.handB[1] + j.handF[1]) / 2 - 20}) rotate(-8)`}><Album s={0.42} turn={s.turn} /></g></g>;
  };
  const room = (kids: React.ReactNode, z: number, x: number, y: number, mess = 1) => <Cam x={x} y={y} z={z}><Grade k={1} id={`g4${Math.round(z * 10)}${x}`}><Bedroom f={f} mess={mess} lamp={0.4} door={s.door * (1 - s.leave)} /></Grade>{kids}</Cam>;
  const giggle = <g>{[0, 1].map((i) => { const k = ((t * 0.8 + i * 0.5) % 1); return <text key={i} x={500 + i * 60} y={1000 - k * 140} fontFamily="ToonSans" fontWeight={800} fontSize={50} fill="#f472b6" stroke={INK} strokeWidth={5} paintOrder="stroke fill" opacity={1 - k}>♥</text>; })}</g>;
  if (t < 11.4) {
    real = room(<g>{lily("l4e", sitFloor({}), "happy")}{giggle}<text x={600} y={880} fontFamily="KidsHand" fontSize={64} fill="#fde68a" stroke={INK} strokeWidth={6} paintOrder="stroke fill">hehe</text></g>, 1.35, 520, 1250);
  } else if (t < 13.6) {
    real = (
      <g>
        <Grade k={1} id="g4f"><rect width={W} height={H} fill="#5b4636" /></Grade>
        <g transform="translate(540 960) rotate(-4)"><Album s={1.9} turn={s.turn2 > 0 ? s.turn2 : s.turn} /></g>
        <circle cx={70} cy={1060} r={40} fill="#fff" stroke={INK} strokeWidth={9} /><circle cx={1010} cy={900} r={40} fill="#fff" stroke={INK} strokeWidth={9} />
        <text x={540} y={500} textAnchor="middle" fontFamily="KidsHand" fontSize={90} fill="#fbcfe8" stroke={INK} strokeWidth={8} paintOrder="stroke fill">aww~</text>
      </g>
    );
  } else if (t < 16.2) {
    real = (
      <g>
        {room(<g>{lily("l4g", sitFloor({}), "happy")}{giggle}</g>, 1.2, 540, 1200, s.grow)}
        <g transform="translate(860 330)"><Clock turns={s.clock} r={110} /></g>
        <rect width={W} height={H} fill="#f97316" opacity={0.12 * (s.clock / 3)} />
        {s.later > 0.01 && <g transform={`translate(540 560) scale(${s.later})`}><rect x={-380} y={-70} width={760} height={130} rx={24} fill="#fde047" stroke={INK} strokeWidth={10} /><text y={30} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={72} fill={INK}>3 HOURS LATER…</text></g>}
      </g>
    );
  } else if (t < 19.7) {
    const mo = talking(sc, "Mom", t);
    real = room(<MomToon id="m4h" x={1040} y={1290} s={1.0} pose={{ aB: [-40, 40], aF: [40, -40] }} expr="stern" mouth={mo} />, 1.55 + (t - 16.2) * 0.04, 900, 960);
  } else if (t < 22.6) {
    const mo = talking(sc, "Lily", t);
    real = room(<g>{lily("l4i", sitFloor({}), mo ? "talk" : "worried", mo)}<path d="M 0 -18 Q 12 0 0 12 Q -12 0 0 -18 Z" transform="translate(470 870) scale(1.6)" fill="#7dd3fc" stroke={INK} strokeWidth={4} /></g>, 2.1, 400, 1330);
  } else if (t < 24.8) {
    real = room(<MomToon id="m4j" x={1040} y={1290} s={1.0} pose={{ aB: [-40, 40], aF: s.palm > 0.5 ? [178, 178] : [40, -40], head: s.palm * 10 }} expr={s.palm > 0.5 ? "deadpan" : "stern"} faceExtra={s.palm > 0.5 ? <g><polyline points="10,0 130,120 60,175" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /><ellipse cx={-6} cy={-18} rx={72} ry={44} transform="rotate(-18 -6 -18)" fill="#fff" stroke={INK} strokeWidth={8} /></g> : undefined} />, 2.2, 1000, 900);
  } else {
    const sx = 760 + (420 - 760) * s.sock, sy = 1000 - Math.sin(s.sock * Math.PI) * 300 + s.sock * 60;
    const j = toonJoints(360, 1600, 0.95, sitFloor({}));
    real = room(<g>
      {s.leave < 0.99 && <MomToon id="m4k" x={1040 + 200 * s.leave} y={1290} s={1.0} pose={{ aB: [-20, -10], aF: [20, 10] }} expr="deadpan" />}
      {lily("l4k", sitFloor({}), "happy")}{giggle}
      {s.sock > 0 && <g transform={`translate(${s.sock >= 1 ? j.head[0] : sx} ${s.sock >= 1 ? j.head[1] - 100 : sy}) rotate(${s.sock * 400})`}><path d="M -20 -50 L 20 -50 L 20 20 Q 20 40 50 40 L 50 60 L -10 60 Q -20 60 -20 40 Z" fill="#60a5fa" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></g>}
    </g>, 1.25, 600, 1200);
  }
  void T;
  return <PlanReality sc={sc} plan={plan} reality={real} en="Plan: clean my room" vi="Kế hoạch: dọn phòng" />;
};
