// Vertical 9:16 cover (1080x1920) for "A Day in the Life: Grown-ups vs. Kids": Dad above (cool, tired), Mia below (warm, joyful).
import React from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";
import { BLUE, DAD, Figure, INK, joints, ORANGE, P } from "./rig";
import { Cloud, Heart, Phone, RabbitCloud, Star } from "./stage";

const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading cover fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("KidsSans", `url(${staticFile("fonts/be-vietnam-pro-latin-800-normal.woff2")}) format("woff2")`, { weight: "800" }),
    new FontFace("KidsSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-800-normal.woff2")}) format("woff2")`, { weight: "800", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const W = 1080, H = 1920, SPLIT = 1010;
const F = 40; // a frame number for the rig's idle details (eyes open, no blink)

export const KidsThumbnail: React.FC = () => {
  const dadPose = P({ lean: 10, tilt: 14, aL: [-36, -128], aR: [40, 70], lL: [-8, -2], lR: [10, 4] });
  const dj = joints("dad", 560, 900, 1.55, dadPose);
  const miaPose = P({ aL: [-96, -140], aR: [96, 140], lL: [-40, 20], lR: [36, -24], dy: -10 });
  const outline = { stroke: INK, strokeWidth: 14, paintOrder: "stroke fill" as const, strokeLinejoin: "round" as const };
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="cool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d4e2" /><stop offset="1" stopColor="#e8eef5" /></linearGradient>
          <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3d6" /><stop offset="1" stopColor="#ffd98a" /></linearGradient>
        </defs>
        {/* top: the grown-up's day */}
        <rect width={W} height={SPLIT} fill="url(#cool)" />
        <line x1={60} y1={900} x2={W - 60} y2={900} stroke="#9aa6b5" strokeWidth={6} strokeLinecap="round" />
        <Cloud x={560} y={150} s={1.7} fill="#6b7280" stroke={INK} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={420 + i * 80} y1={250 + (i % 2) * 30} x2={410 + i * 80} y2={292 + (i % 2) * 30} stroke="#60a5fa" strokeWidth={8} strokeLinecap="round" />)}
        <g transform="translate(870 300)">
          <circle r={92} fill="#fff" stroke={INK} strokeWidth={8} />
          <line x1={0} y1={0} x2={0} y2={-62} stroke={INK} strokeWidth={8} strokeLinecap="round" transform="rotate(20)" />
          <line x1={0} y1={0} x2={40} y2={0} stroke={INK} strokeWidth={9} strokeLinecap="round" transform="rotate(-30)" />
          <text x={0} y={150} textAnchor="middle" fontFamily="KidsHand" fontSize={56} fill="#ef4444">−1 min</text>
        </g>
        {[[160, 420, -12], [230, 560, 8], [130, 690, -4]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(1.6)`}>
            <rect x={-28} y={-19} width={56} height={38} rx={5} fill="#fff" stroke={INK} strokeWidth={4} />
            <path d="M -28 -17 L 0 6 L 28 -17" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <circle cx={26} cy={-18} r={9} fill="#ef4444" />
          </g>
        ))}
        <Figure kind="dad" x={560} y={900} s={1.55} pose={dadPose} f={F} face={{ eyes: "tired", mouth: "wavy", brows: "worried", look: -0.9 }} />
        <Phone x={dj.handL[0] - 2} y={dj.handL[1] - 14} s={1.5} rot={-14} />

        {/* bottom: the kid's day */}
        <rect y={SPLIT} width={W} height={H - SPLIT} fill="url(#warm)" />
        <line x1={60} y1={1800} x2={W - 60} y2={1800} stroke="#d4a24c" strokeWidth={6} strokeLinecap="round" />
        <RabbitCloud x={790} y={1400} s={1.2} />
        <Figure kind="mia" x={400} y={1740} s={1.2} pose={miaPose} f={F} face={{ eyes: "happy", mouth: "grin" }} />
        {[[180, 1300, 1.9, "#fbbf24"], [650, 1240, 1.4, "#f472b6"], [940, 1560, 1.7, "#fbbf24"], [140, 1640, 1.2, "#f472b6"], [700, 1700, 1.3, "#60a5fa"]].map(([x, y, s, c], i) => <Star key={i} x={x as number} y={y as number} s={s as number} fill={c as string} rot={i * 20} />)}
        <Heart x={760} y={1720} s={1.6} fill="#fb7185" />
        {[[880, 1770], [960, 1750]].map(([x, y], i) => <text key={i} x={x} y={y} fontFamily="KidsHand" fontSize={90 - i * 20} fill={ORANGE} stroke={INK} strokeWidth={2} transform={`rotate(${-10 + i * 18} ${x} ${y})`}>?</text>)}

        {/* the title band across the split */}
        <g transform="translate(540 1010) rotate(-3)">
          <rect x={-470} y={-215} width={940} height={430} rx={40} fill="#fff" stroke={INK} strokeWidth={10} />
          <text x={0} y={-60} textAnchor="middle" fontFamily="KidsHand" fontSize={170} fill={DAD}>GROWN-UPS</text>
          <text x={-40} y={80} textAnchor="end" fontFamily="KidsHand" fontSize={110} fill={INK}>vs.</text>
          <text x={0} y={92} textAnchor="start" fontFamily="KidsHand" fontSize={170} fill={ORANGE} stroke={INK} strokeWidth={5} paintOrder="stroke fill">KIDS</text>
          <text x={0} y={172} textAnchor="middle" fontFamily="KidsSans" fontWeight={800} fontSize={58} fill={INK}>Người lớn vs Trẻ con</text>
        </g>
        {/* corner tags */}
        <g transform="translate(70 90) rotate(-4)">
          <rect x={0} y={-56} width={440} height={86} rx={18} fill={BLUE} stroke={INK} strokeWidth={6} />
          <text x={220} y={6} textAnchor="middle" fontFamily="KidsHand" fontSize={58} fill="#fff">A Day in the Life</text>
        </g>
        <g transform="translate(1010 1872) rotate(2)">
          <text x={0} y={0} textAnchor="end" fontFamily="KidsSans" fontWeight={800} fontSize={44} fill={INK} opacity={0.75}>Ai mới thật sự đang sống?</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
