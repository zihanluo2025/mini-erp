using MiniErp.Application.Abstractions;
using MiniErp.Application.Products;
using MiniErp.Application.Products.Models;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;

namespace MiniErp.Infrastructure.Products;

// Comments in English.
public sealed class InMemoryProductRepository : IProductRepository
{
    private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, ProductDto>> _store = new();

    private ConcurrentDictionary<string, ProductDto> Bucket(string orgId)
        => _store.GetOrAdd(orgId, _ => new ConcurrentDictionary<string, ProductDto>());

    public Task CreateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        Bucket(orgId)[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task<ProductDto?> GetAsync(string orgId, string productId, CancellationToken ct)
    {
        if (Bucket(orgId).TryGetValue(productId, out var dto))
            return Task.FromResult(dto.IsDeleted ? null : dto);

        return Task.FromResult<ProductDto?>(null);
    }

    public Task UpdateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        Bucket(orgId)[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task SoftDeleteAsync(string orgId, string productId, CancellationToken ct)
    {
        if (Bucket(orgId).TryGetValue(productId, out var dto))
        {
            Bucket(orgId)[productId] = dto with { IsDeleted = true, UpdatedAt = DateTime.UtcNow };
        }
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<ProductDto>> ListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
    {
        var safeLimit = Math.Clamp(limit, 1, 200);

        IEnumerable<ProductDto> q = Bucket(orgId).Values
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var k = keyword.Trim();
            q = q.Where(x =>
                x.Name.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                (x.Supplier ?? "").Contains(k, StringComparison.OrdinalIgnoreCase) ||
                (x.Origin ?? "").Contains(k, StringComparison.OrdinalIgnoreCase)
            );
        }

        // Cursor ignored for list (simple version)
        return Task.FromResult<IReadOnlyList<ProductDto>>(q.Take(safeLimit).ToList());
    }

    public Task<PagedResult<ProductDto>> PageListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
    {
        var safeLimit = Math.Clamp(limit, 1, 200);

        IEnumerable<ProductDto> q = Bucket(orgId).Values
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var k = keyword.Trim();
            q = q.Where(x =>
                x.Name.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                (x.Supplier ?? "").Contains(k, StringComparison.OrdinalIgnoreCase) ||
                (x.Origin ?? "").Contains(k, StringComparison.OrdinalIgnoreCase)
            );
        }

        // Cursor is an offset in this in-memory implementation
        var offset = DecodeOffset(cursor);
        var pageItems = q.Skip(offset).Take(safeLimit).ToList();

        string? nextCursor = null;
        var nextOffset = offset + pageItems.Count;
        if (pageItems.Count == safeLimit && q.Skip(nextOffset).Any())
        {
            nextCursor = EncodeOffset(nextOffset);
        }

        return Task.FromResult(new PagedResult<ProductDto>(pageItems, nextCursor));
    }

    private static string EncodeOffset(int offset)
    {
        var json = JsonSerializer.Serialize(new { offset });
        return Base64UrlEncode(Encoding.UTF8.GetBytes(json));
    }

    private static int DecodeOffset(string? cursor)
    {
        if (string.IsNullOrWhiteSpace(cursor)) return 0;

        try
        {
            var bytes = Base64UrlDecode(cursor);
            var json = Encoding.UTF8.GetString(bytes);
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.GetProperty("offset").GetInt32();
        }
        catch
        {
            return 0;
        }
    }

    private static string Base64UrlEncode(byte[] bytes)
        => Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[] Base64UrlDecode(string input)
    {
        var s = input.Replace('-', '+').Replace('_', '/');
        switch (s.Length % 4)
        {
            case 2: s += "=="; break;
            case 3: s += "="; break;
        }
        return Convert.FromBase64String(s);
    }
}