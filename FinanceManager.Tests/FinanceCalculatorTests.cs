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
        public void CalculatePrioritySumTestExpectPass()
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
    }
}
