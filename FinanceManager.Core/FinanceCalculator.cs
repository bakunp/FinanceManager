using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;

namespace FinanceManager.Core
{
    public class FinanceCalculator
    {
        public decimal CalculatePrioritySum(List<Goal> goals)
        {
            var sum = goals.Where(g => g.Priority > 0).Sum(g => g.EffectivePriority);

            return sum;
        }

        public void AdjustPriorityBasedOnTime(List<Goal> goals)
        {
            foreach (var goal in goals)
            {
                goal.PriorityBoosted = 0;
                if (goal.TargetDate != null)
                {
                    TimeSpan timeDifference = goal.TargetDate.Value - DateTime.Now;
                    var daysRemaining = timeDifference.TotalDays;

                    if (daysRemaining <= 31) goal.PriorityBoosted = 2;
                    else if (daysRemaining <= 62) goal.PriorityBoosted = 1;

                }
            }
        }

        public Dictionary<Goal, decimal> CalculateAutoDistribution(List<Goal> goals, decimal totalAmount)
        {
            var resultDistribution = new Dictionary<Goal, decimal>();
            var prioritySum = CalculatePrioritySum(goals);

            if (prioritySum == 0) return resultDistribution;

            var onePointValue = totalAmount / prioritySum;

            foreach (var goal in goals)
            {
                var amountToAdd = Math.Round(onePointValue * goal.EffectivePriority, 2);
                resultDistribution.Add(goal, amountToAdd);
            }

            return resultDistribution;
        }

        public (decimal, decimal) OverflowCheck(Goal goal, decimal amount)
        {
            var spaceLeft = goal.TargetAmount - goal.CurrentAmount;

            if (spaceLeft < 0) spaceLeft = 0;

            if (amount > spaceLeft) return (spaceLeft, amount - spaceLeft);

            return (amount, 0);
        }
    }
}
