#!/usr/bin/env bash
# Generate the Vietnamese voice-over with Piper TTS (offline).
# Needs: pip install piper-tts, ffmpeg, and the vais1000 voice from
# https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-vi_VN-vais1000-medium.tar.bz2
# Usage: scripts/make_voice.sh path/to/vi_VN-vais1000-medium.onnx
set -euo pipefail
MODEL="$1"
OUT=public/voice
TMP=$(mktemp -d)
mkdir -p "$OUT"
i=0
while IFS= read -r line; do
  i=$((i + 1))
  echo "$line" | python3 -m piper -m "$MODEL" --length-scale 1.45 --noise-scale 0.5 --sentence-silence 0.4 -f "$TMP/l$i.wav"
  ffmpeg -nostdin -v error -y -i "$TMP/l$i.wav" \
    -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5" \
    -ar 44100 "$OUT/line$i.wav"
done <<'LINES'
Hai mươi tháng mười một, Ngày Nhà giáo Việt Nam.
Có những người lặng lẽ đứng trên bục giảng, ngày ngày gieo từng con chữ.
Từ nét chữ đầu tiên, thầy cô chắp cánh cho bao ước mơ bay xa.
Thầy cô là người lái đò, đưa chúng em sang bến bờ tri thức.
Xin gửi lời tri ân sâu sắc nhất đến tất cả thầy cô. Chúc thầy cô luôn mạnh khỏe và hạnh phúc.
LINES
