import { ReactNode } from "react";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterField =
  | {
      key: string;
      type: "search";
      placeholder?: string;
      value: string;
      onChange: (value: string) => void;
    }
  | {
      key: string;
      type: "select";
      label?: string;
      value: string;
      options: FilterOption[];
      onChange: (value: string) => void;
    }
  | {
      key: string;
      type: "dateRange";
      label?: string;
      value: string;
      onClick?: () => void;
    }
  | {
      key: string;
      type: "custom";
      render: ReactNode;
    };

export type DataFilterBarProps = {
  fields: FilterField[];
  actionSlot?: ReactNode;
  className?: string;
};