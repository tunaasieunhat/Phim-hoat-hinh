import React from "react";
import { Easing, interpolate, random } from "remotion";
import { Cloud, Flower, INK, PaperPlane, Person } from "./Characters";
import { GROUND, SCENE_X } from "./timing";

export type Fonts = { script: string; sans: string };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.33, 1, 0.68, 1);
const pop = (f: number, start: number, len = 18) =>
  interpolate(f, [start, start + len * 0.7, start + len], [0, 1.12, 1], { ...clamp, easing: Easing.out(Easing.quad) });

/* ---------- far background (parallax 0.45) ---------- */
export const FarLayer: React.FC<{ f: number }> = ({ f }) => {
  const hills = [];
  for (let i = 0; i < 12; i++) {
    const x = i * 520 - 200;
    hills.push(<ellipse key={i} cx={x} cy={GROUND + 40} rx={420} ry={190 + (i % 3) * 40} fill={i % 2 ? "#9ED39A" : "#8BC98C"} />);
  }
  const clouds = [];
  for (let i = 0; i < 14; i++) {
    clouds.push(<Cloud key={i} x={i * 380 + 120 + Math.sin(f / 60 + i) * 20} y={150 + (i % 3) * 70} s={0.6 + (i % 4) * 0.15} />);
  }
  return (
    <g>
      {clouds}
      {hills}
    </g>
  );
};

/* ---------- golden thread that ties all scenes together ---------- */
export const Thread: React.FC<{ revealTo: number }> = ({ revealTo }) => {
  let d = "M -400 260";
  for (let x = -400; x <= 9800; x += 40) {
    d += ` L ${x} ${250 + Math.sin(x / 260) * 60 + Math.sin(x / 97) * 14}`;
  }
  return (
    <g>
      <defs>
        <clipPath id="thread-clip">
          <rect x={-500} y={0} width={revealTo + 500} height={1080} />
        </clipPath>
      </defs>
      <path d={d} clipPath="url(#thread-clip)" fill="none" stroke="#F4B93A" strokeWidth={7} strokeLinecap="round" strokeDasharray="2 18" />
    </g>
  );
};

/* ---------- ground strip (continuous across scenes 1-3 and 5) ---------- */
export const Ground: React.FC = () => (
  <g>
    <rect x={-400} y={GROUND} width={10400} height={300} fill="#7CC36B" />
    <rect x={-400} y={GROUND} width={10400} height={14} fill="#5FA752" />
  </g>
);

/* ---------- Scene 1: title ---------- */
export const SceneTitle: React.FC<{ f: number; fonts: Fonts }> = ({ f, fonts }) => {
  const X = SCENE_X[0];
  const sunY = interpolate(f, [0, 90], [560, 250], { ...clamp, easing: ease });
  const reveal = interpolate(f, [12, 58], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const sub = interpolate(f, [38, 64], [0, 1], { ...clamp, easing: ease });
  const bushes = [
    { x: 170, y: GROUND - 10 },
    { x: 1750, y: GROUND - 10 },
  ];
  return (
    <g transform={`translate(${X} 0)`}>
      <circle cx={1560} cy={sunY} r={130} fill="#FFD36B" opacity={0.35} />
      <circle cx={1560} cy={sunY} r={95} fill="#FFC23D" />
      {bushes.map((b, i) => (
        <g key={i}>
          <ellipse cx={b.x} cy={b.y} rx={190} ry={110} fill="#4E9B4A" stroke={INK} strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <Flower
              key={k}
              x={b.x - 130 + k * 52}
              y={b.y - 40 - ((k * 37) % 60)}
              r={26}
              color={k % 2 ? "#F6577A" : "#FF8FAB"}
              grow={pop(f, 20 + k * 6 + i * 10)}
              spin={f * 0.6}
            />
          ))}
        </g>
      ))}
      <defs>
        <clipPath id="title-reveal">
          <rect x={400} y={200} width={1120 * reveal} height={360} />
        </clipPath>
      </defs>
      <text
        x={960}
        y={500}
        textAnchor="middle"
        clipPath="url(#title-reveal)"
        style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 300 }}
        fill="#D62F3A"
        stroke="#FFFFFF"
        strokeWidth={10}
        paintOrder="stroke"
      >
        20.11
      </text>
      <text
        x={960}
        y={640 + (1 - sub) * 30}
        opacity={sub}
        textAnchor="middle"
        style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 92, letterSpacing: 2 }}
        fill="#2C3E73"
        stroke="#FFFFFF"
        strokeWidth={12}
        paintOrder="stroke"
      >
        Ngày Nhà giáo Việt Nam
      </text>
    </g>
  );
};

