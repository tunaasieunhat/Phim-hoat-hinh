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
| `video/scripts/` | Script tạo lời dẫn, nhạc và ảnh xem thử (xem bên dưới). |
| `video/public/` | Font, audio và SFX mà video dùng qua `staticFile()`. |
| `videos/` | **Sản phẩm cuối** (MP4/ảnh bìa) đã commit để giao cho người dùng. |
| `pieces/` | Dự án làm bằng skill `animate` (video cắt giấy 20/11, dạng canvas). |
| `stickman/` | Dự án làm bằng skill `directing-stickman-videos` (bản B1 sinh viên Y, gói Google Flow). |
| `.claude/skills/` | Các skill đã cài: remotion-*, animate, cartoon-3d-short, directing-stickman-videos, find-skills. |

## Quy trình làm một video người que mới (Remotion)

1. Đặt kịch bản vào `video/content/<ten>.md` theo đúng định dạng Scene/EN/VI.
2. **Lời dẫn và thời gian phụ đề:** thêm một nhánh `VARIANT` vào `video/scripts/kids_narration.py` để khai báo giọng, tốc độ, khoảng lặng, kịch bản, thư mục public và file data. Sau đó chạy:
   ```bash
   cd video && KIDS_VARIANT=<ten> SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/kids_narration.py
   ```
   - Script tạo từng câu riêng bằng Edge TTS nên thời gian của mỗi câu là chính xác. Bản tạo được cache ở `.kids-tts/<variant>`; bản hỏng (< 1000 byte) sẽ không được dùng lại.
   - Kết quả: `public/<pub>/audio/sceneN.wav` (đã chuẩn hóa về −16 LUFS) và `src/<Data>.ts` chứa `SCENES` (`frames`, `sentences{t0,t1,en}`, `cues{t0,t1,vi}`).
3. **Nhạc nền và SFX:** tổng hợp bằng Python (`make_kids_music.py`, `make_med_music.py`); độ dài lấy từ data. SFX miễn phí bản quyền (CC0) ghi nguồn trong `public/<pub>/CREDITS.md`.
4. **Dựng cảnh:** dùng rig `src/Kids/rig.tsx`.
   - Góc tư thế: `0` = hướng xuống, dương = hướng về +x.
   - Các hàm: `P`, `STAND`, `mix`, `poseAt`, `alive`, `walk`, `tw`, `pop`, `joints()`.
   - Mỗi cảnh là một component SVG nhận `sc: SceneData`. Mốc thời gian lấy theo câu thoại qua `cue(sc)`/`S(i)`.
5. Đăng ký Composition trong `Root.tsx`, với `durationInFrames = tổng frames + END_HOLD`.

## Lệnh thường dùng (chạy trong `video/`)

```bash
export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx tsc --noEmit                                              # kiểm tra kiểu
node scripts/stills.mjs <CompId> <outDir> 40 900 --scale 0.4  # xem thử nhiều frame từ một bundle
npx remotion render <CompId> out/<file>.mp4 --crf=20          # render đầy đủ
npx remotion still <StillId> out/<file>.png                   # ảnh bìa
ffmpeg -nostats -i out/<file>.mp4 -af ebur128 -f null - 2>&1 | grep -A2 Integrated  # mục tiêu −14…−16 LUFS
```

Sau khi render xong: chép file vào `videos/`, rồi commit và push.

## Quy ước

- **Phụ đề:** tiếng Anh ở trên (vàng nhạt `#fde68a`, viền tối), tiếng Việt ở dưới (trắng, viền đen), mỗi dòng tối đa 2 hàng. Với khung 9:16, đặt phụ đề quanh y ≈ 1330 để tránh giao diện TikTok.
- **Font:**
  - `KidsHand` = Patrick Hand, dùng cho chữ vẽ tay trong cảnh.
  - `MedSans`/`KidsSans` = Be Vietnam Pro, có khai báo `unicode-range` tiếng Việt.
  - Font được nạp bằng `FontFace` + `delayRender`.
- **Giọng Edge TTS miễn phí:** `en-US-GuyNeural` (Kids), `en-US-AndrewNeural` (Med), `en-US-BrianNeural` (IT). Phải dùng proxy `HTTPS_PROXY` và `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt`.
- **Âm thanh:** dùng `Audio` của `@remotion/media`. SFX đặt trong `<Sequence layout="none">`. Nhạc nền để volume khoảng 0.15.
- **Kiểm tra trước khi render đầy đủ:** luôn xem vài still để bắt lỗi chồng chữ và lỗi tư thế nhân vật.
- **Khung dọc 9:16:** nền phải phủ kín toàn canvas để không lộ dải trống.

## Git

- Làm việc trên nhánh được giao (hiện là `ccr-efb10a66-3tamly`) và push bằng `git push -u origin <branch>`.
- Không tạo PR trừ khi người dùng yêu cầu.
- Không commit `video/node_modules`, `video/out` hay cache `.kids-tts`.
- Không đưa API key vào chat hay vào repo.
