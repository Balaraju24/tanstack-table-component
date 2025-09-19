import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useCallback, useState } from "react";

// External UI building blocks (injectable if needed)

import { useLocation } from "@tanstack/react-router";
import { TanStackTableProps } from "../lib/core";
import NoDataDisplay from "./core/NoDataBlock";
import PaginationComponent from "./core/PaginationComponent";
import TableSortAscIcon from "./icons/sort-a-icon";
import TableSortDscIcon from "./icons/sort-d-icon";
import TableSortNormIcon from "./icons/sort-n-icon";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// Icons (can be swapped by consumers)

const TanStackTable: FC<TanStackTableProps> = ({
  columns,
  data,
  loading = false,
  getData,
  paginationDetails,
  removeSortingForColumnIds,
  heightClass,
  noDataLabel,
  noDataDescription,
  showNoDataIcon = true,
  noDataHeight,
  wrapperClassName,
  tableClassName,
  headerRowClassName,
  headerCellClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
}) => {
  const searchParams = new URLSearchParams(location?.search);
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

  /** pagination handlers */
  const capturePageNum = useCallback(
    (value: number) => {
      getData({
        ...searchParams,
        page_size: searchParams.get("page_size")
          ? Number(searchParams.get("page_size"))
          : 15,
        page: value,
        order_by: searchParams.get("order_by"),
        order_type: searchParams.get("order_type"),
      });
    },
    [getData, searchParams]
  );

  const captureRowPerItems = useCallback(
    (value: number) => {
      getData({
        ...searchParams,
        page_size: value,
        page: 1,
        order_by: searchParams.get("order_by"),
        order_type: searchParams.get("order_type"),
      });
    },
    [getData, searchParams]
  );

  /** sorting handler */
  const sortAndGetData = useCallback(
    (header: any) => {
      if (removeSortingForColumnIds?.includes(header.id)) return;

      let sortBy = header.id;
      let orderBy = `${sortBy}:asc`;

      if (searchParams.get("order_by")?.startsWith(header.id)) {
        if (searchParams.get("order_by") === `${header.id}:asc`) {
          orderBy = `${sortBy}:desc`;
        } else {
          orderBy = "";
        }
      }

      getData({
        ...searchParams,
        page: 1,
        page_size:
          searchParams.get("page_size") || paginationDetails?.page_size || 15,
        order_by: orderBy,
      });
    },
    [
      getData,
      searchParams,
      removeSortingForColumnIds,
      paginationDetails?.page_size,
    ]
  );

  /** width + sticky style helpers */
  const getWidth = useCallback(
    (id: string) => {
      const widthObj = columns.find((col: any) => col.id === id);
      return widthObj ? widthObj?.width || widthObj?.size || "100px" : "100px";
    },
    [columns]
  );

  const isLastColumn = useCallback(
    (index: number) => shouldStickyLastColumn && index === lastColumnIndex,
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
    (index: number, isEven: boolean) =>
      isLastColumn(index)
        ? {
            position: "sticky" as const,
            right: 0,
            backgroundColor: isEven ? "white" : "#f9fafb",
            zIndex: 5,
          }
        : {},
    [isLastColumn]
  );

  return (
    <div className={`w-full rounded-md bg-white ${wrapperClassName ?? ""}`}>
      <div
        className={`w-full relative bg-white ${
          heightClass || "h-96"
        } overflow-auto custom-scrollbar`}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <LoadingTable
            columns={columns}
            paginationDetails={paginationDetails}
            getColumnStyle={getColumnStyle}
            getCellStyle={getCellStyle}
            headerRowClassName={headerRowClassName}
            headerCellClassName={headerCellClassName}
            tableClassName={tableClassName}
            bodyClassName={bodyClassName}
            rowClassName={rowClassName}
            cellClassName={cellClassName}
            sortAndGetData={sortAndGetData}
            removeSortingForColumnIds={removeSortingForColumnIds}
          />
        ) : !data.length ? (
          <NoDataDisplay
            title={noDataLabel || "No Data Available"}
            description={noDataDescription}
            showIcon={showNoDataIcon}
            height={noDataHeight || heightClass || "h-96"}
          />
        ) : (
          <DataTable
            table={table}
            columns={columns}
            getColumnStyle={getColumnStyle}
            getCellStyle={getCellStyle}
            headerRowClassName={headerRowClassName}
            headerCellClassName={headerCellClassName}
            tableClassName={tableClassName}
            bodyClassName={bodyClassName}
            rowClassName={rowClassName}
            cellClassName={cellClassName}
            sortAndGetData={sortAndGetData}
            removeSortingForColumnIds={removeSortingForColumnIds}
            noDataLabel={noDataLabel}
            noDataDescription={noDataDescription}
            showNoDataIcon={showNoDataIcon}
            noDataHeight={noDataHeight}
            heightClass={heightClass}
          />
        )}
      </div>

      {!loading && data?.length && paginationDetails ? (
        <PaginationComponent
          paginationDetails={paginationDetails}
          capturePageNum={capturePageNum}
          captureRowPerItems={captureRowPerItems}
          initialPage={paginationDetails?.current_page || 1}
        />
      ) : null}
    </div>
  );
};

