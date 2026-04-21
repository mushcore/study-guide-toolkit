<!-- converted from ML.NET_VS2022_SCRIPT.docx -->

ML.NET in Visual Studio 2022 with Builder


Download datasets from:
- https://github.com/dotnet/machinelearning/blob/master/test/data/taxi-fare-train.csv
- https://github.com/dotnet/machinelearning/blob/master/test/data/taxi-fare-test.csv
Features are columns that are useful for making predictions. The label column it the one we wish to make predictions for
Open taxi-fare-train.csv and look at the column headers in the first row. Understand which columns are features and which one is the label.
In Visual Studio 2022, create a new “ASP.NET Core Web App (Model-View-Controller)”.






Name your project TaxiFarePredictionWeb:

Choose the “Web Application (Model-View-Controller)” template:

Click on Create.
Create Data folder, then place contents of taxi-fare-data-sets.zip (taxi-fare-test.csv and taxi-fare-train.csv) inside it.
Right-click on TaxiFarePredictionWeb project node >> Add >> Machine Learning Model:

Name the file TaxiFareModel.mbconfig:

Next, you will be presented with a variety of algorithms. Choose “Value Prediction”:

On the next page, choose Local(CPU):

Next, navigate to the file in the Data folder named taxi-fare-train.csv.
The label column we want to predict is: fare_amount

Click on “Advanced data options…”.

Input columns (Features) are other columns, except trip_time_in_secs and fare_amount. fare_amount is the column we are predicting and trip_time_in_secs can be ignored because it does impact fare amount because it depends on traffic.
Click on Next step button at the bottom.
On the train page, keep “Time to train (seconds)” at 600 seconds (I.E. 10 minutes). The engine needs some time to train and come up with a model. Click on “Start training” button.

Go get yourself a biiiiig cup of coffee while the model is being trained on the data that is available. When training is completed, it will suggest the best algorithm for the job (FastTreeTweedieRegression) and an average accuracy rate (0.93):

Click on the Next step button. You are then given an interface to help you make predictions. It prefills the fields with the first row of the dataset.

Click on the Predict button. The predicted fare amount is 14.93.

Click “Next step” button to find the code you can use to consume the model.

This page tells you that you can copy the code into your app, or create a console app, or create a Web API app.
Modify your HomeControler Index() action method so it looks like this:
public IActionResult Index() {
//Load sample data
var sampleData = new TaxiFareModel.ModelInput() {
Vendor_id = @"CMT",
Rate_code = 1F,
Passenger_count = 1F,
Trip_time_in_secs = 1271F,
Trip_distance = 3.8F,
Payment_type = @"CRD",
};

//Load model and predict output
var result = TaxiFareModel.Predict(sampleData);

ViewBag.Result = result.Score;

return View();
}
Change your Views/Home/Index.cshtml so that it looks like this:
@{
ViewData["Title"] = "Home Page";
}

<h4>@ViewBag.Result</h4>
Run the web app and the output will look like this:

Highlight the TaxiFarePredictionML.ConsoleApp project so that it appears darker than all the other projects. Click on the green button to run your application in debug mode.

The output looks like this:

The actual amount is $17.5 and the predicted amount is $14.93.
Inspect the code in the Console app Program.cs to understand how it is working. It is once again using the first row in the training data.
Let’s next use our model in our ASP.NET application. Edit HomeController.cs. Add the following action method to HomeController:
[HttpPost]
public ActionResult Index(ModelInput input) {
ModelOutput prediction = ConsumeModel.Predict(input);
ViewBag.Result = prediction;
return View();
}
Replace the contents of Views/Home/Index.cshtml with the following:
@model TaxiFarePredictionML.Model.ModelInput
@using TaxiFarePredictionML.Model

@{
ViewData["Title"] = "Predict";
}

<h1>@ViewData["Title"]</h1>
<h2>In ASP.NET Core using ML.NET</h2>
<hr />

@if (ViewBag.Result != null)
{
<div class="row">
<div class="col-md-6">
<h4>Prediction: @ViewBag.Result.Score</h4>
</div>
</div>
<hr />
}

<div class="row">
<div class="col-md-12">
<form asp-action="Index">
<div asp-validation-summary="ModelOnly" class="text-danger"></div>
<div class="row">
<div class="form-group col-md-2">
<label asp-for="Vendor_id" class="control-label"></label>
<input asp-for="Vendor_id" class="form-control" />
<span asp-validation-for="Vendor_id" class="text-danger"></span>
</div>
<div class="form-group col-md-2">
<label asp-for="Rate_code" class="control-label"></label>
<input asp-for="Rate_code" class="form-control" />
<span asp-validation-for="Rate_code" class="text-danger"></span>
</div>
<div class="form-group col-md-2">
<label asp-for="Passenger_count" class="control-label"></label>
<input asp-for="Passenger_count" class="form-control" />
<span asp-validation-for="Passenger_count" class="text-danger"></span>
</div>
<div class="form-group col-md-2">
<label asp-for="Trip_distance" class="control-label"></label>
<input asp-for="Trip_distance" class="form-control" />
<span asp-validation-for="Trip_distance" class="text-danger"></span>
</div>
<div class="form-group col-md-2">
<label asp-for="Payment_type" class="control-label"></label>
<input asp-for="Payment_type" class="form-control" />
<span asp-validation-for="Payment_type" class="text-danger"></span>
</div>
<div class="form-group col-md-2">
<input type="submit" value="Predict" class="btn btn-primary" />
</div>
</div>
</form>
</div>

</div>

@section Scripts {
@{ await Html.RenderPartialAsync("_ValidationScriptsPartial");}
}
Let us use the first row of data for testing our web app:

Run the application.

The predicted amount is exactly what we got when we run the console application.

| vendor_id | The ID of the taxi vendor is a feature. |
| --- | --- |
| rate_code | The rate type of the taxi trip is a feature. |
| passenger_count | The number of passengers on the trip is a feature. |
| trip_time_in_secs | The amount of time the trip took. You want to predict the fare of the trip before the trip is completed. At that moment you don't know how long the trip would take. Thus, the trip time is not a feature and you'll exclude this column from the model. |
| trip_distance | The distance of the trip is a feature. |
| payment_type | The payment method (cash or credit card) is a feature. |
| fare_amount | The total taxi fare paid is the label. |
| vendor_id | CMT |
| --- | --- |
| rate_code | 1 |
| passenger_count | 1 |
| trip_distance | 3.8 |
| payment_type | CRD |
| fare_amount | 17.5 |