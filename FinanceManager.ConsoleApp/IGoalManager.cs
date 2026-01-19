using FinanceManager.Core;

namespace FinanceManager.ConsoleApp
{
    public interface IGoalManager
    {
        void AddGoal();
        Goal? FindGoal(string message = "Choose the goal to modify by choosing its ID (or press enter  to skip): ");
        void ModifyGoal(Goal? goal);
        void RemoveAllGoals();
        void RemoveSpecificGoal(Goal? goal);
        void ShowGoals();
    }
}