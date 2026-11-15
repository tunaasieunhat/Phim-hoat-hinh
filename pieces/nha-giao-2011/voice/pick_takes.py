"""Generate several VieNeu-TTS takes per line, transcribe each with faster-whisper, keep the take whose
transcript matches the script best (a measurable pronunciation check), slowed to 85% with ffmpeg atempo.
usage: python3 pick_takes.py [n_takes]   (run inside pieces/<name>/voice/)"""
import json
import subprocess
import sys
import unicodedata

import numpy as np
from faster_whisper import WhisperModel
from vieneu import Vieneu

N = int(sys.argv[1]) if len(sys.argv) > 1 else 3
VOICE = 'Thùy Dung'
TEMPO = 0.85


def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    return [w for w in ''.join(c if c.isalnum() or c.isspace() else ' ' for c in s).split() if w]


def wer(ref, hyp):
    a, b = norm(ref), norm(hyp)
    D = [[i + j if i * j == 0 else 0 for j in range(len(b) + 1)] for i in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            D[i][j] = min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] != b[j - 1]))
    return D[-1][-1] / max(1, len(a))


def load(path):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.float32)


S = json.load(open('script.json'))
tts = Vieneu()
asr = WhisperModel('small', device='cpu', compute_type='int8')
report = []
for L in S['lines']:
    # numbers are spoken as words in the script; whisper writes digits, so compare against a digit-free reading too
    best = None
    for k in range(N):
        raw = f'raw/{L["id"]}.t{k}.wav'
        tts.save(tts.infer(L['text'], voice=VOICE), raw)
        heard = ' '.join(s.text for s in asr.transcribe(load(raw), language='vi', beam_size=5)[0])
        heard = heard.replace('20', 'hai mươi').replace('11', 'mười một')
        e = wer(L['text'], heard)
        if best is None or e < best[0]:
            best = (e, raw, heard)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', best[1], '-af', f'atempo={TEMPO}', L['file']], check=True)
    report.append({'id': L['id'], 'wer': round(best[0], 3), 'take': best[1], 'heard': best[2].strip()})
    print(f"{L['id']:14s} WER {best[0]:.2f}  {best[2].strip()}", flush=True)
json.dump(report, open('takes.json', 'w'), ensure_ascii=False, indent=1)
