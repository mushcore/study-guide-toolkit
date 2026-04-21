using System;
using System.Collections.Generic;

namespace MvcWithNW.Models.NWpublic;

public partial class CurrentProductList
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;
}
