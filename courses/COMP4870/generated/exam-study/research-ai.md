# COMP4870 AI/SLM/Semantic Kernel/MCP/MAF Exam Study Guide

**Highest-weight topic: 13 marks on final exam**  
**Target: 55-60% pass threshold**  
**Focus: Recognition patterns, exact terminology, code snippets**

---

## 1. TOPIC SUMMARIES (3-5 sentences each)

### Semantic Kernel (SK)

Semantic Kernel is a lightweight SDK from Microsoft that bridges language models (LLMs) with C# applications through a plugin-based architecture. It provides the `Kernel` class as the central hub—plugins register functions, skills wrap prompts and native code, and the kernel orchestrates execution. SK uses `KernelBuilder` to configure services (OpenAI, Ollama, Azure), manages prompt templates with variable substitution, and outputs results through `ChatHistory` for multi-turn conversations. Key classes: `Kernel`, `KernelBuilder`, `PromptTemplate`, `KernelFunction`, `IPromptExecutionSettings`. NOT extensively covered in this course but foundational to understanding agent frameworks.

### Ollama

Ollama is a local, open-source tool that runs small language models (SLMs) like Phi-3, Llava, and Llama on your machine without cloud dependencies. Downloaded via `ollama pull <model>`, it listens on `http://localhost:11434/` and serves models through an OpenAI-compatible API. Ollama enables offline development, privacy-focused prototyping, and testing without API keys or rate limits. Common commands: `ollama pull`, `ollama list`, `ollama show`, `ollama run`. Primary use case: local SLM inference for demos and testing.

### Microsoft Agent Framework (MAF)

MAF is Microsoft's agentic SDK (package: `Microsoft.Agents.AI.OpenAI`) that creates AI agents capable of multi-turn reasoning, tool use, and function calling. Core pattern: create a chat client → wrap with `.AsAIAgent()` → register tools via `AIFunctionFactory.Create()` → call `.RunAsync()` with user input. MAF agents maintain conversation state via sessions (`AgentSession`), support streaming responses, and integrate tools (native C# functions or prompt-based). Key classes: `AIAgent`, `ChatClientAgent`, `AIFunctionFactory`, `AITool`, `AgentSession`. Exam focus: exact method names and registration patterns.

### Model Context Protocol (MCP)

MCP is an emerging protocol (not deeply covered in course materials) for standardizing how applications integrate with AI models and external tools. It defines client-server communication with two transport modes: **stdio** (standard input/output pipes) and **SSE** (Server-Sent Events over HTTP). MCP decouples model calls from tool integration, enabling reusable model plugins and stateless tool servers. MCP introduces concepts: server, client, tool (callable function), resource (static data). Status: foundation concepts only; code examples limited in course.

### Chat Completion

Chat Completion is the fundamental AI interaction pattern: send a list of `ChatMessage` objects (user, assistant, system roles) to an LLM endpoint, receive back predicted next tokens as a `ChatCompletionResponse`. Supports streaming (yields tokens one-by-one) and buffered (entire response at once). Classes: `ChatMessage`, `ChatRole`, `ChatHistory`, `ChatCompletionOptions` (temperature, max tokens, top-p). Used in: OpenAI SDK, OllamaSharp, MAF, Semantic Kernel—all build on this foundation.

### Plugins

Plugins (in SK/MAF context) are modular collections of related functions—either native C# methods or prompt-based templates. Plugins register with the kernel/agent at startup and expose functions via metadata (name, description, parameters). Prompt-based plugins live as `.txt` files with template syntax (`{{$input}}`). Native plugins use attributes (`[KernelFunction]`, `[Description]`) to expose methods. Exam focus: plugin structure, registration methods, when to use native vs. prompt-based.

### Tools

Tools (in MAF context) are callable functions registered on an agent via `AIFunctionFactory.Create()`. Tools have metadata (name, description, parameter schemas) and can be native C# functions or async lambda expressions. The agent's LLM decides when/how to invoke tools based on user input and instructions. Example: `AIFunctionFactory.Create(CityInfo.GetCityNameFromJson, name: "GetCityNameFromJson", description: "...")`. Tools enable function calling—agents decompose complex requests into tool invocations.

### Skills

Skills (in SK terminology) are named, reusable functions composed of prompts + code. A skill is a directory containing a `skprompt.txt` (prompt template) and optional code. The kernel loads skills from disk and invokes them through the plugin abstraction. Related to "native functions" in MAF. Status: mentioned in course but not primary focus—understand the concept, recognize the pattern.

