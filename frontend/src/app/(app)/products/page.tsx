"use client";

// Comments in English.

import * as React from "react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FilterBar } from "@/components/common/filter-bar";
import { DataTable } from "@/components/common/data-table";

type ProductRow = {
    id: string;
    name: string;
    supplier: string;
    origin: string;
    price: number;
    stock: number;
    status: "Active" | "Inactive";
};

const mockData: ProductRow[] = [
    { id: "9", name: "Walnut", supplier: "ABC Foods", origin: "VIC", price: 100, stock: 120, status: "Active" },
    { id: "8", name: "Spiced Beef", supplier: "ABC Foods", origin: "NSW", price: 100, stock: 100, status: "Active" },
    { id: "7", name: "Orange Juice", supplier: "Fresh Co", origin: "SA", price: 6, stock: 280, status: "Active" },
    { id: "6", name: "Milk 2L", supplier: "Dairy Best", origin: "VIC", price: 4, stock: 60, status: "Inactive" },
    { id: "5", name: "Rice 5kg", supplier: "Good Grains", origin: "QLD", price: 18, stock: 42, status: "Active" },
    { id: "4", name: "Soy Sauce", supplier: "ABC Foods", origin: "NSW", price: 8, stock: 150, status: "Active" },
];

const columns: ColumnDef<ProductRow>[] = [
    {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
    },
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "supplier", header: "Supplier" },
    { accessorKey: "origin", header: "Origin" },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span className="tabular-nums">${row.original.price}</span>,
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => <span className="tabular-nums">{row.original.stock}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
            row.original.status === "Active" ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
            ) : (
                <Badge variant="secondary">Inactive</Badge>
            ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => console.log("edit", row.original.id)}>
                    Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => console.log("delete", row.original.id)}>
                    Delete
                </Button>
            </div>
        ),
    },
];

export default function ProductsPage() {
    // Filters
    const [supplier, setSupplier] = React.useState("");
    const [product, setProduct] = React.useState("");

    // Table data (local mock)
    const [rows, setRows] = React.useState<ProductRow[]>(mockData);

    // Selection
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    // Pagination
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    // Filtered rows (client-side)
    const filteredRows = React.useMemo(() => {
        const s = supplier.trim().toLowerCase();
        const p = product.trim().toLowerCase();

        return rows.filter((r) => {
            const okSupplier = !s || r.supplier.toLowerCase().includes(s);
            const okProduct = !p || r.name.toLowerCase().includes(p);
            return okSupplier && okProduct;
        });
    }, [rows, supplier, product]);

    // Paging (client-side)
    const totalCount = filteredRows.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

    // Keep pageIndex in range when filters/pageSize change
    React.useEffect(() => {
        setPageIndex((prev) => Math.min(prev, pageCount - 1));
    }, [pageCount]);

    const pageData = React.useMemo(() => {
        const start = pageIndex * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, pageIndex, pageSize]);

    // Selected row ids (TanStack uses row index keys, not your id)
    const selectedRowIndexes = Object.keys(rowSelection).filter((k) => (rowSelection as any)[k]);
    const hasSelected = selectedRowIndexes.length > 0;

    function handleSearch() {
        // For mock filtering, nothing special to do (it's reactive),
        // but we reset to first page to match typical UX.
        setPageIndex(0);
    }

    function handleReset() {
        setSupplier("");
        setProduct("");
        setPageIndex(0);
    }

    function handleAdd() {
        // Mock add a new row
        const newId = String(Date.now()).slice(-6);
        const newRow: ProductRow = {
            id: newId,
            name: `New Product ${newId}`,
            supplier: "New Supplier",
            origin: "SA",
            price: 1,
            stock: 1,
            status: "Active",
        };
        setRows((prev) => [newRow, ...prev]);
        setPageIndex(0);
        setRowSelection({});
    }

    function handleBatchDelete() {
        // Because rowSelection is based on current page row indexes,
        // we delete by mapping selected row indexes to actual row ids in pageData.
        const idsToDelete = selectedRowIndexes
            .map((idx) => pageData[Number(idx)]?.id)
            .filter(Boolean) as string[];

        if (idsToDelete.length === 0) return;

        setRows((prev) => prev.filter((r) => !idsToDelete.includes(r.id)));
        setRowSelection({});
    }

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
                        />
                        <Input
                            className="w-[240px]"
                            placeholder="Please enter product name"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        />
                    </>
                }
                primaryActions={[
                    { key: "search", label: "Search", variant: "secondary", onClick: handleSearch },
                    { key: "reset", label: "Reset", variant: "outline", onClick: handleReset },
                ]}
            />

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
                actions={[
                    { key: "add", label: "Add", variant: "secondary", onClick: handleAdd },
                    { key: "batchDel", label: "Batch Delete", variant: "destructive", disabled: !hasSelected, onClick: handleBatchDelete },
                ]}
            />
        </div>
    );
}