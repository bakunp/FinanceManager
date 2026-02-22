using FinanceManager.Core;

namespace FinanceManager.Application
{
    public interface IGoalManager
    {
        void AddGoal(string userId, string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority);
        List<Goal> GetAllGoals(string userId);
        Goal? GetGoalById(int id);
        List<Transaction> GetTransactionsForGoal(int goalId);
        void ModifyGoal(int id, string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority);
        void RemoveAllGoals(string userId);
        void RemoveSpecificGoal(int id);
    }
}