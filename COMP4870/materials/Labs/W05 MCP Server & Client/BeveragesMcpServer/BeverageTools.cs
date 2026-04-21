using System.ComponentModel;
using System.Text.Json;
using ModelContextProtocol.Server;

[McpServerToolType]
public static class BeverageTools
{
    private static readonly BeverageService _beverageService = new BeverageService();

    [McpServerTool, Description("Get a list of all beverages and return as JSON array")]
    public static string GetBeveragesJson()
    {
        var task = _beverageService.GetBeveragesJson();
        return task.GetAwaiter().GetResult();
    }

    [McpServerTool, Description("Get beverages that contain sugar in their main ingredient and return as JSON")]
    public static string GetBeveragesContainingSugar()
    {
        var task = _beverageService.GetBeveragesContainingSugar();
        var beverages = task.GetAwaiter().GetResult();
        return JsonSerializer.Serialize(beverages, BeverageContext.Default.ListBeverage);
    }

    [McpServerTool, Description("Get beverages sorted by most calories (highest first) and return as JSON")]
    public static string GetBeveragesWithMostCalories()
    {
        var task = _beverageService.GetBeveragesWithMostCalories();
        var beverages = task.GetAwaiter().GetResult();
        return JsonSerializer.Serialize(beverages, BeverageContext.Default.ListBeverage);
    }

    [McpServerTool, Description("Get beverages that originate from a specific country or region and return as JSON")]
    public static string GetBeveragesByOrigin([Description("The origin country or region to filter beverages by")] string origin)
    {
        var task = _beverageService.GetBeveragesByOrigin(origin);
        var beverages = task.GetAwaiter().GetResult();
        return JsonSerializer.Serialize(beverages, BeverageContext.Default.ListBeverage);
    }

    [McpServerTool, Description("Get beverages that belong to a specific category/type (e.g. Tea, Coffee, Cocktail) and return as JSON")]
    public static string GetBeveragesByCategory([Description("The category or type of beverage to filter by")] string category)
    {
        var task = _beverageService.GetBeveragesByCategory(category);
        var beverages = task.GetAwaiter().GetResult();
        return JsonSerializer.Serialize(beverages, BeverageContext.Default.ListBeverage);
    }

    [McpServerTool, Description("Get a specific beverage by its name and return its details as JSON")]
    public static string GetBeverageByName([Description("The name of the beverage to look up")] string name)
    {
        var task = _beverageService.GetBeverageByName(name);
        var beverage = task.GetAwaiter().GetResult();
        if (beverage == null)
        {
            return "Beverage not found";
        }
        return JsonSerializer.Serialize(beverage, BeverageContext.Default.Beverage);
    }

    [McpServerTool, Description("Get count of total beverages")]
    public static int GetBeverageCount()
    {
        var task = _beverageService.GetBeverages();
        var beverages = task.GetAwaiter().GetResult();
        return beverages.Count;
    }
}
