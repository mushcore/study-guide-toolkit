#!/usr/bin/env bash
# W06 — Azure Functions MCP Server (FIFA World Cup)
# Starts Azurite (storage emulator) in the background if not already running,
# then starts the Functions host via `func start`.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start Azurite in the background if it's not already listening on :10000
AZURITE_WORKSPACE="$SCRIPT_DIR/.azurite"
if ! lsof -i :10000 -sTCP:LISTEN >/dev/null 2>&1; then
  if command -v azurite >/dev/null 2>&1; then
    echo "[W06] Starting Azurite in background (workspace: .azurite)..."
    mkdir -p "$AZURITE_WORKSPACE"
    azurite --silent --location "$AZURITE_WORKSPACE" \
      --debug "$AZURITE_WORKSPACE/debug.log" &
    AZURITE_PID=$!
    trap 'kill $AZURITE_PID 2>/dev/null || true' EXIT
    sleep 2
  else
    echo "[W06] WARNING: Azurite not found on PATH (install: npm i -g azurite)."
    echo "      Functions host may fail to start without storage emulator."
  fi
else
  echo "[W06] Azurite already running on :10000."
fi

cd "$SCRIPT_DIR/FifaMcpServer"

if ! command -v func >/dev/null 2>&1; then
  echo "[W06] ERROR: 'func' (Azure Functions Core Tools) not found on PATH."
  echo "      Install: brew tap azure/functions && brew install azure-functions-core-tools@4"
  exit 1
fi

echo "[W06] Running FifaMcpServer (func start)..."
exec func start
