using FinanceManager.Core;

namespace FinanceManager.Application
{
    public interface IGoalManager
    {
        void AddGoal(string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority);
        List<Goal> GetAllGoals();
        Goal? GetGoalById(int id);
        void ModifyGoal(int id, string name, decimal amount, DateTime? date, Goal.GoalPriorityEnum priority);
        void RemoveAllGoals();
        void RemoveSpecificGoal(int id);
    }
}