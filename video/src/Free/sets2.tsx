// More sets for "What if everything was free?": the town from above, the shop's street front, the palace balcony,
// an empty factory, the bakery, the farm, the lake, Bob's living room and the chalkboard classroom.
// Backgrounds bleed well past the canvas so camera pushes and rolls never show an edge.
import React from "react";
import { INK } from "../Toon/Lily";
import { H, rnd, W } from "./sets";

const BIG = { x: -900, y: -900, width: W + 1800, height: H + 1800 };
const Soft = ({ id, d = 30 }: { id: string; d?: number }) => <filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={d} /></filter>;
const ROOF = ["#ef4444", "#f97316", "#3b82f6", "#a855f7", "#14b8a6", "#eab308", "#ec4899"];

// bird's-eye town: a street grid, roofs with ridges and shadows, trees, cars; Gus's shop roof in the middle
export const TopCity: React.FC<{ f: number; people?: number; rush?: number; noon?: number }> = ({ f, people = 0, rush = 0, noon = 0 }) => (
  <g>
    <rect {...BIG} fill="#86c06c" />
    {/* streets */}
    {[-300, 380, 1060, 1740].map((y) => <rect key={y} x={-900} y={y + 260} width={W + 1800} height={120} fill="#6b7280" />)}
    {[-460, 150, 760, 1370].map((x) => <rect key={x} x={x + 180} y={-900} width={120} height={H + 1800} fill="#6b7280" />)}
    {[-300, 380, 1060, 1740].map((y) => <line key={y} x1={-900} y1={y + 320} x2={W + 900} y2={y + 320} stroke="#fde68a" strokeWidth={6} strokeDasharray="40 30" />)}
    {/* blocks of houses */}
    {Array.from({ length: 5 }).map((_, bx) => Array.from({ length: 5 }).map((__, by) => {
      const x0 = -460 + bx * 610 - 600, y0 = -300 + by * 680 - 680;
      return Array.from({ length: 4 }).map((___, i) => {
        const k = bx * 31 + by * 7 + i, x = x0 + 330 + (i % 2) * 220, y = y0 + 20 + Math.floor(i / 2) * 230, c = ROOF[Math.floor(rnd(k) * 7)];
        const shop = bx === 2 && by === 2 && i === 0;
        return <g key={`${bx}${by}${i}`}>
          <rect x={x + 14} y={y + 16} width={180} height={180} fill="#000" opacity={0.18} />
          <rect x={x} y={y} width={180} height={180} fill={shop ? "#7c2d12" : c} stroke={INK} strokeWidth={6} />
          <line x1={x} y1={y} x2={x + 180} y2={y + 180} stroke={INK} strokeWidth={3} opacity={0.4} /><line x1={x + 180} y1={y} x2={x} y2={y + 180} stroke={INK} strokeWidth={3} opacity={0.4} />
          {shop && <g><rect x={x - 10} y={y + 60} width={200} height={60} rx={10} fill="#fde68a" stroke={INK} strokeWidth={5} /><text x={x + 90} y={y + 102} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill={INK}>GUS'S</text></g>}
          {rnd(k + 5) > 0.5 && <circle cx={x - 40} cy={y + 90} r={34} fill="#3f8f4f" stroke={INK} strokeWidth={4} />}
        </g>;
      });
    }))}
    {/* cars driving */}
    {[0, 1, 2].map((i) => { const x = ((f * (3 + i) + i * 400) % 2400) - 600; return <rect key={i} x={x} y={640 + 20 + (i % 2) * 40 + (i === 2 ? 680 : 0)} width={70} height={36} rx={10} fill={["#fde047", "#60a5fa", "#f472b6"][i]} stroke={INK} strokeWidth={4} />; })}
    {/* the crowd from above: little heads streaming toward the shop (at about 540, 760) */}
    {people > 0 && Array.from({ length: 160 }).map((_, i) => {
      const a = rnd(i) * Math.PI * 2, d0 = 300 + rnd(i + 9) * 1400, d = d0 * (1 - rush * (0.75 + rnd(i + 3) * 0.2));
      const x = 540 + Math.cos(a) * d + Math.sin(f / 3 + i) * 4, y = 760 + Math.sin(a) * d * 1.2;
      return i < people * 160 ? <g key={i}><circle cx={x} cy={y} r={16} fill="#fff" stroke={INK} strokeWidth={4} /><path d={`M ${x - 14} ${y - 4} A 14 14 0 0 1 ${x + 14} ${y - 4} Z`} fill={ROOF[i % 7]} /></g> : null;
    })}
    <rect {...BIG} fill="#fff7d6" opacity={0.12 + 0.1 * noon} />
  </g>
);

// the street in front of Gus's shop: shop front with awning and window, neighbouring houses, pavement, lamp post
export const Street: React.FC<{ f: number; closed?: boolean; sign?: string; empty?: boolean; dusk?: number; children?: React.ReactNode }> = ({ f, closed, sign, empty, dusk = 0, children }) => (
  <g>
    <defs><linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk > 0.5 ? "#f97316" : "#7dd3fc"} /><stop offset="1" stopColor={dusk > 0.5 ? "#fde68a" : "#e0f2fe"} /></linearGradient><Soft id="stSoft" /></defs>
    <rect {...BIG} fill="url(#stSky)" />
    <circle cx={900} cy={240} r={80} fill="#fde047" opacity={0.95} /><circle cx={900} cy={240} r={160} fill="#fde047" opacity={0.25} filter="url(#stSoft)" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((f * 0.6 + i * 420) % 1700) - 300} cy={180 + i * 70} rx={140} ry={44} fill="#fff" opacity={0.9} />)}
    {/* neighbours */}
    <rect x={-600} y={420} width={560} height={900} fill="#c4b5fd" stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-540 + (i % 2) * 240} y={500 + Math.floor(i / 2) * 260} width={160} height={180} fill="#fff7d6" stroke={INK} strokeWidth={6} />)}
    <rect x={1120} y={380} width={600} height={940} fill="#86efac" stroke={INK} strokeWidth={8} />
    {/* the shop front */}
    <rect x={-40} y={460} width={1160} height={860} fill="#fcd9a8" stroke={INK} strokeWidth={9} />
    <rect x={-40} y={460} width={1160} height={60} fill="#b45309" stroke={INK} strokeWidth={8} />
    <g transform="translate(540 600)"><rect x={-300} y={-60} width={600} height={120} rx={20} fill="#7c2d12" stroke={INK} strokeWidth={9} /><text y={24} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={76} fill="#fde68a">GUS'S SHOP</text></g>
    <path d="M -40 700 L 1120 700 L 1160 800 L -80 800 Z" fill="#ef4444" stroke={INK} strokeWidth={8} />{Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-60 + i * 140} 800 L ${10 + i * 140} 800 L ${-10 + i * 140} 700 L ${-50 + i * 140} 700 Z`} fill="#fff" opacity={0.85} />)}
    {/* shop window with shelves inside */}
    <rect x={40} y={840} width={520} height={380} rx={8} fill={empty ? "#475569" : "#fef3c7"} stroke={INK} strokeWidth={9} />
    {!empty && [0, 1, 2].map((r) => <g key={r}><rect x={60} y={940 + r * 100} width={480} height={12} fill="#a16207" />{Array.from({ length: 10 }).map((_, i) => <rect key={i} x={70 + i * 46} y={890 + r * 100} width={34} height={50} rx={5} fill={ROOF[(i + r) % 7]} stroke={INK} strokeWidth={3} />)}</g>)}
    <path d="M 60 860 L 200 860 L 80 1200 Z" fill="#fff" opacity={0.2} />
    {/* door */}
    <rect x={660} y={840} width={300} height={480} rx={10} fill="#6b3f2a" stroke={INK} strokeWidth={9} />
    <rect x={690} y={870} width={240} height={220} rx={8} fill={empty ? "#334155" : "#bae6fd"} stroke={INK} strokeWidth={6} />
    <circle cx={920} cy={1120} r={14} fill="#fde047" stroke={INK} strokeWidth={4} />
    <g transform="translate(810 1000) rotate(-3)"><rect x={-110} y={-40} width={220} height={80} rx={10} fill={closed ? "#ef4444" : "#22c55e"} stroke={INK} strokeWidth={7} /><text y={16} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={46} fill="#fff">{closed ? "CLOSED" : "OPEN"}</text></g>
    {sign && <g transform="translate(810 1180) rotate(4)"><rect x={-200} y={-46} width={400} height={92} rx={8} fill="#fffbeb" stroke={INK} strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily="KidsHand" fontSize={40} fill={INK}>{sign}</text></g>}
    {/* pavement + road */}
    <rect x={-900} y={1320} width={W + 1800} height={180} fill="#d6d3d1" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-600 + i * 160} y1={1320} x2={-640 + i * 160} y2={1500} stroke="#a8a29e" strokeWidth={4} />)}
    <rect x={-900} y={1500} width={W + 1800} height={1300} fill="#57534e" />
    {[1700, 1720].map((y) => <line key={y} x1={-900} y1={y} x2={W + 900} y2={y} stroke="#fde68a" strokeWidth={8} strokeDasharray="70 50" />)}
    <g transform="translate(1010 1330)"><line x1={0} y1={0} x2={0} y2={-560} stroke="#1f2937" strokeWidth={16} /><path d="M -40 -560 L 40 -560 L 26 -610 L -26 -610 Z" fill="#fde68a" stroke={INK} strokeWidth={6} /></g>
    {children}
    {dusk > 0 && <rect {...BIG} fill="#f97316" opacity={0.15 * dusk} />}
  </g>
);

// palace balcony: stone balustrade, red banners, a sea of rooftops behind
export const Palace: React.FC<{ f: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ f, children, front }) => (
  <g>
    <defs><linearGradient id="plSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#dbeafe" /></linearGradient></defs>
    <rect {...BIG} fill="url(#plSky)" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-300 + i * 140} y={1050 - rnd(i) * 160} width={130} height={600} fill={ROOF[i % 7]} opacity={0.5} stroke={INK} strokeWidth={4} />)}
    <rect x={-900} y={-900} width={720} height={2800} fill="#e7e5e4" stroke={INK} strokeWidth={8} /><rect x={900} y={-900} width={900} height={2800} fill="#e7e5e4" stroke={INK} strokeWidth={8} />
    {[60, 1000].map((x) => <g key={x} transform={`translate(${x} 200) rotate(${Math.sin(f / 20 + x) * 2})`}><path d="M -70 0 L 70 0 L 70 520 L 0 460 L -70 520 Z" fill="#b91c1c" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><path d="M -30 160 l 30 -40 l 30 40 l -30 50 Z" fill="#facc15" stroke={INK} strokeWidth={5} /></g>)}
    {children}
    <rect x={-900} y={1360} width={W + 1800} height={60} fill="#d6d3d1" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-200 + i * 100} 1420 q -26 70 0 140 q 26 70 0 140 L ${-170 + i * 100} 1700 q 26 -70 0 -140 q -26 -70 0 -140 Z`} fill="#e7e5e4" stroke={INK} strokeWidth={6} />)}
    <rect x={-900} y={1700} width={W + 1800} height={1000} fill="#d6d3d1" stroke={INK} strokeWidth={8} />
    {front}
  </g>
);

