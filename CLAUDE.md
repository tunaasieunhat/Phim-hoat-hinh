# CLAUDE.md

Dự án làm **phim hoạt hình ngắn bằng code** (chủ yếu người que), lời dẫn tiếng Anh và phụ đề tiếng Việt, xuất MP4 cho TikTok/YouTube.
Người dùng giao tiếp bằng tiếng Việt, nên trả lời bằng tiếng Việt.

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `video/` | Dự án **Remotion 4.0.543** (React 19, TypeScript). Hầu hết công việc nằm ở đây. |
| `video/content/` | Kịch bản `.md` (mỗi cảnh có các dòng `## Scene N – Tiêu đề (…)`, `**EN:**` và `**VI:**`). |
| `video/src/Root.tsx` | Nơi đăng ký mọi Composition và Still. |
| `video/src/NhaGiao/` | Video 30s về Ngày Nhà giáo 20/11 (`NgayNhaGiao`). |
| `video/src/Kids/` | "Grown-ups vs. Kids": `GrownupsVsKids` (16:9), `GrownupsVsKids3min` (9:16) và Still `GrownupsVsKidsCover`. Chứa rig người que dùng chung (`rig.tsx`). |
| `video/src/Med/` | "POV: một ngày làm sinh viên Y": `PovMedStudent` (9:16). |
| `video/src/IT/` | "POV: một ngày của sinh viên CNTT": `PovITStudent` (9:16), giọng BrianNeural; nhạc chiptune tắt 1 giây trước mỗi câu chốt (`make_it_music.py`). |
| `video/src/Teams/` | "5 kiểu nhóm làm việc": `FiveTypesOfTeams` (9:16), hội thoại nhiều giọng (`scripts/dialogue_narration.py`, xuất cả .srt), nhạc theo từng nhóm (`make_teams_music.py`). |
| `video/src/Sleep/` | "Không ngủ đủ giấc" (không lời, 9:16): `NotEnoughSleep` (đủ 9 cảnh, 2:30) và `NotEnoughSleepPreview` (cảnh 1–3). Chuyển động cảnh 4–9 dùng GSAP timeline (`timeline.ts`); nhạc ngắn strudel trong `scripts/strudel/`. |
| `video/src/Tom/` | "Thiếu ngủ" bản **có lời dẫn** (Tom + Não của Tom, 9:16): `TomNoSleep` (7 cảnh, 1:50). Remotion chỉ render hình + giọng + SFX; nhạc nền được trộn sau bằng `scripts/mix_tom.py` (ffmpeg: tắt nhạc 1 giây trước câu chốt, sidechain hạ nhạc dưới giọng, chuẩn hóa −14 LUFS). |
| `video/src/Rain/` | "Kế hoạch ngày mưa vs. Thực tế" (9:16): `RainyDay` (7 cảnh, 2:27). Hội thoại 4 giọng qua `DIALOGUE=rain python3 scripts/dialogue_narration.py`; chuyển PLAN→REALITY bằng hiệu ứng xé khung (`Tear`, GSAP); mưa + nhạc PLAN/REALITY/lo-fi trộn sau bằng `scripts/mix_rain.py` (sidechain hạ dưới lời, −14 LUFS). |
| `video/src/Toon/` | "Kế hoạch ngày mưa" bản **toon** (kiểu RicksClips, 9:16): `ToonRain` (7 cảnh, 2:31) và `ToonRainPreview` (cảnh 1–2). Nhân vật/bối cảnh/đạo cụ vẽ bằng code theo lớp (`Lily.tsx`, `cast.tsx`, `sets*.tsx`), cắt cảnh 2–3 giây, phụ đề hiện từng từ (mốc từ Edge TTS WordBoundary qua `scripts/toon_narration.py`); mưa + nhạc trộn sau bằng `scripts/mix_toon.py`. |
| `video/src/Free/` | "Nếu mua gì cũng không mất tiền" (kiểu toon, 9:16): `EverythingFree` (7 cảnh, 2:29) + ảnh bìa `EverythingFreeCover`. Dùng lại rig `Toon` (Bob, ông Gus, nhà vua trong `cast.tsx`), lời dẫn + mốc từng từ qua `scripts/free_narration.py`, nhạc theo cảnh trộn bằng `scripts/mix_free.py`; SFX tự tổng hợp `scripts/make_free_sfx.py`. |
| `video/src/Spend/` | "6 kiểu sinh viên khi tiêu tiền" (kiểu toon, 9:16): `StudentSpending` (8 cảnh, 2:39) + ảnh bìa `StudentSpendingCover`; Still `SpendStyle*` là 4 khung thử phong cách B. 6 nhân vật + ví tiền có mặt + lịch "Day X"/số dư (`cast.tsx`), phụ đề kiểu video-nguoi-que; giọng 7 vai qua `scripts/spend_narration.py`, nhạc theo cảnh tắt trước câu chốt bằng `scripts/mix_spend.py`; SFX tự tổng hợp `scripts/make_spend_sfx.py`. |
| `video/public/audio/` | **Kho âm thanh chung:** SFX và nhạc nền tải về, có `CREDITS.md` ghi nguồn/giấy phép. |
| `video/scripts/` | Script tạo lời dẫn, nhạc và ảnh xem thử (xem bên dưới). |
| `video/public/` | Font, audio và SFX mà video dùng qua `staticFile()`. |
| `videos/` | **Sản phẩm cuối** (MP4/ảnh bìa) đã commit để giao cho người dùng. |
| `pieces/` | Dự án làm bằng skill `animate` (video cắt giấy 20/11, dạng canvas). |
| `stickman/` | Dự án làm bằng skill `directing-stickman-videos` (bản B1 sinh viên Y, gói Google Flow). |
| `.claude/skills/` | Skill đã cài: remotion-*, gsap-*, motion, strudel-music, generative-music-audio, ffmpeg-* (âm thanh), animate, cartoon-3d-short, directing-stickman-videos, lemo-opuscar (thư viện style ở `~/lemo-opuscar`, tải lại bằng `sh .claude/skills/lemo-opuscar/scripts/setup.sh` rồi `… deps`), find-skills. Skill `video-nguoi-que` nằm trong tài khoản người dùng. |

