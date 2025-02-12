// Filter types
export type FilterOption = {
  label: string;
  value: string;
};

export type FilterableColumn = {
  accessorKey: string;
  title: string;
  filterType: "text" | "select" | "date";
  options?: FilterOption[];
  excludeFromTable?: boolean;
};

// Pagination types
export type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
};

export type PaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type PaginationData = {
  meta: PaginationMeta;
  links: PaginationLinks;
};

export type QueryParams = {
  page?: number;
  per_page?: number;
  sort_field?: string;
  sort_direction?: "asc" | "desc";
  [key: string]: any;
};
