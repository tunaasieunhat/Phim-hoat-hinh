// Cover for Shorts / TikTok (1080×1920): the six students in a row over a sunburst, each wallet in a different mood.
import React from "react";
import { AbsoluteFill } from "remotion";
import { INK } from "../Toon/Lily";
import { Rays, Spark } from "../Toon/props";
import { useToonFonts } from "../Toon/Stills";
import { COLOR, Student, Wallet, type Who } from "./cast";

export const SpendThumb: React.FC = () => {
  useToonFonts();
  const T = (txt: string, y: number, size: number, c: string) => <text x={540} y={y} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={size} fill={c} stroke={INK} strokeWidth={size * 0.16} paintOrder="stroke fill">{txt}</text>;
  const cast: [Who, React.ComponentProps<typeof Student>["expr"], React.ComponentProps<typeof Wallet>["mood"]][] = [["Ray", "smug", "cry"], ["Pia", "happy", "shake"], ["Bea", "smug", "worried"], ["Yuki", "sleepy", "faint"], ["Otto", "happy", "shake"], ["Gus", "deadpan", "fat"]];
  return (
    <AbsoluteFill><svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <Rays x={540} y={1150} f={0} a="#fde68a" b="#fdba74" />
      <g transform="rotate(-4 540 300)">{T("6 TYPES OF", 230, 110, "#fff")}{T("STUDENTS", 380, 160, "#fde047")}{T("SPENDING MONEY", 520, 104, "#fde047")}</g>
      {cast.map(([w, expr, mood], i) => {
        const x = 200 + (i % 3) * 340, y = 1050 + Math.floor(i / 3) * 520;
        return <g key={w}><Student who={w} id={`th${w}`} x={x - 30} y={y} s={0.58} expr={expr} pose={{ aF: [30, 10], aB: [-20, -10] }} /><Wallet x={x + 95} y={y - 70} s={0.42} mood={mood} strap={COLOR[w]} f={0} />
          <rect x={x - 110} y={y + 12} width={220} height={56} rx={28} fill={COLOR[w]} stroke={INK} strokeWidth={5} /><text x={x} y={y + 52} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={34} fill="#fff">{w}</text></g>;
      })}
      {[[90, 700], [990, 760]].map(([x, y], i) => <Spark key={i} x={x} y={y} s={1.5} c="#fff" />)}
      <rect x={90} y={1800} width={900} height={90} rx={20} fill={INK} />
      <text x={540} y={1862} textAnchor="middle" fontFamily="ToonSans" fontWeight={800} fontSize={48} fill="#fff">Bạn là kiểu sinh viên nào?</text>
    </svg></AbsoluteFill>
  );
};
