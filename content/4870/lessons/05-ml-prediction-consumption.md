---
n: 5
id: ml-prediction-consumption
title: "ML.NET inference + model persistence"
hook: "CreatePredictionEngine for one row. Save/Load for across processes."
tags: [ml-net, inference, save-load]
module: "AI in .NET"
source: "code-examples/TaxiFarePrediction/Program.cs"
bloom_levels: [understand, apply]
related: [ml-pipeline, ml-regression-evaluation]
---

## Single-row inference — `PredictionEngine`

```cs
// PredictionEngine wraps model for single-row inference (not batches)
var engine = mlContext.Model
    .CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);

// Create sample input — all fields required by model (values become features after pipeline transforms)
var sample = new TaxiTrip
{
    VendorId = "VTS",
    RateCode = "1",
    PassengerCount = 1,
    TripTime = 1140,
    TripDistance = 3.75f,
    PaymentType = "CRD",
    FareAmount = 0          // Placeholder value (will be overwritten by prediction)
};

// Predict single row — runs through entire pipeline and returns typed output
var prediction = engine.Predict(sample);
// FareAmount field populated by [ColumnName("Score")] binding
Console.WriteLine($"Predicted fare: {prediction.FareAmount:0.####}");
```

## Batch inference — `Transform`

```cs
IDataView scored = model.Transform(batchDataView);
```

Returns new `IDataView` with `Score` column appended. Use for tabular inputs.

## Save — needs schema

```cs
// Save trained model + schema to zip file (schema needed to rehydrate pipeline)
mlContext.Model.Save(model, dataView.Schema, "Data/Model.zip");
```

Without `DataViewSchema`, the zip does not rehydrate into a working pipeline.

## Load — schema out-param

```cs
// Load model from zip file (out param returns schema for reconstruction)
DataViewSchema modelSchema;
ITransformer trainedModel = mlContext.Model.Load("Data/Model.zip", out modelSchema);

// Wrap loaded model in PredictionEngine for single-row inference
var engine = mlContext.Model
    .CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(trainedModel);
```

Loaded model behaves identically to freshly-fit one.

## End-to-end demo sequence

```cs
// === TRAINING PHASE ===
// Fit pipeline and get trained model
ITransformer model = pipeline.Fit(trainingData);
// Persist to disk for reuse in other processes/sessions
mlContext.Model.Save(model, trainingData.Schema, _modelPath);

// === INFERENCE PHASE (different process/session) ===
// Create fresh MLContext in new process
mlContext = new MLContext(seed: 0);
// Load trained model from disk
DataViewSchema modelSchema;
ITransformer trainedModel = mlContext.Model.Load(_modelPath, out modelSchema);
// Wrap in prediction engine for single-row inference
var engine = mlContext.Model
    .CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(trainedModel);
// Make prediction
var prediction = engine.Predict(sample);
```

> **Q:** What type does `Fit` return? Which factory builds a single-row predictor? What attribute decorates the prediction field?
> **A:** `ITransformer`; `mlContext.Model.CreatePredictionEngine<TIn, TOut>`; `[ColumnName("Score")]`.

> **Pitfall**
> `Fit` returns `ITransformer`, not `IDataView`. Demo sequence: `Fit` → `Save(model, schema, path)` → later `Load(path, out schema)` → `CreatePredictionEngine` → `Predict`.

> **Pitfall**
> Saving without schema. `Model.Save(model, null, path)` compiles but strips metadata needed to rebuild input columns. Always pass `dataView.Schema`.

> **Takeaway**
> `Fit()` → `ITransformer`. Wrap with `CreatePredictionEngine<TIn, TOut>` for single rows. `model.Transform` for batches. Persist with `Save(model, schema, path)`.
