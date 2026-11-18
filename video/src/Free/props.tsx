// Props for "What if everything was free?" — flat fills, thick ink, a soft highlight; each its own layer.
import React from "react";
import { INK } from "../Toon/Lily";

export const TV: React.FC<{ s?: number; on?: boolean }> = ({ s = 1, on = true }) => (
  <g transform={`scale(${s})`}><rect x={-130} y={-180} width={260} height={170} rx={16} fill="#1f2937" stroke={INK} strokeWidth={9} /><rect x={-112} y={-164} width={224} height={138} rx={8} fill={on ? "#60a5fa" : "#334155"} />{on && <path d="M -100 -60 L -40 -110 L 10 -70 L 60 -130 L 100 -90 L 100 -30 L -100 -30 Z" fill="#93c5fd" />}<path d="M -40 -10 L -60 20 M 40 -10 L 60 20" stroke={INK} strokeWidth={9} strokeLinecap="round" /></g>
);
export const Car: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = "#ef4444" }) => (
  <g transform={`scale(${s})`}>
    <path d="M -200 -40 L -180 -100 Q -170 -120 -140 -120 L -90 -120 L -50 -180 L 80 -180 L 130 -120 L 180 -110 Q 210 -100 210 -60 L 210 -40 Z" fill={c} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M -40 -168 L 70 -168 L 108 -122 L -76 -122 Z" fill="#bae6fd" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><line x1={14} y1={-168} x2={14} y2={-122} stroke={INK} strokeWidth={6} />
    {[-120, 130].map((x) => <g key={x}><circle cx={x} cy={-36} r={42} fill="#1f2937" stroke={INK} strokeWidth={8} /><circle cx={x} cy={-36} r={16} fill="#cbd5e1" /></g>)}
    <circle cx={200} cy={-84} r={12} fill="#fde047" stroke={INK} strokeWidth={4} />
  </g>
);
export const Horse: React.FC<{ s?: number; chew?: number }> = ({ s = 1, chew = 0 }) => (
  <g transform={`scale(${s})`}>
    {[-90, -50, 60, 100].map((x) => <rect key={x} x={x - 12} y={-130} width={24} height={130} rx={10} fill="#a16207" stroke={INK} strokeWidth={7} />)}
    <ellipse cx={0} cy={-170} rx={140} ry={70} fill="#b45309" stroke={INK} strokeWidth={9} />
    <path d="M 100 -200 L 150 -320 L 210 -300 L 170 -190 Z" fill="#b45309" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <g transform={`translate(190 -320) rotate(${chew * 6})`}><ellipse cx={20} cy={0} rx={70} ry={42} fill="#b45309" stroke={INK} strokeWidth={9} /><circle cx={10} cy={-14} r={9} fill={INK} /><circle cx={70} cy={10} r={6} fill={INK} /><path d={`M 50 ${30 + chew * 8} q 20 6 36 -6`} stroke={INK} strokeWidth={6} fill="none" /><path d="M -30 -30 L -20 -70 L 0 -36 Z" fill="#b45309" stroke={INK} strokeWidth={6} /></g>
    <path d="M 120 -260 Q 100 -200 110 -150" stroke="#3f1d0b" strokeWidth={26} fill="none" strokeLinecap="round" />
    <path d="M -140 -180 Q -200 -150 -180 -80" stroke="#3f1d0b" strokeWidth={20} fill="none" strokeLinecap="round" />
  </g>
);
export const Piano: React.FC<{ s?: number; press?: number }> = ({ s = 1, press = -1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-170} y={-300} width={340} height={230} rx={12} fill="#1f1b2e" stroke={INK} strokeWidth={9} />
    <rect x={-160} y={-290} width={320} height={40} rx={6} fill="#2e2a40" />
    <rect x={-180} y={-80} width={360} height={60} rx={6} fill="#fff" stroke={INK} strokeWidth={7} />
    {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-180 + i * 25.7} y1={-80} x2={-180 + i * 25.7} y2={-20} stroke={INK} strokeWidth={3} />)}
    {Array.from({ length: 13 }).map((_, i) => [0, 1, 3, 4, 5].includes(i % 7) && <rect key={i} x={-180 + i * 25.7 + 17} y={-80} width={16} height={34} fill={INK} />)}
    {press >= 0 && <rect x={-180 + press * 25.7} y={-80} width={25} height={60} fill="#fde047" opacity={0.7} />}
    <rect x={-170} y={-20} width={24} height={110} fill="#1f1b2e" stroke={INK} strokeWidth={6} /><rect x={146} y={-20} width={24} height={110} fill="#1f1b2e" stroke={INK} strokeWidth={6} />
  </g>
);
// shopping cart: kids are drawn as stacked loot above the basket
export const Cart: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}>
    {children}
    <path d="M -160 -170 L 150 -170 L 120 -50 L -130 -50 Z" fill="#cbd5e1" fillOpacity={0.6} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {[-100, -40, 20, 80].map((x) => <line key={x} x1={x} y1={-170} x2={x - 6} y2={-50} stroke={INK} strokeWidth={4} />)}
    <path d="M 150 -170 L 210 -230" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <line x1={-130} y1={-50} x2={-130} y2={-10} stroke={INK} strokeWidth={8} /><line x1={110} y1={-50} x2={110} y2={-10} stroke={INK} strokeWidth={8} />
    {[-120, 100].map((x) => <circle key={x} cx={x} cy={0} r={18} fill="#1f2937" stroke={INK} strokeWidth={6} />)}
  </g>
);
export const Notice: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-260} y={-180} width={520} height={360} rx={10} fill="#fffbeb" stroke={INK} strokeWidth={10} />
    <rect x={-240} y={-160} width={480} height={50} fill="#b91c1c" />
    <text y={-122} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill="#fde68a">ROYAL DECREE</text>
    <text y={-40} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill={INK}>STARTING TODAY:</text>
    <text y={40} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={50} fill="#dc2626">EVERYTHING</text>
    <text y={104} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={50} fill="#dc2626">IS FREE</text>
    <circle cx={190} cy={130} r={36} fill="#dc2626" stroke={INK} strokeWidth={6} /><path d="M 178 120 l 12 -16 l 12 16 l -12 22 Z" fill="#fde68a" />
  </g>
);
export const Cucumber: React.FC<{ s?: number; bite?: number }> = ({ s = 1, bite = 0 }) => (
  <g transform={`scale(${s})`}><path d={`M ${-90 + bite * 120} -20 Q 0 -40 90 -20 Q 110 0 90 20 Q 0 40 ${-90 + bite * 120} 20 ${bite > 0 ? `Q ${-70 + bite * 120} 0 ${-90 + bite * 120} -20` : "Q -110 0 -90 -20"} Z`} fill="#4ade80" stroke={INK} strokeWidth={7} strokeLinejoin="round" />{[-50, -10, 30, 60].map((x) => x > -90 + bite * 120 && <circle key={x} cx={x} cy={-6 + (x % 20 === 0 ? 8 : 0)} r={4} fill="#166534" />)}</g>
);
export const Spider: React.FC<{ s?: number; f: number }> = ({ s = 1, f }) => (
  <g transform={`scale(${s})`}>{[-1, 1].map((sd) => [0, 1, 2, 3].map((i) => <path key={`${sd}${i}`} d={`M 0 0 q ${sd * 30} ${-20 + i * 12} ${sd * (50 + Math.sin(f / 4 + i) * 6)} ${-6 + i * 16}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />))}<circle r={26} fill={INK} /><circle cx={-8} cy={-6} r={6} fill="#fff" /><circle cx={8} cy={-6} r={6} fill="#fff" /></g>
);
export const DollarNo: React.FC<{ s?: number; k: number; kind?: "money" | "bill" | "nothing" }> = ({ s = 1, k, kind = "money" }) => k <= 0.01 ? null : (
  <g transform={`scale(${s * k})`}>
    {kind === "money" ? <g><rect x={-140} y={-80} width={280} height={160} rx={14} fill="#86efac" stroke={INK} strokeWidth={9} /><circle r={52} fill="#bbf7d0" stroke={INK} strokeWidth={6} /><text y={26} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={76} fill="#166534">$</text></g>
      : kind === "bill" ? <g><path d="M -110 -150 L 110 -150 L 110 150 L 90 130 L 70 150 L 50 130 L 30 150 L 10 130 L -10 150 L -30 130 L -50 150 L -70 130 L -90 150 L -110 130 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" /><text y={-90} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill={INK}>BILL</text>{[-40, 0, 40].map((y) => <line key={y} x1={-80} y1={y} x2={80} y2={y} stroke="#94a3b8" strokeWidth={8} />)}<text y={110} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#dc2626">$999</text></g>
        : <circle r={130} fill="none" stroke="#fff" strokeWidth={0} />}
    <circle r={170} fill="none" stroke="#dc2626" strokeWidth={26} /><line x1={-120} y1={120} x2={120} y2={-120} stroke="#dc2626" strokeWidth={26} />
  </g>
);
export const PriceTag: React.FC<{ s?: number; text: string; c?: string }> = ({ s = 1, text, c = "#fde047" }) => (
  <g transform={`scale(${s})`}><path d="M -70 -40 L 60 -40 L 100 0 L 60 40 L -70 40 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" /><circle cx={62} cy={0} r={9} fill="#fff" stroke={INK} strokeWidth={4} /><text x={-6} y={16} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill={INK}>{text}</text></g>
);
export const Shelf3: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><rect x={-120} y={-320} width={16} height={320} fill="#a16207" stroke={INK} strokeWidth={6} /><rect x={104} y={-320} width={16} height={320} fill="#a16207" stroke={INK} strokeWidth={6} />{[-300, -200, -100, -10].map((y) => <rect key={y} x={-120} y={y} width={240} height={20} fill="#ca8a04" stroke={INK} strokeWidth={6} />)}</g>
);
export const Rod: React.FC<{ bob?: number }> = ({ bob = 0 }) => (
  <g><line x1={0} y1={0} x2={260} y2={-200} stroke="#78350f" strokeWidth={9} strokeLinecap="round" /><path d={`M 260 -200 Q 330 -60 ${330} ${160 + bob * 10}`} stroke="#e5e7eb" strokeWidth={3} fill="none" /><circle cx={330} cy={160 + bob * 10} r={12} fill="#ef4444" stroke={INK} strokeWidth={4} /></g>
);
export const StrawHat = ({ r = 112 }: { r?: number }) => (
  <g><ellipse cx={0} cy={-r * 0.62} rx={r * 1.4} ry={r * 0.3} fill="#fde68a" stroke={INK} strokeWidth={r * 0.06} /><path d={`M ${-r * 0.7} ${-r * 0.65} Q ${-r * 0.7} ${-r * 1.35} 0 ${-r * 1.35} Q ${r * 0.7} ${-r * 1.35} ${r * 0.7} ${-r * 0.65} Z`} fill="#fcd34d" stroke={INK} strokeWidth={r * 0.06} /><rect x={-r * 0.7} y={-r * 0.82} width={r * 1.4} height={r * 0.16} fill="#dc2626" /></g>
);
export const ChefCap = ({ r = 112 }: { r?: number }) => (
  <g transform={`translate(0 ${-r * 1.0}) scale(${r / 120})`}><rect x={-60} y={-40} width={120} height={50} rx={8} fill="#fff" stroke={INK} strokeWidth={7} /><path d="M -60 -36 Q -100 -90 -50 -110 Q -30 -160 10 -130 Q 60 -160 70 -100 Q 110 -80 60 -36 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>
);
export const Glasses = ({ r = 112 }: { r?: number }) => (
  <g>{[-1, 1].map((sd) => <circle key={sd} cx={sd * r * 0.34} cy={-r * 0.02} r={r * 0.22} fill="#fff" fillOpacity={0.2} stroke={INK} strokeWidth={r * 0.05} />)}<line x1={-r * 0.12} y1={-r * 0.04} x2={r * 0.12} y2={-r * 0.04} stroke={INK} strokeWidth={r * 0.05} /></g>
);
export const Sweat: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g>{[0, 1].map((i) => { const k = (t * 1.6 + i * 0.5) % 1; return <path key={i} d="M 0 -18 Q 12 0 0 12 Q -12 0 0 -18 Z" transform={`translate(${x + i * 40 * s} ${y + k * 60 * s}) scale(${s * 1.4})`} fill="#7dd3fc" stroke={INK} strokeWidth={3} opacity={1 - k} />; })}</g>
);
