---
"n": 11
id: 4870-lesson-blazor-quickgrid-tabular-data-in-three-components
title: "Blazor QuickGrid: tabular data in three components"
hook: Drop a <QuickGrid Items=""/>, add PropertyColumn per field, wire a Paginator. Done.
tags:
  - blazor
module: Blazor
---

QuickGrid (2 marks) is the Blazor table component shipped with ASP.NET Core. The whole API fits on a sticky note: one grid, two column types, one paginator.

#### Component tree at a glance

```mermaid
flowchart TD
  G["&lt;QuickGrid Items=people<br/>Pagination=pagination&gt;"]
  P1["&lt;PropertyColumn<br/>Property=p =&gt; p.Name<br/>Sortable=true /&gt;"]
  P2["&lt;PropertyColumn<br/>Property=p =&gt; p.Age<br/>Sortable=true /&gt;"]
  T["&lt;TemplateColumn Title='Actions'<br/>SortBy=nameSort&gt;<br/>arbitrary HTML / @context"]
  PG["&lt;Paginator State=pagination /&gt;<br/>shares same PaginationState"]
  G --> P1
  G --> P2
  G --> T
  G -.-|same state| PG
  classDef grid fill:#2a3a4a,stroke:#7aa2f7,color:#e5e5e5
  classDef prop fill:#2d3a2d,stroke:#9ece6a,color:#9ece6a
  classDef tmpl fill:#3a3528,stroke:#e3af68,color:#e3af68
  class G grid
  class P1,P2 prop
  class T tmpl
  class PG grid
```

PropertyColumn auto-sorts (it has a lambda → expression). TemplateColumn ships custom HTML, so framework can't infer the sort key — you hand it one via `SortBy`.

#### Minimum working grid

```cs
@@page "/people"
@@using Microsoft.AspNetCore.Components.QuickGrid

<QuickGrid Items="@people" Pagination="@pagination">
    <PropertyColumn Property="@(p => p.Name)"   Sortable="true" />
    <PropertyColumn Property="@(p => p.Age)"    Sortable="true" />
    <TemplateColumn Title="Actions" SortBy="@nameSort">
        <a href="/edit/@context.Id">Edit</a>
    </TemplateColumn>
</QuickGrid>
<Paginator State="@pagination" />

@@code {
    private IQueryable<Person> people = ...;
    private PaginationState pagination = new() { ItemsPerPage = 10 };
    private GridSort<Person> nameSort = GridSort<Person>.ByAscending(p => p.Name);
}
```

*Why PropertyColumn auto-sorts but TemplateColumn does not:* PropertyColumn receives a lambda pointing to a single property — QuickGrid can build a sort expression from it. TemplateColumn receives arbitrary child HTML — the framework has no idea what data the template is showing, so you must hand it an explicit `GridSort<T>` via `SortBy`.

> **Q:** **Checkpoint —** You render a TemplateColumn that shows `@context.FirstName + " " + @context.LastName` and you want it sortable by LastName. What do you add?
> **A:** `SortBy="@lastSort"` plus a backing field `GridSort<Person> lastSort = GridSort<Person>.ByAscending(p => p.LastName);`. Setting `Sortable="true"` alone is ignored on TemplateColumn.

> **Note**
> **Takeaway —** Package `Microsoft.AspNetCore.Components.QuickGrid`. PropertyColumn for direct properties, TemplateColumn + SortBy for custom HTML. `PaginationState { ItemsPerPage = N }` + `<Paginator State="@x"/>`. (Source: BlazorServer\_QuickGrid.docx, BlazorWasm\_QuickGrid.docx)
