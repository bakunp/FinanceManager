using FinanceManager.Core;

namespace FinanceManager.Application
{
    public interface IFundManager
    {
        decimal AddFundsAutomatically(decimal amount);
        void AddFundsManually(Goal goal, decimal amount);
        decimal CheckOverflowAndHandle(Goal goal, decimal amount);
        void MakeTransaction(Goal goal, decimal amount, string description = "Automatic fund allocation");
    }
}