#!/usr/bin/env bash
# Recodifica un video para que avance suave con el scroll (keyframes densos, sin audio).
# Adaptado de scroll-craft (MIT, Nate Herk): un encode web normal tiene un keyframe
# cada 2-5 s y al hacer scroll "va a saltos"; con -g 8 cada salto es instantáneo.
#
#   ./scripts/encode-scrub.sh entrada.mp4 video/hero.mp4      (escritorio, 1080p)
#   ./scripts/encode-scrub.sh entrada.mp4 video/planta.mp4    (video de planta)
set -euo pipefail
IN="${1:?uso: encode-scrub.sh <entrada> <salida>}"
OUT="${2:?uso: encode-scrub.sh <entrada> <salida>}"
mkdir -p "$(dirname "$OUT")"
ffmpeg -y -hide_banner -loglevel error -i "$IN" -an \
  -vf "scale=-2:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset slow -crf 22 \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$OUT"
du -h "$OUT"
