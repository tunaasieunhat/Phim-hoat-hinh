// Style test frames for "6 Types of Students When Spending Money": the Red student + his wallet in four
// directing-stickman-videos B-mode looks (B6 Dynamic Meme, B2 Colorful Hand-Drawn, B5 Character Explainer,
// B1 Minimal Line Art). Same beat in all four: "Bubble tea for everyone! It's on me!", balance top corner,
// video-nguoi-que subtitles (EN pale yellow on top, VI white with black outline below, speaker name tag).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useToonFonts } from "../Toon/Stills";

const W = 1080, H = 1920;
const INK = "#1d1b20";

// subtitles per video-nguoi-que: EN pale yellow above, VI white with black outline below, small name tag
const Subs: React.FC<{ en: string; vi: string; who?: string; tag?: string; box?: string }> = ({ en, vi, who = "Red", tag = "#dc2626", box = "rgba(15,23,42,0.55)" }) => (
  <g fontFamily="ToonSans" fontWeight={800} textAnchor="middle">
    <rect x={40} y={1290} width={1000} height={210} rx={34} fill={box} />
    <g transform="translate(540 1368)"><rect x={-470} y={-38} width={92} height={46} rx={23} fill={tag} /><text x={-424} y={-6} fontSize={28} fill="#fff">{who}</text>
      <text x={40} y={0} fontSize={48} fill="#fde68a" stroke="#111827" strokeWidth={6} paintOrder="stroke fill">{en}</text></g>
    <text x={540} y={1450} fontSize={50} fill="#fff" stroke="#000" strokeWidth={7} paintOrder="stroke fill">{vi}</text>
  </g>
);
const EN = "Bubble tea for everyone! It's on me!", VI = "Trà sữa cả lớp! Mình bao!";
// account balance, counting down (red when low)
const Balance: React.FC<{ v: string; low?: boolean; x?: number; y?: number; font?: string; paper?: boolean }> = ({ v, low, x = 700, y = 120, font = "ToonSans", paper }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-20} y={-56} width={380} height={100} rx={22} fill={paper ? "#fffdf6" : "#111827"} stroke={INK} strokeWidth={paper ? 4 : 0} opacity={paper ? 1 : 0.85} />
    <circle cx={30} cy={-6} r={28} fill="#facc15" stroke={INK} strokeWidth={4} /><text x={30} y={6} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={32} fill={INK}>đ</text>
    <text x={200} y={10} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={42} fill={low ? "#ef4444" : paper ? INK : "#fff"}>{v}</text>
    <text x={330} y={-20} textAnchor="end" fontFamily="ToonSans" fontWeight={800} fontSize={26} fill="#ef4444">▼</text>
  </g>
);

