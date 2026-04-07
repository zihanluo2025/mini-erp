import { apiFetch } from "@/lib/api";
import type {
    Supplier,
    CreateSupplierRequest,
    UpdateSupplierRequest,
} from "@/types/supplier";

// POST /suppliers -> 201 Created { id }
export function createSupplier(payload: CreateSupplierRequest) {
    return apiFetch<{ id: string }>(
        "/api/suppliers",
        { method: "POST", body: JSON.stringify(payload) }
    );
}

// GET /suppliers/{id} -> Supplier
export function getSupplier(id: string) {
    return apiFetch<Supplier>(`/api/suppliers/${encodeURIComponent(id)}`);
}

// GET /suppliers -> { items: Supplier[] }
export function listSuppliers(params?: {
    keyword?: string;
    limit?: number;
    cursor?: string;
}) {
    return apiFetch<{ items: Supplier[] }>(
        "/api/suppliers",
        undefined,
        {
            keyword: params?.keyword,
            limit: params?.limit ?? 50,
            cursor: params?.cursor,
        }
    );
}

// GET /suppliers/page -> { items, nextCursor }
export function pageSuppliers(params?: {
    keyword?: string;
    limit?: number;
    cursor?: string;
}) {
    return apiFetch<{ items: Supplier[]; nextCursor?: string | null }>(
        "/api/suppliers/page",
        undefined,
        {
            keyword: params?.keyword,
            limit: params?.limit ?? 50,
            cursor: params?.cursor,
        }
    );
}

// PUT /suppliers/{id} -> 204
export function updateSupplier(id: string, payload: UpdateSupplierRequest) {
    return apiFetch<void>(
        `/api/suppliers/${encodeURIComponent(id)}`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

// DELETE /suppliers/{id} -> 204
export function deleteSupplier(id: string) {
    return apiFetch<void>(
        `/api/suppliers/${encodeURIComponent(id)}`,
        { method: "DELETE" }
    );
}