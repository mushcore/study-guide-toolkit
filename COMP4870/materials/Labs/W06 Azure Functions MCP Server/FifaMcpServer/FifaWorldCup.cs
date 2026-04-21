using System.Text.Json.Serialization;

public class FifaWorldCup
{
    public int GameId { get; set; }
    public int Year { get; set; }
    public string? Gender { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Continent { get; set; }
    public string? Winner { get; set; }

    public override string ToString()
    {
        return $"ID: {GameId}, Year: {Year}, Gender: {Gender}, City: {City}, Country: {Country}, Continent: {Continent}, Winner: {Winner}";
    }
}

[JsonSerializable(typeof(List<FifaWorldCup>))]
[JsonSerializable(typeof(FifaWorldCup))]
internal sealed partial class FifaWorldCupContext : JsonSerializerContext { }
