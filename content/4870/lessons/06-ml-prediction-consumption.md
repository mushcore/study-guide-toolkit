---
n: 6
id: ml-prediction-consumption
title: "ML.NET inference and model persistence"
hook: "You have a trained taxi-fare model and one new trip. Turn the model into a price."
tags: [ml-net, inference]
module: "AI in .NET"
source: "notes/ML.NET_VS2022_SCRIPT.docx; research-mlnet.md §consume"
bloom_levels: [understand, apply]
related: [ml-pipeline-workflow, ml-regression-evaluation]
---

## From trained model to predicted fare

You have an `ITransformer` returned by `pipeline.Fit(trainingData)`. You also have one `TaxiTrip` object describing a new ride. Your job: produce a single fare.

`Fit()` hands back an `ITransformer` — the trained, stateless, serializable model. It is not an `IDataView`. Keep that distinction sharp; the exam leans on it.

To score one row, wrap the transformer in a `PredictionEngine<TInput, TOutput>`. Create it through `mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model)`, then call `Predict(taxiTrip)`.

### Retrieval checkpoint

Close your eyes. What type does `Fit()` return? Which factory builds a single-row predictor? What attribute decorates the prediction field on your output class?

Answers: `ITransformer`; `mlContext.Model.CreatePredictionEngine<TIn, TOut>`; `[ColumnName("Score")]`.

### The output class

Your output type carries one field per prediction, tagged with the score column name:

```cs
public class TaxiTripFarePrediction
{
    [ColumnName("Score")] public float FareAmount;
}
```

Regression trainers write their prediction into a column named `Score`. Marking the field `[ColumnName("Prediction")]` leaves `FareAmount` at zero — the binding fails silently.

> **Q:** Your web API hosts one `PredictionEngine<TaxiTrip, TaxiTripFarePrediction>` as a singleton service. Under concurrent load, predictions occasionally return garbage values. What is the root cause and what is the fix?
> **A:** `PredictionEngine<TIn, TOut>` is not thread-safe — concurrent `Predict` calls corrupt its internal buffers. Fix: use `PredictionEnginePool<TIn, TOut>` from `Microsoft.Extensions.ML`, or give each request thread its own engine. `ITransformer` itself is thread-safe; only the engine wrapper is not.

> **Example**
> score a single trip
>
> ```csharp
> var predictionEngine = mlContext.Model
>     .CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);
>
> var trip = new TaxiTrip
> {
>     VendorId = "VTS",
>     RateCode = "1",
>     PassengerCount = 1,
>     TripDistance = 10.33f,
>     PaymentType = "CSH",
>     FareAmount = 0          // placeholder; this is what you predict
> };
>
> var prediction = predictionEngine.Predict(trip);
> Console.WriteLine($"Predicted fare: {prediction.FareAmount:0.####}");
> ```

### Batch inference: skip the engine

`PredictionEngine` is a single-row wrapper. For many rows at once, feed an `IDataView` straight into the transformer:

```cs
IDataView scored = model.Transform(batchDataView);
```

`Transform` returns a new `IDataView` with the `Score` column appended. Use this path when you already have rows in tabular form.

### Save and load

A trained model outlives its process. Serialize it with the training schema and reload later:

```cs
// Save — pass the schema from the data you trained on
mlContext.Model.Save(model, trainingData.Schema, "model.zip");

// Load — receive the schema back through the out parameter
DataViewSchema modelSchema;
ITransformer loadedModel = mlContext.Model.Load("model.zip", out modelSchema);
```

The `DataViewSchema` carries column names and types. Without it, `Save` produces a zip that won't rehydrate into a working pipeline.

> **Pitfall**
> `CreatePredictionEngine` is not thread-safe. Creating one per request under load works but wastes allocations. For concurrent inference, use `PredictionEnginePool<TIn, TOut>` from `Microsoft.Extensions.ML`, or give each thread its own engine.

> **Pitfall**
> saving without the schema. `mlContext.Model.Save(model, null, "model.zip")` compiles but strips the metadata ML.NET needs to reconstruct input columns. Always pass `trainingData.Schema`.

> **Takeaway**
> `Fit()` returns `ITransformer`. Wrap it in a `PredictionEngine` for single rows, call `Transform` for batches, and persist it with `Save(model, schema, path)` so the trained weights survive a restart.
