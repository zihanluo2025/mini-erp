import { apiFetch } from "@/lib/api";
import type {
    Customer,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from "@/types/customer";

// POST /api/customers -> 201 Created { id }
export function createCustomer(payload: CreateCustomerRequest) {
    return apiFetch<{ id: string }>(
        "/api/customers",
        { method: "POST", body: JSON.stringify(payload) }
    );
}

// GET /api/customers/{id} -> Customer
export function getCustomer(id: string) {
    return apiFetch<Customer>(`/api/customers/${encodeURIComponent(id)}`);
}

// GET /api/customers -> { items: Customer[] }
export function listCustomers(params?: {
    keyword?: string;
    limit?: number;
    cursor?: string;
}) {
    return apiFetch<{ items: Customer[]; nextCursor?: string | null }>(
        "/api/customers",
        undefined,
        {
            keyword: params?.keyword,
            limit: params?.limit ?? 50,
            cursor: params?.cursor,
        }
    );
}

// GET /api/customers/page -> { items, nextCursor }
export function pageCustomers(params?: {
    keyword?: string;
    limit?: number;
    cursor?: string;
}) {
    return apiFetch<{ items: Customer[]; nextCursor?: string | null }>(
        "/api/customers/page",
        undefined,
        {
            keyword: params?.keyword,
            limit: params?.limit ?? 50,
            cursor: params?.cursor,
        }
    );
}

// PUT /api/customers/{id} -> 204
export function updateCustomer(id: string, payload: UpdateCustomerRequest) {
    return apiFetch<void>(
        `/api/customers/${encodeURIComponent(id)}`,
        { method: "PUT", body: JSON.stringify(payload) }
    );
}

// DELETE /api/customers/{id} -> 204
export function deleteCustomer(id: string) {
    return apiFetch<void>(
        `/api/customers/${encodeURIComponent(id)}`,
        { method: "DELETE" }
    );
}