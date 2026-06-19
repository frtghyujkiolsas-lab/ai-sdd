#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
HTML_PATH="$ROOT_DIR/xianma-badge-template.html"
OUT_PATH="${1:-$ROOT_DIR/output/xianma-badge-template.png}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

mkdir -p "$(dirname "$OUT_PATH")"

"$CHROME" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --window-size=900,1200 \
  --screenshot="$OUT_PATH" \
  "file://$HTML_PATH"

echo "Badge image exported: $OUT_PATH"
