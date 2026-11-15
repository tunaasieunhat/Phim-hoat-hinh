import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SANS as sans, SCRIPT as script } from "./fonts";
import { camSpeed, camX, DURATION, H, LINES, W } from "./timing";
import { FarLayer, Ground, Petals, SceneBoard, SceneDream, SceneRiver, SceneThanks, SceneTitle, Thread } from "./Scenes";

const fonts = { script, sans };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Sky colours keyed to camera position, so the light changes as smoothly as the camera moves
const SKY_STOPS = [0, 1920, 3840, 5760, 7680];
const SKY_TOP = ["#FFC9A8", "#8FD3FF", "#A9DCFF", "#FFB27A", "#FFC4D6"];
const SKY_BOTTOM = ["#FFF1D6", "#E3F5FF", "#EAF7FF", "#FFE2B8", "#FFF0F4"];

const Subtitle: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 4, dur + 6], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
      <div
        style={{
          opacity: o,
          transform: `translateY(${(1 - o) * 12}px)`,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.3,
          color: "#FFFFFF",
          background: "rgba(30, 24, 40, 0.62)",
          padding: "14px 34px",
          borderRadius: 22,
          maxWidth: 1720,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const NhaGiao: React.FC = () => {
  const f = useCurrentFrame();
  const cx = camX(f);
  const speed = Math.abs(camSpeed(f));
  // pull back a little while travelling, push in while resting: breathing, never static
  const zoom = 1.06 - Math.min(1, speed / 35) * 0.07 + Math.sin(f / 45) * 0.008;
  const lift = Math.min(1, speed / 35) * -18 + Math.sin(f / 33) * 4;
  const tilt = Math.sin(f / 60) * 0.4;
  const skyTop = interpolateColors(cx, SKY_STOPS, SKY_TOP);
  const skyBottom = interpolateColors(cx, SKY_STOPS, SKY_BOTTOM);
  const fadeOut = interpolate(f, [DURATION - 20, DURATION], [0, 1], clamp);
  const fadeIn = interpolate(f, [0, 10], [1, 0], clamp);

  const camera = `translate(${W / 2} ${H / 2 + lift}) scale(${zoom}) rotate(${tilt}) translate(${-W / 2} ${-H / 2})`;

  return (
    <AbsoluteFill style={{ background: skyBottom }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop} />
            <stop offset="1" stopColor={skyBottom} />
          </linearGradient>
          <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.6" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#2A1530" stopOpacity={0.35} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky)" />
        <g transform={camera}>
          <g transform={`translate(${-cx * 0.45} 0)`}>
            <FarLayer f={f} />
          </g>
          <g transform={`translate(${-cx} 0)`}>
            <Thread revealTo={cx + W * 0.8} />
            <Ground />
            <SceneTitle f={f} fonts={fonts} />
            <SceneBoard f={f} fonts={fonts} />
            <SceneDream f={f} fonts={fonts} />
            <SceneRiver f={f} fonts={fonts} />
            <SceneThanks f={f} fonts={fonts} />
          </g>
        </g>
        <Petals f={f} />
        <rect width={W} height={H} fill="url(#vignette)" />
      </svg>

      <Audio src={staticFile("music.wav")} volume={0.32} />
      {LINES.map((l, i) => (
        <Sequence key={i} name={`Lời ${i + 1}`} from={l.from} durationInFrames={l.dur + 8}>
          <Audio src={staticFile(l.file)} volume={1} />
          <Subtitle text={l.text} dur={l.dur} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fadeIn, fadeOut) }} />
    </AbsoluteFill>
  );
};
