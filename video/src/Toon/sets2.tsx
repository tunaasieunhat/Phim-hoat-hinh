// More sets for the rainy-day toon: Lily's bedroom (day / night / messy), the kitchen, the house at night.
import React from "react";
import { INK } from "./Lily";
import { H, Outside, W } from "./sets";

const Soft = ({ id, d = 40 }: { id: string; d?: number }) => <filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={d} /></filter>;

// Lily's bedroom: rainy window right, bed left, posters, shelf with plushies, a door on the far right
export const Bedroom: React.FC<{ f: number; night?: number; mess?: number; lamp?: number; rain?: number; door?: number; children?: React.ReactNode }> = ({ f, night = 0, mess = 0, lamp = 1, rain = 1, door = 0, children }) => {
  const N = night > 0.5;
  return (
    <g>
      <defs>
        <linearGradient id="brWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={N ? "#1e2346" : "#8fa3c7"} /><stop offset="1" stopColor={N ? "#2a2f5a" : "#7186ad"} /></linearGradient>
        <radialGradient id="brLamp" cx="0.22" cy="0.55" r="0.55"><stop offset="0" stopColor="#ffcf7a" stopOpacity={(N ? 0.75 : 0.35) * lamp} /><stop offset="1" stopColor="#ffcf7a" stopOpacity={0} /></radialGradient>
        <Soft id="brSoft" />
      </defs>
      <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill="url(#brWall)" />
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 137) % 1080} cy={80 + ((i * 89) % 1180)} r={5} fill="#fff" opacity={N ? 0.05 : 0.12} />)}
      {/* posters */}
      <g transform="translate(150 420) rotate(-4)"><rect x={-90} y={-120} width={180} height={240} fill="#fbcfe8" stroke={INK} strokeWidth={7} /><circle cx={0} cy={-30} r={50} fill="#f472b6" /><text y={80} textAnchor="middle" fontFamily="KidsHand" fontSize={40} fill={INK}>CHILL</text></g>
      <g transform="translate(400 380) rotate(3)"><rect x={-70} y={-90} width={140} height={180} fill="#bbf7d0" stroke={INK} strokeWidth={7} /><path d="M -40 50 L 0 -50 L 40 50 Z" fill="#16a34a" /></g>
      {/* window */}
      <rect x={560} y={330} width={380} height={520} rx={14} fill="#5b3a29" stroke={INK} strokeWidth={8} />
      <Outside id="br" x={582} y={352} w={336} h={476} f={f} rain={rain} />
      {N && <rect x={582} y={352} width={336} height={476} fill="#0b1026" opacity={0.55} />}
      <rect x={740} y={352} width={18} height={476} fill="#6d4631" stroke={INK} strokeWidth={5} /><rect x={540} y={840} width={420} height={30} rx={8} fill="#7a5038" stroke={INK} strokeWidth={6} />
      {/* shelf with plushies */}
      <g transform="translate(300 700)"><rect x={-170} y={0} width={340} height={20} fill="#7a5038" stroke={INK} strokeWidth={6} /><circle cx={-110} cy={-40} r={40} fill="#fde68a" stroke={INK} strokeWidth={6} /><circle cx={-130} cy={-74} r={14} fill="#fde68a" stroke={INK} strokeWidth={5} /><circle cx={-90} cy={-74} r={14} fill="#fde68a" stroke={INK} strokeWidth={5} /><rect x={-20} y={-90} width={40} height={90} fill="#60a5fa" stroke={INK} strokeWidth={5} /><rect x={30} y={-70} width={36} height={70} fill="#ef4444" stroke={INK} strokeWidth={5} /><path d="M 100 0 L 110 -50 L 140 -50 L 150 0 Z" fill="#e2725b" stroke={INK} strokeWidth={5} /><path d="M 125 -50 Q 110 -100 90 -110 M 125 -50 Q 140 -110 160 -100" stroke="#3f8f4f" strokeWidth={9} fill="none" strokeLinecap="round" /></g>
      {/* door, far right */}
      <rect x={960} y={640} width={160} height={640} fill={N ? "#1a1830" : "#3b2a20"} />
      <g transform={`translate(960 640) scale(${1 - door * 0.85} 1)`}><rect x={0} y={0} width={160} height={640} fill="#b07a4f" stroke={INK} strokeWidth={8} /><circle cx={130} cy={340} r={12} fill="#fde047" stroke={INK} strokeWidth={4} /></g>
      {/* floor */}
      <rect x={-800} y={1280} width={W + 1600} height={H} fill={N ? "#2b2140" : "#a1785a"} />
      {Array.from({ length: 12 }).map((_, i) => { const bx = -300 + i * 150; return <line key={i} x1={540 + (bx - 540) * 0.35} y1={1290} x2={bx} y2={H} stroke={N ? "#1e1730" : "#7e5a41"} strokeWidth={4} opacity={0.6} />; })}
      <ellipse cx={600} cy={1580} rx={420} ry={120} fill={N ? "#3b2f6b" : "#f9a8d4"} opacity={0.9} stroke={INK} strokeWidth={7} />
      {/* bed */}
      <g transform="translate(0 1060)">
        <rect x={-40} y={-200} width={70} height={420} rx={14} fill="#8b6b4a" stroke={INK} strokeWidth={7} />
        <rect x={-20} y={60} width={480} height={150} rx={20} fill="#e2e8f0" stroke={INK} strokeWidth={8} />
        <rect x={20} y={-10} width={170} height={90} rx={36} fill="#fff" stroke={INK} strokeWidth={7} />
        <path d="M 170 40 Q 330 10 470 60 L 470 200 L 150 200 Z" fill="#f472b6" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {[220, 300, 380].map((x) => <circle key={x} cx={x} cy={110} r={10} fill="#fbcfe8" />)}
        <line x1={20} y1={210} x2={20} y2={280} stroke={INK} strokeWidth={14} /><line x1={440} y1={210} x2={440} y2={280} stroke={INK} strokeWidth={14} />
      </g>
      {/* nightstand + lamp */}
      <g transform="translate(560 1340)"><rect x={-70} y={-130} width={140} height={130} rx={10} fill="#c79a6b" stroke={INK} strokeWidth={7} /><line x1={0} y1={-130} x2={0} y2={-230} stroke={INK} strokeWidth={10} /><path d="M -60 -230 L 60 -230 L 40 -310 L -40 -310 Z" fill="#fde68a" stroke={INK} strokeWidth={7} strokeLinejoin="round" />{lamp > 0.5 && <ellipse cx={0} cy={-260} rx={140} ry={110} fill="#ffd27f" opacity={0.4} filter="url(#brSoft)" />}</g>
      {/* mess: clothes, books and toys on the floor */}
      {mess > 0 && [[160, 1440, "#60a5fa", -20], [420, 1520, "#facc15", 15], [760, 1480, "#34d399", -8], [900, 1640, "#f87171", 22], [260, 1700, "#a78bfa", 8], [640, 1760, "#fb923c", -14], [80, 1600, "#f472b6", 30], [980, 1420, "#94a3b8", -30], [500, 1380, "#22d3ee", 5], [820, 1800, "#fde047", -20]].map(([x, y, c, r], i) => i >= mess * 10 ? null : (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>{i % 3 === 0 ? <path d="M -70 0 L -50 -54 L 0 -40 L 50 -60 L 70 0 Z" fill={c as string} stroke={INK} strokeWidth={6} strokeLinejoin="round" /> : i % 3 === 1 ? <rect x={-48} y={-60} width={96} height={60} rx={6} fill={c as string} stroke={INK} strokeWidth={6} /> : <ellipse cx={0} cy={-20} rx={60} ry={22} fill={c as string} stroke={INK} strokeWidth={6} />}</g>
      ))}
      <rect width={W} height={H} fill="url(#brLamp)" />
      {N && <rect width={W} height={H} fill="#0b1026" opacity={0.25 * (1 - lamp)} />}
      {children}
    </g>
  );
};

