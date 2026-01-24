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
            var date = DateTime.Now;
            mockReader.Setup(m => m.GetInputData())
                      .Returns(("Vacations", 1000m, date, Goal.GoalPriorityEnum.Critical));

            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            manager.AddGoal();

            //Assert
            var goal = dbContext.Goals.FirstOrDefault(g => g.Name == "Vacations");
            Assert.NotNull(goal);
            Assert.Equal(1000m, goal.TargetAmount);
            Assert.Equal(Goal.GoalPriorityEnum.Critical, goal.Priority);
            Assert.Equal(date, goal.TargetDate);
            Assert.Equal(0m, goal.CurrentAmount);
            mockReader.Verify(m => m.GetInputData(), Times.Once);
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

        [Fact]
        public void ModifyGoal_WithNullGoal_ExpectReturnWithoutError()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            var exception = Record.Exception(() => manager.ModifyGoal(null));

            //Assert
            Assert.Null(exception);
        }

        [Fact]
        public void RemoveSpecificGoal_WithNullGoal_ExpectReturnWithoutError()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            var exception = Record.Exception(() => manager.RemoveSpecificGoal(null));

            //Assert
            Assert.Null(exception);
        }

        [Fact]
        public void RemoveSpecificGoal_WithValidGoal_ExpectGoalDeletedWithoutError()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical };

            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            //Act
            var exception = Record.Exception(() => manager.RemoveSpecificGoal(dbContext.Goals.Find(goal.Id)));

            //Assert
            Assert.Null(exception);
            Assert.Null(dbContext.Goals.Find(goal.Id));
        }

        [Fact]
        public void RemoveAllGoals_ExpectAllGoalsDeletedWithoutError()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            var goal1 = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical };
            var goal2 = new Goal { Id = 2, Name = "New Car", TargetAmount = 20000, Priority = Goal.GoalPriorityEnum.High };

            dbContext.Goals.Add(goal1);
            dbContext.Goals.Add(goal2);
            dbContext.SaveChanges();

            //Act
            var exception = Record.Exception(() => manager.RemoveAllGoals());

            //Assert
            Assert.Null(exception);
            Assert.Empty(dbContext.Goals.ToList());
        }

        [Fact]
        public void RemoveAllGoals_WithEmptyDatabase_ExpectReturnWithoutErrors()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            //Act
            var exception = Record.Exception(() => manager.RemoveAllGoals());

            //Assert
            Assert.Null(exception);
            Assert.Empty(dbContext.Goals.ToList());
        }

        [Fact]
        public void FindGoal_WithEmptyGoalID_ExpectReturnNull()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            mockReader.Setup(m => m.GetGoalID()).Returns("");

            //Act
            var result = manager.FindGoal();

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("abc", "")]
        [InlineData("999", "")]
        public void FindGoal_WithInvalidGoalID_ExpectReturnNull(string wrongID, string validID)
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            Goal goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            mockReader.SetupSequence(m => m.GetGoalID()).Returns(wrongID).Returns(validID);

            //Act
            var result = manager.FindGoal();

            //Assert
            Assert.Null(result);
        }

        [Fact]
        public void FindGoal_WithValidGoalID_ExpectReturnGoal()
        {
            //Arrange
            var dbContext = DbContextFactory.Create();
            var mockReader = new Mock<IInputReader>();
            var manager = new GoalManager(dbContext, mockReader.Object);

            Goal goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();
            
            mockReader.Setup(m => m.GetGoalID()).Returns("1");
            
            //Act
            var result = manager.FindGoal();
            
            //Assert
            Assert.NotNull(result);
            Assert.Equal(goal.Id, result.Id);
        }
    }
}
