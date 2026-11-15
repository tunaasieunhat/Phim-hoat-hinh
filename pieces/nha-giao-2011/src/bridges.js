// =====================================================================
//  ERAS, CAMERAS, BRIDGES (kit/morph.js). Bridge objects are ≥ 200px on screen at the boundary.
// =====================================================================
const ERA_BG = ['#bfe0ee', '#c08048', '#26315f', '#7d8ea0', '#8c7ad8', '#efe2c2', '#efe2c2', '#bfe0ee', '#f8c3d4'];
const HANDS = [408, 1192];   // where the mother's and the child's hands meet in sGate
function pieceCam(era, t) {
  const [a0, a1] = [ERA_LIST[era][0], ERA_LIST[era][1]];
  if (era === 0) return push(t, a1 - 2.4, a1 - 0.7, { z: 2.0, p: HANDS, to: [520, 960] });                 // into the clasped hands
  if (era === 1) return push(t, a1 - 1.5, a1 - 0.6, { z: 2.4, p: [632, 700], to: [540, 820] });         // into the letter o
  if (era === 2) return push(t, a1 - 1.1, a1 - 0.55, { z: 2.6, p: [760, 360], to: [540, 760] });         // up to the big paper star
  if (era === 3) return push(t, a0 + 0.4, CU.umbrella - 0.2, { z: 1.25, p: [470, 1150], to: [520, 1050] }, CU.umbrella, CU.umbrella + 0.9);   // close on her tears, pull back for the umbrella
  if (era === 5) return push(t, a0 + 0.8, a1 - 0.2, { z: 1.12, p: [540, 900], to: [540, 900] });          // a slow push into the empty room
  if (era === 7) return push(t, CU.offer, a1 - 0.7, { z: 1.7, p: [620, 1100], to: [540, 1000] });          // in on the offered flower
  return null;
}
const BRIDGES = [
  { tc: T1, A: () => ({ P: ellipsePts(HANDS[0], HANDS[1], 90, 75, 0, 64), c: PAL.skin1 }), B: () => ({ P: ellipsePts(560, 920, 230, 170, 0.5, 64), c: PAL.skin2 }) },   // clasped hands -> hand over hand
  { tc: T2, A: () => ({ P: ellipsePts(632, 700, 62, 66, 0, 64), c: PAL.navy }), B: () => ({ P: ellipsePts(200, 1060, 110, 110, 0, 64), c: '#5ba4d6' }) },          // the letter o -> the globe
  { tc: T3, A: () => ({ P: starPts(760, 360, 52, 5, -Math.PI / 2, 96), c: PAL.yellow }), B: () => ({ P: dropPts(540, 700, 120), c: '#aac3d6' }) },              // a paper star -> a raindrop
  { tc: T4, A: () => ({ P: umbrellaPts(486, 522, 290), c: PAL.yellow }), B: () => ({ P: capPts(GROW_SPOT[0], 811, 120), c: PAL.ink }) },                        // the umbrella -> the graduation cap
  { tc: T5, A: () => ({ P: rect(390, 420, 290, 420, 14), c: '#9fd0a0' }), B: () => ({ P: rect(960, 380, 160, 420, 4), c: '#a9d4e8' }) },                       // a bus window -> the classroom window
  { tc: T7, A: () => ({ P: ellipsePts(903, 1059, 120, 100, 0, 64), c: PAL.skin1 }), B: () => ({ P: ellipsePts(567, 1301, 120, 100, 0, 64), c: PAL.skin1 }) },    // her hand -> the small hand with the flower
  { tc: T8, A: () => ({ P: flowerPts(673, 1158, 1.0), c: PAL.orange }), B: () => ({ P: flowerPts(540, 1080, 3.4), c: PAL.orange }) },                            // the flower -> the bouquet
];
function dropPts(x, y, r) { const P = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU - Math.PI / 2; const k = Math.sin(a) < 0 ? 1 - 0.75 * Math.pow(-Math.sin(a), 2.5) * 0 : 1; P.push([x + Math.cos(a) * r * (Math.sin(a) < 0 ? (1 + Math.sin(a)) * 0.9 + 0.1 : 1), y + Math.sin(a) * r * (Math.sin(a) < 0 ? 1.6 : 1)]); } return P; }
