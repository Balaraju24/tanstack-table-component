import React, { FC, useCallback, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

export interface PaginationDetails {
  current_page: number;
  total_pages: number;
  total_count?: number; // Optional for backward compatibility
  total_records?: number; // Added to match provided PaginationComponent
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

const TanStackTable: FC<PageProps<any>> = ({
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
          backgroundColor: "black",
          zIndex: 11,
        };
      }
      return {
        ...baseStyle,
        position: "sticky" as const,
        top: 0,
        backgroundColor: "black",
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
          backgroundColor: isEven ? "white" : "#f9fafb",
          zIndex: 5,
        };
      }
      return {};
    },
    [isLastColumn]
  );

  const sortAndGetData = useCallback(
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
    [getData, paginationDetails?.page_size, removeSortingForColumnIds]
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
            <table className="w-full border-collapse bg-white min-w-full table-fixed">
              <thead className="bg-black border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map(
                      (header: Header<any, unknown>, index: number) => (
                        <th
                          key={`${header.id}-${index}`}
                          colSpan={header.colSpan}
                          className="bg-black text-left px-3 py-2 text-sm font-normal text-white/90 sticky top-0 z-10"
                          style={getColumnStyle(header.id, index)}
                        >
                          <div
                            className={`flex items-center gap-2 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }`}
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
                            />
                          </div>
                        </th>
                      )
                    )}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...Array(paginationDetails?.page_size || 15)].map((_, i) => (
                  <tr
                    key={`loading-row-${i}`}
                    className={`border-b border-b-gray-100 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {[...Array(columns.length)].map((_, j) => (
                      <td
                        key={`loading-cell-${i}-${j}`}
                        className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                        style={getCellStyle(j, i % 2 === 0)}
                      >
                        {j === 1 ? (
                          <div className="p-2 flex gap-2 items-center">
                            <div className="h-7 w-7 bg-gray-200 rounded-full" />
                            <div className="h-3 w-3/5 bg-gray-200" />
                          </div>
                        ) : (
                          <div className="p-2">
                            <div className="h-3 w-3/5 bg-gray-200" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !data.length ? (
          <NoDataDisplay
            title={noDataLabel || "No Data Available"}
            description={noDataDescription}
            showIcon={showNoDataIcon}
            height={noDataHeight || heightClass || "h-96"}
          />
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="w-full overflow-auto custom-scrollbar">
              <table className="w-full border border-gray-200 border-collapse bg-white min-w-full table-fixed">
                <thead className="bg-black border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                      {headerGroup.headers.map(
                        (header: Header<any, unknown>, index: number) => (
                          <th
                            key={`${header.id}-${index}`}
                            colSpan={header.colSpan}
                            className="bg-black text-left px-3 py-2 text-sm font-normal text-white/90 sticky top-0 z-10"
                            style={getColumnStyle(header.id, index)}
                          >
                            <div
                              className={`flex items-center gap-2 ${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""
                              }`}
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
                              />
                            </div>
                          </th>
                        )
                      )}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`transition-colors duration-200 border-b border-b-gray-100 cursor-pointer ${
                          index % 2 === 0
                            ? "bg-white hover:bg-gray-100"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell, cellIndex) => (
                          <td
                            key={cell.id}
                            className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                            style={getCellStyle(cellIndex, index % 2 === 0)}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-8">
                        <NoDataDisplay
                          title={noDataLabel || "No Data Available"}
                          description={noDataDescription}
                          showIcon={showNoDataIcon}
                          height={noDataHeight || heightClass || "h-96"}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {!loading && data?.length && paginationDetails ? (
        <div className="border-gray-200">
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
  header: Header<any, unknown>;
  removeSortingForColumnIds?: string[];
}> = ({ header, removeSortingForColumnIds = [] }) => {
  const currentSort = header.column.getIsSorted();
  if (removeSortingForColumnIds.includes(header.id)) {
    return null;
  }
  return (
    <div className="flex items-center">
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

const PaginationComponent: FC<PaginationComponentProps> = ({
  paginationDetails,
  capturePageNum,
  captureRowPerItems,
  initialPage = 1,
  limitOptionsFromProps = [],
}) => {
  const [inputPageValue, setInputPageValue] = useState<string>(
    initialPage.toString()
  );
  const [limitOptions] = useState<LimitOption[]>(
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
  const totalRecords =
    paginationDetails?.total_records ?? paginationDetails?.total_count ?? 0;
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
    <div className="flex justify-between items-center p-2 sticky bottom-0 bg-white">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <select
            value={selectedValue}
            onChange={(e) => handleRowChange(e.target.value)}
            className="w-24 text-xs py-1 h-8 border rounded cursor-pointer"
          >
            {limitOptions.map((item) => (
              <option key={item.value} value={item.value} className="text-xs">
                {item.title}
              </option>
            ))}
          </select>
          <span className="text-xs opacity-80">
            {Math.min(firstIndex + 1, totalRecords)} -{" "}
            {Math.min(lastIndex, totalRecords)} of {totalRecords}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center text-xs opacity-80">
          Go to
          <input
            value={inputPageValue}
            onChange={handleInputChange}
            onKeyDown={onKeyDownInPageChange}
            className="h-6 w-10 text-center bg-gray-100 rounded text-xs ml-2 border"
            placeholder="Page"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            className="border rounded p-1 text-xs disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === null ? (
              <span key={`ellipsis-${index}`} className="text-xs">
                ...
              </span>
            ) : (
              <button
                key={pageNumber}
                className={`text-xs px-2 py-1 rounded ${
                  pageNumber === currentPage ? "bg-black text-white" : "border"
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            className="border rounded p-1 text-xs disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const NoDataDisplay: FC<{
  title: string;
  description?: string;
  showIcon?: boolean;
  height?: string;
}> = ({ title, description, showIcon = true, height }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        height || "h-96"
      } text-center p-4`}
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
