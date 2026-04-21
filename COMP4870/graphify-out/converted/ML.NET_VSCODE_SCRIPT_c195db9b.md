<!-- converted from ML.NET_VSCODE_SCRIPT.docx -->

ML.NET
Create a console all with the following terminal window commands.
dotnet new console -o TaxiFarePrediction
cd TaxiFarePrediction
mkdir Data
mkdir Models
dotnet add package Microsoft.ML
dotnet add package Microsoft.ML.FastTree
Create directory named Data in the project
Download datasets and put the .csv files in the Data directory:
https://github.com/dotnet/machinelearning/blob/master/test/data/taxi-fare-train.csv
https://github.com/dotnet/machinelearning/blob/master/test/data/taxi-fare-test.csv
Add this section to the bottom of TaxiFarePrediction.csproj just before </Project>:
<ItemGroup>
<None Update="Data\taxi-fare-test.csv">
<CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
</None>
<None Update="Data\taxi-fare-train.csv">
<CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
</None>
</ItemGroup>
The above code ensure that the data files get copied to bin/Debug/net6.0 folder when the application is run.
### Inspecting the data
The label is the identifier of the column you want to predict. The identified features are used to predict the label.
Open taxi-fare-train.csv and look at the column headers in the first row. Understand which columns are features and which one is the label.


Add to the models folder these classes named TaxiTrip and TaxiTripFarePrediction:

### Define data and model paths
Add the following additional using statements to the top of Program.cs:
using System.IO;
using Microsoft.ML;
Add following code below the using statements in Program.cs to specify data paths:
string _trainDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "taxi-fare-train.csv");
string _testDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "taxi-fare-test.csv");
string _modelPath = Path.Combine(Environment.CurrentDirectory, "Data", "Model.zip");
MLContext? mlContext;
Add the following below the above code:
mlContext = new MLContext(seed: 0);
var model = Train(mlContext, _trainDataPath);
If a fixed seed is provided by seed, MLContext environment becomes deterministic, meaning that the results are repeatable and will remain the same across multiple runs.
Add a blank Train() method:
ITransformer Train(MLContext mlContext, string dataPath) {

}
Load the test data (put into Train() method):
IDataView dataView = mlContext.Data.LoadFromTextFile<TaxiTrip>(dataPath, hasHeader: true, separatorChar: ',');
Instantiate a learning pipeline and append the FareAmount column into the Label column:
var pipeline = mlContext.Transforms.CopyColumns(outputColumnName: "Label", inputColumnName: "FareAmount")
Transform categorical data (VendorId, RateCode, and PaymentType) values into numbers:
.Append(mlContext.Transforms.Categorical.OneHotEncoding(outputColumnName: "VendorIdEncoded", inputColumnName: "VendorId"))
.Append(mlContext.Transforms.Categorical.OneHotEncoding(outputColumnName: "RateCodeEncoded", inputColumnName: "RateCode"))
.Append(mlContext.Transforms.Categorical.OneHotEncoding(outputColumnName: "PaymentTypeEncoded", inputColumnName: "PaymentType"))
Combine all of the feature columns into the Features column using the ColumnConcatenator transformation class.
.Append(mlContext.Transforms.Concatenate("Features", "VendorIdEncoded", "RateCodeEncoded", "PassengerCount", "TripDistance", "PaymentTypeEncoded"))
### Choose a learning algorithm
The learner trains the model. You chose a regression task for this problem, so you use a FastTreeRegressor learner, which is one of the regression learners provided by ML.NET.
Add the following code into the Train method following the data processing code added in the previous step:
.Append(mlContext.Regression.Trainers.FastTree());
### Train the model
Train the model and save the model. Append the following code to Train();
var model = pipeline.Fit(dataView);
// Save model
mlContext.Model.Save(model, dataView.Schema, _modelPath);
return model;
### Evaluate model
Evaluation is the process of checking how well the model predicts label values. Let’s see how well the model performs on test data.
Add the following code beneath the call to the Train() method:
Evaluate(mlContext, model);
Add the following empty Evaluate() method to Program.cs:
void Evaluate(MLContext mlContext, ITransformer model)
{

}
Add the following code into the Evaluate() method to load the test data:
IDataView dataView = mlContext.Data.LoadFromTextFile<TaxiTrip>(_testDataPath, hasHeader: true, separatorChar: ',');
var predictions = model.Transform(dataView);
Add the following code to evaluate the model and produce the evaluation metrics:
var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");
RSquared takes values between 0 and 1. The closer its value is to 1, the better the model is. Add the following code into the Evaluate() method to display the RSquared value:
Console.WriteLine();
Console.WriteLine($"*************************************************");
Console.WriteLine($"*       Model quality metrics evaluation         ");
Console.WriteLine($"*------------------------------------------------");
Console.WriteLine($"*       RSquared Score:      {metrics.RSquared:0.##}");
Console.WriteLine($"*       Root Mean Squared Error:      {metrics.RootMeanSquaredError:#.##}");

