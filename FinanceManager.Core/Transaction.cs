using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Core
{
    public class Transaction
    {

        public int Id { get; set; }
        public int GoalId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Description { get; set; } = string.Empty;

        public virtual Goal Goal { get; set; } = null!;
    }
}
//
