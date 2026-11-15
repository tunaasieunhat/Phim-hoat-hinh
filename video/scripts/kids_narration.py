"""Narration + subtitle timing for "A Day in the Life: Grown-ups vs. Kids".

Reads content/kids-script.md, synthesizes every English sentence with Edge TTS (one request per sentence, so each
sentence's time is exact), joins them per scene into public/kids/audio/sceneN.wav and writes src/Kids/data.ts with
the sentence times and the Vietnamese subtitle cues (each Vietnamese sentence shown while its English one is spoken).

usage: python3 scripts/kids_narration.py            (needs: pip install edge-tts, ffmpeg; network to Edge TTS)
       short cut: KIDS_VARIANT=3min python3 scripts/kids_narration.py  (content/kids-script-3min.md -> public/kids3, src/Kids/data3.ts)
"""
import asyncio
import json
import os
import re
import subprocess
import sys

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VARIANT = os.environ.get('KIDS_VARIANT', 'full')
SR = 44100
if VARIANT == '3min':   # the <=3-minute 9:16 cut: shorter script, natural rate, tighter pauses
    VOICE, RATE, LEAD, TAIL, GAP = 'en-US-GuyNeural', '-2%', 0.9, 1.8, 0.42
    SCRIPT, PUB, DATA = 'kids-script-3min.md', 'kids3', 'data3.ts'
else:                   # seconds: before the first sentence, after the last, between sentences
    VOICE, RATE, LEAD, TAIL, GAP = 'en-US-GuyNeural', '-12%', 2.0, 4.4, 0.8
    SCRIPT, PUB, DATA = 'kids-script.md', 'kids', 'data.ts'
FPS = 30
PROXY = os.environ.get('HTTPS_PROXY')
TMP = os.path.join(ROOT, '.kids-tts', VARIANT)
OUT = os.path.join(ROOT, 'public', PUB, 'audio')
SPLIT = re.compile(r'(?<=[.?!])\s+|(?<=[.?!]["”])\s+')


def parse():
    scenes, cur = [], None
    for line in open(os.path.join(ROOT, 'content', SCRIPT), encoding='utf-8'):
        m = re.match(r'## Scene (\d+) – (.+?) \(', line)
        if m:
            cur = {'n': int(m.group(1)), 'title': m.group(2)}
            scenes.append(cur)
        elif cur and line.startswith('**EN:**'):
            cur['en'] = line[7:].strip()
        elif cur and line.startswith('**VI:**'):
            cur['vi'] = line[7:].strip()
    return scenes


async def say(text, path):
    for attempt in range(4):
        try:
            await edge_tts.Communicate(text, VOICE, rate=RATE, proxy=PROXY).save(path)
            if os.path.getsize(path) > 1000:
                return
        except Exception as e:  # noqa: BLE001 - retry any transport error
            err = e
        await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f'Edge TTS failed for: {text!r} ({err})')


def pcm(path):
    """Decode to mono s16 at SR, trimmed of leading/trailing silence."""
    trim = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03'
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-af', f'{trim},areverse,{trim},areverse',
                        '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    return r.stdout


def split_cue(text, t0, t1, limit=84):
    """A long Vietnamese sentence becomes two cues, split at the comma nearest the middle, timed by length."""
    if len(text) <= limit:
        return [(t0, t1, text)]
    cuts = [m.end() for m in re.finditer(r'[,:;]\s', text)]
    if not cuts:
        cuts = [m.end() for m in re.finditer(r'\s(?=và |nhưng |để |vì )', text)]
    if not cuts:
        return [(t0, t1, text)]
    c = min(cuts, key=lambda i: abs(i - len(text) / 2))
    a, b = text[:c].strip(), text[c:].strip()
    tm = t0 + (t1 - t0) * len(a) / (len(a) + len(b))
    return split_cue(a, t0, tm, limit) + split_cue(b, tm, t1, limit)


async def main():
    os.makedirs(TMP, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    data = []
    for sc in parse():
        en, vi = SPLIT.split(sc['en']), SPLIT.split(sc['vi'])
        if len(en) != len(vi):
            sys.exit(f"scene {sc['n']}: {len(en)} English vs {len(vi)} Vietnamese sentences — fix the script split")
        t, parts, sents, cues = LEAD, [], [], []
        for i, (e, v) in enumerate(zip(en, vi)):
            mp3 = os.path.join(TMP, f"s{sc['n']:02d}_{i:02d}.mp3")
            if not os.path.exists(mp3):
                await say(e, mp3)
            a = pcm(mp3)
            d = len(a) / 2 / SR
            parts.append((t, a))
            sents.append({'t0': round(t, 3), 't1': round(t + d, 3), 'en': e})
            for c0, c1, text in split_cue(v, t, t + d + GAP * 0.6, 64 if VARIANT == '3min' else 84):
                cues.append({'t0': round(c0, 3), 't1': round(c1, 3), 'vi': text})
            t += d + GAP
        dur = t - GAP + TAIL
        frames = round(dur * FPS)
        buf = bytearray(round(frames / FPS * SR) * 2)
        for t0, a in parts:
            i0 = round(t0 * SR) * 2
            buf[i0:i0 + len(a)] = a[:len(buf) - i0]
        wav = os.path.join(OUT, f"scene{sc['n']}.wav")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-',
                        '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), wav], input=bytes(buf), check=True)
        data.append({'n': sc['n'], 'title': sc['title'], 'frames': frames, 'audio': f"{PUB}/audio/scene{sc['n']}.wav",
                     'sentences': sents, 'cues': cues})
        print(f"scene {sc['n']:2d} {sc['title'][:34]:34s} {len(en):2d} sentences  {dur:6.2f}s")
    total = sum(s['frames'] for s in data) / FPS
    with open(os.path.join(ROOT, 'src', 'Kids', DATA), 'w', encoding='utf-8') as f:
        f.write('// Generated by scripts/kids_narration.py — do not edit by hand.\n')
        f.write(f'export const VOICE = {json.dumps(VOICE)};\n')
        f.write('export type Sentence = { t0: number; t1: number; en: string };\n')
        f.write('export type Cue = { t0: number; t1: number; vi: string };\n')
        f.write('export type SceneData = { n: number; title: string; frames: number; audio: string; sentences: Sentence[]; cues: Cue[] };\n')
        f.write('export const SCENES: SceneData[] = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    print(f'total {total:.1f}s ({total / 60:.2f} min) -> src/Kids/{DATA}')


asyncio.run(main())
