#!/usr/bin/env bash
# W09 — gRPC + .NET Aspire + Server-Side Blazor
# Launches the Aspire AppHost, which orchestrates both the gRPC backend
# and the Blazor frontend. The Aspire dashboard will open automatically.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/GrpcBasics/GrpcBasics.AppHost"

echo "[W09] Running Aspire AppHost (dotnet run)..."
echo "      This starts the gRPC backend and the BlazorGrpcClient frontend."
exec dotnet run
