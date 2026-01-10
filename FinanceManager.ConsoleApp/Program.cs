using FinanceManager.ConsoleApp;
using FinanceManager.Core;
using FinanceManager.Data;

Console.WriteLine("Welcome to Finance Manager!");

using var dbContext = new FinanceDbContext();

dbContext.Database.EnsureCreated();
var ui = new UIHandler(dbContext);

while (true)
{
    ui.ShowMenu();
    var choice = Console.ReadLine();

    switch (choice)
    {
        case "1": //add goal
            ui.AddGoal();
            break;
        case "2": //show goals
            Console.WriteLine("Your current goals");
            ui.ShowGoals();
            break;

        case "3": //modify goal
            ui.ModifyGoal(ui.TakeGoalToModify());
            
            break;

        case "4": //remove specific goal

            break;

        case "5": //remove all goals
            break;

        case "6": //exit
            return;

        default:
            Console.WriteLine("Wrong choice");
            break;
    } 
}


