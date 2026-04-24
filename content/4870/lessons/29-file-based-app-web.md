---
n: 29
id: file-based-app-web
title: "File-based web apps — `#:sdk Microsoft.NET.Sdk.Web` plus minimal API"
hook: "Swap the SDK, add one line of ASP.NET Core, run."
tags: [dotnet-10, scripting, web, minimal-api]
module: ".NET 10 Scripts & Reporting"
source: "notes/file-based-apps.docx; research-file-based.md"
bloom_levels: [understand, apply]
related: [file-based-app-basics, file-based-app-directives]
---

## A web API in one `.cs` file

The default file-based-app SDK (`Microsoft.NET.Sdk`) produces a console app. ASP.NET Core types like `WebApplication` and `WebApplicationBuilder` live in the web SDK, so you swap the SDK with `#:sdk Microsoft.NET.Sdk.Web`:

```cs
#:sdk Microsoft.NET.Sdk.Web

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello from a file-based web API");
app.MapGet("/time", () => new { now = DateTime.UtcNow });

app.Run();
```

Save as `api.cs`, then:

```bash
dotnet run api.cs
```

The CLI picks up the `#:sdk` directive, installs the web SDK behind the scenes, compiles the file, and runs the app on a dev port (typically `http://localhost:5000` / `https://localhost:5001`). Two endpoints, zero project files.

## Adding packages on top

Most real web APIs pull in a few NuGet packages. Stack them with `#:package`:

```cs
#:sdk Microsoft.NET.Sdk.Web
#:package Microsoft.AspNetCore.OpenApi@10.0.0
#:package Microsoft.EntityFrameworkCore.InMemory@10.0.0

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDb>(opts => opts.UseInMemoryDatabase("demo"));
builder.Services.AddOpenApi();

var app = builder.Build();
app.MapOpenApi();
app.MapGet("/widgets", (AppDb db) => db.Widgets.ToList());

app.Run();

class AppDb(DbContextOptions<AppDb> opts) : DbContext(opts)
{
    public DbSet<Widget> Widgets => Set<Widget>();
}
record Widget(int Id, string Name);
```

The file now includes OpenAPI docs, an in-memory EF Core DbContext, a `GET /widgets` endpoint, and a couple of nested types (`AppDb`, `Widget`). Still one file.

## When to graduate to a project

Single-file web apps stop fitting as soon as you want:

- Multiple physical files (separate controllers, services).
- A test project that references it.
- Deployment pipelines that expect a `.csproj`.
- Container images with structured layer caching.

`dotnet project convert api.cs -o ApiProject` creates a proper ASP.NET Core project, moves the `.cs` content into `Program.cs`, and preserves each `#:` directive as the right MSBuild equivalent (`<Sdk>`, `<PackageReference>`, `<PropertyGroup>`).

The file-based form earns its keep for demos, one-off utilities, and exploratory hacking. Anything destined for production should be a real project from the start.

> **Q:** You have `var builder = WebApplication.CreateBuilder(args);` at the top of `api.cs` but `dotnet run api.cs` fails with `The name 'WebApplication' does not exist in the current context`. What's missing?
> **A:** `#:sdk Microsoft.NET.Sdk.Web` — the first line. The default console SDK doesn't include ASP.NET Core types. Swapping to the web SDK pulls `WebApplication`, routing, middleware, and everything else into the implicit references.

> **Example**
> A 10-line REST API exposing an in-memory cart:
>
> ```cs
> #:sdk Microsoft.NET.Sdk.Web
>
> var cart = new List<string>();
>
> var app = WebApplication.CreateBuilder(args).Build();
> app.MapGet("/cart",            () => cart);
> app.MapPost("/cart/{item}",    (string item) => { cart.Add(item); return Results.Ok(cart); });
> app.MapDelete("/cart",         () => { cart.Clear(); return Results.NoContent(); });
>
> app.Run();
> ```
>
> Run with `dotnet run cart.cs`. Add a fourth `MapPut` if you want to replace items. Every endpoint is a lambda; routing, JSON serialization, and DI all work out of the box because `Microsoft.NET.Sdk.Web` wires them in.

> **Pitfall**
> Forgetting `#:sdk Microsoft.NET.Sdk.Web` while trying to call `WebApplication.CreateBuilder`. The error message is compiler-level ("type or namespace 'WebApplication' not found") rather than runtime, so it's easy to assume a wrong `using` — but `using` alone can't import types that aren't in the referenced SDK.

> **Takeaway**
> `#:sdk Microsoft.NET.Sdk.Web` switches a file-based app from console mode to ASP.NET Core. After that, `WebApplication.CreateBuilder(args)` plus `app.MapGet/Post/Put/Delete(...)` produces a full minimal-API web server from one file. Stack `#:package` directives for additional NuGet dependencies (OpenAPI, EF Core, etc.). Graduate to a real project with `dotnet project convert file.cs -o Folder` when the single-file model stops fitting.