// an empty factory: conveyor belt, idle machines, weeds and a tumbleweed
export const Factory: React.FC<{ f: number; grass?: number; children?: React.ReactNode }> = ({ f, grass = 1, children }) => (
  <g>
    <rect {...BIG} fill="#9ca3af" />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-200 + i * 220} y={120} width={160} height={260} fill="#cbd5e1" stroke={INK} strokeWidth={6} opacity={0.9} />)}
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${-200 + i * 220} 120 L ${-120 + i * 220} 40 L ${-40 + i * 220} 120`} fill="#6b7280" stroke={INK} strokeWidth={6} />)}
    <rect x={-900} y={1250} width={W + 1800} height={1500} fill="#57534e" />
    {/* machines */}
    {[150, 860].map((x) => <g key={x}><rect x={x - 140} y={760} width={280} height={360} rx={14} fill="#f59e0b" stroke={INK} strokeWidth={9} /><circle cx={x} cy={880} r={60} fill="#374151" stroke={INK} strokeWidth={8} /><rect x={x - 90} y={990} width={180} height={50} rx={8} fill="#1f2937" /><text x={x} y={1028} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill="#ef4444">OFF</text></g>)}
    {/* the belt */}
    <rect x={-200} y={1120} width={1480} height={70} rx={35} fill="#1f2937" stroke={INK} strokeWidth={9} />
    {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={-160 + i * 96} cy={1155} r={22} fill="#6b7280" stroke={INK} strokeWidth={5} />)}
    <rect x={-200} y={1190} width={30} height={160} fill="#374151" /><rect x={1250} y={1190} width={30} height={160} fill="#374151" />
    {/* weeds */}
    {grass > 0 && Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M ${-100 + i * 60} 1120 q -10 ${-40 * grass} ${-4 + (i % 3) * 8} ${-70 * grass} M ${-100 + i * 60} 1120 q 14 ${-30 * grass} 20 ${-50 * grass}`} stroke="#4ade80" strokeWidth={8} fill="none" strokeLinecap="round" />)}
    {grass > 0 && <g transform={`translate(${((f * 7) % 1800) - 400} ${1330 - Math.abs(Math.sin(f / 6)) * 30}) rotate(${f * 6})`}><circle r={50} fill="none" stroke="#a16207" strokeWidth={7} /><path d="M -40 -20 L 40 20 M -30 30 L 30 -30 M 0 -48 L 0 48" stroke="#a16207" strokeWidth={6} /></g>}
    {children}
  </g>
);

