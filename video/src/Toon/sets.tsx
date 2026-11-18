// Painted-look sets for the rainy-day toon (1080 × 1920). Each set is built from separate depth layers —
// outside (sky, city, rain), wall, window, furniture, floor, light, foreground — so the camera can push,
// pan and parallax through them. f = frame (rain, flicker); everything is deterministic per frame.
import React from "react";
import { INK } from "./Lily";

export const W = 1080, H = 1920;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// the view through a window: dusk sky, two rows of city blocks with lit windows, a wet tree, rain
export const Outside: React.FC<{ x: number; y: number; w: number; h: number; f: number; rain?: number; sunny?: number; id: string }> = ({ x, y, w, h, f, rain = 1, sunny = 0, id }) => (
  <g>
    <defs>
      <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sunny > 0.5 ? "#7dd3fc" : "#51627a"} /><stop offset="1" stopColor={sunny > 0.5 ? "#e0f2fe" : "#9aaabb"} /></linearGradient>
      <clipPath id={`win${id}`}><rect x={x} y={y} width={w} height={h} /></clipPath>
    </defs>
    <g clipPath={`url(#win${id})`}>
      <rect x={x} y={y} width={w} height={h} fill={`url(#sky${id})`} />
      {sunny > 0.5 && <circle cx={x + w * 0.78} cy={y + h * 0.2} r={60} fill="#fde047" />}
      {/* heavy clouds */}
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={x + w * (0.1 + i * 0.3) + Math.sin(f / 90 + i) * 12} cy={y + 40 + (i % 2) * 30} rx={150} ry={56} fill={sunny > 0.5 ? "#fff" : "#6b7a8f"} opacity={0.85} />)}
      {/* far blocks */}
      {Array.from({ length: 9 }).map((_, i) => { const bw = 80 + rnd(i) * 60, bh = 180 + rnd(i + 9) * 220, bx = x + i * (w / 8) - 30; return <g key={i}><rect x={bx} y={y + h - bh - 60} width={bw} height={bh + 60} fill={sunny > 0.5 ? "#93c5fd" : "#5c6b80"} />{Array.from({ length: 10 }).map((__, k) => rnd(i * 31 + k) > 0.55 && <rect key={k} x={bx + 12 + (k % 3) * 22} y={y + h - bh - 40 + Math.floor(k / 3) * 34} width={12} height={16} fill="#fde68a" opacity={sunny > 0.5 ? 0.2 : 0.75} />)}</g>; })}
      {/* near blocks */}
      {Array.from({ length: 5 }).map((_, i) => { const bw = 150 + rnd(i + 40) * 60, bh = 120 + rnd(i + 50) * 160, bx = x + i * (w / 4) - 50; return <g key={i}><rect x={bx} y={y + h - bh} width={bw} height={bh} fill={sunny > 0.5 ? "#60a5fa" : "#3d4a5c"} />{Array.from({ length: 8 }).map((__, k) => rnd(i * 17 + k + 3) > 0.45 && <rect key={k} x={bx + 16 + (k % 4) * 34} y={y + h - bh + 20 + Math.floor(k / 4) * 44} width={18} height={24} fill="#fcd34d" opacity={sunny > 0.5 ? 0.25 : 0.9} />)}</g>; })}
      {/* a wet tree on the right */}
      <path d={`M ${x + w * 0.86} ${y + h} L ${x + w * 0.86} ${y + h * 0.55}`} stroke="#2a2a33" strokeWidth={16} />
      {[0, 1, 2].map((i) => <circle key={i} cx={x + w * (0.8 + i * 0.07)} cy={y + h * (0.48 - (i % 2) * 0.06)} r={64} fill={sunny > 0.5 ? "#22c55e" : "#2f4f45"} />)}
      {/* rain: long slanted streaks in two speeds */}
      {rain > 0 && Array.from({ length: 70 }).map((_, i) => { const sp = i % 2 ? 2.2 : 1.5, t = ((f * sp * 0.012 + rnd(i)) % 1); const rx = x + rnd(i + 99) * (w + 80) - 40; const ry = y - 60 + t * (h + 120); return <line key={i} x1={rx} y1={ry} x2={rx - 10} y2={ry + 46} stroke="#dbeafe" strokeWidth={i % 2 ? 3 : 2} opacity={rain * (i % 2 ? 0.75 : 0.45)} strokeLinecap="round" />; })}
      {/* droplets on the glass, some sliding */}
      {rain > 0 && Array.from({ length: 26 }).map((_, i) => { const slide = rnd(i + 7) > 0.7 ? ((f * 0.004 + rnd(i)) % 1) * h * 0.5 : 0; const dx = x + rnd(i + 200) * w, dy = y + rnd(i + 300) * h * 0.8 + slide; return <g key={i} opacity={rain}><circle cx={dx} cy={dy} r={4 + rnd(i) * 6} fill="#e0f2fe" opacity={0.5} /><circle cx={dx - 1.5} cy={dy - 2} r={1.6} fill="#fff" />{slide > 0 && <line x1={dx} y1={dy - 6} x2={dx} y2={dy - 6 - slide * 0.4} stroke="#e0f2fe" strokeWidth={2} opacity={0.35} />}</g>; })}
      {/* cold glass sheen */}
      <path d={`M ${x} ${y + h * 0.15} L ${x + w * 0.3} ${y} L ${x + w * 0.42} ${y} L ${x} ${y + h * 0.36} Z`} fill="#fff" opacity={0.07} />
    </g>
  </g>
);

