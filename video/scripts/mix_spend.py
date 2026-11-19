"""Final audio for "6 Types of Students When Spending Money" (adapted from mix_free.py; skills:
ffmpeg-filter-complex-patterns, ffmpeg-audio-processing). Remotion renders picture + voices + SFX ("stem"); this adds
fast, playful music for scenes 1-7 and a warm track for the ending, drops the music out from 1 s before every punchline
(the "punch" flag in src/Spend/data.ts) until it lands, ducks it under the voices, limits, normalizes to -14 LUFS.
usage: python3 scripts/mix_spend.py out/<stem>.mp4 out/<final>.mp4
"""
import json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, dst = sys.argv[1], sys.argv[2]
s = open(os.path.join(ROOT, 'src', 'Spend', 'data.ts'), encoding='utf-8').read()
scenes = json.loads(s[s.index('= [') + 2:s.rindex(';')])
upto = int(sys.argv[3]) if len(sys.argv) > 3 else len(scenes)
starts, t = [], 0.0
for sc in scenes:
    starts.append(t); t += sc['frames'] / 30
total = starts[upto - 1] + scenes[upto - 1]['frames'] / 30
tear = lambda n: scenes[n - 1]['tear']          # written by toon_narration.py, used by the scenes too
A = os.path.join(ROOT, 'public', 'audio')
# music by scene: quirky storytelling for 1-3, "Merry Go" when nobody works, the slow turtle tune for the empty
# store, the elevator "explainer" for the lesson, "Carefree" for the ending (all CC BY, see CREDITS.md)
TRACK = {1: 'quirky', 2: 'quirky', 3: 'quirky', 4: 'quirky', 5: 'comedy', 6: 'comedy', 7: 'comedy', 8: 'warm'}
seg = [(starts[n - 1], starts[n - 1] + scenes[n - 1]['frames'] / 30, TRACK[n]) for n in range(1, upto + 1)]
merged = []
for a, b, k in seg:
    if merged and merged[-1][2] == k and abs(merged[-1][1] - a) < 0.05: merged[-1] = (merged[-1][0], b, k)
    else: merged.append((a, b, k))
FILES = {'quirky': 'music-quirky.mp3', 'comedy': 'music-comedy.mp3', 'warm': 'music-warm.mp3'}
GAIN = {'quirky': 0.4, 'comedy': 0.4, 'warm': 0.45}
inputs = ['-i', src, '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=stereo:d={total:.2f}']
fc = [f"[1:a]atrim=0:{total:.2f}[rain]"]   # no rain bed in this film: a silent placeholder keeps the graph the same
labels, offs = ['[rain]'], {k: 0.0 for k in FILES}
for i, (a, b, k) in enumerate(merged):
    inputs += ['-stream_loop', '-1', '-i', os.path.join(A, FILES[k])]
    L, o = b - a, offs[k]; offs[k] += L
    fc.append(f"[{i + 2}:a]aformat=channel_layouts=stereo,aresample=44100,atrim={o:.2f}:{o + L:.2f},asetpts=PTS-STARTPTS,volume={GAIN[k]},afade=t=in:d=0.3,afade=t=out:st={max(0, L - 0.4):.2f}:d=0.4,adelay={int(a * 1000)}:all=1[m{i}]")
    labels.append(f'[m{i}]')
mutes = [(starts[n] + ln['t0'] - 1.0, starts[n] + ln['t1'] + 0.2) for n, sc in enumerate(scenes[:upto]) for ln in sc['lines'] if ln.get('punch')]
expr = '+'.join(f'between(t,{a:.2f},{b:.2f})' for a, b in mutes) or '0'
fc.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad=whole_dur={total:.2f},volume='if({expr},0.04,1)':eval=frame[bed]")
fc += ["[0:a]asplit=2[v][key]", "[bed][key]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=400:makeup=1[duck]",
       "[v][duck]amix=inputs=2:normalize=0,alimiter=limit=0.56:level=false:attack=1:release=50[mix]"]
graph, LN = ';'.join(fc), 'loudnorm=I=-14:TP=-1.5:LRA=20'
r = subprocess.run(['ffmpeg', '-hide_banner', *inputs, '-filter_complex', f'{graph};[mix]{LN}:print_format=json[o]', '-map', '[o]', '-t', f'{total:.2f}', '-f', 'null', '-'], capture_output=True, text=True)
m = json.loads(re.findall(r'\{[^{}]+\}', r.stderr)[-1])
meas = f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', f'{graph};[mix]{LN}:{meas},aresample=48000,alimiter=limit=0.79:level=false:attack=1:release=60[o]', '-map', '0:v', '-map', '[o]',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', f'{total:.2f}', '-movflags', '+faststart', dst], check=True)
print(f"mixed {total:.1f}s: " + ', '.join(f'{k} {a:.1f}-{b:.1f}' for a, b, k in merged) + f" -> {dst}")
