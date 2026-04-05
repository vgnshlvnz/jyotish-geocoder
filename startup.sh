#!/usr/bin/env bash
set -euo pipefail

export NODE_ENV="${NODE_ENV:-production}"
PORT="${PORT:-8080}"
HOST="${HOSTNAME:-0.0.0.0}"

if [ ! -d ".next" ]; then
  echo "No .next build output found. Running build..."
  npm run build
fi

exec npm run start -- --hostname "$HOST" --port "$PORT"
