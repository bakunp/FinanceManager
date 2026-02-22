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
    public class FixedExpenseController(IFixedExpenseManager fixedExpenseManager) : ControllerBase
    {
        private readonly IFixedExpenseManager _fixedExpenseManager = fixedExpenseManager;

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public IActionResult GetFixedExpenses()
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var expenses = _fixedExpenseManager.GetAllFixedExpenses(userId);
            return Ok(expenses);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateFixedExpenseRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            _fixedExpenseManager.AddFixedExpense(
                userId,
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
            var userId = GetUserId();
            var expense = _fixedExpenseManager.GetById(id);

            if (expense == null) return NotFound();
            if (expense.UserId != userId) return Forbid();

            _fixedExpenseManager.RemoveFixedExpense(id);
            return NoContent();
        }

        [HttpPut]
        public IActionResult Modify([FromBody] ModifyFixedExpenseRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var expense = _fixedExpenseManager.GetById(request.Id);

            if (expense == null) return NotFound();
            if (expense.UserId != userId) return Forbid();

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
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        public DateTime FirstPaymentDate { get; set; }

        [Range(1, 365)]
        public int FrequencyInterval { get; set; }

        public int Unit { get; set; }
    }

    public class ModifyFixedExpenseRequest
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        public DateTime FirstPaymentDate { get; set; }

        [Range(1, 365)]
        public int FrequencyInterval { get; set; }

        public int Unit { get; set; }
    }
}
