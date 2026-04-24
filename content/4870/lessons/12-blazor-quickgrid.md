---
n: 12
id: blazor-quickgrid
title: "Blazor QuickGrid — PropertyColumn, TemplateColumn, PaginationState"
hook: "Bind IQueryable. Declare PaginationState. Pair with <Paginator State=>."
tags: [blazor, ui, quickgrid]
module: "Internationalization & Modern UI"
source: "Labs/W07 QuickGrid/BlazorStudents/Components/Pages/StudentPages/Index.razor; code-examples/BlazorQuickGrid/BlazorQuickGrid/BlazorSchool/Pages/Index.razor"
bloom_levels: [understand, apply]
related: []
---

## W07 lab — Blazor Server + IDbContextFactory

```cs
@page "/students"
@rendermode InteractiveServer
@using Microsoft.EntityFrameworkCore
@using BlazorStudents.Models
@using BlazorStudents.Data
@implements IAsyncDisposable
@inject IDbContextFactory<BlazorStudents.Data.ApplicationDbContext> DbFactory
@inject NavigationManager NavigationManager

<input type="search" @bind="FilterValue" @bind:event="oninput" placeholder="Search..." />

<QuickGrid Class="table" Items="@FilteredStudents" Pagination="@pagination">
    <PropertyColumn Property="student => student.FirstName" Sortable="true" />
    <PropertyColumn Property="student => student.LastName"  Sortable="true" />
    <PropertyColumn Property="student => student.School"    Sortable="true" />
    <PropertyColumn Property="student => student.Gender"    Sortable="true" />
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

Six moving parts:

1. `@rendermode InteractiveServer` — QuickGrid needs interactivity.
2. `IDbContextFactory<T>` — server lab creates scoped context per page lifetime.
3. `<QuickGrid Items="..." Pagination="...">` — binds `IQueryable<T>` source.
4. `<PropertyColumn Property="x => x.Field" Sortable="true">` — one per displayed property.
5. `<TemplateColumn Context="student">` — free-form markup with row access via `student`.
6. `<Paginator State="@pagination">` — renders pager controls.

## PropertyColumn vs TemplateColumn

| | `PropertyColumn` | `TemplateColumn` |
|---|---|---|
| Binding | `Property="x => x.Field"` | Free-form markup with `Context="name"` row access |
| Sortability | `Sortable="true"` sorts by bound expression | Not automatic |
| Use when | Straight property display | Custom markup, action links, multi-property |

## Pagination — `PaginationState`

```cs
private PaginationState pagination = new PaginationState { ItemsPerPage = 15 };
```

`<Paginator State="@pagination">` renders first/prev/next/last controls + updates `CurrentPageIndex`. Server lab uses `State="@pagination"`.

WASM variant (BlazorQuickGrid/BlazorSchool): `<Paginator Value="@pages">` — same state object, attribute name differs per template.

## Live filter — `@bind:event="oninput"`

```cs
<input type="search" @bind="FilterValue" @bind:event="oninput" placeholder="Search..." />
```

Two mechanics:

- `@bind:event="oninput"` — updates on each keystroke. Default `@bind` listens for `onchange` (only on focus loss).
- Return `IQueryable<T>` from filter so EF translates `.Where` into SQL.

## Per-column filter (WASM variant)

`BlazorSchool/Pages/Index.razor` uses `<ColumnOptions>` + `ResizableColumns="true"`:

```cs
<QuickGrid Items="@filteredStudents" ResizableColumns="true" Pagination="@pages">
    <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" title="First Name">
        <ColumnOptions>
            <div class="search-box">
                <input type="search" @bind="firstNameFilter" @bind:event="oninput" />
            </div>
        </ColumnOptions>
    </PropertyColumn>
</QuickGrid>
```

Filter appears as dropdown on column header.

> **Q:** `<input @bind="FilterValue">` updates `FilterValue` but grid doesn't refresh while typing. What's missing?
> **A:** `@bind:event="oninput"`. Without it, `@bind` defaults to `onchange` — only fires on focus loss.

> **Pitfall**
> `<Paginator State="..." />` in Server vs `<Paginator Value="..." />` in WASM. Both valid — attribute name varies per template.

> **Pitfall**
> Forgetting `@rendermode InteractiveServer`. Grid renders but clicks do nothing.

> **Takeaway**
> `<QuickGrid Items="IQueryable<T>" Pagination="@state">` + `<Paginator State="@state">` (server) or `Value="@state"` (WASM template) + `PaginationState { ItemsPerPage = N }`. `PropertyColumn Property="x => x.Field" Sortable="true"` for direct; `TemplateColumn Context="x"` for action links. Live filter: `@bind + @bind:event="oninput"` + computed `IQueryable<T>`.
