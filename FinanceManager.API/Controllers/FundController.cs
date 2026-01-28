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
        public IActionResult AddFundsAutomatically([FromBody] AddFundsRequest request)
        {
            _fundManager.AddFundsAutomatically(request.Amount);

            return Ok("Fund added automatically");
        }
    }

    public class AddFundsRequest
    {
        public decimal Amount { get; set; }
    }
}
