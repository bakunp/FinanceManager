using FinanceManager.Core;
using Xunit;

namespace FinanceManager.Tests
{
    public class FinanceCalculatorTests
    {
        private readonly FinanceCalculator _calculator;
        public FinanceCalculatorTests()
        {
            _calculator = new FinanceCalculator();
        }


        [Fact]
        public void CalculatePrioritySum_WhenGoalsHaveDifferentPriorities_ReturnsCorrectSum()
        {
            var goals = new List<Goal>
            {
                new() {Name = "TestGoalPriorityLow", Priority = Goal.GoalPriorityEnum.Low},
                new() {Name = "TestGoalPriorityNormal", Priority = Goal.GoalPriorityEnum.Normal},
                new() {Name = "TestGoalPriorityMedium", Priority = Goal.GoalPriorityEnum.Medium},
                new() {Name = "TestGoalPriorityHigl", Priority = Goal.GoalPriorityEnum.High},
                new() {Name = "TestGoalPriorityCritical", Priority = Goal.GoalPriorityEnum.Critical},
            };

            var result = _calculator.CalculatePrioritySum(goals);

            Assert.Equal(19, result);
        }

        [Theory]
        [InlineData(Goal.GoalPriorityEnum.Low, 0)]
        [InlineData(Goal.GoalPriorityEnum.Normal, 0)]
        [InlineData(Goal.GoalPriorityEnum.Medium, 0)]
        [InlineData(Goal.GoalPriorityEnum.High, 0)]
        [InlineData(Goal.GoalPriorityEnum.Critical, 0)]
        public void AdjustPriorityBasedOnTime_WhenThereIsNoTargetDate_ExpectNoBoostAndPriorityNotChanged(Goal.GoalPriorityEnum priority, int expectedPriorityBoost)
        {
            var goal = new Goal { TargetDate = null, Priority = priority, PriorityBoosted = 0 };
            var goals = new List<Goal> { goal };

            _calculator.AdjustPriorityBasedOnTime(goals);

            Assert.Equal(expectedPriorityBoost, goal.PriorityBoosted);
            Assert.Equal(priority, goal.Priority);
        }

        [Theory]
        [InlineData(Goal.GoalPriorityEnum.Low, 1, 2)]
        [InlineData(Goal.GoalPriorityEnum.Normal, 10, 2)]
        [InlineData(Goal.GoalPriorityEnum.Medium, 17, 2)]
        [InlineData(Goal.GoalPriorityEnum.High, 25, 2)]
        [InlineData(Goal.GoalPriorityEnum.Critical, 31, 2)]

        [InlineData(Goal.GoalPriorityEnum.Low, 32, 1)]
        [InlineData(Goal.GoalPriorityEnum.Normal, 39, 1)]
        [InlineData(Goal.GoalPriorityEnum.Medium, 44, 1)]
        [InlineData(Goal.GoalPriorityEnum.High, 57, 1)]
        [InlineData(Goal.GoalPriorityEnum.Critical, 62, 1)]

        [InlineData(Goal.GoalPriorityEnum.Low, 63, 0)]
        [InlineData(Goal.GoalPriorityEnum.Normal, 77, 0)]
        [InlineData(Goal.GoalPriorityEnum.Medium, 82, 0)]
        [InlineData(Goal.GoalPriorityEnum.High, 93, 0)]
        [InlineData(Goal.GoalPriorityEnum.Critical, 100, 0)]
        public void AdjustPriorityBasedOnTime_WhenThereIsTargetDate_ExpectBoostAndPriorityNotChanged(Goal.GoalPriorityEnum priority, int daysLeft, int expectedPriorityBoost)
        {
            var goal = new Goal { TargetDate = DateTime.Now.AddDays(daysLeft), Priority = priority, PriorityBoosted = 0 };
            var goals = new List<Goal> { goal };

            _calculator.AdjustPriorityBasedOnTime(goals);

            Assert.Equal(expectedPriorityBoost, goal.PriorityBoosted);
            Assert.Equal(priority, goal.Priority);
        }

