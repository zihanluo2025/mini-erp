namespace MiniErp.Application.Products.Models;

public sealed record UpdateProductRequest(
    string Name,
    string Category,
    decimal UnitPrice,
    int StockWarningThreshold
);