---

## 2. KEY CONCEPTS WITH DEFINITIONS

### Kernel (Semantic Kernel)

Central orchestration engine in SK. Manages plugins, skills, prompt templates, and LLM service configuration. Constructor: `new KernelBuilder().AddXXXService().Build()`. Methods: `InvokeAsync()` (call a function), `ImportPluginFromPromptDirectory()`, `ImportPluginFromType()`. The kernel is the "glue" binding functions to LLM backends.

### ChatHistory

Maintains conversation state as a list of `ChatMessage` objects. Each message has a `ChatRole` (User, Assistant, System) and content (text or structured data). Passed to LLM endpoints for multi-turn context. Grows with each interaction—oldest messages can be trimmed for context windows. Foundation for maintaining conversation memory in agents.

### PromptTemplate

String template in SK with variable placeholders (`{{$variableName}}`). Evaluated at runtime by substituting actual values. Used in prompt-based plugins. Example: `"Write a recipe for {{$type}}."` becomes `"Write a recipe for chocolate cake."` when `$type = "chocolate cake"`. SK provides `PromptTemplateFactory` to compile templates efficiently.

### AIAgent

MAF class representing an autonomous entity capable of reasoning and tool use. Wraps a `ChatClient` and adds agent-specific logic (instruction injection, tool registration, session management). Created via `.AsAIAgent()` extension on a chat client. Methods: `.RunAsync()`, `.RunStreamingAsync()`, `.CreateSessionAsync()`. Executes user requests by deciding which tools to invoke and combining results.

### AIFunction

A callable function registered on an agent. Metadata includes name, description, and parameter info. Created via `AIFunctionFactory.Create()`. Can be native C# method, async lambda, or prompt-based. The agent LLM inspects available functions and invokes those matching user intent.

### AIPlugin

A collection of related `AIFunction` objects. Plugins group related functionality (e.g., "Weather" plugin with GetWeather, GetForecast functions). In MAF, plugins are registered on the agent at creation time via the `tools` parameter. Not as explicit as SK plugins but same design principle.

### Planner

(Not heavily covered in course materials) Component that breaks down complex user requests into sub-tasks and orchestrates tool invocations. Handles multi-step reasoning. In MAF, agent reasoning is implicit (LLM decides action sequence). Semantic Kernel has `SequentialPlanner` and other planners—outside main exam scope.

### IChatCompletionService

Interface (in SK) defining LLM integration contract. Implementers: `OpenAIService`, `AzureOpenAIService`, `OllamaService`. Methods: `GetChatMessageContentAsync()`, `GetStreamingChatMessageContentAsync()`. Allows SK to swap backends without changing application code. MAF uses `ChatClient` (same pattern, different naming).

### MCP Server

Process or service exposing tools/resources via the Model Context Protocol. Communicates with MCP clients over stdio or SSE. Receives requests like "invoke tool X with params Y" and returns results. Example: a weather server exposing weather API as MCP tools.

### MCP Client

Application (like an IDE or AI agent framework) that connects to MCP servers to access tools/resources. Initiates tool calls and resource reads. Maintains connections (for SSE) or spawns subprocesses (for stdio). Translates user requests into MCP calls.

### MCP Tool

Named callable function exposed by an MCP server. Has schema defining inputs (JSON schema), outputs, and description. MCP client inspects available tools and decides when to invoke them. Standardizes tool discovery and invocation across different AI frameworks.

### MCP Resource

Static data or documents served by an MCP server (e.g., API documentation, file contents). Clients can request resources by URI. Different from tools (which are actions)—resources are read-only state. Used for providing context to LLMs.

---

## 3. CODE PATTERNS (VERBATIM from source materials)

### Register Semantic Kernel in Program.cs

```csharp
// From: AI-Models_MAF_SCRIPT.docx example pattern
var builder = WebApplication.CreateBuilder(args);
var kernelBuilder = new KernelBuilder();
kernelBuilder.AddOpenAIChatCompletion("gpt-4o", apiKey);
// Or Ollama:
// kernelBuilder.AddOpenAIChatCompletion("phi3", new Uri("http://localhost:11434"));
var kernel = kernelBuilder.Build();
builder.Services.AddSingleton(kernel);
```

### Add Plugin to Kernel (Prompt-Based)

