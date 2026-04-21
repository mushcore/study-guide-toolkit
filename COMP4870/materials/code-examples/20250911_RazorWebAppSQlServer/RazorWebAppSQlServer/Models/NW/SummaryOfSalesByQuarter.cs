using System;
using System.Collections.Generic;

namespace RazorWebAppSQlServer.Models.NW;

public partial class SummaryOfSalesByQuarter
{
    public DateTime? ShippedDate { get; set; }

    public int OrderId { get; set; }

    public decimal? Subtotal { get; set; }
}
