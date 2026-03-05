using MiniErp.Application.Products.Models;

namespace MiniErp.Application.Products.Models;

// Comments in English.
public sealed record UpdateProductRequest(
    string Name,
    string? Supplier,
    string? Origin,
    decimal Price,
    int Stock,
    ProductStatus Status
);