/* ---------- Scene 2: teacher at the blackboard ---------- */
export const SceneBoard: React.FC<{ f: number; fonts: Fonts }> = ({ f, fonts }) => {
  const X = SCENE_X[1];
  const lf = f - 150;
  const write1 = interpolate(lf, [35, 85], [0, 1], clamp);
  const write2 = interpolate(lf, [85, 135], [0, 1], clamp);
  const wave = Math.sin(f / 8);
  const letters = ["a", "ă", "â", "b", "c", "d", "đ", "e"];
  return (
    <g transform={`translate(${X} 0)`}>
      {/* school building */}
      <g transform="translate(1400 0)">
        <rect x={0} y={420} width={480} height={GROUND - 420} fill="#F7D774" stroke={INK} strokeWidth={4} />
        <path d="M -40 430 L 240 300 L 520 430 Z" fill="#D2553F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={45 + i * 150} y={490} width={90} height={110} fill="#8FD0F0" stroke={INK} strokeWidth={4} />
        ))}
        <rect x={190} y={680} width={100} height={GROUND - 680} fill="#9A5B34" stroke={INK} strokeWidth={4} />
        <text x={240} y={400} textAnchor="middle" style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 36 }} fill="#FFFFFF">
          TRƯỜNG HỌC
        </text>
      </g>
      {/* flag pole with waving flag */}
      <line x1={1330} y1={GROUND} x2={1330} y2={300} stroke={INK} strokeWidth={8} />
      <path
        d={`M 1334 305 Q 1380 ${300 + wave * 12} 1430 305 T 1520 ${305 + wave * 6} L 1520 ${425 + wave * 6} Q 1475 ${420 - wave * 12} 1430 425 T 1334 425 Z`}
        fill="#DA251D"
        stroke={INK}
        strokeWidth={3}
      />
      <path
        transform={`translate(1427 ${365 + wave * 3}) scale(1.6)`}
        d="M 0 -18 L 5 -6 L 18 -6 L 8 2 L 12 15 L 0 7 L -12 15 L -8 2 L -18 -6 L -5 -6 Z"
        fill="#FFDD00"
      />
      {/* blackboard */}
      <g transform="translate(170 0)">
        <rect x={250} y={300} width={720} height={420} rx={12} fill="#A0673C" stroke={INK} strokeWidth={4} />
        <rect x={274} y={324} width={672} height={372} rx={6} fill="#2F5D50" />
        <line x1={420} y1={720} x2={380} y2={GROUND} stroke="#A0673C" strokeWidth={14} />
        <line x1={800} y1={720} x2={840} y2={GROUND} stroke="#A0673C" strokeWidth={14} />
        <defs>
          <clipPath id="chalk1">
            <rect x={300} y={360} width={620 * write1} height={140} />
          </clipPath>
          <clipPath id="chalk2">
            <rect x={300} y={510} width={620 * write2} height={150} />
          </clipPath>
        </defs>
        <text x={610} y={470} textAnchor="middle" clipPath="url(#chalk1)" style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 104 }} fill="#F4F1E8">
          Tiên học lễ
        </text>
        <text x={610} y={620} textAnchor="middle" clipPath="url(#chalk2)" style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 104 }} fill="#F4F1E8">
          Hậu học văn
        </text>
      </g>
      {/* teacher in áo dài, pointing at the board */}
      <Person x={1215} y={GROUND} s={1.15} top="#7FB8E8" aoDai longHair arm={115 + Math.sin(f / 10) * 8} flip={false} />
      {/* letters rising from the board like seeds */}
      {letters.map((ch, i) => {
        const start = 70 + i * 9;
        const t = lf - start;
        if (t < 0) return null;
        const y = 300 - t * 2.2;
        const x = 520 + i * 80 + Math.sin(t / 12 + i) * 25 + t * 4;
        const o = interpolate(t, [0, 10, 120, 170], [0, 1, 1, 0], clamp);
        return (
          <text key={i} x={x} y={y} opacity={o} style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 70 }} fill="#FFE27A" stroke={INK} strokeWidth={3} paintOrder="stroke">
            {ch}
          </text>
        );
      })}
    </g>
  );
};

