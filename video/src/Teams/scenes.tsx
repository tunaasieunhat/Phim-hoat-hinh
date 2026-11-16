// The seven scenes of "5 Types of Teams" — native 9:16 (1080x1920), action between y 120 and 1300.
import React from "react";
import { alive, mix, P, pop, tw } from "../Kids/rig";
import { Star } from "../Kids/stage";
import { Txt } from "../Med/scenes";
import { INK, Person, RED, TEAMS } from "./people";
import { GY, HAND, Icon, ResultBar, SEATS, SIT, Speech, Table, TeamSign, useTalk, VH, VW, type SP } from "./stage";

const Floor: React.FC<{ wall: string; floor: string }> = ({ wall, floor }) => (
  <g><rect width={VW} height={VH} fill={wall} /><rect x={0} y={GY} width={VW} height={VH - GY} fill={floor} /></g>
);
// where a speaker's bubble goes: above their head
const BUB: Record<number, [number, number, "left" | "right" | "none"]> = { 0: [300, 720, "left"], 1: [540, 640, "none"], 2: [780, 720, "right"] };
const Bubbles: React.FC<{ names: string[]; cur?: { who: string; en: string }; f: number; L0?: number; shoutColor?: string }> = ({ names, cur, f, shoutColor }) => {
  if (!cur || cur.who === "Narrator") return null;
  const who = cur.who.split("&").map((w) => w.trim());
  const shout = cur.en === cur.en.toUpperCase();
  if (who.length > 1) return <Speech x={540} y={640} text={cur.en} k={1} tail="none" shout color={shoutColor ?? "#fde68a"} />;
  const i = names.indexOf(who[0]);
  if (i < 0) return null;
  const [x, y, tail] = BUB[i];
  return <Speech x={x} y={y + (i === 1 ? 0 : Math.sin(f / 9) * 3)} text={cur.en} k={1} tail={tail} shout={shout} />;
};
const Laptop: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode; bg?: string }> = ({ x, y, s = 1, children, bg = "#fff" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-170} width={240} height={156} rx={10} fill="#cbd5e1" stroke={INK} strokeWidth={6} />
    <rect x={-106} y={-157} width={212} height={130} rx={4} fill={bg} />
    <g transform="translate(0 -92)">{children}</g>
    <path d="M -140 0 L 140 0 L 122 -14 L -122 -14 Z" fill="#94a3b8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </g>
);
const Calendar: React.FC<{ x: number; y: number; day: string; flip?: number; color?: string }> = ({ x, y, day, flip = 0, color = RED }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-90} y={-80} width={180} height={170} rx={16} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={-90} y={-80} width={180} height={52} rx={16} fill={color} /><rect x={-90} y={-46} width={180} height={18} fill={color} />
    {[-50, 50].map((cx) => <rect key={cx} x={cx - 6} y={-96} width={12} height={34} rx={6} fill={INK} />)}
    <text x={0} y={52} textAnchor="middle" fontFamily={HAND} fontSize={day.length > 4 ? 46 : 64} fill={INK}>{day}</text>
    {flip > 0 && flip < 1 && <path d={`M -90 -28 L 90 -28 L 90 ${-28 + 118 * (1 - flip)} L -90 ${-28 + 118 * (1 - flip)} Z`} fill="#f1f5f9" stroke={INK} strokeWidth={4} />}
  </g>
);

