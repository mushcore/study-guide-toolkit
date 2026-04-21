# ML.NET Exam Study Guide
**COMP4870 – Final Exam (12 Marks)**

---

## Table of Contents
1. [Topic Summaries](#topic-summaries)
2. [Key Concepts & Architecture](#key-concepts--architecture)
3. [Code Patterns & Workflows](#code-patterns--workflows)
4. [Training Pipeline Anatomy](#training-pipeline-anatomy)
5. [Algorithms & Trainers](#algorithms--trainers)
6. [Evaluation Metrics](#evaluation-metrics)
7. [Flashcard Set (15 Cards)](#flashcard-set-15-cards)
8. [Exam Traps & Gotchas](#exam-traps--gotchas)
9. [Practice MCQ (8 Questions)](#practice-mcq-8-questions)

---

## Topic Summaries

### What is ML.NET?

ML.NET is a **machine learning framework for .NET developers** that enables you to build custom ML models using C#, VB, or F#. It is:
- **Open source & cross-platform** — runs on Windows, Linux, and macOS
- **Proven at scale** — used internally at Microsoft in Windows 10, PowerPoint, Excel, and Bing Ads
- **Code-first approach** — no dependencies on cloud services; models deploy locally
- **Developer-focused** — integrates with .NET tooling (Visual Studio 2022, VS Code)

**Key positioning**: ML.NET sits between pre-built APIs (Azure Cognitive Services) and full control (Python/R). You get familiar C# syntax with direct ML model control.

---

### Supported ML Scenarios

ML.NET supports multiple machine learning tasks:

| Scenario | Purpose | Example |
|----------|---------|---------|
| **Regression** (Value Prediction) | Predict numeric values | Taxi fare, house prices |
| **Binary Classification** | Two-class categorization | Spam/Not spam, Cat/Not cat |
| **Multiclass Classification** | Multiple categories | Sentiment (positive/negative/neutral) |
| **Clustering** | Group similar data without labels | Customer segmentation |
| **Recommendation** | Suggest items based on ratings | Movie recommendations |
| **Forecasting** | Time-series prediction | Sales forecasts |
| **Image Classification** | Categorize images | Dog breed detection |

---

### Three Ways to Build ML Models in ML.NET

#### 1. **Model Builder (Visual Studio 2022 GUI)**
- Right-click project → "Add Machine Learning Model"
- Select scenario (Regression, Classification, etc.)
- Choose local (CPU) or cloud training
- Specify training data file and label column
- GUI auto-generates `TaxiFareModel.mbconfig` file
- Generates C# code for predictions
- **Best for**: Beginners, rapid prototyping, no code required

#### 2. **ML.NET API (Code-first, VS Code/Terminal)**
- Manual pipeline construction in C# code
- Full control over transforms and trainers
- Use `MLContext`, `IDataView`, `ITransformer`
- Chain operations: Load → Transform → Train → Evaluate → Predict
- **Best for**: Production apps, complex pipelines, fine-grained control

#### 3. **AutoML CLI (`mlnet` command-line tool)**
- Terminal: `mlnet regression --dataset "taxi-fare-train.csv" --label-col 6 --train-time 60`
- Automatically tries 40+ algorithm combinations
- Returns top 5 models ranked by metrics
- Generates console app with best model
- **Best for**: Exploring algorithms quickly, benchmarking

---

## Key Concepts & Architecture

### MLContext
```csharp
MLContext mlContext = new MLContext(seed: 0);
```
- **Root object** for all ML.NET operations
- Provides access to data loading, transforms, trainers, evaluators
- `seed: 0` makes training **deterministic** — results repeat across runs
- Properties: `mlContext.Data`, `mlContext.Regression`, `mlContext.Classification`, `mlContext.Model`

---

### IDataView
- **Immutable tabular data** (similar to a DataFrame in pandas)
- Returned by `mlContext.Data.LoadFromTextFile<T>()`
- Lazy evaluation — data not fully loaded into memory until needed
- Has a **Schema** that describes column names and types

---

### ITransformer
- **Trained ML model** that transforms data
- Returned by `pipeline.Fit(dataView)`
- Stateless and serializable
- Use `transformer.Transform(data)` to make predictions on new data
- Can be saved/loaded with `mlContext.Model.Save()` / `mlContext.Model.Load()`

---

### PredictionEngine<TInput, TOutput>
```csharp
var predictionFunction = mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);
var prediction = predictionFunction.Predict(singleInput);
```
- **Converts one input example → one prediction**
- Used at inference time for individual predictions
- Wraps the trained `ITransformer`
- Type-safe: takes `TInput` class, returns `TOutput` class

---

### Column Mapping & Inference
- **Column attributes** map CSV columns to class properties:
  ```csharp
  [Column("0")] public string VendorId;
  [Column("4")] public float TripDistance;
  [Column("6")] public float FareAmount;
  ```
- **Label column**: The target you predict (e.g., FareAmount)
- **Feature columns**: Input data used for prediction (e.g., VendorId, TripDistance)
- Not all columns are features — exclude time-dependent or label-dependent columns

---

### Trainer (Learner)
- Algorithm that learns from features + label
- Examples: `FastTreeRegressor()`, `SdcaRegression()`, `LightGbmRegression()`
- Called via `mlContext.Regression.Trainers.FastTree()` or `mlContext.Classification.Trainers.LogisticRegression()`
- Returns an `ITransformer` when `Fit()` is called

---

### Evaluator
- Measures model quality on test data
- Different evaluators for different tasks:
  - Regression: `mlContext.Regression.Evaluate()`
  - Classification: `mlContext.MulticlassClassification.Evaluate()`
- Returns metrics (RSquared, Accuracy, F1, etc.)

---

### TrainTestSplit
```csharp
var trainTestData = mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);
ITransformer model = pipeline.Fit(trainTestData.TrainSet);
var metrics = evaluator.Evaluate(model.Transform(trainTestData.TestSet), "Label", "Score");
```
- Splits data into training (80%) and test (20%) sets
- Train on one, evaluate on the other to measure generalization

---

### CrossValidate
```csharp
var cvResults = mlContext.Regression.CrossValidate(pipeline, data, numberOfFolds: 5);
```
- Splits data into *k* folds (e.g., 5)
- Trains *k* models, each on (k-1) folds, tests on remaining fold
- Returns average metrics across all folds
- Better estimate of model performance than single train/test split

---

## Code Patterns & Workflows

### Complete ML.NET Workflow (Regression – Taxi Fare Example)

#### Step 1: Create MLContext
```csharp
using Microsoft.ML;
using System.IO;

MLContext mlContext = new MLContext(seed: 0);
```

#### Step 2: Define Data Classes
```csharp
public class TaxiTrip
{
    [Column("0")] public string VendorId;
    [Column("1")] public string RateCode;
    [Column("2")] public float PassengerCount;
    [Column("3")] public float TripTime;
    [Column("4")] public float TripDistance;
    [Column("5")] public string PaymentType;
    [Column("6")] public float FareAmount; // Label
}

public class TaxiTripFarePrediction
{
    [ColumnName("Score")] public float FareAmount;
}
```

#### Step 3: Load Data
```csharp
string trainDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "taxi-fare-train.csv");
IDataView trainingData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    trainDataPath,
    hasHeader: true,
    separatorChar: ','
);
```

#### Step 4: Build Pipeline (Transforms + Trainer)
```csharp
var pipeline = mlContext.Transforms.CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
    .Append(mlContext.Transforms.Categorical.OneHotEncoding(
        outputColumnName: "VendorIdEncoded",
        inputColumnName: "VendorId"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding(
        outputColumnName: "RateCodeEncoded",
        inputColumnName: "RateCode"))
    .Append(mlContext.Transforms.Categorical.OneHotEncoding(
        outputColumnName: "PaymentTypeEncoded",
        inputColumnName: "PaymentType"))
    .Append(mlContext.Transforms.Concatenate("Features",
        "VendorIdEncoded", "RateCodeEncoded", "PassengerCount", "TripDistance", "PaymentTypeEncoded"))
    .Append(mlContext.Regression.Trainers.FastTree());
```

#### Step 5: Train Model (Fit)
```csharp
ITransformer model = pipeline.Fit(trainingData);
```
- `Fit()` returns an `ITransformer`
- Applies all transforms and trains the trainer
- Model is now ready to evaluate or predict

#### Step 6: Evaluate Model
```csharp
string testDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "taxi-fare-test.csv");
IDataView testData = mlContext.Data.LoadFromTextFile<TaxiTrip>(
    testDataPath,
    hasHeader: true,
    separatorChar: ','
);

var predictions = model.Transform(testData);
var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");

Console.WriteLine($"RSquared: {metrics.RSquared:0.##}");
Console.WriteLine($"RMS Error: {metrics.RootMeanSquaredError:#.##}");
```

#### Step 7: Make Predictions
```csharp
var predictionEngine = mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);

var taxiTrip = new TaxiTrip()
{
    VendorId = "VTS",
    RateCode = "1",
    PassengerCount = 1,
    TripDistance = 10.33f,
    PaymentType = "CSH",
    FareAmount = 0 // Predict this
};

var prediction = predictionEngine.Predict(taxiTrip);
Console.WriteLine($"Predicted fare: {prediction.FareAmount:0.####}");
```

#### Step 8: Save & Load Model
```csharp
// Save
mlContext.Model.Save(model, trainingData.Schema, "model.zip");

// Load
DataViewSchema modelSchema;
ITransformer loadedModel = mlContext.Model.Load("model.zip", out modelSchema);
```

---

## Training Pipeline Anatomy

```
Raw CSV Data
    ↓
LoadFromTextFile<TaxiTrip>()  ← Load data into IDataView
    ↓
CopyColumns("Label", "FareAmount")  ← Designate label column
    ↓
OneHotEncoding("VendorIdEncoded", "VendorId")  ← Convert categories to numbers
OneHotEncoding("RateCodeEncoded", "RateCode")
OneHotEncoding("PaymentTypeEncoded", "PaymentType")
    ↓
Concatenate("Features", ...)  ← Combine all features into single "Features" column
    ↓
FastTreeRegressor()  ← Choose learning algorithm
    ↓
Fit(trainingData)  ← Train and return ITransformer
    ↓
ITransformer (Trained Model)
    ↓
Evaluate() or Predict()
```

### Key Transform Classes

| Transform | Purpose |
|-----------|---------|
| `CopyColumns()` | Copy or rename a column |
| `OneHotEncoding()` | Convert categorical text to numeric vectors |
| `Concatenate()` | Combine multiple columns into one "Features" column |
| `NormalizeMinMax()` | Scale numeric features to [0,1] range |
| `FeatureSelection()` | Select most important features |

---

## Algorithms & Trainers

### Regression Trainers (For Numeric Predictions)

| Trainer | Use Case | Speed | Accuracy | Notes |
|---------|----------|-------|----------|-------|
| **FastTreeRegressor** | General regression | Very Fast | High | Default choice; gradient boosting |
| **FastTreeTweedieRegression** | Zero-inflated data | Fast | High | Good for sparse predictions |
| **SdcaRegression** | Linear relationships | Very Fast | Medium | For small datasets |
| **LightGbmRegression** | Large datasets | Fast | Very High | Requires LightGBM package |
| **FastForestRegression** | Ensemble method | Medium | High | Random forests |
| **StochasticGradientDescentRegression** | Online learning | Very Fast | Medium | For streaming data |

**Selection logic for taxi fare regression**: AutoML tested 42 models; top 5 were all variants of **FastTree** and **FastForest**.

---

### Classification Trainers (For Categories)

| Trainer | Task | Example |
|---------|------|---------|
| `AveragedPerceptron` | Binary classification | Spam/Not spam |
| `LogisticRegression` | Binary/multiclass | Email category |
| `NaiveBayes` | Multiclass | Text sentiment |
| `LightGbm` | Binary/multiclass | Fraud detection |

---

## Evaluation Metrics

### Regression Metrics (For numeric predictions)

| Metric | Range | Interpretation | Formula |
|--------|-------|-----------------|---------|
| **RSquared** | 0–1 | % of variance explained by model; closer to 1 = better | 1 – (SS_residual / SS_total) |
| **RootMeanSquaredError (RMSE)** | ≥ 0 | Avg prediction error in original units; lower = better | √(Σ(predicted – actual)² / n) |
| **MeanAbsoluteError (MAE)** | ≥ 0 | Avg absolute error; more interpretable than RMSE | Σ\|predicted – actual\| / n |
| **LossFunction** | Various | Task-specific penalty; reported by trainer |  |

**Example interpretation**:
- RSquared = 0.89: Model explains 89% of fare variance
- RMSE = 3.3: Average prediction error is $3.30

---

### Classification Metrics

| Metric | Interpretation |
|--------|-----------------|
| **Accuracy** | % correct predictions (be careful with imbalanced data) |
| **Precision** | Of positive predictions, how many correct? |
| **Recall** | Of actual positives, how many detected? |
| **F1** | Harmonic mean of precision & recall |
| **MacroAccuracy** | Average accuracy across all classes |
| **MicroAccuracy** | Overall accuracy (weighted by class frequency) |

---

## Flashcard Set (15 Cards)

**Format**: Cloze deletion preferred. **Source-tagged** with material reference.

---

### Card 1 (Concept)
**Q**: What is ML.NET?  
**A**: A machine learning framework for .NET developers to build custom ML models using C#, VB, or F#. It's open source, cross-platform, uses a code-first approach, and deploys models locally.  
**Source**: Slides 6, 10; ML.NET_VS2022_SCRIPT

---

### Card 2 (Terminology)
**Q**: The `____` object is the root container for all ML.NET operations and provides access to data loading, transforms, and trainers.  
**A**: `MLContext`  
**Source**: ML.NET_VSCODE_SCRIPT (line 42)

---

### Card 3 (Method)
**Q**: Which method loads CSV data into an `IDataView`?  
**A**: `mlContext.Data.LoadFromTextFile<T>(path, hasHeader: true, separatorChar: ',')`  
**Source**: ML.NET_VSCODE_SCRIPT (line 50)

---

### Card 4 (Return Type)
**Q**: The `pipeline.Fit(dataView)` method returns a(n) `____` object.  
**A**: `ITransformer`  
**Source**: ML.NET_VSCODE_SCRIPT (line 65)

---

### Card 5 (Prediction)
**Q**: To make a prediction on a single example, use the `____` method.  
**A**: `mlContext.Model.CreatePredictionEngine<TInput, TOutput>(model).Predict()`  
**Source**: ML.NET_VSCODE_SCRIPT (lines 101–114)

---

### Card 6 (Data Preprocessing)
**Q**: To convert categorical text columns (e.g., "CMT", "VTS") to numeric vectors, use the `____` transform.  
**A**: `OneHotEncoding()`  
**Source**: ML.NET_VSCODE_SCRIPT (lines 54–56)

---

### Card 7 (Pipeline Step)
**Q**: To combine multiple feature columns into a single "Features" column, use the `____` transform.  
**A**: `Concatenate("Features", ...)`  
**Source**: ML.NET_VSCODE_SCRIPT (line 58)

---

### Card 8 (Label vs. Features)
**Q**: The `____` is the column you want to predict; the `____` are the input columns used for prediction.  
**A**: Label; Features  
**Source**: ML.NET_VSCODE_SCRIPT (line 26)

---

### Card 9 (Trainer)
**Q**: For regression (numeric value prediction), the recommended trainer is `____`.  
**A**: `mlContext.Regression.Trainers.FastTree()`  
**Source**: ML.NET_VSCODE_SCRIPT (line 62); ML.NET_vscode_automl_SCRIPT (lines 29–34)

---

### Card 10 (Evaluation)
**Q**: To measure how well a regression model performs on test data, call `____` and check the `____` metric (0–1 range, higher is better).  
**A**: `mlContext.Regression.Evaluate(predictions, "Label", "Score")`; `RSquared`  
**Source**: ML.NET_VSCODE_SCRIPT (line 82)

---

### Card 11 (Persistence)
**Q**: To save a trained `ITransformer` model to disk, use `____`.  
**A**: `mlContext.Model.Save(model, dataView.Schema, "model.zip")`  
**Source**: ML.NET_VSCODE_SCRIPT (line 67)

---

### Card 12 (Persistence)
**Q**: To load a saved model from disk and get its schema, use `____.Load(path, out modelSchema)`.  
**A**: `mlContext.Model`  
**Source**: ML.NET_VSCODE_SCRIPT (line 143)

---

### Card 13 (AutoML)
**Q**: The ML.NET CLI command `____` automatically explores 40+ algorithm combinations and returns the top 5 models ranked by metrics.  
**A**: `mlnet regression --dataset "taxi-fare-train.csv" --label-col 6 --has-header true --train-time 60`  
**Source**: ML.NET_vscode_automl_SCRIPT (line 11)

---

### Card 14 (Determinism)
**Q**: To make ML.NET training **deterministic** (same results across runs), pass `seed: 0` to the `____` constructor.  
**A**: `MLContext(seed: 0)`  
**Source**: ML.NET_VSCODE_SCRIPT (line 42)

---

### Card 15 (Train/Test Split)
**Q**: The best practice is to split data into `____` (for training) and `____` (for evaluation) sets to measure generalization.  
**A**: Training set (typically 80%); Test set (typically 20%)  
**Source**: ML.NET_VSCODE_SCRIPT (lines 79–82)

---

## Exam Traps & Gotchas

### 1. **ML.NET (Framework) vs. ML.net (CLI) vs. ml.net**
- **ML.NET** (correct capitalization) = main framework
- **mlnet** (lowercase, no dot) = CLI tool for AutoML
- Watch for case sensitivity in command-line tools

---

### 2. **MLContext vs. Model Builder**
- **MLContext**: Programmatic API; full control; requires code
- **Model Builder**: Visual GUI in VS 2022; generates .mbconfig file; no code needed
- Exam may ask: "Which method requires writing code?" → **MLContext API**

---

### 3. **Fit() Returns ITransformer, Not IDataView**
```csharp
// CORRECT
ITransformer model = pipeline.Fit(trainingData);

// WRONG
IDataView model = pipeline.Fit(trainingData);  // ✗ Returns ITransformer, not IDataView
```

---

### 4. **Regression vs. BinaryClassification vs. MulticlassClassification Namespaces**
```csharp
mlContext.Regression.Trainers.FastTree()           // For numeric prediction
mlContext.BinaryClassification.Trainers.LogisticRegression()  // For 2-class
mlContext.MulticlassClassification.Trainers.NaiveBayes()     // For 3+ classes
```
Using wrong namespace → compilation error or wrong metric evaluation

---

### 5. **Label Column Must Be Specified First**
```csharp
.CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
```
If you don't copy/rename your target column to "Label", training fails.

---

### 6. **Features Column Must Be Named "Features"**
```csharp
.Concatenate("Features", "VendorIdEncoded", "RateCodeEncoded", ...)
```
The concatenated column **must** be named "Features" for trainers to find it.

---

### 7. **LoadFromTextFile<T>() Is Case-Sensitive for Column Names**
```csharp
[Column("0")] public string VendorId;  // Exact column index
```
Column attributes map to CSV column **index** (0-based), not names.

---

### 8. **CreatePredictionEngine Is for Single Predictions Only**
```csharp
// ✓ Correct: One example at a time
var prediction = predictionEngine.Predict(singleInput);

// ✗ Wrong for batch predictions (use model.Transform() instead)
var predictions = model.Transform(batchData);
```

---

### 9. **RSquared ≠ Accuracy**
- **RSquared**: For regression (taxi fare). Range: 0–1
- **Accuracy**: For classification. Range: 0–1
- Exam may mix these up intentionally

---

### 10. **AutoML Explores Models, Doesn't Guarantee the Best One**
```
AutoML tested 42 models in 16 seconds.
Top 5:
  1. FastTreeRegression (RSquared 0.951)
  2. FastTreeTweedieRegression (0.944)
  ...
```
The best model found in 60 seconds may not be globally optimal; training time affects results.

---

## Practice MCQ (8 Questions)

### Q1 (Conceptual)
**What is the primary advantage of using ML.NET over Python/R for building machine learning models?**

A) ML.NET is free, while Python requires a license  
B) ML.NET integrates with familiar .NET tooling (C#, Visual Studio) and deploys models locally without cloud dependencies  
C) ML.NET supports more algorithms than Python  
D) ML.NET is faster than Python for all tasks  

**Correct Answer**: B  
**Explanation**: ML.NET's main value prop is integrating ML into .NET applications with familiar tools and local deployment. Python/R are free and support more algorithms.  
**Source**: Slides 6, 10; ML.NET_VS2022_SCRIPT

---

### Q2 (Code Pattern)
**Which method correctly loads a CSV file into ML.NET?**

A) `mlContext.Data.LoadFromCsv<TaxiTrip>(path)`  
B) `mlContext.Data.LoadFromTextFile<TaxiTrip>(path, hasHeader: true, separatorChar: ',')`  
C) `mlContext.Data.LoadFile<TaxiTrip>(path)`  
D) `new TextLoader(path).Load()`  

**Correct Answer**: B  
**Explanation**: `LoadFromTextFile<T>()` is the correct method. It requires hasHeader and separatorChar for CSV parsing.  
**Source**: ML.NET_VSCODE_SCRIPT (line 50)

---

### Q3 (Return Type)
**What does the `pipeline.Fit(trainingData)` method return?**

A) `IDataView`  
B) `ITransformer`  
C) `PredictionModel<TInput, TOutput>`  
D) `TrainingMetrics`  

