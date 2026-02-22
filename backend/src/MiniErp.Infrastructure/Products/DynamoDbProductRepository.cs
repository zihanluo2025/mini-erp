using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using MiniErp.Application.Products;
using MiniErp.Application.Products.Models;
using System.Text;
using System.Text.Json;
using MiniErp.Application.Abstractions;

namespace MiniErp.Infrastructure.Products;

public sealed class DynamoDbProductRepository : IProductRepository
{
    private readonly IAmazonDynamoDB _ddb;
    private readonly string _table;

    public DynamoDbProductRepository(IAmazonDynamoDB ddb, string tableName)
    {
        _ddb = ddb;
        _table = tableName;
    }

    private static string Pk(string orgId) => $"ORG#{orgId}";
    private static string SkProduct(string productId) => $"PRODUCT#{productId}";

    public async Task CreateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            ["PK"] = new AttributeValue { S = Pk(orgId) },
            ["SK"] = new AttributeValue { S = SkProduct(product.Id) },

            ["Id"] = new AttributeValue { S = product.Id },
            ["Name"] = new AttributeValue { S = product.Name },
            ["Sku"] = new AttributeValue { S = product.Sku },
            ["Category"] = new AttributeValue { S = product.Category },

            ["UnitPrice"] = new AttributeValue { N = product.UnitPrice.ToString() },
            ["StockWarningThreshold"] = new AttributeValue { N = product.StockWarningThreshold.ToString() },

            ["IsDeleted"] = new AttributeValue { BOOL = product.IsDeleted },

