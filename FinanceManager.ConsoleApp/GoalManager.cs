using FinanceManager.Core;
using FinanceManager.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    public class GoalManager(FinanceDbContext db, IInputReader ir) : IGoalManager
    {
        private readonly FinanceDbContext _dbContext = db;
        private readonly IInputReader _inputReader = ir;

        public void AddGoal()
        {
            var (name, amount, date, priority) = _inputReader.GetInputData();
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

        public void ModifyGoal(Goal? goal)
        {
            if (goal == null)
            {
                return;
            }
            Console.WriteLine("Enter new details for the goal: ");
            var (name, amount, date, priority) = _inputReader.GetInputData(goal);
            goal.Name = name;
            goal.TargetAmount = amount;
            goal.TargetDate = date;
            goal.Priority = priority;

            _dbContext.SaveChanges();
        }

        public Goal? FindGoal(string message = UIMessages.FindGoalToModify)
        {
            Console.WriteLine($"{message}");
            ShowGoals();
            var goalID = _inputReader.GetGoalID();

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
