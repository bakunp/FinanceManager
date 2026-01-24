using FinanceManager.Core;

namespace FinanceManager.ConsoleApp
{
    public interface IInputReader
    {
        string? Get1Or2OrSkipChoice();
        (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData();
        (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData(Goal goalToModify);
        decimal GetTransactionAmount();
        string GetYesNoChoice();
        string? GetGoalID();
    }
}