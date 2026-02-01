using FinanceManager.Core;

namespace FinanceManager.Application
{
    public interface IFundManager
    {
        decimal AddFundsAutomatically(decimal amount, string description, List<Goal> goalList = null);
        decimal AddFundsManually(int goalId, decimal amount, string description);
        decimal CheckOverflowAndHandle(Goal goal, decimal amount, string description);
        void MakeTransaction(Goal goal, decimal amount, string description = "Automatic fund allocation");
    }
}