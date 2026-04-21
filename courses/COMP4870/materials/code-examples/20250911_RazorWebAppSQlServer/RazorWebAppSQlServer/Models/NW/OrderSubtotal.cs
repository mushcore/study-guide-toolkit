using System;
using System.Collections.Generic;

namespace RazorWebAppSQlServer.Models.NW;

public partial class OrderSubtotal
{
    public int OrderId { get; set; }

    public decimal? Subtotal { get; set; }
}
