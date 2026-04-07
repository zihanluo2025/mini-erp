import { apiFetch } from "@/lib/api";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/product";



// POST /products -> 201 Created { id }
export function createProduct(payload: CreateProductRequest) {
  return apiFetch<{ id: string }>(
    "/api/products",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

// GET /products/{id} -> Product
export function getProduct(id: string) {
  return apiFetch<Product>(`/api/products/${encodeURIComponent(id)}`);
}

// GET /products -> { items: Product[] }
export function listProducts(params?: { keyword?: string; limit?: number; cursor?: string }) {
  return apiFetch<{ items: Product[] }>(
    "/api/products",
    undefined,
    {
      keyword: params?.keyword,
      limit: params?.limit ?? 50,
      cursor: params?.cursor,
    }
  );
}

// GET /products/page -> { items, nextCursor }
export function pageProducts(params?: { keyword?: string; limit?: number; cursor?: string }) {
  return apiFetch<{ items: Product[]; nextCursor?: string | null }>(
    "/api/products/page",
    undefined,
    {
      keyword: params?.keyword,
      limit: params?.limit ?? 50,
      cursor: params?.cursor,
    }
  );
}

// PUT /products/{id} -> 204
export function updateProduct(id: string, payload: UpdateProductRequest) {
  return apiFetch<void>(
    `/api/products/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
}

// DELETE /products/{id} -> 204
export function deleteProduct(id: string) {
  return apiFetch<void>(
    `/api/products/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}

