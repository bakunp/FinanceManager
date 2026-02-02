using FinanceManager.Application;
using FinanceManager.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FixedExpenseController(IFixedExpenseManager fixedExpenseManager) : ControllerBase
    {
        private readonly IFixedExpenseManager _fixedExpenseManager = fixedExpenseManager;
        [HttpGet]
        public IActionResult GetFixedExpenses()
        {
            var expenses = _fixedExpenseManager.GetAllFixedExpenses();
            return Ok(expenses);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateFixedExpenseRequest request)
        {
            _fixedExpenseManager.AddFixedExpense(
                request.Name,
                request.Amount,
                request.FirstPaymentDate,
                request.FrequencyInterval,
                request.Unit
            );
            return Ok("Fixed expense added successfully!");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFixedExpense(int id)
        {
            _fixedExpenseManager.RemoveFixedExpense(id);
            return NoContent();
        }

        [HttpPut]
        public IActionResult Modify([FromBody] ModifyFixedExpenseRequest request)
        {
            _fixedExpenseManager.ModifyFixedExpense(
                request.Id,
                request.Name,
                request.Amount,
                request.FirstPaymentDate,
                request.FrequencyInterval,
                request.Unit
            );
            return Ok("Fixed expense modified successfully!");
        }
    }

    public class CreateFixedExpenseRequest
    {
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime FirstPaymentDate { get; set; }
        public int FrequencyInterval { get; set; }
        public int Unit { get; set; }
    }

    public class ModifyFixedExpenseRequest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime FirstPaymentDate { get; set; }
        public int FrequencyInterval { get; set; }
        public int Unit { get; set; }
    }
}
