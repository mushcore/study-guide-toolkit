---
n: 6
id: ml-predict-single-row
title: "Predict a single row with PredictionEngine"
kind: code
lang: csharp
tags: [ml-net, prediction-engine, predict, code-question]
source: "Lesson 05 (likely-pattern coding question for ML.NET bucket — 12 marks on final)"
---

## Prompt

Write a method **`PredictFare`** that loads a saved model and predicts the fare for one trip. The method should:

1. Take a `MLContext mlContext`, a `string modelPath`, and a `TaxiTrip sample`.
2. Load the model from disk via **`Model.Load(modelPath, out var schema)`**.
3. Build a single-row predictor with **`CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(loadedModel)`**.
4. Call `engine.Predict(sample)` and return the **`FareAmount`** field of the prediction.

Assume `TaxiTripFarePrediction` has `[ColumnName("Score")] public float FareAmount;`. Write only the method.

## Starter

```cs
public static float PredictFare(MLContext mlContext, string modelPath, TaxiTrip sample)
{
    // TODO 1: Model.Load(path, out schema)
    // TODO 2: CreatePredictionEngine<TIn, TOut>
    // TODO 3: Predict and return FareAmount
}
```

## Solution

```cs
public static float PredictFare(MLContext mlContext, string modelPath, TaxiTrip sample)
{
    DataViewSchema schema;
    ITransformer loadedModel = mlContext.Model.Load(modelPath, out schema);

    var engine = mlContext.Model
        .CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(loadedModel);

    var prediction = engine.Predict(sample);
    return prediction.FareAmount;
}
```

## Why

`Model.Load` always returns the saved model's **schema as an `out` parameter** — even when you don't use it, the signature requires the variable. **`CreatePredictionEngine<TIn, TOut>`** is generic in both the input and output types: `TIn` matches what `LoadFromTextFile<T>` used during training; `TOut` is the prediction class with the **`[ColumnName("Score")]`** binding.

A common wrong approach is using **`[ColumnName("Prediction")]`** on the output field. Compiles fine. Runs fine. The field stays `0` because regression trainers always write to **`"Score"`**, not `"Prediction"`. Binding fails silently — no exception.

Another wrong approach is using **`PredictionEngine` in a tight batch loop**. It's optimized for one row at a time. For batches use **`model.Transform(IDataView)`** — much faster per row.
