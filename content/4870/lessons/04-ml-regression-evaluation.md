---
n: 4
id: ml-regression-evaluation
title: "ML.NET evaluation — FastTree, RMSE, R²"
hook: "Separate test file, Regression.Evaluate, read RSquared + RootMeanSquaredError."
tags: [ml-net, regression, metrics]
module: "AI in .NET"
source: "code-examples/TaxiFarePrediction/Program.cs"
bloom_levels: [understand, apply, evaluate]
related: [ml-pipeline, ml-prediction-consumption]
---

## Train on one file, evaluate on another

TaxiFarePrediction splits by using two separate CSVs — not by calling a split function:

```cs
string trainDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "taxi-fare-train.csv");
string testDataPath  = Path.Combine(Environment.CurrentDirectory, "Data", "taxi-fare-test.csv");

IDataView trainingData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    trainDataPath, hasHeader: true, separatorChar: ',');

ITransformer model = pipeline.Fit(trainingData);
```

Test rows never seen during `Fit` → metrics measure generalisation.

## `Regression.Evaluate` — three requirements

```cs
IDataView testData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    testDataPath, hasHeader: true, separatorChar: ',');
var predictions = model.Transform(testData);

var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");
Console.WriteLine($"RSquared Score:          {metrics.RSquared:0.##}");
Console.WriteLine($"Root Mean Squared Error: {metrics.RootMeanSquaredError:#.##}");
```

1. **Namespace matches task** — `mlContext.Regression.Evaluate` → `RegressionMetrics`. `mlContext.MulticlassClassification.Evaluate` is wrong shape for regression.
2. **Label column name** — renamed to `"Label"` via `CopyColumns`, so pass `"Label"`.
3. **Score column name** — `FastTree` writes to `"Score"`.

## Output class — `[ColumnName("Score")]`

```cs
public class TaxiTripFarePrediction
{
    [ColumnName("Score")] public float FareAmount;
}
```

Regression trainers write prediction to `"Score"`. Mark `[ColumnName("Prediction")]` and the field stays zero — binding fails silently.

## Two metrics to read

| Metric | Property | Range | Meaning |
|---|---|---|---|
| R² | `metrics.RSquared` | 0 to 1 | Fraction of variance explained. Closer to 1 = better. Unitless. |
| RMSE | `metrics.RootMeanSquaredError` | ≥ 0 | Avg prediction error in label units (dollars for fare). Lower = better. |

R² = `1 - (SS_residual / SS_total)`. `0.89` = 89% variance explained. RMSE squares errors before averaging, so large misses count more. Units match the label.

## Interpreting output

`RSquared = 0.89, RMSE = 3.30` on taxi-fare (dollars):

- Model explains 89% of fare variance. Strong fit.
- Predictions miss actual fare by about $3.30 on average.

**Wrong reading:** "89% accurate with 3.3% error." R² is not accuracy. RMSE is not percentage.

> **Q:** Output class has `[ColumnName("Prediction")] public float FareAmount;`. `Evaluate` returns `RSquared = 0`. Why?
> **A:** `FastTree` writes to `"Score"`, not `"Prediction"`. Evaluate cannot find the prediction column. Use `[ColumnName("Score")]`.

> **Pitfall**
> Calling `mlContext.MulticlassClassification.Evaluate(...)` on a regression model — wrong namespace, wrong metrics class. `RSquared` not a member.

> **Pitfall**
> "`RSquared = 0.89` means 89% accurate." Accuracy is classification. R² is unitless variance-explained.

> **Takeaway**
> Train with `FastTree()`, load separate test CSV, `model.Transform(testData)` → `Regression.Evaluate(predictions, "Label", "Score")` → read `RSquared` + `RootMeanSquaredError`. Output class needs `[ColumnName("Score")]`.
