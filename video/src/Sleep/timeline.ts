// GSAP timelines driven by Remotion's frame (see CLAUDE.md "GSAP trong Remotion"):
// the timeline is built once, paused, and seeked to frame / fps on every render, so every frame is deterministic.
import gsap from "gsap";
import { useMemo } from "react";
import { useCurrentFrame } from "remotion";

export type TL = gsap.core.Timeline;
export const useTimeline = <T extends Record<string, number>>(init: T, build: (tl: TL, s: T) => void): T & { f: number } => {
  const f = useCurrentFrame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { tl, s } = useMemo(() => { const s = { ...init }; const tl = gsap.timeline({ paused: true }); build(tl, s); return { tl, s }; }, []);
  tl.seek(f / 30, false);
  return { ...s, f };
};
