// Story artwork, part 2: anatomy lab, lunch, skills lab, first patient, library, midnight, ending
import { canvas, save, pen, circle, oval, dot, shape, rectP, text, figure, head, armOnly, ell, reseed, C, INK, fillPath, P2 } from './kit.mjs';
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos/package.json');
const { GlobalFonts } = require('@napi-rs/canvas');
GlobalFonts.registerFromPath('/home/user/Phim-hoat-hinh/stickman/sv-y/fonts/PatrickHand-Regular.ttf', 'Patrick Hand');
const OUT = '/home/user/Phim-hoat-hinh/stickman/sv-y/art/';
const A = {};
const put = (name, c) => { A[name] = save(c, OUT + name + '.png'); };

// ---------- S5: the anatomy skeleton model, lounging; the student under a tower of books
function skeleton(ctx, x, y) {   // (x, y) = pelvis; arms folded behind the skull, one leg crossed
  pen(ctx, [[x, y + 150], [x, y + 330]], { w: 5, color: '#8a7f78' }); shape(ctx, rectP(x - 60, y + 330, 120, 16, 6), '#c9c6bf', { w: 3.4 });   // stand
  shape(ctx, [[x - 34, y - 6], [x + 34, y - 6], [x + 24, y + 22], [x, y + 30], [x - 24, y + 22]], '#fbf7ec', { w: 3.4 });                          // pelvis
  for (let i = 0; i < 6; i++) pen(ctx, [[x - 4, y - 14 - i * 22], [x + 4, y - 14 - i * 22]], { w: 6 });                                          // spine
  pen(ctx, [[x, y - 6], [x, y - 140]], { w: 3 });
  for (let i = 0; i < 4; i++) { pen(ctx, ell(x, y - 100 + i * 18, 46 - i * 4, 14, Math.PI, Math.PI * 2, 12), { w: 3 }); }                     // ribs
  const nk = [x, y - 150]; circle(ctx, x + 6, y - 196, 44, { w: 4.2, fill: '#fbf7ec' });                                                         // skull
  dot(ctx, x - 9, y - 198, 10, 12); dot(ctx, x + 21, y - 198, 10, 12); pen(ctx, [[x + 2, y - 180], [x + 8, y - 172]], { w: 2.6 });
  pen(ctx, ell(x + 6, y - 172, 20, 10, 0.2, Math.PI - 0.2, 10), { w: 3 }); for (let i = -2; i <= 2; i++) pen(ctx, [[x + 6 + i * 7, y - 166], [x + 6 + i * 7, y - 158]], { w: 1.8 });
  pen(ctx, [[x - 40, y - 140], [x - 70, y - 210], [x - 20, y - 236]], { w: 4.2 }); pen(ctx, [[x + 40, y - 140], [x + 82, y - 214], [x + 34, y - 238]], { w: 4.2 });   // hands behind the skull
  pen(ctx, [[x - 20, y + 20], [x - 30, y + 120], [x - 20, y + 220]], { w: 4.2 }); pen(ctx, [[x + 20, y + 20], [x - 40, y + 90], [x + 40, y + 120]], { w: 4.2 });   // legs, one crossed
}
reseed(51); { const c = canvas(300, 620); skeleton(c.ctx, 140, 280); put('skeleton', c); }
reseed(52); { const c = canvas(150, 60); const ctx = c.ctx; shape(ctx, ell(38, 30, 32, 22), INK, { w: 3 }); shape(ctx, ell(108, 30, 32, 22), INK, { w: 3 }); pen(ctx, [[70, 26], [76, 26]], { w: 4 }); put('sunglasses', c); }
reseed(53); { const c = canvas(400, 640); const ctx = c.ctx;
  const f = figure(ctx, 190, 470, { lean: -8, steth: true, coat: true, arms: { L: [-150, -175], R: [150, 175] }, legs: { L: [-25, -10], R: [25, 12] }, hair: 'messy', face: { eyes: 'squint', brows: 'worried', mouth: 'frown', sweat: [[1.15, -0.3]] } });
  const cols = [C.red, C.blue, C.green, C.yellow, C.pink, C.teal, C.cream]; let y = f.hands.L[1] - 4;
  for (let i = 0; i < 7; i++) { const w = 150 - (i % 3) * 14, h = 30; shape(ctx, rectP(190 - w / 2 + (i % 2 ? 8 : -6), y - h, w, h, 4), cols[i], { w: 3.2 }); y -= h; }
  put('student_books', c); }
