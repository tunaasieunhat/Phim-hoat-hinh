// Sets for "What if everything was free?" — Gus's corner shop (layered: wall, back shelves, window+street, counter,
// floor, ceiling lamps, foreground). stock 1 = full shelves, 0 = empty; noShelves removes even the shelves.
import React from "react";
import { INK } from "../Toon/Lily";
export const W = 1080, H = 1920;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const ITEM = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6", "#f97316"];

const Shelf: React.FC<{ x: number; y: number; w: number; stock: number; seed: number; gone?: boolean }> = ({ x, y, w, stock, seed, gone }) => gone ? null : (
  <g>
    {[0, 1, 2, 3].map((row) => {
      const yy = y + row * 150;
      const n = Math.floor(w / 46);
      return <g key={row}>
        {Array.from({ length: n }).map((_, i) => { const k = seed * 40 + row * 13 + i; if (rnd(k + 3) > stock) return null; const c = ITEM[Math.floor(rnd(k) * 8)]; const h = 70 + rnd(k + 1) * 50; const t = rnd(k + 2);
          return t < 0.4 ? <g key={i}><rect x={x + 10 + i * 46} y={yy - h} width={38} height={h} rx={5} fill={c} stroke={INK} strokeWidth={4} /><rect x={x + 16 + i * 46} y={yy - h * 0.7} width={26} height={h * 0.3} fill="#fff" opacity={0.7} /></g>
            : t < 0.75 ? <g key={i}><rect x={x + 18 + i * 46} y={yy - h} width={22} height={h} rx={9} fill={c} stroke={INK} strokeWidth={4} /><rect x={x + 22 + i * 46} y={yy - h - 14} width={14} height={16} fill="#e5e7eb" stroke={INK} strokeWidth={3} /></g>
            : <g key={i}><ellipse cx={x + 29 + i * 46} cy={yy - 26} rx={21} ry={26} fill={c} stroke={INK} strokeWidth={4} /><path d={`M ${x + 29 + i * 46} ${yy - 52} q 6 -10 14 -8`} stroke="#166534" strokeWidth={4} fill="none" /></g>; })}
        <rect x={x} y={yy} width={w} height={22} fill="#a16207" stroke={INK} strokeWidth={6} />
        <rect x={x + w * 0.4} y={yy + 22} width={52} height={22} fill="#fde047" stroke={INK} strokeWidth={3} />
      </g>;
    })}
    <rect x={x - 12} y={y - 180} width={16} height={650} fill="#854d0e" stroke={INK} strokeWidth={5} /><rect x={x + w - 4} y={y - 180} width={16} height={650} fill="#854d0e" stroke={INK} strokeWidth={5} />
  </g>
);