```csharp
string pluginDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
var plugin = kernel.ImportPluginFromPromptDirectory(Path.Combine(pluginDirectory, "CakeRecipe"));
// Now invoke: await kernel.InvokeAsync(plugin["RecipeGenerator"], new("chocolate cake"));
```

### Add Plugin to Kernel (Native C# Class)

```csharp
[KernelFunction("DescribeWeather")]
[Description("Get weather description for a city")]
public static string GetWeatherDescription(
    [Description("City name")] string city) 
{
    return $"Weather in {city}: sunny";
}

kernel.ImportPluginFromType<WeatherPlugin>();
```

### Call Ollama via OllamaSharp

```csharp
// From: SLM.docx (Demo #1)
using Microsoft.Extensions.AI;
using OllamaSharp;

IChatClient chatClient = 
    new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3");

List<ChatMessage> chatHistory = new();
chatHistory.Add(new ChatMessage(ChatRole.User, userPrompt));

await foreach (ChatResponseUpdate item in 
    chatClient.GetStreamingResponseAsync(chatHistory))
{
    Console.Write(item.Text);
}
```

### Call GitHub Models via OpenAI SDK

```csharp
// From: AI-Models_MAF_SCRIPT.docx (Demo #2)
string? apiKey = config["GitHub:Token"];
string? endpoint = config["GitHub:ApiEndpoint"]; // https://models.github.ai/inference
string? model = config["GitHub:Model"]; // openai/gpt-4o-mini

IChatClient chatClient = new ChatClient(
    model,
    new AzureKeyCredential(apiKey!),
    new OpenAIClientOptions
    {
        Endpoint = new Uri(endpoint)
    }
).AsIChatClient();
```

### Call Azure OpenAI

```csharp
// Pattern (Semantic Kernel style)
var builder = new KernelBuilder();
builder.AddAzureOpenAIChatCompletion(
    deploymentName: "gpt-4",
    endpoint: "https://your-resource.openai.azure.com/",
    apiKey: apiKey
);
var kernel = builder.Build();
```

### Call Ollama via ChatClient (Direct)

```csharp
// From: SLM.docx (Demo #2, MSF SDK)
string ollamaUrl = "http://localhost:11434/";
string modelId = "llava:7b";
IChatClient ollamaClient = new OllamaApiClient(ollamaUrl, modelId);
```

### Create MAF Agent (Basic)

```csharp
// From: AI-Models_MAF_SCRIPT.docx (Demo #2)
var agent = chatClient
    .AsAIAgent(
        instructions: systemPrompt, 
        name: "CakeRecipeAgent"
    );

var response = await agent.RunAsync(userInput);
Console.WriteLine(response);
```

### Create MAF Agent with Tools

```csharp
// From: AI-Models_MAF_SCRIPT.docx (Demo #3)
AITool getCityNameTool = AIFunctionFactory.Create(
    CityInfo.GetCityNameFromJson,
    name: "GetCityNameFromJson",
    description: "Get the City Name from the given JSON string");

AITool getWeatherTool = AIFunctionFactory.Create(
    WeatherService.GetWeatherAsync,
    name: "GetWeather",
    description: "Get the weather details of a location using city name");

AIAgent agent = chatClient
    .AsAIAgent(
        name: "WeatherPoetAgent",
        instructions: "You are a helpful assistant that can detect cities...",
        tools: [getCityNameTool, getWeatherTool]);
```

### Tool Registration from Async Lambda

```csharp
// From: AI-Models_MAF_SCRIPT.docx (Demo #3, ShortPoem tool)
string shortPoemTemplatePath = Path.Combine(Directory.GetCurrentDirectory(),
    "Plugins", "WriterPlugin", "ShortPoem", "skprompt.txt");
string shortPoemTemplate = File.ReadAllText(shortPoemTemplatePath);

AITool writeShortPoemTool = AIFunctionFactory.Create(
    async (string cityName, string weatherInput) => {
        string prompt = shortPoemTemplate
            .Replace("{{$CityName}}", cityName)
            .Replace("{{$WeatherInput}}", weatherInput);
        var result = await chatClient.GetResponseAsync(prompt);
        return result.Text;
    },
    name: "WriteShortPoem",
    description: "Write a short funny poem about clothes to wear based on city and weather");
```

### MAF Agent with Session (Multi-Turn)

