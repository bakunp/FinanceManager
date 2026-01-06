using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Core
{
    public class Goal
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public decimal TargetAmount { get; set; }  
        public decimal CurrentAmount { get; set; }

        public DateTime? TargetDate { get; set; }

        public decimal AmountRemaining => TargetAmount - CurrentAmount;

        public bool IsAchieved => CurrentAmount >= TargetAmount;
    }
}
