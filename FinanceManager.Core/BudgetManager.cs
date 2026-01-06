using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Core
{
    public class BudgetManager
    {
        public List<Goal> Goals { get; set; } = new List<Goal>();

        public void AddGoal(Goal goal)
        {
            Goals.Add(goal);
        }

        public void RemoveGoal(Goal goal)
        {
            Goals.Remove(goal);
        }

        public void RemoveAll()
        {
            Goals.Clear();
        }
        public List<Goal> GetGoals()
        {
            return Goals;
        }

        public void DistributeFounds(decimal amount)
        {
            if (Goals.Count == 0 || amount <= 0)
                return;

            decimal amountPerGoal = amount / Goals.Count;

            foreach (var goal in Goals)
            {
                if (!goal.IsAchieved)
                {
                    goal.CurrentAmount += amountPerGoal;
                }
            }
        }
    }
}