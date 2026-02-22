using FinanceManager.Core;
using FinanceManager.Data;

namespace FinanceManager.Application
{
    public class GoalManager(FinanceDbContext db) : IGoalManager
    {
        private readonly FinanceDbContext _dbContext = db;

        public void AddGoal(string userId, string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority)
        {
            var goal = new Goal
            {
                UserId = userId,
                Name = name,
                TargetAmount = amount,
                CurrentAmount = 0m,
                TargetDate = date,
                Priority = priority
            };
            _dbContext.Goals.Add(goal);
            _dbContext.SaveChanges();
        }

        public List<Goal> GetAllGoals(string userId)
        {
            return _dbContext.Goals.Where(g => g.UserId == userId).ToList();
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

        public void RemoveAllGoals(string userId)
        {
            var goals = _dbContext.Goals.Where(g => g.UserId == userId).ToList();
            _dbContext.Goals.RemoveRange(goals);
            _dbContext.SaveChanges();
        }

        public List<Transaction> GetTransactionsForGoal(int goalId)
        {
            return _dbContext.Transactions
                    .Where(t => t.GoalId == goalId)
                    .OrderByDescending(t => t.Date)
                    .ToList();
        }
    }
}
