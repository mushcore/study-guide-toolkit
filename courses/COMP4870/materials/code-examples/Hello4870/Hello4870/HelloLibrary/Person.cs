using System;

namespace HelloLibrary;

public class Person
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime DateOfBirth { get; set; }

    public override string ToString()
    {
        return $"{FirstName} {LastName} was born on {DateOfBirth:d}";
    }
}