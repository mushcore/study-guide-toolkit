using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HealthAPI.Models;

public class Medication
{
    [Key]
    public string? Name { get; set; }
    public string? Doses { get; set; }


    [ForeignKey("PatientId")]
    [JsonIgnore]
    public Patient? Patient { get; set; }
    public int PatientId { get; set; }
}

