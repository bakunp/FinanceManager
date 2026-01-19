using FinanceManager.Core;

namespace FinanceManager.ConsoleApp
{
    public interface IFundManager
    {
        void AddFundsAutomatically(decimal amount);
        void AddFundsManually();
        void AddFundsManually(decimal amount);
        void AddFundsToGoals();
        void AddFundsToGoals(decimal amount);
        void CheckOverflowAndHandle(Goal goal, decimal amount);
        void CheckSumOfTransactions(decimal amount);
        void HandleOverflow(Goal goal, decimal overflowAmount);
        void MakeTransaction(Goal goal, decimal amount, string description = "Automatic fund allocation");
    }
}