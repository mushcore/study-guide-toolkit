---
id: 4870-topic-blazor-quickgrid
title: Blazor QuickGrid
pillar: tech
priority: low
chapter: W07
tags:
  - blazor
---

### Setup

```cs
// _Imports.razor
@using Microsoft.AspNetCore.Components.QuickGrid
```

### Full grid with sort + pagination + filter

```cs
@page "/students"

<input @bind="filter" @bind:event="oninput" placeholder="Search..." />

<QuickGrid Items="@filtered" Pagination="@pagination">
    <PropertyColumn Property="@(_ => _.Id)" Sortable="true" />
    <TemplateColumn Title="Name" SortBy="@sortByName">
        <strong>@context.FirstName @context.LastName</strong>
    </TemplateColumn>
    <PropertyColumn Property="@(_ => _.School)" Sortable="true" />
</QuickGrid>

<Paginator State="@pagination" />

@code {
    string filter = "";
    PaginationState pagination = new() { ItemsPerPage = 10 };
    GridSort<Student> sortByName = GridSort<Student>
        .ByAscending(s => s.FirstName).ThenAscending(s => s.LastName);

    IQueryable<Student> allStudents = Student.GetStudents();
    IQueryable<Student> filtered => string.IsNullOrEmpty(filter)
        ? allStudents
        : allStudents.Where(s => s.FirstName.Contains(filter, StringComparison.OrdinalIgnoreCase));
}
```

### Server vs WASM

-   **Server**: use `ItemsProvider` callback for server-paged data
-   **WASM**: `IQueryable<T>` is in-memory only (no LINQ-to-SQL on client)

### Exam traps

-   `PropertyColumn` sortable with `Sortable="true"`. `TemplateColumn` needs `SortBy`, not Sortable.
-   Must declare `PaginationState` explicitly — not auto-created
-   Package: `Microsoft.AspNetCore.Components.QuickGrid` — .NET 8+
