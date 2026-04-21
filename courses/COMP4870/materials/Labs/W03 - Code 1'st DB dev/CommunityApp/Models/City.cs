using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CommunityApp.Models;

public class City
{
    public int CityId { get; set; }
    [Display(Name = "City")]
    public string? CityName { get; set; }
    public int Population { get; set; }

    [Required]
    [Display(Name = "Province Code")]
    public string? ProvinceCode { get; set; }

    [ForeignKey("ProvinceCode")]
    public Province? Province { get; set; }
}
