"""Voices + word-level timing for "What if everything was free?" (built from scripts/toon_narration.py).

Reads content/script-ngay-mua.md (Narrator / Lily / Mẹ / Max lines with *VI:* translations).
Each English sentence is synthesized on its own with Edge TTS *with word boundaries*, so the video can pop the
subtitles in word by word. Delivery is quicker than the earlier cut and the narrator leaves a small beat before
each punchline (PRE below). Writes public/free/audio/sceneN.wav, src/Free/data.ts and out/srt/mua-khong-mat-tien.{en,vi}.srt.

usage: SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/free_narration.py
"""
import asyncio
import hashlib
import json
import os
import re
import subprocess

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, FPS = 44100, 30
PROXY = os.environ.get('HTTPS_PROXY')
TMP = os.path.join(ROOT, '.kids-tts', 'free')
OUT = os.path.join(ROOT, 'public', 'free', 'audio')
VOICES = {'Narrator': ('en-US-AndrewNeural', '+0Hz', '+5%'), 'King': ('en-US-ChristopherNeural', '-4Hz', '+0%'),
          'Bob': ('en-US-GuyNeural', '+4Hz', '+6%')}
NAMES, FX = {}, {'King': 'aecho=0.8:0.6:40:0.25,highpass=f=300,lowpass=f=4500'}   # the king speaks through a megaphone
GAP, SWITCH, PUNCH = 0.26, 0.4, 0.55
# lead (wordless opening), tail per scene; the punchlines get a 0.55 s beat before them
LEADS = {1: 2.4, 2: 2.6, 3: 2.4, 4: 1.6, 5: 2.4, 6: 1.6, 7: 1.2}
TAILS = {1: 3.0, 2: 5.0, 3: 4.7, 4: 4.9, 5: 6.0, 6: 4.5, 7: 7.0}
# extra room after sentence k of a scene, for the wordless visual gags (keeps the film near 2:30)
AFTER = {(1, 0): 1.2, (1, 1): 1.0, (2, 0): 1.0, (2, 1): 0.5, (2, 2): 0.5, (2, 3): 0.5, (2, 4): 2.4, (2, 5): 0.6,
         (3, 0): 0.6, (3, 1): 2.2, (3, 2): 1.4, (4, 0): 1.0, (4, 1): 1.6, (4, 2): 1.4, (4, 3): 1.4,
         (5, 0): 1.2, (5, 1): 1.6, (5, 2): 0.8, (6, 0): 1.4, (6, 1): 1.6, (6, 2): 1.4, (7, 1): 0.6, (7, 2): 0.8, (7, 4): 0.4}
PUNCHES = ["Bob can't play the piano.", "Even the shelves were gone.", "Someone took the shelves.", "Permanently.",
           "Free stuff is great, until there is no stuff.", "Turns out, you can't get a refund on something you never paid for.", "Nothing."]
# scene 7 gets the two in-character lines described in the visual notes
EXTRA = {7: [(1, {'who': 'King', 'en': 'Okay… prices are back.', 'vi': 'Thôi được… giá cả quay lại rồi.'}),
             (4, {'who': 'Bob', 'en': 'Can I return this?', 'vi': 'Cho cháu trả lại cái này được không?'})]}
PRE, TEARS = {}, {}
SPLIT = re.compile(r'(?<!Mr\.)(?<=[.?!])\s+(?=[^a-z])')


def parse():
    scenes, cur = [], None
    for raw in open(os.path.join(ROOT, 'content', 'script-mua-khong-mat-tien.md'), encoding='utf-8'):
        line = raw.strip()
        m = re.match(r'## Scene (\d+) – (.+?) \(', line)
        if m:
            cur = {'n': int(m.group(1)), 'title': m.group(2), 'items': []}; scenes.append(cur); continue
        if not cur:
            continue
        m = re.match(r'\*\*EN:\*\*\s*(.+)', line)
        if m:
            cur['en'] = SPLIT.split(m.group(1).strip()); continue
        m = re.match(r'\*\*VI:\*\*\s*(.+)', line)
        if m:
            vi = SPLIT.split(m.group(1).strip())
            assert len(vi) == len(cur['en']), (cur['n'], len(vi), len(cur['en']))
            cur['items'] = [{'who': 'Narrator', 'en': e, 'vi': v} for e, v in zip(cur['en'], vi)]
            for at, it in reversed(EXTRA.get(cur['n'], [])):
                cur['items'].insert(at, it)
    return scenes


