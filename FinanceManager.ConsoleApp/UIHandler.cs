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

        public void ShowMenu()
        {
            Console.WriteLine("// Menu Options");
            Console.WriteLine("1. Add Goal");
            Console.WriteLine("2. View Goals");
            Console.WriteLine("3. Modify goal");
            Console.WriteLine("4. Remove Specific Goal");
            Console.WriteLine("5. Remove All Goals");
            Console.WriteLine("6. Exit");
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
            _dbContext.SaveChanges();
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

            _dbContext.SaveChanges();
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

            if(string.IsNullOrWhiteSpace(amountInput))
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

        public Goal? FindGoal()
        {
            Console.WriteLine("Choose the goal to modify by choosing its ID (or press enter  to skip): ");
            ShowGoals();
            var goalID = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(goalID))
            {
                Console.WriteLine("Modification cancelled.");
                return null;
            }

            if (int.TryParse(goalID, out var validGoalID))
            {
                var goalToModify = _dbContext.Goals.Find(validGoalID);

                if (goalToModify != null)
                {
                    return goalToModify;
                }
                else
                {
                    Console.WriteLine("Goal not found. Please try again.");
                    return FindGoal();
                }
            }
            else
            {
                Console.WriteLine("Invalid ID. Please enter a valid one.");
                return FindGoal();
            }
        }

        public void RemoveSpecificGoal(Goal? goal)
        {
            if (goal == null)
            {
                return;
            }
            _dbContext.Goals.Remove(goal);
            _dbContext.SaveChanges();
        }

        public void RemoveAllGoals()
        {
            var goals = _dbContext.Goals.ToList();
            _dbContext.Goals.RemoveRange(goals);
            _dbContext.SaveChanges();
        }

    }
}
