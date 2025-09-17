import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { FC, useCallback, useState } from "react";
import "../styles/custom.css";
import { Input } from "./ui/input";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationPrevious as ShadCNPagination,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  noDataClassName?: string;
  sortIconClassName?: string;
  wrapperClassName?: string;
  scrollClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  loadingRowClassName?: string;
  paginationClassName?: string;
}

const TanStackTable: FC<PageProps<unknown>> = ({
  columns,
  data,
  loading = false,
  getData,
  paginationDetails,
  removeSortingForColumnIds = [],
  heightClass,
  noDataLabel,
  noDataDescription,
  showNoDataIcon = true,
  noDataHeight,
  onRowClick,
  tableClassName = "",
  theadClassName = "",
  tbodyClassName = "",
  thClassName = "",
  trClassName = "",
  tdClassName = "",
  paginationClassName = "",
  noDataClassName = "",
  loadingRowClassName = "",
  sortIconClassName = "",
  scrollClassName = "",
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const shouldStickyLastColumn = columns.length > 6;
  const lastColumnIndex = columns.length - 1;

  const table = useReactTable({
    columns,
    data: data?.length ? data : [],
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const capturePageNum = useCallback(
    (value: number) => {
      if (getData) {
        getData({
          page: value,
          page_size: paginationDetails?.page_size || 15,
          order_by: sorting[0]?.id
            ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
            : "",
          order_type: sorting[0]?.desc ? "desc" : "asc",
        });
      }
    },
    [getData, paginationDetails?.page_size, sorting]
  );

  const captureRowPerItems = useCallback(
    (value: number) => {
      if (getData) {
        getData({
          page: 1,
          page_size: value,
          order_by: sorting[0]?.id
            ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
            : "",
          order_type: sorting[0]?.desc ? "desc" : "asc",
        });
      }
    },
    [getData, sorting]
  );

  const getWidth = useCallback(
    (id: string) => {
      const widthObj = columns.find((col) => col.id === id);
      return widthObj ? widthObj?.width || widthObj?.size || "100px" : "100px";
    },
    [columns]
  );

  const isLastColumn = useCallback(
    (index: number) => {
      return shouldStickyLastColumn && index === lastColumnIndex;
    },
    [shouldStickyLastColumn, lastColumnIndex]
  );

  const getColumnStyle = useCallback(
    (headerId: string, index: number) => {
      const baseStyle = {
        minWidth: getWidth(headerId),
        width: getWidth(headerId),
      };
      if (isLastColumn(index)) {
        return {
          ...baseStyle,
          position: "sticky" as const,
          right: 0,
          backgroundColor: "white", // Use white for body cells; header already black
          zIndex: 12, // Higher z-index for last column to avoid overlap
          borderLeft: "1px solid #e5e7eb", // Add subtle border to separate from scrolling content
        };
      }
      return {
        ...baseStyle,
        position: "sticky" as const,
        top: 0,
        backgroundColor: "black", // Header only
        zIndex: 10,
      };
    },
    [getWidth, isLastColumn]
  );

  const getCellStyle = useCallback(
    (index: number, isEven: boolean) => {
      if (isLastColumn(index)) {
        return {
          position: "sticky" as const,
          right: 0,
          backgroundColor: isEven ? "white" : "#f9fafb", // Match row alternation
          zIndex: 5,
          borderLeft: "1px solid #e5e7eb", // Consistent border
        };
      }
      return {};
    },
    [isLastColumn]
  );

  const sortAndGetData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (header: Header<any, unknown>) => {
      if (removeSortingForColumnIds.includes(header.id)) {
        return;
      }
      const currentSort = sorting.find((s) => s.id === header.id);
      let orderBy = "";
      let orderType = "";
      if (currentSort) {
        if (!currentSort.desc) {
          orderType = "desc";
          orderBy = `${header.id}:desc`;
        }
      } else {
        orderType = "asc";
        orderBy = `${header.id}:asc`;
      }
      setSorting(
        orderBy ? [{ id: header.id, desc: orderType === "desc" }] : []
      );
      if (getData) {
        getData({
          page: 1,
          page_size: paginationDetails?.page_size || 15,
          order_by: orderBy,
          order_type: orderType,
        });
      }
    },
    [getData, paginationDetails?.page_size, removeSortingForColumnIds, sorting]
  );

  return (
    <div className="w-full rounded-md bg-white">
      <div
        className={`w-full relative bg-white ${
          heightClass || "h-96"
        } overflow-auto custom-scrollbar`}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <div className="w-full h-full flex flex-col">
            <Table className={cn("min-w-full", tableClassName)}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHead
                        key={`${header.id}-${index}`}
                        colSpan={header.colSpan}
                        className={cn(
                          "px-3 py-2 text-left text-sm font-normal",
                          thClassName
                        )}
                        style={getColumnStyle(header.id, index)}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          )}
                          onClick={() => sortAndGetData(header)}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <SortItems
                            header={header}
                            removeSortingForColumnIds={
                              removeSortingForColumnIds
                            }
                            className={sortIconClassName}
                          />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                className={cn("divide-y divide-gray-200", tbodyClassName)}
              >
                {[...Array(paginationDetails?.page_size || 15)].map((_, i) => (
                  <TableRow
                    key={`loading-row-${i}`}
                    className={cn(
                      `border-b border-b-gray-100 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`,
                      trClassName,
                      loadingRowClassName
                    )}
                  >
                    {[...Array(columns.length)].map((_, j) => (
                      <TableCell
                        key={`loading-cell-${i}-${j}`}
                        className={cn("px-4 py-3 text-sm", tdClassName)}
                        style={getCellStyle(j, i % 2 === 0)}
                      >
                        {j === 1 ? (
                          <div className="p-2 flex gap-2 items-center">
                            <Skeleton className="h-7 w-7 rounded-full" />
                            <Skeleton className="h-3 w-3/5" />
                          </div>
                        ) : (
                          <div className="p-2">
                            <Skeleton className="h-3 w-3/5" />
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : !data.length ? (
          <NoDataDisplay
            title={noDataLabel || "No Data Available"}
            description={noDataDescription}
            showIcon={showNoDataIcon}
            height={noDataHeight || heightClass || "h-96"}
            className={noDataClassName}
          />
        ) : (
          <div
            className={cn(
              "w-full",
              heightClass,
              "overflow-auto custom-scrollbar",
              scrollClassName || ""
            )}
          >
            {" "}
            <div className="w-full overflow-auto custom-scrollbar">
              <Table
                className={cn(
                  "min-w-full table-fixed",
                  tableClassName,
                  "border-separate"
                )}
              >
                <TableHeader
                  className={cn("bg-black border-b", theadClassName)}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className={cn("border-b", trClassName)}
                    >
                      {headerGroup.headers.map((header, index) => (
                        <TableHead
                          key={`${header.id}-${index}`}
                          colSpan={header.colSpan}
                          className={cn(
                            "bg-black text-left px-3 py-2 text-sm font-normal text-white/90", // Remove inline sticky top-0 z-10; rely on getColumnStyle
                            thClassName
                          )}
                          style={getColumnStyle(header.id, index)}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-2",
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            )}
                            onClick={() => sortAndGetData(header)}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <SortItems
                              header={header}
                              removeSortingForColumnIds={
                                removeSortingForColumnIds
                              }
                              className={sortIconClassName}
                            />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <div
                  className={cn(
                    "w-full overflow-auto custom-scrollbar",
                    heightClass
                  )}
                >
                  <TableBody
                    className={cn("divide-y divide-gray-200", tbodyClassName)}
                  >
                    {data?.length ? (
                      table.getRowModel().rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          className={cn(
                            `transition-colors duration-200 border-b border-b-gray-100 cursor-pointer ${
                              index % 2 === 0
                                ? "bg-white hover:bg-gray-100"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`,
                            trClassName
                          )}
                          onClick={() => onRowClick?.(row.original)}
                        >
                          {row.getVisibleCells().map((cell, cellIndex) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                "px-4 py-2 text-sm text-gray-900 whitespace-nowrap",
                                tdClassName
                              )}
                              style={getCellStyle(cellIndex, index % 2 === 0)}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className={trClassName}>
                        <TableCell
                          colSpan={columns.length}
                          className={cn("text-center py-8", tdClassName)}
                        >
                          <NoDataDisplay
                            title={noDataLabel || "No Data Available"}
                            description={noDataDescription}
                            showIcon={showNoDataIcon}
                            height={noDataHeight || heightClass || "h-96"}
                            className={noDataClassName}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </div>
              </Table>
            </div>
          </div>
        )}
      </div>
      {!loading && data?.length && paginationDetails ? (
        <div className={cn("border-gray-200", paginationClassName)}>
          <PaginationComponent
            paginationDetails={paginationDetails}
            capturePageNum={capturePageNum}
            captureRowPerItems={captureRowPerItems}
            initialPage={paginationDetails?.current_page || 1}
          />
        </div>
      ) : null}
    </div>
  );
};

const SortItems: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header: Header<any, unknown>;
  removeSortingForColumnIds?: string[];
  className?: string;
}> = ({ header, removeSortingForColumnIds = [], className = "" }) => {
  const currentSort = header.column.getIsSorted();
  if (removeSortingForColumnIds.includes(header.id)) {
    return null;
  }
  return (
    <div className={cn("flex items-center", className)}>
      {currentSort === "asc" ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 5l7-4 7 4H3z" />
        </svg>
      ) : currentSort === "desc" ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17 15l-7 4-7-4h14z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 7h10v2H5zm0 4h10v2H5z" />
        </svg>
      )}
    </div>
  );
};

interface PaginationComponentProps {
  paginationDetails: PaginationDetails;
  capturePageNum: (page: number) => void;
  captureRowPerItems: (pageSize: number) => void;
  initialPage?: number;
  limitOptionsFromProps?: LimitOption[];
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  capturePageNum,
  captureRowPerItems,
  initialPage = 1,
  limitOptionsFromProps = [],
  paginationDetails,
}) => {
  const [inputPageValue, setInputPageValue] = useState<string>(
    initialPage.toString()
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limitOptions, setLimitOptions] = useState<LimitOption[]>(
    limitOptionsFromProps.length
      ? limitOptionsFromProps
      : [
          { title: "15/page", value: 15 },
          { title: "25/page", value: 25 },
          { title: "100/page", value: 100 },
          { title: "250/page", value: 250 },
          { title: "500/page", value: 500 },
        ]
  );

  const totalPages = paginationDetails?.total_pages ?? 1;
  const selectedValue = paginationDetails?.page_size ?? 15;
  const totalRecords = paginationDetails?.total_records ?? 0;
  const currentPage = paginationDetails?.current_page ?? initialPage;

  const lastIndex = currentPage * selectedValue;
  const firstIndex = lastIndex - selectedValue;

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setInputPageValue(page.toString());
        capturePageNum(page);
      }
    },
    [capturePageNum, totalPages]
  );

  const handleRowChange = useCallback(
    (newLimit: string) => {
      captureRowPerItems(Number(newLimit));
    },
    [captureRowPerItems]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^[0-9]+$/.test(value)) {
        setInputPageValue(value);
      }
    },
    []
  );

  const onKeyDownInPageChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const page = Math.max(
          1,
          Math.min(parseInt(inputPageValue) || 1, totalPages)
        );
        handlePageChange(page);
      }
    },
    [inputPageValue, totalPages, handlePageChange]
  );

  const getPageNumbers = useCallback((): (number | null)[] => {
    const pageNumbers: (number | null)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(null);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(null);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  }, [currentPage, totalPages]);

  return (
    <ShadCNPagination className="flex justify-between items-center !mx-0 !px-0 sticky bottom-0 shadow-none border-none">
      <PaginationContent className="!px-0 pt-1 flex gap-5">
        <Select
          value={selectedValue?.toString()}
          onValueChange={handleRowChange}
        >
          <SelectTrigger className="w-24 text-xs !py-0 !h-8 border cursor-pointer">
            <SelectValue
              placeholder="Items per page"
              className="font-normal text-xs!rounded-none "
            />
          </SelectTrigger>
          <SelectContent className="w-[120px]  text-xs bg-white pointer">
            {limitOptions.map((item) => (
              <SelectItem
                value={item.value?.toString()}
                key={item.value}
                className="cursor-pointer font-normal text-xs opacity-90"
              >
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="font-normal text-xs opacity-80">
          {Math.min(firstIndex + 1, totalRecords)} -{" "}
          {Math.min(lastIndex, totalRecords)} of {totalRecords}
        </div>
      </PaginationContent>
      <div className="flex justify-end items-center">
        <PaginationContent className="px-1 py-0">
          <div className="flex items-center font-normal text-xs opacity-80">
            GoTo
            <Input
              value={inputPageValue}
              onChange={handleInputChange}
              onKeyDown={onKeyDownInPageChange}
              className="h-6 w-10 text-center bg-gray-300 rounded-none text-xs ml-2"
              placeholder="Page"
            />
          </div>
        </PaginationContent>

        <PaginationContent className="px-1 py-0 font-normal">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage === 1 ? undefined : "#"}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "opacity-50 " : ""}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === null ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNumber);
                  }}
                  className={`text-xs ${
                    pageNumber === currentPage
                      ? "bg-black text-white w-6 h-6 rounded-none "
                      : "rounded-none"
                  }`}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href={currentPage === totalPages ? undefined : "#"}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "opacity-50 " : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </ShadCNPagination>
  );
};

const NoDataDisplay: FC<{
  title: string;
  description?: string;
  showIcon?: boolean;
  height?: string;
  className?: string;
}> = ({ title, description, showIcon = true, height, className = "" }) => {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center ${
          height || "h-96"
        } text-center p-4`,
        className
      )}
    >
      {showIcon && (
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      )}
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
};

export default TanStackTable;