// cozy rainy-day living room: big rainy window, mustard curtains, sofa + knitted blanket, floor lamp, shelf, rug
export const RainyRoom: React.FC<{ f: number; rain?: number; sunny?: number; lamp?: number; curtain?: number; cloud?: React.ReactNode; children?: React.ReactNode; fg?: boolean }> = ({ f, rain = 1, sunny = 0, lamp = 1, curtain = 1, cloud, children, fg = true }) => {
  const flick = 0.96 + 0.04 * Math.sin(f / 3.7) * Math.sin(f / 5.3);
  return (
    <g>
      <defs>
        <linearGradient id="rrWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#33405a" /><stop offset="0.6" stopColor="#48546e" /><stop offset="1" stopColor="#3a3f55" /></linearGradient>
        <radialGradient id="rrLamp" cx="0.86" cy="0.34" r="0.7"><stop offset="0" stopColor="#ffcf7a" stopOpacity={0.85 * lamp * flick} /><stop offset="0.45" stopColor="#ffb85c" stopOpacity={0.4 * lamp} /><stop offset="1" stopColor="#ffb85c" stopOpacity={0} /></radialGradient>
        <radialGradient id="rrWin" cx="0.5" cy="0.35" r="0.5"><stop offset="0" stopColor="#bcd3ee" stopOpacity={0.35} /><stop offset="1" stopColor="#bcd3ee" stopOpacity={0} /></radialGradient>
        <linearGradient id="rrFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b4a36" /><stop offset="1" stopColor="#3c281e" /></linearGradient>
        <linearGradient id="rrCurt" x1="0" x2="1"><stop offset="0" stopColor="#b7791f" /><stop offset="0.3" stopColor="#e0a43a" /><stop offset="0.55" stopColor="#c58a2a" /><stop offset="0.8" stopColor="#eab04a" /><stop offset="1" stopColor="#a86d1c" /></linearGradient>
        <linearGradient id="rrSofa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f7a78" /><stop offset="1" stopColor="#1d5150" /></linearGradient>
        <radialGradient id="rrVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#0b0a14" stopOpacity={0.6} /></radialGradient>
        <filter id="rrBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="rrSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      {/* wall + faint wallpaper */}
      <rect width={W} height={H} fill="url(#rrWall)" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={i * 80 + 30} y={0} width={14} height={1360} fill="#fff" opacity={0.025} />)}
      {/* picture frames */}
      <g transform="translate(110 360)"><rect x={-70} y={-90} width={140} height={180} rx={6} fill="#c79a6b" stroke={INK} strokeWidth={6} /><rect x={-52} y={-72} width={104} height={144} fill="#f8e7c9" /><circle cx={0} cy={-14} r={26} fill="#f472b6" opacity={0.7} /><path d="M -40 60 Q 0 0 40 60 Z" fill="#60a5fa" opacity={0.7} /></g>
      {/* the window */}
      <rect x={250} y={300} width={580} height={720} rx={16} fill="#5b3a29" stroke={INK} strokeWidth={8} />
      <Outside id="rr" x={276} y={326} w={528} h={668} f={f} rain={rain} sunny={sunny} />
      {cloud && <g clipPath="url(#winrr)">{cloud}</g>}
      <rect x={530} y={326} width={20} height={668} fill="#6d4631" stroke={INK} strokeWidth={5} /><rect x={276} y={650} width={528} height={18} fill="#6d4631" stroke={INK} strokeWidth={5} />
      <rect x={220} y={1010} width={640} height={40} rx={8} fill="#7a5038" stroke={INK} strokeWidth={7} />
      {/* sill: plant, candle with glow, a mug */}
      <g transform="translate(400 1010)"><path d="M -36 0 L -28 -60 L 28 -60 L 36 0 Z" fill="#e2725b" stroke={INK} strokeWidth={6} strokeLinejoin="round" />{[-50, -20, 10, 40].map((a, i) => <path key={i} d={`M 0 -60 Q ${a} -120 ${a * 1.6} ${-150 - (i % 2) * 30}`} stroke="#3f8f4f" strokeWidth={14} fill="none" strokeLinecap="round" />)}</g>
      <g transform="translate(660 1010)"><circle cx={0} cy={-90} r={70} fill="#ffcf7a" opacity={0.25 * flick} filter="url(#rrSoft)" /><rect x={-20} y={-60} width={40} height={60} rx={6} fill="#fef3c7" stroke={INK} strokeWidth={5} /><path d={`M 0 -62 q -12 -18 0 -40 q 12 22 0 40`} fill="#fbbf24" stroke={INK} strokeWidth={3} transform={`scale(${1 + 0.05 * Math.sin(f / 2.3)} 1)`} /></g>
      {/* curtains with folds and a tie-back */}
      <g transform={`translate(140 0) scale(${1 + (1 - curtain) * 1.15} 1) translate(-140 0)`}><path d="M 160 250 L 330 250 Q 300 600 360 820 Q 300 900 330 1200 L 140 1200 Z" fill="url(#rrCurt)" stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>
      <g transform={`translate(940 0) scale(${1 + (1 - curtain) * 1.15} 1) translate(-940 0)`}><path d="M 920 250 L 750 250 Q 780 600 720 820 Q 780 900 750 1200 L 940 1200 Z" fill="url(#rrCurt)" stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>
      {curtain > 0.9 && [[330, 820], [750, 820]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={30} ry={14} fill="#7c2d12" stroke={INK} strokeWidth={5} />)}
      <rect x={120} y={226} width={840} height={26} rx={13} fill="#3b2a20" stroke={INK} strokeWidth={6} />
      <path d="M 130 262 Q 330 330 540 268 Q 750 330 950 262" stroke="#3b2a20" strokeWidth={3} fill="none" />
      {Array.from({ length: 15 }).map((_, i) => { const t = i / 14, bx = 130 + t * 820, by = 262 + Math.abs(Math.sin(t * Math.PI * 2)) * 60 - 4; const on = 0.6 + 0.4 * Math.sin(f / 9 + i * 1.7); return <g key={i}><circle cx={bx} cy={by + 8} r={16} fill="#ffd27f" opacity={0.35 * on} /><circle cx={bx} cy={by + 8} r={7} fill={["#fde68a", "#fbcfe8", "#a5f3fc"][i % 3]} stroke={INK} strokeWidth={2} /></g>; })}
      {/* cool window light on the wall */}
      <rect x={150} y={200} width={780} height={1100} fill="url(#rrWin)" />
      {/* shelf with books, right */}
      <g transform="translate(985 450)"><rect x={-110} y={0} width={220} height={18} fill="#7a5038" stroke={INK} strokeWidth={5} />{[["#ef4444", 26, 100], ["#60a5fa", 22, 88], ["#facc15", 30, 110], ["#34d399", 20, 80]].map(([c, w, h], i) => <rect key={i} x={-96 + i * 34} y={-(h as number)} width={w as number} height={h as number} fill={c as string} stroke={INK} strokeWidth={4} />)}<path d="M 60 0 L 66 -40 L 100 -40 L 106 0 Z" fill="#e2725b" stroke={INK} strokeWidth={4} /><path d="M 83 -40 Q 70 40 50 120 M 83 -40 Q 100 50 90 140" stroke="#3f8f4f" strokeWidth={8} fill="none" strokeLinecap="round" /></g>
      {/* floor with perspective planks */}
      <rect x={0} y={1300} width={W} height={H - 1300} fill="url(#rrFloor)" />
      <rect x={0} y={1290} width={W} height={22} fill="#2a1e17" />
      {Array.from({ length: 13 }).map((_, i) => { const bx = -300 + i * 140; return <line key={i} x1={540 + (bx - 540) * 0.35} y1={1312} x2={bx} y2={H} stroke="#2e1f17" strokeWidth={4} opacity={0.6} />; })}
      {[1420, 1580, 1780].map((y, i) => <line key={i} x1={0} y1={y} x2={W} y2={y} stroke="#2e1f17" strokeWidth={3} opacity={0.35} />)}
      {/* rug */}
      <ellipse cx={540} cy={1560} rx={470} ry={140} fill="#8b5cf6" opacity={0.85} stroke={INK} strokeWidth={7} />
      <ellipse cx={540} cy={1560} rx={380} ry={104} fill="none" stroke="#c4b5fd" strokeWidth={10} strokeDasharray="30 18" />
      <ellipse cx={540} cy={1560} rx={250} ry={66} fill="#a78bfa" opacity={0.7} />
      {/* sofa, left, with knitted blanket and cushions */}
      <g transform="translate(-20 1240)">
        <ellipse cx={230} cy={240} rx={300} ry={30} fill="#000" opacity={0.25} />
        <rect x={-40} y={0} width={520} height={130} rx={40} fill="url(#rrSofa)" stroke={INK} strokeWidth={8} />
        <rect x={-40} y={110} width={540} height={110} rx={30} fill="#2a6b69" stroke={INK} strokeWidth={8} />
        <rect x={430} y={50} width={90} height={180} rx={36} fill="#256260" stroke={INK} strokeWidth={8} />
        <rect x={60} y={-20} width={120} height={110} rx={30} fill="#fbbf24" stroke={INK} strokeWidth={7} transform="rotate(-8 120 30)" />
        <rect x={200} y={-10} width={110} height={100} rx={30} fill="#f472b6" stroke={INK} strokeWidth={7} transform="rotate(6 255 40)" />
        <path d="M 300 100 Q 380 90 430 140 L 450 260 Q 380 280 330 250 Z" fill="#a78bfa" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${320 + i * 30} ${130 + i * 6} l 10 120`} stroke="#c4b5fd" strokeWidth={6} />)}
        {[10, 450].map((lx) => <rect key={lx} x={lx} y={220} width={18} height={40} fill="#3b2a20" />)}
      </g>
      {/* floor lamp, right, and its warm pool */}
      <g transform="translate(930 1300)">
        <ellipse cx={0} cy={0} rx={80} ry={14} fill="#1f1b18" />
        <line x1={0} y1={0} x2={0} y2={-560} stroke="#2a2420" strokeWidth={12} />
        <path d="M -90 -560 L 90 -560 L 60 -680 L -60 -680 Z" fill="#fde68a" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M -90 -560 L 90 -560" stroke="#fff7d6" strokeWidth={6} opacity={lamp} />
        <ellipse cx={0} cy={-600} rx={150} ry={110} fill="#ffd27f" opacity={0.45 * lamp * flick} filter="url(#rrSoft)" />
        <path d="M -70 -556 L -200 -60 L 200 -60 L 70 -556 Z" fill="#ffd27f" opacity={0.08 * lamp} />
      </g>
      <rect width={W} height={H} fill="url(#rrLamp)" style={{ mixBlendMode: "screen" }} />
      <ellipse cx={900} cy={1330} rx={240} ry={50} fill="#ffcf7a" opacity={0.18 * lamp} filter="url(#rrSoft)" />
      {children}
      {/* foreground: an out-of-focus monstera leaf and armchair edge — depth */}
      {fg && <g filter="url(#rrBlur)">
        <path d="M 1100 1950 Q 900 1700 980 1480 Q 1060 1560 1110 1620 Z" fill="#14532d" opacity={0.95} />
        <path d="M 1120 1880 Q 860 1840 820 1640 Q 960 1660 1100 1720 Z" fill="#166534" opacity={0.9} />
      </g>}
      <rect width={W} height={H} fill="url(#rrVig)" />
    </g>
  );
};

// top-down desk: wood grain, rain-shadow from the window drifting across it
export const Desk: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <g>
    <defs><linearGradient id="dkW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9a6a45" /><stop offset="1" stopColor="#6e4630" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#dkW)" />
    {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M 0 ${i * 90 + 20} Q 300 ${i * 90 + 40 + Math.sin(i) * 20} 600 ${i * 90 + 18} T 1080 ${i * 90 + 30}`} stroke="#5b3a26" strokeWidth={3} fill="none" opacity={0.35} />)}
    {/* cool window light with sliding raindrop shadows */}
    <path d="M 0 0 L 760 0 L 1080 520 L 1080 1500 L 0 900 Z" fill="#c7dcf5" opacity={0.18} />
    {Array.from({ length: 30 }).map((_, i) => { const y0 = (rnd(i) * 1500 + f * (1 + rnd(i + 5) * 2)) % 1500; return <ellipse key={i} cx={rnd(i + 40) * 900} cy={y0} rx={8 + rnd(i) * 8} ry={12 + rnd(i) * 10} fill="#2b2f3a" opacity={0.12} />; })}
    {children}
  </g>
);
