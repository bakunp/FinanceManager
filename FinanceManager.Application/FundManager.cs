using FinanceManager.Core;
using FinanceManager.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Application
{
    public class FundManager(FinanceDbContext fdc, IGoalManager gm, IFinanceCalculator fc)
    {
        private readonly FinanceDbContext _dbContext = fdc;
        private readonly IGoalManager _goalManager = gm;
        private readonly IFinanceCalculator _financeCalculator = fc;


        public decimal AddFundsAutomatically(decimal amount)
        {
            var goals = _dbContext.Goals.Where(g => g.CurrentAmount < g.TargetAmount).ToList();
            decimal totalOverflow = 0;

            _financeCalculator.AdjustPriorityBasedOnTime(goals);

            var calculatedDistribution = _financeCalculator.CalculateAutoDistribution(goals, amount);

            if (calculatedDistribution.Count == 0) return amount;

            foreach (var entry in calculatedDistribution)
            {
                var goal = entry.Key;
                decimal value = entry.Value;
                (decimal assigned, decimal goalOverflow) = _financeCalculator.OverflowCheck(goal, value);
                totalOverflow += goalOverflow;
            }

            _dbContext.SaveChanges();
            return totalOverflow;
        }


        public void AddFundsManually(Goal goal, decimal amount)
        {
            CheckOverflowAndHandle(goal, amount);
            _dbContext.SaveChanges();
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
            _dbContext.SaveChanges();

            return overflowAmount;
        }
    }
}
