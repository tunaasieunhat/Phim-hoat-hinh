import { Composition, Still } from "remotion";
import { NhaGiao } from "./NhaGiao/NhaGiao";
import { DURATION, FPS, H, W } from "./NhaGiao/timing";
import { KIDS3_FRAMES, KIDS_FRAMES, KidsVideo, KidsVideo3 } from "./Kids/KidsVideo";
import { KidsThumbnail } from "./Kids/Thumbnail";
import { MED_FRAMES, MedVideo } from "./Med/MedVideo";
import { IT_FRAMES, ITVideo } from "./IT/ITVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="NgayNhaGiao" component={NhaGiao} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
      <Composition id="GrownupsVsKids" component={KidsVideo} durationInFrames={KIDS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="GrownupsVsKids3min" component={KidsVideo3} durationInFrames={KIDS3_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="PovMedStudent" component={MedVideo} durationInFrames={MED_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="PovITStudent" component={ITVideo} durationInFrames={IT_FRAMES} fps={30} width={1080} height={1920} />
      <Still id="GrownupsVsKidsCover" component={KidsThumbnail} width={1080} height={1920} />
    </>
  );
};
