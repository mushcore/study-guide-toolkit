---
"n": 4
id: 4870-lesson-ml-net-seven-steps-to-a-model
title: "ML.NET: seven steps to a model"
hook: "ML.NET is always: context → load → split → pipeline → fit → evaluate → save."
tags:
  - ml-net
module: AI & ML.NET
---

Every ML.NET program follows the same seven steps. The code below shows each step in isolation with a *why* — if you can explain each why on the exam, you can transfer the pattern to a new dataset.

> **Analogy**
>  MLContext is the lab. IDataView is a raw sample jar. The pipeline is the lab protocol. Fit() runs the experiment. ITransformer is the recipe you save for next time.

#### Step 1 — Context

```cs
var mlContext = new MLContext(seed: 0);
```

*Why:* every ML.NET API hangs off this object — `Data`, `Transforms`, `Regression`, `Model`. The `seed: 0` makes training **deterministic**: same input + same seed → same model. Without a seed, random initialization gives a slightly different model every run and you cannot reproduce a bug.

#### Step 2 — Load

```cs
IDataView data = mlContext.Data.LoadFromTextFile<TaxiTrip>("taxi.csv", hasHeader: true, separatorChar: ',');
```

*Why:* `LoadFromTextFile<T>` is lazy — it does not read the whole file into memory. The generic `<TaxiTrip>` tells ML.NET the column layout via `[LoadColumn(n)]` attributes on the class. `hasHeader: true` skips the first row; forgetting this makes the header parse as data and training blows up.

#### Step 3 — Split

```cs
var split = mlContext.Data.TrainTestSplit(data, testFraction: 0.2);
```

*Why 0.2:* 80/20 is the default because it keeps enough data to train on while leaving a held-out set large enough to estimate real-world error. Training on 100% of your data gives optimistic metrics — the model has memorized the test set.

#### Step 4 — Pipeline

```cs
var pipeline = mlContext.Transforms.CopyColumns("Label", "FareAmount")
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))
    .Append(mlContext.Transforms.Concatenate("Features", "VendorIdEncoded", "TripDistance"))
    .Append(mlContext.Regression.Trainers.FastTree());
```

-   **CopyColumns("Label", "FareAmount")** — trainers expect a column literally named `Label`. You rename your target so the trainer finds it.
-   **OneHotEncoding** — trainers cannot consume strings directly. `VendorId` (e.g. "VTS") becomes a numeric vector. This is required for every string/categorical input.
-   **Concatenate("Features", ...)** — trainers expect ONE column literally named `Features`. You glue all numeric predictors into that single vector. Skipping this step is the most common beginner bug.
-   **FastTree()** — the trainer itself. Swap in `Sdca` or `LightGbm` to compare. Note the pipeline is still just a recipe — no training has happened yet.

#### Step 5 — Fit

```cs
ITransformer model = pipeline.Fit(split.TrainSet);
```

*Why ITransformer, not PredictionEngine:* `Fit` returns a stateless, serializable recipe that can re-run on any IDataView. `PredictionEngine` is the *single-record* convenience wrapper you build LATER from this model. Always say "Fit returns ITransformer" — the distractor is "returns predictions".

#### Step 6 — Evaluate

```cs
var predictions = model.Transform(split.TestSet);
var metrics = mlContext.Regression.Evaluate(predictions, "Label");
Console.WriteLine($"R²: {metrics.RSquared}");
```

*Why `Transform` before `Evaluate`:* Evaluate does not train anything — it compares predicted `Score` to actual `Label` row-by-row. You must run the held-out test set through the trained model first. `RSquared` lives in \[0, 1\]; closer to 1 means the model explains more of the variance.

#### Step 7 — Save

```cs
mlContext.Model.Save(model, data.Schema, "model.zip");
```

*Why the schema is required:* the saved ZIP stores both the trained transformer AND the input column layout. On reload, ML.NET uses the schema to validate that incoming data has the expected column names and types. Saving without schema would produce a model that cannot safely consume new data.

#### The 7-step pipeline — memorize the shape

flowchart LR
  M\[MLContext\] --> L\["LoadFromTextFile<T>
IDataView"\]
  L --> T\[TrainTestSplit 0.2\]
  T --> P\["pipeline:
Concatenate + Trainer"\]
  P --> F\["Fit() → ITransformer"\]
  F --> E\["Evaluate()
RSquared / RMSE"\]
  E --> V\["Model.Save('m.zip')"\]
      

#### Trainer namespaces by task

flowchart TB
  ML\[mlContext\]
  ML --> REG\[".Regression.Trainers
FastTree, Sdca"\]
  ML --> BIN\[".BinaryClassification.Trainers
Logistic"\]
  ML --> MC\[".MulticlassClassification.Trainers
NaiveBayes"\]
  ML --> CL\[".Clustering.Trainers
KMeans"\]
      

> **Warning**
> **Common mistakes (sourced from ML.NET.pptx slide warnings):**
>
> -   **Wrong column name** — trainers expect `Label` and `Features` EXACTLY. Naming them `Target` and `Inputs` compiles but throws at Fit.
> -   **Skipping Concatenate** — with 10 feature columns and no `Concatenate("Features", ...)`, the trainer cannot locate its input. Symptom: "Features column not found" at Fit.
> -   **Label vs Score confusion** — in the TRAIN class the target is the `Label` column (what you know). In the PREDICT class the output is decorated `[ColumnName("Score")]` (what the model produces). They are different columns.
> -   **Picking accuracy for regression** — `Accuracy` is a classification metric. For regression use `RSquared` / `RMSE`; for multi-class use `MacroAccuracy` / `LogLoss`.

> **Q:** **Checkpoint —** Without looking: what does `pipeline.Fit(trainSet)` return, and why is that the right return type (not, say, the predictions themselves)?
> **A:** Returns `ITransformer`. That is correct because the trained pipeline is a reusable, stateless recipe — you can Transform any future IDataView with the same schema, save it to disk, and load it in a separate prediction service. If Fit returned predictions, you would have to retrain to score new data.

> **Note**
> **Takeaway —** Fit() returns ITransformer. LoadFromTextFile returns IDataView. RSquared is closer-to-1 = better for regression.
