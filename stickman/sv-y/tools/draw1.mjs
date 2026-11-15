// Story artwork, part 1: alarm, coffee, ward rounds, "they ask you"
import { canvas, save, pen, circle, oval, dot, shape, rectP, text, figure, head, armOnly, ell, reseed, C, INK, fillPath } from './kit.mjs';
import { createRequire } from 'node:module';
const require = createRequire('/home/user/Phim-hoat-hinh/.claude/skills/directing-stickman-videos/package.json');
const { GlobalFonts } = require('@napi-rs/canvas');
GlobalFonts.registerFromPath('/home/user/Phim-hoat-hinh/stickman/sv-y/fonts/PatrickHand-Regular.ttf', 'Patrick Hand');
const OUT = '/home/user/Phim-hoat-hinh/stickman/sv-y/art/';
const A = {};
const put = (name, c) => { A[name] = save(c, OUT + name + '.png'); };

// ---------- S1 / S11: the bed (side view), sleeping, jolted awake, smiling awake
function bed(ctx) {
  shape(ctx, rectP(40, 330, 720, 60, 8), C.cream, { w: 4 });                                  // mattress
  pen(ctx, [[60, 390], [60, 470]], { w: 5 }); pen(ctx, [[740, 390], [740, 470]], { w: 5 });     // legs
  pen(ctx, [[40, 360], [40, 200], [70, 190], [70, 330]], { w: 4.4 });                           // headboard
  shape(ctx, rectP(80, 290, 140, 48, 20), '#fff', { w: 3.6 });                                  // pillow
}
function blanket(ctx, y0 = 300) { shape(ctx, [[200, y0], [500, y0 - 30], [740, y0 - 10], [760, 360], [200, 360]], C.blue, { w: 4 }); pen(ctx, [[300, y0 + 20], [330, 350]], { w: 2, color: '#5c87a8' }); pen(ctx, [[520, y0], [540, 350]], { w: 2, color: '#5c87a8' }); }
reseed(11); { const c = canvas(800, 500); bed(c.ctx); blanket(c.ctx, 300); head(c.ctx, 160, 270, 34, { eyes: 'closed', brows: 'none', mouth: 'o', hair: 'tuft' }); pen(c.ctx, [[188, 300], [250, 312], [300, 300]], { w: 4.2 }); oval(c.ctx, 306, 298, 9, 7.5, { w: 3, fill: '#fffdf8' }); put('bed_sleep', c); }
reseed(12); { const c = canvas(800, 500); bed(c.ctx); blanket(c.ctx, 320);
  const f = figure(c.ctx, 250, 330, { lean: -8, noLegs: true, arms: { L: [-115, -150], R: [115, 150] }, hair: 'messy', face: { eyes: 'wide', brows: 'up', mouth: 'scream', sweat: [[1.1, -0.4]] } });
  put('bed_awake', c); }
reseed(13); { const c = canvas(800, 500); bed(c.ctx); blanket(c.ctx, 320);
  figure(c.ctx, 250, 330, { lean: 4, noLegs: true, steth: true, arms: { L: [-40, -10], R: [120, 160] }, hair: 'messy', face: { eyes: 'happy', brows: 'up', mouth: 'grin', blush: true } });
  put('bed_smile', c); }
reseed(14); { const c = canvas(230, 260); const ctx = c.ctx;            // the alarm clock
  circle(ctx, 115, 140, 78, { w: 4.4, fill: C.red }); circle(ctx, 115, 140, 58, { w: 3.4, fill: '#fff' });
  circle(ctx, 62, 56, 24, { w: 3.6, fill: C.yellow }); circle(ctx, 168, 56, 24, { w: 3.6, fill: C.yellow });
  pen(ctx, [[115, 140], [115, 98]], { w: 4.6 }); pen(ctx, [[115, 140], [142, 152]], { w: 4.2 }); dot(ctx, 115, 140, 5);
  pen(ctx, [[70, 210], [52, 240]], { w: 4.4 }); pen(ctx, [[160, 210], [178, 240]], { w: 4.4 });
  for (const [a, b] of [[[18, 120], [2, 112]], [[212, 120], [228, 112]], [[24, 160], [6, 170]], [[206, 160], [224, 170]]]) pen(ctx, [a, b], { w: 3 });
  put('alarm', c); }
