namespace MiniErp.Application.Customers.Models;

public sealed record CustomerSummaryDto(
    int TotalCustomers,
    int ActiveCustomers,
    int EnterpriseCustomers,
    int ProspectCustomers
);