// the kitchen: backsplash tiles, rainy window over the sink, fridge, stove, hanging pans; counter top at y = 1250
export const Kitchen: React.FC<{ f: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ f, children, front }) => (
  <g>
    <defs><linearGradient id="kWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f5e1c4" /><stop offset="1" stopColor="#e8c9a0" /></linearGradient><Soft id="kSoft" /></defs>
    <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill="url(#kWall)" />
    {/* upper cabinets */}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={20 + i * 260} y={160} width={240} height={300} rx={12} fill="#7dd3c0" stroke={INK} strokeWidth={8} />)}
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={220 + i * 260} cy={420} r={10} fill="#fde047" stroke={INK} strokeWidth={4} />)}
    {/* window */}
    <rect x={330} y={520} width={420} height={420} rx={14} fill="#5b3a29" stroke={INK} strokeWidth={8} />
    <Outside id="kt" x={352} y={542} w={376} h={376} f={f} />
    <rect x={530} y={542} width={16} height={376} fill="#6d4631" stroke={INK} strokeWidth={4} />
    {/* tiles */}
    {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={(i % 9) * 120} y={960 + Math.floor(i / 9) * 140} width={120} height={140} fill="none" stroke="#d4b48c" strokeWidth={4} />)}
    {/* hanging pans */}
    <line x1={800} y1={520} x2={1040} y2={520} stroke="#57534e" strokeWidth={10} />
    {[840, 920, 1000].map((x, i) => <g key={x} transform={`translate(${x} 520) rotate(${Math.sin(f / 30 + i) * 3})`}><line x1={0} y1={0} x2={0} y2={40} stroke={INK} strokeWidth={6} /><circle cx={0} cy={40 + 40 + i * 6} r={38 + i * 6} fill="#78716c" stroke={INK} strokeWidth={7} /></g>)}
    {/* fridge */}
    <g transform="translate(150 560)"><rect x={-130} y={0} width={260} height={700} rx={30} fill="#f1f5f9" stroke={INK} strokeWidth={9} /><line x1={-130} y1={250} x2={130} y2={250} stroke={INK} strokeWidth={7} /><rect x={90} y={80} width={14} height={120} rx={6} fill="#94a3b8" /><rect x={90} y={300} width={14} height={160} rx={6} fill="#94a3b8" />{[["#f472b6", -60, 120], ["#facc15", -10, 160], ["#60a5fa", -70, 360]].map(([c, x, y], i) => <circle key={i} cx={x as number} cy={y as number} r={16} fill={c as string} stroke={INK} strokeWidth={4} />)}</g>
    <ellipse cx={820} cy={760} rx={260} ry={200} fill="#ffe7b0" opacity={0.25} filter="url(#kSoft)" />
    {children}
    {/* counter in front */}
    <rect x={-20} y={1250} width={1120} height={50} rx={10} fill="#f8fafc" stroke={INK} strokeWidth={8} />
    <rect x={-800} y={1300} width={W + 1600} height={H} fill="#5eaa98" stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={30 + i * 262} y={1340} width={236} height={360} rx={14} fill="#6fbfab" stroke={INK} strokeWidth={7} /><rect x={130 + i * 262} y={1380} width={40} height={12} rx={6} fill="#fde047" stroke={INK} strokeWidth={3} /></g>)}
    {front}
  </g>
);

