using FinanceManager.Application;
using FinanceManager.Core;
using FinanceManager.Tests.Helpers;

namespace FinanceManager.Tests
{
    public class GoalManagerTests
    {
        [Fact]
        public void AddGoal_WithValidInput_ExpectGoalAdded()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var date = DateTime.Now;
            var manager = new GoalManager(dbContext);

            // Act
            manager.AddGoal("user1", "Vacations", 1000m, date, Goal.GoalPriorityEnum.Critical);

            // Assert
            var goal = dbContext.Goals.FirstOrDefault(g => g.Name == "Vacations");
            Assert.NotNull(goal);
            Assert.Equal(1000m, goal.TargetAmount);
            Assert.Equal(Goal.GoalPriorityEnum.Critical, goal.Priority);
            Assert.Equal(date, goal.TargetDate);
            Assert.Equal(0m, goal.CurrentAmount);
            Assert.Equal("user1", goal.UserId);
        }

        [Fact]
        public void GetAllGoals_WithEmptyDatabase_ExpectEmptyList()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            // Act
            var goals = manager.GetAllGoals("user1");

            // Assert
            Assert.Empty(goals);
        }

        [Fact]
        public void GetAllGoals_WithValidGoals_ExpectGoalsReturned()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var goal1 = new Goal
            {
                Name = "New Car",
                TargetAmount = 20000m,
                CurrentAmount = 5000m,
                TargetDate = DateTime.Now.AddYears(1),
                Priority = Goal.GoalPriorityEnum.High,
                UserId = "user1"
            };
            dbContext.Goals.Add(goal1);
            dbContext.SaveChanges();

            var manager = new GoalManager(dbContext);

            // Act
            var goals = manager.GetAllGoals("user1");

            // Assert
            Assert.Single(goals);
            Assert.Equal("New Car", goals[0].Name);
        }

        [Fact]
        public void ModifyGoal_WithValidInput_ExpectGoalModified()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var date = DateTime.Now;
            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical, TargetDate = date, UserId = "user1" };

            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            var manager = new GoalManager(dbContext);

            // Act
            manager.ModifyGoal(goal.Id, "Vacations", 1234m, date.AddDays(2), Goal.GoalPriorityEnum.High);

            // Assert
            var modified = dbContext.Goals.Find(goal.Id);
            Assert.NotNull(modified);
            Assert.Equal("Vacations", modified.Name);
            Assert.Equal(1234, modified.TargetAmount);
            Assert.Equal(date.AddDays(2), modified.TargetDate);
            Assert.Equal(Goal.GoalPriorityEnum.High, modified.Priority);
        }

        [Fact]
        public void ModifyGoal_WithNonExistentId_ExpectNoError()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            // Act
            var exception = Record.Exception(() => manager.ModifyGoal(999, "Test", 100m, null, Goal.GoalPriorityEnum.Low));

            // Assert
            Assert.Null(exception);
        }

        [Fact]
        public void RemoveSpecificGoal_WithNonExistentId_ExpectNoError()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            // Act
            var exception = Record.Exception(() => manager.RemoveSpecificGoal(999));

            // Assert
            Assert.Null(exception);
        }

        [Fact]
        public void RemoveSpecificGoal_WithValidGoal_ExpectGoalDeleted()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical, UserId = "user1" };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            // Act
            var exception = Record.Exception(() => manager.RemoveSpecificGoal(goal.Id));

            // Assert
            Assert.Null(exception);
            Assert.Null(dbContext.Goals.Find(goal.Id));
        }

        [Fact]
        public void RemoveAllGoals_ExpectAllGoalsDeleted()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            var goal1 = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical, UserId = "user1" };
            var goal2 = new Goal { Id = 2, Name = "New Car", TargetAmount = 20000, Priority = Goal.GoalPriorityEnum.High, UserId = "user1" };

            dbContext.Goals.Add(goal1);
            dbContext.Goals.Add(goal2);
            dbContext.SaveChanges();

            // Act
            var exception = Record.Exception(() => manager.RemoveAllGoals("user1"));

            // Assert
            Assert.Null(exception);
            Assert.Empty(dbContext.Goals.Where(g => g.UserId == "user1").ToList());
        }

        [Fact]
        public void RemoveAllGoals_WithEmptyDatabase_ExpectNoError()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            // Act
            var exception = Record.Exception(() => manager.RemoveAllGoals("user1"));

            // Assert
            Assert.Null(exception);
            Assert.Empty(dbContext.Goals.Where(g => g.UserId == "user1").ToList());
        }

        [Fact]
        public void GetGoalById_WithValidId_ExpectGoalReturned()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical, UserId = "user1" };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            // Act
            var result = manager.GetGoalById(goal.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(goal.Id, result.Id);
        }

        [Fact]
        public void GetGoalById_WithInvalidId_ExpectNull()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            // Act
            var result = manager.GetGoalById(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetTransactionsForGoal_WithValidGoal_ExpectTransactionsReturned()
        {
            // Arrange
            var dbContext = DbContextFactory.Create();
            var manager = new GoalManager(dbContext);

            var goal = new Goal { Id = 1, Name = "Vacation", TargetAmount = 1000, Priority = Goal.GoalPriorityEnum.Critical, UserId = "user1" };
            dbContext.Goals.Add(goal);
            dbContext.SaveChanges();

            var transaction = new Transaction { GoalId = goal.Id, Amount = 100, Date = DateTime.Now, Description = "Test" };
            dbContext.Transactions.Add(transaction);
            dbContext.SaveChanges();

            // Act
            var result = manager.GetTransactionsForGoal(goal.Id);

            // Assert
            Assert.Single(result);
            Assert.Equal(100, result[0].Amount);
        }
    }
}
