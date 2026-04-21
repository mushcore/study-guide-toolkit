---
id: 4870-topic-ml-net-full-pipeline-and-metrics
title: ML.NET — Full pipeline and metrics
pillar: tech
priority: high
chapter: W08-09
tags:
  - ml-net
---

### Data model

```cs
public class TaxiTrip {
    [LoadColumn(0)] public string VendorId;
    [LoadColumn(1)] public string RateCode;
    [LoadColumn(2)] public float PassengerCount;
    [LoadColumn(3)] public float TripDistance;
    [LoadColumn(4)] public float FareAmount;  // target
}

public class TaxiFarePrediction {
    [ColumnName("Score")] public float FareAmount;
}
```

### Pipeline

```cs
var ml = new MLContext(seed: 0);
IDataView data = ml.Data.LoadFromTextFile<TaxiTrip>("taxi.csv", hasHeader: true, separatorChar: ',');
var split = ml.Data.TrainTestSplit(data, testFraction: 0.2);

var pipeline = ml.Transforms.CopyColumns("Label", "FareAmount")
    .Append(ml.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))
    .Append(ml.Transforms.Concatenate("Features", "VendorIdEncoded", "TripDistance"))
    .Append(ml.Regression.Trainers.FastTree());

ITransformer model = pipeline.Fit(split.TrainSet);
IDataView preds = model.Transform(split.TestSet);
var m = ml.Regression.Evaluate(preds, labelColumnName: "Label");
Console.WriteLine($"R²={m.RSquared:F3}, RMSE={m.RootMeanSquaredError:F3}");

ml.Model.Save(model, data.Schema, "taxi.zip");
```

### Trainer namespaces

| Task | Namespace | Trainer examples |
| --- | --- | --- |
| Regression | mlContext.Regression.Trainers | FastTree, FastForest, Sdca, LightGbm |
| Binary classification | BinaryClassification.Trainers | LogisticRegression, AveragedPerceptron |
| Multiclass | MulticlassClassification.Trainers | NaiveBayes, SdcaMaximumEntropy |
| Clustering | Clustering.Trainers | KMeans |

### Metrics

| Task | Metric | Better direction |
| --- | --- | --- |
| Regression | RSquared | 0→1, higher = better |
| Regression | RootMeanSquaredError (RMSE) | lower = better |
| Binary | Accuracy, F1Score, AreaUnderRocCurve | higher = better |
| Multiclass | MacroAccuracy, LogLoss | acc higher, logloss lower |
