namespace LibraryStar;

public class Person
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime DateOfBirth { get; set; }

    public override string ToString()
    {
        return $"{FirstName} {LastName}, born on {DateOfBirth:yyyy-MM-dd}";
    }
}
