using FinanceManager.ConsoleApp;
using FinanceManager.Core;
using FinanceManager.Application;
using FinanceManager.Data;
using System.Diagnostics.CodeAnalysis;

namespace FinanceManager.ConsoleApp
{
    [ExcludeFromCodeCoverage]
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to Finance Manager!");

            using var dbContext = new FinanceDbContext();
            var _financeCalculator = new FinanceCalculator();
            var _inputReader = new InputReader();

            var _goalManager = new GoalManager(dbContext);
            var _fundManager = new FundManager(dbContext, _goalManager, _financeCalculator);

            if (!File.Exists("finance.db")) dbContext.Database.EnsureCreated();

            var ui = new UIHandler(_fundManager, _goalManager, _inputReader);

            ui.Run();
        }
    }
}