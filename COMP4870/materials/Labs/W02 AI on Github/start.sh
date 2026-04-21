#!/usr/bin/env bash
# W02 — Razor Pages + Semantic Kernel with GitHub AI Models
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/GitHubAiModelSK"

# Warn if GitHub PAT is still a placeholder
if grep -q "YOUR_GITHUB_PAT_HERE" appsettings.json 2>/dev/null; then
  echo "[W02] WARNING: appsettings.json still has YOUR_GITHUB_PAT_HERE."
  echo "      Replace 'AI:PAT' with your GitHub token before sending prompts."
fi

echo "[W02] Running GitHubAiModelSK Razor Pages app (dotnet run)..."
exec dotnet run
