using MiniErp.Application.Products.Models;

namespace MiniErp.Application.Products;

public interface IProductRepository
{
    Task<ProductDto?> GetAsync(string orgId, string productId, CancellationToken ct);
    Task<IReadOnlyList<ProductDto>> ListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct);
    Task CreateAsync(string orgId, ProductDto product, CancellationToken ct);
    Task UpdateAsync(string orgId, ProductDto product, CancellationToken ct);
    Task SoftDeleteAsync(string orgId, string productId, CancellationToken ct);
}