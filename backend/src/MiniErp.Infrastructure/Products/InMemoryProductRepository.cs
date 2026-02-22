using System.Collections.Concurrent;
using MiniErp.Application.Products;
using MiniErp.Application.Products.Models;

namespace MiniErp.Infrastructure.Products;

public sealed class InMemoryProductRepository : IProductRepository
{
    // orgId -> (productId -> Product)
    private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, ProductDto>> Store = new();

    private static ConcurrentDictionary<string, ProductDto> GetOrgStore(string orgId)
        => Store.GetOrAdd(orgId, _ => new ConcurrentDictionary<string, ProductDto>());

    public Task CreateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        GetOrgStore(orgId)[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task<ProductDto?> GetAsync(string orgId, string productId, CancellationToken ct)
    {
        var orgStore = GetOrgStore(orgId);
        orgStore.TryGetValue(productId, out var p);
        return Task.FromResult<ProductDto?>(p);
    }

    public Task<IReadOnlyList<ProductDto>> ListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
    {
        var orgStore = GetOrgStore(orgId);

        var list = orgStore.Values
            .Where(x => !x.IsDeleted)
            .Where(x => string.IsNullOrWhiteSpace(keyword) ||
                        x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                        x.Sku.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(x => x.CreatedAt)
            .Take(Math.Clamp(limit, 1, 200))
            .ToList()
            .AsReadOnly();

        return Task.FromResult<IReadOnlyList<ProductDto>>(list);
    }

    public Task UpdateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        GetOrgStore(orgId)[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task SoftDeleteAsync(string orgId, string productId, CancellationToken ct)
    {
        var orgStore = GetOrgStore(orgId);
        if (orgStore.TryGetValue(productId, out var p))
        {
            orgStore[productId] = p with { IsDeleted = true };
        }
        return Task.CompletedTask;
    }
}