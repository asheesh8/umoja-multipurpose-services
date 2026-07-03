#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v claude >/dev/null 2>&1; then
  echo "Claude Code is not installed. Get it at https://docs.claude.com/claude-code" >&2
  exit 1
fi

echo "Rebuilding the website for Umoja Multipurpose Cleaning Services with Claude Code..."
claude -p "$(cat PROMPT.md)" \
  --permission-mode acceptEdits \
  --allowedTools "Read,Write,Edit,Bash,WebFetch"

echo ""
echo "Done. Open site/index.html in your browser to preview."
