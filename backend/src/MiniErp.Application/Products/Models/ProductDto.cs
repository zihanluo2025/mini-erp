using MiniErp.Application.Products.Models;

namespace MiniErp.Application.Products.Models;

// Comments in English.
public sealed record ProductDto(
    string Id,
    string Name,
    string? Supplier,
    string? Origin,
    decimal Price,
    int Stock,
    ProductStatus Status,
    bool IsDeleted,
    DateTimeOffset CreatedAt,
    string? CreatedBy,
    DateTimeOffset UpdatedAt,
    string? UpdatedBy
);