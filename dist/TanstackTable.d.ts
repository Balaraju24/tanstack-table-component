import { FC } from "react";
export interface PaginationDetails {
    current_page: number;
    total_pages: number;
    total_count?: number;
    total_records?: number;
    page_size: number;
}
export interface LimitOption {
    title: string;
    value: number;
}
export interface PageProps<T> {
    columns: any[];
    data: T[];
    loading?: boolean;
    getData?: (params: {
        page: number;
        page_size: number;
        order_by?: string;
        order_type?: string;
    }) => void;
    paginationDetails?: PaginationDetails;
    removeSortingForColumnIds?: string[];
    heightClass?: string;
    noDataLabel?: string;
    noDataDescription?: string;
    showNoDataIcon?: boolean;
    noDataHeight?: string;
    onRowClick?: (row: T) => void;
}
declare const TanStackTable: FC<PageProps<any>>;
export default TanStackTable;
