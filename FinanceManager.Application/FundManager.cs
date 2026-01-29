using FinanceManager.Core;
using FinanceManager.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Application
{
    public class FundManager(FinanceDbContext fdc, IGoalManager gm, IFinanceCalculator fc) : IFundManager
    {
        private readonly FinanceDbContext _dbContext = fdc;
        private readonly IGoalManager _goalManager = gm;
        private readonly IFinanceCalculator _financeCalculator = fc;


        public decimal AddFundsAutomatically(decimal amount, List<Goal> goalList = null)
        {
            var goals = goalList;
            decimal totalOverflow = 0;

            if (goalList == null)
            {
                goals = _dbContext.Goals.Where(g => g.CurrentAmount < g.TargetAmount).ToList();
                _financeCalculator.AdjustPriorityBasedOnTime(goals);
            }

            var calculatedDistribution = _financeCalculator.CalculateAutoDistribution(goals, amount);

            if (calculatedDistribution.Count == 0) return amount;

            foreach (var entry in calculatedDistribution)
            {
                var goal = entry.Key;
                decimal value = entry.Value;
                (decimal assigned, decimal goalOverflow) = _financeCalculator.OverflowCheck(goal, value);

                goal.CurrentAmount += assigned;
                MakeTransaction(goal, assigned);

                totalOverflow += goalOverflow;
            }

            if (totalOverflow > 0)
            {
                var goalsLeft = goals.Where(g => g.CurrentAmount < g.TargetAmount).ToList();
                if (goalsLeft.Count > 0) totalOverflow = AddFundsAutomatically(totalOverflow, goalsLeft);
            }

            if (goalList == null) _dbContext.SaveChanges();
            return totalOverflow;
        }


        public decimal AddFundsManually(int goalId, decimal amount)
        {
            var goal = _goalManager.GetGoalById(goalId) ?? throw new Exception("Goal not found");
            var overflow = CheckOverflowAndHandle(goal, amount);

            if (overflow != 0) AddFundsAutomatically(overflow);

            _dbContext.SaveChanges();
            return overflow;
        }

        public void MakeTransaction(Goal goal, decimal amount, string description = UIMessages.AutoAllocationDesc)
        {
            Transaction transaction = new()
            {
                Goal = goal,
                Amount = amount,
                Date = DateTime.Now,
                Description = description
            };
            _dbContext.Transactions.Add(transaction);
        }

        public decimal CheckOverflowAndHandle(Goal goal, decimal amount)
        {
            (decimal allocatedAmount, decimal overflowAmount) = _financeCalculator.OverflowCheck(goal, amount);

            goal.CurrentAmount += allocatedAmount;
            MakeTransaction(goal, allocatedAmount);

            return overflowAmount;
        }
    }
}
