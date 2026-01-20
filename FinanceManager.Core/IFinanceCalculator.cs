
namespace FinanceManager.Core
{
    public interface IFinanceCalculator
    {
        void AdjustPriorityBasedOnTime(List<Goal> goals);
        Dictionary<Goal, decimal> CalculateAutoDistribution(List<Goal> goals, decimal totalAmount);
        decimal CalculatePrioritySum(List<Goal> goals);
        (decimal, decimal) OverflowCheck(Goal goal, decimal amount);
    }
}