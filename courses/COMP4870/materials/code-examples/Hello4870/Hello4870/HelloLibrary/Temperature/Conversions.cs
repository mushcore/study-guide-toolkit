using System;

namespace HelloLibrary.Temp;

public class Conversions
{
    public static double C2F(double celsius)
    {
        return (celsius * 9 / 5) + 32;
    }

    public static double F2C(double fahrenheit)
    {
        return (fahrenheit - 32) * 5 / 9;
    }
}
