using MiniErp.Domain.Auth;

namespace MiniErp.Application.Abstractions;

public interface ICurrentUser
{
    string UserId { get; }
    string Email { get; }
    string OrgId { get; }
    Role Role { get; }
}