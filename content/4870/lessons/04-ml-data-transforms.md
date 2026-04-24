---
n: 4
id: ml-data-transforms
title: "ML.NET data transforms"
hook: "A trainer reads numbers from a column literally named \"Features\" and a target literally named \"Label\" — your pipeline's job is to produce both."
tags: [ml-net, feature-eng]
module: "AI in .NET"
source: "slides/ML.NET.pptx p.11–18; research-mlnet.md §transforms"
bloom_levels: [understand, apply]
related: [ml-pipeline-workflow, ml-regression-evaluation]
---

## Start with one raw row

A CSV row arrives: `VTS,1,1,430,10.33,CSH,15.5`. Your `TaxiTrip` class reads it with `[LoadColumn(0)]` through `[LoadColumn(6)]`, pulling `VendorId = "VTS"`, `TripDistance = 10.33f`, `FareAmount = 15.5f`. A regression trainer cannot consume the string `"VTS"` and will not scan for a column called `FareAmount`. You must rewrite this row into two vectors the trainer recognizes: `"Label"` (the target scalar) and `"Features"` (the input vector).

Three transforms do the rewriting: `CopyColumns`, `OneHotEncoding`, and `Concatenate`.

## Rename your target to `"Label"`

`CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")` duplicates `FareAmount` under the name `"Label"`. Trainers in `mlContext.Regression.Trainers` look up the target by that exact name. The rename must come **before** the trainer step in the `.Append(...)` chain — append it later and the fit call fails to find `"Label"`.

> **Example**
> ```csharp
> var pipeline = mlContext.Transforms
>     .CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
>     .Append(/* encodings */)
>     .Append(/* concatenate */)
>     .Append(mlContext.Regression.Trainers.FastTree());
> ```

## Turn text categories into numbers with `OneHotEncoding`

`VendorId` holds strings like `"CMT"` or `"VTS"`. Trainers need numbers. `mlContext.Transforms.Categorical.OneHotEncoding(outputColumnName: "VendorIdEncoded", inputColumnName: "VendorId")` expands each distinct value into a binary-indicator slot. `"VTS"` becomes `[0, 1]`; `"CMT"` becomes `[1, 0]`. This is **categorical encoding**.

You pick the output name. `"VendorIdEncoded"` is a convention; `"VendorId_OH"` works equally well. The name only matters because the next step references it by string.

> **Q:** Your raw data has three text columns — `VendorId`, `RateCode`, `PaymentType`. How many `OneHotEncoding` calls does the pipeline need, and what names do their outputs carry?
> **A:** Three calls — one per categorical column. Output names are your choice (e.g. `"VendorIdEncoded"`, `"RateCodeEncoded"`, `"PaymentTypeEncoded"`); every name you pick must then appear in the `Concatenate` input list.

## Assemble one `"Features"` vector with `Concatenate`

`Concatenate(outputColumnName: "Features", …inputColumnNames)` stitches the surviving numeric columns into a single vector. The output name **must** be the literal string `"Features"` — trainers hardcode that lookup. Rename it to `"Inputs"` and the fit call throws.

Every column the trainer should see belongs in the input list: each encoded output plus each raw numeric feature you kept.

```cs
.Append(mlContext.Transforms.Concatenate("Features",
    "VendorIdEncoded", "RateCodeEncoded",
    "PassengerCount", "TripDistance", "PaymentTypeEncoded"))
```

Notice what is **missing**: `TripTime`. You predict fare before the trip ends, so trip time is not known at prediction time. Including it causes data leakage — the model "cheats" during training and performs badly on real trips.

## Full pipeline shape

```cs
var pipeline = mlContext.Transforms.CopyColumns("Label", "FareAmount")
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("VendorIdEncoded", "VendorId"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("RateCodeEncoded", "RateCode"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding("PaymentTypeEncoded", "PaymentType"))
    .Append(mlContext.Transforms.Concatenate("Features",
        "VendorIdEncoded", "RateCodeEncoded",
        "PassengerCount", "TripDistance", "PaymentTypeEncoded"))
    .Append(mlContext.Regression.Trainers.FastTree());
```

Read top-to-bottom: rename target, encode three text columns, concatenate into `"Features"`, train.

> **Q:** You add a fourth categorical column `StoreAndFwdFlag` and call `OneHotEncoding("StoreAndFwdFlagEncoded", "StoreAndFwdFlag")`. The pipeline compiles and trains without error. Why might your model still perform identically to before?
> **A:** The `Concatenate` call determines which columns feed the trainer. If `"StoreAndFwdFlagEncoded"` is not added to the `Concatenate` input list, the encoded column exists in the schema but never reaches `FastTree`. Always cross-check: every encoded output must appear as a `Concatenate` input.

> **Pitfall**
> Encoding a column and then forgetting to list it in `Concatenate` silently drops it from the feature vector. The pipeline still compiles and trains — just on fewer features. Always cross-check: every `OneHotEncoding` output name appears in the `Concatenate` input list.

> **Pitfall**
> `[LoadColumn(0)]` is 0-based (first CSV column is index 0). ClosedXML cell indexes are 1-based. Copy-pasting between an Excel reader and an ML.NET schema is where off-by-one errors live.

> **Takeaway**
> Three transforms, three jobs: `CopyColumns` names your target `"Label"`, `OneHotEncoding` numerifies each text column under a name you choose, `Concatenate` bundles everything into the single `"Features"` vector the trainer expects.
