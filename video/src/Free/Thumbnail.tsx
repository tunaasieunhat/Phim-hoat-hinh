// Cover / thumbnail for Shorts & TikTok (1080×1920): Bob grinning behind a cart piled with a TV, car, horse and piano.
import React from "react";
import { AbsoluteFill } from "remotion";
import { INK } from "../Toon/Lily";
import { Rays, Spark } from "../Toon/props";
import { useToonFonts } from "../Toon/Stills";
import { Bob } from "./cast";
import { Cart, PriceTag } from "./props";
import { Loot } from "./scenes1";

export const FreeThumb: React.FC = () => {
  useToonFonts();
  const T = (txt: string, y: number, size: number, c: string) => <text x={540} y={y} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={size} fill={c} stroke={INK} strokeWidth={size * 0.16} paintOrder="stroke fill">{txt}</text>;
  return (
    <AbsoluteFill><svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Rays x={540} y={1100} f={0} a="#fde047" b="#fb923c" />
      <g transform="rotate(-4 540 300)">{T("WHAT IF", 230, 120, "#fff")}{T("EVERYTHING", 380, 150, "#fde047")}{T("WAS FREE?!", 530, 150, "#fde047")}</g>
      <g transform="translate(720 1650)"><Cart s={1.15}><Loot n={4} /></Cart></g>
      <Bob id="th" x={270} y={1700} s={1.25} expr="smug" blush pose={{ aF: [130, 165], aB: [60, 40] }} fistF />
      <g transform="translate(860 1720) rotate(-14) scale(2)"><PriceTag text="$0" c="#86efac" /></g>
      {[[120, 700], [960, 760], [100, 1200]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={1.6} c="#fff" />)}
      <rect x={80} y={1790} width={920} height={90} rx={20} fill={INK} />
      <text x={540} y={1852} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={46} fill="#fff">Nếu mua gì cũng không mất tiền?</text>
    </svg></AbsoluteFill>
  );
};
