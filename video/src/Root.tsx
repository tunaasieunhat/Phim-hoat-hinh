import { Composition, Still } from "remotion";
import { NhaGiao } from "./NhaGiao/NhaGiao";
import { DURATION, FPS, H, W } from "./NhaGiao/timing";
import { KIDS_FRAMES, KidsVideo } from "./Kids/KidsVideo";
import { KidsThumbnail } from "./Kids/Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="NgayNhaGiao" component={NhaGiao} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
      <Composition id="GrownupsVsKids" component={KidsVideo} durationInFrames={KIDS_FRAMES} fps={30} width={1920} height={1080} />
      <Still id="GrownupsVsKidsCover" component={KidsThumbnail} width={1080} height={1920} />
    </>
  );
};
