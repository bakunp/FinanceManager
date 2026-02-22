using FinanceManager.Core;
using FinanceManager.Data;

namespace FinanceManager.Application
{
    public class FixedExpenseManager(FinanceDbContext db) : IFixedExpenseManager
    {
        private readonly FinanceDbContext _dbContext = db;

        public void AddFixedExpense(string userId, string name, decimal amount, DateTime firstPaymentDate, int interval, int frequency)
        {
            var fixedExpense = new FixedExpense
            {
                UserId = userId,
                Name = name,
                Amount = amount,
                FirstPaymentDate = firstPaymentDate,
                FrequencyInterval = interval,
                Unit = (FixedExpense.FrequencyUnit)frequency
            };
            _dbContext.FixedExpenses.Add(fixedExpense);
            _dbContext.SaveChanges();
        }

        public List<FixedExpense> GetAllFixedExpenses(string userId)
        {
            return _dbContext.FixedExpenses.Where(e => e.UserId == userId).ToList();
        }

        public FixedExpense? GetById(int id)
        {
            return _dbContext.FixedExpenses.Find(id);
        }

        public void RemoveFixedExpense(int id)
        {
            var fixedExpense = _dbContext.FixedExpenses.Find(id);
            if (fixedExpense == null)
            {
                return;
            }
            _dbContext.FixedExpenses.Remove(fixedExpense);
            _dbContext.SaveChanges();
        }

        public void ModifyFixedExpense(int id, string name, decimal amount, DateTime firstPaymentDate, int interval, int frequency)
        {
            var fixedExpense = _dbContext.FixedExpenses.Find(id);
            if (fixedExpense == null)
            {
                return;
            }
            fixedExpense.Name = name;
            fixedExpense.Amount = amount;
            fixedExpense.FirstPaymentDate = firstPaymentDate;
            fixedExpense.FrequencyInterval = interval;
            fixedExpense.Unit = (FixedExpense.FrequencyUnit)frequency;
            _dbContext.SaveChanges();
        }
    }
}
