"""Multi-voice narration + subtitle timing for dialogue videos ("5 Types of Teams").

Reads content/script-cac-kieu-nhom.md: each scene has lines like
    **Anna:** English text            followed by   *VI: Vietnamese text*
    **Narrator (EN):** English text   followed by   **VI:** Vietnamese text
    **Dan & Emma:** SHOUT!            (two voices at once)
    *(Thursday, 11 p.m. / ...)*       (a time jump: a longer pause and a mark for the scene)
Every English sentence is synthesized separately with the speaker's Edge TTS voice, so each subtitle is exact.
Writes public/teams/audio/sceneN.wav, src/Teams/data.ts and out/srt/cac-kieu-nhom.{en,vi}.srt.

usage: SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/dialogue_narration.py
"""
import asyncio
import json
import os
import re
import subprocess
import sys

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT, PUB, DATA, SRT = 'script-cac-kieu-nhom.md', 'teams', 'Teams/data.ts', 'cac-kieu-nhom'
SR, FPS = 44100, 30
LEAD, TAIL = 1.5, 1.8          # before the first line (team sign slides in), after the last (result bar)
GAP_TALK, GAP_NARR, GAP_SWITCH, JUMP = 0.22, 0.42, 0.38, 1.4
RATE = '+0%'
PROXY = os.environ.get('HTTPS_PROXY')
TMP = os.path.join(ROOT, '.kids-tts', 'teams')
OUT = os.path.join(ROOT, 'public', PUB, 'audio')

# voices from the production notes: women rotate Ava / Jenny / Aria, men Brian / Guy / Christopher
F = ['en-US-AvaNeural', 'en-US-JennyNeural', 'en-US-AriaNeural']
M = ['en-US-BrianNeural', 'en-US-GuyNeural', 'en-US-ChristopherNeural']
VOICES = {
    'Narrator': ('en-US-AndrewNeural', '+0Hz'),
    'Anna': (F[0], '+0Hz'), 'Ben': (M[0], '+0Hz'), 'Chloe': (F[1], '+0Hz'),
    'Dan': (M[1], '+0Hz'), 'Emma': (F[2], '+0Hz'), 'Finn': (M[2], '+0Hz'),
    'Gina': (F[0], '+4Hz'), 'Hugo': (M[0], '-4Hz'), 'Ivy': (F[1], '+6Hz'),
    'Jake': (M[1], '+4Hz'), 'Kim': (F[2], '+6Hz'), 'Leo': (M[2], '+4Hz'),
    'Mia': (F[0], '-4Hz'), 'Noah': (M[0], '+6Hz'), 'Olivia': (F[1], '-4Hz'),
}
NAMES, LEADS, TAILS, FX, RATES, NGAP = {}, {}, {}, {}, {}, {}
if os.environ.get('DIALOGUE') == 'rain':   # "Rainy day: plan vs. reality" (DIALOGUE=rain)
    SCRIPT, PUB, DATA, SRT = 'script-ngay-mua.md', 'rain', 'Rain/data.ts', 'ngay-mua'
    TMP = os.path.join(ROOT, '.kids-tts', 'rain'); OUT = os.path.join(ROOT, 'public', PUB, 'audio')
    VOICES = {'Narrator': ('en-US-AndrewNeural', '+0Hz'), 'Lily': ('en-US-AvaNeural', '+2Hz'),
              'Mom': ('en-US-JennyNeural', '-2Hz'), 'Max': ('en-US-BrianNeural', '+0Hz')}
    RATES = {'Narrator': '-6%', 'Lily': '+0%', 'Mom': '-4%', 'Max': '+6%'}
    NAMES = {'Mẹ': 'Mom'}
    # scenes 2-5 open with a wordless PLAN shot before the REALITY narration; leave room for the gag after the last line
    LEADS = {2: 6.2, 3: 6.2, 4: 6.2, 5: 6.2, 6: 1.8}
    TAILS = {1: 1.6, 2: 3.4, 3: 2.6, 4: 2.4, 5: 2.6, 6: 4.2, 7: 3.0}
    NGAP = {1: 0.6, 2: 1.7, 3: 0.9, 5: 1.1, 7: 0.75}   # deadpan narrator: time for each beat to land
    FX = {'Max': 'highpass=f=450,lowpass=f=3000,acrusher=bits=10:mix=0.25,volume=0.85'}   # over the phone
