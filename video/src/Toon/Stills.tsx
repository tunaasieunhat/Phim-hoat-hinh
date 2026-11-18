// Style-approval stills for the rainy-day toon: Lily's character sheet and the rainy living room.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { Head, INK, LilyHair, LilyHairBack, Toon, type Expr } from "./Lily";
import { H, RainyRoom, W } from "./sets";

const VI = "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9";
export const useToonFonts = () => {
  const [h] = useState(() => delayRender("toon fonts"));
  useEffect(() => {
    const faces = [
      new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
      new FontFace("ToonSans", `url(${staticFile("fonts/be-vietnam-pro-latin-800-normal.woff2")}) format("woff2")`, { weight: "800" }),
      new FontFace("ToonSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-800-normal.woff2")}) format("woff2")`, { weight: "800", unicodeRange: VI }),
    ];
    Promise.all(faces.map((x) => x.load())).then((l) => { l.forEach((x) => document.fonts.add(x)); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
};

const Mug = () => <g transform="translate(18 -6)"><path d="M 26 -40 q 26 2 22 22 q -4 18 -22 16" fill="none" stroke={INK} strokeWidth={7} /><path d="M -26 -52 L 26 -52 L 22 4 L -22 4 Z" fill="#fde68a" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M -14 -66 q -8 -14 0 -26 M 6 -70 q -8 -14 0 -26" stroke="#fff" strokeWidth={5} fill="none" opacity={0.8} /></g>;

export const ToonLilySheet: React.FC = () => {
  useToonFonts();
  const heads: [Expr, string][] = [["smug", "smug"], ["sleepy", "sleepy"], ["shock", "shock"], ["determined", "fired up"]];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs><radialGradient id="ls" cx="0.5" cy="0.55" r="0.7"><stop offset="0" stopColor="#ffe4c4" /><stop offset="0.6" stopColor="#f6b98f" /><stop offset="1" stopColor="#8a4f5e" /></radialGradient></defs>
        <rect width={W} height={H} fill="url(#ls)" />
        <ellipse cx={540} cy={1600} rx={420} ry={60} fill="#7c3f4a" opacity={0.25} />
        <text x={540} y={150} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={110} fill="#fff" stroke={INK} strokeWidth={14} paintOrder="stroke fill">LILY</text>
        {heads.map(([e, label], i) => (
          <g key={e} transform={`translate(${150 + i * 260} 330)`}>
            <circle r={104} fill="#fff" opacity={0.35} />
            <Head id={`h${i}`} r={78} expr={e} hair={<LilyHair r={78} />} back={<LilyHairBack r={78} />} blush={e === "smug"} />
            <text y={140} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={38} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke fill">{label}</text>
          </g>
        ))}
        <Toon id="lily" x={540} y={1600} s={1.45} expr="smug" blush look={{ look: 0.3 }} pose={{ lean: -3, head: -6, aB: [-30, -10], aF: [40, 150], lB: [-8, -4], lF: [10, 6] }} holdF={<Mug />} />
        <text x={540} y={1800} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={44} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke fill">pink hoodie · star clip · fluffy slippers</text>
      </svg>
    </AbsoluteFill>
  );
};

export const ToonRoom: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><RainyRoom f={f + 40} /></svg>
    </AbsoluteFill>
  );
};
