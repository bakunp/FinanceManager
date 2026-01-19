using Microsoft.EntityFrameworkCore;
using FinanceManager.Data;

namespace FinanceManager.Tests.Helpers
{
    public static class DbContextFactory
    {
        public static FinanceDbContext Create()
        {
            var options = new DbContextOptionsBuilder<FinanceDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;
                
            var context = new FinanceDbContext(options);

            return context;
        }
    }
}
