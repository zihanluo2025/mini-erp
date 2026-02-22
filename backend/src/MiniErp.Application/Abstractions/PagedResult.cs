namespace MiniErp.Application.Abstractions;

public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    string? NextCursor
);