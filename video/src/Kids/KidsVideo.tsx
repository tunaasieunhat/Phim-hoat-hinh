// "A Day in the Life: Grown-ups vs. Kids" — 1920x1080, 30 fps, English narration (Edge TTS en-US-GuyNeural),
// Vietnamese subtitles. Scene lengths and subtitle times come from src/Kids/data.ts (scripts/kids_narration.py).
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { SCENES as SCENES3 } from "./data3";
import { Scene1, Scene2, Scene3, Scene4, Scene5 } from "./scenes1";
import { Scene10, Scene6, Scene7, Scene8, Scene9 } from "./scenes2";
import { FPS, H, PortraitCtx, W } from "./stage";
import { DAD, INK } from "./rig";

// ---- local fonts: Patrick Hand (in-scene handwriting), Be Vietnam Pro (subtitles); both SIL OFL
const VI = "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
if (typeof document !== "undefined") {
  const h = delayRender("Loading Kids fonts");
  const faces = [
    new FontFace("KidsHand", `url(${staticFile("fonts/PatrickHand-Regular.ttf")})`),
    new FontFace("KidsSans", `url(${staticFile("fonts/be-vietnam-pro-latin-700-normal.woff2")}) format("woff2")`, { weight: "700" }),
    new FontFace("KidsSans", `url(${staticFile("fonts/be-vietnam-pro-vietnamese-700-normal.woff2")}) format("woff2")`, { weight: "700", unicodeRange: VI }),
  ];
  Promise.all(faces.map((ff) => { document.fonts.add(ff); return ff.load(); }))
    .then(() => continueRender(h))
    .catch((e) => { console.error(e); continueRender(h); });
}

const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10] as React.FC<{ sc: SceneData; hold: number }>[];
export const KIDS_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0);
export const KIDS3_FRAMES = SCENES3.reduce((a, s) => a + s.frames, 0);

const Subtitles: React.FC<{ sc: SceneData; portrait?: boolean }> = ({ sc, portrait }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = sc.cues.find((q) => t >= q.t0 && t < q.t1);
  if (!c) return null;
  const o = interpolate(t, [c.t0, c.t0 + 0.12, c.t1 - 0.1, c.t1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: portrait ? 255 : 48 }}>
      <div style={{ opacity: o, maxWidth: portrait ? 940 : 1500, textAlign: "center", fontFamily: "KidsSans", fontWeight: 700, fontSize: 48, lineHeight: 1.3, color: "#fff",
        WebkitTextStroke: "5px #111", paintOrder: "stroke fill", textShadow: "0 3px 10px rgba(0,0,0,0.35)" }}>
        {c.vi}
      </div>
    </AbsoluteFill>
  );
};

// 9:16 layout per scene: split scenes stack Dad's half above Mia's; the others crop around the action.
// panel = [viewBox x, y, w, h] drawn into the 1080-wide stage between y 250 and 1560 (1310 tall)
const TOP = 250, AREA = 1250;
type PL = { split: true; bg: string } | { split: false; cx: number; cy: number; w: number; bg: [string, string] };
const PORTRAIT: PL[] = [
  { split: false, cx: 960, cy: 400, w: 1260, bg: ["#fdfcf8", "#fdfcf8"] },
  { split: true, bg: "#fdfcf8" }, { split: true, bg: "#fdfcf8" }, { split: true, bg: "#fdfcf8" }, { split: true, bg: "#fdfcf8" }, { split: true, bg: "#fdfcf8" },
  { split: false, cx: 840, cy: 470, w: 1160, bg: ["#f6f1e6", "#f6f1e6"] },
  { split: false, cx: 1000, cy: 520, w: 1240, bg: ["#cdbdf0", "#a9d08e"] },
  { split: false, cx: 1060, cy: 520, w: 1480, bg: ["#dfe5f6", "#cfc4b4"] },
  { split: false, cx: 960, cy: 400, w: 1080, bg: ["#fdfcf8", "#fdfcf8"] },
];
const LABELS = ["", "6:30 AM", "7:00 AM · Breakfast", "8:00 AM · On the way", "12:00 · Questions", "3:00 PM · Mistakes", "5:00 PM", "6:30 PM", "9:00 PM", ""];

