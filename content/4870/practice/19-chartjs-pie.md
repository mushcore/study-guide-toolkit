---
n: 19
id: chartjs-pie
title: "Render a Chart.js pie chart from Razor data"
kind: code
lang: cs
tags: [chart, chart-js, razor, pie]
source: "Labs/W13 Excel, PDF, Chart cocktail/ Q4 (variant — render a single pie chart of games-per-continent, simpler than the lab which stacked pie + bar charts on one page with explicit CSS)"
---

## Prompt

On a Razor Page whose `Model.ChartData` is an `IEnumerable<(string Name, int Count)>`, render a Chart.js pie chart. Each slice corresponds to one tuple — the label comes from `Name`, the value from `Count`. Load Chart.js from the course CDN URL.

## Starter

```cs
@page
@model IndexModel

<h4>Games by Continent</h4>

@* TODO: add a <canvas> with id="pie-chart". *@

@* TODO: load Chart.js from the CDN:
         https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js *@

@* TODO: in a <script> block, build JS arrays `labels` and `counts`
         by looping over Model.ChartData with @: directives, then
         call `new Chart(ctx, { type: 'pie', data: { labels, datasets: [{ data: counts }] } })`. *@
```

## Solution

```cs
@page
@model IndexModel

<h4>Games by Continent</h4>

<canvas id="pie-chart" width="400" height="400"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const labels = [];
    const counts = [];

    @foreach (var item in Model.ChartData)
    {
        @:labels.push('@item.Name');
        @:counts.push(@item.Count);
    }

    const ctx = document.getElementById('pie-chart');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Games',
                data: counts,
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

## Why

Three moving pieces get the chart on screen. The `<canvas>` element receives the drawing; `document.getElementById('pie-chart')` fetches the reference Chart.js needs. The Chart.js `<script src>` must load before the chart-construction `<script>` — keeping both inside `<body>` in order is simplest.

The `@foreach (...)` block builds the JavaScript data arrays by interpolating each tuple's `Name` and `Count`. `@:labels.push(...)` is Razor's "mixed line" directive — it tells Razor to treat the line as literal output with `@`-expression substitutions. Without `@:`, Razor tries to parse the whole line as C# and errors out (or, worse, produces malformed JS).

`new Chart(ctx, config)` is the library entry point. `type: 'pie'` selects the shape; `data.labels` aligns 1:1 with `data.datasets[0].data` — index `i` of one array corresponds to index `i` of the other.

Common wrong approaches:

- **Omitting the `@:` directive inside the `<script>` block.** Razor tries to parse `labels.push(...)` as C# and fails, or emits broken JS. `@:` is the signal to Razor that this line mixes JS with `@`-expressions.
- **Placing the Chart.js `<script src>` AFTER the construction `<script>`.** JavaScript executes top-to-bottom. If the construction block runs before Chart.js has loaded, `Chart is not defined` appears in the console and the canvas stays blank.
- **Using fewer colors in `backgroundColor` than data points.** Chart.js recycles colors in order, so slices beyond the 5th color repeat the first. For a small fixed dataset this is fine; for variable-length data, compute colors programmatically or use Chart.js plugins for palettes.
