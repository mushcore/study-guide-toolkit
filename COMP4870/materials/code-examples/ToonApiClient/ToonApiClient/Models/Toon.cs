using System.Text.Json.Serialization;

namespace ToonApiClient;

public class Toon
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("lastName")]
    public string? LastName { get; set; }

    [JsonPropertyName("firstName")]
    public string? FirstName { get; set; }

    [JsonPropertyName("occupation")]
    public string? Occupation { get; set; }

    [JsonPropertyName("gender")]
    public string? Gender { get; set; }

    [JsonPropertyName("pictureUrl")]
    public string? PictureUrl { get; set; }

    [JsonPropertyName("votes")]
    public int Votes { get; set; }

    public string FullName
    {
        get
        {
            return string.Format("{0} {1}", this.FirstName, this.LastName);
        }
    }

    public override string ToString()
    {
        return string.Format($"{Id}\t{FullName}\t{Occupation}\t{Gender}\t{PictureUrl}\t{Votes}");
    }
}