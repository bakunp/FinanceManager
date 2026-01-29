using FinanceManager.Core;

namespace FinanceManager.Application
{
    public interface IFundManager
    {
        decimal AddFundsAutomatically(decimal amount, List<Goal> goalList = null);
        decimal AddFundsManually(int goalId, decimal amount);
        decimal CheckOverflowAndHandle(Goal goal, decimal amount);
        void MakeTransaction(Goal goal, decimal amount, string description = "Automatic fund allocation");
    }
}