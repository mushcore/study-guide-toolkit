#:project ./MyLibrary/MyLibrary.csproj

using MyLibrary;

/*
Console.WriteLine($"Current directory: {Environment.CurrentDirectory}");
Console.WriteLine(new string('-', 40));
Console.WriteLine($"File path: {AppContext.GetData("EntryPointFilePath")}");
Console.WriteLine(new string('-', 40));
Console.WriteLine($"Base directory: {AppContext.BaseDirectory}");
*/

var person = new Person {
    FirstName = "John",
    LastName = "Doe",
    Email = "john.doe@example.com",
    DateOfBirth = new DateTime(1990, 1, 1)
};

Console.WriteLine($"Name: {person.FirstName} {person.LastName}");
Console.WriteLine($"Email: {person.Email}");
Console.WriteLine($"Date of Birth: {person.DateOfBirth.ToShortDateString()}");
