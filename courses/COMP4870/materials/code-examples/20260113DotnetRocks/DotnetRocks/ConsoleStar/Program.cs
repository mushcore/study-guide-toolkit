using LibraryStar;

/*
Person person = new Person
{
    FirstName = "John",
    LastName = "Doe",
    DateOfBirth = new DateTime(1990, 1, 1)
};

Console.WriteLine(person);
*/

Console.WriteLine("Enter temperature in Celsius: ");
string? celsiusString = Console.ReadLine();

if (double.TryParse(celsiusString, out double celsius))
{
    double fahrenheit = TemperatureConversion.CelsiusToFahrenheit(celsius);
    Console.WriteLine($"{celsius}°C is {fahrenheit}°F");
}
else
{
    Console.WriteLine("Invalid input. Please enter a numeric value.");
}