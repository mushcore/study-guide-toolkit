using System.ComponentModel.DataAnnotations;

namespace Sports.Models;

public class Team
{
    [Key]
    [MaxLength(30)]
    public string? TeamName { get; set; }
    public string? City { get; set; }

    public List<Player>? Players { get; set; }
}