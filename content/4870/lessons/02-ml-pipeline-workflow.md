---
n: 2
id: ml-pipeline-workflow
title: "ML.NET pipeline — Load, Transform, Train, Evaluate, Predict"
hook: "You have a CSV of taxi trips and you need to predict the fare. ML.NET turns that into seven lines of pipeline chaining."
tags: [ml-net, pipeline]
module: "AI in .NET"
source: "slides/ML.NET.pptx; notes/ML.NET_VSCODE_SCRIPT.docx; notes/ML.NET_VS2022_SCRIPT.docx; research-mlnet.md"
bloom_levels: [understand, apply, analyze]
related: [ml-data-transforms, ml-regression-evaluation, ml-prediction-consumption]
---

## The taxi-fare problem

You have `taxi-fare-train.csv`. Each row lists a vendor, rate code, passenger count, trip time, trip distance, payment type, and the fare charged. You want a model that predicts the fare from the other six columns. `ML.NET` turns that job into a single chained pipeline.

Every `ML.NET` program follows the same seven steps:

```text
MLContext → LoadFromTextFile → CopyColumns("Label") → OneHotEncoding
          → Concatenate("Features") → Trainer → Fit → Evaluate → Predict
```

Each step has exactly one purpose. Miss one and training breaks.

## Step 1: `MLContext` — the root object

```cs
using Microsoft.ML;

MLContext mlContext = new MLContext(seed: 0);
```

`MLContext` is the single entry point. From it you reach `mlContext.Data` (loaders), `mlContext.Transforms` (feature engineering), `mlContext.Regression` or `mlContext.MulticlassClassification` (trainers + evaluators), and `mlContext.Model` (save, load, prediction engines). The `seed: 0` argument pins the random-number generator so training is deterministic across runs — identical inputs produce identical models.

## Step 2: Load data into an `IDataView`

```cs
IDataView trainingData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    trainDataPath,
    hasHeader: true,
    separatorChar: ',');
```

`LoadFromTextFile<T>` parses the CSV into an `IDataView` — an immutable, streaming, lazy view over tabular data. Nothing is read into memory until a downstream operation pulls rows. The generic type `TaxiTrip` tells `ML.NET` how CSV columns map to fields:

```cs
public class TaxiTrip
{
    [LoadColumn(0)] public string VendorId;
    [LoadColumn(4)] public float TripDistance;
    [LoadColumn(6)] public float FareAmount;
}
```

`[LoadColumn(0)]` is zero-based and matches the CSV column index, not the header name.

## Step 3–5: Build the pipeline

```cs
var pipeline = mlContext.Transforms
    .CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
    .Append(mlContext.Transforms.Categorical.OneHotEncoding(
        outputColumnName: "VendorIdEncoded", inputColumnName: "VendorId"))
    .Append(mlContext.Transforms.Concatenate("Features",
        "VendorIdEncoded", "TripDistance"))
    .Append(mlContext.Regression.Trainers.FastTree());
```

Three rules govern the chain:

1. **`CopyColumns` comes first** and renames the target column (`"FareAmount"`) to the literal name `"Label"`. Trainers search for a column named `"Label"`; rename it or training fails with a "column not found" error.
2. **`OneHotEncoding` expands categorical text** (`"VTS"`, `"CMT"`) into binary indicator vectors. Trainers only accept numeric input, so every string column must be encoded before it reaches `Concatenate`.
3. **`Concatenate` must output the literal name `"Features"`.** It packs the encoded columns into a single vector column. Any other name (`"Input"`, `"X"`) and the trainer cannot find its input.

`FastTree` is the default regression trainer — a gradient-boosted decision-tree ensemble shipped in `Microsoft.ML.FastTree`.

## Step 6: `Fit()` returns an `ITransformer`

```cs
ITransformer model = pipeline.Fit(trainingData);
```

`Fit()` runs every transform, trains the algorithm on the resulting numeric vectors, and returns an `ITransformer` — the trained, stateless, serializable model. It does **not** return an `IDataView`. Confusing the two is the single most common exam distractor.

## Step 7: Evaluate and predict

```cs
IDataView predictions = model.Transform(testData);
var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");
Console.WriteLine($"RSquared: {metrics.RSquared:0.##}");

var engine = mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);
var result = engine.Predict(new TaxiTrip { VendorId = "VTS", TripDistance = 10.33f });
```

`model.Transform` applies the whole pipeline to a batch `IDataView`. `Evaluate` reads the `"Label"` and `"Score"` columns and returns `RegressionMetrics`. `CreatePredictionEngine` wraps the model for one-row-at-a-time inference.

> **Q:** What does `pipeline.Fit(trainingData)` return?
> **A:** An `ITransformer` — the trained model. It is not an `IDataView`, not metrics, not a `PredictionEngine`. Pick `ITransformer` whenever the exam offers those four choices.

> **Example**
> trace a three-column pipeline
>
> You have columns `VendorId` (string), `TripDistance` (float), and `FareAmount` (float). Walk the data through:
>
> 1. **Load**: `LoadFromTextFile<TaxiTrip>` produces an `IDataView` with three columns.
> 2. **`CopyColumns("Label", "FareAmount")`**: adds a fourth column `"Label"` holding fare values. Trainers now have a target.
> 3. **`OneHotEncoding("VendorIdEncoded", "VendorId")`**: adds a vector column where `"VTS"` becomes `[1,0]` and `"CMT"` becomes `[0,1]`.
> 4. **`Concatenate("Features", "VendorIdEncoded", "TripDistance")`**: adds a single vector column combining the encoded vendor and the distance.
> 5. **`FastTree()`**: reads `"Features"` as input and `"Label"` as target, trains the tree ensemble.
> 6. **`Fit()`**: returns the `ITransformer`. `Evaluate` then reads `"Label"` and `"Score"` from the transformed output.

> **Pitfall**
> Writing `IDataView model = pipeline.Fit(trainingData);` compiles-fails. `Fit` produces an `ITransformer`. The same trap hides behind `Concatenate("Input", …)` — the trainer silently cannot locate `"Features"` and throws at runtime. Always type the two magic strings `"Label"` and `"Features"` verbatim.

> **Takeaway**
> One `MLContext`, one `IDataView`, one pipeline with `CopyColumns` → encoders → `Concatenate("Features")` → trainer, then `Fit` returns an `ITransformer` you evaluate or wrap in a `PredictionEngine`. Memorise those seven steps and the return type of `Fit`.