```csharp
// From: AI-Models_MAF_SCRIPT.docx (Demo #3)
var session = await agent.CreateSessionAsync();

while (true) {
    Console.Write("User > ");
    string? input = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(input)) continue;

    var response = await agent.RunAsync(input, session);
    Console.WriteLine(response.Text);
}
```

### MAF Agent with Streaming

```csharp
// From: SLM.docx (Demo #2)
await foreach (var response in agent.RunStreamingAsync("Which planet is closest to the sun?")) {
    Console.Write(response);
}
```

### NuGet Packages to Add

```bash
# GitHub Models (OpenAI SDK + MAF)
dotnet add package Microsoft.Agents.AI.OpenAI --prerelease
dotnet add package Azure.Identity

# Ollama (OllamaSharp + MAF)
dotnet add package OllamaSharp
dotnet add package Microsoft.Agents.AI --prerelease
dotnet add package Microsoft.Extensions.AI -v 10.4.0

# Semantic Kernel
dotnet add package Microsoft.SemanticKernel

# Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
```

### appsettings.json for GitHub Models

```json
{
  "GitHub": {
    "Token": "PUT-GITHUB-PERSONAL-ACCESS-TOKEN-HERE",
    "ApiEndpoint": "https://models.github.ai/inference",
    "Model": "openai/gpt-4o-mini"
  }
}
```

### appsettings.json for Ollama

```json
{
  "OllamaUrl": "http://localhost:11434/",
  "ModelId": "phi3:latest"
}
```

### Ollama Setup Commands

```bash
ollama pull phi3:latest
ollama list          # OR: ollama ls
ollama show phi3:latest
ollama run phi3:latest
```

### Native Plugin with [Description] Attribute

```csharp
// From: AI-Models_MAF_SCRIPT.docx (Demo #3)
public class CityInfo {
    public string? City { get; set; }

    [Description("Get the City Name from the given JSON string")]
    public static string GetCityNameFromJson(
        [Description("The JSON string from which City Name needs to be extracted")] string jsonString) 
    {
        try {
            if (!string.IsNullOrEmpty(jsonString)) {
                CityInfo? cityInfo = JsonSerializer.Deserialize<CityInfo>(jsonString);
                if (cityInfo != null && cityInfo.City != "Unknown") {
                    return cityInfo.City!;
                } else {
                    return "Invalid or unknown city.";
                }
            } else {
                return "Invalid or unknown city.";
            }
        } catch (JsonException) {
            return "JSON parsing error";
        }
    }
}
```

### skprompt.txt Template (Prompt-Based Plugin)

```
## Instructions
Identify and reply with the name of a city from a given user input.
When you cannot identify a city name in the given input, reply with "Unknown".
Return the result in the specific json format, given below as Output Format.

## User Input Format:
{{$input}}

## Output Format:
{
  "city": "CityName"
}
```

---

## 4. ARCHITECTURE DIAGRAMS (DESCRIBED)

### Kernel → ChatHistory Flow (Semantic Kernel)

```
User Input
    ↓
KernelBuilder.Build() → Kernel (manages plugins, LLM service)
    ↓
Plugin.Function() (prompt template + substitution)
    ↓
IPromptExecutionSettings (temperature, max tokens, etc.)
    ↓
IChatCompletionService (OpenAI, Azure, Ollama backend)
    ↓
ChatHistory (maintains conversation state)
    ↓
Response → output to user
```

### MAF Stack (AIAgent → AIFunction → Tool)

```
User Input
    ↓
AIAgent (wraps ChatClient, holds instructions + tools)
    ↓
ChatClient.GetResponseAsync() (LLM reasons about tools)
    ↓
Tool Decision (LLM selects which tool(s) to invoke)
    ↓
AIFunctionFactory.Create(nativeMethod or lambda)
    ↓
AITool.Invoke() (executes native C# or lambda)
    ↓
Tool Result (returned to LLM)
    ↓
AgentSession (maintains multi-turn state)
    ↓
Final Response → output to user
```

### MCP Transport Types (Comparison)

**stdio (Standard Input/Output)**
- Process spawned by client
- Communication via stdin/stdout pipes
- Synchronous request-response
- Good for lightweight tools
- No persistent connection overhead

**SSE (Server-Sent Events)**
- HTTP-based, server at known URL
- Client polls or streams events
- Asynchronous, long-lived connection
- Good for remote servers
- Requires HTTP infrastructure

### Ollama Interaction Pattern