reseed(54); { const c = canvas(110, 50); const ctx = c.ctx; shape(ctx, [...ell(18, 16, 13, 12, 0, 6.3, 12)], '#fbf7ec', { w: 3 }); shape(ctx, [...ell(18, 36, 13, 12, 0, 6.3, 12)], '#fbf7ec', { w: 3 }); shape(ctx, [...ell(92, 16, 13, 12, 0, 6.3, 12)], '#fbf7ec', { w: 3 }); shape(ctx, [...ell(92, 36, 13, 12, 0, 6.3, 12)], '#fbf7ec', { w: 3 }); shape(ctx, rectP(24, 16, 62, 20, 6), '#fbf7ec', { w: 3 }); put('bone', c); }

// ---------- S6: lunch in four minutes; standing, eating like a horse
reseed(61); { const c = canvas(380, 560); const f = figure(c.ctx, 170, 340, { lean: -2, coat: true, steth: true, skipArm: 'R', arms: { L: [-20, -8] }, hair: 'messy', face: { eyes: 'open', brows: 'up', mouth: 'chomp', look: 1 } }); A.lunch_shoulder = f.shoulder; put('lunch_body', c); }
reseed(62); { const c = canvas(300, 260); const ctx = c.ctx; const hd = armOnly(ctx, 40, 200, 60, 160);   // arm + bánh mì, pivot (40,200)
  shape(ctx, [...ell(hd[0] + 30, hd[1] - 14, 70, 22, Math.PI, Math.PI * 2, 18), ...ell(hd[0] + 30, hd[1] - 8, 70, 16, 0, Math.PI, 18)], '#e7b86a', { w: 3.6 });
  pen(ctx, [[hd[0] - 24, hd[1] - 12], [hd[0] + 84, hd[1] - 12]], { w: 3, color: C.green }); for (let i = 0; i < 4; i++) pen(ctx, [[hd[0] + i * 26 - 10, hd[1] - 28], [hd[0] + i * 26, hd[1] - 22]], { w: 2.2 });
  oval(ctx, hd[0], hd[1], 9, 7.5, { w: 3, fill: '#fffdf8' }); put('arm_banhmi', c); }
reseed(63); { const c = canvas(470, 440); const ctx = c.ctx;     // a line-art horse, munching
  shape(ctx, ell(220, 210, 140, 70), '#fffdf8', { w: 4 });
  shape(ctx, [[320, 170], [370, 70], [420, 60], [450, 92], [440, 120], [400, 118], [372, 196]], '#fffdf8', { w: 4 });
  pen(ctx, [[370, 70], [358, 40], [384, 62]], { w: 3.4 }); dot(ctx, 404, 80, 5, 6); dot(ctx, 442, 100, 3, 3);
  for (let i = 0; i < 6; i++) pen(ctx, [[372 - i * 9, 74 + i * 18], [350 - i * 9, 84 + i * 18]], { w: 3, color: C.brown });
  for (const x of [130, 170, 280, 320]) pen(ctx, [[x, 260], [x + (x % 20 ? 4 : -4), 400]], { w: 4.2 });
  pen(ctx, [[82, 200], [40, 260], [60, 300]], { w: 3.6, color: C.brown });
  shape(ctx, [...ell(470 - 26, 130, 32, 12, Math.PI, Math.PI * 2, 10), ...ell(444, 134, 32, 9, 0, Math.PI, 10)], '#e7b86a', { w: 3 });
  put('horse', c); }
reseed(64); { const c = canvas(220, 220); circle(c.ctx, 110, 110, 92, { w: 4.4, fill: '#fff' }); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; pen(c.ctx, [[110 + Math.cos(a) * 74, 110 + Math.sin(a) * 74], [110 + Math.cos(a) * 84, 110 + Math.sin(a) * 84]], { w: 3 }); } fillPath(c.ctx, [[110, 110], ...ell(110, 110, 70, 70, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 4 / 60, 8)], 'rgba(226,72,61,0.55)'); dot(c.ctx, 110, 110, 6); put('timer', c); }
reseed(65); { const c = canvas(20, 160); pen(c.ctx, [[10, 150], [10, 86]], { w: 5, color: C.red }); put('timer_hand', c); }

