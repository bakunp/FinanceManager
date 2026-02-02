using FinanceManager.Core;

namespace FinanceManager.Application
{
    public interface IFixedExpenseManager
    {
        void AddFixedExpense(string name, decimal amount, DateTime firstPaymentDate, int interval, int frequency);
        List<FixedExpense> GetAllFixedExpenses();
        void ModifyFixedExpense(int id, string name, decimal amount, DateTime firstPaymentDate, int interval, int frequency);
        void RemoveFixedExpense(int id);
    }
}