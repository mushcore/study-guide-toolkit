# Tag Helpers + Blazor QuickGrid Research

## Tag Helpers (3 marks)
- Server-side HTML extensions in Razor, replaces @Html.* helpers
- Register: `@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers` in `_ViewImports.cshtml`
- Built-in: asp-for, asp-controller, asp-action, asp-route-*, asp-validation-for, asp-validation-summary, asp-items, asp-append-version, asp-antiforgery, environment, cache
- Custom: derive from `TagHelper`, override `Process(TagHelperContext, TagHelperOutput)` or `ProcessAsync(...)`, decorate with `[HtmlTargetElement("toon")]`, property PascalCase → kebab-case attribute
- Example: `public string FontFamily {get;set;}` → `font-family="arial"` attribute
- Output: `output.TagName = "div"`, `output.Content.SetHtmlContent("<p>Hi</p>")`, `output.Attributes.SetAttribute("style", "...")`

## Blazor QuickGrid (2 marks)
- Package: `Microsoft.AspNetCore.Components.QuickGrid` (.NET 8+)
- `@using Microsoft.AspNetCore.Components.QuickGrid` in _Imports.razor
- `<QuickGrid Items="@students" Pagination="@pagination">` with `IQueryable<T>`
- `<PropertyColumn Property="@(_ => _.Name)" Sortable="true"/>` — simple sortable
- `<TemplateColumn Title="Full"><div>@context.FirstName</div></TemplateColumn>` — custom markup, NOT sortable by default
- TemplateColumn sorting: `SortBy="@sortByName"` where `GridSort<T> sortByName = GridSort<T>.ByAscending(s => s.FirstName).ThenAscending(s => s.LastName);`
- Pagination: `private PaginationState pagination = new PaginationState { ItemsPerPage = 10 };` + `<Paginator State="@pagination" />`
- Real-time filter: `<input @bind="filterText" @bind:event="oninput" />` + computed IQueryable using `.Where(...Contains...)`
- Column search UI: `<PropertyColumn ...><ColumnOptions><input type="search".../></ColumnOptions></PropertyColumn>`

## Exam Traps
- Kebab-case conversion: `ForegroundColor` → `foreground-color` (not underscore)
- `_ViewImports.cshtml` not individual .cshtml for registration
- `ProcessAsync` for async I/O, `Process` for sync
- `output.TagName` changes tag; `output.Content` changes inner HTML
- TemplateColumn needs `SortBy`, not `Sortable="true"`
- Must declare PaginationState in @code before binding
- IQueryable preserves server-side filtering; ToList() loads to memory
- `@bind:event="oninput"` for live filter (not onchange)
