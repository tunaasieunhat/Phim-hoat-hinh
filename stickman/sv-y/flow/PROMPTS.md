# POV: You Chose Medicine — Google Flow production package (Director mode, Phase B)

Approved Phase A: 9:16, ~55 s, 6 clips, Style 1 Classic **Light**, three accents (vivid red, warm yellow, sky blue).
**Project-specific change to the skill's default voice workflow (approved by the user):** the clips carry **no speech and no music**.
The approved English narration (Kokoro "Heart"), Vietnamese subtitles and licensed music are added afterwards in post.
The character anchor below keeps the skill's Classic Light wording with two disclosed adaptations taken from the approved preview:
simple line expressions (the skill's allowed variant) and a few short spiky hair strands.

## 1. Global continuity block

- **Ratio / length:** 9:16 portrait, 6 clips × ~10 s (used lengths 9.8 / 9.2 / 7.4 / 10.2 / 9.6 / 9.1 s).
- **Style:** Style 1 Classic Light — flat pure-white canvas, black line art, max three saturated accents on props only.
- **Hero:** the med student — the frozen anchor + a vivid red stethoscope (a prop) around the neck.
- **Accents:** vivid red = stethoscope, alarm clock, danger/high pressure, the heart; warm yellow = coffee mug, duckling, bread, sunglasses, desk lamp; sky blue = blanket, sweat drops, the gauge needle.
- **Audio:** no dialogue, no narration, no music. Only soft synchronized sound effects for visible actions (they may be muted in post).
- **Start frames:** `start-frames/clip1-alarm.png` … `clip6-midnight.png` (drawn by code from the approved preview; no text).
- **Continuity:** every prompt repeats the full anchor; each clip opens on its start frame.

### Frozen character anchor (repeated verbatim in every prompt)

> Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop.

---

## 2. The six prompts (paste one per clip, with its start frame)

### Clip 1 — The alarm chose violence (start frame: `clip1-alarm.png`)

```text
Output: about 10 seconds, vertical 9:16 portrait, 720p, 24 fps, smooth fluid 2D animation, synchronized sound effects only.
Environment: a flat, uniform, digitally pure-white canvas with no shading, no texture, no gradients, no 3D depth. A simple line-drawn bed with a sky blue blanket, a small night window with a crescent moon, a vivid red alarm clock on the left.
Character: Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop.
Palette: black line art on white; vivid red for the alarm clock and stethoscope, warm yellow for the coffee mug, sky blue for the blanket. No other colors.
Composition (9:16): the bed across the lower middle, the alarm clock upper left, the window upper right; leave the top fifth and bottom fifth of the frame empty for titles and subtitles added later.
First frame: exactly the supplied start image — the figure asleep in bed, the alarm clock still.
[0–3s] The alarm clock rattles violently, hopping and shaking with motion lines; the sleeping figure twitches, then jolts bolt upright with arms flung up, eyes wide, mouth open in shock, hair strands standing on end.
[3–7s] Quick cut: the same figure now stands upright, half-asleep with droopy line eyes, swaying slightly, slowly lifting a warm yellow coffee mug with steam curls to sip.
[7–10s] A simple pink brain doodle appears beside the head with a long empty loading bar beneath it; the bar's green fill creeps forward painfully slowly while the figure takes a second sleepy sip.
Audio: no speech, no narration, no music, no singing. Only soft synchronized sound effects: an alarm bell rattle, a cartoon boing on the jolt, a gentle sip.
Final frame: the sleepy figure holding the mug, the loading bar barely filled.
Negative constraints: no text, no letters, no numbers, no captions, no subtitles, no speech bubbles, no logos; no extra arms or legs, no duplicated limbs, no filled or shaded body, no clothing, no realistic faces, no color on the figure, no background scenery beyond the listed props, no camera shake, no style change.
```

### Clip 2 — Ward rounds, like a duckling; they ask you (start frame: `clip2-rounds.png`)

```text
Output: about 10 seconds, vertical 9:16 portrait, 720p, 24 fps, smooth fluid 2D animation, synchronized sound effects only.
Environment: a flat, uniform, digitally pure-white canvas with no shading, no texture, no gradients, no 3D depth; a single thin gray floor line suggests a hospital corridor.
Character: Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop. Two smaller secondary stick figures in the identical drawing style play the doctors: one with round line glasses holding a clipboard, one with a small hair bun.
Palette: black line art on white; vivid red stethoscope, warm yellow duckling, sky blue sweat drops. No other colors.
Composition (9:16): depth staging — the student large in the foreground on the left, the two doctors smaller behind on the right; keep the top fifth and bottom fifth empty.
First frame: exactly the supplied start image — the student holding a notebook, the two doctors ahead.
[0–3s] The two doctors stride briskly to the right; the student hurries after them, scribbling frantically in the notebook, eyes darting nervously.
[3–7s] A small warm yellow duckling waddles in behind the student and follows in perfect step; the student mouths a silent anxious prayer, sweating.
[7–10s] The glasses doctor stops, turns around and points straight at the student; the student freezes, arms shooting up in panic, eyes huge, sky blue sweat drops flying off the head.
Audio: no speech, no narration, no music, no singing. Only soft synchronized sound effects: quick footsteps, a pen scribble, a squeaky duck step, a record-scratch stop on the point.
Final frame: the doctor pointing, the panicked student frozen with arms up.
Negative constraints: no text, no letters, no numbers, no captions, no subtitles, no speech bubbles, no logos; no extra arms or legs, no duplicated limbs, no filled or shaded bodies, no clothing beyond the stethoscope and clipboard props, no realistic faces, no color on the figures, no background scenery, no style change.
```

### Clip 3 — 206 bones; the most relaxed one is the skeleton (start frame: `clip3-anatomy.png`)

```text
Output: about 10 seconds, vertical 9:16 portrait, 720p, 24 fps, smooth fluid 2D animation, synchronized sound effects only.
Environment: a flat, uniform, digitally pure-white canvas with no shading, no texture, no gradients, no 3D depth.
Character: Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop. A simple line-drawn classroom anatomy skeleton model on a stand is a prop, not a person.
Palette: black line art on white; a tower of books in soft muted colors, vivid red stethoscope, warm yellow sunglasses frame accent. No other colors.
Composition (9:16): the student large on the left balancing a tall tower of books overhead, the skeleton model on the right; keep the top fifth and bottom fifth empty.
First frame: exactly the supplied start image — the student holding the book tower, the skeleton standing.
[0–3s] The student staggers under the teetering book tower, knees wobbling, straining face, the tower swaying left and right.
[3–7s] Small cartoon bone icons pop up one by one in the empty space above them, more and more, overwhelming; the student's eyes spin.
[7–10s] The skeleton model leans back with its hands behind its skull, crosses its legs, perfectly relaxed; a pair of black sunglasses drops from above onto the skull with a little bounce.
Audio: no speech, no narration, no music, no singing. Only soft synchronized sound effects: book creaks, light pops for the bone icons, a rimshot as the sunglasses land.
Final frame: the relaxed skeleton in sunglasses beside the exhausted student.
Negative constraints: no text, no letters, no numbers, no captions, no subtitles, no speech bubbles, no logos; no extra arms or legs, no duplicated limbs, no filled or shaded body, no clothing, no realistic anatomy, no gore, no blood, no human cadaver, no color on the figure, no style change.
```

### Clip 4 — Four-minute lunch like a horse; the pig's foot looks better than you (start frame: `clip4-lunch.png`)

```text
Output: about 10 seconds, vertical 9:16 portrait, 720p, 24 fps, smooth fluid 2D animation, synchronized sound effects only.
Environment: a flat, uniform, digitally pure-white canvas with no shading, no texture, no gradients, no 3D depth.
Character: Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop.
Palette: black line art on white; warm yellow baguette sandwich, vivid red timer hand, a soft pink practice pig's foot. No other colors.
Composition (9:16): the student large on the left, a round wall timer upper right; leave the top fifth and bottom fifth empty.
First frame: exactly the supplied start image — the student standing with a long sandwich, the timer on the wall.
[0–3s] The timer's red hand whips around; the student, standing, crams the sandwich in with big fast chomping bites, cheeks bulging.
[3–6s] A simple line-drawn horse trots in beside the student and munches its own sandwich in exactly the same rhythm; they glance at each other.
[6–10s] Quick cut: the student hunches over a small table with a soft pink pig's foot on a sky blue drape, stitching a cut with a shaky needle holder, sweating; the neat stitches appear one by one, then the pig's foot gains a tiny smug smile and a yellow sparkle while the student looks frazzled.
Audio: no speech, no narration, no music, no singing. Only soft synchronized sound effects: a ticking timer, crunchy bites, horse hooves, small stitch taps, a sparkle chime.
Final frame: the smiling pig's foot and the frazzled student at the table.
Negative constraints: no text, no letters, no numbers, no captions, no subtitles, no speech bubbles, no logos; no extra arms or legs, no duplicated limbs, no filled or shaded body, no clothing, no realistic flesh, no blood, no gore, no color on the figure, no style change.
```

### Clip 5 — First patient: her pressure, and yours; 300 flashcards (start frame: `clip5-patient.png`)

```text
Output: about 10 seconds, vertical 9:16 portrait, 720p, 24 fps, smooth fluid 2D animation, synchronized sound effects only.
Environment: a flat, uniform, digitally pure-white canvas with no shading, no texture, no gradients, no 3D depth.
Character: Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop. A secondary stick figure in the identical drawing style with a small hair bun plays the calm patient seated on a stool.
Palette: black line art on white; a navy blood-pressure cuff, sky blue gauge needles, vivid red danger zone on the gauge, warm yellow desk lamp later. No other colors.
Composition (9:16): the patient large in the foreground on the left, the student behind on the right, a round pressure gauge above each; leave the top fifth and bottom fifth empty.
First frame: exactly the supplied start image — the seated patient with the cuff, the nervous student, two gauges.
[0–3s] The student nervously squeezes the pump bulb; the patient's gauge needle rises and settles calmly in the middle; the patient smiles kindly.
[3–5s] The student's own gauge needle suddenly shoots all the way into the vivid red zone and trembles there; the student sweats and shakes.
[5–10s] Quick cut: night library desk; the student sits studying beside a towering stack of blank flashcards; three cards peel off the top one by one and fly over to a tiny finished pile; the student slumps.
Audio: no speech, no narration, no music, no singing. Only soft synchronized sound effects: a pump squeeze, a rising whistle on the spike, page flips, three soft card flicks.
Final frame: the huge flashcard tower beside a pile of only three cards, the tired student at the desk.
Negative constraints: no text, no letters, no numbers, no captions, no subtitles, no speech bubbles, no logos, no writing on the flashcards; no extra arms or legs, no duplicated limbs, no filled or shaded bodies, no clothing beyond the stethoscope and cuff props, no realistic faces, no color on the figures, no style change.
```

### Clip 6 — "Just one more chapter" (the nose grows); 5:30 again, still choosing it (start frame: `clip6-midnight.png`)

```text
Output: about 10 seconds, vertical 9:16 portrait, 720p, 24 fps, smooth fluid 2D animation, synchronized sound effects only.
Environment: a flat, uniform, digitally pure-white canvas with no shading, no texture, no gradients, no 3D depth; a small warm yellow crescent moon and a warm yellow desk lamp.
Character: Use minimalist two-dimensional black line animation. Show the same consistent stick figure with a hollow circular head, occasional simple line expressions, no detailed facial features, a few short spiky hair strands on top, no clothing, no filled body, stable proportions, connected line limbs, and uniform medium line weight. Exactly two arms and two legs are visible per figure. Each limb appears only in its current pose: raising or lowering the right arm replaces that arm's previous line, never leaving a resting arm beneath an active arm. The figure stays black; accent colors affect only props and graphic effects. The main figure always wears a vivid red stethoscope around the neck as a prop.
Palette: black line art on white; warm yellow moon and lamp, sky blue blanket, vivid red alarm clock and heart. No other colors.
Composition (9:16): the student slumped over an open book at a desk in the lower middle, the lamp on the left, the moon upper right; leave the top fifth and bottom fifth empty.
First frame: exactly the supplied start image — the student slumped at the desk under the lamp.
[0–4s] The exhausted student lifts their head, nods with droopy eyes as if promising one more chapter, and the line nose grows longer and longer like a cartoon lie.
[4–7s] Time cut: the same bed and vivid red alarm clock from the first scene; the alarm rattles and hops again.
[7–10s] The student sits up in bed, this time with a big warm smile, stretches, and a vivid red heart pops up beside them and gently beats.
Audio: no speech, no narration, no music, no singing. Only soft synchronized sound effects: a page flip, a squeaky stretch as the nose grows, the alarm rattle, a soft chime for the heart.
Final frame: the smiling student in bed with the beating red heart beside them.
Negative constraints: no text, no letters, no numbers, no captions, no subtitles, no speech bubbles, no logos, no writing on the book; no extra arms or legs, no duplicated limbs, no filled or shaded body, no clothing, no realistic faces, no color on the figure, no style change.
```

---

## 3. Stitching guide (done in post, free)

| Clip | Use in the film | Narration over it |
|---|---|---|
| 1 | 0.0–9.8 s | "POV: you chose medicine… still loading." |
| 2 | 9.8–19.0 s | "Seven a.m., ward rounds… They ask you." |
| 3 | 19.0–26.4 s (trim to 7.4 s) | "Nine. Anatomy lab… the skeleton." |
| 4 | 26.4–36.6 s (≈10.2 s) | "Noon… like a horse. Skills lab… better than you." |
| 5 | 36.6–46.2 s | "Four p.m.… Yours is higher. Evening… finished three." |
| 6 | 46.2–55.3 s | "Midnight… lie to yourself. Five thirty… Would you?" |

In post: retime each clip slightly to its slot (no more than ±5 %), mute or duck the clip sound under the voice, add the Vietnamese handwritten headings (5:30 SÁNG, 7:00 · ĐI BUỒNG, …) and the Vietnamese subtitles, the licensed music bed (Fluffing a Duck, CC BY 4.0 — credit in `../audio2/CREDITS.md`) and the existing approved Kokoro narration.

## 4. Voice and music continuity note

One narrator for the whole film: the already approved Kokoro **af_heart** recording (`../narration.wav`, unchanged rate). No voice is generated in Flow, so there is nothing to keep consistent across clips. Music is one continuous licensed track laid over all six clips in post, so clip boundaries do not restart it.
