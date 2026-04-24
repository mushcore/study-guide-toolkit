---
n: 18
id: quickgrid-with-pagination
title: "Blazor QuickGrid — sortable columns + paginator"
kind: code
lang: csharp
tags: [blazor, quickgrid, pagination, code-question]
source: "Lesson 14 (likely-pattern coding question for Blazor bucket — 2 marks on final)"
---

## Prompt

Write the **Razor markup + `@code` block** for a Blazor page at route `/students` that displays students in a QuickGrid. The page should:

1. Use **`@rendermode InteractiveServer`**.
2. Bind a `QuickGrid` to **`IQueryable<Student> Students`** (assume already populated in `OnInitialized`).
3. Show **three sortable PropertyColumns**: `FirstName`, `LastName`, `School`.
4. Show a `<Paginator>` paired with a `PaginationState` of **10 items per page**.

Write the full `.razor` file body (skip the `using` statements).

## Starter

```razor
@page "/students"
@rendermode InteractiveServer

<!-- TODO 1: <QuickGrid Items=... Pagination=...> with three PropertyColumns -->
<!-- TODO 2: <Paginator State=...> -->

@code {
    // TODO: PaginationState + Students field + OnInitialized
}
```

## Solution

```razor
@page "/students"
@rendermode InteractiveServer

<QuickGrid Class="table" Items="@Students" Pagination="@pagination">
    <PropertyColumn Property="s => s.FirstName" Sortable="true" />
    <PropertyColumn Property="s => s.LastName"  Sortable="true" />
    <PropertyColumn Property="s => s.School"    Sortable="true" />
</QuickGrid>

<Paginator State="@pagination" />

@code {
    private PaginationState pagination = new PaginationState { ItemsPerPage = 10 };
    private IQueryable<Student>? Students;

    protected override void OnInitialized()
    {
        // populate Students from DbContext (omitted for brevity)
    }
}
```

## Why

`QuickGrid` binds to **`IQueryable<T>`** so EF can translate sort/filter into SQL — passing a `List<T>` works but loads everything into memory first. **`Pagination="@state"`** wires the grid to the same `PaginationState` instance that **`<Paginator State="@state">`** controls.

`@rendermode InteractiveServer` is **required** — without it the page renders statically and clicks (sort headers, page buttons) do nothing.

A common wrong approach is **`<Paginator Value="@pagination" />`** (the WASM template uses `Value`, not `State`). Both forms exist; the W07 Server lab uses **`State="@pagination"`**.

Another wrong approach is using **`<TemplateColumn>`** for plain property display. `TemplateColumn` is for free-form markup (action links, multi-property cells). Single-property columns belong in `<PropertyColumn>` so **`Sortable="true"`** works automatically.
