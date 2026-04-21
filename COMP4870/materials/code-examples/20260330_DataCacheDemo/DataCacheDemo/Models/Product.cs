using System.Text.Json.Serialization;

namespace NorthwindBlazor.Models;
public partial class Product
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("quantityPerUnit")]
    public string? QuantityPerUnit { get; set; }

    [JsonPropertyName("unitPrice")]
    public decimal? UnitPrice { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = null!;
}
