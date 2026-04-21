using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.ML.Data;

namespace TaxiFarePrediction.Models;

public class TaxiTripFarePrediction
{
        [ColumnName("Score")]
        public float FareAmount;
}
