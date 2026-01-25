using FinanceManager.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace FinanceManager.Data
{
    [ExcludeFromCodeCoverage]
    public class FinanceDbContext : DbContext
    {
        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options)
        {
        }
        public FinanceDbContext()
        {
        }
        public DbSet<Goal> Goals { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<FixedExpense> FixedExpenses { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=finance.db");
            }
        }
    }
}