// bakery: cold oven, flour sacks, empty bread shelves
export const Bakery: React.FC<{ f: number; children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect {...BIG} fill="#fde7c7" />
    {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-300 + (i % 10) * 180 + (Math.floor(i / 10) % 2) * 90} y={200 + Math.floor(i / 10) * 70} width={170} height={60} fill="#f5c79a" stroke="#e8b07c" strokeWidth={4} />)}
    <g transform="translate(780 900)"><path d="M -260 300 L -260 -60 Q -260 -260 0 -260 Q 260 -260 260 -60 L 260 300 Z" fill="#b45309" stroke={INK} strokeWidth={10} /><path d="M -150 300 L -150 40 Q -150 -90 0 -90 Q 150 -90 150 40 L 150 300 Z" fill="#1f2937" stroke={INK} strokeWidth={8} /><text y={140} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill="#64748b">cold</text>{[0, 1, 2].map((i) => <circle key={i} cx={-60 + i * 60} cy={-20} r={4} fill="#94a3b8" />)}</g>
    <g transform="translate(220 700)"><rect x={-180} y={-12} width={360} height={24} fill="#a16207" stroke={INK} strokeWidth={6} /><rect x={-180} y={168} width={360} height={24} fill="#a16207" stroke={INK} strokeWidth={6} /><text y={110} textAnchor="middle" fontFamily="KidsHand" fontSize={50} fill="#b91c1c">NO BREAD</text></g>
    <rect x={-900} y={1250} width={W + 1800} height={1500} fill="#c08457" />
    {[[140, 1200], [320, 1230]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><path d="M -80 60 Q -100 -60 -40 -100 L 40 -100 Q 100 -60 80 60 Z" fill="#f5f5f4" stroke={INK} strokeWidth={8} /><text y={10} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={30} fill="#78716c">FLOUR</text></g>)}
    {children}
  </g>
);

