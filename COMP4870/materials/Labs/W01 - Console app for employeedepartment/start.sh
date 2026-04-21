#!/usr/bin/env bash
# W01 — EF Core Reverse-Engineered Console App (EmployeeDepartment)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/EmployeeDepartmentApp"

# Create company.db from database_setup.sql if it doesn't exist yet
if [ ! -f company.db ]; then
  if command -v sqlite3 >/dev/null 2>&1; then
    echo "[W01] Creating company.db from database_setup.sql..."
    sqlite3 company.db < "$SCRIPT_DIR/database_setup.sql"
  else
    echo "[W01] company.db missing and sqlite3 CLI not found."
    echo "      The app will auto-create and seed via EnsureCreated()."
  fi
fi

echo "[W01] Running EmployeeDepartmentApp (dotnet run)..."
exec dotnet run
