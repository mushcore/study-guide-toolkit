#!/usr/bin/env bash
# W10 — Razor Pages Localization (Sports app)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/Sports"

echo "[W10] Running Sports app (dotnet run)..."
echo "      Languages: en (default), fr, de, zh. Switch via the footer dropdown."
exec dotnet run
