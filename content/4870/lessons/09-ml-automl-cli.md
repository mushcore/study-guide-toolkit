---
n: 9
id: ml-automl-cli
title: "ML.NET AutoML CLI"
hook: "One terminal command explores 40+ regression models and emits a ready-to-run console project."
tags: [ml-net, automl]
module: "AI in .NET"
source: "notes/ML.NET_vscode_automl_SCRIPT.docx; research-mlnet.md §automl"
bloom_levels: [remember, understand]
related: [ml-pipeline-workflow]
---

## Run the CLI

Open a terminal in the folder holding your CSV and run:

```bash
mlnet regression --dataset taxi-fare-train.csv --label-col 6 --train-time 60 --has-header true
```

This tells `mlnet` to treat the task as regression, read `taxi-fare-train.csv`, predict the column at index 6 (0-based), and spend 60 seconds exploring algorithm and hyperparameter combinations.

Install the tool once per machine with:

```bash
dotnet tool install -g mlnet-win-x64
```

Swap in `mlnet-osx-x64` or `mlnet-linux-x64` for the other platforms. The installed command is lowercase `mlnet`, with no dot.

## What AutoML actually does

AutoML does not pick one algorithm. In the 60-second window it fits dozens of regression variants (FastTree, FastTreeTweedie, LightGbm, Sdca, FastForest, and more) across multiple hyperparameter settings, then ranks the results by metric.

> **Example**
> ```text
> Exploration time: 60 seconds
> Models tested: 42
> Top 5 models (by RSquared):
>   1. FastTreeRegression         0.951
>   2. FastTreeTweedieRegression  0.944
>   3. LightGbmRegression         0.938
>   4. FastForestRegression       0.930
>   5. SdcaRegression             0.812
> ```
>
> The CLI keeps the winner at position 1 and writes a console project that trains and loads it.

## Key flags

- `--dataset` — path to the training CSV.
- `--label-col` — the column to predict. Accepts a 0-based INDEX (`6`) or a column NAME (`FareAmount`).
- `--train-time` — exploration budget in seconds.
- `--has-header` — `true` if the CSV has a header row; otherwise `false`.

> **Q:** Which flag sets the exploration budget, and what unit does it use? Which flag chooses the target column, and what two forms does it accept?
> **A:** `--train-time` in seconds; `--label-col` takes a 0-based index (e.g. `6`) or a column name (e.g. `FareAmount`).

## What you get back

The CLI generates a full console project — source files, `.csproj`, and a `.zip` model — wired to the winning pipeline. You `dotnet run` it; you do not receive a bare model file.

> **Pitfall**
> `mlnet` (lowercase, no dot) is the CLI tool. `ML.NET` (uppercase, dotted) is the framework the tool targets. Mixing casing on the exam loses the mark. The CLI is also not a script generator — expect a console project, never a Python file or a standalone `.zip`.

> **Pitfall**
> `--label-col FareAmount` silently fails when your CSV header spells the column `fare_amount` or lacks a header row entirely. Pass the 0-based index (`6`) whenever the exact header text is uncertain.

> **Pitfall**
> The top-5 list ranks only the models AutoML happened to try. A larger `--train-time` generally surfaces a better winner, but gains diminish — doubling from 60 to 120 seconds rarely doubles RSquared.

> **Takeaway**
> `mlnet regression --dataset <csv> --label-col <index|name> --train-time <seconds>` explores 40+ regression variants in the given budget and emits a console project wired to the best model it found.
