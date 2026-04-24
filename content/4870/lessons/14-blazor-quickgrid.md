---
n: 14
id: blazor-quickgrid
title: "Server-side Blazor + QuickGrid"
hook: "Blazor = .NET in the browser via SignalR (Server) or WebAssembly. QuickGrid: bind IQueryable, declare PaginationState, pair with <Paginator>."
tags: [blazor, server-side, quickgrid, render-mode, signalr]
module: "Blazor UI"
source: "materials/Lessons/W07/Server-side Blazor/* + Blazor Cocktail/* + BlazorStudents lab"
bloom_levels: [understand, apply]
related: [tag-helpers]
---

## What this lesson covers

Blazor is **2 marks** on the exam — small, but the midterm spent time on Blazor basics so the final will likely keep some questions. Two pieces:

1. **Blazor fundamentals** — what it is, render modes (Server vs WASM), routing, lifecycle methods, NavMenu file.
2. **QuickGrid** — Microsoft's data-grid component for Blazor. `PropertyColumn`, `TemplateColumn`, `PaginationState`, live filter.

---

## What is Blazor?

**Blazor is .NET in the browser.** Microsoft's UI framework that lets you write interactive web apps in C# instead of JavaScript.

Two render modes you must distinguish on the exam:

| | **Blazor Server** | **Blazor WebAssembly (WASM)** |
|---|---|---|
| **Where C# runs** | Server | Browser, via WebAssembly runtime |
| **Transport** | SignalR over WebSockets | Initial WASM payload + REST/HttpClient |
| **First-load size** | Tiny | Large (~2 MB+) |
| **Latency** | Round-trip per interaction | Local, no round-trip |
| **Direct DB access** | Yes (server-side) | No — must call an API |
| **CLI to scaffold** | `dotnet new blazor` | `dotnet new blazorwasm` |

> **Note — midterm gotcha**
> The midterm asked: "Which is FALSE about client-side Blazor WASM?" The wrong-statement was "Your app can directly communicate with a database." **WASM cannot** — it runs in the browser sandbox. Server-side Blazor can.

---

## Vocabulary

