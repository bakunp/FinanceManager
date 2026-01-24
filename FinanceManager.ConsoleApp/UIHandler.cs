using FinanceManager.Core;
using FinanceManager.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    [ExcludeFromCodeCoverage]
    internal class UIHandler(FundManager fm, GoalManager gm)
    {
        private readonly FundManager _fundManager = fm;
        private readonly GoalManager _goalManager = gm;

        public void Run()
        {
            while (true)
            {
                UIMessages.MainMenu();
                var choice = Console.ReadLine();

                switch (choice)
                {
                    case "1": //add goal
                        _goalManager.AddGoal();
                        break;
                    case "2": //show goals
                        Console.WriteLine("Your current goals");
                        _goalManager.ShowGoals();
                        break;

                    case "3": //modify goal
                        _goalManager.ModifyGoal(_goalManager.FindGoal());
                        break;

                    case "4": //remove specific goal
                        _goalManager.RemoveSpecificGoal(_goalManager.FindGoal());
                        break;

                    case "5": //remove all goals
                        _goalManager.RemoveAllGoals();
                        break;

                    case "6": //add funds
                        _fundManager.AddFundsToGoals();
                        break;
                    case "7": //exit
                        return;

                    default:
                        Console.WriteLine("Wrong choice");
                        break;
                }
            }
        }
    }

}
