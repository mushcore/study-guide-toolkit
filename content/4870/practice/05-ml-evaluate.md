---
n: 5
id: ml-evaluate
title: "Evaluate a trained ML.NET regression model"
kind: code
lang: csharp
tags: [ml-net, regression, evaluate, rsquared, rmse, code-question]
source: "Lesson 04 (likely-pattern coding question for ML.NET bucket — 12 marks on final)"
---

## Prompt

Write a method **`EvaluateModel`** that scores a trained ML.NET regression model on a test set. The method should:

1. Take an `MLContext mlContext`, an `ITransformer model`, and an `IDataView testData`.
2. Run **`model.Transform(testData)`** to produce predictions.
3. Call **`mlContext.Regression.Evaluate(predictions, "Label", "Score")`**.
4. Print `RSquared` (formatted to two decimals) and `RootMeanSquaredError` (formatted to two decimals).

Write only the method.

## Starter

```cs
public static void EvaluateModel(MLContext mlContext, ITransformer model, IDataView testData)
{
    // TODO 1: run model.Transform on test data
    // TODO 2: call Regression.Evaluate with "Label" + "Score"
    // TODO 3: print RSquared and RootMeanSquaredError
}
```

## Solution

```cs
public static void EvaluateModel(MLContext mlContext, ITransformer model, IDataView testData)
{
    var predictions = model.Transform(testData);

    var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");

    Console.WriteLine($"RSquared Score:          {metrics.RSquared:0.##}");
    Console.WriteLine($"Root Mean Squared Error: {metrics.RootMeanSquaredError:#.##}");
}
```

## Why

**`Regression.Evaluate`** matches the **regression** task family — its return type is `RegressionMetrics`, which exposes `RSquared`, `RootMeanSquaredError`, `MeanAbsoluteError`, `MeanSquaredError`. The third argument **`"Score"`** is the literal column name where regression trainers (`FastTree`, `Sdca`, `LightGbm`) write predictions.

A common wrong approach is calling **`mlContext.MulticlassClassification.Evaluate(...)`** instead. Wrong namespace returns the wrong metrics class — you get `MicroAccuracy`/`MacroAccuracy` and no `RSquared` member. The trainer's namespace must match the evaluation namespace.

Another wrong approach: passing the bound C# field name like `"FareAmount"` as the second argument. The pipeline already aliased `FareAmount` to **`"Label"`** via `CopyColumns` (Lesson 03) — there's no `"FareAmount"` column in the predictions `IDataView` anymore.
