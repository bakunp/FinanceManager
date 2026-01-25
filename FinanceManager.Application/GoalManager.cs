using FinanceManager.Core;
using FinanceManager.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Application
{
    public class GoalManager(FinanceDbContext db) : IGoalManager
    {
        private readonly FinanceDbContext _dbContext = db;

        public void AddGoal(string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority)
        {
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
        }

        public List<Goal> GetAllGoals()
        {
            return _dbContext.Goals.ToList();
        }

        public Goal? GetGoalById(int id)
        {
            return _dbContext.Goals.Find(id);
        }

        public void ModifyGoal(int id, string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority)
        {
            var goal = _dbContext.Goals.Find(id);
            if (goal == null)
            {
                return;
            }

            goal.Name = name;
            goal.TargetAmount = amount;
            goal.TargetDate = date;
            goal.Priority = priority;

            _dbContext.SaveChanges();
        }

        public void RemoveSpecificGoal(int id)
        {
            var goal = _dbContext.Goals.Find(id);

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
