using System.Threading;
using System.Threading.Tasks;
using MiniErp.Application.Abstractions;

namespace MiniErp.Application.Users;

public interface IUserDirectory
{
    Task<PagedResult<UserDto>> ListAsync(
        string? keyword,
        int limit,
        string? cursor,
        CancellationToken cancellationToken);

    Task<string> CreateAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken);

    Task UpdateAsync(
        string id,
        UpdateUserRequest request,
        CancellationToken cancellationToken);

    Task DeleteAsync(
        string id,
        CancellationToken cancellationToken);
}

