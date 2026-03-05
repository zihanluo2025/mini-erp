"use client";

// Comments in English.

import * as React from "react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FilterBar } from "@/components/common/filter-bar";
import { DataTable } from "@/components/common/data-table";

import { pageProducts, deleteProduct } from "@/lib/apis/products";
// If you have backend batch delete API, uncomment this:
// import { batchDeleteProducts } from "@/lib/apis/products";

type ProductRow = {
    id: string;
    name: string;
    supplier: string;
    origin: string;
    price: number;
    stock: number;
    status: "Active" | "Inactive";
};

export default function ProductsPage() {
    // Filters
    const [supplier, setSupplier] = React.useState("");
    const [product, setProduct] = React.useState("");

    const router = useRouter();

    // Table data (server page)
    const [rows, setRows] = React.useState<ProductRow[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Selection (TanStack uses rowId keys; by default rowId is row index string)
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    // Pagination (cursor-based)
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    // cursorStack[i] is the cursor used to load page i
    // page0 cursor is null (first page)
    const [cursorStack, setCursorStack] = React.useState<(string | null)[]>([null]);
    const [nextCursor, setNextCursor] = React.useState<string | null>(null);

    // Delete state
    const [loadingDelete, setLoadingDelete] = React.useState(false);

    // Combine supplier + product into a single keyword (backend supports only one keyword)
    const keyword = React.useMemo(() => {
        const s = supplier.trim();
        const p = product.trim();
        if (s && p) return `${s} ${p}`;
        return s || p || "";
    }, [supplier, product]);

    const loadPage = React.useCallback(
        async (targetPageIndex: number, cursorOverride?: string | null) => {
            setLoading(true);
            setError(null);

            const cursor = cursorOverride ?? (cursorStack[targetPageIndex] ?? null);

            try {
                const res = await pageProducts({
                    keyword: keyword || undefined,
                    limit: pageSize,
                    cursor: cursor || undefined,
                });

                // NOTE: If backend dto differs from ProductRow, map here.
                setRows(res.items as ProductRow[]);
                setNextCursor(res.nextCursor ?? null);

                setPageIndex(targetPageIndex);
                setRowSelection({});
            } catch (e: any) {
                setError(e?.message ?? "Failed to load products");
            } finally {
                setLoading(false);
            }
        },
        [cursorStack, keyword, pageSize]
    );

    // Initial load & when pageSize changes
    React.useEffect(() => {
        setCursorStack([null]);
        setNextCursor(null);
        void loadPage(0, null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);

    const handleSearch = React.useCallback(() => {
        setCursorStack([null]);
        setNextCursor(null);
        void loadPage(0, null);
    }, [loadPage]);

    const handleReset = React.useCallback(() => {
        setSupplier("");
        setProduct("");
        setCursorStack([null]);
        setNextCursor(null);
        void loadPage(0, null);
    }, [loadPage]);

    // Cursor paging doesn't know exact total; expose an approximate pageCount/totalCount.
    const pageCount = nextCursor ? pageIndex + 2 : pageIndex + 1;
    const totalCount = pageCount * pageSize;

    const onPageChange = React.useCallback(
        (nextIndex: number) => {
            // Backward: cursor already known in cursorStack
            if (nextIndex < pageIndex) {
                void loadPage(nextIndex);
                return;
            }

            // Forward
            if (nextIndex > pageIndex) {
                if (!nextCursor) return;

                // Persist cursor for the next page
                setCursorStack((prev) => {
                    const copy = [...prev];
                    copy[nextIndex] = nextCursor;
                    return copy;
                });

                // Load immediately with cursor override (avoid async state timing)
                void loadPage(nextIndex, nextCursor);
            }
        },
        [loadPage, nextCursor, pageIndex]
    );

    const handleAdd = React.useCallback(() => {
        router.push("/products/new");
    }, [router]);

    // Single delete
    const handleDeleteOne = React.useCallback(
        async (row: ProductRow) => {
            if (!window.confirm(`Delete product "${row.name}"?`)) return;

            setLoadingDelete(true);
            setError(null);

            try {
                await deleteProduct(row.id);

                // Safer for cursor paging: reload current page
                const cursor = cursorStack[pageIndex] ?? null;
                await loadPage(pageIndex, cursor);
            } catch (err: any) {
                setError(err?.message ?? "Delete failed");
            } finally {
                setLoadingDelete(false);
            }
        },
        [cursorStack, loadPage, pageIndex]
    );

    // Batch delete (current page)
    const handleBatchDelete = React.useCallback(async () => {
        // TanStack selection keys are row ids; by default it's index string: "0", "1", ...
        const selectedIndexes = Object.keys(rowSelection).filter((k) => rowSelection[k]);
        const idsToDelete = selectedIndexes
            .map((k) => rows[Number(k)]?.id)
            .filter(Boolean) as string[];

        if (idsToDelete.length === 0) return;
        if (!window.confirm(`Delete ${idsToDelete.length} products?`)) return;

        setLoadingDelete(true);
        setError(null);

        try {
            // Option A: no backend batch API -> parallel delete
            await Promise.all(idsToDelete.map((id) => deleteProduct(id)));

            // Option B: if you have backend batch API, use it:
            // await batchDeleteProducts(idsToDelete);

            // Reload current page after delete
            const cursor = cursorStack[pageIndex] ?? null;
            await loadPage(pageIndex, cursor);
        } catch (err: any) {
            setError(err?.message ?? "Batch delete failed");
        } finally {
            setLoadingDelete(false);
        }
    }, [cursorStack, loadPage, pageIndex, rowSelection, rows]);

    const hasSelected = React.useMemo(
        () => Object.values(rowSelection).some(Boolean),
        [rowSelection]
    );

    // Columns inside component to access handlers/states
    const columns = React.useMemo<ColumnDef<ProductRow>[]>(() => {
        return [
            // {
            //     accessorKey: "id",
            //     header: "No.",
            //     cell: ({ row }) => (
            //         <span className="text-muted-foreground">{row.original.id}</span>
            //     ),
            // },
            { accessorKey: "name", header: "Product Name" },
            { accessorKey: "supplier", header: "Supplier" },
            { accessorKey: "origin", header: "Origin" },
            {
                accessorKey: "price",
                header: "Price",
                cell: ({ row }) => (
                    <span className="tabular-nums">${row.original.price}</span>
                ),
            },
            {
                accessorKey: "stock",
                header: "Stock",
                cell: ({ row }) => (
                    <span className="tabular-nums">{row.original.stock}</span>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) =>
                    row.original.status === "Active" ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            Active
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Inactive</Badge>
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
                            onClick={() => router.push(`/products/${row.original.id}/edit`)}
                            disabled={loading || loadingDelete}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            disabled={loading || loadingDelete}
                            onClick={() => void handleDeleteOne(row.original)}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ];
    }, [handleDeleteOne, loading, loadingDelete, router]);

    return (
        <div className="space-y-4">
            <FilterBar
                fields={
                    <>
                        <Input
                            className="w-[240px]"
                            placeholder="Please enter supplier name"
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            disabled={loading || loadingDelete}
                        />
                        <Input
                            className="w-[240px]"
                            placeholder="Please enter product name"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            disabled={loading || loadingDelete}
                        />
                    </>
                }
                primaryActions={[
                    {
                        key: "search",
                        label: "Search",
                        variant: "secondary",
                        onClick: handleSearch,
                        disabled: loading || loadingDelete,
                    },
                    {
                        key: "reset",
                        label: "Reset",
                        variant: "outline",
                        onClick: handleReset,
                        disabled: loading || loadingDelete,
                    },
                ]}
            />

            {error ? (
                <div className="rounded-md border p-3 text-sm text-red-600">{error}</div>
            ) : null}

            <DataTable
                columns={columns}
                data={rows}
                enableRowSelection
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                totalCount={totalCount}
                onPageChange={onPageChange}
                onPageSizeChange={(s) => {
                    setPageSize(s);
                    setPageIndex(0);
                    setRowSelection({});
                }}
                loading={loading || loadingDelete}
                actions={[
                    {
                        key: "add",
                        label: "Add",
                        variant: "secondary",
                        onClick: handleAdd,
                        disabled: loading || loadingDelete,
                    },
                    {
                        key: "batchDel",
                        label: loadingDelete ? "Deleting..." : "Batch Delete",
                        variant: "destructive",
                        disabled: !hasSelected || loading || loadingDelete,
                        onClick: () => void handleBatchDelete(),
                    },
                ]}
            />
        </div>
    );
}