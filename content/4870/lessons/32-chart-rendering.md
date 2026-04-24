---
n: 32
id: chart-rendering
title: "Chart.js in Razor — CDN script, Razor data injection, pie chart config"
hook: "Server computes the data; Razor writes it into JS arrays; Chart.js renders on the canvas."
tags: [chart, chart-js, razor]
module: ".NET 10 Scripts & Reporting"
source: "Labs/W13 Excel, PDF, Chart cocktail/; research-excel-pdf-chart.md §3"
bloom_levels: [understand, apply]
related: [excel-export, pdf-export]
---

## Chart.js renders client-side

Unlike Excel and PDF exports, chart rendering happens in the browser. The server computes the numbers, Razor writes them into a `<script>` block, and Chart.js draws on a `<canvas>`.

Three pieces:

1. A `<canvas>` element with an `id`.
2. The Chart.js library (loaded from a CDN).
3. A `<script>` block that constructs the chart, referencing the canvas and the data.

## Skeleton page

```cs
@page
@model IndexModel

<h4>Games by Continent</h4>

<div class="chart-container">
    <canvas id="pie-chart" width="400" height="400"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const Counts     = [];
    const Continents = [];

    @foreach (var item in Model.ChartData)
    {
        @:Counts.push(@item.Count);
        @:Continents.push('@item.Name');
    }

    const ctx = document.getElementById('pie-chart');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Continents,
            datasets: [{
                label: 'Games',
                data: Counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        }
    });
</script>
```

## The `@:` Razor directive

Inside a `<script>` block, Razor treats everything as JavaScript text. `@` alone is ambiguous because the browser's JS also uses `@` (or might, in edge cases). The `@:` directive forces Razor to treat a whole line as mixed Razor-plus-HTML (or in this case, Razor-plus-JS):

```cs
@foreach (var item in Model.ChartData)
{
    @:Counts.push(@item.Count);
    @:Continents.push('@item.Name');
}
```

Each `@:Counts.push(@item.Count);` produces a literal JS line like `Counts.push(42);` per iteration. The inner `@item.Count` evaluates a Razor expression; the `@:` at the start says "render this line of JS with Razor substitutions."

## The `new Chart(ctx, config)` constructor

Chart.js v3+ takes two arguments:

- `ctx` — the canvas element (or its 2D context, but the element is accepted as a shorthand).
- `config` — a JS object with `type`, `data`, and optional `options`.

`type` selects the chart shape. `'pie'` for the course example; Chart.js also supports `'bar'`, `'line'`, `'doughnut'`, `'radar'`, `'scatter'`, and a few others.

`data` has `labels` (array of strings) and `datasets` (array of dataset objects). Each dataset has its own `label` (shown in tooltips), `data` (the numeric values aligned with `labels`), and styling like `backgroundColor`. For pie charts, `backgroundColor` is an array so each slice gets its own color.

## No server-side rendering option

Chart.js runs only in the browser — there is no "server-rendered PNG" fallback in the course toolkit. If you need a server-generated chart (e.g. embedded in a PDF), you use a different library like `Microsoft.Office.Interop.Graph` or `SkiaSharp`, both out of scope for 4870.

The corollary: the `<canvas>` is empty until client-side JS runs. Users who load the page with JavaScript disabled see nothing where the chart should be. Add a `<noscript>` fallback with the raw numbers if that matters.

> **Q:** You render a pie chart that shows up fine on first load but "flashes" empty for a second before the slices appear. What's the sequence and is anything wrong?
> **A:** The sequence is correct: the server sends HTML with the canvas + `<script>` block, the browser fetches `chart.min.js` from the CDN, JS executes, Chart.js draws. The flash is the time between HTML paint and script execution. Nothing is broken — to improve perceived latency, move the `<script src="...chart.min.js">` into `<head>` with `defer` so it downloads in parallel with the page.

> **Example**
> A minimal bar chart of top 5 score leaders:
>
> ```cs
> <canvas id="scores" width="500" height="300"></canvas>
> <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
>
> <script>
>     const names  = [];
>     const scores = [];
>     @foreach (var p in Model.Top5)
>     {
>         @:names.push('@p.Name');
>         @:scores.push(@p.Score);
>     }
>
>     new Chart(document.getElementById('scores'), {
>         type: 'bar',
>         data: {
>             labels: names,
>             datasets: [{ label: 'Score', data: scores }]
>         }
>     });
> </script>
> ```
>
> Same pattern as the pie: `type: 'bar'` changes the rendering, `labels` pair with `data` element-wise.

> **Pitfall**
> Writing `Count.push("@item.Name");` inside a plain JavaScript block without `@:`. Razor tries to interpret the whole line and throws a compile error, or (worse) produces a malformed `<script>` that breaks the whole page's JS. Use `@:` for lines that mix JS and Razor expressions.

> **Takeaway**
> Chart.js renders client-side from a `<canvas>`. Load the library from `https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js`. Use Razor's `@:` directive to inject per-iteration `data.push(...)` calls. Construct with `new Chart(ctx, { type: 'pie' | 'bar' | 'line', data: { labels, datasets } })`. No server-rendered fallback — if the user's browser has JS disabled, the chart doesn't appear.
