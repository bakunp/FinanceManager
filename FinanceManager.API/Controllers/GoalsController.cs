using FinanceManager.Application;
using FinanceManager.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoalsController(IGoalManager goalManager) : ControllerBase
    {
        private readonly IGoalManager _goalManager = goalManager;
        [HttpGet]
        public IActionResult GetAllGoals()
        {
            var goals = _goalManager.GetAllGoals();
            return Ok(goals);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateGoalRequest request)
        {
            _goalManager.AddGoal(
                request.Name,
                request.TargetAmount,
                request.TargetDate,
                request.Priority
            );

            return Ok("Goal added successfully!");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteGoal(int id)
        {
            _goalManager.RemoveSpecificGoal(id);
            return NoContent();
        }

        [HttpDelete]
        public IActionResult DeleteAll()
        {
            _goalManager.RemoveAllGoals();
            return Ok("All goals deleted successfully!");
        }

        [HttpPut]
        public IActionResult Modify([FromBody] ModifyGoalRequest request)
        {
            _goalManager.ModifyGoal(
                request.Id,
                request.Name,
                request.TargetAmount,
                request.TargetDate,
                request.Priority
            );

            return Ok("Goal edited successfully!");
        }
    }
    public class CreateGoalRequest
    {
        public string Name { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public DateTime? TargetDate { get; set; }
        public Goal.GoalPriorityEnum Priority { get; set; }
    }

    public class ModifyGoalRequest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public DateTime? TargetDate { get; set; }
        public Goal.GoalPriorityEnum Priority { get; set; }
    }
}