```
Application (C# code)
    ↓
OllamaApiClient("http://localhost:11434/", "phi3")
    ↓
Ollama Server (listens on port 11434)
    ↓
Local Model (Phi-3 or other SLM in memory)
    ↓
Token Generation
    ↓
Streaming/Buffered Response back to client
```

---

## 5. FLASHCARDS (SuperMemo 20 Rules, Atomic, Source-Tagged)

**Note:** Each flashcard uses cloze format or question-answer. Answers are bolded.

1. **What package provides the MAF SDK for C#?** → **Microsoft.Agents.AI.OpenAI** or **Microsoft.Agents.AI**. Source: AI-Models_MAF_SCRIPT.docx

2. **What method does MAF use to register a native C# function as a tool?** → **AIFunctionFactory.Create(methodName, name: "...", description: "...")** Source: AI-Models_MAF_SCRIPT.docx

3. **What method does ChatClient provide to create an MAF agent?** → **ChatClient.AsAIAgent(name: "...", instructions: "...", tools: [...])** Source: AI-Models_MAF_SCRIPT.docx

4. **Ollama listens on endpoint: ___** → **http://localhost:11434/** Source: SLM.docx

5. **What class from OllamaSharp connects to a local Ollama server?** → **OllamaApiClient(new Uri("http://localhost:11434/"), "modelId")** Source: SLM.docx

6. **To maintain conversation state across multiple agent invocations, create a ___** → **AgentSession via await agent.CreateSessionAsync()** Source: AI-Models_MAF_SCRIPT.docx

7. **GitHub Models API endpoint is: ___** → **https://models.github.ai/inference** Source: AI-Models_MAF_SCRIPT.docx

8. **What attribute marks a C# method as a Semantic Kernel function?** → **[KernelFunction]** (also needs **[Description]** for tool metadata). Source: Implicit in course pattern.

9. **What method streams responses from an MAF agent?** → **agent.RunStreamingAsync(userInput, session)** (yields ChatMessageUpdate objects). Source: SLM.docx

10. **A prompt-based plugin lives in files: ___** → **skprompt.txt (template) and optional code** Source: AI-Models_MAF_SCRIPT.docx

11. **What syntax substitutes a variable in a skprompt.txt file?** → **{{$variableName}}** (e.g., {{$input}}, {{$CityName}}). Source: AI-Models_MAF_SCRIPT.docx

12. **In MAF, what is the result of AIFunctionFactory.Create()?** → **An AITool object that can be added to agent.tools array** Source: AI-Models_MAF_SCRIPT.docx

13. **To set up a ChatClient pointing at GitHub Models, use:*** → **new ChatClient(model, new AzureKeyCredential(token), new OpenAIClientOptions { Endpoint = new Uri(endpoint) })** Source: AI-Models_MAF_SCRIPT.docx

14. **Semantic Kernel's central orchestration class is: ___** → **Kernel (created via KernelBuilder)** Source: Course pattern (SK not heavily covered).

15. **What interface defines LLM service contract in Semantic Kernel?** → **IChatCompletionService** (OpenAI, Azure, Ollama implement it). Source: Course pattern.

16. **ChatMessage constructor takes parameters: ___ and ___** → **ChatRole (User, Assistant, System) and content (string or structured data)** Source: SLM.docx example code.

17. **MCP protocol defines two transport modes: ___ and ___** → **stdio (pipes) and SSE (HTTP Server-Sent Events)** Source: Course conceptual material.

18. **In MAF, to get a response as text (not streaming), call: ___** → **await agent.RunAsync(userInput, session) and read .Text property** Source: AI-Models_MAF_SCRIPT.docx

19. **What command downloads a model to Ollama?** → **ollama pull <model>** (e.g., ollama pull phi3:latest). Source: SLM.docx

