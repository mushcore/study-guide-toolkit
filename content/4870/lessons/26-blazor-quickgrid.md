---
n: 26
id: blazor-quickgrid
title: "Blazor QuickGrid — PropertyColumn, TemplateColumn, PaginationState, sorting, filtering"
hook: "Bind an IQueryable, pick a column type per purpose, and wire pagination with PaginationState."
tags: [blazor, ui, quickgrid]
module: "Internationalization & Modern UI"
source: "notes/BlazorServer_QuickGrid.docx; notes/BlazorWasm_QuickGrid.docx; Labs/W07 QuickGrid/; research-taghelpers-blazor.md"
bloom_levels: [understand, apply]
related: [localization-setup]
---

## One grid, three column types

`QuickGrid` is Microsoft's data-grid component shipped in `Microsoft.AspNetCore.Components.QuickGrid` (.NET 8+). A minimal grid binding to an `IQueryable<Student>`:

```cs
@page "/students"
@using Microsoft.AspNetCore.Components.QuickGrid
@rendermode InteractiveServer

<QuickGrid Items="@_students" Pagination="@_pagination">
    <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" />
    <PropertyColumn Property="@(s => s.LastName)"  Sortable="true" />
    <TemplateColumn Title="Full name" SortBy="@_sortByFull">
        <div>@context.FirstName @context.LastName</div>
    </TemplateColumn>
</QuickGrid>

<Paginator State="@_pagination" />

@code {
    private IQueryable<Student> _students = Student.GetStudents();
    private PaginationState _pagination = new() { ItemsPerPage = 10 };
    private GridSort<Student> _sortByFull =
        GridSort<Student>.ByAscending(s => s.FirstName)
                         .ThenAscending(s => s.LastName);
}
```

Three ingredients:

1. **`<QuickGrid Items="@_students">`** — the data source. Must be `IQueryable<T>` for server-side filtering / paging. An `IEnumerable<T>` works but pulls everything into memory first.
2. **Columns** — `<PropertyColumn Property="@(x => x.Field)">` for straight property binding, or `<TemplateColumn>` for custom render logic.
3. **Pagination** — bind `<QuickGrid Pagination="@_pagination">` plus a `<Paginator State="@_pagination">` component. Declare `PaginationState` in `@code`.

## `PropertyColumn` vs `TemplateColumn`

| | `PropertyColumn` | `TemplateColumn` |
|---|---|---|
| Binding | `Property="@(x => x.Field)"` | Free-form render fragment using `@context` |
| Sortability | `Sortable="true"` sorts by the bound expression automatically | Requires `SortBy="@someGridSort"` — `Sortable` alone does nothing |
| Use when | One property, no custom markup | Custom layout, multi-property display, computed value |

`TemplateColumn`'s sort quirk trips people up. Without `SortBy`, the column header renders as plain text — no click, no arrow, no sort. The `GridSort<T>` object is built fluently:

```cs
private GridSort<Student> _sortByName =
    GridSort<Student>.ByAscending(s => s.FirstName)
                     .ThenAscending(s => s.LastName);
```

Multiple `.ThenAscending` / `.ThenDescending` calls chain to produce multi-key sort.

## Pagination

`PaginationState` tracks the current page and page size:

```cs
private PaginationState _pagination = new() { ItemsPerPage = 10 };
```

`<Paginator State="@_pagination" />` renders the first/prev/next/last controls and updates `CurrentPageIndex` when clicked. `QuickGrid` watches the state object and re-renders the right page's data.

## Live filter with `IQueryable`

A text input that filters in real time is a few lines:

```cs
<input @bind="_filter" @bind:event="oninput" placeholder="Search..." />

<QuickGrid Items="@FilteredStudents" Pagination="@_pagination">
    <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" />
</QuickGrid>

@code {
    private string _filter = string.Empty;

    private IQueryable<Student> FilteredStudents =>
        string.IsNullOrEmpty(_filter)
            ? _students
            : _students.Where(s =>
                s.FirstName.Contains(_filter, StringComparison.OrdinalIgnoreCase));
}
```

Two mechanics matter:

1. **`@bind:event="oninput"`** — updates `_filter` on each keystroke. The default `@bind` listens for `onchange`, which fires only on focus loss — not what you want for live filtering.
2. **Keep the return type `IQueryable<T>`.** Calling `.ToList()` pulls the whole set into memory and defeats EF Core's ability to translate the filter into a SQL `WHERE` clause.

## Render mode

QuickGrid is interactive — sorting, paging, filtering all trigger re-renders. The page hosting it must declare an interactive render mode:

```cs
@rendermode InteractiveServer
```

Or `InteractiveWebAssembly` / `InteractiveAuto`. A static-server-rendered page shows the initial grid but clicks on sort headers and pager buttons do nothing because the component has no runtime behind it.

> **Q:** Your `<TemplateColumn Title="City" Sortable="true">` renders correctly but the column header doesn't sort when clicked. Why, and what's the fix?
> **A:** `TemplateColumn` ignores `Sortable="true"`. It needs an explicit `SortBy="@GridSort<T>.ByAscending(x => x.City)"`. `PropertyColumn` supports `Sortable="true"` because it already knows which property to sort by; `TemplateColumn` has no implicit sort key.

> **Example**
> Pagination-plus-filter combined on a student list:
>
> ```cs
> <input @bind="_filter" @bind:event="oninput" placeholder="Filter..." />
>
> <QuickGrid Items="@Filtered" Pagination="@_pagination">
>     <PropertyColumn Property="@(s => s.Id)"        Sortable="true" />
>     <PropertyColumn Property="@(s => s.FirstName)" Sortable="true" />
>     <PropertyColumn Property="@(s => s.LastName)"  Sortable="true" />
> </QuickGrid>
>
> <Paginator State="@_pagination" />
>
> @code {
>     private IQueryable<Student> _students = Student.GetStudents();
>     private PaginationState _pagination = new() { ItemsPerPage = 15 };
>     private string _filter = "";
>
>     private IQueryable<Student> Filtered =>
>         string.IsNullOrEmpty(_filter)
>             ? _students
>             : _students.Where(s => s.LastName.Contains(_filter));
> }
> ```
>
> Typing in the input filters every keystroke; the paginator always reflects the filtered count.

> **Pitfall**
> Using `@bind="_filter"` without `@bind:event="oninput"` on the filter input. The filter only updates when the input loses focus, so users type, see no change, and conclude the filter is broken. Always pair live-filter inputs with `@bind:event="oninput"`.

> **Takeaway**
> Bind a `<QuickGrid Items="IQueryable<T>">` and declare a `PaginationState` in `@code`. Use `<PropertyColumn Property="..." Sortable="true">` for simple columns and `<TemplateColumn Title="..." SortBy="@gridSort">` for custom markup — `TemplateColumn` needs `SortBy`, not `Sortable`. A text input with `@bind="_filter" @bind:event="oninput"` plus a computed `IQueryable` property gives live filter. The hosting page must declare `@rendermode InteractiveServer` (or another interactive mode) for any of this to work.