| Term | Meaning |
|---|---|
| **Blazor** | "**.NET in the browser**" — Microsoft's UI framework. |
| **Component** | A `.razor` file. Has markup + `@code { ... }` block. |
| **Razor** | The templating syntax — `@expression`, `@code`, `@page`, `@inject`. The `@` symbol is the Razor operator. |
| **`.razor`** | The file extension for Blazor components. (Not `.cshtml` — that's Razor Pages / MVC.) |
| **Render mode** | `InteractiveServer`, `InteractiveWebAssembly`, `InteractiveAuto`, or static. Controls how a component runs. |
| **SignalR** | Microsoft's real-time bidirectional library. Backs Blazor Server's UI updates. |
| **WebAssembly (WASM)** | A binary instruction format that browsers can run. Blazor WASM compiles .NET to WASM. |
| **`OnInitializedAsync()`** | Lifecycle method — equivalent to "page load." |
| **`@page "/route"`** | Directive that registers a routable page. |
| **`@bind`** | Two-way binding directive. |
| **`@code`** | Block holding the component's C# fields/methods. |
| **`NavMenu.razor`** | The shared navigation menu component (in `Shared/`). |
| **`HttpClient`** | The class WASM uses to call APIs. |

---

## The minimum component

```razor
@page "/counter"

<h1>Counter</h1>
<p>Current count: @currentCount</p>
<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>

@code {
    private int currentCount = 0;
    private void IncrementCount() => currentCount++;
}
```

| Piece | Meaning |
|---|---|
| `@page "/counter"` | This component is reachable at the URL `/counter` |
| `@currentCount` | Razor evaluates the expression and writes the value into HTML |
| `@onclick="..."` | Event binding to a C# method |
| `@code { ... }` | The component's code-behind block |

---

## Blazor lifecycle methods

| Override | When it runs | JavaScript equivalent |
|---|---|---|
| `OnInitialized()` / `OnInitializedAsync()` | Once, after parameters set | `DOMContentLoaded` / page load |
| `OnParametersSet()` / `OnParametersSetAsync()` | When parameters change | n/a |
| `OnAfterRender(firstRender)` / `OnAfterRenderAsync(...)` | After each DOM render | After mount/update |
| `Dispose()` / `DisposeAsync()` | When component leaves | `beforeunload` |

> **Note**
> The midterm answer for "page load equivalent" was **`OnInitializedAsync()`** — not `OnInitAsync()` (made up) or `OnLoadAsync()` (also made up).

---

## Routing essentials

| Directive | Purpose |
|---|---|
| `@page "/counter"` | Register a routable page |
| `@page "/products/{id:int}"` | Route param with type constraint |
| `<NavLink>` | Navigation anchor with active-class support |
| `NavigationManager` (DI) | Programmatic navigation: `nav.NavigateTo("/path")` |

The shared nav menu lives in **`Shared/NavMenu.razor`** by convention.

---

## Render modes (Blazor 8+)

```razor
@page "/students"
@rendermode InteractiveServer
```

| Mode | Where it runs | Use when |
|---|---|---|
| (none) | Static SSR — server renders HTML, no interactivity | Static content, SEO |
| `InteractiveServer` | Server, with SignalR | DB access, low first-load size |
| `InteractiveWebAssembly` | Browser, via WASM runtime | Offline, low latency, no DB |
| `InteractiveAuto` | Server first, then transitions to WASM after WASM downloads | Best of both — heavier setup |

> **Pitfall**
> Forgetting `@rendermode InteractiveServer` on a page that needs interactivity (button clicks, form input). The grid renders. Clicks do nothing.

---

## QuickGrid — the data grid component

A built-in Blazor component for tabular data. Bind `IQueryable<T>`, declare `PaginationState`, pair with `<Paginator>`.

### Full W07 lab — Blazor Server + IDbContextFactory

```razor
@page "/students"
@rendermode InteractiveServer
@using Microsoft.EntityFrameworkCore
@using BlazorStudents.Models
@using BlazorStudents.Data
@implements IAsyncDisposable
@inject IDbContextFactory<ApplicationDbContext> DbFactory
@inject NavigationManager NavigationManager

<input type="search" @bind="FilterValue" @bind:event="oninput" placeholder="Search..." />

<QuickGrid Class="table" Items="@FilteredStudents" Pagination="@pagination">
    <PropertyColumn Property="student => student.FirstName"   Sortable="true" />
    <PropertyColumn Property="student => student.LastName"    Sortable="true" />
    <PropertyColumn Property="student => student.School"      Sortable="true" />
    <PropertyColumn Property="student => student.Gender"      Sortable="true" />
    <PropertyColumn Property="student => student.DateOfBirth" Sortable="true" />

    <TemplateColumn Context="student">
        <a href="@($"students/edit?studentid={student.StudentId}")">Edit</a> |
        <a href="@($"students/details?studentid={student.StudentId}")">Details</a> |
        <a href="@($"students/delete?studentid={student.StudentId}")">Delete</a>
    </TemplateColumn>
</QuickGrid>

<Paginator State="@pagination" />

@code {
    private ApplicationDbContext context = default!;
    private PaginationState pagination = new PaginationState { ItemsPerPage = 15 };
    private string FilterValue = string.Empty;

    IQueryable<Student>? FilteredStudents
    {
        get
        {
            var students = context.Students.AsQueryable();
            if (!string.IsNullOrWhiteSpace(FilterValue))
            {
                var q = FilterValue.ToLower();
                students = students.Where(s =>
                    s.FirstName!.ToLower().Contains(q) ||
                    s.LastName!.ToLower().Contains(q) ||
                    s.School!.ToLower().Contains(q));
            }
            return students;
        }
    }

    protected override void OnInitialized()
        => context = DbFactory.CreateDbContext();

    public async ValueTask DisposeAsync() => await context.DisposeAsync();
}
```

### Six moving parts

| Part | Purpose |
|---|---|
| `@rendermode InteractiveServer` | QuickGrid needs interactivity for sort/page |
| `IDbContextFactory<T>` | Server-side scoped DbContext per page lifetime |
| `<QuickGrid Items="..." Pagination="...">` | Bind `IQueryable<T>` source |
| `<PropertyColumn Property="x => x.Field" Sortable="true">` | One column per displayed property |
| `<TemplateColumn Context="x">` | Free-form markup with row context |
| `<Paginator State="@pagination">` | Renders pager controls |

---

## `PropertyColumn` vs `TemplateColumn`

| | `PropertyColumn` | `TemplateColumn` |
|---|---|---|
| Binding | `Property="x => x.Field"` | Free-form markup with `Context="name"` |
| Sortability | `Sortable="true"` sorts by bound expression | Not automatic |
| Use when | Direct property display | Action links, multi-property markup, custom rendering |

---

## Pagination — `PaginationState` + `<Paginator>`

```cs
private PaginationState pagination = new PaginationState { ItemsPerPage = 15 };
```

```razor
<QuickGrid Items="..." Pagination="@pagination">...</QuickGrid>
<Paginator State="@pagination" />
```

The `<Paginator>` component renders first/prev/next/last controls and updates `pagination.CurrentPageIndex`.

---

## Live filter — `@bind:event="oninput"`

```razor
<input type="search" @bind="FilterValue" @bind:event="oninput" placeholder="Search..." />
```

| Detail | Why |
|---|---|
| `@bind="FilterValue"` | Two-way binding to the field |
| `@bind:event="oninput"` | Update on **every keystroke** (default is `onchange` — only on focus loss) |
| Filter returns `IQueryable<T>` | EF translates `.Where(...)` into SQL — runs at the database |

---

## Question patterns to expect

| Pattern | Example stem | Answer |
|---|---|---|
| **Definition** | "Best description of Blazor?" | "Blazor is .NET in the browser." |
| **Render modes** | "What's the difference between Blazor Server and WebAssembly?" | Server runs C# on the server, talks via SignalR. WASM runs C# in the browser via WebAssembly. |
| **Method recall** | "Which lifecycle method is the equivalent of page load?" | `OnInitializedAsync()` |
| **CLI** | "Which command scaffolds a Blazor WASM app named Snoopy?" | `dotnet new blazorwasm -o Snoopy` |
| **File location** | "Where does the navigation menu live by default?" | `Shared/NavMenu.razor` |
| **Class** | "Which class do WASM apps use to call APIs?" | `HttpClient` |
| **Attribute** | "Which `<InputText>` attribute does two-way binding?" | `@bind` (or `@bind-value`) |
| **Tag** | "Which Blazor tag generates a clickable nav anchor?" | `<NavLink>` |
| **Which is FALSE** | "About client-side Blazor WASM" | "directly communicates with a database" — **WASM cannot** |
| **QuickGrid** | "Which column type renders custom markup with row context?" | `<TemplateColumn Context="row">` |
| **Pagination** | "Which class holds page size + current index?" | `PaginationState` |
| **Live filter** | "What modifier makes `@bind` fire on every keystroke?" | `@bind:event="oninput"` |

---

## Retrieval checkpoints

> **Q:** What's the best one-line description of Blazor?
> **A:** **".NET in the browser."** Server-side runs C# on the server (via SignalR); WASM runs C# in the browser (via WebAssembly).

> **Q:** Which Blazor lifecycle method is the equivalent of a JavaScript page-load event?
> **A:** **`OnInitializedAsync()`** (or sync: `OnInitialized()`).

> **Q:** Which CLI command scaffolds a Blazor WebAssembly app named "Snoopy"?
> **A:** **`dotnet new blazorwasm -o Snoopy`**.

> **Q:** What's the file extension for Blazor components and where does the nav menu live by default?
> **A:** **`.razor`** files. Nav menu: **`Shared/NavMenu.razor`**.

> **Q:** Which class do client-side Blazor WASM apps use to call an API?
> **A:** **`HttpClient`** — registered in DI in `Program.cs`.

> **Q:** Which `@bind` modifier makes the input fire on every keystroke instead of focus loss?
> **A:** **`@bind:event="oninput"`**.

> **Q:** Which QuickGrid column displays a single property and supports sortability?
> **A:** **`<PropertyColumn Property="x => x.Field" Sortable="true" />`**.

> **Q:** Which QuickGrid column renders custom markup per row?
> **A:** **`<TemplateColumn Context="row"> ...markup... </TemplateColumn>`**.

> **Q:** Which class holds pagination state for QuickGrid?
> **A:** **`PaginationState`** — instantiated with `{ ItemsPerPage = N }`. Bound via `<Paginator State="@state">`.

> **Q:** Why does the midterm say "Blazor WASM **cannot directly communicate with a database**"?
> **A:** Because WASM runs in the browser sandbox — no DB driver access. It must call a server-side API instead.

---

## Common pitfalls

> **Pitfall**
> Forgetting `@rendermode InteractiveServer`. The grid renders. Clicks and inputs do nothing.

> **Pitfall**
> Using `@bind` without `@bind:event="oninput"` for a live filter — input only updates the bound field on focus loss.

> **Pitfall**
> Trying to query a database directly from a Blazor WebAssembly component. WASM is browser-side. Call an API.

> **Pitfall**
> Confusing `.razor` (Blazor) with `.cshtml` (Razor Pages / MVC). Different file extensions, different runtimes.

> **Pitfall**
> Wrong CLI: `dotnet new blazor` is **server-side** Blazor. WASM needs `dotnet new blazorwasm`.

---

## Takeaway

> **Takeaway**
> **Blazor = .NET in the browser.** Server: C# runs on the server, SignalR pushes UI. WASM: C# compiled to WebAssembly, runs in the browser. Lifecycle: **`OnInitializedAsync()`** = page load. Files: **`.razor`**. Nav: **`Shared/NavMenu.razor`**. **CLI:** `dotnet new blazorwasm -o Name` for WASM. **WASM cannot directly access a DB** — must call an API via `HttpClient`.
> **QuickGrid:** `<QuickGrid Items="IQueryable<T>" Pagination="@state">` + `<Paginator State="@state">`. `<PropertyColumn Property="x => x.Field" Sortable="true">` for direct columns; `<TemplateColumn Context="x">` for action markup. **Live filter:** `@bind` + **`@bind:event="oninput"`** + computed `IQueryable<T>`.
