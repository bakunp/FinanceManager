using FinanceManager.Core;
using FinanceManager.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    internal class UIHandler(FinanceDbContext dbContext)
    {
        private readonly FinanceDbContext _dbContext = dbContext;
        private readonly FinanceCalculator _calculator = new();

        const string AutoAllocationDesc = "Automatic fund allocation";
        const string RoundAllocationDesc = "Rounding correction";
        const string FindGoalToModify = "Choose the goal to modify by choosing its ID (or press enter  to skip): ";
        const string FindGoalToManuallyAddFounds = "Choose the goal to add founds to by choosing its ID (or press enter  to skip): ";
        public void ShowMenu()
        {
            Console.WriteLine("// Menu Options");
            Console.WriteLine("1. Add Goal");
            Console.WriteLine("2. View Goals");
            Console.WriteLine("3. Modify goal");
            Console.WriteLine("4. Remove Specific Goal");
            Console.WriteLine("5. Remove All Goals");
            Console.WriteLine("6. Add Founds to Goals");
            Console.WriteLine("7. Exit");
            Console.Write("Select an option: ");
        }

        public void ShowAddFoundsMenu()
        {
            Console.WriteLine("1. Add automatically.");
            Console.WriteLine("2. Add manually.");
            Console.Write("Select an option: ");
        }

        public void AddGoal()
        {
            var (name, amount, date, priority) = GetInputData();
            var goal = new Goal
            {
                Name = name,
                TargetAmount = amount,
                CurrentAmount = 0m,
                TargetDate = date,
                Priority = priority
            };
            _dbContext.Goals.Add(goal);
            SaveChanges();
            Console.WriteLine("Goal added successfully");
        }

        public void ShowGoals()
        {
            var goals = _dbContext.Goals.ToList();

            foreach (var goal in goals)
            {
                Console.WriteLine($"ID: {goal.Id} \n Name: {goal.Name}\n TargetDate: {goal.TargetDate}\n Target Amount: {goal.TargetAmount}\n Current Amount: {goal.CurrentAmount}\n Remaining Amount: {goal.AmountRemaining}");
            }
        }

        public void ModifyGoal(Goal? goal)
        {
            if (goal == null)
            {
                return;
            }
            Console.WriteLine("Enter new details for the goal: ");
            var (name, amount, date, priority) = GetInputData(goal);
            goal.Name = name;
            goal.TargetAmount = amount;
            goal.TargetDate = date;
            goal.Priority = priority;

            SaveChanges();
        }

        static (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData()
        {
            Console.Write("Enter goal name: ");
            var name = GetName();
            Console.Write("Enter target amount: ");
            var amount = GetAmount();
            Console.Write("Enter target date (yyyy-mm-dd) or leave blank: ");
            var date = GetTargetDate();
            Console.Write("Set Priority (Low = 1, Normal = 2, Medium = 3, Important = 4, High = 5, Critical = 6): ");
            var priority = GetPriority();

            return (name, amount, date, priority);
        }

        static (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData(Goal goalToModify)
        {
            Console.WriteLine("Press enter to skip a field and keep its current value.");
            Console.WriteLine($"Current Name: {goalToModify.Name}");
            Console.Write("Enter goal name: ");
            var name = GetName(goalToModify);
            Console.WriteLine($"Current Target Amount: {goalToModify.TargetAmount}");
            Console.Write("Enter target amount: ");
            var amount = GetAmount(goalToModify);
            Console.WriteLine($"Current Target Date: {goalToModify.TargetDate}");
            Console.Write("Enter target date (yyyy-mm-dd) or leave blank: ");
            var date = GetTargetDate(goalToModify);
            Console.WriteLine($"Current Priority: {goalToModify.Priority}");
            Console.Write("Set Priority (Low = 1, Normal = 2, Medium = 3, Important = 4, High = 5, Critical = 6): ");
            var priority = GetPriority(goalToModify);

            return (name, amount, date, priority);
        }

        static string GetName()
        {
            var name = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(name))
            {
                Console.WriteLine("Name cannot be empty. Please enter a valid name: ");
                return GetName();
            }

            return name;
        }

        static string GetName(Goal goal)
        {
            var name = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(name))
            {
                return goal.Name;
            }

            return name;
        }

        static decimal GetAmount()
        {
            var amountInput = Console.ReadLine();
            if (!decimal.TryParse(amountInput, out var amount) || amount <= 0)
            {
                Console.WriteLine("Invalid amount. Please enter a positive number: ");
                return GetAmount();
            }
            return amount;
        }

        static decimal GetAmount(Goal goal)
        {
            var amountInput = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(amountInput))
            {
                return goal.TargetAmount;
            }

            if (!decimal.TryParse(amountInput, out var amount) || amount <= 0)
            {
                Console.WriteLine("Invalid amount. Please enter a positive number: ");
                return GetAmount(goal);
            }
            return amount;
        }

        static DateTime? GetTargetDate()
        {
            var dataInput = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(dataInput))
            {
                return null;
            }

            if (!DateTime.TryParse(dataInput, out var targetDataInput))
            {
                Console.WriteLine("Invalid date. Please enter a valid one: ");
                return GetTargetDate();
            }

            return DateTime.Parse(dataInput);
        }

        static DateTime? GetTargetDate(Goal goal)
        {
            var dataInput = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(dataInput))
            {
                return goal.TargetDate;
            }

            if (!DateTime.TryParse(dataInput, out var targetDataInput))
            {
                Console.WriteLine("Invalid date. Please enter a valid one: ");
                return GetTargetDate(goal);
            }

            return DateTime.Parse(dataInput);
        }

        static Goal.GoalPriorityEnum GetPriority()
        {
            var priorityInput = Console.ReadLine();

            if (!int.TryParse(priorityInput, out var targetPriority))
            {
                Console.WriteLine("Invalid priority. Please enter a valid one: ");
                return GetPriority();
            }

            return (Goal.GoalPriorityEnum)(targetPriority);
        }

        static Goal.GoalPriorityEnum GetPriority(Goal goal)
        {
            var priorityInput = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(priorityInput))
            {
                return goal.Priority;
            }

            if (!int.TryParse(priorityInput, out var targetPriority))
            {
                Console.WriteLine("Invalid priority. Please enter a valid one: ");
                return GetPriority(goal);
            }

            return (Goal.GoalPriorityEnum)(targetPriority);
        }

        public Goal? FindGoal(string message = FindGoalToModify)
        {
            Console.WriteLine($"{message}");
            ShowGoals();
            var goalID = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(goalID))
            {
                Console.WriteLine("Action cancelled.");
                return null;
            }

            if (int.TryParse(goalID, out var validGoalID))
            {
                var goalToFind = _dbContext.Goals.Find(validGoalID);

                if (goalToFind != null)
                {
                    return goalToFind;
                }
                else
                {
                    Console.WriteLine("Goal not found. Please try again.");
                    return FindGoal(message);
                }
            }
            else
            {
                Console.WriteLine("Invalid ID. Please enter a valid one.");
                return FindGoal(message);
            }
        }

        public void RemoveSpecificGoal(Goal? goal)
        {
            if (goal == null)
            {
                return;
            }
            _dbContext.Goals.Remove(goal);
            SaveChanges();
        }

        public void RemoveAllGoals()
        {
            var goals = _dbContext.Goals.ToList();
            _dbContext.Goals.RemoveRange(goals);
            SaveChanges();
        }

        public void AddFoundsToGoals()
        {
            ShowAddFoundsMenu();
            Console.Write("Select an option: ");
            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    decimal amount = GetTransactionAmount();
                    if (amount == 0) return;
                    AddFoundsAutomatically(amount);
                    break;

                case "2":
                    AddFoundsManually();
                    break;

                default:
                    Console.WriteLine("Invalid choice.");
                    return;
            }

            SaveChanges();
        }

        public void AddFoundsToGoals(decimal amount)
        {
            ShowAddFoundsMenu();
            Console.Write("Select an option: ");
            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    AddFoundsAutomatically(amount);
                    break;

                case "2":
                    AddFoundsManually(amount);
                    break;

                default:
                    Console.WriteLine("Invalid choice.");
                    return;
            }

            SaveChanges();
        }

        public void AddFoundsAutomatically(decimal amount)
        {
            var goals = _dbContext.Goals.Where(g => g.CurrentAmount < g.TargetAmount).ToList();

            _calculator.AdjustPriorityBasedOnTime(goals);
            
            var calculatedDistribution = _calculator.CalculateAutoDistribution(goals, amount);

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

            SaveChanges();
            CheckSumOfTransactions(amount);
        }

        public void AddFoundsManually()
        {
    
            decimal amount = GetTransactionAmount();
            if (amount == 0) return;

            AddFoundsManually(amount);
        }

        public void AddFoundsManually(decimal amount)
        {
            Goal? goal = FindGoal(FindGoalToManuallyAddFounds);

            if (goal == null)
            {
                Console.WriteLine("Wrong ID. Returning to menu.");
                return;
            }

            CheckOverflowAndHandle(goal, amount);
        }

        public static decimal GetTransactionAmount()
        {
            Console.Write("Enter amount to add: ");
            var amountInput = Console.ReadLine();
            if (decimal.TryParse(amountInput, out var amount) && amount > 0)
            {
                return amount;
            }

            Console.WriteLine("Invalid amount.");
            return 0;
        }

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public void MakeTransaction(Goal goal, decimal amount, string description = AutoAllocationDesc)
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
            var transactions = _dbContext.Transactions.Where(t => t.Description == AutoAllocationDesc && t.Date >= time).Sum(t => t.Amount);

            if (transactions != amount)
            {
                decimal diff = amount - transactions;
                var bestGoal = _dbContext.Goals.OrderByDescending(g => g.Priority).First();
                MakeTransaction(bestGoal, diff, RoundAllocationDesc);
                bestGoal.CurrentAmount += diff;
                Console.WriteLine($"Automatically allocated missed founds to the goals with the most priority. Assigned: {diff}PLN");
            }
            SaveChanges();
        }

        public void CheckOverflowAndHandle(Goal goal, decimal amount)
        {
            (decimal allocatedAmount, decimal overflowAmount) = _calculator.OverflowCheck(goal, amount);

            if (overflowAmount > 0)
            {

                Console.WriteLine($"Warning: Adding {amount} to '{goal.Name}' will exceed the target amount.");
                Console.WriteLine($"Only {allocatedAmount} fits. Overflow: {overflowAmount}");
                Console.Write("Do you want to assign the rest of founds to the other goals? (y/n): ");
                var choice = Console.ReadLine();

                if (choice?.ToLower() == "y")
                {
                    goal.CurrentAmount += allocatedAmount;
                    MakeTransaction(goal, allocatedAmount);
                    OverflowHandler(goal, overflowAmount);
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

            SaveChanges();
        }

        public void OverflowHandler(Goal goal, decimal overflowAmount)
        {
            Console.WriteLine($"There is an overflow in {goal.Name} goal. If you want to assign the rest of the founds please pick from the list below (press enter to skip)");

            AddFoundsToGoals(overflowAmount);
        }

    }

}