## Bộ công cụ mặc định cho video người que

Khi người dùng nhờ làm video người que mà không chỉ định cách khác, dùng bộ này:

| Việc | Công cụ mặc định |
|---|---|
| Quy trình chung | Skill **`video-nguoi-que`** + **Remotion** (dự án `video/`), làm theo các bước bên dưới. |
| Chuyển động | Skill **`gsap-timeline`**: dàn cảnh bằng `gsap.timeline()` có nhãn và tham số vị trí. |
| Hiệu ứng âm thanh | Lấy từ **`video/public/audio/`**. Thiếu âm nào thì bổ sung vào đó (tải nguồn CC0/CC BY, hoặc tự tổng hợp như `scripts/make_sleep_audio.py`) và ghi vào `CREDITS.md`. |
| Nhạc nền | **Ưu tiên file tải về** (nhạc miễn phí bản quyền đặt trong `public/audio/`, ghi công nếu là CC BY). Khi cần **nhạc vui, ngắn** (jingle, đoạn chuyển, cảnh hài vài giây) thì viết bằng skill **`strudel-music`**. |
| Hoàn thiện âm thanh | Bước cuối dùng skill **`ffmpeg-audio-processing`**: chuẩn hóa độ to cho TikTok/YouTube (−14 LUFS, true peak ≤ −1 dBTP). |

**GSAP trong Remotion:** không để GSAP tự chạy theo thời gian thực. Tạo timeline ở trạng thái `paused: true`, rồi mỗi frame gọi `tl.seek(frame / fps)` (hoặc `tl.progress()`). Đọc giá trị từ object được tween để vẽ SVG, nhờ vậy render từng frame luôn ra cùng một kết quả. Rig người que (`rig.tsx`) vẫn dùng cho tư thế; GSAP lo nhịp và easing của chuyển động.

**strudel-music ở phiên mới:** cần cài lại một lần bằng `cd .claude/skills/strudel-music && npm install && bash scripts/download-samples.sh` (không commit `node_modules` và `samples`). Tự viết bài mới, không "clone" nhạc của nghệ sĩ thật. Với video đăng công khai, ưu tiên âm tổng hợp thay cho trống mẫu Dirt-Samples (giấy phép chưa kiểm).

**Chuẩn hóa cuối cùng** (sau khi Remotion render xong):
```bash
# đo trước
ffmpeg -nostats -i out/<file>.mp4 -af ebur128 -f null - 2>&1 | grep -A2 Integrated
# chuẩn hóa 2 lượt: lượt 1 đo (print_format=json), lượt 2 áp measured_* vào loudnorm, giữ nguyên hình
PRE="alimiter=limit=0.56:level=false:attack=1:release=50"   # hạ các đỉnh SFX trước, để chế độ linear đạt đúng −14
ffmpeg -i out/<file>.mp4 -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=20:print_format=json" -f null -
ffmpeg -i out/<file>.mp4 -c:v copy -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=20:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:offset=..:linear=true,aresample=48000" -c:a aac -b:a 192k -movflags +faststart out/<file>-final.mp4
```
Kiểm tra lại bằng `ebur128=peak=true`: I ≈ −14 LUFS, Peak ≤ −1 dBFS (bản "không ngủ đủ giấc": −14,3 / −1,2).

