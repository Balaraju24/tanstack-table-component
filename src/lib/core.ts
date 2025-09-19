export interface TanStackTableProps extends pageProps {
  noDataDescription?: string;
  showNoDataIcon?: boolean;
  noDataHeight?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export interface PaginationDetails {
  total_pages: number;
  page_size: number;
  total_records: number;
  current_page: number;
}

export interface PaginationProps {
  capturePageNum: (page: number) => void;
  captureRowPerItems: (limit: number) => void;
  initialPage?: number;
  limitOptionsFromProps?: LimitOption[];
  paginationDetails: PaginationDetails;
}

export interface LimitOption {
  title: string;
  value: number;
}

interface pageProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  heightClass?: string;
  getData?: any;
  paginationDetails: any;
  removeSortingForColumnIds?: string[];
  noDataLabel?: string;
}

export interface NoDataDisplayProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
  height?: string;
  hasSearch?: boolean;
  isOnHold?: boolean;
  onHoldMessage?: string;
  show?: boolean;
}

export type SortItemsProps = {
  header: { id: string };
  removeSortingForColumnIds?: string[];
  sortBy?: string | null;
  sortDirection?: "asc" | "desc" | null;
};
