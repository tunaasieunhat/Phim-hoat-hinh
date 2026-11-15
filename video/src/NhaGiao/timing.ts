// Timing and camera path for the 20/11 video (30 fps, 900 frames).

export const FPS = 30;
export const DURATION = 900;
export const W = 1920;
export const H = 1080;
export const GROUND = 860;

// World x-offset of each scene (scenes are laid side by side in one long world)
export const SCENE_X = [0, 1920, 3840, 5760, 7680];

// Voice-over lines: start frame, length (frames) and the subtitle text
export const LINES = [
  { from: 20, dur: 80, file: "voice/line1.wav", text: "Hai mươi tháng mười một, Ngày Nhà giáo Việt Nam." },
  { from: 178, dur: 122, file: "voice/line2.wav", text: "Có những người lặng lẽ đứng trên bục giảng, ngày ngày gieo từng con chữ." },
  { from: 352, dur: 116, file: "voice/line3.wav", text: "Từ nét chữ đầu tiên, thầy cô chắp cánh cho bao ước mơ bay xa." },
  { from: 528, dur: 110, file: "voice/line4.wav", text: "Thầy cô là người lái đò, đưa chúng em sang bến bờ tri thức." },
  { from: 702, dur: 178, file: "voice/line5.wav", text: "Xin gửi lời tri ân sâu sắc nhất đến tất cả thầy cô. Chúc thầy cô luôn mạnh khỏe và hạnh phúc." },
];

// Camera keyframes: [frame, left edge of the view in world px].
// Strictly increasing, so the monotone spline never stops: one continuous move.
const CAM: [number, number][] = [
  [0, -90],
  [115, 50],
  [178, 1870],
  [300, 2000],
  [355, 3780],
  [470, 3905],
  [528, 5700],
  [645, 5830],
  [700, 7610],
  [900, 7720],
];

// Fritsch-Carlson monotone cubic interpolation
const tangents = (() => {
  const n = CAM.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    d.push((CAM[i + 1][1] - CAM[i][1]) / (CAM[i + 1][0] - CAM[i][0]));
  }
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i++) {
    m.push(d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]));
  }
  m.push(d[n - 2]);
  return m;
})();

export const camX = (f: number): number => {
  if (f <= CAM[0][0]) return CAM[0][1];
  const last = CAM[CAM.length - 1];
  if (f >= last[0]) return last[1] + tangents[CAM.length - 1] * (f - last[0]);
  let i = 0;
  while (f > CAM[i + 1][0]) i++;
  const [t0, x0] = CAM[i];
  const [t1, x1] = CAM[i + 1];
  const h = t1 - t0;
  const s = (f - t0) / h;
  const s2 = s * s;
  const s3 = s2 * s;
  return (
    (2 * s3 - 3 * s2 + 1) * x0 +
    (s3 - 2 * s2 + s) * h * tangents[i] +
    (-2 * s3 + 3 * s2) * x1 +
    (s3 - s2) * h * tangents[i + 1]
  );
};

export const camSpeed = (f: number) => camX(f + 0.5) - camX(f - 0.5);
