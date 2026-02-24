"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    RowSelectionState,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    // Selection
    enableRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (updater: RowSelectionState) => void;

    // Paging (controlled)
    pageIndex: number;
    pageSize: number;
    pageCount: number; // total pages
    onPageChange: (nextPageIndex: number) => void;
    onPageSizeChange: (nextPageSize: number) => void;

    // UI state
    loading?: boolean;
    emptyText?: string;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    enableRowSelection = true,
    rowSelection,
    onRowSelectionChange,
    pageIndex,
    pageSize,
    pageCount,
    onPageChange,
    onPageSizeChange,
    loading,
    emptyText = "No data",
}: DataTableProps<TData, TValue>) {
    const selectionColumn: ColumnDef<TData, TValue> = {
        id: "__select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        size: 48,
        enableSorting: false,
        enableHiding: false,
    };

    const finalColumns = React.useMemo(() => {
        if (!enableRowSelection) return columns;
        // Put selection column at first
        return [selectionColumn as ColumnDef<TData, TValue>, ...columns];
    }, [columns, enableRowSelection]);

    const table = useReactTable({
        data,
        columns: finalColumns,
        state: {
            pagination: { pageIndex, pageSize },
            rowSelection: rowSelection ?? {},
        },
        onRowSelectionChange: enableRowSelection
            ? (updater) => {
                const next =
                    typeof updater === "function"
                        ? (updater as any)(rowSelection ?? {})
                        : updater;
                onRowSelectionChange?.(next);
            }
            : undefined,
        manualPagination: true,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection,
    });

    const canPrev = pageIndex > 0;
    const canNext = pageIndex < pageCount - 1;

    return (
        <div className="rounded-xl border bg-white">
            <div className="p-3">
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <TableHead key={h.id} style={{ width: h.getSize() }}>
                                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={finalColumns.length} className="h-24 text-center text-sm text-muted-foreground">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={finalColumns.length} className="h-24 text-center text-sm text-muted-foreground">
                                        {emptyText}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
                        <span className="font-medium">{pageCount}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => onPageChange(0)} disabled={!canPrev}>
                            First
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onPageChange(pageIndex - 1)} disabled={!canPrev}>
                            Prev
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onPageChange(pageIndex + 1)} disabled={!canNext}>
                            Next
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onPageChange(pageCount - 1)} disabled={!canNext}>
                            Last
                        </Button>

                        <div className="ml-2 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows</span>
                            <select
                                className="h-8 rounded-md border bg-white px-2 text-sm"
                                value={pageSize}
                                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            >
                                {[10, 20, 50].map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}