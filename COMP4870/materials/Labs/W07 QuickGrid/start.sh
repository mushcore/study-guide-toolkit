#!/usr/bin/env bash
# W07 — Blazor QuickGrid (Students pagination + filtering + sorting)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/BlazorStudents"

echo "[W07] Running BlazorStudents (dotnet run)..."
exec dotnet run
