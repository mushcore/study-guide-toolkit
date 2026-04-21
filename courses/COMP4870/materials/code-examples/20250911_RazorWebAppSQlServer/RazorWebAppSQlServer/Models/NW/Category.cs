using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RazorWebAppSQlServer.Models.NW;

public partial class Category
{
    public int CategoryId { get; set; }

    [Display(Name = "Category")]
    [MaxLength(15, ErrorMessage = "Category Name cannot exceed 15 characters.")]
    [MinLength(3, ErrorMessage = "Category Name must be at least 3 characters long.")]
    public string CategoryName { get; set; } = null!;

    [Required]
    public string? Description { get; set; }

    public byte[]? Picture { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
