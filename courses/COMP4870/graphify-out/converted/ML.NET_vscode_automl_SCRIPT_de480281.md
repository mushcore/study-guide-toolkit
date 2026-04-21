<!-- converted from ML.NET_vscode_automl_SCRIPT.docx -->

AutoML.NET
Install the ML.NET CLI
Create a folder to create our app:
mkdir TaxiFareAutoML
cd TaxiFareAutoML
There are several ML scenarios that are supported by the ML.NET CLI:
Copy taxi-fare-train.csv into the newly created TaxiFareAutoML folder.
Execute the following terminal window command inside TaxifareAultML folder:
mlnet regression --dataset "taxi-fare-train.csv" --label-col 6 --has-header true --name TaxiFareModel  --train-time 60

## What do these commands mean?
The mlnet regression command runs ML.NET with AutoML to explore many iterations of regression models in the given amount of train time with varying combinations of data transformations, algorithms, and algorithm options and then chooses the highest performing model.
## Result
------------------------------------------------------------------------------------------------------------------
|                                                     Summary                                                    |
------------------------------------------------------------------------------------------------------------------
|ML Task: Regression                                                                                             |
|Dataset: /Users/medhatelmasry/_PlayGround/4870/TaxiFareAutoML/taxi-fare-train.csv                               |
|Label : fare_amount                                                                                             |
|Total experiment time : 16.251 Secs                                                                             |
|Total number of models explored: 42                                                                             |
------------------------------------------------------------------------------------------------------------------

|                                              Top 5 models explored                                             |
------------------------------------------------------------------------------------------------------------------
|     Trainer                             RSquared Absolute-loss Squared-loss RMS-loss  Duration #Iteration      |
|24   FastTreeRegression                    0.9510          0.44         4.35     2.08       5.9         24      |
|22   FastTreeTweedieRegression             0.9444          0.48         4.93     2.22       0.1         22      |
|20   FastTreeRegression                    0.9419          0.74         5.15     2.27       0.1         20      |
|26   FastTreeTweedieRegression             0.9402          0.66         5.30     2.30       0.2         26      |
|5    FastForestRegression                  0.9370          0.80         5.58     2.36       0.1          5      |
------------------------------------------------------------------------------------------------------------------
save TaxiFareModel.mbconfig to /Users/medhatelmasry/_PlayGround/4870/TaxiFareAutoML/TaxiFareModel
Generating a console project for the best pipeline at location : /Users/medhatelmasry/_PlayGround/4870/TaxiFareAutoML/TaxiFareModel
## Running the evaluation app:
cd TaxiFareModel
dotnet run
## Result
Vendor_id: CMT
Rate_code: 1
Passenger_count: 1
Trip_time_in_secs: 1271
Trip_distance: 3.8
Payment_type: CRD
Fare_amount: 17.5


Predicted Fare_amount: 16.968948

| mac | dotnet tool install -g mlnet-osx-arm64 |
| --- | --- |
| mac | dotnet tool install -g mlnet-osx-x64 |
| linux | dotnet tool install -g mlnet-linux-x64 |
| windows | dotnet tool install -g mlnet-win-x64 |
| Classification | predict which category data belongs in (for example, analyzing sentiment of customer reviews as either positive or negative) |
| --- | --- |
| Image classification | predict which category an image belongs to (for example, predicting if an image is of a cat or a dog) |
| Regression (for example, value prediction) | numeric value (for example, predicting house price) |
| Forecasting | forecast future values in a time-series (for example, forecast quarterly sales) |
| Recommendation | recommend items to users based on historical ratings (for example, product recommendation) |
| --dataset | Choose taxi-fare-train.csv as the dataset |
| --- | --- |
| --label-col | specify the target column you want to predict (or the Label). In this case, you want to predict the fare_amount in the seventh column (zero-indexed columns means this is column "6") |
| --has-header | specify if the dataset has a header. In this case, the dataset has a header, so it's true |
| --name | forecast future values in a time-series (for example, forecast quarterly sales) |
| --train-time | specify the amount of time you'd like the ML.NET CLI to explore different models. In this case, 60 seconds (you can try increasing this number if no models are found after training). Note that for larger datasets, you should set a longer training time. |