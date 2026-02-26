using System;

namespace MiniErp.Application.Users;

public sealed record UserDto(
    string Id,
    string Email,
    string? Name,
    bool Enabled,
    string Status,
    DateTimeOffset CreatedAt
);

