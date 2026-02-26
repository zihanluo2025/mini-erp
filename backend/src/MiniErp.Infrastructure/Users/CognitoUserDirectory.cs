using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Microsoft.Extensions.Configuration;
using MiniErp.Application.Abstractions;
using MiniErp.Application.Users;

namespace MiniErp.Infrastructure.Users;

public sealed class CognitoUserDirectory : IUserDirectory
{
    private readonly IAmazonCognitoIdentityProvider _cognito;
    private readonly string _userPoolId;

    public CognitoUserDirectory(
        IAmazonCognitoIdentityProvider cognito,
        IConfiguration configuration)
    {
        _cognito = cognito;
        _userPoolId = configuration["Cognito:UserPoolId"]
            ?? throw new InvalidOperationException("Cognito:UserPoolId is not configured.");
    }

    public async Task<PagedResult<UserDto>> ListAsync(
        string? keyword,
        int limit,
        string? cursor,
        CancellationToken cancellationToken)
    {
        var request = new ListUsersRequest
        {
            UserPoolId = _userPoolId,
            Limit = limit,
            PaginationToken = cursor
        };

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            // Filter by email prefix in Cognito.
            request.Filter = $"email ^= \"{keyword}\"";
        }

        var response = await _cognito.ListUsersAsync(request, cancellationToken);

        var items = response.Users
            .Select(MapUser)
            .ToList();

        return new PagedResult<UserDto>(items, response.PaginationToken);
    }

    public async Task<string> CreateAsync(
        CreateUserRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            throw new ArgumentException("Email is required.", nameof(request));
        }

        var attributes = new List<AttributeType>
        {
            new() { Name = "email", Value = request.Email },
        };

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            attributes.Add(new AttributeType { Name = "name", Value = request.Name });
        }

        var createRequest = new AdminCreateUserRequest
        {
            UserPoolId = _userPoolId,
            Username = request.Email,
            UserAttributes = attributes
        };

        if (!string.IsNullOrWhiteSpace(request.TemporaryPassword))
        {
            createRequest.TemporaryPassword = request.TemporaryPassword;
        }

        var response = await _cognito.AdminCreateUserAsync(createRequest, cancellationToken);

        return response.User?.Username ?? request.Email;
    }

    public async Task UpdateAsync(
        string id,
        UpdateUserRequest request,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            var updateReq = new AdminUpdateUserAttributesRequest
            {
                UserPoolId = _userPoolId,
                Username = id,
                UserAttributes = new List<AttributeType>
                {
                    new() { Name = "name", Value = request.Name }
                }
            };

            _ = await _cognito.AdminUpdateUserAttributesAsync(updateReq, cancellationToken);
        }

        if (request.Enabled is bool enabled)
        {
            if (enabled)
            {
                await _cognito.AdminEnableUserAsync(
                    new AdminEnableUserRequest
                    {
                        UserPoolId = _userPoolId,
                        Username = id
                    },
                    cancellationToken);
            }
            else
            {
                await _cognito.AdminDisableUserAsync(
                    new AdminDisableUserRequest
                    {
                        UserPoolId = _userPoolId,
                        Username = id
                    },
                    cancellationToken);
            }
        }
    }

    public async Task DeleteAsync(
        string id,
        CancellationToken cancellationToken)
    {
        await _cognito.AdminDeleteUserAsync(
            new AdminDeleteUserRequest
            {
                UserPoolId = _userPoolId,
                Username = id
            },
            cancellationToken);
    }

    private static UserDto MapUser(UserType user)
    {
        static string? GetAttr(UserType src, string name) =>
            src.Attributes.FirstOrDefault(a =>
                string.Equals(a.Name, name, StringComparison.OrdinalIgnoreCase))?.Value;

        var email = GetAttr(user, "email") ?? string.Empty;
        var name = GetAttr(user, "name");
        var createdAt = user.UserCreateDate.HasValue
            ? new DateTimeOffset(user.UserCreateDate.Value)
            : DateTimeOffset.UtcNow;

        return new UserDto(
            Id: user.Username,
            Email: email,
            Name: string.IsNullOrWhiteSpace(name) ? null : name,
            Enabled: user.Enabled,
            Status: user.UserStatus?.Value ?? "UNKNOWN",
            CreatedAt: createdAt);
    }
}

