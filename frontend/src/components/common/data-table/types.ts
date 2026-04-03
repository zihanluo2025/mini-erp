import { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  title: string;
  className?: string;
  headerClassName?: string;
  render: (row: T) => ReactNode;
};

export type PaginationConfig = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectRow?: (rowKey: string) => void;
  onSelectAll?: (checked: boolean) => void;
  allChecked?: boolean;
  emptyText?: string;
  pagination?: PaginationConfig;
  rowClassName?: (row: T) => string | undefined;
  footerLeft?: ReactNode;
};