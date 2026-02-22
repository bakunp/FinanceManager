using FinanceManager.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceManager.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FundController(IFundManager fundManager, IGoalManager goalManager) : ControllerBase
    {
        private readonly IFundManager _fundManager = fundManager;
        private readonly IGoalManager _goalManager = goalManager;

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPut]
        public IActionResult AddFundsAutomatically([FromBody] AddFundsAutomaticallyRequest request)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            _fundManager.AddFundsAutomatically(userId, request.Amount, request.Description);

            return Ok("Funds added automatically");
        }

        [HttpPut("manual")]
        public IActionResult AddFundsManually([FromBody] AddFundsManuallyRequest request)
        {
            var userId = GetUserId();

            var goal = _goalManager.GetGoalById(request.GoalId);
            if (goal == null) return NotFound();
            if (goal.UserId != userId) return Forbid();

            _fundManager.AddFundsManually(request.GoalId, request.Amount, request.Description);

            return Ok("Funds added manually");
        }
    }

    public class AddFundsAutomaticallyRequest
    {
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class AddFundsManuallyRequest
    {
        public int GoalId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