const PortraitScene: React.FC<{ sc: SceneData; i: number }> = ({ sc, i }) => {
  const C = SCENE_COMPONENTS[i];
  const L = PORTRAIT[i];
  const f = useCurrentFrame();
  const k = interpolate(f, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scene = <C sc={sc} hold={0} />;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      {L.split ? (
        <>
          <rect width={1080} height={1920} fill={L.bg} />
          {[0, 1].map((half) => {
            const vy = 150, vh = 655, ph = AREA / 2;
            return (
              <g key={half}>
                <svg x={40} y={TOP + half * ph} width={1000} height={ph - 10} viewBox={`${half * 960} ${vy} 960 ${vh}`} preserveAspectRatio="xMidYMid meet">{scene}</svg>
                <rect x={40} y={TOP + half * ph} width={1000} height={ph - 10} rx={28} fill="none" stroke={INK} strokeWidth={5} opacity={0.5} />
              </g>
            );
          })}
          <g transform={`translate(${540} ${TOP + AREA / 2 - 5})`}>
            <rect x={-74} y={-34} width={148} height={68} rx={34} fill="#fff" stroke={INK} strokeWidth={5} />
            <text x={0} y={16} textAnchor="middle" fontFamily="KidsHand" fontSize={44} fill={INK}>vs.</text>
          </g>
        </>
      ) : (
        <>
          <rect width={1080} height={960} fill={L.bg[0]} /><rect y={960} width={1080} height={960} fill={L.bg[1]} />
          <svg x={0} y={0} width={1080} height={1920} viewBox={`${L.cx - L.w / 2} ${L.cy - ((TOP + AREA / 2) * L.w) / 1080} ${L.w} ${(1920 * L.w) / 1080}`}>{scene}</svg>
        </>
      )}
      {LABELS[i] && (
        <g transform={`translate(540 140) scale(${k}) rotate(-1.5)`}>
          <rect x={-LABELS[i].length * 15 - 36} y={-52} width={LABELS[i].length * 30 + 72} height={96} rx={20} fill="#fff" stroke={INK} strokeWidth={6} />
          <text x={0} y={18} textAnchor="middle" fontFamily="KidsHand" fontSize={62} fill={i === 0 ? DAD : INK}>{LABELS[i]}</text>
        </g>
      )}
    </svg>
  );
};

const SceneFrame: React.FC<{ sc: SceneData; i: number; n: number; portrait?: boolean }> = ({ sc, i, n, portrait }) => {
  const f = useCurrentFrame();
  const C = SCENE_COMPONENTS[i];
  const last = i === n - 1;
  const fadeIn = i === 0 ? interpolate(f, [0, 18], [1, 0], { extrapolateRight: "clamp" }) : interpolate(f, [0, 10], [1, 0], { extrapolateRight: "clamp" });
  const fadeOut = last ? interpolate(f, [sc.frames - 40, sc.frames], [0, 1], { extrapolateLeft: "clamp" }) : interpolate(f, [sc.frames - 10, sc.frames], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill>
      <PortraitCtx.Provider value={!!portrait}>
        {portrait ? <PortraitScene sc={sc} i={i} /> : (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <C sc={sc} hold={0} />
          </svg>
        )}
      </PortraitCtx.Provider>
      <Subtitles sc={sc} portrait={portrait} />
      <AbsoluteFill style={{ background: last ? "#000" : "#fdfcf8", opacity: Math.max(fadeIn * (i === 0 ? 1 : 0.9), fadeOut * (last ? 1 : 0.9)) }} />
      <Audio src={staticFile(sc.audio)} />
    </AbsoluteFill>
  );
};

const Film: React.FC<{ scenes: SceneData[]; music: string; portrait?: boolean }> = ({ scenes, music, portrait }) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#fdfcf8" }}>
      <Audio src={staticFile(music)} volume={0.16} />
      {scenes.map((sc, i) => {
        const from = at;
        at += sc.frames;
        return (
          <Sequence key={sc.n} name={`Cảnh ${sc.n} · ${sc.title}`} from={from} durationInFrames={sc.frames}>
            <SceneFrame sc={sc} i={i} n={scenes.length} portrait={portrait} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
// the full 16:9 film (~4:44)
export const KidsVideo: React.FC = () => <Film scenes={SCENES} music="kids/music.wav" />;
// the <=3-minute 9:16 cut (shorter narration, stacked/cropped layout)
export const KidsVideo3: React.FC = () => <Film scenes={SCENES3} music="kids3/music.wav" portrait />;
