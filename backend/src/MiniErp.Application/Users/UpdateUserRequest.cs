namespace MiniErp.Application.Users;

public sealed record UpdateUserRequest(
    string? Name,
    bool? Enabled
);

