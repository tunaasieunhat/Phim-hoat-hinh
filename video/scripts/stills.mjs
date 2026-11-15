// Render several stills of a composition from one bundle: node scripts/stills.mjs <compId> <outDir> <frame...> [--scale 0.5]
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const si = args.indexOf("--scale");
const scale = si >= 0 ? Number(args.splice(si, 2)[1]) : 0.5;
const [id, outDir, ...frames] = args;
const browserExecutable = process.env.REMOTION_BROWSER || null;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: Number(f), output, scale, browserExecutable });
  console.log(output);
}
