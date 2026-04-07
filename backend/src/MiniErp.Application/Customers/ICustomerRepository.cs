using MiniErp.Application.Abstractions;
using MiniErp.Application.Customers.Models;

namespace MiniErp.Application.Customers;

public interface ICustomerRepository
{
    Task<PagedResult<CustomerDto>> GetListAsync(CustomerListQuery query, CancellationToken cancellationToken = default);
    Task<CustomerSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
    Task<CustomerDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<CustomerDto> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<CustomerDto?> UpdateAsync(string id, UpdateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    Task BulkDeleteAsync(IEnumerable<string> ids, CancellationToken cancellationToken = default);
}