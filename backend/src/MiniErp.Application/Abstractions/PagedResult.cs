namespace MiniErp.Application.Abstractions;

// Comments in English.
public sealed record PagedResult<T>(
    IReadOnlyList<T> Items,
    string? NextCursor
);