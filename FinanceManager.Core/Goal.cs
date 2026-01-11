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
        public decimal CurrentAmount { get; set; } = 0m;

        public DateTime? TargetDate { get; set; }

        public decimal AmountRemaining => TargetAmount - CurrentAmount;

        public bool IsAchieved => CurrentAmount >= TargetAmount;

        public GoalPriorityEnum Priority { get; set; } = GoalPriorityEnum.Low;

        public List<Transaction> Transactions { get; set; } = new List<Transaction>();

        public enum GoalPriorityEnum
        {
            Low = 1,
            Normal = 2,
            Medium = 3,
            High = 5,
            Critical = 8
        }
    }
}
