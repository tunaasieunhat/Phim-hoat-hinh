// Sets for "6 Types of Students When Spending Money": the dorm block from above, a bubble-tea shop, a dorm room
// (colour / night / dark variants), the corridor, a long road with a bus, the round table at night.
// Every background bleeds well past the canvas so camera pushes and rolls never show an edge.
import React from "react";
import { INK } from "../Toon/Lily";
import { COLOR, type Who } from "./cast";

export const W = 1080, H = 1920;
const BIG = { x: -900, y: -900, width: W + 1800, height: H + 1800 };
const Soft = ({ id, d = 30 }: { id: string; d?: number }) => <filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={d} /></filter>;
export const ORDER: Who[] = ["Ray", "Pia", "Bea", "Yuki", "Otto", "Gus"];

// the dorm from above, roof off: six rooms in two rows along a corridor; kids = what's drawn in room i (top view)
export const DormTop: React.FC<{ f: number; night?: number; room?: (i: number, cx: number, cy: number) => React.ReactNode; middle?: React.ReactNode }> = ({ f, night = 0, room, middle }) => (
  <g>
    <rect {...BIG} fill={night ? "#1e293b" : "#86c06c"} />
    {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-500 + (i * 197) % 2100} cy={-500 + (i * 331) % 2900} r={50 + (i % 3) * 20} fill={night ? "#14532d" : "#4d7c0f"} stroke={INK} strokeWidth={5} opacity={0.9} />)}
    <rect x={40} y={260} width={1000} height={1400} rx={12} fill="#78716c" stroke={INK} strokeWidth={12} />
    <rect x={460} y={260} width={160} height={1400} fill={night ? "#57534e" : "#d6d3d1"} />
    {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={460} y1={300 + i * 100} x2={620} y2={300 + i * 100} stroke="#a8a29e" strokeWidth={4} />)}
    {ORDER.map((w, i) => {
      const col = i % 2, row = Math.floor(i / 2), x = col ? 640 : 60, y = 280 + row * 460, cx = x + 190, cy = y + 210;
      return <g key={w}>
        <rect x={x} y={y} width={380} height={420} fill={night ? "#334155" : "#fef3c7"} stroke={INK} strokeWidth={8} />
        <rect x={x + 20} y={y + 20} width={150} height={240} rx={14} fill={COLOR[w]} opacity={0.7} stroke={INK} strokeWidth={5} /><rect x={x + 30} y={y + 30} width={130} height={60} rx={20} fill="#fff" stroke={INK} strokeWidth={4} />
        <rect x={x + 230} y={y + 30} width={130} height={90} fill="#a16207" stroke={INK} strokeWidth={5} />
        <circle cx={cx + 40} cy={cy + 100} r={70} fill={COLOR[w]} opacity={0.25} />
        <rect x={col ? x - 10 : x + 370} y={y + 300} width={20} height={90} fill="#92400e" stroke={INK} strokeWidth={4} />
        {room && room(i, cx, cy)}
      </g>;
    })}
    {middle}
    {night > 0 && <rect {...BIG} fill="#0b1026" opacity={0.25} />}
  </g>
);

// bubble-tea shop: menu board, counter, a wall of cups, warm lamps
export const TeaShop: React.FC<{ f: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ f, children, front }) => (
  <g>
    <defs><radialGradient id="tsL" cx="0.5" cy="0.2" r="0.7"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.55} /><stop offset="1" stopColor="#fff3c4" stopOpacity={0} /></radialGradient></defs>
    <rect {...BIG} fill="#fbcfe8" />
    {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-400 + i * 100} y={-900} width={44} height={2200} fill="#fff" opacity={0.25} />)}
    <g transform="translate(540 420)"><rect x={-360} y={-170} width={720} height={340} rx={24} fill="#3f2a20" stroke={INK} strokeWidth={10} /><text y={-100} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={56} fill="#fde68a">BOBA TIME</text>
      {[["Milk tea", "35k"], ["Taro", "39k"], ["Brown sugar", "45k"]].map(([a, b], i) => <g key={a}><text x={-300} y={-20 + i * 60} fontFamily="KidsHand" fontSize={50} fill="#fff">{a}</text><text x={300} y={-20 + i * 60} textAnchor="end" fontFamily="KidsHand" fontSize={50} fill="#fde68a">{b}</text></g>)}</g>
    {[220, 860].map((x, i) => <g key={x}><line x1={x} y1={-60} x2={x} y2={120} stroke={INK} strokeWidth={6} /><path d={`M ${x - 60} 170 Q ${x} 90 ${x + 60} 170 Z`} fill="#f472b6" stroke={INK} strokeWidth={7} /><ellipse cx={x} cy={172} rx={22} ry={8} fill="#fff7d6" opacity={0.9 + 0.1 * Math.sin(f / 6 + i)} /></g>)}
    <rect {...BIG} fill="url(#tsL)" />
    <rect x={-900} y={1240} width={W + 1800} height={1500} fill="#e9d5c4" />
    {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={540 + (i - 6) * 70} y1={1240} x2={540 + (i - 6) * 330} y2={2600} stroke="#d6bfa9" strokeWidth={5} />)}
    {children}
    <rect x={-60} y={1060} width={1200} height={50} rx={10} fill="#f8fafc" stroke={INK} strokeWidth={9} />
    <rect x={-60} y={1110} width={1200} height={140} fill="#f472b6" stroke={INK} strokeWidth={9} />
    {front}
  </g>
);