// farm: field rows, a red barn, abandoned tractor, crows
export const Farm: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <g>
    <defs><linearGradient id="fmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#e0f2fe" /></linearGradient></defs>
    <rect {...BIG} fill="url(#fmSky)" />
    <circle cx={180} cy={260} r={80} fill="#fde047" />
    <rect x={-900} y={900} width={W + 1800} height={2000} fill="#84cc16" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${540 + (i - 7) * 40} 900 L ${540 + (i - 7) * 260} 2000`} stroke="#65a30d" strokeWidth={20} />)}
    <g transform="translate(820 900)"><rect x={-170} y={-260} width={340} height={260} fill="#dc2626" stroke={INK} strokeWidth={9} /><path d="M -200 -250 L 0 -400 L 200 -250 Z" fill="#7f1d1d" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><rect x={-70} y={-150} width={140} height={150} fill="#fef3c7" stroke={INK} strokeWidth={7} /><path d="M -70 -150 L 70 0 M 70 -150 L -70 0" stroke={INK} strokeWidth={6} /></g>
    <g transform="translate(260 1120)"><rect x={-110} y={-150} width={170} height={110} rx={10} fill="#16a34a" stroke={INK} strokeWidth={8} /><rect x={-40} y={-240} width={100} height={100} fill="#bbf7d0" stroke={INK} strokeWidth={7} /><circle cx={-60} cy={-20} r={70} fill="#1f2937" stroke={INK} strokeWidth={8} /><circle cx={90} cy={0} r={46} fill="#1f2937" stroke={INK} strokeWidth={8} /><path d="M 60 -150 l 0 -60" stroke={INK} strokeWidth={10} /></g>
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${500 + i * 120} ${1300 + (i % 2) * 60 + Math.abs(Math.sin(f / 5 + i)) * -12})`}><ellipse rx={34} ry={22} fill="#1f2937" /><circle cx={28} cy={-14} r={14} fill="#1f2937" /><path d="M 40 -14 l 18 4 l -18 4 Z" fill="#f59e0b" /></g>)}
    {children}
  </g>
);

