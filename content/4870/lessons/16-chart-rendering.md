---
n: 16
id: chart-rendering
title: "Chart.js in Razor — CDN script, Razor data injection"
hook: "Server computes numbers. Razor writes them into JS arrays via @:. Chart.js draws on canvas."
tags: [chart, chart-js, razor]
module: ".NET 10 Scripts & Reporting"
source: "Labs/w13/FifaWorldCup/Pages/Chart.cshtml"
bloom_levels: [understand, apply]
related: [excel-export, pdf-export]
---

## Three pieces

1. `<canvas>` element with an `id`
2. Chart.js from CDN
3. `<script>` block constructing chart referencing canvas + data

## Pie chart skeleton

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

Inside `<script>`, Razor treats content as JS text. `@:` forces a whole line to be mixed Razor-plus-JS:

```cs
@foreach (var item in Model.ChartData)
{
    @:Counts.push(@item.Count);
    @:Continents.push('@item.Name');
}
```

Each iteration emits a JS line: `Counts.push(42);`. The inner `@item.Count` is a Razor expression substituted by the server.

## `new Chart(ctx, config)` — Chart.js v3+

Two args:

- `ctx` — canvas element (or 2D context)
- `config` — JS object with `type`, `data`, optional `options`

`type`: `'pie'`, `'bar'`, `'line'`, `'doughnut'`, `'radar'`, `'scatter'`

`data`:
- `labels` — array of strings
- `datasets` — array of dataset objects, each with `label`, `data` (aligned with labels), styling like `backgroundColor`

For pie, `backgroundColor` is array — one color per slice.

## Bar chart variant

```cs
<canvas id="scores" width="500" height="300"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>

<script>
    const names  = [];
    const scores = [];
    @foreach (var p in Model.Top5)
    {
        @:names.push('@p.Name');
        @:scores.push(@p.Score);
    }

    new Chart(document.getElementById('scores'), {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{ label: 'Score', data: scores }]
        }
    });
</script>
```

Same pattern. Only `type` changes.

## Client-side only

Chart.js runs in browser. No server-side PNG fallback in course toolkit. Canvas is empty until client-side JS runs. JS-disabled users see nothing.

> **Q:** Pie chart "flashes" empty for a moment before slices appear. Wrong?
> **A:** Nothing — correct sequence: server sends HTML + canvas + `<script>`, browser fetches `chart.min.js` from CDN, JS executes, Chart.js draws. The flash is HTML-paint-to-script-execution. Improve with `<script src="..." defer>` in `<head>`.

> **Pitfall**
> Writing `Counts.push("@item.Name");` without `@:` prefix. Razor tries to interpret whole line → compile error or malformed `<script>`. Use `@:` for any line mixing JS + Razor expressions.

> **Takeaway**
> `<canvas id="c">` + `<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js">` + `<script>` block. Inside the block, use `@foreach { @:jsArray.push(@razorExpr); }` to inject per-iteration data. `new Chart(ctx, { type: 'pie'|'bar'|'line', data: { labels, datasets } })`. Client-side only.
