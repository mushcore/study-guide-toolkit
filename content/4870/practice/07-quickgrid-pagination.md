---
n: 7
id: quickgrid-pagination
title: "Paginate a Blazor QuickGrid to 15 rows per page"
kind: code
lang: cs
tags: [blazor, quickgrid, pagination]
source: "Labs/W07 QuickGrid/ Q1 (variant — pure pagination wiring, no filter or sort, simpler than the lab's combined Q1+Q2+Q3)"
---

## Prompt

You have a Blazor Server page with an `IQueryable<Student>` and a `<QuickGrid>` already bound to it. The grid currently shows every row. Add pagination so the grid displays 15 rows per page, with a `<Paginator>` control under the grid that lets the user move through pages.

## Starter

```cs
@page "/students"
@rendermode InteractiveServer
@using Microsoft.AspNetCore.Components.QuickGrid

<h1>Students</h1>

<QuickGrid Items="@_students">
    <PropertyColumn Property="@(s => s.Id)" />
    <PropertyColumn Property="@(s => s.FirstName)" />
    <PropertyColumn Property="@(s => s.LastName)" />
</QuickGrid>

@* TODO: add a <Paginator> component under the grid. *@

@code {
    private IQueryable<Student> _students = Student.GetStudents();

    // TODO: declare a PaginationState set to 15 items per page
    //       and wire it into the QuickGrid via its Pagination attribute.
}
```

## Solution

```cs
@page "/students"
@rendermode InteractiveServer
@using Microsoft.AspNetCore.Components.QuickGrid

<h1>Students</h1>

<QuickGrid Items="@_students" Pagination="@_pagination">
    <PropertyColumn Property="@(s => s.Id)" />
    <PropertyColumn Property="@(s => s.FirstName)" />
    <PropertyColumn Property="@(s => s.LastName)" />
</QuickGrid>

<Paginator State="@_pagination" />

@code {
    private IQueryable<Student> _students = Student.GetStudents();
    private PaginationState _pagination = new() { ItemsPerPage = 15 };
}
```

## Why

`PaginationState` is a stateful object that tracks `CurrentPageIndex` and `ItemsPerPage`. Binding the QuickGrid's `Pagination` attribute to it tells the grid which slice of `Items` to render. The `<Paginator>` component reads and writes the same state object; clicks on first/prev/next/last mutate `CurrentPageIndex`, which QuickGrid watches and re-renders on.

Both components must bind to the **same** `PaginationState` instance — they coordinate through shared state, not events.

Common wrong approaches:

- **Declaring `PaginationState` as a local variable inside a method.** Each render creates a fresh instance, so page navigation never advances. The state must be a `@code`-block field so it survives component re-renders.
- **Calling `.ToList()` on `_students` before binding.** QuickGrid paginates in .NET over the materialized list, losing EF Core's ability to issue `OFFSET / FETCH` at the database. For large tables this loads every row into memory on every page change.
- **Omitting `@rendermode InteractiveServer`.** The initial render produces a grid and a paginator, but clicks on the paginator do nothing because there's no client-side runtime. A static-server-rendered page can display data but cannot respond to interaction.
