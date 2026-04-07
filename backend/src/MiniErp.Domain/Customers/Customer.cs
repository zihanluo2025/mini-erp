namespace MiniErp.Domain.Customers;

public class Customer
{
    public string Id { get; set; } = default!;
    public string CustomerCode { get; set; } = default!;
    public string CustomerName { get; set; } = default!;
    public string CompanyName { get; set; } = default!;

    public string Segment { get; set; } = default!;

    public string ContactPerson { get; set; } = default!;
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }

    public string Region { get; set; } = default!;
    public string? Address { get; set; }

    public string Status { get; set; } = default!;
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}