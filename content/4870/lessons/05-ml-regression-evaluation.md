---
n: 5
id: ml-regression-evaluation
title: "ML.NET regression evaluation — FastTree, RMSE, R²"
hook: "Your taxi-fare model reports RSquared 0.89 and RootMeanSquaredError 3.3. Is that good? What do the numbers mean, and in what units?"
tags: [ml-net, regression, metrics]
module: "AI in .NET"
source: "slides/ML.NET.pptx p.20–27; research-mlnet.md §Algorithms & Trainers, §Regression Trainers, §Evaluation Metrics, §Regression Metrics, §TrainTestSplit, §CrossValidate; cards #9–10; MCQ #4"
bloom_levels: [understand, apply, evaluate]
related: [ml-pipeline-workflow, ml-data-transforms]
---

## Reading a trained model's report card

You trained a taxi-fare regressor on `taxi-fare-train.csv`. The evaluator prints:

```text
RSquared:              0.89
RootMeanSquaredError:  3.30
MeanAbsoluteError:     2.10
```

You need three facts to read that report. First, the trainer used to produce it. Second, the split that gave you a fair test set. Third, what each metric actually measures — because the exam sets up distractors that sound right and are wrong.

## Step 1: Pick a regression trainer

Trainers hang off `mlContext.Regression.Trainers`. The three you must recognise:

```cs
mlContext.Regression.Trainers.FastTree()           // default
mlContext.Regression.Trainers.Sdca()               // linear, small data
mlContext.Regression.Trainers.LightGbm()           // needs Microsoft.ML.LightGbm
```

`FastTree` is a gradient-boosted-trees ensemble shipped in `Microsoft.ML.FastTree`. It is the default choice for general regression and the trainer AutoML picked for taxi-fare (all top-5 models were `FastTree` or `FastForest` variants). `SdcaRegression` is stochastic dual coordinate ascent — a fast linear trainer suited to small datasets with linear relationships. `LightGbmRegression` is Microsoft's LightGBM gradient-boosting trainer; it needs the extra `Microsoft.ML.LightGbm` package before the line compiles.

## Step 2: Hold out a test set

Training accuracy lies. You need unseen rows. `TrainTestSplit` partitions an `IDataView` into two subsets:

```cs
var split = mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);
ITransformer model = pipeline.Fit(split.TrainSet);
IDataView predictions = model.Transform(split.TestSet);
```

That is 80% for training, 20% for evaluation. The model never sees `TestSet` rows during `Fit`, so metrics on `TestSet` measure generalisation rather than memorisation.

For a tighter estimate, use k-fold cross-validation:

```cs
var cvResults = mlContext.Regression.CrossValidate(
    pipeline, data, numberOfFolds: 5);
```

`CrossValidate` trains five models. Each is trained on four folds and tested on the remaining fold. It reports metrics averaged across all five runs — a better performance estimate than any single split.

> **Q:** Why split at all? Why not evaluate on the training data directly?
> **A:** A tree ensemble can memorise training rows and score near-perfect `RSquared` on them while failing on new trips. The test set is the only honest estimate of how the model behaves in production.

## Step 3: Call `Evaluate` in the right namespace

```cs
var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");
Console.WriteLine($"RSquared: {metrics.RSquared:0.##}");
Console.WriteLine($"RMSE:     {metrics.RootMeanSquaredError:0.##}");
Console.WriteLine($"MAE:      {metrics.MeanAbsoluteError:0.##}");
```

Three details decide whether the call works:

1. **The namespace must match the task.** `mlContext.Regression.Evaluate` returns a `RegressionMetrics` object with `RSquared`, `RootMeanSquaredError`, `MeanAbsoluteError`. `mlContext.MulticlassClassification.Evaluate` returns accuracy-style metrics for a classifier — wrong shape for regression.
2. **The label argument names the target column.** You renamed it to `"Label"` with `CopyColumns` in the pipeline, so pass `"Label"`.
3. **The score argument names the prediction column.** `FastTree` writes its output to a column called `"Score"`. Your prediction class must expose it as `[ColumnName("Score")] public float FareAmount;`. Pass any other string and `Evaluate` cannot find the predictions.

## Step 4: Read the three regression metrics

| Metric | Property | Range | What it tells you |
|---|---|---|---|
| R² | `metrics.RSquared` | 0 to 1 | Fraction of variance the model explains. Closer to 1 is better. Unitless. |
| RMSE | `metrics.RootMeanSquaredError` | ≥ 0 | Average prediction error in the label's original units. Lower is better. |
| MAE | `metrics.MeanAbsoluteError` | ≥ 0 | Average absolute error. Same units as RMSE, more robust to outliers. |

R² is computed as `1 - (SS_residual / SS_total)`. An R² of 0.89 means the model explains 89% of the variation in fare amounts — the remaining 11% is noise or unmodelled effects. RMSE squares each error before averaging, so it punishes large misses more than MAE does; MAE simply averages absolute errors and shrugs off a few extreme outliers.

> **Example**
> interpret `RSquared = 0.89, RMSE = 3.30` on taxi fare
>
> The label column is `FareAmount` in US dollars, so:
>
> - **`RSquared = 0.89`** — the model explains 89% of fare variance. For real-world taxi data this is a strong fit.
> - **`RMSE = 3.30`** — on average, a predicted fare misses the actual fare by about **$3.30**. RMSE inherits the label's units; dollars in, dollars out.
>
> The wrong reading is "the model is 89% accurate with 3.3% error." R² is not accuracy, and RMSE is not a percentage. It is a dollar amount attached to a regression task.

> **Pitfall**
> The four interchangeable-looking mistakes the exam exploits:
> 1. Calling `mlContext.MulticlassClassification.Evaluate` on a regression model — the wrong namespace yields the wrong metric class; `RSquared` is not even a member.
> 2. Passing the wrong score-column name, e.g. `Evaluate(predictions, "Label", "Prediction")` — `FastTree` emits `"Score"`, so mismatched names break evaluation.
> 3. Treating `RSquared = 0.89` as "89% accurate." `Accuracy` is a classification metric and does not exist on `RegressionMetrics`. R² is unitless variance-explained.
> 4. Claiming RMSE is a percentage. RMSE is in the label's original units — dollars for fare, seconds for trip time, square metres for area.

> **Takeaway**
> Train with `mlContext.Regression.Trainers.FastTree()`, hold out 20% via `TrainTestSplit` or average across folds with `CrossValidate`, then call `mlContext.Regression.Evaluate(predictions, "Label", "Score")` and read `RSquared` (variance explained, 0–1), `RootMeanSquaredError` (label units, lower is better), and `MeanAbsoluteError`. Match the namespace to the task, type `"Label"` and `"Score"` exactly, and never call R² "accuracy."
