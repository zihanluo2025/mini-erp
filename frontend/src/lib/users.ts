import { apiFetch } from "@/lib/api";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  enabled: boolean;
  status: string;
  createdAt: string;
};

type PagedResponse<T> = {
  items: T[];
  nextCursor?: string | null;
};

export async function listUsers(keyword?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (keyword && keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await apiFetch<PagedResponse<User>>(`/users${query}`);
  return res.items;
}

export async function createUser(input: {
  email: string;
  name?: string;
  temporaryPassword?: string;
}): Promise<void> {
  await apiFetch<{ id: string }>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateUser(
  id: string,
  input: {
    name?: string;
    enabled?: boolean;
  }
): Promise<void> {
  await apiFetch<void>(`/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch<void>(`/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

