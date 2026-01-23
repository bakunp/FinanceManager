using FinanceManager.ConsoleApp;
using FinanceManager.Core;
using FinanceManager.Data;
using FinanceManager.Tests.Helpers;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinanceManager.Tests
{
    public class GoalManagerTests
    {
        [Fact]
        public void AddGoal_WithValidInput_ExpectGoalAdded()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            mockReader.Setup(m => m.GetInputData())
                      .Returns(("Vacations", 1000m, DateTime.Now.AddMonths(6), Goal.GoalPriorityEnum.Critical));

            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            manager.AddGoal();

            //Assert
            var goal = dbContext.Goals.FirstOrDefault(g => g.Name == "Vacations");
            Assert.NotNull(goal);
            Assert.Equal(1000m, goal.TargetAmount);
            Assert.Equal(Goal.GoalPriorityEnum.Critical, goal.Priority);
            Assert.NotNull(goal.TargetDate);
            Assert.Equal(0m, goal.CurrentAmount);
        }

        [Fact]
        public void ShowGoals_WithEmptyDatabase_ExpectReturnWithoutErrors()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();

            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            manager.ShowGoals();

            //Assert
            var exception = Record.Exception(() => manager.ShowGoals());
            Assert.Null(exception);
        }

        [Fact]
        public void ShowGoals_WithValidGoals_ExpectReturnWithoutErrors()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();

            var goal1 = new Goal
            {
                Name = "New Car",
                TargetAmount = 20000m,
                CurrentAmount = 5000m,
                TargetDate = DateTime.Now.AddYears(1),
                Priority = Goal.GoalPriorityEnum.High
            };
            dbContext.Goals.Add(goal1);
            dbContext.SaveChanges();

            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            manager.ShowGoals();

            //Assert
            var exception = Record.Exception(() => manager.ShowGoals());
            Assert.Null(exception);
        }

        [Fact]
        public void ModifyGoal_WithValidInput_ExpectGoalModified()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var date = DateTime.Now;
            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical, TargetDate = date };

            
            mockReader.Setup(m => m.GetInputData(It.IsAny<Goal>())).Returns(("Vacations", 1234m, date.AddDays(2), Goal.GoalPriorityEnum.High));

            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            manager.ModifyGoal(dbContext.Goals.Find(goal.Id));

            //Assert

            Assert.Equal("Vacations", goal.Name);
            Assert.Equal(1234, goal.TargetAmount);
            Assert.Equal(date.AddDays(2), goal.TargetDate);
            Assert.Equal(Goal.GoalPriorityEnum.High, goal.Priority);

        }

    }
}
