using Microsoft.AspNetCore.Mvc;
using MiniErp.Application.Customers;
using MiniErp.Application.Customers.Models;

namespace MiniErp.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _customerService;

    public CustomersController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    // GET /api/customers
    [HttpGet]
    public async Task<ActionResult> GetList(
        [FromQuery] string? keyword,
        [FromQuery] int limit = 50,
        [FromQuery] string? cursor = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _customerService.GetCustomersAsync(
            new CustomerListQuery(keyword, limit, cursor),
            cancellationToken);

        return Ok(result);
    }

    // GET /api/customers/summary
    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var result = await _customerService.GetSummaryAsync(cancellationToken);
        return Ok(result);
    }

    // GET /api/customers/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(string id, CancellationToken cancellationToken)
    {
        var result = await _customerService.GetByIdAsync(id, cancellationToken);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    // POST /api/customers
    [HttpPost]
    public async Task<ActionResult> Create(
        [FromBody] CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _customerService.CreateAsync(request, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // PUT /api/customers/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(
        string id,
        [FromBody] UpdateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _customerService.UpdateAsync(id, request, cancellationToken);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    // DELETE /api/customers/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        var success = await _customerService.DeleteAsync(id, cancellationToken);

        if (!success)
            return NotFound();

        return NoContent();
    }

    // POST /api/customers/bulk-delete
    [HttpPost("bulk-delete")]
    public async Task<ActionResult> BulkDelete(
        [FromBody] IEnumerable<string> ids,
        CancellationToken cancellationToken)
    {
        await _customerService.BulkDeleteAsync(ids, cancellationToken);
        return NoContent();
    }
}