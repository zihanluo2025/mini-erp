using MiniErp.Application.Abstractions;
using MiniErp.Application.Products;
using MiniErp.Application.Products.Models;

namespace MiniErp.Infrastructure.Products;

public sealed class InMemoryProductRepository : IProductRepository
{
    // 用 ProductDto 直接存，不需要 InMemoryProductEntity
    private readonly Dictionary<string, ProductDto> _items = new();

    private static string Key(string orgId, string productId) => $"{orgId}#{productId}";

    public Task CreateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        _items[Key(orgId, product.Id)] = product;
        return Task.CompletedTask;
    }

    public Task<ProductDto?> GetAsync(string orgId, string productId, CancellationToken ct)
    {
        _items.TryGetValue(Key(orgId, productId), out var dto);
        if (dto is null) return Task.FromResult<ProductDto?>(null);
        return Task.FromResult<ProductDto?>(dto.IsDeleted ? null : dto);
    }

    // ✅ 保留原来的不分页 List 接口
    public Task<IReadOnlyList<ProductDto>> ListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
    {
        limit = Math.Clamp(limit, 1, 200);

        var list = _items
            .Where(kv => kv.Key.StartsWith(orgId + "#", StringComparison.Ordinal))
            .Select(kv => kv.Value)
            .Where(x => !x.IsDeleted)
            .Where(x => string.IsNullOrWhiteSpace(keyword)
                     || x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                     || x.Sku.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(x => x.UpdatedAt) // 随便选一个排序规则，便于分页稳定
            .Take(limit)
            .ToList()
            .AsReadOnly();

        return Task.FromResult<IReadOnlyList<ProductDto>>(list);
    }

    // ✅ 新增：带分页的 PageList
    public  Task<PagedResult<ProductDto>> PageListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
    {
        limit = Math.Clamp(limit, 1, 200);

        // cursor = offset（简单实现，InMemory 用这个足够）
        var offset = 0;
        if (!string.IsNullOrWhiteSpace(cursor))
            int.TryParse(cursor, out offset);

        var all = _items
            .Where(kv => kv.Key.StartsWith(orgId + "#", StringComparison.Ordinal))
            .Select(kv => kv.Value)
            .Where(x => !x.IsDeleted)
            .Where(x => string.IsNullOrWhiteSpace(keyword)
                     || x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                     || x.Sku.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(x => x.UpdatedAt)
            .ToList();

        var page = all.Skip(offset).Take(limit).ToList();

        var nextOffset = offset + page.Count;
        var nextCursor = nextOffset < all.Count ? nextOffset.ToString() : null;

        return Task.FromResult(new PagedResult<ProductDto>(page, nextCursor));
    }

    public Task UpdateAsync(string orgId, ProductDto product, CancellationToken ct)
        => CreateAsync(orgId, product, ct);

    public async Task SoftDeleteAsync(string orgId, string productId, CancellationToken ct)
    {
        var existing = await GetAsync(orgId, productId, ct);
        if (existing is null) return;

        var deleted = existing with
        {
            IsDeleted = true,
            UpdatedAt = DateTimeOffset.UtcNow,
            UpdatedBy = "system"
        };

        await UpdateAsync(orgId, deleted, ct);
    }
}