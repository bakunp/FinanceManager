using System;
using System.Collections.Generic;
using System.Text;
using Moq;
using FinanceManager.Core;
using Xunit;
using FinanceManager.ConsoleApp;
using FinanceManager.Tests.Helpers;

namespace FinanceManager.Tests
{
    public class FundManagerTests
    {
        [Fact]
        public void AddFundsManually_WhenAmountIsZero_ExpectStopAndNotCallDatabase()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var testGoal = new Goal { Name = "Wakacje", TargetAmount = 1000, CurrentAmount = 0 };
            dbContext.Add(testGoal);
            dbContext.SaveChanges();

            var mockReader = new Mock<IInputReader>();
            mockReader.Setup(m => m.GetTransactionAmount()).Returns(0);

            var mockGoalManager = new Mock<IGoalManager>();

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, new FinanceCalculator());

            // Act
            manager.AddFundsManually();

            // Assert
            mockReader.Verify(m => m.GetTransactionAmount(), Times.Once);
            mockGoalManager.Verify(m => m.FindGoal(It.IsAny<string>()), Times.Never);
        }
    }
}