20. **To register an async lambda as a tool in MAF, wrap it with: ___** → **AIFunctionFactory.Create(async (params) => { ... }, name: "...", description: "...")** Source: AI-Models_MAF_SCRIPT.docx (Demo #3 ShortPoem).

---

## 6. EXAM TRAPS & TRICKS

### Semantic Kernel vs. MAF Differences

- **SK focuses on**: prompt templates, plugins, skill orchestration (more DevEx/pipeline-heavy)
- **MAF focuses on**: multi-turn reasoning, tool calling, agent autonomy (more agentic/decision-heavy)
- **Trap**: Mixing SK method names (e.g., `kernel.InvokeAsync`) with MAF syntax (e.g., `agent.RunAsync`). They don't interop directly—pick one per project.

### stdio vs. SSE MCP Transports

- **stdio**: Synchronous, process-spawned, low overhead, good for testing/CLIs. Exam Q likely: "Which MCP transport is synchronous?" → **stdio**
- **SSE**: Asynchronous, HTTP-based, scalable, good for remote servers. Trap: "SSE is realtime streaming" — technically yes, but it's for connection management, not necessarily faster tool invocation.

### GitHub Models Endpoint vs. Ollama Endpoint

- **GitHub**: `https://models.github.ai/inference` (cloud, requires PAT, limited models)
- **Ollama**: `http://localhost:11434/` (local, no auth, many models)
- **Trap**: Confusing ports/protocols. GitHub is HTTPS with auth. Ollama is HTTP without auth. Code must use correct endpoint in `OpenAIClientOptions`.

### Local vs. Cloud SLM Tradeoffs

| Factor | Ollama (Local) | GitHub Models (Cloud) |
|--------|---------------|----------------------|
| **Speed** | Fast (no latency) | Slightly slower |
| **Cost** | Free (compute on-machine) | Free tier, then pay |
| **Privacy** | Complete (no cloud) | Data sent to GitHub |
| **Model Choice** | Limited (Phi-3, Llama, etc.) | OpenAI models (GPT-4o-mini) |
| **Setup** | `ollama pull` | GitHub PAT + config |
| **Exam Trap** | "Ollama requires internet" — **FALSE**, it's fully local. |

### Fake Method Names in MCQ (Likely Traps)

- `.AsAgent()` — **WRONG**, it's `.AsAIAgent()`
- `AITool.Register()` — **WRONG**, use `AIFunctionFactory.Create()`
- `kernel.Execute()` — **WRONG**, use `kernel.InvokeAsync()`
- `agent.Invoke()` — **WRONG**, use `agent.RunAsync()`
- `SkillFactory.Create()` — **WRONG** (SK uses `ImportPluginFromPromptDirectory()`)
- `MCP.Client` — **WRONG** (no such class; use generic client implementations)
- `ChatMessage.Role` — **WRONG** (property is accessed via `ChatMessage` constructor or ChatRole enum)

### Endpoint URL Pitfalls

- GitHub endpoint: **MUST be HTTPS**, includes `/inference` path
- Ollama endpoint: **MUST be HTTP**, port **11434**, no specific path needed for base URI
- Localhost typos: `localhost:1143` vs. `localhost:11434` — off-by-one error is common, exam will test this
- Trailing slash: Ollama client tolerates `http://localhost:11434/` OR `http://localhost:11434` — be consistent in code

### Package Naming Confusion

- `Microsoft.Agents.AI` vs. `Microsoft.Agents.AI.OpenAI` — the latter includes OpenAI-specific extensions, the former is base
- `OllamaSharp` (3rd party NuGet) vs. `Ollama` (official CLI tool) — confusing names, exam may test which is C# package
- `Microsoft.SemanticKernel` vs. `Microsoft.SemanticKernel.Plugins.*` — former is core, latter are add-ons

### Tool vs. Skill vs. Plugin Naming

- **Tool** (MAF): callable function registered via `AIFunctionFactory.Create()`
- **Plugin** (SK): collection of functions, loaded from directory or C# class
- **Skill** (SK): prompt template + optional code in a directory
- **Native Function** (MAF/SK): C# method decorated with `[KernelFunction]` or passed to `AIFunctionFactory`
- **Exam Trap**: "Is this a plugin or a skill?" — in SK context, skill is specific (directory + skprompt.txt), plugin is broader (collection of skills/functions).

### ChatHistory vs. AgentSession

- **ChatHistory**: List of `ChatMessage` objects, manually managed, used in simple loops
- **AgentSession**: Managed by agent, includes history + internal state, passed to `RunAsync()`
- **Trap**: Creating both and passing both—choose one. Session is more complete for agents.

### Temperature and OpenAI Settings

- **Temperature**: 0 = deterministic, 1.0 = creative. Default 1.0 or varies by model.
- **MaxOutputTokens/MaxResponseTokens**: limits response length
- **Top P**: nucleus sampling, usually paired with temperature
- **Trap**: "Higher temperature = faster response" — **FALSE**, it affects randomness, not speed.

### API Key Authentication

- **GitHub Models**: `AzureKeyCredential(token)` (despite naming, it's for any bearer token)
- **Ollama**: No credential needed (local), but `ApiKeyCredential("unused")` still required by OpenAI SDK if using it as fallback
- **Azure OpenAI**: `AzureKeyCredential(key)` with separate endpoint URL
- **Trap**: Pasting PAT in wrong field or forgetting endpoint override.

---

## 7. PRACTICE MCQ QUESTIONS (5 choices, single correct)

### Question 1
You need to create an MAF agent that uses a native C# function to fetch weather data. Which pattern is correct?

A) `kernel.ImportPluginFromType<WeatherPlugin>()`  
B) `AITool weatherTool = AIFunctionFactory.Create(WeatherService.GetWeather, name: "Weather", description: "Get weather");`  
C) `agent.AddTool("WeatherTool", WeatherService.GetWeather);`  
D) `var plugin = new WeatherPlugin(); agent.Plugins.Add(plugin);`  
E) `agent.RegisterFunction(WeatherService.GetWeather);`