/* ---------- B6 · Dynamic Meme: painted, lumpy heads, grainy brush, warm light, broad world ---------- */
export const StyleMeme: React.FC = () => {
  useToonFonts();
  return (
    <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <filter id="mGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.15  0 0 0 0.16 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
        <filter id="mWob"><feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="7" /></filter>
        <filter id="mBlur"><feGaussianBlur stdDeviation="6" /></filter>
        <radialGradient id="mLight" cx="0.7" cy="0.25" r="0.8"><stop offset="0" stopColor="#ffe9b8" stopOpacity="0.85" /><stop offset="1" stopColor="#ffe9b8" stopOpacity="0" /></radialGradient>
        <radialGradient id="mHead" cx="0.4" cy="0.35" r="0.75"><stop offset="0.55" stopColor="#fbf3ee" /><stop offset="1" stopColor="#e9c9cf" /></radialGradient>
      </defs>
      {/* painted campus café, softly out of focus */}
      <g filter="url(#mBlur)">
        <rect width={W} height={H} fill="#d9b98f" />
        <rect y={0} width={W} height={1150} fill="#c99a6b" />
        <rect x={620} y={180} width={380} height={520} rx={18} fill="#9fc6d8" /><rect x={640} y={200} width={340} height={480} fill="#cfe6ee" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={60 + i * 120} y={330} width={90} height={150} rx={10} fill={["#e7b35a", "#a7c99a", "#e59a8a", "#c8a6d6"][i]} />)}
        <rect x={40} y={480} width={520} height={24} fill="#7a5236" /><rect x={40} y={300} width={520} height={20} fill="#7a5236" />
        <rect y={1150} width={W} height={770} fill="#b88a5d" />
        <ellipse cx={300} cy={1000} rx={200} ry={60} fill="#8f6a4a" /><ellipse cx={860} cy={1050} rx={160} ry={50} fill="#8f6a4a" />
      </g>
      <rect width={W} height={H} fill="url(#mLight)" />
      {/* counter with a wall of bubble teas */}
      <g filter="url(#mWob)">
        <path d="M -20 1090 L 1100 1060 L 1100 1240 L -20 1260 Z" fill="#8a5a3c" stroke={INK} strokeWidth={7} />
        {Array.from({ length: 7 }).map((_, i) => <g key={i} transform={`translate(${590 + (i % 4) * 110} ${1060 - Math.floor(i / 4) * 150})`}><path d="M -36 -130 L 36 -130 L 28 0 L -28 0 Z" fill="#d8b48a" stroke={INK} strokeWidth={5} />{[-12, 6, 16].map((x, k) => <circle key={k} cx={x} cy={-18 - k * 10} r={7} fill={INK} />)}<line x1={8} y1={-130} x2={22} y2={-180} stroke="#e46b8c" strokeWidth={9} strokeLinecap="round" /></g>)}
      </g>
      {/* Red: lumpy painted head, sunglasses, huge grin; heavy single limb strokes */}
      <g filter="url(#mWob)">
        <g stroke={INK} strokeWidth={13} strokeLinecap="round" fill="none"><path d="M 300 1060 L 270 1260" /><path d="M 330 1060 L 360 1260" /><path d="M 260 820 Q 170 760 150 640" /><path d="M 360 820 Q 450 860 520 820" /></g>
        {[[270, 1262], [362, 1262]].map(([x, y], i) => <ellipse key={i} cx={x + 8} cy={y} rx={22} ry={11} fill={INK} />)}
        <circle cx={148} cy={632} r={17} fill={INK} /><circle cx={524} cy={818} r={17} fill={INK} />
        <path d="M 230 790 Q 315 770 395 795 L 380 1075 Q 315 1090 250 1075 Z" fill="#d8453b" stroke={INK} strokeWidth={6} />
        <path d="M 250 800 Q 300 860 260 1060" stroke="#b5312a" strokeWidth={10} fill="none" opacity={0.6} />
        <path d="M 210 610 Q 190 470 300 455 Q 420 445 425 590 Q 432 720 320 735 Q 220 742 210 610 Z" fill="url(#mHead)" stroke={INK} strokeWidth={6} />
        <path d="M 215 560 Q 250 450 330 455 Q 410 455 420 540 Q 360 500 290 520 Q 240 530 215 560 Z" fill="#3a2a24" />
        <path d="M 235 590 L 405 585 L 400 625 Q 360 640 330 610 L 310 610 Q 280 645 240 625 Z" fill="#141217" stroke={INK} strokeWidth={4} />
        <path d="M 255 600 l 30 -6" stroke="#fff" strokeWidth={5} opacity={0.6} />
        <path d="M 250 665 Q 330 735 400 660 Q 330 690 250 665 Z" fill="#fff" stroke={INK} strokeWidth={5} />{[285, 315, 345, 375].map((x) => <line key={x} x1={x} y1={668} x2={x} y2={688} stroke={INK} strokeWidth={3} />)}
        <ellipse cx={240} cy={660} rx={20} ry={11} fill="#e88a95" opacity={0.6} /><ellipse cx={410} cy={655} rx={18} ry={10} fill="#e88a95" opacity={0.6} />
        {/* the card he waves */}
        <g transform="translate(150 610) rotate(-20)"><rect x={-50} y={-34} width={100} height={66} rx={8} fill="#f2c94c" stroke={INK} strokeWidth={5} /><rect x={-50} y={-18} width={100} height={12} fill={INK} /></g>
      </g>
      {/* the wallet: crying already */}
      <g filter="url(#mWob)" transform="translate(560 1150) scale(0.75)">
        <path d="M -120 -90 Q -130 -150 -60 -150 L 110 -150 Q 140 -150 135 -100 L 130 60 Q 128 90 95 90 L -100 90 Q -126 90 -124 60 Z" fill="#8b5a2b" stroke={INK} strokeWidth={6} />
        <path d="M 40 -60 L 140 -60 L 140 10 L 40 10 Z" fill="#a8743f" stroke={INK} strokeWidth={5} /><circle cx={110} cy={-25} r={10} fill="#e0b25b" stroke={INK} strokeWidth={3} />
        <path d="M -80 -70 q 20 -16 40 0 M -20 -70 q 20 -16 40 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M -70 10 Q -40 -20 -10 10" stroke={INK} strokeWidth={7} fill="none" />
        <path d="M -60 -56 q -8 50 -2 80 M 0 -56 q 6 50 0 80" stroke="#7cc4f0" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.9} />
        <path d="M -124 0 Q -170 20 -180 70 M 132 0 Q 170 30 175 75" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
      <rect width={W} height={H} fill="#fff" filter="url(#mGrain)" />
      <Balance v="1,250,000đ" />
      <g fontFamily="ToonSans" fontWeight={800}><text x={70} y={200} fontSize={58} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke fill">DAY 1</text></g>
      <Subs en={EN} vi={VI} />
      <text x={540} y={1840} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill={INK} opacity={0.7}>B6 · Dynamic Meme Animation</text>
    </svg></AbsoluteFill>
  );
};

