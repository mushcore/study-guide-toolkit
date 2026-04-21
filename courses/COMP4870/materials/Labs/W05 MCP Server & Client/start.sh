#!/usr/bin/env bash
# W05 — Beverages MCP Server + Client
# The client launches the server as a subprocess via StdioClientTransport,
# so you only run the client here.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/BeveragesMcpClient"

if grep -q "YOUR_GITHUB_TOKEN_HERE" appsettings.json 2>/dev/null; then
  echo "[W05] WARNING: appsettings.json still has YOUR_GITHUB_TOKEN_HERE."
  echo "      Replace 'AI:GitHubToken' with your GitHub token before sending prompts."
fi

echo "[W05] Running BeveragesMcpClient (dotnet run)..."
echo "      It will spawn BeveragesMcpServer over stdio automatically."
exec dotnet run
