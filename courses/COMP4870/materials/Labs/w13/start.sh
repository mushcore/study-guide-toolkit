#!/usr/bin/env bash
# W13 — Razor Pages FIFA World Cup (Excel + PDF downloads + Pie Chart)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/FifaWorldCup"

echo "[W13] Running FifaWorldCup (dotnet run)..."
echo "      Routes: / (pie chart), /Excel (xlsx download), /PdfReport (pdf download)"
exec dotnet run
