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
            var testGoal = new Goal { Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0 };
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

        [Theory]
        [InlineData(1)]
        [InlineData(100)]
        [InlineData(999)]
        public void AddFundsManually_WhenAmountIsValid_ExpectFundsAdded(decimal amount)
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var testGoal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0 };
            dbContext.Add(testGoal);
            dbContext.SaveChanges();

            var mockReader = new Mock<IInputReader>();
            mockReader.Setup(m => m.GetTransactionAmount()).Returns(amount);

            var mockGoalManager = new Mock<IGoalManager>();
            mockGoalManager.Setup(m => m.FindGoal(It.IsAny<string>())).Returns(testGoal);

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, new FinanceCalculator());

            // Act
            manager.AddFundsManually();

            // Assert
            mockReader.Verify(m => m.GetTransactionAmount(), Times.Once);
            mockGoalManager.Verify(m => m.FindGoal(It.IsAny<string>()), Times.Once);
            Assert.Equal(amount, dbContext.Goals.Find(testGoal.Id)!.CurrentAmount);
        }

        [Fact]
        public void AddFundsManually_WhenGoalNotFound_ExpectReturn()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockReader = new Mock<IInputReader>();
            var mockFinanceCalculator = new Mock<IFinanceCalculator>();
            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, mockFinanceCalculator.Object);

            mockGoalManager.Setup(m => m.FindGoal(It.IsAny<string>())).Returns((Goal?)null);
            mockReader.Setup(m => m.GetTransactionAmount()).Returns(100);

            //Act
            manager.AddFundsManually();

            //Assert
            mockFinanceCalculator.Verify(m => m.OverflowCheck(It.IsAny<Goal>(), It.IsAny<decimal>()), Times.Never);
        }

        [Theory]
        [InlineData(1000, 0, 1100, 1000)]
        [InlineData(100, 100, 100, 100)]
        public void AddFundsManually_WhenAmountIsOverflowingTarget_ExpectTargetFulfilledAndNotProceedWithReassigningTheFunds(decimal targetAmount, decimal currentAmount, decimal payment, decimal expectedAmount)
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockReader = new Mock<IInputReader>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, financeCalculator);

            var testGoal1 = new Goal { Id = 1, Name = "Vacation", TargetAmount = targetAmount, CurrentAmount = currentAmount, Priority = Goal.GoalPriorityEnum.Critical };
            var testGoal2 = new Goal { Id = 2, Name = "Medicines", TargetAmount = 100000, CurrentAmount = 0, Priority = Goal.GoalPriorityEnum.Critical };

            mockGoalManager.Setup(m => m.FindGoal(It.IsAny<string>())).Returns(testGoal1);
            mockReader.Setup(m => m.GetYesNoChoice()).Returns("n");

            dbContext.Add(testGoal1);
            dbContext.Add(testGoal2);

            //Act
            manager.AddFundsManually(payment);

            //Assert
            mockReader.Verify(m => m.GetYesNoChoice(), Times.Once);
            Assert.Equal(expectedAmount, dbContext.Goals.Find(testGoal1.Id)!.CurrentAmount);
            Assert.Equal(0, dbContext.Goals.Find(testGoal2.Id)!.CurrentAmount);
        }

        [Theory]
        [InlineData(1000, 0, 1100, 1000, 100, "1")]
        [InlineData(1000, 0, 1100, 1000, 100, "2")]
        [InlineData(1000, 0, 1100, 1000, 0, "")]
        [InlineData(100, 100, 100, 100, 100, "1")]
        [InlineData(100, 100, 100, 100, 100, "2")]
        [InlineData(100, 100, 100, 100, 0, "")]
        public void AddFundsManually_WhenAmountIsOverflowingTarget_ExpectTargetFulfilledAndProceedWithReassigningTheFunds(decimal targetAmount, decimal currentAmount, decimal payment, decimal expectedAmountOnFirstGoal, decimal expectedAmountOnSecondGoal, string choice)
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockReader = new Mock<IInputReader>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, financeCalculator);

            var testGoal1 = new Goal { Id = 1, Name = "Vacation", TargetAmount = targetAmount, CurrentAmount = currentAmount, Priority = Goal.GoalPriorityEnum.Critical };
            var testGoal2 = new Goal { Id = 2, Name = "Medicines", TargetAmount = 1000000, CurrentAmount = 0, Priority = Goal.GoalPriorityEnum.Critical };

            mockGoalManager.SetupSequence(m => m.FindGoal(It.IsAny<string>()))
                .Returns(testGoal1)
                .Returns(testGoal2);
            mockReader.Setup(m => m.GetYesNoChoice()).Returns("y");
            mockReader.Setup(m => m.Get1Or2OrSkipChoice()).Returns(choice);

            dbContext.Add(testGoal1);
            dbContext.Add(testGoal2);
            dbContext.SaveChanges();

            //Act
            manager.AddFundsManually(payment);

            //Assert
            mockReader.Verify(m => m.GetYesNoChoice(), Times.Once);
            Assert.Equal(expectedAmountOnFirstGoal, dbContext.Goals.Find(testGoal1.Id)!.CurrentAmount);
            Assert.Equal(expectedAmountOnSecondGoal, dbContext.Goals.Find(testGoal2.Id)!.CurrentAmount);
        }

        [Fact]
        public void AddFundsManually_WhenNoOtherGoalsAvailable_ExpectNoExceptionThrown()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockReader = new Mock<IInputReader>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, financeCalculator);

            var testGoal1 = new Goal { Id = 1, Name = "Vacation", Priority = Goal.GoalPriorityEnum.Critical };

            mockGoalManager.Setup(m => m.FindGoal(It.IsAny<string>())).Returns(testGoal1);
            mockReader.Setup(m => m.GetYesNoChoice()).Returns("y");

            dbContext.Add(testGoal1);
            dbContext.SaveChanges();

            //Act & Assert
            var exception = Record.Exception(() => manager.AddFundsManually(200));
            Assert.Null(exception);
            Assert.Equal(1000, dbContext.Goals.Find(testGoal1.Id)!.CurrentAmount);
        }

        [Theory]
        [InlineData(0, 0, "1")]
        [InlineData(500, 500, "1")]
        [InlineData(500, 500, "2")]
        [InlineData(500, 0, "")]
        public void AddFundsToGoals_WithEveryParameter_ExpectFundsAdded(decimal transactionAmount, decimal expectedAmount, string choice)
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockReader = new Mock<IInputReader>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, financeCalculator);

            var testGoal1 = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, CurrentAmount = 0, Priority = Goal.GoalPriorityEnum.Critical };

            dbContext.Add(testGoal1);
            dbContext.SaveChanges();

            mockGoalManager.Setup(m => m.FindGoal(It.IsAny<string>())).Returns(testGoal1);
            mockReader.Setup(m => m.GetTransactionAmount()).Returns(transactionAmount);
            mockReader.Setup(m => m.Get1Or2OrSkipChoice()).Returns(choice);

            //Act
            manager.AddFundsToGoals();

            //Assert
            mockReader.Verify(m => m.Get1Or2OrSkipChoice(), Times.Once);
            Assert.Equal(expectedAmount, dbContext.Goals.Find(testGoal1.Id)!.CurrentAmount);
        }

        [Fact]
        public void AddFundsAutomatically_WhenNoGoalExists_ExpectNoExceptionThrown()
        {
            //Arrange
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockGoalManager = new Mock<IGoalManager>();
            var mockReader = new Mock<IInputReader>();
            var financeCalculator = new FinanceCalculator();

            var manager = new FundManager(dbContext, mockGoalManager.Object, mockReader.Object, financeCalculator);

            //Act & Assert
            var exception = Record.Exception(() => manager.AddFundsAutomatically(500));
            Assert.Null(exception);
        }
    }
}
