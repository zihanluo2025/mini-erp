namespace MiniErp.Application.Products.Models;

public sealed record ProductDto(
    string Id,
    string Name,
    string Sku,
    string Category,
    decimal UnitPrice,
    int StockWarningThreshold,
    bool IsDeleted,
    DateTimeOffset CreatedAt,
    string CreatedBy,
    DateTimeOffset UpdatedAt,
    string UpdatedBy
);