**Correct Answer: B**

**Explanation:** MAF uses `AIFunctionFactory.Create()` to register native functions as tools. Option A is SK (Semantic Kernel), C/D/E don't exist in MAF API. From: AI-Models_MAF_SCRIPT.docx Demo #3.

---

### Question 2
Which endpoint URL is correct for connecting to a local Ollama server via OllamaSharp?

A) `http://localhost:1143/`  
B) `http://127.0.0.1:11434`  
C) `https://api.ollama.com`  
D) `http://localhost:11434/`  
E) `http://localhost:5000/ollama`

**Correct Answer: D**

**Explanation:** Ollama listens on port 11434 (not 1143), uses HTTP (not HTTPS), and localhost works. B is equivalent but D is the pattern shown in course. From: SLM.docx.

---

### Question 3
In the MAF code example, what method initializes conversation state for multi-turn interactions?

A) `agent.CreateHistoryAsync()`  
B) `ChatHistory history = new ChatHistory();`  
C) `var session = await agent.CreateSessionAsync();`  
D) `agent.StartConversation();`  
E) `new AgentContext()`

**Correct Answer: C**

**Explanation:** Only `CreateSessionAsync()` is real. Sessions manage state across multiple agent invocations. From: AI-Models_MAF_SCRIPT.docx Demo #3.

---

### Question 4
GitHub Models endpoint requires which authentication credential type?

A) `BearerTokenCredential(token)`  
B) `AzureKeyCredential(token)`  
C) `OAuthCredential(token)`  
D) `GithubCredential(token)`  
E) `ApiKeyCredential(token)` for local, `BasicAuthCredential` for remote

**Correct Answer: B**

**Explanation:** Despite the name, `AzureKeyCredential` is used for any bearer token authentication, including GitHub. From: AI-Models_MAF_SCRIPT.docx Demo #2.

---

### Question 5
Which statement about Semantic Kernel plugins is correct?

A) Plugins always require a skprompt.txt file.  
B) Plugins can be native C# classes imported via `kernel.ImportPluginFromType<T>()`.  
C) Plugin functions use the `[SkillFunction]` attribute.  
D) Semantic Kernel plugins are identical to MAF tools.  
E) Plugins cannot accept user input parameters.

**Correct Answer: B**

**Explanation:** SK supports both prompt-based (directories with skprompt.txt) and native (C# classes with `[KernelFunction]`). MAF tools are different API. From: course pattern.

---

### Question 6
What happens when you call `agent.RunAsync(input, session)` in MAF?

A) The agent returns a deterministic answer without reasoning.  
B) The LLM generates a response and decides which (if any) tools to invoke; results are added to session state.  
C) The agent runs in a separate thread and never blocks.  
D) It immediately returns without waiting for the model.  
E) All registered tools are executed sequentially.

**Correct Answer: B**

**Explanation:** MAF agents are agentic—they reason about tools, invoke them as needed, and maintain session state. Not all tools execute. From: AI-Models_MAF_SCRIPT.docx Demos #2, #3.

---

### Question 7
You want to build a chatbot using a local SLM without cloud dependencies. Which setup is most appropriate?

A) Use GitHub Models with a PAT  
B) Use Azure OpenAI with a subscription  
C) Use Ollama with `OllamaApiClient("http://localhost:11434/", "phi3")`  
D) Use Semantic Kernel with a remote server  
E) Use MAF with Google's APIs