**Correct Answer**: B  
**Explanation**: `Fit()` trains the pipeline and returns an `ITransformer` (trained model), not data or metrics.  
**Source**: ML.NET_VSCODE_SCRIPT (line 65)

---

### Q4 (Metric Interpretation)
**A regression model evaluates to RSquared = 0.89 and RMSE = 3.3. Which interpretation is correct?**

A) The model is 89% accurate at predicting, with an average error of 3.3%  
B) The model explains 89% of variance in the data, with average prediction error of $3.30  
C) The model has 89% precision and 3.3% recall  
D) The model needs retraining because RSquared is below 0.95  

**Correct Answer**: B  
**Explanation**: RSquared is variance explained (0–1 range). RMSE is in original units (dollars for taxi fare). RSquared 0.89 is actually good for real-world data.  
**Source**: ML.NET_VSCODE_SCRIPT (lines 82–89)

---

### Q5 (Pipeline Step)
**In the taxi fare pipeline, what is the purpose of the `OneHotEncoding` transform applied to VendorId, RateCode, and PaymentType?**

A) Normalize numeric values to [0, 1]  
B) Convert categorical text values (e.g., "CMT", "VTS") to numeric vectors (0s and 1s)  
C) Remove missing values  
D) Split the data into training and test sets  

**Correct Answer**: B  
**Explanation**: `OneHotEncoding` converts text categories into numeric binary vectors so trainers can process them. Also called "categorical encoding."  
**Source**: ML.NET_VSCODE_SCRIPT (lines 54–56)

