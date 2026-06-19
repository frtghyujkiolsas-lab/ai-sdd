#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/figma-make-export"
LOG_DIR="$ROOT/logs"

mkdir -p "$LOG_DIR"
cd "$FRONTEND"

export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

exec npm run dev -- --host 127.0.0.1 --port "${FRONTEND_PORT:-5174}" >> "$LOG_DIR/frontend.log" 2>&1