/* ---------- B2 · Colorful Hand-Drawn: cream paper, thin ink, muted colour, handwritten headline ---------- */
export const StyleHandDrawn: React.FC = () => {
  useToonFonts();
  const ink = "#3b3631";
  return (
    <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs><filter id="hWob"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="2" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter>
        <pattern id="hPaper" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#f4efe4" /><circle cx="2" cy="3" r="0.6" fill="#e6dfcf" /></pattern></defs>
      <rect width={W} height={H} fill="url(#hPaper)" />
      <text x={540} y={250} textAnchor="middle" fontFamily="KidsHand" fontSize={110} fill={ink}>DAY ONE…</text>
      <text x={540} y={370} textAnchor="middle" fontFamily="KidsHand" fontSize={100} fill="#c0634e">A KING.</text>
      <rect x={0} y={1080} width={W} height={840} fill="#d9bf9a" />{Array.from({ length: 9 }).map((_, i) => <line key={i} x1={0} y1={1120 + i * 90} x2={W} y2={1120 + i * 90} stroke="#c7aa82" strokeWidth={3} />)}
      <g filter="url(#hWob)" stroke={ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        {/* bubble teas, muted */}
        {Array.from({ length: 5 }).map((_, i) => <g key={i} transform={`translate(${600 + i * 90} ${1110 - (i % 2) * 20})`}><path d="M -30 -110 L 30 -110 L 24 0 L -24 0 Z" fill="#cfb08a" />{[-8, 6].map((x, k) => <circle key={k} cx={x} cy={-16 - k * 10} r={6} fill={ink} />)}<line x1={6} y1={-110} x2={18} y2={-150} stroke="#c0634e" strokeWidth={7} /></g>)}
        {/* Red: round white head, thin limbs, red sweater, sunglasses */}
        <line x1={300} y1={1000} x2={270} y2={1180} /><line x1={330} y1={1000} x2={360} y2={1180} />
        <path d="M 260 760 Q 200 700 190 620" fill="none" /><path d="M 360 770 Q 430 790 470 760" fill="none" />
        <path d="M 245 750 L 385 750 L 375 1010 L 255 1010 Z" fill="#c75a4c" />
        <circle cx={315} cy={640} r={100} fill="#fffaf2" />
        <path d="M 225 610 Q 240 545 315 540 Q 395 545 405 610 Q 360 585 315 590 Q 260 585 225 610 Z" fill="#5a463b" />
        <rect x={245} y={625} width={60} height={30} rx={10} fill={ink} /><rect x={325} y={625} width={60} height={30} rx={10} fill={ink} /><line x1={305} y1={638} x2={325} y2={638} />
        <path d="M 270 690 Q 315 730 360 690" fill="none" />
        <g transform="translate(190 610) rotate(-15)"><rect x={-40} y={-28} width={80} height={54} rx={6} fill="#e3c26a" /></g>
      </g>
      {/* wallet, sweating */}
      <g filter="url(#hWob)" transform="translate(470 1190) scale(0.8)" stroke={ink} strokeWidth={5} strokeLinejoin="round">
        <rect x={-110} y={-120} width={230} height={180} rx={24} fill="#9a7352" /><rect x={40} y={-70} width={90} height={60} rx={10} fill="#b58a63" />
        <circle cx={-50} cy={-50} r={10} fill={ink} /><circle cx={10} cy={-50} r={10} fill={ink} /><path d="M -45 10 Q -20 -10 5 10" fill="none" />
        <path d="M 60 -130 q 10 16 0 26" stroke="#7aa6c2" strokeWidth={6} fill="none" />
      </g>
      <Balance v="1,250,000đ" font="KidsHand" paper />
      <Subs en={EN} vi={VI} box="rgba(59,54,49,0.5)" />
      <text x={540} y={1840} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill={ink} opacity={0.7}>B2 · Colorful Hand-Drawn</text>
    </svg></AbsoluteFill>
  );
};

/* ---------- B5 · Character Explainer: flat grey stage, anonymous stick actors left, big presenter (the wallet) ---------- */
export const StyleExplainer: React.FC = () => {
  useToonFonts();
  return (
    <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect width={W} height={H} fill="#ebe8e3" />
      <g fontFamily="ToonSans" fontWeight={800}><text x={80} y={330} fontSize={70} fill={INK}>day one:</text><rect x={70} y={355} width={440} height={96} fill="#e0402f" /><text x={92} y={428} fontSize={74} fill="#fff">"it's on me"</text></g>
      {/* left stage: the red student hands out bubble teas to a queue of anonymous stickmen */}
      <line x1={0} y1={1150} x2={1080} y2={1150} stroke={INK} strokeWidth={5} />
      {[0, 1].map((i) => { const x = 490 + i * 140; return <g key={i} stroke={INK} strokeWidth={8} strokeLinecap="round" fill="none"><circle cx={x} cy={830} r={52} fill="#fff" /><circle cx={x - 16} cy={824} r={6} fill={INK} /><circle cx={x + 14} cy={824} r={6} fill={INK} /><path d={`M ${x - 18} 852 q 18 14 36 0`} /><line x1={x} y1={882} x2={x} y2={1010} /><line x1={x} y1={1010} x2={x - 30} y2={1150} /><line x1={x} y1={1010} x2={x + 30} y2={1150} /><line x1={x} y1={920} x2={x - 60} y2={960} /><line x1={x} y1={920} x2={x + 50} y2={990} /><g transform={`translate(${x - 70} 960)`}><path d="M -22 -70 L 22 -70 L 16 0 L -16 0 Z" fill="#e0402f" strokeWidth={5} /></g></g>; })}
      <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none"><circle cx={260} cy={800} r={62} fill="#e0402f" /><path d="M 220 790 L 300 790" strokeWidth={14} /><path d="M 228 830 q 32 26 64 0" /><line x1={260} y1={862} x2={260} y2={1010} /><line x1={260} y1={1010} x2={225} y2={1150} /><line x1={260} y1={1010} x2={295} y2={1150} /><line x1={260} y1={900} x2={360} y2={870} /><line x1={260} y1={900} x2={200} y2={820} /></g>
      <g transform="translate(395 860)" stroke={INK} strokeWidth={5}><path d="M -22 -70 L 22 -70 L 16 0 L -16 0 Z" fill="#e0402f" /></g>
      {/* presenter, bottom right: the wallet, big, shocked */}
      <g transform="translate(880 1010) scale(0.62)">
        <rect x={-210} y={-170} width={420} height={300} rx={46} fill="#e0402f" stroke={INK} strokeWidth={10} />
        <path d="M -210 -60 L 210 -60" stroke={INK} strokeWidth={8} />
        <ellipse cx={-80} cy={-100} rx={48} ry={34} fill="#fff" stroke={INK} strokeWidth={8} /><ellipse cx={70} cy={-100} rx={48} ry={34} fill="#fff" stroke={INK} strokeWidth={8} />
        <circle cx={-70} cy={-96} r={12} fill={INK} /><circle cx={60} cy={-96} r={12} fill={INK} />
        <ellipse cx={-5} cy={30} rx={46} ry={52} fill={INK} /><ellipse cx={-5} cy={50} rx={26} ry={20} fill="#f87171" />
        {[-1, 1].map((sd) => <g key={sd}><line x1={sd * 210} y1={0} x2={sd * 280} y2={-60} stroke={INK} strokeWidth={10} strokeLinecap="round" /><circle cx={sd * 284} cy={-64} r={30} fill="#e0402f" stroke={INK} strokeWidth={8} /></g>)}
      </g>
      <text x={60} y={90} fontFamily="ToonSans" fontWeight={800} fontSize={30} fill="#9ca3af">@yourchannel</text>
      <Balance v="1,250,000đ" />
      <Subs en={EN} vi={VI} />
      <text x={540} y={1840} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill={INK} opacity={0.6}>B5 · Character Explainer</text>
    </svg></AbsoluteFill>
  );
};

/* ---------- B1 · Minimal Line Art: white paper, black hand-drawn lines, one red accent, crayon props ---------- */
export const StyleMinimal: React.FC = () => {
  useToonFonts();
  return (
    <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs><filter id="nWob"><feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="2" seed="5" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
      <rect width={W} height={H} fill="#fdfdfb" />
      <g textAnchor="middle" fontFamily="KidsHand"><text x={540} y={300} fontSize={110} fill={INK}>DAY 1</text><text x={540} y={410} fontSize={110} fill="#e0402f">=</text><text x={540} y={530} fontSize={110} fill={INK}>KING</text></g>
      <path d="M 360 560 Q 540 548 720 560" stroke="#e0402f" strokeWidth={8} fill="none" strokeLinecap="round" />
      <g filter="url(#nWob)" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx={330} cy={760} r={78} fill="#fff" />
        <path d="M 270 750 L 390 750" strokeWidth={14} /><path d="M 290 800 q 40 30 80 0" />
        <line x1={330} y1={838} x2={330} y2={1010} /><line x1={330} y1={1010} x2={290} y2={1170} /><line x1={330} y1={1010} x2={370} y2={1170} />
        <line x1={330} y1={890} x2={230} y2={820} /><line x1={330} y1={890} x2={440} y2={860} />
        <path d="M 230 805 l -6 -40 M 240 810 l 14 -38" />
        {/* wallet, thin and nervous */}
        <rect x={640} y={980} width={210} height={150} rx={20} fill="#fff" /><circle cx={710} cy={1040} r={7} fill={INK} /><circle cx={770} cy={1040} r={7} fill={INK} /><path d="M 715 1085 q 25 -14 50 0" />
        <path d="M 860 990 l 14 -10 M 866 1012 l 18 -4" />
      </g>
      {/* crayon bubble teas: the only colour */}
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${470 + i * 70} ${880 - i * 6}) rotate(${i * 4 - 4})`}><path d="M -24 -80 L 24 -80 L 18 0 L -18 0 Z" fill="#f5d7a8" stroke="#c98a3b" strokeWidth={4} /><circle cx={-4} cy={-14} r={6} fill="#5a3b2a" /><line x1={4} y1={-80} x2={12} y2={-112} stroke="#e0402f" strokeWidth={6} strokeLinecap="round" /></g>)}
      <line x1={120} y1={1172} x2={960} y2={1172} stroke={INK} strokeWidth={4} />
      <Balance v="1,250,000đ" font="KidsHand" paper />
      <Subs en={EN} vi={VI} />
      <text x={540} y={1840} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={40} fill={INK} opacity={0.6}>B1 · Minimal Line Art</text>
    </svg></AbsoluteFill>
  );
};
