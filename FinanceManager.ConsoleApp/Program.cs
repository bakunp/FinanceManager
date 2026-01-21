using FinanceManager.ConsoleApp;
using FinanceManager.Core;
using FinanceManager.Data;

Console.WriteLine("Welcome to Finance Manager!");

using var dbContext = new FinanceDbContext();
var _financeCalculator = new FinanceCalculator();
var _inputReader = new InputReader();

var _goalManager = new GoalManager(dbContext, _inputReader);
var _fundManager = new FundManager(dbContext, _goalManager, _inputReader, _financeCalculator);

if (!File.Exists("finance.db")) dbContext.Database.EnsureCreated();
var ui = new UIHandler(_fundManager, _goalManager);

ui.Run();

