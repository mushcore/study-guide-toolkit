# W05 Lab Solution - MCP Server & Client

## How This Solution Completes the Lab

The lab requires creating an MCP (Model Context Protocol) server that answers questions about everyday beverages using [this JSON data](https://gist.githubusercontent.com/medhatelmasry/fab36e3fac4ddafac0f837c920741eae/raw/734f416e93967c02ce36d404916b06da6de5fa77/beverages.json), along with a C# MCP client that communicates with it via GitHub Models AI.

### Lab Questions Addressed

The MCP server exposes tools that enable the AI to answer all five required questions:

| Lab Question | MCP Tool Used |
|---|---|
| Which beverages contain sugar? | `GetBeveragesContainingSugar` - filters beverages whose `MainIngredient` contains "Sugar" |
| Which beverages have the most calories? | `GetBeveragesWithMostCalories` - returns all beverages sorted by `CaloriesPerServing` descending |
| Which beverages originate from Ethiopia? | `GetBeveragesByOrigin("Ethiopia")` - filters beverages by `Origin` field |
| Which beverages belong to the tea category? | `GetBeveragesByCategory("Tea")` - filters beverages by `Type` field |
| What is the origin of Margarita? | `GetBeverageByName("Margarita")` - looks up a specific beverage and returns its details including `Origin` |

### Project Structure

```
W05 MCP Server & Client/
  BeveragesMcpServer/           # MCP Server (console app with stdio transport)
    Beverage.cs                 # Beverage model + JSON source generation context
    BeverageService.cs          # Service that fetches and caches beverage data from the JSON URL
    BeverageTools.cs            # MCP tool definitions ([McpServerToolType] / [McpServerTool])
    Program.cs                  # Host builder with AddMcpServer + WithStdioServerTransport
    BeveragesMcpServer.csproj

  BeveragesMcpClient/           # MCP Client (console app with chat loop)
    Program.cs                  # Connects to MCP server, integrates with GitHub Models AI
    appsettings.json            # Configuration for GitHub token and model name
    BeveragesMcpClient.csproj
```

### Architecture

- **BeveragesMcpServer** runs as a stdio-based MCP server. The client launches it via `dotnet run` and communicates over stdin/stdout using the MCP protocol.
- **BeveragesMcpClient** creates an `StdioClientTransport` that starts the server process, discovers available tools via `ListToolsAsync()`, and passes them to an OpenAI-compatible chat client (GitHub Models) so the AI can invoke them via function calling.
- The server fetches the beverages JSON from the GitHub Gist URL and caches it for 10 minutes.

### Key NuGet Packages

**Server:**
- `ModelContextProtocol` - MCP server SDK
- `Microsoft.Extensions.Hosting` - Generic host for the server
- `System.Text.Json` - JSON serialization

**Client:**
- `ModelContextProtocol` - MCP client SDK (StdioClientTransport, McpClient)
- `OpenAI` - OpenAI client library
- `Microsoft.Extensions.AI` - AI abstractions (IChatClient, ChatClientBuilder)
- `Microsoft.Extensions.AI.OpenAI` - OpenAI to IChatClient bridge (AsIChatClient)
- `Microsoft.Extensions.Configuration.Json` - appsettings.json support
- `Microsoft.Extensions.Logging` / `Microsoft.Extensions.Logging.Console` - Logging

### Note

This solution does **not** deploy to Docker Hub, as stated in the lab instructions: "You do not need to deploy your application to Docker Hub."

---

## How to Run / Test

### Prerequisites

- .NET 10 SDK installed
- A GitHub Personal Access Token (PAT) with access to GitHub Models

### Step 1: Configure your GitHub Token

Edit `BeveragesMcpClient/appsettings.json` and replace `YOUR_GITHUB_TOKEN_HERE` with your actual GitHub PAT:

```json
{
  "AI": {
    "GitHubToken": "ghp_your_actual_token_here",
    "ModelName": "gpt-4o"
  }
}
```

To get a GitHub token for GitHub Models:
1. Go to https://github.com/settings/tokens
2. Generate a new token (classic) with no special scopes required for GitHub Models

### Step 2: Build both projects

```bash
cd "Labs/W05 MCP Server & Client"
dotnet build BeveragesMcpServer/BeveragesMcpServer.csproj
dotnet build BeveragesMcpClient/BeveragesMcpClient.csproj
```

### Step 3: Run the client

```bash
cd BeveragesMcpClient
dotnet run
```

The client will:
1. Start the BeveragesMcpServer as a child process
2. List the available MCP tools
3. Present an interactive chat prompt

### Step 4: Test with the lab questions

Type these prompts at the `You:` prompt:

```
Using the beverages MCP server, let me know which beverages contain sugar?
Using the beverages MCP server, let me know which beverages have the most calories?
Using the beverages MCP server, let me know which beverages originate from Ethiopia?
Using the beverages MCP server, let me know which beverages belong to the tea category?
Using the beverages MCP server, let me know what is the origin of Margarita?
```

Type `exit` to quit.

### Expected Results

- **Sugar beverages:** Coca-Cola, Pepsi, Kombucha, Energy Drink, Tonic Water (all have "Sugar" in MainIngredient)
- **Most calories:** Milkshake (350), Smoothie (250), Pina Colada (245), etc.
- **Ethiopia origin:** Black Coffee
- **Tea category:** Green Tea, Chai, Matcha Latte, Herbal Tea, Bubble Tea (Type contains "Tea")
- **Margarita origin:** Mexico
