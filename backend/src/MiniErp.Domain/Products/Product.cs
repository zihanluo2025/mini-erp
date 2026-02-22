using MiniErp.Domain.Common;

namespace MiniErp.Domain.Products;

public sealed class Product : AuditableEntity<string>
{
    public string Name { get; private set; } = "";
    public string Sku { get; private set; } = "";
    public string Category { get; private set; } = "";
    public decimal UnitPrice { get; private set; }
    public int StockWarningThreshold { get; private set; }
    public bool IsDeleted { get; private set; }

    private Product() { }

    public Product(
        string id,
        string name,
        string sku,
        string category,
        decimal unitPrice,
        int stockWarningThreshold)
    {
        Id = id;
        Name = name;
        Sku = sku;
        Category = category;
        UnitPrice = unitPrice;
        StockWarningThreshold = stockWarningThreshold;
        IsDeleted = false;
    }

    public void Update(
        string name,
        string category,
        decimal unitPrice,
        int stockWarningThreshold)
    {
        Name = name;
        Category = category;
        UnitPrice = unitPrice;
        StockWarningThreshold = stockWarningThreshold;
    }

    public void SoftDelete() => IsDeleted = true;
}