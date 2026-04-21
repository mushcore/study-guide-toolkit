using System;

namespace AlphaLibrary;

public class Person
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }  

    public override string ToString()
    {
        string str = $"FirstName: {FirstName}";
        str += $"\nLastName: {LastName}";
        str += $"\nGender: {Gender}";

        return str;
    }
    
}