reseed(15); { const c = canvas(300, 300); const ctx = c.ctx;            // the window at night, with the moon
  shape(ctx, rectP(20, 20, 260, 260, 6), '#3a4a72', { w: 4.4 }); pen(ctx, [[150, 20], [150, 280]], { w: 3.6 }); pen(ctx, [[20, 150], [280, 150]], { w: 3.6 });
  shape(ctx, [...ell(90, 80, 34, 34, -1.2, 2.2, 16), ...ell(104, 74, 26, 26, 2.0, -1.0, 16)], C.yellow, { w: 2.6 });
  for (const [x, y] of [[210, 60], [230, 110], [60, 210], [210, 220]]) { pen(ctx, [[x - 7, y], [x + 7, y]], { w: 2.4, color: '#fff' }); pen(ctx, [[x, y - 7], [x, y + 7]], { w: 2.4, color: '#fff' }); }
  put('window_night', c); }

// ---------- S2: coffee, half-awake; brain loading bar
reseed(21); { const c = canvas(420, 560); const f = figure(c.ctx, 200, 340, { lean: 6, tilt: 10, steth: false, skipArm: 'R', arms: { L: [-14, -6] }, legs: { L: [-8, -2], R: [10, 4] }, hair: 'messy', face: { eyes: 'half', brows: 'worried', mouth: 'wavy' } });
  A.coffee_shoulder = f.shoulder; put('coffee_body', c); }
reseed(22); { const c = canvas(300, 260); const ctx = c.ctx;            // arm + mug (pivot at the shoulder, 40,200)
  const hd = armOnly(ctx, 40, 200, 60, 160); shape(ctx, rectP(hd[0] - 4, hd[1] - 54, 58, 64, 8), C.cream, { w: 3.8 }); pen(ctx, [[hd[0] + 54, hd[1] - 40], [hd[0] + 72, hd[1] - 30], [hd[0] + 54, hd[1] - 14]], { w: 3.4 });
  pen(ctx, [[hd[0] + 6, hd[1] - 38], [hd[0] + 46, hd[1] - 38]], { w: 2, color: C.red }); oval(ctx, hd[0], hd[1], 9, 7.5, { w: 3, fill: '#fffdf8' });
  A.mug_top = [hd[0] + 25, hd[1] - 56]; put('arm_mug', c); }
reseed(23); { const c = canvas(90, 120); for (let i = 0; i < 3; i++) pen(c.ctx, [[20 + i * 25, 110], [10 + i * 25, 80], [28 + i * 25, 50], [16 + i * 25, 15]], { w: 3, color: '#9aa3ab' }); put('steam', c); }
reseed(24); { const c = canvas(240, 190); const ctx = c.ctx;            // the brain doodle
  const B = [...ell(120, 95, 100, 72, Math.PI, Math.PI * 2, 20), ...ell(120, 110, 100, 60, 0, Math.PI, 20)];
  shape(ctx, B, C.pink, { w: 4 }); pen(ctx, [[120, 30], [112, 70], [128, 110], [118, 165]], { w: 3 });
  for (const P of [[[50, 80], [80, 70], [90, 100]], [[160, 60], [190, 85], [170, 110]], [[60, 130], [90, 120]], [[150, 140], [185, 130]]]) pen(ctx, P, { w: 2.6 });
  put('brain', c); }
reseed(25); { const c = canvas(520, 80); shape(c.ctx, rectP(10, 14, 500, 52, 14), '#fff', { w: 4 }); put('loadbar_frame', c); }
reseed(26); for (const [nm, w] of [['loadbar_fill1', 22], ['loadbar_fill2', 44], ['loadbar_fill3', 62]]) { const c = canvas(w + 6, 40); fillPath(c.ctx, rectP(2, 4, w, 32, 8), C.green); put(nm, c); }