Run the application. What you will see is how reliable the model that you created is when compared to real test data. At this stage we are not making any predictions.

*************************************************
*       Model quality metrics evaluation
*------------------------------------------------
*       RSquared Score:      0.89
*       Root Mean Squared Error:      3.3

### Use model for predictions
Add the following method to test a prediction:
void TestSinglePrediction(MLContext mlContext, ITransformer model) {
var predictionFunction = mlContext.Model.CreatePredictionEngine<TaxiTrip, TaxiTripFarePrediction>(model);

var taxiTripSample = new TaxiTrip()   {
VendorId = "VTS",
RateCode = "1",
PassengerCount = 1,
TripTime = 1140,
TripDistance = 3.75f,
PaymentType = "CRD",
FareAmount = 0 // To predict. Actual/Observed = 15.5
};

var prediction = predictionFunction.Predict(taxiTripSample);

Console.WriteLine($"**********************************************************************");
Console.WriteLine($"Predicted fare: {prediction.FareAmount:0.####}, actual fare: 15.5");
Console.WriteLine($"**********************************************************************");
}
To predict the fare of a specified trip, add the following code below the call top the Evaluate() method:
TestSinglePrediction(mlContext, model);
Run the application. Unlike the last time the application ran, this time we will see a prediction based on provided input.


*************************************************
*       Model quality metrics evaluation
*------------------------------------------------
*       RSquared Score:      0.89
*       Root Mean Squared Error:      3.3
**********************************************************************
Predicted fare: 14.6362, actual fare: 15.5
**********************************************************************
### Consume Model
Let us use the model that was saved in bin/Debug/netcoreapp3.1/Data directory/Model.zip.
Add a method LoadAndUseModel() method to Program.cs:
void LoadAndUseModel() {
mlContext = new MLContext(seed: 0);

//Define DataViewSchema for data preparation pipeline and trained model
DataViewSchema modelSchema;

// Load trained model
ITransformer trainedModel = mlContext.Model.Load(_modelPath, out modelSchema);

TestSinglePrediction(mlContext, trainedModel);
}
Comment out the following code:
// mlContext = new MLContext(seed: 0);
// var model = Train(mlContext, _trainDataPath);
// Evaluate(mlContext, model);
// TestSinglePrediction(mlContext, model);
Make this method call instead of the code that was commented out:
LoadAndUseModel();
Run the application. You should get the same predicted result.
**********************************************************************
Predicted fare: 14.6362, actual fare: 15.5
**********************************************************************
References:
https://docs.microsoft.com/en-us/dotnet/machine-learning/tutorials/predict-prices
| vendor_id | The ID of the taxi vendor is a feature. |
| --- | --- |
| rate_code | The rate type of the taxi trip is a feature. |
| passenger_count | The number of passengers on the trip is a feature. |
| trip_time_in_secs | The amount of time the trip took. You want to predict the fare of the trip before the trip is completed. At that moment you don't know how long the trip would take. Thus, the trip time is not a feature and you'll exclude this column from the model. |
| trip_distance | The distance of the trip is a feature. |
| payment_type | The payment method (cash or credit card) is a feature. |
| fare_amount | The total taxi fare paid is the label. |