---

### Q6 (Label vs. Features)
**Which of the following statements is FALSE about labels and features in ML.NET?**

A) The label is the column you want to predict  
B) Features are input columns used to make predictions  
C) All columns in the dataset should be used as features  
D) The label column must be copied to a column named "Label" before training  

**Correct Answer**: C  
**Explanation**: Not all columns are features. Example: TripTime should NOT be a feature because you predict fare before the trip ends (you won't know trip time). Time-dependent or label-dependent columns are excluded.  
**Source**: ML.NET_VSCODE_SCRIPT (line 26); ML.NET_VS2022_SCRIPT (line 37)

---

### Q7 (AutoML)
**What does the ML.NET CLI command `mlnet regression --dataset "taxi-fare-train.csv" --label-col 6 --train-time 60` do?**

A) Trains a single regression model on the taxi fare dataset in 60 seconds  
B) Explores multiple regression algorithms with different transforms and hyperparameters, then returns top 5 models ranked by metrics  
C) Requires the dataset to have exactly 6 columns  
D) Generates a Python script for training  

**Correct Answer**: B  
**Explanation**: AutoML is the "Auto" part—it automatically tries many combinations. `--train-time 60` sets the exploration window; more time = more models tested.  
**Source**: ML.NET_vscode_automl_SCRIPT (lines 11–34)

