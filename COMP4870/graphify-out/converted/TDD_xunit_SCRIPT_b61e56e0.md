<!-- converted from TDD_xunit_SCRIPT.docx -->

Test Drive Development (TDD) with xUnit
We will create test cases for a C# application named FizzBuzz. Here’s how it goes. If a number is divisible by 3 then you will call out Fizz. If a number is divisible by 5 then you will call out Buzz. If a number is divisible by 3 and 5 then you will call out FizzBuzz. Otherwise, you will just call out the number itself.
Here are some examples:
The above table would represent our four test cases.
Create library and test apps with the following directory and file structure:

## Creating the business logic project
mkdir OhMyTDD
cd OhMyTDD
dotnet new sln
dotnet new classlib -n FizzBuzzLibrary
dotnet sln add ./FizzBuzzLibrary/FizzBuzzLibrary.csproj
dotnet new xunit -n FizzBuzzTests
dotnet sln add ./FizzBuzzTests/FizzBuzzTests.csproj
dotnet add ./FizzBuzzTests/FizzBuzzTests.csproj reference ./FizzBuzzLibrary/FizzBuzzLibrary.csproj
In the FizzBuzzLibrary project, rename Class1.cs to FizzBuzz.cs. Open FizzBuzzLibrary/FizzBuzz.cs in the editor and change the class name from Class1 to FizzBuzz.
In the FizzBuzzTests project, rename UnitTest1.cs to FizzBuzzTests.cs. Open FizzBuzzTests/FizzBuzzTests.cs in an editor and change the class name from UnitTest1 to FizzBuzzTests.

Open the FizzBuzzSolution directory in Visual Studio Code. This is what your solution will look like:

Open the FizzBuzzLibrary/FizzBuzz.cs file in your editor and add the following GetResult() method:
public string GetResult(int nmbr) {
string result = "";
return result;
}
You will notice that above method is destined to fail. This is the fundamental principal of test-driven development (TDD) whereby methods are built to fail.
We should next create our test cases. Edit FizzBuzzTests/FizzBuzzTests.cs and replace the Test1() method with the following four test cases:
[Fact]
public void Given2Result2() {
FizzBuzz fb = new FizzBuzz();
Assert.Equal("2", fb.GetResult(2));
}

[Fact]
public void Given3Result() {
FizzBuzz fb = new FizzBuzz();
Assert.Equal("Fizz", fb.GetResult(3));
}

[Fact]
public void Given4Result4() {
FizzBuzz fb = new FizzBuzz();
Assert.Equal("4", fb.GetResult(4));
}

[Fact]
public void Given5ResultBuzz() {
FizzBuzz fb = new FizzBuzz();
Assert.Equal("Buzz", fb.GetResult(5));
}

[Fact]
public void Given15ResultFizzBuzz() {
FizzBuzz fb = new FizzBuzz();
Assert.Equal("FizzBuzz", fb.GetResult(15));
}
We have developed our preliminary business logic and test cases. In addition, we referenced our business logic application into our test cases application. Now let us test things out.
It is now time to run the actual tests. This is done by executing the following command from within the root FizzBuzzTests directory that watches on any file changes in the solution:
dotnet test
The test execution shows the following result:
Microsoft (R) Test Execution Command Line Tool Version 15.6.0-preview-20180109-01
Copyright (c) Microsoft Corporation.  All rights reserved.