// a dorm room: coloured wall, window (day / night), bed, desk with lamp; dark = lit only by a phone
export const Room: React.FC<{ f: number; wall?: string; night?: number; dark?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ f, wall = "#c7d2fe", night = 0, dark = 0, children, front }) => (
  <g>
    <defs><Soft id="rmSoft" /></defs>
    <rect {...BIG} fill={wall} />
    {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={(i * 173) % 1300 - 100} cy={60 + ((i * 91) % 1150)} r={5} fill="#fff" opacity={0.2} />)}
    <rect x={600} y={320} width={380} height={420} rx={12} fill="#5b3a29" stroke={INK} strokeWidth={9} />
    <rect x={622} y={342} width={336} height={376} fill={night ? "#1e2346" : "#93c5fd"} />
    {night ? Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={640 + (i * 67) % 300} cy={370 + (i * 41) % 200} r={3} fill="#fff" />) : <circle cx={900} cy={400} r={36} fill="#fde047" />}
    <line x1={790} y1={342} x2={790} y2={718} stroke={INK} strokeWidth={7} /><line x1={622} y1={530} x2={958} y2={530} stroke={INK} strokeWidth={7} />
    <g transform="translate(150 420) rotate(-3)"><rect x={-90} y={-110} width={180} height={220} fill="#fde68a" stroke={INK} strokeWidth={7} /><circle cx={0} cy={-20} r={44} fill="#fff" stroke={INK} strokeWidth={5} /></g>
    <rect x={-900} y={1250} width={W + 1800} height={1500} fill="#a1785a" />
    {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={540 + (i - 6) * 70} y1={1250} x2={540 + (i - 6) * 330} y2={2600} stroke="#7e5a41" strokeWidth={5} />)}
    {/* bed (left) and desk (right) */}
    <g transform="translate(0 1060)"><rect x={-60} y={-160} width={70} height={360} rx={14} fill="#8b6b4a" stroke={INK} strokeWidth={7} /><rect x={-40} y={80} width={460} height={130} rx={20} fill="#e2e8f0" stroke={INK} strokeWidth={8} /><rect x={0} y={20} width={150} height={70} rx={30} fill="#fff" stroke={INK} strokeWidth={7} /><path d="M 150 60 Q 300 40 420 80 L 420 210 L 130 210 Z" fill="#93c5fd" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></g>
    <g transform="translate(830 1250)"><rect x={-180} y={-260} width={360} height={30} rx={8} fill="#a16207" stroke={INK} strokeWidth={7} /><line x1={-160} y1={-230} x2={-160} y2={0} stroke={INK} strokeWidth={12} /><line x1={160} y1={-230} x2={160} y2={0} stroke={INK} strokeWidth={12} /><line x1={120} y1={-260} x2={120} y2={-380} stroke={INK} strokeWidth={8} /><path d="M 80 -380 L 160 -380 L 140 -440 L 100 -440 Z" fill="#fde68a" stroke={INK} strokeWidth={6} /></g>
    {children}
    {dark > 0 && <rect {...BIG} fill="#0b1026" opacity={0.78 * dark} />}
    {front}
  </g>
);