---

### Q8 (Persistence & Prediction)
**You trained a regression model and saved it to "model.zip". Later, you load it and want to predict the fare for a single taxi trip. Which code snippet is correct?**

A)
```csharp
var predictions = model.Transform(newData);
```

B)
```csharp
var predictionEngine = mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);
var prediction = predictionEngine.Predict(singleTrip);
```

C)
```csharp
var prediction = model.Predict(singleTrip);
```

D)
```csharp
var prediction = mlContext.Regression.Predict(model, singleTrip);
```

**Correct Answer**: B  
**Explanation**: For single predictions, create a `PredictionEngine` first, then call `Predict()`. Option A is for batch predictions. C and D are incorrect method signatures.  
**Source**: ML.NET_VSCODE_SCRIPT (lines 101–114)

---

## Summary: High-Yield Topics for 12 Marks

**Likely exam focus (ranked by marks)**:

1. **Pipeline workflow** (3–4 marks): Load → Transform → Concatenate → Train → Evaluate → Predict
2. **MLContext & method chains** (2–3 marks): `LoadFromTextFile()`, `OneHotEncoding()`, `Concatenate()`, `FastTree()`
3. **Fit() returns ITransformer** (1–2 marks): Common trap
4. **Metrics interpretation** (1–2 marks): RSquared, RMSE for regression
5. **Label vs. Features** (1 mark): Conceptual understanding
6. **AutoML CLI** (1 mark): `mlnet regression` command
7. **Model persistence** (1 mark): Save/Load methods

