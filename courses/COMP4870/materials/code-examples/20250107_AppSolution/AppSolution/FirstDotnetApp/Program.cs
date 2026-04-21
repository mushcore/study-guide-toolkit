// Person p = new Person();
// p.FirstName = "John";
// p.LastName = "Doe";
// p.Gender = "Male";

using AlphaLibrary;

Person p = new()
{
    FirstName = "Jane",
    LastName = "Doe",
    Gender = "Female"
};

Console.WriteLine(p);

Student s = new()
{
    FirstName = "Alex",
    LastName = "Chung",
    Gender = "Male",
    Major = "Computer Science",
    Minor = "Mathematics"
};

Console.WriteLine(s);