---
n: 4
id: ml-pipeline-build
title: "Build an ML.NET pipeline + train (TaxiFare)"
kind: code
lang: csharp
tags: [ml-net, pipeline, fasttree, code-question]
source: "Lessons 03-05 (likely-pattern coding question for ML.NET bucket — 12 marks on final)"
---

## Prompt

Write a method **`TrainModel`** that builds and trains an ML.NET regression pipeline for the TaxiFare demo. The method should:

1. Take an `MLContext mlContext` and an `IDataView trainingData`.
2. Return the trained **`ITransformer`**.
3. The pipeline must: rename **`FareAmount` → `"Label"`**, **one-hot encode** `VendorId`, `RateCode`, and `PaymentType`, **`Concatenate`** all numeric + encoded columns into **`"Features"`** (do NOT include `TripTime` — data leakage), and use **`FastTree()`** as the regression trainer.
4. Call `pipeline.Fit(trainingData)` and return the result.

Write only the method.

## Starter

```cs
public static ITransformer TrainModel(MLContext mlContext, IDataView trainingData)
{
    // TODO 1: build pipeline — CopyColumns + 3x OneHotEncoding + Concatenate + FastTree
    // TODO 2: Fit on trainingData
    // TODO 3: return the trained ITransformer
}
```

## Solution

```cs
public static ITransformer TrainModel(MLContext mlContext, IDataView trainingData)
{
    var pipeline = mlContext.Transforms
        .CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
        .Append(mlContext.Transforms.Categorical.OneHotEncoding("VendorIdEncoded",    "VendorId"))
        .Append(mlContext.Transforms.Categorical.OneHotEncoding("RateCodeEncoded",    "RateCode"))
        .Append(mlContext.Transforms.Categorical.OneHotEncoding("PaymentTypeEncoded", "PaymentType"))
        .Append(mlContext.Transforms.Concatenate("Features",
            "VendorIdEncoded", "RateCodeEncoded", "PassengerCount",
            "TripDistance",   "PaymentTypeEncoded"))
        .Append(mlContext.Regression.Trainers.FastTree());

    return pipeline.Fit(trainingData);
}
```

## Why

**`"Label"`** and **`"Features"`** are hardcoded magic strings — every regression trainer looks them up by exact string match. `CopyColumns` renames the target; `Concatenate` packs the input vector. `OneHotEncoding` outputs receive whatever name you choose, but they must be referenced by that name in `Concatenate`.

A common wrong approach is to **include `TripTime`** in the `Concatenate` list. Trip time isn't known at prediction time (the trip hasn't ended), so feeding it during training causes **data leakage** — the model "cheats" using a column that won't be available in production.

Another wrong approach is using a different output name for `Concatenate`, like `"X"` or `"Inputs"`. The pipeline still compiles, but `FastTree()` looks for `"Features"` literally and throws at `Fit` time. Same trap for `"Label"`.