// the house at night in the rain, one warm window lit
export const NightHouse: React.FC<{ f: number; lit?: number }> = ({ f, lit = 1 }) => (
  <g>
    <defs><linearGradient id="nhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f1430" /><stop offset="1" stopColor="#2b3263" /></linearGradient><Soft id="nhSoft" d={30} /></defs>
    <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill="url(#nhSky)" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={200 + i * 340 + Math.sin(f / 60 + i) * 20} cy={240 + (i % 2) * 60} rx={260} ry={80} fill="#3a4170" opacity={0.8} />)}
    <rect x={-800} y={1500} width={W + 1600} height={1200} fill="#1b1f3b" />
    <path d="M 160 1500 L 160 900 L 540 620 L 920 900 L 920 1500 Z" fill="#c2847a" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <path d="M 110 930 L 540 580 L 970 930" fill="none" stroke="#5b2a2a" strokeWidth={44} strokeLinejoin="round" />
    <rect x={250} y={1080} width={200} height={220} fill="#334155" stroke={INK} strokeWidth={8} />
    <rect x={630} y={1080} width={200} height={220} fill={lit > 0.5 ? "#ffd27f" : "#334155"} stroke={INK} strokeWidth={8} />
    {lit > 0.5 && <ellipse cx={730} cy={1190} rx={200} ry={170} fill="#ffd27f" opacity={0.45} filter="url(#nhSoft)" />}
    <line x1={730} y1={1080} x2={730} y2={1300} stroke={INK} strokeWidth={6} /><line x1={630} y1={1190} x2={830} y2={1190} stroke={INK} strokeWidth={6} />
    <rect x={470} y={1300} width={140} height={200} fill="#6b3f2a" stroke={INK} strokeWidth={8} />
    <g transform="translate(990 1500)"><line x1={0} y1={0} x2={0} y2={-420} stroke="#111" strokeWidth={14} /><circle cx={0} cy={-430} r={26} fill="#fde68a" /><ellipse cx={0} cy={-380} rx={150} ry={240} fill="#fde68a" opacity={0.12} /></g>
    {Array.from({ length: 90 }).map((_, i) => { const t = ((f * 0.03 + ((i * 0.618) % 1)) % 1); const x = ((i * 97) % 1120) - 20; return <line key={i} x1={x} y1={-60 + t * 2000} x2={x - 10} y2={-14 + t * 2000} stroke="#9fb4e8" strokeWidth={3} opacity={0.55} />; })}
    {Array.from({ length: 10 }).map((_, i) => { const t = ((f * 0.04 + i * 0.1) % 1); return <ellipse key={i} cx={(i * 113) % 1080} cy={1560 + (i % 3) * 90} rx={20 + t * 40} ry={5 + t * 8} fill="none" stroke="#9fb4e8" strokeWidth={3} opacity={1 - t} />; })}
  </g>
);