// the corridor: a row of numbered doors in perspective, ceiling lights
export const Hallway: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <g>
    <rect {...BIG} fill="#e7e5e4" />
    <path d="M -900 1250 L 2000 1250 L 2000 2800 L -900 2800 Z" fill="#a8a29e" />
    {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={540 + (i - 5) * 60} y1={1250} x2={540 + (i - 5) * 380} y2={2600} stroke="#78716c" strokeWidth={4} />)}
    {[-260, 120, 500, 880].map((x, i) => <g key={x}><rect x={x} y={560} width={300} height={690} rx={10} fill="#b07a4f" stroke={INK} strokeWidth={9} /><rect x={x + 100} y={600} width={100} height={60} rx={8} fill="#fef3c7" stroke={INK} strokeWidth={5} /><text x={x + 150} y={644} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={36} fill={INK}>{101 + i}</text><circle cx={x + 260} cy={920} r={14} fill="#fde047" stroke={INK} strokeWidth={4} /></g>)}
    {[200, 760].map((x, i) => <g key={x}><rect x={x - 80} y={140} width={160} height={30} rx={10} fill="#f8fafc" stroke={INK} strokeWidth={6} /><ellipse cx={x} cy={420} rx={260} ry={260} fill="#fff7d6" opacity={0.25 + 0.03 * Math.sin(f / 7 + i)} /></g>)}
    {children}
  </g>
);

// a long sunny road; the bus passes at busX
export const Road: React.FC<{ f: number; busX?: number; children?: React.ReactNode }> = ({ f, busX = -2000, children }) => (
  <g>
    <defs><linearGradient id="rdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#e0f2fe" /></linearGradient><Soft id="rdSoft" /></defs>
    <rect {...BIG} fill="url(#rdSky)" />
    <circle cx={880} cy={250} r={90} fill="#fde047" /><circle cx={880} cy={250} r={190} fill="#fde047" opacity={0.3} filter="url(#rdSoft)" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-300 + i * 320} y={700 - (i % 3) * 120} width={260} height={700} fill={["#fca5a5", "#c4b5fd", "#86efac", "#fde68a", "#93c5fd"][i]} stroke={INK} strokeWidth={6} opacity={0.9} />)}
    <rect x={-900} y={1250} width={W + 1800} height={160} fill="#d6d3d1" stroke={INK} strokeWidth={6} />
    <rect x={-900} y={1410} width={W + 1800} height={1400} fill="#4b5563" />
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={((i * 260 - f * 4) % 2600) - 900} y={1600} width={150} height={16} fill="#fde68a" />)}
    {/* the bus */}
    <g transform={`translate(${busX} 1560)`}>
      <rect x={-380} y={-330} width={760} height={300} rx={30} fill="#facc15" stroke={INK} strokeWidth={10} />
      {[-300, -160, -20, 120].map((x) => <rect key={x} x={x} y={-300} width={120} height={110} rx={10} fill="#bae6fd" stroke={INK} strokeWidth={6} />)}
      <rect x={260} y={-300} width={100} height={250} rx={10} fill="#93c5fd" stroke={INK} strokeWidth={6} /><text x={-120} y={-110} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={60} fill={INK}>BUS 5K</text>
      {[-250, 250].map((x) => <g key={x}><circle cx={x} cy={-30} r={60} fill="#1f2937" stroke={INK} strokeWidth={8} /><circle cx={x} cy={-30} r={22} fill="#9ca3af" /></g>)}
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-420 - i * 40} y1={-280 + i * 70} x2={-700 - i * 60} y2={-280 + i * 70} stroke="#fff" strokeWidth={12} strokeLinecap="round" />)}
    </g>
    {children}
  </g>
);

// the round table at night, seen from above (high angle) or from the side
export const Table: React.FC<{ f: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ f, children, front }) => (
  <g>
    <defs><radialGradient id="tbL" cx="0.5" cy="0.45" r="0.55"><stop offset="0" stopColor="#ffd27f" stopOpacity={0.55} /><stop offset="1" stopColor="#0b1026" stopOpacity={0} /></radialGradient></defs>
    <rect {...BIG} fill="#1e1b4b" />
    {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 397) % 1920} r={3} fill="#c7d2fe" opacity={0.3 + 0.2 * Math.sin(f / 10 + i)} />)}
    <rect {...BIG} fill="url(#tbL)" />
    {children}
    {front}
  </g>
);
