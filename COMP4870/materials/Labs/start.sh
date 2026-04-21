#!/usr/bin/env bash
# COMP4870 — Master lab launcher
# Pick a lab from the menu, or pass its number as an argument:
#   ./start.sh          # interactive menu
#   ./start.sh 7        # run W07 directly
#   ./start.sh 11 fox   # run W11 with keyword "fox"
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Display label | relative lab folder
LABS=(
  "W01  EF Core Console (EmployeeDepartment)|W01 - Console app for employeedepartment"
  "W02  Razor Pages + Semantic Kernel (GitHub AI)|W02 AI on Github"
  "W03  Razor Pages Code-First (CommunityApp)|W03 - Code 1'st DB dev"
  "W04  Vite React TypeScript (students-react-ts)|W04 React deploy"
  "W05  MCP Server + Client (Beverages)|W05 MCP Server & Client"
  "W06  Azure Functions MCP (FIFA)|W06 Azure Functions MCP Server"
  "W07  Blazor QuickGrid (Students)|W07 QuickGrid"
  "W09  gRPC + Aspire + Blazor CRUD|W09 gRPC"
  "W10  Sports Localization (en/fr/de/zh)|W10 Localization"
  "W11  File-based C# (FilteredStudents)|W11 File Based C# Apps"
  "W13  Excel/PDF/Chart (FIFA)|w13"
)

run_lab() {
  local entry="${LABS[$1]}"
  local folder="${entry##*|}"
  shift
  local script="$SCRIPT_DIR/$folder/start.sh"
  if [ ! -x "$script" ]; then
    chmod +x "$script" 2>/dev/null || true
  fi
  exec "$script" "$@"
}

# Non-interactive mode: ./start.sh <lab number> [extra args...]
if [ "$#" -ge 1 ] && [[ "$1" =~ ^[0-9]+$ ]]; then
  NUM="$1"; shift
  case "$NUM" in
    1)  run_lab 0 "$@" ;;
    2)  run_lab 1 "$@" ;;
    3)  run_lab 2 "$@" ;;
    4)  run_lab 3 "$@" ;;
    5)  run_lab 4 "$@" ;;
    6)  run_lab 5 "$@" ;;
    7)  run_lab 6 "$@" ;;
    9)  run_lab 7 "$@" ;;
    10) run_lab 8 "$@" ;;
    11) run_lab 9 "$@" ;;
    13) run_lab 10 "$@" ;;
    *)  echo "Unknown lab number: $NUM (valid: 1 2 3 4 5 6 7 9 10 11 13)"; exit 1 ;;
  esac
fi

# Interactive menu
echo
echo "COMP4870 — Lab Launcher"
echo "-----------------------"
i=1
for entry in "${LABS[@]}"; do
  label="${entry%%|*}"
  printf "  %2d) %s\n" "$i" "$label"
  i=$((i+1))
done
echo "   q) quit"
echo

read -rp "Select a lab: " choice
case "$choice" in
  q|Q|"") echo "bye"; exit 0 ;;
  *[!0-9]*|"") echo "Invalid selection: $choice"; exit 1 ;;
esac

if [ "$choice" -lt 1 ] || [ "$choice" -gt "${#LABS[@]}" ]; then
  echo "Out of range: $choice"
  exit 1
fi

run_lab "$((choice-1))"
