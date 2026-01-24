using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace FinanceManager.ConsoleApp
{
    [ExcludeFromCodeCoverage]
    public static class UIMessages
    {
        public const string AutoAllocationDesc = "Automatic fund allocation";
        public const string RoundAllocationDesc = "Rounding correction";
        public const string FindGoalToModify = "Choose the goal to modify by choosing its ID (or press enter  to skip): ";
        public const string FindGoalToManuallyAddFunds = "Choose the goal to add funds to by choosing its ID (or press enter  to skip): ";

        public static void MainMenu()
        {
            Console.WriteLine("// Menu Options");
            Console.WriteLine("1. Add Goal");
            Console.WriteLine("2. View Goals");
            Console.WriteLine("3. Modify goal");
            Console.WriteLine("4. Remove Specific Goal");
            Console.WriteLine("5. Remove All Goals");
            Console.WriteLine("6. Add funds to Goals");
            Console.WriteLine("7. Exit");
            Console.Write("Select an option: ");
        }
        public static void AddFundsMenu()
        {
            Console.WriteLine("1. Add automatically.");
            Console.WriteLine("2. Add manually.");
            Console.Write("Select an option: ");
        }
    }
}
