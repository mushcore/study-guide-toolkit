#!/usr/bin/env bash
# W11 — File-Based C# App (FilteredStudents using Spectre.Console)
# Usage: ./start.sh [keyword]
# Defaults to "medicine" if no keyword given. Try: liz, fox, 2002, Mining, Male, etc.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/FilteredStudents"

KEYWORD="${1:-medicine}"
echo "[W11] Running filterStudents.cs with keyword: $KEYWORD"
exec dotnet run filterStudents.cs -- "$KEYWORD"
