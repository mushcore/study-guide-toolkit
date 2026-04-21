using System;

namespace AlphaLibrary;

public partial class Student : Person, IGradable    
{
    public string? Major { get; set; }

    public int GetGrade()
    {
        return 90;
    }

    public override string ToString()
    {
        string str = base.ToString();
        str += $"\nMajor: {Major}";
        str += $"\nMinor: {Minor}";

        return str;
    }
}
