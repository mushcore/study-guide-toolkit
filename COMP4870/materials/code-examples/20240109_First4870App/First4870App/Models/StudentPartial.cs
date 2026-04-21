namespace First4870App.Models;

public partial class Student
{
    public override string ToString()
    {
        return $"{FirstName} {LastName} {School}";
    }
}
