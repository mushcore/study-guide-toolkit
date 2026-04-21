using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

namespace Sports.Models;

public class Player
{
    public int PlayerId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Position { get; set; }

    [Required]
    public string? TeamName { get; set; }

    [ForeignKey("TeamName")]
    public Team? Team { get; set; }
}