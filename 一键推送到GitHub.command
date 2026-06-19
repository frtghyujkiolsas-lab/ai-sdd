#!/bin/zsh
cd "$(dirname "$0")" || exit 1
./push-to-github.sh
echo
echo "Press Enter to close this window..."
read -r _