**Study strategy for 55–60% pass**:
- Memorize the 4-step code pattern: Load → Fit → Evaluate → Predict
- Know which method does what (CopyColumns vs. OneHotEncoding vs. Concatenate)
- Recognize Fit() returns ITransformer, not IDataView
- Understand RSquared (0–1, higher = better)
- Avoid the label/features confusion


---

## Quick Reference Cheat Sheet

### The 7-Step ML.NET Workflow
```csharp
1. MLContext mlContext = new MLContext(seed: 0);
2. IDataView data = mlContext.Data.LoadFromTextFile<T>(path, hasHeader: true, separatorChar: ',');
3. var pipeline = mlContext.Transforms.CopyColumns("Label", "FareAmount")
       .Append(mlContext.Transforms.Categorical.OneHotEncoding(...))
       .Append(mlContext.Transforms.Concatenate("Features", ...))
       .Append(mlContext.Regression.Trainers.FastTree());
4. ITransformer model = pipeline.Fit(data);
5. var metrics = mlContext.Regression.Evaluate(model.Transform(testData), "Label", "Score");
6. var engine = mlContext.Model.CreatePredictionEngine<TIn, TOut>(model);
7. var prediction = engine.Predict(newExample);
```

### Key Method Signatures
| Method | Returns | Use |
|--------|---------|-----|
| `LoadFromTextFile<T>()` | `IDataView` | Load CSV/text data |
| `Fit()` | `ITransformer` | Train pipeline |
| `Transform()` | `IDataView` | Apply model to data |
| `Evaluate()` | `RegressionMetrics` | Get quality metrics |
| `CreatePredictionEngine()` | `PredictionEngine<TIn, TOut>` | Single predictions |
| `Save()` | `void` | Persist model to disk |
| `Load()` | `ITransformer` | Load model from disk |

### Metric Quick Lookup
| Metric | Task | Good Range | Formula |
|--------|------|-----------|---------|
| RSquared | Regression | 0.7–1.0 | Variance explained |
| RMSE | Regression | Lower is better | √(sum of squared errors) |
| Accuracy | Classification | 0.7–1.0 | % correct predictions |
| Precision | Classification | 0.7–1.0 | True positives / All positives |
| Recall | Classification | 0.7–1.0 | True positives / Actual positives |

### Top 5 Exam Mistakes
1. Using `IDataView` as return type of `Fit()` ← Should be `ITransformer`
2. Forgetting `CopyColumns("Label", ...)` ← Trainers won't find label
3. Using wrong namespace (e.g., `BinaryClassification` for regression) ← Compilation error
4. Not excluding time-dependent columns from features ← Data leakage
5. Confusing `model.Transform()` with `predictionEngine.Predict()` ← Different purposes

