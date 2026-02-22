namespace MiniErp.Domain.Common;

public abstract class AuditableEntity<TId> : Entity<TId>
{
    public DateTimeOffset CreatedAt { get; private set; }
    public string CreatedBy { get; private set; } = "";

    public DateTimeOffset UpdatedAt { get; private set; }
    public string UpdatedBy { get; private set; } = "";

    public void MarkCreated(string userId, DateTimeOffset now)
    {
        CreatedBy = userId;
        CreatedAt = now;
        MarkUpdated(userId, now);
    }

    public void MarkUpdated(string userId, DateTimeOffset now)
    {
        UpdatedBy = userId;
        UpdatedAt = now;
    }
}