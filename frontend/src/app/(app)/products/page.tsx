"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
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
];

const columns: ColumnDef<ProductRow>[] = [
    { accessorKey: "id", header: "No.", cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span> },
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "supplier", header: "Supplier" },
    { accessorKey: "origin", header: "Origin" },
    { accessorKey: "price", header: "Price", cell: ({ row }) => <span className="tabular-nums">${row.original.price}</span> },
    { accessorKey: "stock", header: "Stock", cell: ({ row }) => <span className="tabular-nums">{row.original.stock}</span> },
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
            <div className="flex gap-2">
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
    // Filters state
    const [name, setName] = React.useState("");
    const [supplier, setSupplier] = React.useState("");
    const [origin, setOrigin] = React.useState("");

    // Selection state
    const [rowSelection, setRowSelection] = React.useState({});

    // Paging state (server-side friendly)
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    // For now mock paging
    const total = mockData.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const pageData = mockData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

    const selectedIds = Object.keys(rowSelection ?? {}).filter((k) => (rowSelection as any)[k]);

    return (
        <div className="p-2">


            <FilterBar
                fields={
                    <>
                        <div className="w-[220px]">
                            <Input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="w-[220px]">
                            <Input placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                        </div>
                        <div className="w-[220px]">
                            <Input placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                        </div>
                    </>
                }
                actions={[
                    {
                        key: "search",
                        label: "Search",
                        onClick: () => {
                            console.log("search", { name, supplier, origin });
                            setPageIndex(0);
                        },
                    },
                    {
                        key: "reset",
                        label: "Reset",
                        variant: "secondary",
                        onClick: () => {
                            setName("");
                            setSupplier("");
                            setOrigin("");
                            setPageIndex(0);
                        },
                    },
                    {
                        key: "create",
                        label: "Create",
                        variant: "outline",
                        onClick: () => console.log("create"),
                    },
                    {
                        key: "batchDelete",
                        label: "Batch Delete",
                        variant: "destructive",
                        disabled: selectedIds.length === 0,
                        onClick: () => console.log("batch delete", selectedIds),
                    },
                ]}
                className="mb-4"
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
                onPageChange={(p) => setPageIndex(Math.min(Math.max(0, p), pageCount - 1))}
                onPageSizeChange={(s) => {
                    setPageSize(s);
                    setPageIndex(0);
                }}
                loading={false}
                emptyText="No products found"
            />
        </div>
    );
}