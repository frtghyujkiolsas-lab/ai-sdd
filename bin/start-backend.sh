#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"

mkdir -p "$LOG_DIR"
cd "$ROOT"

export PORT=8888
export HOST="127.0.0.1"
export HIVISION_BASE="http://localhost:8080"

exec /usr/bin/python3 server.py >> "$LOG_DIR/backend.log" 2>&1
