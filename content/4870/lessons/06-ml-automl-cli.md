---
n: 6
id: ml-automl-cli
title: "ML.NET AutoML CLI"
hook: "One command explores 40+ regression models, emits a ready-to-run project."
tags: [ml-net, automl, cli]
module: "AI in .NET"
source: "code-examples/TaxiFareAutoML/TaxiFareModel/Program.cs"
bloom_levels: [remember, understand]
related: [ml-pipeline]
---

## Run the CLI

```bash
# Regression task on CSV | target: column 6 (0-based) | explore for 60 seconds | file has header row
mlnet regression --dataset taxi-fare-train.csv --label-col 6 --train-time 60 --has-header true
```

Task: regression. Dataset: CSV. Label: column at index 6 (0-based). Budget: 60 seconds of exploration.

## Install once per machine

```bash
# Install AutoML CLI globally (platform-specific: mlnet-win-x64 | mlnet-osx-x64 | mlnet-linux-x64)
dotnet tool install -g mlnet-win-x64
```

Swap `mlnet-osx-x64` or `mlnet-linux-x64` on other platforms. Installed command: `mlnet` (lowercase, no dot).

## What AutoML does

Fits dozens of regression variants (FastTree, FastTreeTweedie, LightGbm, Sdca, FastForest, etc.) with different hyperparameter combos, ranks by metric.

```text
Exploration time: 60 seconds
Models tested: 42
Top 5 models (by RSquared):
  1. FastTreeRegression         0.951
  2. FastTreeTweedieRegression  0.944
  3. LightGbmRegression         0.938
  4. FastForestRegression       0.930
  5. SdcaRegression             0.812
```

## Key flags

| Flag | Purpose |
|---|---|
| `--dataset` | Training CSV path |
| `--label-col` | Target column — 0-based index (`6`) or name (`FareAmount`) |
| `--train-time` | Budget in seconds |
| `--has-header` | `true`/`false` — does CSV have header row |

## Output

CLI generates a full console project — source files, `.csproj`, `.zip` model — wired to the winning pipeline. Use with:

```cs
// Generated input class (property names may differ from CSV headers — check generated files)
var sampleData = new TaxiFareModel.ModelInput()
{
    Vendor_id = "CMT",
    Rate_code = 1F,
    Passenger_count = 1F,
    Trip_time_in_secs = 1271F,
    Trip_distance = 3.8F,
    Payment_type = "CRD",
};

// Call generated Predict() — wraps the winning pipeline + trained model
var predictionResult = TaxiFareModel.Predict(sampleData);
// Access Score property for regression output
Console.WriteLine($"Predicted Fare_amount: {predictionResult.Score}");
```

`dotnet run` the generated project — no manual pipeline code.

> **Q:** Which flag sets exploration budget? Which flag chooses target column and what two forms does it accept?
> **A:** `--train-time` in seconds; `--label-col` takes 0-based index (`6`) or column name (`FareAmount`).

> **Pitfall**
> `mlnet` (lowercase, no dot) is the CLI. `ML.NET` (uppercase, dotted) is the framework. Mixing casing loses marks.

> **Pitfall**
> `--label-col FareAmount` fails if CSV lacks headers or spelling differs. Use 0-based index when header text is uncertain.

> **Takeaway**
> `mlnet regression --dataset <csv> --label-col <index|name> --train-time <seconds>` explores 40+ regression variants and emits a console project wired to the best model found.
