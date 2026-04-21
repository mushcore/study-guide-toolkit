#!/usr/bin/env bash
# W03 — Razor Pages Code-First with Individual Auth (CommunityApp)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/CommunityApp"

echo "[W03] Running CommunityApp Razor Pages app (dotnet run)..."
echo "      Migrations apply automatically on startup via Database.Migrate()."
exec dotnet run
