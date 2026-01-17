using FinanceManager.Core;
using FinanceManager.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    public class FundManager(FinanceDbContext fdc, GoalManager gm, InputReader ir, FinanceCalculator fc)
    {
        private readonly FinanceDbContext _dbContext = fdc;
        private readonly GoalManager _goalManager = gm;
        private readonly InputReader _inputReader = ir;
        private readonly FinanceCalculator _financeCalculator = fc;

        public void AddFundsToGoals()
        {
            UIMessages.AddFundsMenu();
            Console.Write("Select an option: ");
            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    decimal amount = _inputReader.GetTransactionAmount();
                    if (amount == 0) return;
                    AddFundsAutomatically(amount);
                    break;

                case "2":
                    AddFundsManually();
                    break;

                default:
                    Console.WriteLine("Invalid choice.");
                    return;
            }

            _dbContext.SaveChanges();
        }

        public void AddFundsToGoals(decimal amount)
        {
            UIMessages.AddFundsMenu();
            Console.Write("Select an option: ");
            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    AddFundsAutomatically(amount);
                    break;

                case "2":
                    AddFundsManually(amount);
                    break;

                default:
                    Console.WriteLine("Invalid choice.");
                    return;
            }

            _dbContext.SaveChanges();
        }

        public void AddFundsAutomatically(decimal amount)
        {
            var goals = _dbContext.Goals.Where(g => g.CurrentAmount < g.TargetAmount).ToList();

            _financeCalculator.AdjustPriorityBasedOnTime(goals);

            var calculatedDistribution = _financeCalculator.CalculateAutoDistribution(goals, amount);

            if (calculatedDistribution.Count == 0)
            {
                Console.WriteLine("No goals available for fund allocation.");
                return;
            }

            foreach (var entry in calculatedDistribution)
            {
                var goal = entry.Key;
                decimal value = entry.Value;
                CheckOverflowAndHandle(goal, value);
            }

            _dbContext.SaveChanges();
            CheckSumOfTransactions(amount);
        }

        public void AddFundsManually()
        {

            decimal amount = _inputReader.GetTransactionAmount();
            if (amount == 0) return;

            AddFundsManually(amount);
        }

        public void AddFundsManually(decimal amount)
        {
            Goal? goal = _goalManager.FindGoal(UIMessages.FindGoalToManuallyAddFunds);

            if (goal == null)
            {
                Console.WriteLine("Wrong ID. Returning to menu.");
                return;
            }

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

        public void CheckSumOfTransactions(decimal amount)
        {
            var time = DateTime.Now.AddSeconds(-10);
            var transactions = _dbContext.Transactions.Where(t => t.Description == UIMessages.AutoAllocationDesc && t.Date >= time).Sum(t => t.Amount);

            if (transactions != amount)
            {
                decimal diff = amount - transactions;
                var bestGoal = _dbContext.Goals.OrderByDescending(g => g.Priority).First();
                MakeTransaction(bestGoal, diff, UIMessages.RoundAllocationDesc);
                bestGoal.CurrentAmount += diff;
                Console.WriteLine($"Automatically allocated missed funds to the goals with the most priority. Assigned: {diff}PLN");
            }
            _dbContext.SaveChanges();
        }

        public void CheckOverflowAndHandle(Goal goal, decimal amount)
        {
            (decimal allocatedAmount, decimal overflowAmount) = _financeCalculator.OverflowCheck(goal, amount);

            if (overflowAmount > 0)
            {

                Console.WriteLine($"Warning: Adding {amount} to '{goal.Name}' will exceed the target amount.");
                Console.WriteLine($"Only {allocatedAmount} fits. Overflow: {overflowAmount}");
                Console.Write("Do you want to assign the rest of funds to the other goals? (y/n): ");
                var choice = Console.ReadLine();

                if (choice?.ToLower() == "y")
                {
                    goal.CurrentAmount += allocatedAmount;
                    MakeTransaction(goal, allocatedAmount);
                    HandleOverflow(goal, overflowAmount);
                }
                else
                {
                    goal.CurrentAmount += allocatedAmount;
                    MakeTransaction(goal, allocatedAmount);
                }
            }
            else
            {
                MakeTransaction(goal, amount);
                goal.CurrentAmount += amount;
            }
        }

        public void HandleOverflow(Goal goal, decimal overflowAmount)
        {
            Console.WriteLine($"There is an overflow in {goal.Name} goal. If you want to assign the rest of the funds please pick from the list below (press enter to skip)");

            AddFundsToGoals(overflowAmount);
        }
    }
}