            // 用 ISO 字符串，便于排序/调试
            ["CreatedAt"] = new AttributeValue { S = product.CreatedAt.ToString("O") },
            ["CreatedBy"] = new AttributeValue { S = product.CreatedBy ?? "" },
            ["UpdatedAt"] = new AttributeValue { S = product.UpdatedAt.ToString("O") },
            ["UpdatedBy"] = new AttributeValue { S = product.UpdatedBy ?? "" },
        };

        await _ddb.PutItemAsync(new PutItemRequest
        {
            TableName = _table,
            Item = item
        }, ct);
    }

    public async Task<ProductDto?> GetAsync(string orgId, string productId, CancellationToken ct)
    {
        var resp = await _ddb.GetItemAsync(new GetItemRequest
        {
            TableName = _table,
            Key = new Dictionary<string, AttributeValue>
            {
                ["PK"] = new AttributeValue { S = Pk(orgId) },
                ["SK"] = new AttributeValue { S = SkProduct(productId) }
            }
        }, ct);

        if (resp.Item is null || resp.Item.Count == 0) return null;

        var dto = MapToDto(resp.Item);
        return dto.IsDeleted ? null : dto;
    }

    public async Task<IReadOnlyList<ProductDto>> ListAsync(string orgId, string? keyword, int limit, string? cursor, CancellationToken ct)
    {
        // 先做最简单版本：Query 某个 org 下所有 PRODUCT
        // keyword 过滤放在内存中（下一步我们会用 GSI/搜索优化）
        var resp = await _ddb.QueryAsync(new QueryRequest
        {
            TableName = _table,
            KeyConditionExpression = "PK = :pk AND begins_with(SK, :prefix)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":pk"] = new AttributeValue { S = Pk(orgId) },
                [":prefix"] = new AttributeValue { S = "PRODUCT#" }
            },
            Limit = Math.Clamp(limit, 1, 200),
            ScanIndexForward = false // 默认按 SK 排序；我们后面会改成按 CreatedAt 更合理
        }, ct);

        var list = resp.Items
            .Select(MapToDto)
            .Where(x => x.IsDeleted != true)
            .Where(x => string.IsNullOrWhiteSpace(keyword) ||
                        x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                        x.Sku.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            .ToList()
            .AsReadOnly();

        return list;
    }

    public async Task<PagedResult<ProductDto>> PageListAsync(
    string orgId,
    string? keyword,
    int limit,
    string? cursor,
    CancellationToken ct)
{
    var safeLimit = Math.Clamp(limit, 1, 200);

    var req = new QueryRequest
    {
        TableName = _table,
        KeyConditionExpression = "PK = :pk AND begins_with(SK, :prefix)",
        ExpressionAttributeValues = new Dictionary<string, AttributeValue>
        {
            [":pk"] = new AttributeValue { S = Pk(orgId) },
            [":prefix"] = new AttributeValue { S = "PRODUCT#" }
        },
        Limit = safeLimit,
        ScanIndexForward = false
    };

    var startKey = DecodeCursor(cursor);
    if (startKey is not null)
        req.ExclusiveStartKey = startKey;

    var resp = await _ddb.QueryAsync(req, ct);

    var items = resp.Items
        .Select(MapToDto)
        .Where(x => !x.IsDeleted)
        .Where(x => string.IsNullOrWhiteSpace(keyword)
                    || x.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                    || x.Sku.Contains(keyword, StringComparison.OrdinalIgnoreCase))
        .ToList()
        .AsReadOnly();

    string? nextCursor = (resp.LastEvaluatedKey is { Count: > 0 })
        ? EncodeCursor(resp.LastEvaluatedKey)
        : null;

    return new PagedResult<ProductDto>(items, nextCursor);
}

    private static ProductDto MapToDto(Dictionary<string, AttributeValue> item)
    {
        string GetS(string k) =>
            item.TryGetValue(k, out var v) ? (v.S ?? "") : "";

        decimal GetDecimal(string k)
        {
            if (!item.TryGetValue(k, out var v) || string.IsNullOrWhiteSpace(v.N))
                return 0m;

            return decimal.TryParse(v.N, out var n) ? n : 0m;
        }

        int GetInt(string k)
        {
            if (!item.TryGetValue(k, out var v) || string.IsNullOrWhiteSpace(v.N))
                return 0;

            return int.TryParse(v.N, out var n) ? n : 0;
        }

        bool GetBool(string k)
        {
            if (!item.TryGetValue(k, out var v)) return false;
            return v.BOOL ?? false;
        }

        DateTimeOffset GetDto(string k)
        {
            var s = GetS(k);

            return DateTimeOffset.TryParse(
                s,
                null,
                System.Globalization.DateTimeStyles.RoundtripKind,
                out var dt)
                ? dt
                : DateTimeOffset.UtcNow;
        }

        return new ProductDto(
            Id: GetS("Id"),
            Name: GetS("Name"),
            Sku: GetS("Sku"),
            Category: GetS("Category"),
            UnitPrice: GetDecimal("UnitPrice"),
            StockWarningThreshold: GetInt("StockWarningThreshold"),
            IsDeleted: GetBool("IsDeleted"),
            CreatedAt: GetDto("CreatedAt"),
            CreatedBy: GetS("CreatedBy"),
            UpdatedAt: GetDto("UpdatedAt"),
            UpdatedBy: GetS("UpdatedBy")
        );
    }

    public async Task UpdateAsync(string orgId, ProductDto product, CancellationToken ct)
    {
        // 最简单：用 PutItem 直接覆盖（等同 upsert）
        await CreateAsync(orgId, product, ct);
    }

    public async Task SoftDeleteAsync(string orgId, string productId, CancellationToken ct)
    {
        var existing = await GetAsync(orgId, productId, ct);
        if (existing is null) return;

        var deleted = existing with
        {
            IsDeleted = true,
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = "system" // 你后面会换成 currentUser.UserId
        };

        await UpdateAsync(orgId, deleted, ct);
    }

    private static string EncodeCursor(Dictionary<string, AttributeValue> lastKey)
    {
        // 只存 PK/SK 就够（你的表 key 就这俩）
        var payload = new Dictionary<string, string>
        {
            ["PK"] = lastKey["PK"].S!,
            ["SK"] = lastKey["SK"].S!
        };

        var json = JsonSerializer.Serialize(payload);
        return Base64UrlEncode(Encoding.UTF8.GetBytes(json));
    }

    private static Dictionary<string, AttributeValue>? DecodeCursor(string? cursor)
    {
        if (string.IsNullOrWhiteSpace(cursor)) return null;

        var bytes = Base64UrlDecode(cursor);
        var json = Encoding.UTF8.GetString(bytes);

        var payload = JsonSerializer.Deserialize<Dictionary<string, string>>(json);
        if (payload is null || !payload.TryGetValue("PK", out var pk) || !payload.TryGetValue("SK", out var sk))
            return null;

        return new Dictionary<string, AttributeValue>
        {
            ["PK"] = new AttributeValue { S = pk },
            ["SK"] = new AttributeValue { S = sk }
        };
    }

    private static string Base64UrlEncode(byte[] bytes)
    {
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static byte[] Base64UrlDecode(string input)
    {
        var s = input.Replace('-', '+').Replace('_', '/');
        switch (s.Length % 4)
        {
            case 2: s += "=="; break;
            case 3: s += "="; break;
        }
        return Convert.FromBase64String(s);
    }

    
}