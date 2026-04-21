using System.ComponentModel.DataAnnotations;

namespace RazorInternational.Models;

public class Contact
{
    [Required(ErrorMessage = "Email is certainly required")]
    [EmailAddress(ErrorMessage = "Email is not valid")]
    [Display(Name = "Your Email")]
    public string? Email { get; set; }
}
