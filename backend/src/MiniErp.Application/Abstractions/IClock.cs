namespace MiniErp.Application.Abstractions;

public interface IClock
{
    DateTimeOffset UtcNow { get; }
}