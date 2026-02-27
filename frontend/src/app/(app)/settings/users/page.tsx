"use client";

import * as React from "react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { FilterBar } from "@/components/common/filter-bar";
import { DataTable } from "@/components/common/data-table";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  type User,
} from "@/lib/users";

type UserRow = User;

const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.enabled ? (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Disabled</Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={row.original.onEdit}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={row.original.onDelete}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export default function UsersPage() {
  const [keyword, setKeyword] = React.useState("");

  const [rows, setRows] = React.useState<UserRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>({});

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [editingUser, setEditingUser] = React.useState<UserRow | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editEnabled, setEditEnabled] = React.useState(true);

  const [creating, setCreating] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newTempPassword, setNewTempPassword] = React.useState("");

  const hasSelected = React.useMemo(
    () => Object.keys(rowSelection).length > 0,
    [rowSelection]
  );

  async function loadUsers(search?: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers(search);
      setRows(
        data.map((u) => ({
          ...u,
          onEdit: () => openEdit(u),
          onDelete: () => handleDelete(u),
        }))
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load users from server."
      );
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openEdit(user: User) {
    setEditingUser(user);
    setEditName(user.name ?? "");
    setEditEnabled(user.enabled);
  }

  function resetCreateForm() {
    setNewEmail("");
    setNewName("");
    setNewTempPassword("");
  }

  async function handleSearch() {
    setPageIndex(0);
    await loadUsers(keyword);
  }

  async function handleReset() {
    setKeyword("");
    setPageIndex(0);
    await loadUsers();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setCreating(true);
    setError(null);
    try {
      await createUser({
        email: newEmail.trim(),
        name: newName.trim() || undefined,
        temporaryPassword: newTempPassword.trim() || undefined,
      });
      resetCreateForm();
      await loadUsers(keyword);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create user in Cognito."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingUser) return;
    setLoading(true);
    setError(null);
    try {
      await updateUser(editingUser.id, {
        name: editName.trim() || undefined,
        enabled: editEnabled,
      });
      setEditingUser(null);
      await loadUsers(keyword);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user in Cognito."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete user ${user.email}?`)) return;
    setLoading(true);
    setError(null);
    try {
      await deleteUser(user.id);
      await loadUsers(keyword);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user in Cognito."
      );
    } finally {
      setLoading(false);
    }
  }

  // Client-side paging based on rows loaded from Cognito.
  const totalCount = rows.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  React.useEffect(() => {
    setPageIndex((prev) => Math.min(prev, pageCount - 1));
  }, [pageCount]);

  const pageData = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, pageIndex, pageSize]);

  return (
    <div className="space-y-2">

      <FilterBar
        fields={
          <Input
            className="w-[260px]"
            placeholder="Search by email"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        }
        primaryActions={[
          {
            key: "search",
            label: "Search",
            variant: "secondary",
            onClick: () => {
              void handleSearch();
            },
          },
          {
            key: "reset",
            label: "Reset",
            variant: "outline",
            onClick: () => {
              void handleReset();
            },
          },
        ]}
      />

      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-5 md:items-end"
      >
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="new-email">Email</Label>
          <Input
            id="new-email"
            type="email"
            required
            placeholder="user@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-name">Name</Label>
          <Input
            id="new-name"
            placeholder="Display name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="md:col-span-2 flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={resetCreateForm}
            className="w-full md:w-auto"
          >
            Clear
          </Button>
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={creating}
          >
            {creating ? "Creating..." : "Add user"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={pageData}
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        totalCount={totalCount}
        onPageChange={setPageIndex}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPageIndex(0);
          setRowSelection({});
        }}
        loading={loading}
        emptyText="No users found"
        actions={[
          {
            key: "batchDelete",
            label: "Batch Delete",
            variant: "destructive",
            onClick: () => {
              // For now, rely on per-row delete to keep behaviour explicit.
              // Could be extended to batch delete via rowSelection.
            },
            disabled: !hasSelected,
          },
        ]}
      />

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={editingUser?.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-enabled">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle to enable or disable sign-in for this user.
                </p>
              </div>
              <Switch
                id="edit-enabled"
                checked={editEnabled}
                onCheckedChange={(v) => setEditEnabled(v)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleSaveEdit()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}