SPLIT = re.compile(r'(?<=[.?!])\s+(?=[^a-z])|(?<=[.?!]["”])\s+')


def parse():
    scenes, cur, last = [], None, None
    for raw in open(os.path.join(ROOT, 'content', SCRIPT), encoding='utf-8'):
        line = raw.strip()
        m = re.match(r'## Scene (\d+) – (.+?) \(', line)
        if m:
            cur = {'n': int(m.group(1)), 'title': m.group(2), 'items': []}
            scenes.append(cur); last = None
            continue
        if not cur or line.startswith('**Visual'):
            continue
        if line.startswith('*(') and line.endswith(')*'):
            cur['items'].append({'jump': line[2:-2]}); continue
        m = re.match(r'\*\*VI:\*\*\s*(.+)', line) or re.match(r'\*VI:\s*(.+?)\*$', line)
        if m and last:
            last['vi'] = m.group(1).strip(); continue
        m = re.match(r'\*\*(.+?):\*\*\s*(.+)', line)
        if m:
            who = re.sub(r'\s*\(.*?\)', '', m.group(1)).strip()
            who = ' & '.join(NAMES.get(w.strip(), w.strip()) for w in who.split('&'))
            if any(w.strip() not in VOICES for w in who.split('&')):   # PLAN:, REALITY:, Chữ cuối: … are directions, not lines
                last = None; continue
            last = {'who': who, 'en': m.group(2).strip()}
            cur['items'].append(last)
    return scenes


async def say(text, voice, pitch, rate, path):
    err = None
    for attempt in range(5):
        try:
            await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=PROXY).save(path)
            if os.path.getsize(path) > 1000:
                return
        except Exception as e:  # noqa: BLE001 - retry any transport error
            err = e
        await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f'Edge TTS failed for: {text!r} ({err})')


def pcm(path, fx=''):
    trim = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03'
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-af', f'{trim},areverse,{trim},areverse' + (f',{fx}' if fx else ''),
                        '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    return r.stdout


def mixpcm(parts):
    """Two voices shouting at once: sum the samples (the louder take sets the length)."""
    import array
    arrs = [array.array('h', p) for p in parts]
    n = max(len(a) for a in arrs)
    out = array.array('h', [0] * n)
    for a in arrs:
        for i, v in enumerate(a):
            out[i] = max(-32768, min(32767, out[i] + int(v * 0.75)))
    return out.tobytes()


