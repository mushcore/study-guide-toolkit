---
n: 3
id: ml-pipeline
title: "ML.NET pipeline — Load, Transform, Fit"
hook: "MLContext → LoadFromTextFile → CopyColumns → OneHotEncoding → Concatenate → FastTree → Fit."
tags: [ml-net, pipeline, feature-eng]
module: "AI in .NET"
source: "code-examples/TaxiFarePrediction/Program.cs"
bloom_levels: [understand, apply]
related: [ml-regression-evaluation, ml-prediction-consumption]
---

## The seven-step shape

```text
MLContext → LoadFromTextFile → CopyColumns("Label") → OneHotEncoding
          → Concatenate("Features") → Trainer → Fit
```

Each step has one purpose. Miss one and training breaks.

## Step 1 — `MLContext`

```cs
using Microsoft.ML;

// MLContext is the root factory for all ML.NET operations — data, transforms, trainers, model save/load
// seed: 0 makes random operations deterministic (same data → same model every run)
MLContext mlContext = new MLContext(seed: 0);
```

Single entry point. Reach `mlContext.Data` (loaders), `mlContext.Transforms` (feature eng), `mlContext.Regression` (trainers + eval), `mlContext.Model` (save/load/predict). `seed: 0` makes training deterministic.

## Step 2 — Load into `IDataView`

```cs
// Load CSV into IDataView (immutable, lazy stream) — type param maps columns to class fields
IDataView trainingData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    trainDataPath, hasHeader: true, separatorChar: ',');
```

`IDataView` is immutable, streaming, lazy. Generic parameter maps CSV columns to class fields:

```cs
public class TaxiTrip
{
    // LoadColumn maps CSV column index (0-based) to field — order in class doesn't matter
    [LoadColumn(0)] public string VendorId;        // CSV column 0
    [LoadColumn(1)] public string RateCode;        // CSV column 1
    [LoadColumn(2)] public float PassengerCount;   // CSV column 2
    [LoadColumn(3)] public float TripTime;         // CSV column 3 (but excluded from features — see pipeline)
    [LoadColumn(4)] public float TripDistance;     // CSV column 4
    [LoadColumn(5)] public string PaymentType;     // CSV column 5
    [LoadColumn(6)] public float FareAmount;       // CSV column 6 (target — will be renamed to "Label")
}
```

`[LoadColumn(N)]` is 0-based; matches CSV column index (not header name).

## Step 3 — Rename target to `"Label"`

```cs
.CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
```

Trainers look up target by exact string `"Label"`. Rename with `CopyColumns` BEFORE the trainer step.

## Step 4 — Encode text categories with `OneHotEncoding`

`VendorId = "VTS"` becomes `[0, 1]`. `VendorId = "CMT"` becomes `[1, 0]`.

```cs
// Convert text categories to numeric vectors: "VTS" → [0,1], "CMT" → [1,0]
// First param = output column name, second param = input column name
.Append(mlContext.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))
.Append(mlContext.Transforms.Categorical.OneHotEncoding("RateCodeEncoded", "RateCode"))
.Append(mlContext.Transforms.Categorical.OneHotEncoding("PaymentTypeEncoded", "PaymentType"))
```

Output name is your choice. Name matters because the next step references it.

## Step 5 — Pack features into `"Features"` vector

```cs
// Pack all numeric/encoded features into a single vector named "Features"
// Output name MUST be exactly "Features" — trainers hardcode this lookup
// Note: TripTime excluded because it's unknown at prediction time (data leakage risk)
.Append(mlContext.Transforms.Concatenate("Features",
    "VendorIdEncoded", "RateCodeEncoded", "PassengerCount",
    "TripDistance", "PaymentTypeEncoded"))
```

Output name MUST be literal `"Features"`. Trainers hardcode that lookup.

**Missing from the Concatenate list:** `TripTime`. Fare is predicted BEFORE trip ends — trip time is not known at prediction time. Including causes data leakage.

## Step 6 — Add the trainer

```cs
// FastTree = gradient-boosted decision-tree ensemble, optimal for regression
.Append(mlContext.Regression.Trainers.FastTree())
```

`FastTree` = gradient-boosted decision-tree ensemble. Default regression trainer in TaxiFarePrediction + the winner AutoML picked.

## Step 7 — `Fit` returns `ITransformer`

```cs
// Fit() trains the pipeline and returns a trained, serializable model (NOT IDataView)
ITransformer model = pipeline.Fit(trainingData);
// Serialize model to disk with its schema — needed to load and run predictions later
mlContext.Model.Save(model, trainingData.Schema, "Data/Model.zip");
```

`Fit()` trains and returns a trained, stateless, serializable model. **NOT** `IDataView`.

## Full pipeline (TaxiFarePrediction)

```cs
// Complete pipeline: rename target → encode categories → pack features → train
var pipeline = mlContext.Transforms
    // Step 1: Rename FareAmount to "Label" (trainers hardcode this name)
    .CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
    // Step 2: Encode text features to numeric vectors
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("RateCodeEncoded", "RateCode"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("PaymentTypeEncoded", "PaymentType"))
    // Step 3: Pack all encoded + numeric features into single "Features" vector
    .Append(mlContext.Transforms.Concatenate("Features",
        "VendorIdEncoded", "RateCodeEncoded", "PassengerCount",
        "TripDistance", "PaymentTypeEncoded"))
    // Step 4: Add regression trainer
    .Append(mlContext.Regression.Trainers.FastTree());

// Step 5: Train on data and return stateless ITransformer
ITransformer model = pipeline.Fit(trainingData);
```

> **Q:** What does `pipeline.Fit(trainingData)` return?
> **A:** `ITransformer`. Not `IDataView`, not `RegressionMetrics`, not `PredictionEngine`.

> **Q:** You add a `OneHotEncoding("StoreAndFwdFlagEncoded", "StoreAndFwdFlag")` but forget to list it in `Concatenate`. What breaks?
> **A:** Nothing compiles wrong and model still trains — but the encoded column never reaches `FastTree`. Every encoded output must appear in `Concatenate` input list.

> **Pitfall**
> `"Label"` and `"Features"` are hardcoded strings — typos silently break training.

> **Pitfall**
> `[LoadColumn(N)]` is 0-based. `Cell(r, c)` in ClosedXML is 1-based. Confusing the two is where off-by-one bugs live.

> **Takeaway**
> One `MLContext`, one `IDataView`, one pipeline: `CopyColumns("Label", target)` → `OneHotEncoding` per text column → `Concatenate("Features", ...)` → trainer. `Fit()` returns `ITransformer`. Save with `Model.Save(model, data.Schema, path)`.