// ---------- S7: skills lab — the pig's foot, stitches, a shaky needle holder
reseed(71); { const c = canvas(640, 360); const ctx = c.ctx;
  shape(ctx, rectP(20, 210, 600, 34, 6), C.cream, { w: 4 }); pen(ctx, [[60, 244], [60, 350]], { w: 4.6 }); pen(ctx, [[580, 244], [580, 350]], { w: 4.6 });
  shape(ctx, rectP(110, 196, 420, 16, 6), C.blue, { w: 3 });   // the green drape
  shape(ctx, [[150, 196], [170, 110], [260, 90], [420, 96], [490, 120], [500, 196]], C.pink, { w: 4 });   // the pig's foot
  pen(ctx, [[490, 120], [520, 150], [500, 196]], { w: 3.6 }); pen(ctx, [[500, 150], [520, 150]], { w: 3 });
  pen(ctx, [[230, 130], [430, 128]], { w: 3, color: '#b05a63' });   // the cut
  put('pigfoot', c); }
reseed(72); { const c = canvas(30, 50); pen(c.ctx, [[8, 6], [22, 44]], { w: 3.4, color: C.navy }); put('stitch', c); }
reseed(73); { const c = canvas(140, 90); const ctx = c.ctx; dot(ctx, 40, 40, 6, 7); dot(ctx, 90, 40, 6, 7); pen(ctx, ell(65, 54, 22, 14, 0.3, Math.PI - 0.3, 10), { w: 3 }); dot(ctx, 30, 60, 8, 5, 'rgba(226,72,61,0.4)'); dot(ctx, 100, 60, 8, 5, 'rgba(226,72,61,0.4)'); put('pigface', c); }
reseed(74); { const c = canvas(420, 560); const f = figure(c.ctx, 190, 380, { lean: 18, coat: true, steth: true, skipArm: 'R', arms: { L: [40, 80] }, hair: 'messy', legs: { L: [-15, -4], R: [18, 6] }, face: { eyes: 'squint', brows: 'worried', mouth: 'wavy', look: 1, sweat: [[-1.1, -0.4], [1.15, -0.1]] } }); A.suture_shoulder = f.shoulder; put('student_suture', c); }
reseed(75); { const c = canvas(260, 200); const ctx = c.ctx; const hd = armOnly(ctx, 30, 30, 80, 110);   // arm + needle holder, pivot (30,30)
  pen(ctx, [[hd[0], hd[1]], [hd[0] + 70, hd[1] + 36]], { w: 4, color: '#8a8f96' }); pen(ctx, ell(hd[0] + 82, hd[1] + 40, 12, 10, -0.5, 2.6, 8), { w: 2.6, color: '#8a8f96' }); oval(ctx, hd[0], hd[1], 9, 7.5, { w: 3, fill: '#fffdf8' }); put('arm_needle', c); }
reseed(76); { const c = canvas(60, 60); const ctx = c.ctx; for (const [a, b] of [[[30, 4], [30, 56]], [[4, 30], [56, 30]]]) pen(ctx, [a, b], { w: 3.6, color: C.yellow }); put('sparkle', c); }

// ---------- S8: the first patient — her blood pressure, and yours
reseed(81); { const c = canvas(420, 560); const ctx = c.ctx;     // the patient on a stool, the cuff on her arm
  shape(ctx, rectP(120, 380, 160, 22, 6), C.cream, { w: 3.6 }); pen(ctx, [[140, 402], [130, 520]], { w: 4.2 }); pen(ctx, [[260, 402], [270, 520]], { w: 4.2 });
  const f = figure(ctx, 200, 380, { lean: 0, hair: 'bun', arms: { L: [-30, 10], R: [70, 20] }, legs: { L: [70, -5], R: [75, 0] }, face: { eyes: 'happy', brows: 'flat', mouth: 'smile', look: 1, blush: true } });
  shape(ctx, rectP(f.shoulder[0] + 22, f.shoulder[1] + 18, 40, 38, 8), C.navy, { w: 3 });
  put('patient', c); A.cuff_at = [f.shoulder[0] + 62, f.shoulder[1] + 37]; }
reseed(82); { const c = canvas(400, 560); figure(c.ctx, 200, 340, { lean: -10, coat: true, steth: true, badge: true, hair: 'tuft', arms: { L: [-70, -40], R: [-40, -100] }, face: { eyes: 'wide', brows: 'worried', mouth: 'wavy', look: -1, sweat: [[1.15, -0.3]] } }); put('student_bp', c); }
reseed(83); { const c = canvas(240, 240); const ctx = c.ctx; circle(ctx, 120, 120, 100, { w: 4.4, fill: '#fff' });
  for (let i = 0; i <= 10; i++) { const a = Math.PI * 0.75 + i / 10 * Math.PI * 1.5; pen(ctx, [[120 + Math.cos(a) * 78, 120 + Math.sin(a) * 78], [120 + Math.cos(a) * 90, 120 + Math.sin(a) * 90]], { w: i > 7 ? 4 : 2.6, color: i > 7 ? C.red : INK }); }
  dot(ctx, 120, 120, 7); put('gauge', c); }
