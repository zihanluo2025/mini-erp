"use client";

// Comments in English.

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

type DataTableAction = {
    key: string;
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    onClick: () => void;
    disabled?: boolean;
};

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    // Selection
    enableRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (next: RowSelectionState) => void;

    // Paging (controlled)
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalCount?: number;
    onPageChange: (nextPageIndex: number) => void;
    onPageSizeChange: (nextPageSize: number) => void;

    // UI state
    loading?: boolean;
    emptyText?: string;

    // ✅ New: Table action buttons shown above the table
    actions?: DataTableAction[];
};

function getPageWindow(pageIndex: number, pageCount: number) {
    const max = 5;
    if (pageCount <= max) return Array.from({ length: pageCount }, (_, i) => i);
    const start = Math.max(0, Math.min(pageIndex - 2, pageCount - max));
    return Array.from({ length: max }, (_, i) => start + i);
}

export function DataTable<TData, TValue>({
    columns,
    data,

    enableRowSelection = true,
    rowSelection,
    onRowSelectionChange,

    pageIndex,
    pageSize,
    pageCount,
    totalCount,
    onPageChange,
    onPageSizeChange,

    loading,
    emptyText = "No data",

    actions = [],
}: DataTableProps<TData, TValue>) {
    const finalColumns = React.useMemo(() => {
        if (!enableRowSelection) return columns;
        const selectionColumn: ColumnDef<TData, TValue> = {
            id: "__select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
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
        return [selectionColumn, ...columns];
    }, [columns, enableRowSelection]);

    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API returns non-memoizable functions
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
                        ? (updater as (prev: RowSelectionState) => RowSelectionState)(rowSelection ?? {})
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

    const selectedCount = enableRowSelection
        ? table.getSelectedRowModel().rows.length
        : 0;

    const canPrev = pageIndex > 0;
    const canNext = pageIndex < pageCount - 1;
    const pageNums = React.useMemo(
        () => getPageWindow(pageIndex, pageCount),
        [pageIndex, pageCount]
    );

    return (
        <div className="rounded-xl border bg-white">
            <div className="p-3">
                {/* Action bar INSIDE table component */}
                {actions.length ? (
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                            {actions.map((a) => (
                                <Button
                                    key={a.key}
                                    variant={a.variant ?? "default"}
                                    onClick={a.onClick}
                                    disabled={a.disabled}
                                >
                                    {a.label}
                                </Button>
                            ))}
                        </div>

                        {enableRowSelection ? (
                            <div className="text-sm text-muted-foreground">
                                Selected: {selectedCount}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id} className="bg-muted/30">
                                    {hg.headers.map((h) => (
                                        <TableHead key={h.id} className="text-sm font-medium">
                                            {h.isPlaceholder
                                                ? null
                                                : flexRender(h.column.columnDef.header, h.getContext())}
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
                                table.getRowModel().rows.map((row, idx) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() ? "selected" : undefined}
                                        className={["hover:bg-muted/30", idx % 2 === 1 ? "bg-muted/10" : ""].join(" ")}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-sm">
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
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {typeof totalCount === "number" ? `Total ${totalCount} ` : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => onPageChange(pageIndex - 1)} disabled={!canPrev}>
                            {"<"}
                        </Button>

                        {pageNums.map((p) => (
                            <Button
                                key={p}
                                variant={p === pageIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(p)}
                            >
                                {p + 1}
                            </Button>
                        ))}

                        <Button variant="outline" size="sm" onClick={() => onPageChange(pageIndex + 1)} disabled={!canNext}>
                            {">"}
                        </Button>

                        <div className="ml-2 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">pageSize</span>
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