namespace First4870App.Models;

public class TemperatureHelper
{
    public static int F2C(string temperature)
    {
        int intTemperature = int.Parse(temperature);
        var celcius = ((intTemperature - 32)*5)/9;
        return celcius;
    }

    public static int C2F(string temperature)
    {
        int intTemperature = int.Parse(temperature);
        var fahrenheit = (intTemperature * 9) / 5 + 32;
        return fahrenheit;
    }
}