// the shop seen from inside: back wall with shelves, big window + door onto a sunny street on the right
export const Shop: React.FC<{ f: number; stock?: number; noShelves?: boolean; lights?: number; closed?: boolean; web?: number; behind?: React.ReactNode; children?: React.ReactNode; fg?: React.ReactNode }> = ({ f, stock = 1, noShelves, lights = 1, closed, web = 0, behind, children, fg }) => (
  <g>
    <defs>
      <linearGradient id="spWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fcd9a8" /><stop offset="1" stopColor="#f2b880" /></linearGradient>
      <linearGradient id="spFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfd8e3" /><stop offset="1" stopColor="#8fa0b5" /></linearGradient>
      <radialGradient id="spLamp" cx="0.5" cy="0" r="0.6"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.6 * lights} /><stop offset="1" stopColor="#fff3c4" stopOpacity={0} /></radialGradient>
      <filter id="spBlur"><feGaussianBlur stdDeviation="12" /></filter>
    </defs>
    <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill="url(#spWall)" />
    {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-400 + i * 100} y={0} width={50} height={1240} fill="#fff" opacity={0.07} />)}
    {/* shop sign */}
    <g transform="translate(330 170) rotate(-2)"><rect x={-240} y={-60} width={480} height={120} rx={20} fill="#7c2d12" stroke={INK} strokeWidth={9} /><text y={24} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={70} fill="#fde68a">GUS'S SHOP</text></g>
    {/* back shelves */}
    <Shelf x={40} y={480} w={520} stock={stock} seed={1} gone={noShelves} />
    {noShelves && [60, 560].map((x) => <rect key={x} x={x - 30} y={300} width={40} height={650} fill="#e8a76c" opacity={0.6} />)}
    {/* window + door onto the street */}
    <g>
      <rect x={640} y={300} width={420} height={640} rx={10} fill="#6b3f2a" stroke={INK} strokeWidth={9} />
      <clipPath id="spWin"><rect x={660} y={320} width={380} height={600} /></clipPath>
      <g clipPath="url(#spWin)">
        <rect x={660} y={320} width={380} height={600} fill="#93c5fd" />
        <circle cx={980} cy={380} r={50} fill="#fde047" />
        {[0, 1, 2].map((i) => <rect key={i} x={660 + i * 140} y={560 - i * 40} width={120} height={400} fill={["#fca5a5", "#c4b5fd", "#86efac"][i]} stroke={INK} strokeWidth={5} />)}
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={680 + (i % 3) * 140 + 20} y={600 + Math.floor(i / 3) * 80 - (i % 3) * 40} width={30} height={40} fill="#fff" opacity={0.8} stroke={INK} strokeWidth={3} />)}
        <rect x={660} y={860} width={380} height={60} fill="#9ca3af" />
      </g>
      <line x1={850} y1={320} x2={850} y2={920} stroke={INK} strokeWidth={7} />
      <g transform="translate(850 620) rotate(-4)"><rect x={-110} y={-44} width={220} height={88} rx={10} fill={closed ? "#ef4444" : "#22c55e"} stroke={INK} strokeWidth={7} /><text y={18} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={52} fill="#fff">{closed ? "CLOSED" : "OPEN"}</text></g>
      <path d="M 640 300 L 1060 300 L 1080 240 L 620 240 Z" fill="#ef4444" stroke={INK} strokeWidth={7} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={630 + i * 75} y={240} width={38} height={60} fill="#fff" opacity={0.85} />)}
    </g>
    {/* floor tiles in perspective */}
    <rect x={-800} y={1240} width={W + 1600} height={H} fill="url(#spFloor)" />
    {Array.from({ length: 14 }).map((_, i) => { const bx = -500 + i * 160; return <line key={i} x1={540 + (bx - 540) * 0.3} y1={1240} x2={bx} y2={H + 200} stroke="#7b8ba1" strokeWidth={4} />; })}
    {[1320, 1440, 1620, 1880].map((y) => <line key={y} x1={-800} y1={y} x2={W + 800} y2={y} stroke="#7b8ba1" strokeWidth={4} />)}
    {/* sunbeam from the window across the floor */}
    <path d="M 660 920 L 1040 920 L 1300 1920 L 300 1920 Z" fill="#fff7d6" opacity={0.22 * lights} />
    {behind}
    {/* counter with the cash register */}
    <g transform="translate(330 1240)">
      <rect x={-300} y={-190} width={600} height={190} rx={10} fill="#b45309" stroke={INK} strokeWidth={9} />
      <rect x={-320} y={-214} width={640} height={34} rx={8} fill="#d97706" stroke={INK} strokeWidth={8} />
      {[-200, 0, 200].map((x) => <rect key={x} x={x - 80} y={-160} width={160} height={130} rx={8} fill="#c2650a" stroke={INK} strokeWidth={5} />)}
      <g transform="translate(170 -214)"><rect x={-90} y={-120} width={180} height={120} rx={12} fill="#475569" stroke={INK} strokeWidth={8} /><rect x={-70} y={-170} width={140} height={60} rx={8} fill="#1e293b" stroke={INK} strokeWidth={7} /><text y={-128} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={36} fill="#4ade80">$0.00</text>{[0, 1, 2].map((i) => <rect key={i} x={-60 + i * 44} y={-90} width={32} height={22} rx={5} fill="#e2e8f0" stroke={INK} strokeWidth={3} />)}</g>
      <g transform="translate(-160 -214)"><path d="M -60 0 L -44 -70 L 44 -70 L 60 0 Z" fill="#fde68a" stroke={INK} strokeWidth={6} />{[-24, 0, 24].map((x, i) => <circle key={i} cx={x} cy={-80} r={18} fill={["#ef4444", "#f97316", "#22c55e"][i]} stroke={INK} strokeWidth={4} />)}</g>
    </g>
    {/* hanging lamps */}
    {[200, 520].map((x, i) => <g key={x}><line x1={x} y1={-50} x2={x} y2={60} stroke={INK} strokeWidth={6} /><path d={`M ${x - 60} 110 Q ${x} 40 ${x + 60} 110 Z`} fill="#065f46" stroke={INK} strokeWidth={7} /><ellipse cx={x} cy={112} rx={26} ry={10} fill={lights > 0.5 ? "#fff7d6" : "#64748b"} /><rect x={x - 340} y={110} width={680} height={1100} fill="url(#spLamp)" opacity={0.6 + 0.05 * Math.sin(f / 7 + i)} /></g>)}
    {web > 0 && <g opacity={web} stroke="#e5e7eb" strokeWidth={3} fill="none">{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={300} y1={600} x2={300 + Math.cos(i) * 220} y2={600 + Math.sin(i) * 220} />)}{[60, 120, 180].map((r) => <circle key={r} cx={300} cy={600} r={r} />)}<circle cx={300} cy={640} r={14} fill={INK} /></g>}
    {children}
    {fg}
    <radialGradient id="spVig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#2a1a10" stopOpacity={0.45} /></radialGradient>
    <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill="url(#spVig)" />
  </g>
);
export { rnd };