/* ---------- 1. Five teams, one task ---------- */
const MiniTeam: React.FC<{ x: number; y: number; s: number; names: string[]; f: number; seed: number }> = ({ x, y, s, names, f, seed }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {names.map((n, i) => <Person key={n} who={n} x={(i - 1) * 150} y={0} pose={alive(P({ aL: [-14, -6], aR: [14, 6] }), f, 1, seed + i * 9)} f={f} face={{ eyes: "open", mouth: "smile", look: (1 - i) * -0.5 }} />)}
    <rect x={-190} y={-230} width={380} height={24} rx={8} fill="#c79a6b" stroke={INK} strokeWidth={6} />
    <line x1={-160} y1={-206} x2={-160} y2={0} stroke={INK} strokeWidth={10} /><line x1={160} y1={-206} x2={160} y2={0} stroke={INK} strokeWidth={10} />
  </g>
);
export const T1: React.FC<SP> = ({ sc }) => {
  const { f, L } = useTalk(sc);
  const groups = [2, 3, 4, 5, 6];
  const spots: [number, number][] = [[280, 830], [800, 830], [540, 1035], [280, 1240], [800, 1240]];
  const icons = ["bolt", "fire", "zzz", "party", "puzzle"];
  return (
    <g>
      <Floor wall="#e0f2fe" floor="#bae6fd" />
      {groups.map((g, i) => {
        const k = pop(f, 8 + i * 8, 14);
        const [x, y] = spots[i];
        return k <= 0 ? null : (
          <g key={g} transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
            <MiniTeam x={x} y={y} s={0.42} names={TEAMS[g]} f={f} seed={i * 17} />
            <g transform={`translate(${x} ${y - 240})`}><circle r={34} fill="#fff" stroke={INK} strokeWidth={4} /><Icon kind={icons[i]} s={0.42} /></g>
          </g>
        );
      })}
      {/* the mission */}
      <g transform={`translate(540 300) rotate(-3) scale(${pop(f, L(1), 14)})`}>
        <rect x={-460} y={-110} width={920} height={220} rx={24} fill="#fff" stroke={RED} strokeWidth={12} />
        <text x={0} y={-24} textAnchor="middle" fontFamily={HAND} fontSize={80} fill={RED}>MISSION:</text>
        <text x={0} y={62} textAnchor="middle" fontFamily={HAND} fontSize={64} fill={INK}>Presentation due Friday</text>
      </g>
      {f > L(3) && <Txt x={540} y={500} t="Which team are you in?" size={74} color="#fff" outline={INK} k={pop(f, L(3), 12)} />}
    </g>
  );
};