/* ---------- Scene 3: first letters become paper planes ---------- */
export const SceneDream: React.FC<{ f: number; fonts: Fonts }> = ({ f, fonts }) => {
  const X = SCENE_X[2];
  const lf = f - 330;
  const pen = interpolate(lf, [25, 90], [0, 1], clamp);
  const penX = 760 + pen * 300;
  return (
    <g transform={`translate(${X} 0)`}>
      {/* big tree */}
      <rect x={1460} y={420} width={60} height={GROUND - 420} fill="#8A5530" stroke={INK} strokeWidth={4} />
      <circle cx={1490} cy={400} r={190} fill="#4E9B4A" stroke={INK} strokeWidth={4} />
      <circle cx={1380} cy={470} r={110} fill="#5DAE57" stroke={INK} strokeWidth={4} />
      <circle cx={1610} cy={470} r={110} fill="#5DAE57" stroke={INK} strokeWidth={4} />
      {/* child sitting at a desk */}
      <Person x={900} y={700} s={1.05} top="#FFFFFF" bottom="#1F3F8F" sitting arm={60 + Math.sin(f / 3) * 6} hair="#1B1110" />
      <rect x={640} y={690} width={560} height={34} rx={6} fill="#C98A55" stroke={INK} strokeWidth={4} />
      <rect x={680} y={724} width={22} height={GROUND - 724} fill="#A86B3E" stroke={INK} strokeWidth={3} />
      <rect x={1138} y={724} width={22} height={GROUND - 724} fill="#A86B3E" stroke={INK} strokeWidth={3} />
      {/* notebook */}
      <rect x={720} y={640} width={400} height={56} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      <defs>
        <clipPath id="abc">
          <rect x={730} y={600} width={380 * pen} height={100} />
        </clipPath>
      </defs>
      <text x={760} y={688} clipPath="url(#abc)" style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 54 }} fill="#2C3E73">
        a  b  c  ước mơ
      </text>
      <line x1={penX} y1={680} x2={penX + 30} y2={620} stroke="#E04E4E" strokeWidth={8} strokeLinecap="round" />
      {/* paper planes take off and fly on into the next scene */}
      {[0, 1, 2, 3, 4].map((i) => {
        const t = lf - 70 - i * 9;
        if (t < 0) return null;
        const px = 1000 + t * (9 + i * 1.4);
        const py = 620 - t * (3.2 + i * 0.5) + Math.sin(t / 10 + i) * 22;
        const rot = -18 + Math.cos(t / 10 + i) * 10;
        return <PaperPlane key={i} x={px} y={py} s={0.9 + i * 0.12} rot={rot} color={["#FFFFFF", "#FFE27A", "#BDE3FF", "#FFC2D1", "#C9F2C1"][i]} />;
      })}
      {/* sparkles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const s = 0.5 + 0.5 * Math.sin(f / 6 + i * 1.7);
        return (
          <path
            key={i}
            transform={`translate(${700 + i * 150} ${360 + (i % 3) * 70}) scale(${s})`}
            d="M 0 -22 L 6 -6 L 22 0 L 6 6 L 0 22 L -6 6 L -22 0 L -6 -6 Z"
            fill="#FFD447"
          />
        );
      })}
    </g>
  );
};

/* ---------- Scene 4: the ferry across the river of knowledge ---------- */
export const SceneRiver: React.FC<{ f: number; fonts: Fonts }> = ({ f, fonts }) => {
  const X = SCENE_X[3];
  const lf = f - 500;
  const boatX = 520 + lf * 2.6;
  const bob = Math.sin(f / 9) * 6;
  const row = Math.sin(f / 11);
  const waves = [];
  for (let r = 0; r < 4; r++) {
    let d = "";
    for (let x = -300; x <= 2300; x += 30) {
      const y = 790 + r * 70 + Math.sin(x / 70 + f / 10 + r) * 8;
      d += `${x === -300 ? "M" : "L"} ${x} ${y} `;
    }
    waves.push(<path key={r} d={d} fill="none" stroke="#E8F7FF" strokeWidth={5} opacity={0.7} strokeLinecap="round" />);
  }
  const glow = 0.6 + 0.4 * Math.sin(f / 12);
  const RIVER = `M 60 ${GROUND - 120} L 1500 ${GROUND - 120} Q 1420 ${GROUND + 40} 1540 1250 L 220 1250 Q 120 ${GROUND + 40} 60 ${GROUND - 120} Z`;
  return (
    <g transform={`translate(${X} 0)`}>
      <defs>
        <clipPath id="river-clip">
          <path d={RIVER} />
        </clipPath>
      </defs>
      {/* river: soft curved banks on both sides */}
      <path d={RIVER} fill="#4FA8D8" stroke={INK} strokeWidth={4} />
      <g clipPath="url(#river-clip)">
        <rect x={0} y={GROUND - 120} width={2000} height={22} fill="#7EC4EA" />
        {waves}
      </g>
      {/* near bank: a grassy rise that hides the river's left end */}
      <path d={`M -400 1250 L -400 ${GROUND} L -150 ${GROUND} Q 60 ${GROUND - 190} 250 ${GROUND - 110} Q 330 ${GROUND - 60} 280 1250 Z`} fill="#7CC36B" />
      <path d={`M -150 ${GROUND} Q 60 ${GROUND - 190} 250 ${GROUND - 110} Q 330 ${GROUND - 60} 280 1250`} fill="none" stroke={INK} strokeWidth={4} />
      {/* far shore: a hill that slopes back down to the meadow of the last scene */}
      <path
        d={`M 1300 1250 Q 1330 ${GROUND - 40} 1380 ${GROUND - 118} Q 1600 ${GROUND - 330} 1900 ${GROUND - 300} Q 2250 ${GROUND - 260} 2450 ${GROUND} L 2600 ${GROUND} L 2600 1250 Z`}
        fill="#7CC36B"
      />
      <path
        d={`M 1300 1250 Q 1330 ${GROUND - 40} 1380 ${GROUND - 118} Q 1600 ${GROUND - 330} 1900 ${GROUND - 300} Q 2250 ${GROUND - 260} 2450 ${GROUND}`}
        fill="none"
        stroke={INK}
        strokeWidth={4}
      />
      <circle cx={1700} cy={GROUND - 380} r={150 * glow + 60} fill="#FFE27A" opacity={0.35} />
      <g transform={`translate(1700 ${GROUND - 330})`}>
        <path d="M -130 0 Q -65 -50 0 -15 Q 65 -50 130 0 L 130 50 Q 65 10 0 40 Q -65 10 -130 50 Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <line x1={0} y1={-15} x2={0} y2={40} stroke={INK} strokeWidth={4} />
      </g>
      <text x={1700} y={GROUND - 450} textAnchor="middle" style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 58 }} fill="#2C3E73" stroke="#FFFFFF" strokeWidth={10} paintOrder="stroke">
        Tri thức
      </text>
      {/* the ferry */}
      <g transform={`translate(${boatX} ${GROUND - 60 + bob})`}>
        <Person x={-150} y={-10} s={0.95} top="#7FB8E8" aoDai nonLa longHair arm={40 + row * 25} armL={30 + row * 25} />
        <line x1={-120 + row * 30} y1={-170} x2={-60 - row * 40} y2={90} stroke="#8A5530" strokeWidth={10} strokeLinecap="round" />
        <Person x={40} y={-10} s={0.7} top="#FFFFFF" bottom="#1F3F8F" sitting arm={70} bag="#F2734E" />
        <Person x={150} y={-10} s={0.7} top="#FFFFFF" bottom="#C0392B" sitting longHair arm={120 + Math.sin(f / 6) * 20} bag="#5BB4E8" />
        <path d="M -260 -10 L 270 -10 Q 240 60 160 70 L -170 70 Q -240 60 -260 -10 Z" fill="#9A5B34" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -230 10 L 240 10" stroke="#7A4524" strokeWidth={4} />
      </g>
    </g>
  );
};