**Correct Answer: C**

**Explanation:** Only Ollama is local and fully offline. Others require cloud. From: SLM.docx.

---

### Question 8
In a prompt-based MAF tool (using skprompt.txt), how do you substitute a variable named `$city`?

A) `{city}`  
B) `$city`  
C) `{{$city}}`  
D) `[city]`  
E) `<city>`

**Correct Answer: C**

**Explanation:** SK/MAF template syntax uses double-brace cloze: `{{$variableName}}`. From: AI-Models_MAF_SCRIPT.docx Demo #3.

---

## 8. EXAM FOCUS CHECKLIST

**Prioritize memorization of:**

- [ ] Exact method names: `AsAIAgent()`, `RunAsync()`, `RunStreamingAsync()`, `CreateSessionAsync()`, `AIFunctionFactory.Create()`
- [ ] Package names: `Microsoft.Agents.AI.OpenAI`, `OllamaSharp`, `Microsoft.SemanticKernel`
- [ ] Endpoint URLs: GitHub (`https://models.github.ai/inference`), Ollama (`http://localhost:11434/`)
- [ ] Class names: `AIAgent`, `ChatClient`, `ChatMessage`, `OllamaApiClient`, `AITool`, `AgentSession`
- [ ] Attribute names: `[KernelFunction]`, `[Description]`
- [ ] Credential type: `AzureKeyCredential` for GitHub and Azure
- [ ] Template syntax: `{{$variable}}`
- [ ] Ollama commands: `ollama pull`, `ollama list`, `ollama run`
- [ ] Transport modes: stdio, SSE (MCP)
- [ ] Trap differences: SK vs. MAF, local vs. cloud SLM, ChatHistory vs. AgentSession

**Exam likely will NOT ask:**
- Deep theoretical understanding of attention mechanisms, transformers
- Advanced planner algorithms
- Detailed MCP server implementation (too new/out of scope)
- Complex multi-agent coordination
- Fine-tuning LLMs

---

## 9. QUICK REFERENCE TABLE

| Concept | Key Class/Method | Example |
|---------|------------------|---------|
| Create MAF Agent | `.AsAIAgent()` | `chatClient.AsAIAgent(name: "Bot", instructions: "...", tools: [tool1])` |
| Register Native Tool | `AIFunctionFactory.Create()` | `AIFunctionFactory.Create(MyClass.MyMethod, name: "N", description: "D")` |
| Multi-turn State | `AgentSession` | `var session = await agent.CreateSessionAsync();` |
| Ollama Client | `OllamaApiClient` | `new OllamaApiClient(new Uri("http://localhost:11434/"), "phi3")` |
| GitHub Models Client | `ChatClient` + `OpenAIClientOptions` | See code pattern section |
| Streaming Response | `.RunStreamingAsync()` | `await foreach (var update in agent.RunStreamingAsync(...))` |
| Prompt Template | `skprompt.txt` | File in plugin directory with `{{$variable}}` syntax |
| Semantic Kernel | `Kernel` | `new KernelBuilder().Add...().Build()` |
| MCP Transport | stdio / SSE | Choose based on local vs. remote server |

---

## 10. RECOMMENDED STUDY SEQUENCE

1. **Day 1**: Master MAF basics (methods, classes, registration) — **2 hours**
   - Flashcards 1–8
   - MCQ 1, 3, 6, 8
   
2. **Day 2**: Ollama + SLM patterns — **1.5 hours**
   - Flashcards 4–5, 19
   - MCQ 2, 7
   
3. **Day 3**: Traps & differences (SK vs. MAF, endpoint URLs, auth) — **1.5 hours**
   - Trap section deep dive
   - MCQ 4, 5
   
4. **Day 4**: Tools, skills, plugins — **1 hour**
   - Flashcards 10–12
   - Review architecture diagrams
   
5. **Day 5**: Timed practice exam — **1 hour**
   - Answer all 8 MCQs under time pressure
   - Review wrong answers immediately

**Total: ~7 hours focused study for 13 marks. At 55-60% target, aim to get 7-8 marks (87.5% of this content).**

---

**Generated for COMP4870 exam prep. Last updated: April 2026. Source materials: CSharp_Meets_AI.pptx, SLM.pptx, AI-Models_MAF_SCRIPT.docx, SLM.docx**

