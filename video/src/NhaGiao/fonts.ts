// Local fonts (SIL OFL, from @fontsource) so rendering needs no network access.
import { continueRender, delayRender, staticFile } from "remotion";

const VI =
  "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export const SCRIPT = "NG Dancing Script";
export const SANS = "NG Be Vietnam Pro";

const faces: [string, string, string][] = [
  [SCRIPT, "dancing-script", "700"],
  [SANS, "be-vietnam-pro", "700"],
  [SANS, "be-vietnam-pro", "800"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading local fonts");
  const loads: Promise<FontFace>[] = [];
  for (const [family, file, weight] of faces) {
    for (const [sub, range] of [
      ["vietnamese", VI],
      ["latin", LATIN],
    ]) {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}-${sub}-${weight}-normal.woff2`)}) format("woff2")`, {
        weight,
        unicodeRange: range,
      });
      document.fonts.add(face);
      loads.push(face.load());
    }
  }
  Promise.all(loads)
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
