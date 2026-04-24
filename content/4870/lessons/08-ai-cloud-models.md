---
n: 8
id: ai-cloud-models
title: "GitHub Models + Azure OpenAI endpoints"
hook: "Same SDK, two clouds — and the credential class has a misleading name."
tags: [ai, cloud, auth]
module: "AI in .NET"
source: "notes/AI-Models_MAF_SCRIPT.docx; slides/CSharp_Meets_AI.pptx"
bloom_levels: [remember, apply]
related: [ai-chat-completion-local, ai-agent-framework]
---

## GitHub Models and Azure OpenAI endpoints

You point a `ChatClient` at either GitHub Models or Azure OpenAI. Both clouds use the same `AzureKeyCredential` class for authentication. The endpoint URL and model-name format change — everything else stays identical.

### GitHub Models wiring

GitHub Models hosts inference at `https://models.github.ai/inference`. You authenticate with a GitHub Personal Access Token, passed through `AzureKeyCredential(token)`. The model id requires a vendor prefix like `openai/gpt-4o-mini`.

> **Example**
> construct a `ChatClient` for GitHub Models:
>
> ```csharp
> string? apiKey = config["GitHub:Token"];
> string? endpoint = config["GitHub:ApiEndpoint"];
> string? model = config["GitHub:Model"];
>
> IChatClient chatClient = new ChatClient(
>     model,
>     new AzureKeyCredential(apiKey!),
>     new OpenAIClientOptions
>     {
>         Endpoint = new Uri(endpoint)
>     }
> ).AsIChatClient();
> ```

The `.AsIChatClient()` extension adapts the OpenAI `ChatClient` to `Microsoft.Extensions.AI`'s `IChatClient`. That lets the agent framework consume it.

### appsettings.json contract

Store the token, endpoint, and model together so config binding stays clean.

> **Example**
> appsettings.json for GitHub Models:
>
> ```json
> {
>   "GitHub": {
>     "Token": "PUT-GITHUB-PERSONAL-ACCESS-TOKEN-HERE",
>     "ApiEndpoint": "https://models.github.ai/inference",
>     "Model": "openai/gpt-4o-mini"
>   }
> }
> ```

### Azure OpenAI wiring

Azure OpenAI swaps the endpoint for your resource URL and keys the call on a deployment name. You still pass `AzureKeyCredential`. The Semantic Kernel variant registers it through `AddAzureOpenAIChatCompletion` with three fields: deployment name, endpoint URL, and API key.

> **Q:** Why does `AzureKeyCredential` authenticate GitHub Models despite the "Azure" prefix?
> **A:** The class wraps any bearer token. The OpenAI SDK reuses it for GitHub PATs — no `GithubCredential` type exists.

### Distractor map

The exam leans on fake credential classes and malformed endpoints.

> **Pitfall**
> wrong credential types:
>
> - `GithubCredential` — does not exist.
> - `BearerTokenCredential` — not in this SDK context.
> - `OAuthCredential` — wrong auth flow entirely.
>
> Always `AzureKeyCredential(token)` for both GitHub Models and Azure OpenAI.

> **Pitfall**
> endpoint URL shape:
>
> - GitHub Models must be HTTPS and include `/inference`: `https://models.github.ai/inference`.
> - Drop the `/inference` path and the client fails.
> - Do not confuse with Ollama, which is HTTP on port `11434` and needs no path.

> **Pitfall**
> model-name prefix:
>
> GitHub Models requires a vendor prefix like `openai/gpt-4o-mini`. Passing bare `gpt-4o-mini` gets rejected by the router.

> **Takeaway**
> `ChatClient(model, new AzureKeyCredential(token), new OpenAIClientOptions { Endpoint = new Uri("https://models.github.ai/inference") })` — HTTPS, `/inference`, `openai/` prefix, `AzureKeyCredential`.
