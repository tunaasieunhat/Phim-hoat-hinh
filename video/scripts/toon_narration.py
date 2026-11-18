"""Voices + word-level timing for the rainy-day toon (RicksClips-like pacing).

Reads content/script-ngay-mua.md (Narrator / Lily / Mẹ / Max lines with *VI:* translations).
Each English sentence is synthesized on its own with Edge TTS *with word boundaries*, so the video can pop the
subtitles in word by word. Delivery is quicker than the earlier cut and the narrator leaves a small beat before
each punchline (PRE below). Writes public/toon/audio/sceneN.wav, src/Toon/data.ts and out/srt/toon-ngay-mua.{en,vi}.srt.

usage: SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/toon_narration.py
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
TMP = os.path.join(ROOT, '.kids-tts', 'toon')
OUT = os.path.join(ROOT, 'public', 'toon', 'audio')
VOICES = {'Narrator': ('en-US-AndrewNeural', '+0Hz', '+10%'), 'Lily': ('en-US-AvaNeural', '+2Hz', '+6%'),
          'Mom': ('en-US-JennyNeural', '-2Hz', '+4%'), 'Max': ('en-US-BrianNeural', '+0Hz', '+10%')}
NAMES = {'Mẹ': 'Mom'}
FX = {'Max': 'highpass=f=450,lowpass=f=3000,acrusher=bits=10:mix=0.25,volume=0.85'}
GAP, SWITCH = 0.28, 0.45
# per scene: silence before the first line (wordless PLAN shots), after the last; PRE[(scene, sentence)] = pause before it
LEADS = {1: 0.6, 2: 4.6, 3: 10.2, 4: 16.6, 5: 12.3, 6: 3.0, 7: 3.2}
TAILS = {1: 1.4, 2: 2.6, 3: 4.4, 4: 5.0, 5: 7.0, 6: 9.0, 7: 7.7}
PRE = {(1, 1): 1.3, (1, 2): 0.45, (1, 3): 0.7, (2, 1): 1.4, (2, 2): 1.7, (3, 1): 4.5, (4, 1): 0.35, (4, 2): 0.9,
       (5, 1): 1.6, (5, 2): 1.3, (6, 1): 0.3, (6, 2): 6.5, (7, 1): 4.4, (7, 2): 0.9, (7, 3): 0.9, (7, 4): 1.6, (7, 5): 0.8}
# when the bright PLAN frame tears away (scenes 2-5); the picture, the "wah wah" and the music all use it
TEARS = {2: 'first-0.8', 3: 9.0, 4: 9.0, 5: 9.0}
SPLIT = re.compile(r'(?<=[.?!])\s+(?=[^a-z])')


def parse():
    scenes, cur, last = [], None, None
    for raw in open(os.path.join(ROOT, 'content', 'script-ngay-mua.md'), encoding='utf-8'):
        line = raw.strip()
        m = re.match(r'## Scene (\d+) – (.+?) \(', line)
        if m:
            cur = {'n': int(m.group(1)), 'title': m.group(2), 'items': []}; scenes.append(cur); last = None; continue
        if not cur:
            continue
        m = re.match(r'\*VI:\s*(.+?)\*$', line)
        if m and last:
            last['vi'] = m.group(1).strip(); continue
        m = re.match(r'\*\*(.+?):\*\*\s*(.+)', line)
        if m:
            who = NAMES.get(re.sub(r'\s*\(.*?\)', '', m.group(1)).strip(), re.sub(r'\s*\(.*?\)', '', m.group(1)).strip())
            if who not in VOICES:
                last = None; continue
            last = {'who': who, 'en': m.group(2).strip()}; cur['items'].append(last)
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
                    t += PRE.get((sc['n'], k), SWITCH if prev != it['who'] else GAP)
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
        data.append({'n': sc['n'], 'title': sc['title'], 'frames': frames, 'audio': f"toon/audio/scene{sc['n']}.wav", 'tear': tr, 'lines': lines})
        print(f"scene {sc['n']} {sc['title'][:30]:30s} {len(lines):2d} sentences {dur:6.2f}s")
    with open(os.path.join(ROOT, 'src', 'Toon', 'data.ts'), 'w', encoding='utf-8') as f:
        f.write('// Generated by scripts/toon_narration.py — do not edit by hand.\n')
        f.write('export type Word = { w: string; t0: number; t1: number };\n')
        f.write('export type Line = { who: string; t0: number; t1: number; en: string; vi: string; words: Word[] };\n')
        f.write('export type SceneData = { n: number; title: string; frames: number; audio: string; tear: number | null; lines: Line[] };\n')
        f.write('export const SCENES: SceneData[] = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    os.makedirs(os.path.join(ROOT, 'out', 'srt'), exist_ok=True)
    for lang in ('en', 'vi'):
        rows, at = [], 0.0
        for sc in data:
            for ln in sc['lines']:
                name = '' if ln['who'] == 'Narrator' else f"{'Mẹ' if lang == 'vi' and ln['who'] == 'Mom' else ln['who']}: "
                rows.append(f"{len(rows) + 1}\n{srt_time(at + ln['t0'])} --> {srt_time(at + ln['t1'] + 0.3)}\n{name}{ln[lang]}\n")
            at += sc['frames'] / FPS
        open(os.path.join(ROOT, 'out', 'srt', f'toon-ngay-mua.{lang}.srt'), 'w', encoding='utf-8').write('\n'.join(rows))
    print(f"total {sum(s['frames'] for s in data) / FPS:.1f}s")


asyncio.run(main())
