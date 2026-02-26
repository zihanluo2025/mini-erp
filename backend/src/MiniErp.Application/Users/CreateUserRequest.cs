namespace MiniErp.Application.Users;

public sealed record CreateUserRequest(
    string Email,
    string? Name,
    string? TemporaryPassword
);

