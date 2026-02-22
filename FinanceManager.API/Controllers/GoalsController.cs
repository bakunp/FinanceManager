using FinanceManager.Application;
using FinanceManager.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace FinanceManager.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GoalsController(IGoalManager goalManager) : ControllerBase
    {
        private readonly IGoalManager _goalManager = goalManager;

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public IActionResult GetAllGoals()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var goals = _goalManager.GetAllGoals(userId);
            return Ok(goals);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateGoalRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            _goalManager.AddGoal(
                userId,
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
            var userId = GetUserId();
            var goal = _goalManager.GetGoalById(id);

            if (goal == null) return NotFound();
            if (goal.UserId != userId) return Forbid();

            _goalManager.RemoveSpecificGoal(id);
            return NoContent();
        }

        [HttpPut]
        public IActionResult Modify([FromBody] ModifyGoalRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var goal = _goalManager.GetGoalById(request.Id);

            if (goal == null) return NotFound();
            if (goal.UserId != userId) return Forbid();

            _goalManager.ModifyGoal(
                request.Id,
                request.Name,
                request.TargetAmount,
                request.TargetDate,
                request.Priority
            );

            return Ok("Goal edited successfully!");
        }

        [HttpGet("{id}/history")]
        public IActionResult GetTransactions(int id)
        {
            var userId = GetUserId();
            var goal = _goalManager.GetGoalById(id);

            if (goal == null) return NotFound();
            if (goal.UserId != userId) return Forbid();

            var transactions = _goalManager.GetTransactionsForGoal(id);
            return Ok(transactions);
        }
    }

    public class CreateGoalRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "TargetAmount must be greater than 0")]
        public decimal TargetAmount { get; set; }

        public DateTime? TargetDate { get; set; }
        public Goal.GoalPriorityEnum Priority { get; set; }
    }

    public class ModifyGoalRequest
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "TargetAmount must be greater than 0")]
        public decimal TargetAmount { get; set; }

        public DateTime? TargetDate { get; set; }
        public Goal.GoalPriorityEnum Priority { get; set; }
    }
}
