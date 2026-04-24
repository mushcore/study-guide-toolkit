---
n: 3
id: ai-semantic-kernel
title: "Semantic Kernel SDK"
hook: "Wire a C# method to GPT-4o with one attribute and one line — that is Semantic Kernel."
tags: [ai, orchestration, plugins]
module: "AI in .NET"
source: "courses/COMP4870/generated/exam-study/research-ai.md §Semantic Kernel, §Register Semantic Kernel in Program.cs, §Add Plugin to Kernel, §skprompt.txt Template; slides/CSharp_Meets_AI.pptx p.17–24; notes/AI-Models_MAF_SCRIPT.docx"
bloom_levels: [understand, apply]
related: [ai-agent-framework, ai-chat-completion-local]
---

## From a C# method to an LLM tool in six lines

You have a `GetWeatherDescription(string city)` method. You want GPT-4o to call it when a user asks about weather. Semantic Kernel is Microsoft's orchestration SDK that makes this wiring a six-line job: build a `Kernel`, attach an LLM service, import your class as a plugin, invoke.

```cs
var kernelBuilder = new KernelBuilder();
kernelBuilder.AddOpenAIChatCompletion("gpt-4o", apiKey);
var kernel = kernelBuilder.Build();
kernel.ImportPluginFromType<WeatherPlugin>();
var result = await kernel.InvokeAsync("WeatherPlugin", "DescribeWeather",
    new() { ["city"] = "Vancouver" });
```

The `Kernel` is the runtime orchestrator. The `KernelBuilder` configures it fluently — register an `IChatCompletionService` implementation (OpenAI, Azure OpenAI, or Ollama), then call `Build()`. Every invocation flows through that kernel: plugin lookup, prompt rendering, LLM call, response.

## Plugins: native C# vs prompt-based

A **plugin** is a collection of callable functions loaded into a `Kernel`. Semantic Kernel supports two flavours, and both register through the kernel's import methods.

**Native plugin** — a C# class whose methods are decorated with `[KernelFunction]` and `[Description]`. The `[Description]` attribute is what the LLM reads when deciding which function fits the user's intent; skip it and tool selection gets guesswork.

```cs
[KernelFunction("DescribeWeather")]
[Description("Get weather description for a city")]
public static string GetWeatherDescription(
    [Description("City name")] string city)
{
    return $"Weather in {city}: sunny";
}

kernel.ImportPluginFromType<WeatherPlugin>();
```

**Prompt-based plugin** — a directory containing a `skprompt.txt` file. The template uses `{{$variableName}}` placeholders substituted at invoke time.

```text
## Instructions
Identify and reply with the name of a city from a given user input.
When you cannot identify a city name in the given input, reply with "Unknown".

## User Input Format:
{{$input}}
```

```cs
string pluginDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
var plugin = kernel.ImportPluginFromPromptDirectory(
    Path.Combine(pluginDirectory, "CakeRecipe"));
```

Native functions give you compile-time safety and debugger breakpoints. Prompt directories let non-developers edit LLM behaviour without touching C#.

> **Q:** A user types "weather in Tokyo" and your kernel has a native `GetWeatherDescription` function plus a prompt-based `CityExtractor` plugin. Which attribute tells the LLM to pick the weather function first?
>
> **A:** `[Description("Get weather description for a city")]`. The LLM reads description metadata on each registered function (and its parameters) to match user intent. Without `[Description]`, the method name alone steers tool selection — much weaker signal.

## The invocation flow

When you call `kernel.InvokeAsync(...)`, a fixed pipeline runs: kernel looks up the function, renders any prompt template by substituting `{{$var}}` placeholders, forwards the rendered prompt to the configured `IChatCompletionService`, and returns the result. For multi-turn conversations the service maintains a `ChatHistory` — an ordered list of `ChatMessage` objects (User, Assistant, System roles) that carries context across calls.

> **Example**
> Registering the kernel in an ASP.NET Core `Program.cs`:
>
> 1. Create the builder: `var kernelBuilder = new KernelBuilder();`
> 2. Add an LLM service. For cloud: `kernelBuilder.AddOpenAIChatCompletion("gpt-4o", apiKey);`. For local Ollama: `kernelBuilder.AddOpenAIChatCompletion("phi3", new Uri("http://localhost:11434"));`.
> 3. Call `Build()` to get the `Kernel` instance.
> 4. Register it as a singleton: `builder.Services.AddSingleton(kernel);`.
> 5. Inject `Kernel` into your controllers or services. Each request imports plugins and calls `InvokeAsync`.
>
> The singleton matters — a `Kernel` holds HTTP clients and plugin registrations; creating one per request wastes connections.

> **Pitfall**
> Exam distractors love fake method names. `kernel.Execute()` does not exist — the method is `kernel.InvokeAsync()`. `SkillFactory.Create()` does not exist — use `ImportPluginFromPromptDirectory()` or `ImportPluginFromType<T>()`. The attribute is `[KernelFunction]`, not `[SkillFunction]`. And do not cross wires with Microsoft Agent Framework: `agent.RunAsync()` belongs to MAF, not Semantic Kernel.

## Plugin, skill, tool — precise words

Vocabulary trips students. In Semantic Kernel, a **plugin** is the collection; a **skill** is the legacy term for a prompt-directory (`skprompt.txt` plus optional code); a **native function** is a C# method marked `[KernelFunction]`. Microsoft Agent Framework uses a different word — `AITool` — for the same idea, registered via `AIFunctionFactory.Create()`. If an exam question mixes `[KernelFunction]` with `agent.RunAsync()`, it is wrong by construction.

Package names follow the same discipline. `Microsoft.SemanticKernel` is the core NuGet. Add-ons live under `Microsoft.SemanticKernel.Plugins.*`. Nothing ships under `Microsoft.SK` or `SemanticKernel.Core`.

> **Takeaway**
> Semantic Kernel orchestrates LLM calls through a `Kernel` built by `KernelBuilder`, loaded with plugins — either native C# classes using `[KernelFunction]` + `[Description]`, or prompt directories with `skprompt.txt` and `{{$var}}` templates — and invoked through `kernel.InvokeAsync()` backed by an `IChatCompletionService`.