reseed(84); { const c = canvas(20, 180); pen(c.ctx, [[10, 170], [10, 98]], { w: 4.6, color: C.navy }); put('gauge_needle', c); }

// ---------- S9: the library — a tower of flashcards, three done
reseed(91); { const c = canvas(520, 560); const ctx = c.ctx;
  shape(ctx, rectP(20, 330, 480, 30, 6), C.cream, { w: 4 }); pen(ctx, [[50, 360], [50, 520]], { w: 4.6 }); pen(ctx, [[470, 360], [470, 520]], { w: 4.6 });
  figure(ctx, 330, 460, { lean: -6, steth: true, hair: 'messy', arms: { L: [-60, -110], R: [-30, -95] }, legs: { L: [-80, -10], R: [-70, 0] }, face: { eyes: 'half', brows: 'worried', mouth: 'flat', look: -1 } });
  shape(ctx, [[150, 330], [250, 318], [256, 330]], '#fff', { w: 3 }); put('lib_desk', c); }
reseed(92); { const c = canvas(150, 96); shape(c.ctx, rectP(6, 6, 138, 84, 6), '#fff', { w: 3.4 }); pen(c.ctx, [[22, 30], [120, 30]], { w: 2, color: C.red }); pen(c.ctx, [[22, 52], [100, 52]], { w: 1.8, color: '#9aa3ab' }); put('card', c); }

// ---------- S10: midnight — slumped over chapter 12, a lie grows a nose
reseed(101); { const c = canvas(520, 560); const ctx = c.ctx;
  shape(ctx, rectP(20, 330, 480, 30, 6), C.cream, { w: 4 }); pen(ctx, [[50, 360], [50, 520]], { w: 4.6 }); pen(ctx, [[470, 360], [470, 520]], { w: 4.6 });
  shape(ctx, [[110, 330], [190, 300], [270, 330]], '#fff', { w: 3.4 }); shape(ctx, [[270, 330], [350, 300], [430, 330]], '#fff', { w: 3.4 }); text(ctx, 'Chương 12', 140, 296, 26, C.red);
  const f = figure(ctx, 330, 470, { lean: -38, tilt: -10, steth: true, hair: 'messy', arms: { L: [-80, -95], R: [-60, -90] }, legs: { L: [-80, -10], R: [-70, 0] }, face: { eyes: 'half', brows: 'worried', mouth: 'flat', look: -1 } });
  A.nose_at = [f.head[0] - 30, f.head[1] + 4]; put('mid_desk', c); }
for (const [i, L] of [[1, 30], [2, 70], [3, 120], [4, 170]].entries ? [[1, 30], [2, 70], [3, 120], [4, 170]] : []) { reseed(102 + i); const c = canvas(L + 20, 30); pen(c.ctx, [[L + 14, 15], [12, 14]], { w: 4.2 }); circle(c.ctx, 12, 14, 6, { w: 3, fill: '#fffdf8' }); put('nose' + i, c); }
reseed(103); { const c = canvas(170, 300); const ctx = c.ctx; pen(ctx, [[40, 290], [40, 120], [130, 60]], { w: 4.6 }); shape(ctx, [[100, 20], [160, 40], [150, 110], [80, 90]], C.yellow, { w: 3.6 }); shape(ctx, rectP(10, 280, 70, 16, 5), C.cream, { w: 3 }); put('lamp', c); }
reseed(104); { const c = canvas(120, 120); shape(c.ctx, [...ell(60, 60, 50, 50, -1.2, 2.2, 16), ...ell(76, 52, 38, 38, 2.0, -1.0, 16)], C.yellow, { w: 3 }); put('moon', c); }

// ---------- S11: the heart
for (const [nm, k] of [['heart', 1], ['heart_big', 1.12]]) { reseed(111); const c = canvas(230, 210); const P = [[100, 170], [12, 80], [20, 30], [60, 12], [100, 44], [140, 12], [180, 30], [188, 80]].map(([x, y]) => [115 + (x - 100) * k, 105 + (y - 95) * k]); shape(c.ctx, P, C.red, { w: 4 }); put(nm, c); }

fs.writeFileSync(OUT + 'assets2.json', JSON.stringify(A, null, 1));
console.log(Object.keys(A).length, 'assets');
