namespace MiniErp.Application.Customers.Models;

public sealed record CreateCustomerRequest(
    string CustomerCode,
    string CustomerName,
    string CompanyName,
    string Segment,
    string ContactPerson,
    string? ContactEmail,
    string? ContactPhone,
    string Region,
    string? Address,
    string Status,
    string? Notes
);