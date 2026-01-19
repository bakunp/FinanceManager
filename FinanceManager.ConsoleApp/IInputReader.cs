using FinanceManager.Core;

namespace FinanceManager.ConsoleApp
{
    public interface IInputReader
    {
        (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData();
        (string, decimal, DateTime?, Goal.GoalPriorityEnum) GetInputData(Goal goalToModify);
        decimal GetTransactionAmount();
    }
}