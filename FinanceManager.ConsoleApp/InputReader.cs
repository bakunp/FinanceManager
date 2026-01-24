using FinanceManager.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    [ExcludeFromCodeCoverage]
    public class InputReader : IInputReader
    {
        public (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData()
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

        public (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData(Goal goalToModify)
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

        private string GetName()
        {
            var name = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(name))
            {
                Console.WriteLine("Name cannot be empty. Please enter a valid name: ");
                return GetName();
            }

            return name;
        }

        private string GetName(Goal goal)
        {
            var name = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(name))
            {
                return goal.Name;
            }

            return name;
        }

        private decimal GetAmount()
        {
            var amountInput = Console.ReadLine();
            if (!decimal.TryParse(amountInput, out var amount) || amount <= 0)
            {
                Console.WriteLine("Invalid amount. Please enter a positive number: ");
                return GetAmount();
            }
            return amount;
        }

        private decimal GetAmount(Goal goal)
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

        private DateTime? GetTargetDate()
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

        private DateTime? GetTargetDate(Goal goal)
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

        private Goal.GoalPriorityEnum GetPriority()
        {
            var priorityInput = Console.ReadLine();

            if (!int.TryParse(priorityInput, out var targetPriority))
            {
                Console.WriteLine("Invalid priority. Please enter a valid one: ");
                return GetPriority();
            }

            return (Goal.GoalPriorityEnum)(targetPriority);
        }

        private Goal.GoalPriorityEnum GetPriority(Goal goal)
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
        public decimal GetTransactionAmount()
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

        public string GetYesNoChoice()
        {
            var choice = Console.ReadLine();
            return choice?.ToLower() == "y" ? "y" : "n";
        }

        public string? Get1Or2OrSkipChoice()
        {
            var choice = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(choice))
            {
                return "";
            }
            return choice == "1" || choice == "2" ? choice : null;
        }

        public string? GetGoalID()
        {
            var id = Console.ReadLine();
            return id;
        }
    }
}