// ---------- S3: ward rounds. Two doctors stride right; the student trails with a notebook; a duckling
reseed(31); { const c = canvas(330, 560); figure(c.ctx, 160, 330, { lean: 6, coat: true, steth: true, glasses: true, hair: 'bald', arms: { L: [-25, -10], R: [60, 140] }, legs: { L: [-22, -8], R: [24, 6] }, face: { eyes: 'open', brows: 'flat', mouth: 'flat', look: 1 } });
  shape(c.ctx, rectP(228, 150, 56, 72, 4), C.cream, { w: 3.4 }); put('doctor1', c); }
reseed(32); { const c = canvas(330, 560); figure(c.ctx, 160, 330, { lean: 4, coat: true, hair: 'bun', arms: { L: [-30, -12], R: [30, 70] }, legs: { L: [20, 6], R: [-18, -6] }, face: { eyes: 'open', brows: 'flat', mouth: 'smile', look: 1 } }); put('doctor2', c); }
reseed(33); { const c = canvas(360, 560); const ctx = c.ctx;
  const f = figure(ctx, 170, 330, { lean: 10, coat: true, steth: true, badge: true, hair: 'tuft', arms: { L: [70, 120], R: [55, 160] }, legs: { L: [-20, -6], R: [22, 4] }, face: { eyes: 'open', brows: 'worried', mouth: 'wavy', look: 1, sweat: [[-1.1, -0.3]] } });
  shape(ctx, [[f.hands.L[0] - 10, f.hands.L[1] - 50], [f.hands.L[0] + 60, f.hands.L[1] - 60], [f.hands.L[0] + 64, f.hands.L[1] + 10], [f.hands.L[0] - 6, f.hands.L[1] + 18]], '#fff', { w: 3.4 });
  for (let i = 0; i < 3; i++) pen(ctx, [[f.hands.L[0] + 4, f.hands.L[1] - 36 + i * 14], [f.hands.L[0] + 48, f.hands.L[1] - 40 + i * 14]], { w: 1.8, color: '#7f8a93' });
  A.note_pen = f.hands.R; put('student_note', c); }
reseed(34); { const c = canvas(150, 140); const ctx = c.ctx;            // the duckling
  shape(ctx, [...ell(70, 95, 52, 34, 0, Math.PI * 2, 24)], C.yellow, { w: 3.6 }); circle(ctx, 104, 52, 26, { w: 3.6, fill: C.yellow }); dot(ctx, 110, 46, 4, 5);
  shape(ctx, [[126, 52], [146, 58], [126, 64]], '#f08c3a', { w: 2.6 }); pen(ctx, [[60, 128], [56, 138]], { w: 3, color: '#f08c3a' }); pen(ctx, [[84, 128], [88, 138]], { w: 3, color: '#f08c3a' });
  put('duck', c); }
reseed(35); { const c = canvas(560, 240); const ctx = c.ctx;            // thought bubble
  shape(ctx, [...ell(280, 100, 262, 86, 0, Math.PI * 2, 48)], '#fff', { w: 3.8 }); circle(ctx, 90, 196, 16, { w: 3, fill: '#fff' }); circle(ctx, 60, 226, 9, { w: 2.6, fill: '#fff' });
  put('thought', c); }

// ---------- S4: they ask you (close-up)
reseed(41); { const c = canvas(440, 560); figure(c.ctx, 210, 470, { s: 1.35, lean: -6, coat: true, glasses: true, hair: 'bald', arms: { L: [-30, -15], R: [95, 92] }, noLegs: true, face: { eyes: 'open', brows: 'angry', mouth: 'smile', look: 1 } }); put('ask_doctor', c); }
reseed(42); { const c = canvas(440, 560); figure(c.ctx, 220, 500, { s: 1.6, lean: -4, steth: true, hair: 'messy', arms: { L: [-120, -160], R: [120, 160] }, noLegs: true, face: { eyes: 'wide', brows: 'up', mouth: 'scream', look: -1, sweat: [[-1.15, -0.3], [1.2, -0.1]] } }); put('ask_student', c); }
reseed(43); { const c = canvas(60, 80); shape(c.ctx, [[30, 6], [48, 46], [30, 70], [12, 46]], C.blue, { w: 2.6 }); put('drop', c); }

import fs from 'node:fs';
fs.writeFileSync(OUT + 'assets1.json', JSON.stringify(A, null, 1));
console.log(Object.keys(A).length, 'assets');
