using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FinanceManager.Core
{
    public class FixedExpense
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }

        public DateTime FirstPaymentDate { get; set; }

        [Range(1, 365)]
        public int FrequencyInterval { get; set; } = 1;

        public FrequencyUnit Unit { get; set; } = FrequencyUnit.Month;

        public enum FrequencyUnit
        {
            Day,
            Week,
            Month,
            Year
        }
    }
}