def srt_time(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


async def main():
    os.makedirs(TMP, exist_ok=True); os.makedirs(OUT, exist_ok=True)
    data, k = [], 0
    for sc in parse():
        t, parts, lines, marks, prev = LEADS.get(sc['n'], LEAD), [], [], [], None
        for it in sc['items']:
            if 'jump' in it:
                t += JUMP - GAP_TALK
                marks.append({'t': round(t - JUMP / 2, 3), 'label': it['jump']})
                continue
            who = it['who']; names = [w.strip() for w in who.split('&')]
            en = SPLIT.split(it['en']); vi = SPLIT.split(it.get('vi', ''))
            if prev is not None and prev != who:
                t += GAP_SWITCH - GAP_TALK
            span0, sents = t, []
            for i, e in enumerate(en):
                takes = []
                for nm in names:
                    voice, pitch = VOICES[nm]
                    shout = e.isupper() or e.endswith('!')
                    mp3 = os.path.join(TMP, f"s{sc['n']:02d}_{k:03d}_{nm}.mp3");
                    if not os.path.exists(mp3) or os.path.getsize(mp3) < 1000:
                        await say(e, voice, pitch, '+8%' if shout and len(names) > 1 else RATES.get(nm, RATE), mp3)
                    takes.append(pcm(mp3, FX.get(nm, '')))
                k += 1
                a = takes[0] if len(takes) == 1 else mixpcm(takes)
                d = len(a) / 2 / SR
                parts.append((t, a))
                sents.append({'who': who, 't0': round(t, 3), 't1': round(t + d, 3), 'en': e})
                t += d + (NGAP.get(sc['n'], GAP_NARR) if who == 'Narrator' else GAP_TALK)
            # Vietnamese: one cue per English sentence when the counts match, else spread by length
            if len(vi) == len(en):
                for s, v in zip(sents, vi):
                    s['vi'] = v
            else:
                total = sum(len(v) for v in vi); a0, a1 = sents[0]['t0'], sents[-1]['t1']; acc = 0
                vcues = []
                for v in vi:
                    b0 = a0 + (a1 - a0) * acc / total; acc += len(v); b1 = a0 + (a1 - a0) * acc / total
                    vcues.append((b0, b1, v))
                for s in sents:  # each English sentence shows the Vietnamese cue that overlaps it most
                    s['vi'] = max(vcues, key=lambda c: min(c[1], s['t1']) - max(c[0], s['t0']))[2]
            lines.extend(sents); prev = who
        dur = t - GAP_TALK + TAILS.get(sc['n'], TAIL)
        frames = round(dur * FPS)
        buf = bytearray(round(frames / FPS * SR) * 2)
        for t0, a in parts:
            i0 = round(t0 * SR) * 2
            buf[i0:i0 + len(a)] = a[:len(buf) - i0]
        wav = os.path.join(OUT, f"scene{sc['n']}.wav")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-',
                        '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), wav], input=bytes(buf), check=True)
        data.append({'n': sc['n'], 'title': sc['title'], 'frames': frames, 'audio': f"{PUB}/audio/scene{sc['n']}.wav",
                     'lines': lines, 'marks': marks})
        print(f"scene {sc['n']} {sc['title'][:40]:40s} {len(lines):2d} sentences {dur:6.2f}s")
    total = sum(s['frames'] for s in data) / FPS
    with open(os.path.join(ROOT, 'src', DATA), 'w', encoding='utf-8') as f:
        f.write('// Generated by scripts/dialogue_narration.py — do not edit by hand.\n')
        f.write('export type Line = { who: string; t0: number; t1: number; en: string; vi: string };\n')
        f.write('export type Mark = { t: number; label: string };\n')
        f.write('export type SceneData = { n: number; title: string; frames: number; audio: string; lines: Line[]; marks: Mark[] };\n')
        f.write('export const SCENES: SceneData[] = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    # subtitles as .srt (English with speaker names; Vietnamese)
    os.makedirs(os.path.join(ROOT, 'out', 'srt'), exist_ok=True)
    for lang in ('en', 'vi'):
        rows, at = [], 0.0
        for sc in data:
            seen = set()
            for ln in sc['lines']:
                text = ln[lang]
                if lang == 'vi' and (text, ln['who']) in seen:
                    continue
                seen.add((text, ln['who']))
                t1 = ln['t1'] + 0.35
                if lang == 'vi':
                    t1 = max(l['t1'] for l in sc['lines'] if l['vi'] == text and l['who'] == ln['who']) + 0.35
                name = '' if ln['who'] == 'Narrator' else f"{ln['who']}: "
                rows.append(f"{len(rows) + 1}\n{srt_time(at + ln['t0'])} --> {srt_time(at + t1)}\n{name}{text}\n")
            at += sc['frames'] / FPS
        open(os.path.join(ROOT, 'out', 'srt', f'{SRT}.{lang}.srt'), 'w', encoding='utf-8').write('\n'.join(rows))
    print(f'total {total:.1f}s ({total / 60:.2f} min) -> src/{DATA}')


asyncio.run(main())
