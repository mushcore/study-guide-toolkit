using HelloLibrary;
using HelloLibrary.Temp;

// Person p1 = new ();

// p1.FirstName = "Fred";
// p1.LastName = "Flintstone";
// p1.DateOfBirth = new DateTime(1970, 1, 1);

// Person p1 = new ()
// {
//     FirstName = "Fred",
//     LastName = "Flintstone",
//     DateOfBirth = new DateTime(1970, 1, 1)
// };

// Console.WriteLine(p1);

Console.WriteLine("Enter temperature in Celsius:");
var temperatureInCelsius = Console.ReadLine();
if (double.TryParse(temperatureInCelsius, out double celsius))
{
    var fahrenheit = Conversions.C2F(celsius);
    Console.WriteLine($"{celsius} °C = {fahrenheit} °F");
}
else
{
    Console.WriteLine("Invalid temperature input.");
}