/* ---------- 2. The Productive Team ---------- */
export const T2: React.FC<SP> = ({ sc }) => {
  const { f, cur, speakers, L, at, find } = useTalk(sc);
  const names = TEAMS[2];
  const narr = at("Narrator");
  const done = f > find("finished");
  const relax = tw(f, find("finished") + 40, find("finished") + 60);
  const nodBen = f > L(2) && f < L(2) + 30 ? Math.sin((f - L(2)) / 3) * 10 : 0;
  const nodChloe = f > L(3) && f < L(3) + 30 ? Math.sin((f - L(3)) / 3) * 10 : 0;
  const chill = P({ drop: 46, lL: [86, 4], lR: [80, 8], aL: [-150, -230], aR: [150, 230], lean: 8, tilt: 6 });
  const day = f < narr ? "MON" : f < find("finished") + 40 ? "WED" : "FRI";
  const rows = [["Ben", "research", f > at("Ben")], ["Chloe", "slides", f > at("Chloe")], ["Anna", "script", done]] as const;
  return (
    <g>
      <Floor wall="#ecfdf5" floor="#bbf7d0" />
      <Calendar x={900} y={560} day={day} color="#16a34a" />
      <Table f={f} names={names} speakers={speakers}
        poses={{ Anna: mix(P({ ...SIT, aR: [70, 150] }), chill, relax), Ben: mix(P({ ...SIT, tilt: nodBen }), chill, relax), Chloe: mix(P({ ...SIT, tilt: nodChloe }), chill, relax) }}
        faces={{ Anna: { eyes: relax > 0.5 ? "happy" : "open" }, Ben: { eyes: relax > 0.5 ? "happy" : "open" }, Chloe: { eyes: relax > 0.5 ? "happy" : "open" } }}>
        <Laptop x={540} y={GY - 230} s={1.05}>
          <text x={0} y={-40} textAnchor="middle" fontFamily={HAND} fontSize={26} fill={INK}>PLAN</text>
          {rows.map(([n, job, ok], i) => <g key={n}><text x={-90} y={-6 + i * 30} fontFamily={HAND} fontSize={24} fill={INK}>{`${n}: ${job}`}</text>{ok && <path d={`M 66 ${-14 + i * 30} l 8 8 l 16 -16`} stroke="#16a34a" strokeWidth={6} fill="none" strokeLinecap="round" />}</g>)}
        </Laptop>
        {relax > 0 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${SEATS[i] + (i === 2 ? 26 : -26) * relax} ${GY - 334}) scale(${relax})`}><rect x={-44} y={-12} width={36} height={22} rx={8} fill={INK} /><rect x={8} y={-12} width={36} height={22} rx={8} fill={INK} /><line x1={-8} y1={-4} x2={8} y2={-4} stroke={INK} strokeWidth={4} /></g>)}
      </Table>
      <Bubbles names={names} cur={cur} f={f} />
      <TeamSign f={f} icon="bolt" en="The Productive Team" vi="Nhóm năng suất" color="#22c55e" />
      <ResultBar f={f} at={find("Result")} text="A" />
    </g>
  );
};

/* ---------- 3. The Argument Team ---------- */
export const T3: React.FC<SP> = ({ sc }) => {
  const { f, cur, speakers, at, find } = useTalk(sc);
  const names = TEAMS[3]; // Dan, Finn, Emma
  const yell = f >= find("STAY") && f < find("STAY") + 40;
  const narr = at("Narrator");
  const fire = Math.min(1, f / 60) * (f < narr + 30 ? 1 : 1 - tw(f, narr + 30, narr + 50));
  const angry = { eyes: "open" as const, brows: "angry" as const, blush: true, mouth: "frown" as const };
  return (
    <g>
      <Floor wall="#fff1f2" floor="#fecdd3" />
      {/* the screen with the (very beautiful, very empty) slide */}
      <g transform="translate(540 600)">
        <rect x={-260} y={-150} width={520} height={300} rx={14} fill="#fff" stroke={INK} strokeWidth={7} />
        {f > find("Result") ? <g><rect x={-240} y={-130} width={480} height={260} rx={10} fill={f % 40 < 20 ? "#bfdbfe" : "#bbf7d0"} /><rect x={-240} y={-130} width={480} height={260} rx={10} fill="none" stroke="#a78bfa" strokeWidth={10} strokeDasharray="22 12" /><Txt x={0} y={20} t="(empty)" size={60} color="#64748b" /></g>
          : <g><rect x={-240} y={-130} width={240} height={260} fill="#60a5fa" opacity={0.8} /><rect x={0} y={-130} width={240} height={260} fill="#4ade80" opacity={0.8} /><text x={0} y={16} textAnchor="middle" fontFamily={HAND} fontSize={52} fill={INK}>VS</text></g>}
      </g>
      <Table f={f} names={names} speakers={speakers} standing
        poses={{
          Dan: yell ? P({ aR: [96, 92], aL: [-20, -10], lean: -6 }) : P({ aR: [130, 170], aL: [-20, -40], lean: -4 }),
          Emma: yell ? P({ aR: [96, 92], aL: [-20, -10], lean: -6 }) : P({ aR: [130, 170], aL: [-20, -40], lean: -4 }),
          Finn: yell ? P({ aL: [-40, -70], aR: [40, 70], drop: 20 }) : P({ aL: [-30, -60], aR: [40, 120] }),
        }}
        faces={{ Dan: { ...angry, mouth: "scream" }, Emma: { ...angry, mouth: "scream" }, Finn: { eyes: yell ? "wide" : "open", mouth: "wavy", brows: "worried", sweat: true } }}>
        {/* small flames on the table */}
        {fire > 0 && [-60, 0, 60].map((dx, i) => <g key={i} transform={`translate(${540 + dx} ${GY - 236}) scale(${fire * (0.5 + 0.12 * Math.sin(f / 3 + i))})`}><Icon kind="fire" s={0.8} /></g>)}
        {/* colour swatches held up */}
        {!yell && f < narr && <g><rect x={268} y={GY - 520} width={70} height={90} rx={8} fill="#3b82f6" stroke={INK} strokeWidth={5} transform={`rotate(-10 300 ${GY - 470})`} /><rect x={742} y={GY - 520} width={70} height={90} rx={8} fill="#22c55e" stroke={INK} strokeWidth={5} transform={`rotate(10 780 ${GY - 470})`} /></g>}
      </Table>
      <Bubbles names={names} cur={cur} f={f} shoutColor="#fecaca" />
      <TeamSign f={f} icon="fire" en="The Argument Team" vi="Nhóm cãi nhau" color="#ef4444" />
      <ResultBar f={f} at={find("Result")} text="a beautiful empty slide" color="#ef4444" />
    </g>
  );
};

/* ---------- 4. The "Later" Team ---------- */
export const T4: React.FC<SP> = ({ sc }) => {
  const { f, cur, speakers, at, find } = useTalk(sc);
  const names = TEAMS[4]; // Gina, Hugo, Ivy
  const jump = Math.round((sc.marks[0]?.t ?? 7) * 30);
  const night = f >= jump - 6;
  const what = f >= find("WHAT") - 2;
  const narr = at("Narrator");
  const days = ["MON", "TUE", "WED", "THU"];
  const per = jump / 4;
  const di = Math.min(3, Math.floor(f / per));
  const flip = (f % per) / 10;
  const lounge = P({ drop: 60, lean: 22, tilt: 6, lL: [96, 40], lR: [90, 50], aL: [40, 160], aR: [60, 170] });
  const panic = P({ aL: [-150, -175], aR: [150, 175], dy: -20 });
  const work = P({ ...SIT, aL: [48, 90 + Math.sin(f * 2) * 8], aR: [56, 94 + Math.sin(f * 2.4) * 8], lean: -8 });
  const pose = (n: string) => (f >= narr ? work : what && n !== "Gina" ? mix(panic, P({ aL: [-150, -175], aR: [150, 175] }), Math.abs(Math.sin(f / 5))) : night && n === "Gina" ? P({ aL: [-20, -30], aR: [110, 120] }) : night ? mix(lounge, SIT, 0.5) : lounge);
  const siren = night && f < narr + 40 && Math.floor(f / 8) % 2 === 0;
  return (
    <g>
      <Floor wall={night ? "#1e1b4b" : "#fef9c3"} floor={night ? "#171533" : "#fde68a"} />
      {siren && <rect width={VW} height={VH} fill={RED} opacity={0.18} />}
      {!night ? <Calendar x={880} y={570} day={days[di]} flip={di < 3 ? flip : 0} color="#f59e0b" />
        : <g><Calendar x={880} y={570} day="THU" color="#f59e0b" /><Txt x={880} y={720} t="11:00 PM" size={60} color="#fde68a" outline={INK} /></g>}
      {night && <g transform="translate(200 560)"><rect x={-60} y={-20} width={120} height={50} rx={10} fill="#334155" stroke={INK} strokeWidth={5} /><path d="M -46 -20 A 46 46 0 0 1 46 -20 Z" fill={siren ? "#ef4444" : "#7f1d1d"} stroke={INK} strokeWidth={5} />{siren && [-1, 0, 1].map((k) => <line key={k} x1={k * 60} y1={-80} x2={k * 90} y2={-120} stroke="#ef4444" strokeWidth={8} strokeLinecap="round" />)}</g>}
      <Table f={f} names={names} speakers={speakers} poses={{ Gina: pose("Gina"), Hugo: pose("Hugo"), Ivy: pose("Ivy") }}
        faces={{
          Gina: { eyes: night ? "wide" : "tired", mouth: night ? "o" : "smile", sweat: night },
          Hugo: { eyes: what ? "wide" : night ? "open" : "tired", mouth: what ? "scream" : "smile", brows: what ? "up" : "none", sweat: f >= narr },
          Ivy: { eyes: what ? "wide" : "happy", mouth: what ? "scream" : "smile", brows: what ? "up" : "none", sweat: f >= narr },
        }}>
        {/* phones while lounging */}
        {!night && SEATS.map((x, i) => <rect key={i} x={x + (i === 2 ? -84 : i === 1 ? -14 : 54)} y={GY - 420 + (i === 1 ? 70 : 0)} width={30} height={50} rx={6} fill={INK} stroke="#64748b" strokeWidth={3} />)}
        {f >= narr && <Laptop x={540} y={GY - 230} s={0.9} bg="#1e1e2e"><text x={0} y={10} textAnchor="middle" fontFamily={HAND} fontSize={40} fill="#fde68a">{`slide ${Math.min(12, 1 + Math.floor((f - narr) / 14))}/12`}</text></Laptop>}
      </Table>
      {!night && f > 30 && [0, 1, 2].map((i) => { const tt = ((f + i * 20) % 60) / 60; return <text key={i} x={560 + tt * 40} y={780 - tt * 80} fontFamily={HAND} fontSize={40 + tt * 20} fill="#a8a29e" opacity={1 - tt}>z</text>; })}
      <Bubbles names={names} cur={cur} f={f} shoutColor="#fecaca" />
      <TeamSign f={f} icon="zzz" en={'The "Later" Team'} vi="Nhóm để mai tính" color="#f59e0b" />
      <ResultBar f={f} at={find("Result")} text="12 slides, 0 sleep" color="#f59e0b" />
    </g>
  );
};

/* ---------- 5. The Fun Team ---------- */
export const T5: React.FC<SP> = ({ sc }) => {
  const { f, cur, speakers, at, find } = useTalk(sc);
  const names = TEAMS[5]; // Jake, Kim, Leo
  const narr = at("Narrator");
  const laugh = (f > at("Leo") + 50 && f < narr + 20) || f > find("But hey");
  const lp = (seed: number) => P({ ...SIT, aL: [-40, -110], aR: [40, 110], lean: Math.sin(f / 4 + seed) * 8, tilt: Math.sin(f / 3 + seed) * 10 });
  return (
    <g>
      <Floor wall="#fdf4ff" floor="#f5d0fe" />
      {[...Array(14)].map((_, i) => <rect key={i} x={(i * 151) % 1040 + 20} y={560 + ((i * 97 + f * 3) % 420)} width={16} height={16} fill={["#f472b6", "#facc15", "#60a5fa", "#4ade80"][i % 4]} transform={`rotate(${f * 4 + i * 30} ${(i * 151) % 1040 + 28} ${568 + ((i * 97 + f * 3) % 420)})`} opacity={0.8} />)}
      <Table f={f} names={names} speakers={speakers}
        poses={{ Jake: laugh ? lp(0) : P({ ...SIT, aR: [100, 150] }), Kim: laugh ? lp(2) : P({ ...SIT, aL: [-40, -60], aR: [40, 60] }), Leo: laugh ? lp(4) : P({ ...SIT, aR: [70, 150] }) }}
        faces={{ Jake: { eyes: laugh ? "happy" : "open", mouth: laugh ? "grin" : "smile" }, Kim: { eyes: laugh ? "happy" : "open", mouth: laugh ? "grin" : "smile" }, Leo: { eyes: laugh ? "happy" : "open", mouth: laugh ? "grin" : "smile" } }}>
        {/* the PROJECT sheet, used as a plate */}
        <g transform={`translate(420 ${GY - 236})`}><path d="M -80 0 L 80 0 L 66 -10 L -66 -10 Z" fill="#fff" stroke={INK} strokeWidth={4} /><text x={0} y={-14} textAnchor="middle" fontFamily={HAND} fontSize={26} fill={RED}>PROJECT</text><path d="M -50 -16 Q 0 -70 50 -16 Z" fill="#fbbf24" stroke={INK} strokeWidth={4} /><circle cx={-14} cy={-30} r={6} fill={RED} /><circle cx={14} cy={-34} r={6} fill={RED} /></g>
        {/* pizza box */}
        <g transform={`translate(640 ${GY - 236})`}><rect x={-90} y={-24} width={180} height={24} rx={4} fill="#d6a76b" stroke={INK} strokeWidth={4} /><path d="M -80 -24 L -70 -110 L 80 -110 L 90 -24 Z" fill="#e9c08d" stroke={INK} strokeWidth={4} /><circle cx={0} cy={-66} r={32} fill="#f87171" stroke={INK} strokeWidth={3} /></g>
        {/* Leo's phone with the funny video */}
        {f > at("Leo") && <g transform={`translate(${SEATS[2] - 120} ${GY - 470})`}><rect x={-34} y={-56} width={68} height={112} rx={10} fill={INK} /><rect x={-26} y={-46} width={52} height={88} rx={4} fill="#60a5fa" /><path d="M -8 -12 L 12 0 L -8 12 Z" fill="#fff" /></g>}
        {/* the game controller */}
        <g transform={`translate(${SEATS[0] + 110} ${GY - 300}) rotate(-10)`}><rect x={-46} y={-20} width={92} height={40} rx={20} fill="#334155" stroke={INK} strokeWidth={4} /><circle cx={22} cy={-2} r={6} fill="#f87171" /><path d="M -30 -2 h 16 M -22 -10 v 16" stroke="#fff" strokeWidth={4} /></g>
      </Table>
      {laugh && [0, 1, 2].map((i) => <Txt key={i} x={SEATS[i] + (i - 1) * 30} y={GY - 520 - Math.abs(Math.sin(f / 5 + i)) * 20} t="HA HA" size={48} color="#db2777" outline="#fff" rot={(i - 1) * 8} />)}
      <Bubbles names={names} cur={cur} f={f} />
      <TeamSign f={f} icon="party" en="The Fun Team" vi="Nhóm vui là chính" color="#d946ef" />
      <ResultBar f={f} at={find("Five meetings")} text="0 slides, 100% fun" color="#d946ef" />
    </g>
  );
};

/* ---------- 6. The Balanced Team ---------- */
export const T6: React.FC<SP> = ({ sc }) => {
  const { f, cur, speakers, at, find } = useTalk(sc);
  const names = TEAMS[6]; // Mia, Noah, Olivia
  const vote = f > find("vote") + 20 && f < at("Noah") + 20;
  const snacks = pop(f, find("snacks"), 14);
  const point = f > at("Olivia") - 4;
  const narr = at("Narrator");
  return (
    <g>
      <Floor wall="#eef2ff" floor="#c7d2fe" />
      {/* the plan on the wall */}
      <g transform="translate(860 600) rotate(3)">
        <rect x={-130} y={-150} width={260} height={300} rx={14} fill="#fff" stroke={INK} strokeWidth={6} />
        <text x={0} y={-100} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={INK}>PLAN</text>
        {["Mon: topic", "Tue: research", "Wed: slides", "Thu: done!"].map((t, i) => <g key={t}><text x={-104} y={-44 + i * 52} fontFamily={HAND} fontSize={34} fill={INK}>{t}</text>{f > narr + i * 20 && <path d={`M 84 ${-56 + i * 52} l 8 8 l 16 -16`} stroke="#16a34a" strokeWidth={6} fill="none" strokeLinecap="round" />}</g>)}
      </g>
      <Table f={f} names={names} speakers={speakers}
        poses={{ Mia: vote ? P({ ...SIT, aR: [160, 175] }) : P({ ...SIT, aR: [70, 140] }), Noah: vote ? P({ ...SIT_FLAT, aR: [160, 178] }) : P({ ...SIT_FLAT, aR: [50, 100] }), Olivia: vote ? P({ ...SIT, aR: [160, 175] }) : point ? P({ ...SIT, aR: [140, 128] }) : SIT }}
        faces={{ Mia: { eyes: "open", mouth: "smile" }, Noah: { eyes: "happy", mouth: "smile" }, Olivia: { eyes: "open", mouth: "smile" } }}>
        <Laptop x={440} y={GY - 230} s={0.85}><rect x={-80} y={-36} width={160} height={70} rx={6} fill="#60a5fa" /><text x={0} y={10} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#fff">slide 3</text></Laptop>
        {snacks > 0 && <g transform={`translate(660 ${GY - 236}) scale(${snacks})`}><ellipse cx={0} cy={-6} rx={80} ry={14} fill="#fff" stroke={INK} strokeWidth={4} />{[-40, 0, 40].map((x) => <circle key={x} cx={x} cy={-24} r={20} fill="#d97706" stroke={INK} strokeWidth={3} />)}</g>}
      </Table>
      {f > narr && [0, 1, 2].map((i) => <g key={i} transform={`translate(${380 + i * 160} ${760 - Math.sin(f / 10 + i) * 14}) scale(${pop(f, narr + i * 8, 12) * 0.9})`}><path d="M 0 30 C -50 0 -40 -40 0 -18 C 40 -40 50 0 0 30 Z" fill="#fb7185" stroke={INK} strokeWidth={4} /></g>)}
      <Bubbles names={names} cur={cur} f={f} />
      <TeamSign f={f} icon="puzzle" en="The Balanced Team" vi="Nhóm cân bằng" color="#6366f1" />
      <ResultBar f={f} at={narr + 60} text="A + still friends" color="#6366f1" />
    </g>
  );
};
const SIT_FLAT = SIT;

/* ---------- 7. The ending ---------- */
export const T7: React.FC<SP & { hold: number }> = ({ sc }) => {
  const { f, L } = useTalk(sc);
  const order = [3, 2, 6, 5, 4]; // the balanced team in the middle
  const icons: Record<number, string> = { 2: "bolt", 3: "fire", 4: "zzz", 5: "party", 6: "puzzle" };
  return (
    <g>
      <rect width={VW} height={VH} fill="#fef3c7" />
      <circle cx={540} cy={820} r={260 + Math.sin(f / 12) * 10} fill="#fde68a" opacity={0.7} />
      <rect x={0} y={GY} width={VW} height={VH - GY} fill="#fcd34d" />
      {order.map((g, i) => {
        const x = 108 + i * 216, mid = g === 6, s = mid ? 0.5 : 0.4;
        const k = pop(f, 6 + i * 6, 12);
        return k <= 0 ? null : (
          <g key={g} transform={`translate(0 ${(1 - k) * 200})`}>
            {TEAMS[g].map((n, j) => <Person key={n} who={n} x={x + (j - 1) * (mid ? 62 : 54)} y={GY} s={s} pose={alive(P({ aL: [-20, -10], aR: mid ? [150, 170] : [20, 10] }), f, 1, j * 11 + i * 5)} f={f} face={{ eyes: mid ? "happy" : "open", mouth: "smile" }} />)}
            <g transform={`translate(${x} ${GY + 70})`}><circle r={34} fill="#fff" stroke={INK} strokeWidth={4} /><Icon kind={icons[g]} s={0.42} /></g>
          </g>
        );
      })}
      <g transform={`translate(540 ${GY - 330}) rotate(${f * 1.5}) scale(${pop(f, 20, 16) * (1 + 0.06 * Math.sin(f / 6))})`}><Star x={0} y={0} s={3.2} fill="#facc15" rot={0} /></g>
      <g transform={`translate(540 430) scale(${pop(f, L(2), 14)})`}>
        <rect x={-450} y={-150} width={900} height={300} rx={36} fill="#fff" stroke={INK} strokeWidth={8} />
        <text x={0} y={-30} textAnchor="middle" fontFamily={HAND} fontSize={80} fill={INK}>Which team are you in?</text>
        <text x={0} y={80} textAnchor="middle" fontFamily={HAND} fontSize={72} fill={RED}>Comment below!</text>
      </g>
      {f < L(2) && <Txt x={540} y={430} t="talk · plan · have fun" size={80} color={INK} k={pop(f, L(1), 12)} />}
    </g>
  );
};

export { HAND };