Starting test execution, please wait...
[xUnit.net 00:00:01.1703586]   Discovering: FizzBuzzTests
[xUnit.net 00:00:01.3287105]   Discovered:  FizzBuzzTests
[xUnit.net 00:00:01.3444865]   Starting:    FizzBuzzTests
[xUnit.net 00:00:01.8225638]     FizzBuzzTests.FizzBuzzTests.Given15Result12fizz4buzzfizz78fizzbuzz11fizzfizz1314fizzbuzz [FAIL]
[xUnit.net 00:00:01.8269525]       Assert.Equal() Failure
[xUnit.net 00:00:01.8272271]                 (pos 0)
[xUnit.net 00:00:01.8273310]       Expected: 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fiz···
[xUnit.net 00:00:01.8274143]       Actual:
[xUnit.net 00:00:01.8274791]                 (pos 0)
[xUnit.net 00:00:01.8307060]       Stack Trace:
[xUnit.net 00:00:01.8346076]         E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs(30,0): at FizzBuzzTests.FizzBuzzTests.Given15Result12fizz4buzzfizz78fizzbuzz11fizzfizz1314fizzbuzz()
[xUnit.net 00:00:01.8691384]     FizzBuzzTests.FizzBuzzTests.Given4Result12fizz4 [FAIL]
[xUnit.net 00:00:01.8693984]       Assert.Equal() Failure
[xUnit.net 00:00:01.8695058]                 (pos 0)
[xUnit.net 00:00:01.8695785]       Expected: 1 2 Fizz 4
[xUnit.net 00:00:01.8696469]       Actual:
[xUnit.net 00:00:01.8697385]                 (pos 0)
[xUnit.net 00:00:01.8698215]       Stack Trace:
[xUnit.net 00:00:01.8699329]         E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs(18,0): at FizzBuzzTests.FizzBuzzTests.Given4Result12fizz4()
[xUnit.net 00:00:01.8711086]     FizzBuzzTests.FizzBuzzTests.Given5Result12fizz4buzz [FAIL]
[xUnit.net 00:00:01.8712943]       Assert.Equal() Failure
[xUnit.net 00:00:01.8718043]                 (pos 0)
[xUnit.net 00:00:01.8718944]       Expected: 1 2 Fizz 4 Buzz
[xUnit.net 00:00:01.8719635]       Actual:
[xUnit.net 00:00:01.8720255]                 (pos 0)
[xUnit.net 00:00:01.8720994]       Stack Trace:
[xUnit.net 00:00:01.8722136]         E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs(24,0): at FizzBuzzTests.FizzBuzzTests.Given5Result12fizz4buzz()
[xUnit.net 00:00:01.8725241]     FizzBuzzTests.FizzBuzzTests.Given2Result12 [FAIL]
[xUnit.net 00:00:01.8726632]       Assert.Equal() Failure
[xUnit.net 00:00:01.8727430]                 (pos 0)
[xUnit.net 00:00:01.8730096]       Expected: 1 2
[xUnit.net 00:00:01.8731289]       Actual:
[xUnit.net 00:00:01.8732020]                 (pos 0)
[xUnit.net 00:00:01.8732787]       Stack Trace:
[xUnit.net 00:00:01.8733830]         E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs(12,0): at FizzBuzzTests.FizzBuzzTests.Given2Result12()
[xUnit.net 00:00:01.8817472]   Finished:    FizzBuzzTests
Failed   FizzBuzzTests.FizzBuzzTests.Given15Result12fizz4buzzfizz78fizzbuzz11fizzfizz1314fizzbuzz
Error Message:
Assert.Equal() Failure
(pos 0)
Expected: 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fiz···
Actual:
(pos 0)
Stack Trace:
at FizzBuzzTests.FizzBuzzTests.Given15Result12fizz4buzzfizz78fizzbuzz11fizzfizz1314fizzbuzz() in E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs:line 30
Failed   FizzBuzzTests.FizzBuzzTests.Given4Result12fizz4
Error Message:
Assert.Equal() Failure
(pos 0)
Expected: 1 2 Fizz 4
Actual:
(pos 0)
Stack Trace:
at FizzBuzzTests.FizzBuzzTests.Given4Result12fizz4() in E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs:line 18
Failed   FizzBuzzTests.FizzBuzzTests.Given5Result12fizz4buzz
Error Message:
Assert.Equal() Failure
(pos 0)
Expected: 1 2 Fizz 4 Buzz
Actual:
(pos 0)
Stack Trace:
at FizzBuzzTests.FizzBuzzTests.Given5Result12fizz4buzz() in E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs:line 24
Failed   FizzBuzzTests.FizzBuzzTests.Given2Result12
Error Message:
Assert.Equal() Failure
(pos 0)
Expected: 1 2
Actual:
(pos 0)
Stack Trace:
at FizzBuzzTests.FizzBuzzTests.Given2Result12() in E:\_xunit\FizzBuzzSystem\FizzBuzzTests\FizzBuzzTests.cs:line 12

Total tests: 4. Passed: 0. Failed: 4. Skipped: 0.
Test Run Failed.
Test execution time: 3.7357 Seconds
Let’s fix all four failed tests by fixing our GetResult() method in FizzBuzzLibrary/FizzBuzz.cs. Replace the GetResult() method with the following code:
public string GetResult(int nmbr) {
string result = "";

for (int ndx=1; ndx<nmbr+1; ndx++) {
if (ndx % 3 == 0 && ndx % 5 ==0)
result = "FizzBuzz";
else if (ndx % 5 ==0 )
result = "Buzz";
else if (ndx % 3 ==0 )
result = "Fizz";
else
result = ndx.ToString();
}

return result;
}


Run your tests again. This should be the outcome:

Test run for E:\_xunit\FizzBuzzSystem\FizzBuzzTests\bin\Debug\netcoreapp2.0\FizzBuzzTests.dll(.NETCoreApp,Version=v2.0)
Microsoft (R) Test Execution Command Line Tool Version 15.6.0-preview-20180109-01
Copyright (c) Microsoft Corporation.  All rights reserved.

Starting test execution, please wait...
[xUnit.net 00:00:01.3551923]   Discovering: FizzBuzzTests
[xUnit.net 00:00:01.5464474]   Discovered:  FizzBuzzTests
[xUnit.net 00:00:01.5683263]   Starting:    FizzBuzzTests
[xUnit.net 00:00:02.0466062]   Finished:    FizzBuzzTests

Total tests: 4. Passed: 4. Failed: 0. Skipped: 0.
Test Run Successful.
Test execution time: 3.6691 Seconds
Rejoice. All your tests have successfully passed.
Of course, test cases are by no means extensive, we may need to add the following test case that ensures that very large numbers (Example: greater than 1000) throw an exception:
[Fact]
public void GivenMoreThan1000ThrowException() {
FizzBuzz fb = new FizzBuzz();
Action act = () => fb.GetResult(1001);
Assert.Throws<Exception>(act);
}
To fix this broken test, add this at the very top of the GetResult() methos:
if (nmbr > 1000)
throw new Exception("Number must be less than or equal to 1000");
## ASP.NET MVC
### Controller
public IActionResult Index(int id) {
if (id != 0) {
FizzBuzz fb = new FizzBuzz();
ViewBag.Result = fb.GetResult(id);
}
return View();
}
### View
<h1>@ViewBag.Result</h1>
# Tests with VS Code
dotnet new webapi -o LoveAPI
Make the WeatherForecast record in ApiService Program.cs public
Add a reference from Tests into ApiService project
Add a new MSTest class named WeatherForecastTest in the Tests project
Delete the inside of the newly created test class
Highlight the WeatherForecast record in ApiService and click on GitHub Copilot Chat. Type in the following into the chat
@workspace /tests create unit tests using MSTest
Copy the recommended TestMethod tests into the test class.


| 2 | 2 |
| --- | --- |
| 3 | FizzBuzz |
| 4 | 4 |
| 5 | Buzz |
| 15 | FizzBuzz |
| -19 | Throw exception that “number cannot be negative” |
| 1001 | Throw exception that “number cannot exceed 1000” |