/** Extracted loading skeleton */
const LoadingTable = ({
  columns,
  paginationDetails,
  getColumnStyle,
  getCellStyle,
  headerRowClassName,
  headerCellClassName,
  tableClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  sortAndGetData,
  removeSortingForColumnIds,
}: any) => {
  return (
    <div className="w-full h-full flex flex-col">
      <Table
        className={`w-full border-collapse min-w-full table-fixed ${
          tableClassName ?? ""
        }`}
      >
        <TableHeader className="bg-black border-b">
          <TableRow className={headerRowClassName}>
            {columns.map((header: any, index: number) => (
              <TableHead
                key={`${header.id}-${index}`}
                className={`bg-black text-left px-3 py-2 text-sm font-normal text-white sticky top-0 z-10 ${
                  headerCellClassName ?? ""
                }`}
                style={getColumnStyle(header.id, index)}
                onClick={() => sortAndGetData(header)}
              >
                {header.header}
                <SortItems
                  header={header}
                  removeSortingForColumnIds={removeSortingForColumnIds}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          className={`divide-y divide-gray-200 ${bodyClassName ?? ""}`}
        >
          {[...Array(paginationDetails?.page_size || 15)].map((_, i) => (
            <TableRow
              key={i}
              className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                rowClassName ?? ""
              }`}
            >
              {columns.map((_: any, j: number) => (
                <TableCell
                  key={j}
                  className={`px-4 py-3 text-sm text-gray-900 whitespace-nowrap ${
                    cellClassName ?? ""
                  }`}
                  style={getCellStyle(j, i % 2 === 0)}
                >
                  {j === 1 ? (
                    <div className="p-2 flex gap-2 items-center">
                      <Skeleton className="h-7 w-7 rounded-full bg-gray-200" />
                      <Skeleton className="h-3 w-3/5 bg-gray-200 rounded-none" />
                    </div>
                  ) : (
                    <Skeleton className="h-3 w-3/5 bg-gray-200 rounded-none" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

/** Extracted data table */
const DataTable = ({
  table,
  columns,
  getColumnStyle,
  getCellStyle,
  headerRowClassName,
  headerCellClassName,
  tableClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  sortAndGetData,
  removeSortingForColumnIds,
  noDataLabel,
  noDataDescription,
  showNoDataIcon,
  noDataHeight,
  heightClass,
}: any) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full overflow-auto custom-scrollbar">
        <Table
          className={`w-full border border-gray-200 border-collapse min-w-full table-fixed ${
            tableClassName ?? ""
          }`}
        >
          <TableHeader className="bg-black border-b">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className={headerRowClassName}>
                {headerGroup.headers.map(
                  (header: Header<any, unknown>, index: number) => (
                    <TableHead
                      key={`${header.id}-${index}`}
                      colSpan={header.colSpan}
                      className={`bg-black text-left px-3 py-2 text-sm font-normal text-white/90 sticky top-0 z-10 ${
                        headerCellClassName ?? ""
                      }`}
                      style={getColumnStyle(header.id, index)}
                      onClick={() => sortAndGetData(header)}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2 cursor-pointer">
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
                      )}
                    </TableHead>
                  )
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className={`divide-y divide-gray-200 ${bodyClassName ?? ""}`}
          >
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: any, index: any) => (
                <TableRow
                  key={row.id}
                  className={`transition-colors duration-200 border-b cursor-pointer ${
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-100"
                      : "bg-gray-50 hover:bg-gray-100"
                  } ${rowClassName ?? ""}`}
                >
                  {row.getVisibleCells().map((cell: any, cellIndex: any) => (
                    <TableCell
                      key={cell.id}
                      className={`px-4 py-2 text-sm text-gray-900 whitespace-nowrap ${
                        cellClassName ?? ""
                      }`}
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  <NoDataDisplay
                    title={noDataLabel || "No Data Available"}
                    description={noDataDescription}
                    showIcon={showNoDataIcon}
                    height={noDataHeight || heightClass || "h-96"}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

/** Sorting icons */
const SortItems = ({
  header,
  removeSortingForColumnIds,
}: {
  header: any;
  removeSortingForColumnIds?: string[];
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const sortBy = searchParams.get("order_by")?.split(":")[0];
  const sortDirection = searchParams.get("order_by")?.split(":")[1];

  if (removeSortingForColumnIds?.includes(header.id)) return null;

  return (
    <div className="flex items-center">
      {sortBy === header.id ? (
        sortDirection === "asc" ? (
          <TableSortAscIcon className="size-4" />
        ) : (
          <TableSortDscIcon className="size-4" />
        )
      ) : (
        <TableSortNormIcon className="size-4" />
      )}
    </div>
  );
};

export default TanStackTable;
