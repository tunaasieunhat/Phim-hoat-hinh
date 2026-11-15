// "A Day in the Life: Grown-ups vs. Kids" — 1920x1080, 30 fps, English narration (Edge TTS en-US-GuyNeural),
// Vietnamese subtitles. Scene lengths and subtitle times come from src/Kids/data.ts (scripts/kids_narration.py).
import React from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SCENES, type SceneData } from "./data";
import { Scene1, Scene2, Scene3, Scene4, Scene5 } from "./scenes1";
import { Scene10, Scene6, Scene7, Scene8, Scene9 } from "./scenes2";
import { FPS, H, W } from "./stage";

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

const Subtitles: React.FC<{ sc: SceneData }> = ({ sc }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = sc.cues.find((q) => t >= q.t0 && t < q.t1);
  if (!c) return null;
  const o = interpolate(t, [c.t0, c.t0 + 0.12, c.t1 - 0.1, c.t1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 48 }}>
      <div style={{ opacity: o, maxWidth: 1500, textAlign: "center", fontFamily: "KidsSans", fontWeight: 700, fontSize: 48, lineHeight: 1.3, color: "#fff",
        WebkitTextStroke: "5px #111", paintOrder: "stroke fill", textShadow: "0 3px 10px rgba(0,0,0,0.35)" }}>
        {c.vi}
      </div>
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{ sc: SceneData; i: number }> = ({ sc, i }) => {
  const f = useCurrentFrame();
  const C = SCENE_COMPONENTS[i];
  const fadeIn = i === 0 ? interpolate(f, [0, 18], [1, 0], { extrapolateRight: "clamp" }) : interpolate(f, [0, 10], [1, 0], { extrapolateRight: "clamp" });
  const fadeOut = i === SCENES.length - 1 ? interpolate(f, [sc.frames - 40, sc.frames], [0, 1], { extrapolateLeft: "clamp" }) : interpolate(f, [sc.frames - 10, sc.frames], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <C sc={sc} hold={0} />
      </svg>
      <Subtitles sc={sc} />
      <AbsoluteFill style={{ background: i === SCENES.length - 1 ? "#000" : "#fdfcf8", opacity: Math.max(fadeIn * (i === 0 ? 1 : 0.9), fadeOut * (i === SCENES.length - 1 ? 1 : 0.9)) }} />
      <Audio src={staticFile(sc.audio)} />
    </AbsoluteFill>
  );
};

export const KidsVideo: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: "#fdfcf8" }}>
      <Audio src={staticFile("kids/music.wav")} volume={0.16} />
      {SCENES.map((sc, i) => {
        const from = at;
        at += sc.frames;
        return (
          <Sequence key={sc.n} name={`Cảnh ${sc.n} · ${sc.title}`} from={from} durationInFrames={sc.frames}>
            <SceneFrame sc={sc} i={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
