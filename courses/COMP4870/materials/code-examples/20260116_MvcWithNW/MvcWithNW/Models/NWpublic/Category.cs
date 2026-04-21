using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MvcWithNW.Models.NWpublic;

public partial class Category
{
    [Display(Name = "ID")]
    public int CategoryId { get; set; }

    [Display(Name = "Category")]
    public string CategoryName { get; set; } = null!;

    [Required (ErrorMessage = "Description is mandatory")]
    [MaxLength(80)]
    [MinLength(2)]
    [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Description can only contain letters and spaces")]
    public string? Description { get; set; }

    public byte[]? Picture { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
