# LOG

## Run 1 (2026-11-15)
- Intake: 9:16, 45–60 s, VieNeu "Thùy Dung", hero = a girl who grows up; music composed in code.
- Story, look (3 frames) and storyboard (10 panels) approved by the user without changes.
- Fixed before the look check: long hair read as a beard (now side strands); the kit's `sad` face reads as cross (added `faceV` with rising brows); arm angle sign for the right arm; umbrella covering the teacher's face.
- Fixed after the first review: the groove (27.7 s) was louder than the payoff → removed the sub and lowered plucks/bass in the grow act, a bigger stab + sub on the cut; "TRƯỜNG THCS" under the phone UI → school moved left; the title card sat empty ~3 s → title writes at the era start.

## Review (run 1, final)
| check | result |
|---|---|
| cut on grid (33.5 s) | PASS |
| 7 morphs on the 8th grid | PASS |
| story arc | PASS 4/4 (gift p90 −12.2 vs peak −14.8; silence −120 dB) |
| loudest window | 33.5 s, in the payoff act; 1.4 s at ≤ −40 dBFS before it |
| text | PASS (3 deliberate push-in overlaps allowed in piece.json) |
| dead beats | PASS |
| loudness | −14.4 LUFS, true peak −1.5 dBFS |
| narration density | FAIL by the English rule (≤ 3.5 words/s): 3.8–4.5 *syllables*/s — normal Vietnamese pace (each Vietnamese "word" counted is one syllable) |

| shot | PASS? | note |
|---|---|---|
| 1 gate | PASS | full world, 3+ life details (birds, bunting, cat, flag) |
| 2 write | PASS | extreme close-up; hands cover "a" in the first frames |
| 3 stars | PASS | |
| 4 rain | PASS | |
| 5 grow | PASS | the anchor isn't measured (no spark hero), she is drawn at a fixed spot |
| 6 return | PASS | weakest: her silhouette in the doorway is small at the left edge |
| 7 board | PASS | |
| 8 small hand | PASS | |
| 9 thanks | PASS | |

**Weakest shot:** 6 (the empty classroom) — her entrance is small at the frame edge; a closer door or a push onto it would sell "em trở về".

## Proposed rules (for the user to accept)
- voice.mjs / voice_words.py: `--lang` and a multilingual model for non-English voices; Unicode-aware word matching (done in this repo's copy).
- review.mjs NARRATION: count syllables per second for syllabic languages (Vietnamese ~4–5 syl/s is normal).
