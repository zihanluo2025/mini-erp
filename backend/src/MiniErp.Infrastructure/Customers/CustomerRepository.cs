using MiniErp.Application.Abstractions;
using MiniErp.Application.Customers;
using MiniErp.Application.Customers.Models;

namespace MiniErp.Infrastructure.Customers;

public sealed class CustomerRepository : ICustomerRepository
{
    private static readonly List<CustomerDto> _data = new();

    public Task<PagedResult<CustomerDto>> GetListAsync(
        CustomerListQuery query,
        CancellationToken cancellationToken = default)
    {
        IEnumerable<CustomerDto> items = _data;

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var keyword = query.Keyword.Trim();

            items = items.Where(x =>
                x.CustomerCode.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                x.CustomerName.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                x.CompanyName.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                x.ContactPerson.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                (x.ContactEmail?.Contains(keyword, StringComparison.OrdinalIgnoreCase) ?? false) ||
                x.Region.Contains(keyword, StringComparison.OrdinalIgnoreCase));
        }

        var result = items
            .OrderByDescending(x => x.UpdatedAt)
            .Take(query.Limit)
            .ToList();

        return Task.FromResult(new PagedResult<CustomerDto>(result, null));
    }

    public Task<CustomerSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new CustomerSummaryDto(
            _data.Count,
            _data.Count(x => x.Status == "Active"),
            _data.Count(x => x.Segment == "Enterprise"),
            _data.Count(x => x.Status == "Prospect")
        ));
    }

    public Task<CustomerDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_data.FirstOrDefault(x => x.Id == id));
    }

    public Task<CustomerDto> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var item = new CustomerDto(
            Guid.NewGuid().ToString("N"),
            request.CustomerCode,
            request.CustomerName,
            request.CompanyName,
            request.Segment,
            request.ContactPerson,
            request.ContactEmail,
            request.ContactPhone,
            request.Region,
            request.Address,
            request.Status,
            request.Notes,
            DateTime.UtcNow,
            DateTime.UtcNow
        );

        _data.Add(item);
        return Task.FromResult(item);
    }

    public Task<CustomerDto?> UpdateAsync(string id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var existing = _data.FirstOrDefault(x => x.Id == id);
        if (existing is null)
        {
            return Task.FromResult<CustomerDto?>(null);
        }

        var updated = existing with
        {
            CustomerCode = request.CustomerCode,
            CustomerName = request.CustomerName,
            CompanyName = request.CompanyName,
            Segment = request.Segment,
            ContactPerson = request.ContactPerson,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Region = request.Region,
            Address = request.Address,
            Status = request.Status,
            Notes = request.Notes,
            UpdatedAt = DateTime.UtcNow
        };

        _data.Remove(existing);
        _data.Add(updated);

        return Task.FromResult<CustomerDto?>(updated);
    }

    public Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var item = _data.FirstOrDefault(x => x.Id == id);
        if (item is null)
        {
            return Task.FromResult(false);
        }

        _data.Remove(item);
        return Task.FromResult(true);
    }

    public Task BulkDeleteAsync(IEnumerable<string> ids, CancellationToken cancellationToken = default)
    {
        var set = ids.ToHashSet();
        _data.RemoveAll(x => set.Contains(x.Id));
        return Task.CompletedTask;
    }
}