import { Composition } from "remotion";
import { NhaGiao } from "./NhaGiao/NhaGiao";
import { DURATION, FPS, H, W } from "./NhaGiao/timing";
import { KIDS_FRAMES, KidsVideo } from "./Kids/KidsVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="NgayNhaGiao" component={NhaGiao} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
      <Composition id="GrownupsVsKids" component={KidsVideo} durationInFrames={KIDS_FRAMES} fps={30} width={1920} height={1080} />
    </>
  );
};
