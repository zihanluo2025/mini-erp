namespace MiniErp.Application.Products.Models;

public sealed record CreateProductRequest(
    string Name,
    string Sku,
    string Category,
    decimal UnitPrice,
    int StockWarningThreshold
);