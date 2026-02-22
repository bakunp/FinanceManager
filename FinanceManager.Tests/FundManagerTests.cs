using System;
using System.Collections.Generic;
using Moq;
using FinanceManager.Core;
using FinanceManager.Application;
using FinanceManager.Tests.Helpers;
using Xunit;

namespace FinanceManager.Tests
{
    public class FundManagerTests
    {
        [Theory]
        [InlineData(1)]
        [InlineData(100)]
        [InlineData(999)]
        public void AddFundsManually_WhenAmountIsValid_ExpectFundsAdded(decimal amount)
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var testGoal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0, UserId = "user1" };
            dbContext.Goals.Add(testGoal);
            dbContext.SaveChanges();

            var mockGoalManager = new Mock<IGoalManager>();
            mockGoalManager.Setup(m => m.GetGoalById(testGoal.Id)).Returns(testGoal);

            var financeCalculator = new FinanceCalculator();
            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            // Act
            manager.AddFundsManually(testGoal.Id, amount, "Manual deposit");

            // Assert
            mockGoalManager.Verify(m => m.GetGoalById(testGoal.Id), Times.Once);
            Assert.Equal(amount, dbContext.Goals.Find(testGoal.Id)!.CurrentAmount);
        }

        [Fact]
        public void AddFundsManually_WhenGoalNotFound_ExpectException()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockFinanceCalculator = new Mock<IFinanceCalculator>();
            var manager = new FundManager(dbContext, mockGoalManager.Object, mockFinanceCalculator.Object);

            mockGoalManager.Setup(m => m.GetGoalById(It.IsAny<int>())).Returns((Goal?)null);

            // Act & Assert
            Assert.Throws<Exception>(() => manager.AddFundsManually(999, 100, "Test"));
        }

        [Theory]
        [InlineData(1000, 0, 1100, 1000)]
        [InlineData(100, 100, 100, 100)]
        public void AddFundsManually_WhenAmountIsOverflowingTarget_ExpectTargetCapped(decimal targetAmount, decimal currentAmount, decimal payment, decimal expectedAmount)
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();

            var financeCalculator = new FinanceCalculator();
            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            var testGoal = new Goal { Id = 1, Name = "Vacation", TargetAmount = targetAmount, CurrentAmount = currentAmount, Priority = Goal.GoalPriorityEnum.Critical, UserId = "user1" };

            mockGoalManager.Setup(m => m.GetGoalById(testGoal.Id)).Returns(testGoal);

            dbContext.Goals.Add(testGoal);
            dbContext.SaveChanges();

            // Act
            manager.AddFundsManually(testGoal.Id, payment, "Overflow test");

            // Assert
            Assert.Equal(expectedAmount, dbContext.Goals.Find(testGoal.Id)!.CurrentAmount);
        }

        [Fact]
        public void AddFundsAutomatically_WhenNoGoalExists_ExpectNoExceptionThrown()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            // Act & Assert
            var exception = Record.Exception(() => manager.AddFundsAutomatically("user1", 500, "Auto deposit"));
            Assert.Null(exception);
        }

        [Fact]
        public void AddFundsAutomatically_WhenGoalsExist_ExpectFundsDistributed()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            var testGoal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0, Priority = Goal.GoalPriorityEnum.Critical, UserId = "user1" };
            dbContext.Goals.Add(testGoal);
            dbContext.SaveChanges();

            // Act
            var overflow = manager.AddFundsAutomatically("user1", 500, "Auto deposit");

            // Assert
            Assert.Equal(500, dbContext.Goals.Find(testGoal.Id)!.CurrentAmount);
            Assert.Equal(0, overflow);
        }

        [Fact]
        public void CheckOverflowAndHandle_WhenNoOverflow_ExpectFullAmountAdded()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0, UserId = "user1" };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            // Act
            var overflow = manager.CheckOverflowAndHandle(goal, 500, "Test");

            // Assert
            Assert.Equal(0, overflow);
            Assert.Equal(500, goal.CurrentAmount);
        }

        [Fact]
        public void CheckOverflowAndHandle_WhenOverflow_ExpectOverflowReturned()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 900, UserId = "user1" };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            // Act
            var overflow = manager.CheckOverflowAndHandle(goal, 200, "Test");

            // Assert
            Assert.Equal(100, overflow);
            Assert.Equal(1000, goal.CurrentAmount);
        }

        [Fact]
        public void MakeTransaction_ExpectTransactionAdded()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, financeCalculator);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0, UserId = "user1" };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            // Act
            manager.MakeTransaction(goal, 100, "Test deposit");
            dbContext.SaveChanges();

            // Assert
            var transactions = dbContext.Transactions.Where(t => t.GoalId == goal.Id).ToList();
            Assert.Single(transactions);
            Assert.Equal(100, transactions[0].Amount);
            Assert.Equal("Test deposit", transactions[0].Description);
        }
    }
}
