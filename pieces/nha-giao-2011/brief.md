# Brief: Tri ân thầy cô — 20/11

## Spec
- 1080×1920 (9:16), 24 fps, 120 BPM grid, 50.625 s = 1215 frames.
- Style: cut paper (skill `animate`). Font: Patrick Hand (SIL OFL), installed locally in `~/.fonts` — it covers Vietnamese.
- Format: F2 morph chain across worlds, voice-led; 7 shape morphs, 1 hard cut (the payoff).
- Hero: a girl who grows up; identity cue = teal hair clips. **Orange = the paper flower (gratitude) only.**
- Device: every era she brings her teacher an orange flower; twenty years later she is the teacher and a small child brings it to her. The end is the start, changed (the school gate, the hand that "không dám buông").

## Voice
- VieNeu-TTS v3 Turbo, voice "Thùy Dung" (offline). 3 takes per line, the take faster-whisper (small, vi) hears closest to the script is kept (`voice/pick_takes.py`, scores in `voice/takes.json`), slowed to 85 % with ffmpeg atempo.
- Word times: `tools/voice.mjs --model small --lang vi` (106/122 words heard).

## Beats and bridges
| # | era | bridge out |
|---|---|---|
| 1 | Lớp 1, the gate, mother's hand, the flower | clasped hands → hand over hand |
| 2 | ECU: the teacher's hand guides hers, a ă o | the letter o → the globe |
| 3 | Lớp 5: map, globe, paper stars, "vì sao?" | a star → a raindrop |
| 4–5 | Lớp 9: a 3 in the rain; the yellow umbrella; a 9 | the umbrella → the graduation cap |
| 6 | 18 tuổi: graduation, bus, city (she holds her spot) | a bus window → the classroom window |
| 7 | 20 năm sau: the empty classroom; silence | **hard cut** |
| 8 | she is the teacher, chalk "a ă â", 20/11 (loudest hit) | her hand → the small hand |
| 9 | the gate again: a small girl offers her the flower | the flower → the bouquet |
| 10 | bouquet, photos of her teachers, "Tri ân thầy cô", 20.11 | — |

## Claims and sources (checked 2026-11-15)
- "Ngày Nhà giáo Việt Nam · từ 1982": Quyết định 167-HĐBT, 28/9/1982, takes 20/11 as Vietnamese Teachers' Day — daibieunhandan.vn ("Lịch sử ra đời của ngày Nhà giáo Việt Nam 20.11"); pbgdpl.cantho.gov.vn ("Lịch sử, ý nghĩa ngày Nhà giáo Việt Nam 20/11").
- The teacher's words in the rain are illustrative, not a quote.
