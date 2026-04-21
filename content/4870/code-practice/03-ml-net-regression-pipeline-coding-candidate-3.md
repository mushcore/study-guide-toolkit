---
"n": 3
id: 4870-code-ml-net-regression-pipeline-coding-candidate-3
title: "ML.NET regression pipeline (coding candidate #3)"
lang: cs
variant: starter-solution
tags:
  - ml-net
---

## Prompt

Write the ML.NET code to train and evaluate a regression model predicting HousePrice from Area and Bedrooms. Include: MLContext creation, data model class with [LoadColumn], LoadFromTextFile, TrainTestSplit, pipeline with Concatenate + Regression.Trainers.FastTree, Fit, Evaluate reporting RSquared, and model save.

## Starter

```cs
// Data model
public class House {
    // TODO: LoadColumn attributes
}

// Program.cs
var ml = new MLContext(seed: 0);
// TODO: load CSV
// TODO: split
// TODO: pipeline
// TODO: fit
// TODO: evaluate + Console.WriteLine R²
// TODO: save model
```

## Solution

```cs
using Microsoft.ML;
using Microsoft.ML.Data;

public class House {
    [LoadColumn(0)] public float Area;
    [LoadColumn(1)] public float Bedrooms;
    [LoadColumn(2), ColumnName("Label")] public float HousePrice;
}

public class HousePrediction {
    [ColumnName("Score")] public float HousePrice;
}

// Program.cs
var ml = new MLContext(seed: 0);

IDataView data = ml.Data.LoadFromTextFile<House>(
    "houses.csv", hasHeader: true, separatorChar: ',');

var split = ml.Data.TrainTestSplit(data, testFraction: 0.2);

var pipeline = ml.Transforms.Concatenate("Features", "Area", "Bedrooms")
    .Append(ml.Regression.Trainers.FastTree());

ITransformer model = pipeline.Fit(split.TrainSet);

IDataView preds = model.Transform(split.TestSet);
var metrics = ml.Regression.Evaluate(preds, labelColumnName: "Label");
Console.WriteLine($"R²: {metrics.RSquared:F3}");
Console.WriteLine($"RMSE: {metrics.RootMeanSquaredError:F2}");

ml.Model.Save(model, data.Schema, "house.zip");
```

## Why

<strong>Marking checklist (10 marks):</strong><ul><li>MLContext instantiated with seed (1)</li><li>[LoadColumn] on data model properties (2)</li><li>Label column marked via ColumnName("Label") (1)</li><li>LoadFromTextFile&lt;T&gt; with hasHeader + separator (2)</li><li>TrainTestSplit with testFraction (1)</li><li>pipeline with Concatenate("Features", ...).Append(FastTree()) (2)</li><li>Fit returns ITransformer, Evaluate reports RSquared (1)</li></ul>
