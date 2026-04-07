using MiniErp.Application.Abstractions;
using MiniErp.Application.Customers.Models;

namespace MiniErp.Application.Customers;

public sealed class CustomerService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public Task<PagedResult<CustomerDto>> GetCustomersAsync(
        CustomerListQuery query,
        CancellationToken cancellationToken = default)
    {
        return _customerRepository.GetListAsync(query, cancellationToken);
    }

    public Task<CustomerSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        return _customerRepository.GetSummaryAsync(cancellationToken);
    }

    public Task<CustomerDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return _customerRepository.GetByIdAsync(id, cancellationToken);
    }

    public Task<CustomerDto> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        return _customerRepository.CreateAsync(request, cancellationToken);
    }

    public Task<CustomerDto?> UpdateAsync(
        string id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default)
    {
        return _customerRepository.UpdateAsync(id, request, cancellationToken);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        return _customerRepository.DeleteAsync(id, cancellationToken);
    }

    public Task BulkDeleteAsync(IEnumerable<string> ids, CancellationToken cancellationToken = default)
    {
        return _customerRepository.BulkDeleteAsync(ids, cancellationToken);
    }
}