async def say(text, who, mp3, js):
    voice, pitch, rate = VOICES[who]
    for attempt in range(5):
        try:
            words, audio = [], bytearray()
            async for ch in edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=PROXY, boundary='WordBoundary').stream():
                if ch['type'] == 'audio':
                    audio += ch['data']
                elif ch['type'] == 'WordBoundary':
                    words.append({'w': ch['text'], 't0': ch['offset'] / 1e7, 't1': (ch['offset'] + ch['duration']) / 1e7})
            if len(audio) > 1000 and words:
                open(mp3, 'wb').write(audio); json.dump(words, open(js, 'w'))
                return
        except Exception:  # noqa: BLE001 - retry transport errors
            pass
        await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f'Edge TTS failed: {text!r}')


def pcm(mp3, a, b, fx=''):
    af = f'atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS' + (f',{fx}' if fx else '')
    return subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-af', af, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout


def srt_time(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


async def main():
    os.makedirs(TMP, exist_ok=True); os.makedirs(OUT, exist_ok=True)
    data = []
    for sc in parse():
        t, parts, lines, prev, k = LEADS.get(sc['n'], 1.0), [], [], None, 0
        for it in sc['items']:
            en, vi = SPLIT.split(it['en']), SPLIT.split(it.get('vi', ''))
            if len(vi) != len(en):
                vi = [it.get('vi', '')] * len(en)
            for i, e in enumerate(en):
                if lines:
                    t += (PUNCH if e in PUNCHES else SWITCH if prev != it['who'] else GAP) + AFTER.get((sc['n'], k - 1), 0)
                base = os.path.join(TMP, f"s{sc['n']}_{k}_{it['who']}_{hashlib.md5((e + it['who']).encode()).hexdigest()[:8]}")
                if not os.path.exists(base + '.mp3') or os.path.getsize(base + '.mp3') < 1000:
                    await say(e, it['who'], base + '.mp3', base + '.json')
                words = json.load(open(base + '.json'))
                a, b = max(0, words[0]['t0'] - 0.04), words[-1]['t1'] + 0.14
                audio = pcm(base + '.mp3', a, b, FX.get(it['who'], ''))
                d = len(audio) / 2 / SR
                parts.append((t, audio))
                lines.append({'who': it['who'], 't0': round(t, 3), 't1': round(t + d, 3), 'en': e, 'vi': vi[i],
                              'words': [{'w': w['w'], 't0': round(t + w['t0'] - a, 3), 't1': round(t + w['t1'] - a, 3)} for w in words]})
                t += d; prev = it['who']; k += 1
        dur = t + TAILS.get(sc['n'], 2.0)
        frames = round(dur * FPS)
        buf = bytearray(round(frames / FPS * SR) * 2)
        for t0, a in parts:
            i0 = round(t0 * SR) * 2
            buf[i0:i0 + len(a)] = a[:len(buf) - i0]
        wav = os.path.join(OUT, f"scene{sc['n']}.wav")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), wav], input=bytes(buf), check=True)
        tr = TEARS.get(sc['n']); tr = round(lines[0]['t0'] - 0.8, 3) if tr == 'first-0.8' else tr
        data.append({'n': sc['n'], 'title': sc['title'], 'frames': frames, 'audio': f"free/audio/scene{sc['n']}.wav", 'tear': tr, 'lines': lines})
        print(f"scene {sc['n']} {sc['title'][:30]:30s} {len(lines):2d} sentences {dur:6.2f}s")
    with open(os.path.join(ROOT, 'src', 'Free', 'data.ts'), 'w', encoding='utf-8') as f:
        f.write('// Generated by scripts/free_narration.py — do not edit by hand.\n')
        f.write('export type Word = { w: string; t0: number; t1: number };\n')
        f.write('export type Line = { who: string; t0: number; t1: number; en: string; vi: string; words: Word[] };\n')
        f.write('export type SceneData = { n: number; title: string; frames: number; audio: string; tear: number | null; lines: Line[] };\n')
        f.write('export const SCENES: SceneData[] = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    os.makedirs(os.path.join(ROOT, 'out', 'srt'), exist_ok=True)
    for lang in ('en', 'vi'):
        rows, at = [], 0.0
        for sc in data:
            for ln in sc['lines']:
                name = '' if ln['who'] == 'Narrator' else f"{('Nhà vua' if lang == 'vi' else 'King') if ln['who'] == 'King' else ln['who']}: "
                rows.append(f"{len(rows) + 1}\n{srt_time(at + ln['t0'])} --> {srt_time(at + ln['t1'] + 0.3)}\n{name}{ln[lang]}\n")
            at += sc['frames'] / FPS
        open(os.path.join(ROOT, 'out', 'srt', f'mua-khong-mat-tien.{lang}.srt'), 'w', encoding='utf-8').write('\n'.join(rows))
    print(f"total {sum(s['frames'] for s in data) / FPS:.1f}s")


asyncio.run(main())
