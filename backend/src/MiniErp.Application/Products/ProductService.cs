using MiniErp.Application.Abstractions;
using MiniErp.Application.Products.Models;

namespace MiniErp.Application.Products;


public sealed class ProductService
{
    private readonly IProductRepository _repo;
    private readonly ICurrentUser _currentUser;
    private readonly IClock _clock;

    public ProductService(IProductRepository repo, ICurrentUser currentUser, IClock clock)
    {
        _repo = repo;
        _currentUser = currentUser;
        _clock = clock;
    }

    public async Task<string> CreateAsync(CreateProductRequest req, CancellationToken ct)
    {
        // 基础校验（后续可引入 FluentValidation）
        if (string.IsNullOrWhiteSpace(req.Name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(req.Sku)) throw new ArgumentException("Sku is required");

        var id = Guid.NewGuid().ToString("N");
        var now = _clock.UtcNow;

        var dto = new ProductDto(
            Id: id,
            Name: req.Name.Trim(),
            Sku: req.Sku.Trim(),
            Category: req.Category?.Trim() ?? "",
            UnitPrice: req.UnitPrice,
            StockWarningThreshold: req.StockWarningThreshold,
            IsDeleted: false,
            CreatedAt: now,
            CreatedBy: _currentUser.UserId,
            UpdatedAt: now,
            UpdatedBy: _currentUser.UserId
        );

        await _repo.CreateAsync(_currentUser.OrgId, dto, ct);
        return id;
    }

    public Task<ProductDto?> GetAsync(string id, CancellationToken ct)
        => _repo.GetAsync(_currentUser.OrgId, id, ct);

    public Task<IReadOnlyList<ProductDto>> ListAsync(string? keyword, int limit, string? cursor, CancellationToken ct)
        => _repo.ListAsync(_currentUser.OrgId, keyword, limit, cursor, ct);

     // page list with cursor-based pagination
    public Task<PagedResult<ProductDto>> PageListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
        => _repo.PageListAsync(orgId, keyword, limit, cursor, ct);
    

    public async Task UpdateAsync(string id, UpdateProductRequest req, CancellationToken ct)
    {
        var existing = await _repo.GetAsync(_currentUser.OrgId, id, ct);
        if (existing is null || existing.IsDeleted)
            throw new KeyNotFoundException("Product not found");

        if (string.IsNullOrWhiteSpace(req.Name)) throw new ArgumentException("Name is required");

        var now = _clock.UtcNow;

        var updated = existing with
        {
            Name = req.Name.Trim(),
            Category = req.Category?.Trim() ?? "",
            UnitPrice = req.UnitPrice,
            StockWarningThreshold = req.StockWarningThreshold,
            UpdatedAt = now,
            UpdatedBy = _currentUser.UserId
        };

        await _repo.UpdateAsync(_currentUser.OrgId, updated, ct);
    }

    public async Task SoftDeleteAsync(string id, CancellationToken ct)
    {
        var existing = await _repo.GetAsync(_currentUser.OrgId, id, ct);
        if (existing is null || existing.IsDeleted) return;

        await _repo.SoftDeleteAsync(_currentUser.OrgId, id, ct);
    }
}