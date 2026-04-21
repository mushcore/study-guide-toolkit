# W02 Lab - Using Semantic Kernel with AI Models Hosted on GitHub

## How This Solution Completes the Lab

The lab requires developing a **Razor Pages web app** that behaves similarly to the console application demonstrated in the YouTube tutorial ([https://youtu.be/jMQ_1eDKPlo](https://youtu.be/jMQ_1eDKPlo)) and accompanying blog post by Medhat Elmasry.

### What the Console App Does

The tutorial builds a C# console app that:
1. Configures an OpenAI client pointing at **GitHub's AI model inference endpoint**
2. Registers a **Semantic Kernel** chat completion service
3. Maintains a `ChatHistory` with a system prompt
4. Loops: reads user input, streams the AI response, and appends both to history

### What This Razor Pages App Does (the same thing, as a web app)

| Console App Concept | Razor Pages Equivalent |
|---|---|
| `appsettings.json` with AI:Endpoint, AI:Model, AI:PAT | Same `appsettings.json` configuration section |
| `new OpenAIClient(...)` with GitHub endpoint | Same client creation in `Program.cs` |
| `builder.AddOpenAIChatCompletion(modelId, client)` | `builder.Services.AddOpenAIChatCompletion(modelId, client)` registered as a DI service |
| `kernel.GetRequiredService<IChatCompletionService>()` | Injected via constructor in `IndexModel` |
| `ChatHistory` with system prompt | Rebuilt each request from session-stored entries |
| `while (true)` loop with `Console.ReadLine()` | HTML form POST with text input |
| `GetStreamingChatMessageContentsAsync` | Same streaming call in `OnPostAsync()` |
| `Console.Write(message)` output | Rendered in a Bootstrap card on the page |

### Key Implementation Details

- **Program.cs**: Reads AI config from `appsettings.json`, creates an `OpenAIClient` pointed at `https://models.github.ai/inference`, and registers `IChatCompletionService` + `Kernel` via Semantic Kernel's DI extensions.
- **Index.cshtml.cs**: Injects `IChatCompletionService`, reconstructs `ChatHistory` from session on each POST, calls the streaming API, and stores the conversation back to session.
- **Index.cshtml**: Simple chat UI with a scrollable message area and an input form.
- **Session**: Used to persist multi-turn chat history across HTTP requests, matching the console app's `ChatHistory` behavior.

## How to Run / Test

### Prerequisites

1. **.NET 10 SDK** (or whichever version matches your `dotnet --version`)
2. A **GitHub Personal Access Token (PAT)** with access to GitHub Models
   - Go to [https://github.com/marketplace/models](https://github.com/marketplace/models)
   - Pick any model (e.g., GPT-4o mini, Phi-4)
   - Click **"Get API key"** or generate a token from GitHub Settings > Developer settings > Personal access tokens

### Configuration

1. Open `appsettings.json`
2. Replace `YOUR_GITHUB_PAT_HERE` with your actual GitHub PAT:

```json
"AI": {
    "Endpoint": "https://models.github.ai/inference",
    "Model": "openai/gpt-4o-mini",
    "PAT": "ghp_your_actual_token_here"
}
```

3. (Optional) Change the `Model` value to use a different model, e.g.:
   - `"openai/gpt-4o-mini"` (default)
   - `"microsoft/Phi-4"`
   - Any model available on [GitHub Models marketplace](https://github.com/marketplace/models)

### Running

```bash
cd "Labs/W02 AI on Github/GitHubAiModelSK"
dotnet run
```

Then open the URL shown in the terminal (e.g., `https://localhost:5001` or `http://localhost:5000`).

### Testing

1. Type a question in the text box (e.g., "What is the capital of France?")
2. Click **Send**
3. The AI response appears below your question
4. Continue the conversation - chat history is maintained across messages
5. Refresh the page to start a new conversation

### NuGet Packages Used

- `Microsoft.SemanticKernel` - Core Semantic Kernel library (same as tutorial)
- `Microsoft.Extensions.Configuration.Json` - JSON config support (same as tutorial)