        [Fact]
        public void CalculateAutoDistribution_WithNoGoals_ExpextReturnEmptyDictionary()
        {
            var goals = new List<Goal>();

            var result = _calculator.CalculateAutoDistribution(goals, 50);

            Assert.Empty(result);
        }

        [Fact]
        public void CalculateAutoDistribution_WithGoalsWithoutPriorityBoosted_ExpextReturnDisctionaryWithCalculatedAmounts()
        {
            var goals = new List<Goal>
            {
                new() {Name = "Goal1", Priority = Goal.GoalPriorityEnum.Low, PriorityBoosted = 0},
                new() {Name = "Goal2", Priority = Goal.GoalPriorityEnum.Normal, PriorityBoosted = 0},
                new() {Name = "Goal3", Priority = Goal.GoalPriorityEnum.Medium, PriorityBoosted = 0},
                new() {Name = "Goal4", Priority = Goal.GoalPriorityEnum.High, PriorityBoosted = 0},
                new() {Name = "Goal5", Priority = Goal.GoalPriorityEnum.Critical, PriorityBoosted = 0},
            };

            var result = _calculator.CalculateAutoDistribution(goals, 190);

            Assert.All(result, entry =>
            {
                var goal = entry.Key;
                var amount = entry.Value;

                var expectedAmount = goal.EffectivePriority * 10;

                Assert.Equal(expectedAmount, amount);
            });
        }

        [Fact]
        public void CalculateAutoDistribution_WithGoalsWithPriorityBoosted_ExpextReturnDisctionaryWithCalculatedAmounts()
        {
            var goals = new List<Goal>
            {
                new() {Name = "Goal1", Priority = Goal.GoalPriorityEnum.Low, PriorityBoosted = 0},
                new() {Name = "Goal2", Priority = Goal.GoalPriorityEnum.Normal, PriorityBoosted = 1},
                new() {Name = "Goal3", Priority = Goal.GoalPriorityEnum.Medium, PriorityBoosted = 2},
                new() {Name = "Goal4", Priority = Goal.GoalPriorityEnum.High, PriorityBoosted = 0},
                new() {Name = "Goal5", Priority = Goal.GoalPriorityEnum.Critical, PriorityBoosted = 1},
            };

            var result = _calculator.CalculateAutoDistribution(goals, 230);

            Assert.All(result, entry =>
            {
                var goal = entry.Key;
                var amount = entry.Value;

                var expectedAmount = goal.EffectivePriority * 10;

                Assert.Equal(expectedAmount, amount);
            });
        }

        [Theory]
        //Happy Path
        //Goal: 10, Current: 0, Payment: 1
        //Expected: Paid: 1, Rest: 0
        [InlineData(10, 0, 1, 1, 0)]
        //Full Overflow
        //Goal: 100, Current: 100, Payment: 100
        //Expected: Paid: 0, Rest: 100
        [InlineData(100, 100, 100, 0, 100)]
        //Partial Overflow
        //Goal: 100, Current: 75, Payment: 1000
        //Expected: Paid: 25, Rest: 75
        [InlineData(100, 75, 100, 25, 75)]
        //Negative Path
        //Goal: 100, Current: 110, Payment: 30
        //Expected: Paid: 0, Rest: 30
        [InlineData(100, 110, 30, 0, 30)]
        public void OverflowCheck_WithDifferentData_ExpectReturnValidSpaceLeftAndOverflow(decimal target, decimal current, decimal payment, decimal expectedAllocated, decimal expectedOverflow)
        {
            var goal = new Goal { Name = "Goal", TargetAmount = target, CurrentAmount = current };

            var (allocated, overflow) = _calculator.OverflowCheck(goal, payment);

            Assert.Equal(expectedAllocated, allocated);
            Assert.Equal(expectedOverflow, overflow);
        }

    }
}
