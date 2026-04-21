using System.Text.Json.Serialization;

public class Beverage
{
    public int BeverageId { get; set; }
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? MainIngredient { get; set; }
    public string? Origin { get; set; }
    public int CaloriesPerServing { get; set; }

    public override string ToString()
    {
        return $"ID: {BeverageId}, Name: {Name}, Type: {Type}, Main Ingredient: {MainIngredient}, Origin: {Origin}, Calories: {CaloriesPerServing}";
    }
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(List<Beverage>))]
[JsonSerializable(typeof(Beverage))]
internal sealed partial class BeverageContext : JsonSerializerContext { }
