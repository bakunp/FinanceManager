using FinanceManager.Core;
using FinanceManager.Data;

Console.WriteLine("Welcome to Finance Manager!");

using var dbContext = new FinanceDbContext();

dbContext.Database.EnsureCreated();

while (true)
{
    Console.WriteLine("// Menu Options");
    Console.WriteLine("1. Add Goal");
    Console.WriteLine("2. View Goals");
    Console.WriteLine("3. Exit");
    Console.Write("Select an option: ");
    var choice = Console.ReadLine();

    switch (choice)
    {
        case "1":
            Console.Write("Enter goal name: ");
            var name = Console.ReadLine();
            Console.Write("Enter target amount: ");
            var amountInput = Console.ReadLine();
            Console.Write("Enter target date (yyyy-mm-dd) or leave blank: ");
            var dateInput = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(name) && decimal.TryParse(amountInput, out var targetAmount) && DateTime.TryParse(dateInput, out var targetDate))
            {
                var Goal = new Goal
                {
                    Name = name,
                    TargetAmount = targetAmount,
                    CurrentAmount = 0m,
                    TargetDate = targetDate
                };
                dbContext.Goals.Add(Goal);
                dbContext.SaveChanges();
                Console.WriteLine("Goal added successfully");
            }
            else
            {
                Console.WriteLine("Invalid amount or date. Please try again.");
            }
            break;
        case "2":
            Console.WriteLine("Your current goals");
            var goals = dbContext.Goals.ToList();
                        
            foreach (var goal in goals)
            {
                Console.WriteLine($"ID: {goal.Id} \n Name: {goal.Name}\n TargetDate: {goal.TargetDate}\n Target Amount: {goal.TargetAmount}\n Current Amount: {goal.CurrentAmount}\n Remaining Amount: {goal.AmountRemaining}");
            }
            break;

        case "3":
            Console.WriteLine("Exit...");
            return;
        default:
            Console.WriteLine("Wrong choice");
            break;
    } 
}