# W06 Lab - Azure Functions MCP Server (FIFA World Cup)

## Overview

This solution implements an Azure Functions MCP (Model Context Protocol) server that processes FIFA World Cup soccer data (men and women). It follows the same patterns taught in the W05 MCP Server & Client lab (BeveragesMcpServer) but replaces the stdio transport with Azure Functions hosting using the `Microsoft.Azure.Functions.Worker.Extensions.Mcp` package and `[McpToolTrigger]` attributes.

## How This Solution Completes the Lab

The lab requires an Azure Functions MCP server that can answer the following questions:

| Lab Question | MCP Tool Used |
|---|---|
| Which games were played in the country of Germany? | `get_games_by_country` (country = "Germany") |
| Which games were played in the city of Vancouver? | `get_games_by_city` (city = "Vancouver") |
| How many times did Brazil win the men's soccer world cup? | `get_wins_by_team` (team = "Brazil") - the AI filters by Gender = "Men" |
| Where will the next games be held? | `get_upcoming_games` - returns games with Winner = "TBD" |
| How many women games were played? | `get_games_by_gender` (gender = "Women") |

### MCP Tools Implemented

| Tool Name | Description | Parameters |
|---|---|---|
| `get_all_games` | Returns all FIFA World Cup games as JSON | None |
| `get_games_by_country` | Filter games by host country | `country` (required) |
| `get_games_by_city` | Filter games by host city | `city` (required) |
| `get_wins_by_team` | Get wins by a specific team | `team` (required) |
| `get_upcoming_games` | Get games not yet played (TBD winner) | None |
| `get_games_by_gender` | Filter games by Men or Women | `gender` (required) |
| `get_game_count` | Total count of all games | None |

### Architecture (follows W05 lecture patterns)

- **FifaWorldCup.cs** - Data model matching the JSON schema (like `Beverage.cs` in W05)
- **FifaService.cs** - Fetches and caches data from the FIFA JSON API with 10-minute cache (like `BeverageService.cs` in W05)
- **FifaTools.cs** - MCP tool definitions using `[McpToolTrigger]` and `[McpToolProperty]` attributes (similar to `BeverageTools.cs` in W05, but using Azure Functions MCP extension instead of `[McpServerTool]`)
- **Program.cs** - Azure Functions application builder with `ConfigureFunctionsWebApplication()`
- **host.json** - MCP server configuration (serverName, serverVersion)
- **local.settings.json** - Local development settings

### Key Differences from W05

| W05 (Console MCP Server) | W06 (Azure Functions MCP Server) |
|---|---|
| `ModelContextProtocol` NuGet package | `Microsoft.Azure.Functions.Worker.Extensions.Mcp` NuGet package |
| `[McpServerToolType]` + `[McpServerTool]` attributes | `[McpToolTrigger]` + `[McpToolProperty]` attributes |
| `WithStdioServerTransport()` in Program.cs | `ConfigureFunctionsWebApplication()` in Program.cs |
| Runs as console app | Runs as Azure Function (local or deployed) |
| Client connects via stdio | Client connects via HTTP (`/runtime/webhooks/mcp`) |

## Prerequisites

- .NET 10 SDK
- Azure Functions Core Tools v4 (version 4.0.7030 or later)
- Azurite (Azure Storage Emulator) for local development
- VS Code with Azure Functions extension (for deployment)

## How to Run Locally

1. **Start Azurite** (required for MCP extension's queue-based SSE transport):
   ```bash
   azurite --silent
   ```
   Or use the VS Code Azurite extension (Ctrl+Shift+P > "Azurite: Start").

2. **Run the function app**:
   ```bash
   cd FifaMcpServer
   func start
   ```
   The MCP server will be available at: `http://localhost:7071/runtime/webhooks/mcp`

3. **Verify it starts** - you should see the 7 tool functions listed in the console output.

## How to Test with VS Code

### Option 1: Configure as MCP Server in VS Code

Create or edit `.vscode/mcp.json` in your workspace:

```json
{
    "servers": {
        "fifa-mcp-local": {
            "type": "http",
            "url": "http://localhost:7071/runtime/webhooks/mcp"
        }
    }
}
```

Then use GitHub Copilot Chat to ask questions like:
- "Using the FIFA MCP server, tell me which games were played in the country of Germany?"
- "Using the FIFA MCP server, tell me which games were played in the city of Vancouver?"
- "Using the FIFA MCP server, tell me how many times did Brazil win the mens soccer world cup?"
- "Using the FIFA MCP server, tell me where will the next games be held?"
- "Using the FIFA MCP server, tell me how many women games were played?"

### Option 2: Test with curl

```bash
# Test the Streamable HTTP endpoint
curl http://localhost:7071/runtime/webhooks/mcp
```

## How to Deploy to Azure

1. **Create Azure resources** via Azure Portal or CLI:
   ```bash
   az group create --name FifaMcpRG --location westus2
   az storage account create --name fifamcpstorage --resource-group FifaMcpRG --sku Standard_LRS
   az functionapp create --name FifaMcpServer --resource-group FifaMcpRG --storage-account fifamcpstorage --consumption-plan-location westus2 --runtime dotnet-isolated --functions-version 4
   ```

2. **Deploy from VS Code**: Right-click the project > Deploy to Function App > Select your function app.

   Or via CLI:
   ```bash
   func azure functionapp publish FifaMcpServer
   ```

3. **Get the MCP system key** (required for remote access):
   ```bash
   az functionapp keys list --resource-group FifaMcpRG --name FifaMcpServer --query systemKeys.mcp_extension --output tsv
   ```

4. **Connect VS Code to the deployed MCP server** - update `.vscode/mcp.json`:
   ```json
   {
       "inputs": [
           {
               "type": "promptString",
               "id": "mcp-key",
               "description": "MCP Extension System Key",
               "password": true
           }
       ],
       "servers": {
           "fifa-mcp-azure": {
               "type": "http",
               "url": "https://FifaMcpServer.azurewebsites.net/runtime/webhooks/mcp",
               "headers": {
                   "x-functions-key": "${input:mcp-key}"
               }
           }
       }
   }
   ```

## Package Versions

| Package | Version | Notes |
|---|---|---|
| `Microsoft.Azure.Functions.Worker` | 2.0.0 | As specified by the lab instructions |
| `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore` | 2.0.0 | ASP.NET Core integration for Azure Functions |
| `Microsoft.Azure.Functions.Worker.Extensions.Mcp` | 1.0.0 | MCP tool trigger and property attributes |
| `Microsoft.Azure.Functions.Worker.Sdk` | 2.0.7 | Build tooling (2.0.2 doesn't support net10.0) |

## Data Source

FIFA World Cup JSON: https://gist.githubusercontent.com/medhatelmasry/bc40ebfa5ed41b7512e36e6bfbcd18bd/raw/f24b734bb012061e97fead5980c34ffa0d73587e/fifa-world-cup.json

Contains 33 tournament entries (1930-2027) with fields: GameId, Year, Gender, City, Country, Continent, Winner.
