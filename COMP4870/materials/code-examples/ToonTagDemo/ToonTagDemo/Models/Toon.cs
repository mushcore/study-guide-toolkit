using System;
using System.Text.Json.Serialization;

namespace ToonTagDemo.Models;

public class Toon {
    [JsonPropertyName("lastName")]
    public string? LastName { get; set; }
    
    [JsonPropertyName("firstName")]
    public string? FirstName { get; set; }
    
    [JsonPropertyName("pictureUrl")]
    public string? PictureUrl { get; set; }
}

