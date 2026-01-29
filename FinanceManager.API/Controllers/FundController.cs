using FinanceManager.Application;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FundController(IFundManager fundManager) : ControllerBase
    {
        private readonly IFundManager _fundManager = fundManager;

        [HttpPut]
        public IActionResult AddFundsAutomatically([FromBody] AddFundsAutomaticallyRequest request)
        {
            _fundManager.AddFundsAutomatically(request.Amount);

            return Ok("Fund added automatically");
        }

        [HttpPut("manual")]
        public IActionResult AddFundsManually([FromBody] AddFundsManuallyRequest request)
        {
            _fundManager.AddFundsManually(request.GoalId, request.Amount);

            return Ok("Fund added automatically");
        }
    }

    public class AddFundsAutomaticallyRequest
    {
        public decimal Amount { get; set; }
    }

    public class AddFundsManuallyRequest
    {
        public int GoalId { get; set; }
        public decimal Amount { get; set; }
    }
}
