using FinanceManager.Application;
using FinanceManager.Core;
using FinanceManager.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    [ExcludeFromCodeCoverage]
    internal class UIHandler(FundManager fm, GoalManager gm, InputReader ir)
    {
        private readonly FundManager _fundManager = fm;
        private readonly GoalManager _goalManager = gm;
        private readonly InputReader _inputReader = ir;

        public void Run()
        {
            while (true)
            {
                UIMessages.MainMenu();
                var choice = Console.ReadLine();

                switch (choice)
                {
                    case "1": HandleAddGoal(); break;
                    case "2": HandleShowGoals(); break;

                    case "3": HandleModifyGoal(); break;

                    case "4": HandleRemoveSpecificGoal(); break;

                    case "5": HandleRemoveAllGoals(); break;

                    case "6": HandleAddFunds(); break;
                    case "7": return;

                    default:
                        Console.WriteLine("Wrong choice");
                        break;
                }
            }
        }

        private void HandleAddGoal()
        {
            var (name, amount, date, priority) = _inputReader.GetInputData();
            _goalManager.AddGoal(name, amount, date, priority);
        }
        private void HandleShowGoals() 
        {
            var goals = _goalManager.GetAllGoals();

            if (goals.Count == 0)
            {
                Console.WriteLine("No goals found.");
                return;
            }

            foreach (var goal in goals)
            {
                Console.WriteLine($"ID: {goal.Id} \n Name: {goal.Name}\n TargetDate: {goal.TargetDate}\n Target Amount: {goal.TargetAmount}\n Current Amount: {goal.CurrentAmount}\n Remaining Amount: {goal.AmountRemaining}");
            }
        }
        private void HandleModifyGoal() 
        {            
            var goalToModify = FindGoal(UIMessages.FindGoalToModify);

            if (goalToModify != null)
            {
                var (name, amount, date, priority) = _inputReader.GetInputData(goalToModify);
                _goalManager.ModifyGoal(goalToModify.Id, name, amount, date, priority);
            }
            return;
        }
        private void HandleRemoveSpecificGoal()
        {
            var goalToRemove = FindGoal(UIMessages.FindGoalToRemove);
            
            if (goalToRemove != null)
            {
                _goalManager.RemoveSpecificGoal(goalToRemove.Id);
            }

            return;
        }
        private void HandleRemoveAllGoals() 
        {
            Console.WriteLine("Are you sure you want to remove all goals? (y/n): ");
            var choice = _inputReader.GetYesNoChoice();
            if (choice.ToLower() == "y") _goalManager.RemoveAllGoals();

            return;
        }
        private void HandleAddFunds() 
        {
            UIMessages.AddFundsMenu();
            var choice = _inputReader.Get1Or2OrSkipChoice();

            if (choice == "1")
            {
                decimal amount = _inputReader.GetTransactionAmount();
                if (amount <= 0) return;

                _fundManager.AddFundsAutomatically(amount);
                Console.WriteLine("Funds distributed automatically.");
            }
            else if (choice == "2")
            {
                HandleManualFunds();
            }
        }
        private void HandleManualFunds() 
        {
            Goal? goal = FindGoal(UIMessages.FindGoalToManuallyAddFunds);

            if (goal == null)
            {
                Console.WriteLine("Wrong ID. Returning to menu.");
                return;
            }

            decimal amount = _inputReader.GetTransactionAmount();
            if (amount > 0) return;

            decimal overflow = _fundManager.CheckOverflowAndHandle(goal, amount);

            if (overflow > 0)
            {
                Console.WriteLine($"Warning: Target exceeded! {amount - overflow} was added.");
                Console.WriteLine($"Remaining amount: {overflow} PLN.");
                Console.Write("Do you want to distribute the rest automatically? (y/n): ");

                if (_inputReader.GetYesNoChoice() == "y")
                {
                    _fundManager.AddFundsAutomatically(overflow);
                    Console.WriteLine("Rest of funds distributed.");
                }
            }
            else
            {
                Console.WriteLine("Funds added successfully.");
            }
        }

        private Goal? FindGoal(string message)
        {
            Console.WriteLine($"{message}");
            HandleShowGoals();
            

            while(true)
            {
                Console.WriteLine("Enter the ID of the goal you want to select (or press Enter to cancel):");
                var goalID = _inputReader.GetGoalID();

                if (string.IsNullOrWhiteSpace(goalID))
                {
                    Console.WriteLine("Action cancelled.");
                    return null;
                }

                if (int.TryParse(goalID, out var validGoalID))
                {
                    var goalToFind = _goalManager.GetGoalById(validGoalID);

                    if (goalToFind != null)
                    {
                        return goalToFind;
                    }
                    else
                    {
                        Console.WriteLine("Goal not found. Please try again.");
                        continue;
                    }
                }
                else
                {
                    Console.WriteLine("Invalid ID. Please enter a valid one.");
                    continue;
                }
            }
            
        }

    }

}