// lake at golden hour with a little dock
export const Lake: React.FC<{ f: number; sunset?: number; children?: React.ReactNode }> = ({ f, sunset = 0, children }) => (
  <g>
    <defs><linearGradient id="lkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sunset > 0.5 ? "#7c3aed" : "#38bdf8"} /><stop offset="1" stopColor={sunset > 0.5 ? "#fb923c" : "#fef9c3"} /></linearGradient><Soft id="lkSoft" /></defs>
    <rect {...BIG} fill="url(#lkSky)" />
    <circle cx={760} cy={720 + sunset * 140} r={110} fill="#fde047" /><circle cx={760} cy={720 + sunset * 140} r={220} fill="#fde047" opacity={0.3} filter="url(#lkSoft)" />
    <path d="M -900 860 Q -300 700 200 860 Q 700 720 1980 860 L 1980 960 L -900 960 Z" fill="#4d7c0f" />
    <rect x={-900} y={940} width={W + 1800} height={2000} fill={sunset > 0.5 ? "#7c5cbf" : "#3b82f6"} />
    {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={(i * 173 + f * 2) % 1400 - 200} y1={1000 + (i % 8) * 110} x2={(i * 173 + f * 2) % 1400 - 120} y2={1000 + (i % 8) * 110} stroke="#fff" strokeWidth={6} opacity={0.35} strokeLinecap="round" />)}
    <path d="M 680 960 L 840 960 L 820 1500 L 700 1500 Z" fill="#fde047" opacity={0.25} />
    <rect x={-900} y={1230} width={1100} height={60} fill="#92400e" stroke={INK} strokeWidth={8} />
    {[-300, -100, 100].map((x) => <rect key={x} x={x} y={1290} width={34} height={280} fill="#78350f" stroke={INK} strokeWidth={6} />)}
    {children}
  </g>
);

// Bob's living room, slowly filling with free stuff
export const Living: React.FC<{ f: number; dim?: number; children?: React.ReactNode }> = ({ dim = 0, children }) => (
  <g>
    <rect {...BIG} fill="#fbcfe8" />
    {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-300 + i * 100} y={-900} width={40} height={2200} fill="#fff" opacity={0.18} />)}
    <rect x={620} y={300} width={360} height={420} rx={10} fill="#7dd3fc" stroke={INK} strokeWidth={9} /><line x1={800} y1={300} x2={800} y2={720} stroke={INK} strokeWidth={7} /><line x1={620} y1={510} x2={980} y2={510} stroke={INK} strokeWidth={7} />
    <g transform="translate(220 520)"><rect x={-100} y={-120} width={200} height={240} fill="#fde68a" stroke={INK} strokeWidth={8} /><circle cx={0} cy={-20} r={50} fill="#fff" stroke={INK} strokeWidth={6} /><path d="M -40 -40 Q -40 -80 0 -80 Q 40 -80 40 -40 Z" fill="#facc15" /><text y={90} textAnchor="middle" fontFamily="KidsHand" fontSize={40} fill={INK}>ME!</text></g>
    <rect x={-900} y={1280} width={W + 1800} height={1500} fill="#d6a273" />
    {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={540 + (i - 6) * 60} y1={1280} x2={540 + (i - 6) * 300} y2={2400} stroke="#b07a4f" strokeWidth={5} />)}
    {children}
    {dim > 0 && <rect {...BIG} fill="#1e1b4b" opacity={0.35 * dim} />}
  </g>
);

// chalkboard classroom
export const Classroom: React.FC<{ children?: React.ReactNode; board?: React.ReactNode }> = ({ children, board }) => (
  <g>
    <rect {...BIG} fill="#a7f3d0" />
    <rect x={-900} y={1300} width={W + 1800} height={1500} fill="#a16207" />
    <rect x={40} y={260} width={1000} height={720} rx={20} fill="#7c4a2a" stroke={INK} strokeWidth={10} />
    <rect x={70} y={290} width={940} height={660} rx={10} fill="#1f4d3a" />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${120 + i * 300} ${330 + i * 40} q 80 -20 160 10`} stroke="#fff" strokeWidth={4} opacity={0.08} fill="none" />)}
    {board}
    <rect x={60} y={980} width={960} height={26} fill="#a16207" stroke={INK} strokeWidth={6} />
    <rect x={160} y={984} width={60} height={16} fill="#fff" />
    {children}
  </g>
);