/* ---------- Scene 5: thank you, teachers ---------- */
export const SceneThanks: React.FC<{ f: number; fonts: Fonts }> = ({ f, fonts }) => {
  const X = SCENE_X[4];
  const lf = f - 680;
  const t1 = interpolate(lf, [20, 50], [0, 1], { ...clamp, easing: ease });
  const t2 = interpolate(lf, [45, 75], [0, 1], { ...clamp, easing: ease });
  const t3 = interpolate(lf, [80, 110], [0, 1], { ...clamp, easing: ease });
  const beat = 1 + Math.max(0, Math.sin(f / 7)) * 0.06;
  const flowers = [
    { x: 420, y: 470, c: "#F6577A" },
    { x: 520, y: 400, c: "#FF8FAB" },
    { x: 620, y: 470, c: "#F6577A" },
    { x: 360, y: 560, c: "#FFB547" },
    { x: 470, y: 540, c: "#FF6F61" },
    { x: 580, y: 560, c: "#FFB547" },
    { x: 690, y: 560, c: "#FF8FAB" },
    { x: 520, y: 620, c: "#F6577A" },
  ];
  return (
    <g transform={`translate(${X} 0)`}>
      {/* bouquet */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={500 + i * 10} y1={GROUND - 40} x2={380 + i * 70} y2={540} stroke="#3F8A3F" strokeWidth={8} />
      ))}
      {flowers.map((fl, i) => (
        <Flower key={i} x={fl.x} y={fl.y} r={58} color={fl.c} grow={pop(lf, 5 + i * 5, 20)} spin={f * 0.4 + i * 20} />
      ))}
      <path d={`M 430 ${GROUND - 160} L 610 ${GROUND - 160} L 560 ${GROUND - 20} L 480 ${GROUND - 20} Z`} fill="#FFF3D6" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M 470 ${GROUND - 120} Q 520 ${GROUND - 90} 570 ${GROUND - 120}`} fill="none" stroke="#D62F3A" strokeWidth={8} />
      {/* heart */}
      <path
        transform={`translate(1660 280) scale(${beat * 1.4})`}
        d="M 0 30 C -70 -20 -40 -80 0 -45 C 40 -80 70 -20 0 30 Z"
        fill="#F6577A"
        stroke={INK}
        strokeWidth={3}
        opacity={t1}
      />
      <text x={1220} y={420 + (1 - t1) * 30} opacity={t1} textAnchor="middle" style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 190 }} fill="#D62F3A" stroke="#FFFFFF" strokeWidth={12} paintOrder="stroke">
        Tri ân
      </text>
      <text x={1220} y={600 + (1 - t2) * 30} opacity={t2} textAnchor="middle" style={{ fontFamily: fonts.script, fontWeight: 700, fontSize: 190 }} fill="#D62F3A" stroke="#FFFFFF" strokeWidth={12} paintOrder="stroke">
        Thầy Cô
      </text>
      <text x={1220} y={720 + (1 - t3) * 20} opacity={t3} textAnchor="middle" style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, letterSpacing: 6 }} fill="#2C3E73" stroke="#FFFFFF" strokeWidth={10} paintOrder="stroke">
        20 · 11 · 2026
      </text>
    </g>
  );
};

/* ---------- screen-space falling petals ---------- */
export const Petals: React.FC<{ f: number }> = ({ f }) => {
  const items = [];
  for (let i = 0; i < 26; i++) {
    const speed = 1.2 + random(`s${i}`) * 1.6;
    const x0 = random(`x${i}`) * 2100 - 90;
    const y = ((random(`y${i}`) * 1300 + f * speed * 2) % 1300) - 120;
    const x = x0 + Math.sin(f / 30 + i) * 40 - f * 0.8;
    const xx = ((x % 2100) + 2100) % 2100 - 90;
    items.push(
      <ellipse
        key={i}
        cx={xx}
        cy={y}
        rx={11}
        ry={6}
        fill={i % 3 ? "#FF9EB5" : "#FFD1DC"}
        transform={`rotate(${f * 3 + i * 40} ${xx} ${y})`}
        opacity={0.85}
      />,
    );
  }
  return <g>{items}</g>;
};
