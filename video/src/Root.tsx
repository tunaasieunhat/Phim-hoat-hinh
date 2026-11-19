import { Composition, Still } from "remotion";
import { NhaGiao } from "./NhaGiao/NhaGiao";
import { DURATION, FPS, H, W } from "./NhaGiao/timing";
import { KIDS3_FRAMES, KIDS_FRAMES, KidsVideo, KidsVideo3 } from "./Kids/KidsVideo";
import { KidsThumbnail } from "./Kids/Thumbnail";
import { MED_FRAMES, MedVideo } from "./Med/MedVideo";
import { IT_FRAMES, ITVideo } from "./IT/ITVideo";
import { TEAMS_FRAMES, TeamsVideo } from "./Teams/TeamsVideo";
import { SLEEP_FRAMES, SLEEP_PREVIEW_FRAMES, SleepFull, SleepPreview } from "./Sleep/SleepVideo";

import { TOM_FRAMES, TOM_PREVIEW_FRAMES, TomFull, TomPreview } from "./Tom/TomVideo";

import { ToonLilySheet, ToonRoom } from "./Toon/Stills";
import { FreeBobSheet, FreeShop } from "./Free/Stills";
import { FREE_FRAMES, FreeFull } from "./Free/FreeVideo";
import { FreeThumb } from "./Free/Thumbnail";
import { StyleExplainer, StyleHandDrawn, StyleMeme, StyleMinimal } from "./Spend/StyleFrames";
import { TOON_FRAMES, TOON_PREVIEW_FRAMES, ToonFull, ToonPreview } from "./Toon/ToonVideo";
import { RAIN_FRAMES, RAIN_PREVIEW_FRAMES, RainFull, RainPreview } from "./Rain/RainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="NgayNhaGiao" component={NhaGiao} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
      <Composition id="GrownupsVsKids" component={KidsVideo} durationInFrames={KIDS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="GrownupsVsKids3min" component={KidsVideo3} durationInFrames={KIDS3_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="PovMedStudent" component={MedVideo} durationInFrames={MED_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="PovITStudent" component={ITVideo} durationInFrames={IT_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="FiveTypesOfTeams" component={TeamsVideo} durationInFrames={TEAMS_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="NotEnoughSleep" component={SleepFull} durationInFrames={SLEEP_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="NotEnoughSleepPreview" component={SleepPreview} durationInFrames={SLEEP_PREVIEW_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="TomNoSleep" component={TomFull} durationInFrames={TOM_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="TomNoSleepPreview" component={TomPreview} durationInFrames={TOM_PREVIEW_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="RainyDay" component={RainFull} durationInFrames={RAIN_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="RainyDayPreview" component={RainPreview} durationInFrames={RAIN_PREVIEW_FRAMES} fps={30} width={1080} height={1920} />
      <Still id="GrownupsVsKidsCover" component={KidsThumbnail} width={1080} height={1920} />
      <Still id="ToonLilySheet" component={ToonLilySheet} width={1080} height={1920} />
      <Still id="ToonRoom" component={ToonRoom} width={1080} height={1920} />
      <Still id="FreeBobSheet" component={FreeBobSheet} width={1080} height={1920} />
      <Still id="FreeShop" component={FreeShop} width={1080} height={1920} />
      <Still id="SpendStyleMeme" component={StyleMeme} width={1080} height={1920} />
      <Still id="SpendStyleHandDrawn" component={StyleHandDrawn} width={1080} height={1920} />
      <Still id="SpendStyleExplainer" component={StyleExplainer} width={1080} height={1920} />
      <Still id="SpendStyleMinimal" component={StyleMinimal} width={1080} height={1920} />
      <Still id="EverythingFreeCover" component={FreeThumb} width={1080} height={1920} />
      <Composition id="EverythingFree" component={FreeFull} durationInFrames={FREE_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="ToonRain" component={ToonFull} durationInFrames={TOON_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="ToonRainPreview" component={ToonPreview} durationInFrames={TOON_PREVIEW_FRAMES} fps={30} width={1080} height={1920} />
    </>
  );
};
