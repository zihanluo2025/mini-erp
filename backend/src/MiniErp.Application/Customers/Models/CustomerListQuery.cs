namespace MiniErp.Application.Customers.Models;

public sealed record CustomerListQuery(
    string? Keyword,
    int Limit = 50,
    string? Cursor = null
);