## Quy trình làm một video người que mới (Remotion)

1. Đặt kịch bản vào `video/content/<ten>.md` theo đúng định dạng Scene/EN/VI.
2. **Lời dẫn và thời gian phụ đề:** thêm một nhánh `VARIANT` vào `video/scripts/kids_narration.py` để khai báo giọng, tốc độ, khoảng lặng, kịch bản, thư mục public và file data. Sau đó chạy:
   ```bash
   cd video && KIDS_VARIANT=<ten> SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/kids_narration.py
   ```
   - Script tạo từng câu riêng bằng Edge TTS nên thời gian của mỗi câu là chính xác. Bản tạo được cache ở `.kids-tts/<variant>`; bản hỏng (< 1000 byte) sẽ không được dùng lại.
   - Kết quả: `public/<pub>/audio/sceneN.wav` (đã chuẩn hóa về −16 LUFS) và `src/<Data>.ts` chứa `SCENES` (`frames`, `sentences{t0,t1,en}`, `cues{t0,t1,vi}`).
3. **Nhạc nền và SFX:** theo bộ công cụ mặc định ở trên (SFX từ `public/audio/`; nhạc tải về, hoặc `strudel-music` cho đoạn vui ngắn). Các video cũ tự tổng hợp nhạc bằng Python (`make_kids_music.py`, `make_med_music.py`…); vẫn dùng được khi cần nhạc khớp từng mốc thời gian.
4. **Dựng cảnh:** dùng rig `src/Kids/rig.tsx`.
   - Góc tư thế: `0` = hướng xuống, dương = hướng về +x.
   - Các hàm: `P`, `STAND`, `mix`, `poseAt`, `alive`, `walk`, `tw`, `pop`, `joints()`.
   - Mỗi cảnh là một component SVG nhận `sc: SceneData`. Mốc thời gian lấy theo câu thoại qua `cue(sc)`/`S(i)`.
5. Đăng ký Composition trong `Root.tsx`, với `durationInFrames = tổng frames + END_HOLD`.
6. Render, rồi chuẩn hóa âm thanh bằng `ffmpeg-audio-processing` (−14 LUFS). Chép bản cuối vào `videos/`.

## Lệnh thường dùng (chạy trong `video/`)

```bash
export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx tsc --noEmit                                              # kiểm tra kiểu
node scripts/stills.mjs <CompId> <outDir> 40 900 --scale 0.4  # xem thử nhiều frame từ một bundle
npx remotion render <CompId> out/<file>.mp4 --crf=20          # render đầy đủ
npx remotion still <StillId> out/<file>.png                   # ảnh bìa
ffmpeg -nostats -i out/<file>.mp4 -af ebur128 -f null - 2>&1 | grep -A2 Integrated  # mục tiêu −14 LUFS sau chuẩn hóa
```

Sau khi render xong: chép file vào `videos/`, rồi commit và push.

## Quy ước

- **Phụ đề:** tiếng Anh ở trên (vàng nhạt `#fde68a`, viền tối), tiếng Việt ở dưới (trắng, viền đen), mỗi dòng tối đa 2 hàng. Với khung 9:16, đặt phụ đề quanh y ≈ 1330 để tránh giao diện TikTok.
- **Font:**
  - `KidsHand` = Patrick Hand, dùng cho chữ vẽ tay trong cảnh.
  - `MedSans`/`KidsSans` = Be Vietnam Pro, có khai báo `unicode-range` tiếng Việt.
  - Font được nạp bằng `FontFace` + `delayRender`.
- **Giọng Edge TTS miễn phí:** `en-US-GuyNeural` (Kids), `en-US-AndrewNeural` (Med), `en-US-BrianNeural` (IT). Bản Tom: Andrew đọc chậm 8%, câu trích dùng giọng khác qua `ALT` trong `kids_narration.py`. Phải dùng proxy `HTTPS_PROXY` và `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt`.
- **Âm thanh:** dùng `Audio` của `@remotion/media`. SFX đặt trong `<Sequence layout="none">`. Nhạc nền để volume khoảng 0.15.
- **Kiểm tra trước khi render đầy đủ:** luôn xem vài still để bắt lỗi chồng chữ và lỗi tư thế nhân vật.
- **Khung dọc 9:16:** nền phải phủ kín toàn canvas để không lộ dải trống.

## Git

- Làm việc trên nhánh được giao (hiện là `ccr-efb10a66-3tamly`) và push bằng `git push -u origin <branch>`.
- Không tạo PR trừ khi người dùng yêu cầu.
- Không commit `video/node_modules`, `video/out`, cache `.kids-tts`, hay `node_modules`/`samples` của strudel-music.
- Không đưa API key vào chat hay vào repo.
