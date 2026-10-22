#!/usr/bin/env sh
# Converts Remotion's full-range output to standard (TV) range yuv420p,
# the safest format for social platforms, and moves the index to the
# front of the file for faster web playback. Audio is copied unchanged.
set -e
IN="${1:-out/alsafwa-travel-ad.mp4}"
OUT="${2:-deliverables/alsafwa-travel-ad.mp4}"
mkdir -p "$(dirname "$OUT")"
ffmpeg -hide_banner -loglevel error -y -i "$IN" \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 17 -profile:v high \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a copy -movflags +faststart "$OUT"
echo "Wrote $OUT"
