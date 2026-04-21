using First4870App.Models;

Console.WriteLine("Enter temperature in Fahrenheit");
string? temperature = Console.ReadLine();

Console.WriteLine("temperature in Celsius = " + TemperatureHelper.F2C(temperature!));

Student student1 = new();
student1.FirstName = "John";
student1.LastName = "Doe";
student1.School = "BCIT";

Student student2 = new()
{
    FirstName = "Jane",
    LastName = "Smith",
    School = "SFU"
};

Console.WriteLine(student1);
Console.WriteLine(student2);
