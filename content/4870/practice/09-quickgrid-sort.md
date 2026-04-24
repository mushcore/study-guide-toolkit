---
n: 9
id: quickgrid-sort
title: "Sort a TemplateColumn in Blazor QuickGrid"
kind: code
lang: cs
tags: [blazor, quickgrid, sort, gridsort]
source: "Labs/W07 QuickGrid/ Q3 (variant — a single multi-key sortable TemplateColumn, simpler than the lab's combined sort-across-all-columns exercise)"
---

## Prompt

Replace the separate `FirstName` and `LastName` `PropertyColumn`s with one `TemplateColumn` titled "Full name" that renders `"@context.FirstName @context.LastName"`. The column must be sortable by the user — clicking the header sorts by `LastName` first, then by `FirstName` as a tie-breaker.

## Starter

```cs
<QuickGrid Items="@_students" Pagination="@_pagination">
    <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" />
    <PropertyColumn Property="@(s => s.LastName)"  Sortable="true" />
</QuickGrid>

@code {
    private IQueryable<Student> _students = Student.GetStudents();
    private PaginationState _pagination = new() { ItemsPerPage = 15 };

    // TODO: declare a GridSort<Student> that sorts by LastName then FirstName.
    // TODO: replace the two PropertyColumns with one TemplateColumn
    //       that renders full name and is sortable via the GridSort.
}
```

## Solution

```cs
<QuickGrid Items="@_students" Pagination="@_pagination">
    <TemplateColumn Title="Full name" SortBy="@_sortByFull">
        <div>@context.FirstName @context.LastName</div>
    </TemplateColumn>
</QuickGrid>

@code {
    private IQueryable<Student> _students = Student.GetStudents();
    private PaginationState _pagination = new() { ItemsPerPage = 15 };

    private GridSort<Student> _sortByFull =
        GridSort<Student>.ByAscending(s => s.LastName)
                         .ThenAscending(s => s.FirstName);
}
```

## Why

`TemplateColumn` renders arbitrary markup using the `@context` variable (the current row's data item). Because the template can reference any combination of properties, QuickGrid cannot infer a sort key — you must supply one via `SortBy`.

`GridSort<Student>` builds the expression fluently. `ByAscending(s => s.LastName)` picks the primary key; `ThenAscending(s => s.FirstName)` tie-breaks ties on `LastName`. Chain more `.ThenAscending` / `.ThenDescending` calls for additional tie-breakers.

Common wrong approaches:

- **Setting `Sortable="true"` on `TemplateColumn` instead of supplying `SortBy`.** The header shows no sort arrow because QuickGrid has no key. Remove `Sortable` and add `SortBy="@_sortByFull"` instead.
- **Building the `GridSort<Student>` inside the markup.** Each render creates a fresh sort object; QuickGrid compares by reference and treats every render as "sort changed," producing excess work. Declare the field once in `@code` and reuse.
- **Sorting on a computed property inside the template** — e.g. `x => $"{x.FirstName} {x.LastName}"`. EF Core cannot translate a formatted string into SQL, so the sort either falls back to in-memory (loading every row) or throws. Use the two underlying properties with `ThenAscending` chaining instead.
