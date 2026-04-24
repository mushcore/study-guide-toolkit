---
n: 8
id: quickgrid-filter
title: "Live filter a Blazor QuickGrid by last name"
kind: code
lang: cs
tags: [blazor, quickgrid, filter]
source: "Labs/W07 QuickGrid/ Q2 (variant — filter by last name only, simpler than the lab's multi-keyword matcher that searches multiple fields)"
---

## Prompt

Extend the students grid so that a text input above the grid live-filters the displayed rows by `LastName`. The filter is case-insensitive and updates on every keystroke. When the input is empty, the grid shows every student.

## Starter

```cs
@page "/students"
@rendermode InteractiveServer
@using Microsoft.AspNetCore.Components.QuickGrid

<h1>Students</h1>

@* TODO: add a text input bound to a filter field. *@

<QuickGrid Items="@_students" Pagination="@_pagination">
    <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" />
    <PropertyColumn Property="@(s => s.LastName)"  Sortable="true" />
</QuickGrid>

<Paginator State="@_pagination" />

@code {
    private IQueryable<Student> _students = Student.GetStudents();
    private PaginationState _pagination = new() { ItemsPerPage = 15 };

    // TODO: add a filter field and a computed IQueryable<Student>
    //       that filters by LastName.Contains(filter, case-insensitive).
    //       Bind Items="@Filtered" instead of "@_students".
}
```

## Solution

```cs
@page "/students"
@rendermode InteractiveServer
@using Microsoft.AspNetCore.Components.QuickGrid

<h1>Students</h1>

<input @bind="_filter" @bind:event="oninput" placeholder="Filter last name..." />

<QuickGrid Items="@Filtered" Pagination="@_pagination">
    <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" />
    <PropertyColumn Property="@(s => s.LastName)"  Sortable="true" />
</QuickGrid>

<Paginator State="@_pagination" />

@code {
    private IQueryable<Student> _students = Student.GetStudents();
    private PaginationState _pagination = new() { ItemsPerPage = 15 };
    private string _filter = string.Empty;

    private IQueryable<Student> Filtered =>
        string.IsNullOrEmpty(_filter)
            ? _students
            : _students.Where(s =>
                s.LastName.Contains(_filter, StringComparison.OrdinalIgnoreCase));
}
```

## Why

`@bind="_filter"` round-trips the input value into the `_filter` field. `@bind:event="oninput"` changes the update trigger from the default `onchange` (fires on focus loss) to `oninput` (fires on every keystroke) — without that change, users see no filtering until they tab out of the input.

The `Filtered` property is a computed `IQueryable<Student>`. Each re-render re-evaluates it and the grid sees a new source; QuickGrid handles the diff internally.

Common wrong approaches:

- **Using `@bind` without `@bind:event="oninput"`.** The filter only kicks in when the input loses focus — functional but non-obvious for users who expect instant feedback.
- **Materializing to `List<T>` with `.ToList()` inside `Filtered`.** That destroys IQueryable and forces EF Core to pull the entire student table into memory on every keystroke. Keep the expression as IQueryable so the database does the work.
- **Calling `StateHasChanged()` manually after setting `_filter`.** `@bind` already triggers a re-render; manual calls are redundant and sometimes mask ordering bugs where the filter value updates after the grid has already started rendering.
