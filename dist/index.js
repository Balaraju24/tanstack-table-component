"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_table_1 = require("@tanstack/react-table");
const TanStackTable = ({ columns, data, loading = false, getData, paginationDetails, removeSortingForColumnIds = [], heightClass, noDataLabel, onRowClick, }) => {
    const [sorting, setSorting] = (0, react_1.useState)([]);
    const table = (0, react_table_1.useReactTable)({
        columns,
        data: (data === null || data === void 0 ? void 0 : data.length) ? data : [],
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(),
    });
    const capturePageNum = (value) => {
        var _a, _b;
        if (getData) {
            getData({
                page: value,
                page_size: (paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size) || 25,
                order_by: (_a = sorting[0]) === null || _a === void 0 ? void 0 : _a.id,
                order_type: ((_b = sorting[0]) === null || _b === void 0 ? void 0 : _b.desc) ? "desc" : "asc",
            });
        }
    };
    const captureRowPerItems = (value) => {
        var _a, _b;
        if (getData) {
            getData({
                page: 1,
                page_size: value,
                order_by: (_a = sorting[0]) === null || _a === void 0 ? void 0 : _a.id,
                order_type: ((_b = sorting[0]) === null || _b === void 0 ? void 0 : _b.desc) ? "desc" : "asc",
            });
        }
    };
    const getWidth = (id) => {
        const widthObj = columns.find((col) => col.id === id);
        return widthObj ? (widthObj === null || widthObj === void 0 ? void 0 : widthObj.width) || (widthObj === null || widthObj === void 0 ? void 0 : widthObj.size) || "100px" : "100px";
    };
    const sortAndGetData = (header) => {
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
        }
        else {
            orderType = "asc";
            orderBy = `${header.id}:asc`;
        }
        setSorting(orderBy ? [{ id: header.id, desc: orderType === "desc" }] : []);
        if (getData) {
            getData({
                page: 1,
                page_size: (paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size) || 25,
                order_by: orderBy,
                order_type: orderType,
            });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "overflow-x-auto w-full", children: [(0, jsx_runtime_1.jsx)("div", { className: `overflow-auto w-full relative transition-all duration-300 ${heightClass || "h-auto"}`, children: !data.length && !loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex h-full mt-[5%] justify-center items-center", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xl text-gray-600 font-normal", children: noDataLabel || "No data available" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "max-h-[calc(100vh-180px)]", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full border-collapse", children: [(0, jsx_runtime_1.jsx)("thead", { className: "sticky top-0 z-10", children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)("tr", { children: headerGroup.headers.map((header) => ((0, jsx_runtime_1.jsx)("th", { colSpan: header.colSpan, className: "bg-black text-white font-medium p-2", style: {
                                            minWidth: getWidth(header.id),
                                            width: getWidth(header.id),
                                        }, children: (0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-1 ${header.column.getCanSort()
                                                ? "cursor-pointer select-none"
                                                : ""}`, onClick: () => sortAndGetData(header), children: [(0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()), (0, jsx_runtime_1.jsx)(SortItems, { header: header, removeSortingForColumnIds: removeSortingForColumnIds })] }) }, header.id))) }, headerGroup.id))) }), (0, jsx_runtime_1.jsx)("tbody", { children: (data === null || data === void 0 ? void 0 : data.length) ? (table.getRowModel().rows.map((row) => ((0, jsx_runtime_1.jsx)("tr", { className: "even:bg-gray-100 hover:bg-gray-300 transition-colors duration-200", onClick: () => onRowClick === null || onRowClick === void 0 ? void 0 : onRowClick(row.original), children: row.getVisibleCells().map((cell) => ((0, jsx_runtime_1.jsx)("td", { className: "p-2 border-b border-gray-200", children: (0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : loading ? ([...Array(25)].map((_, i) => ((0, jsx_runtime_1.jsx)("tr", { className: "border-b", children: [...Array(columns.length)].map((_, j) => ((0, jsx_runtime_1.jsx)("td", { className: "p-2", children: j === 1 ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-7 w-7 bg-gray-200 rounded-full" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3/5 bg-gray-200" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3/5 bg-gray-200" })) }, `loading-cell-${i}-${j}`))) }, `loading-row-${i}`)))) : ((0, jsx_runtime_1.jsx)("tr", {})) })] }) })) }), (data === null || data === void 0 ? void 0 : data.length) && paginationDetails ? ((0, jsx_runtime_1.jsx)(PaginationComponent, { paginationDetails: paginationDetails, capturePageNum: capturePageNum, captureRowPerItems: captureRowPerItems })) : null] }));
};
const SortItems = ({ header, removeSortingForColumnIds = [] }) => {
    const currentSort = header.column.getIsSorted();
    if (removeSortingForColumnIds.includes(header.id)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center", children: currentSort === "asc" ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M3 5l7-4 7 4H3z" }) })) : currentSort === "desc" ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M17 15l-7 4-7-4h14z" }) })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M5 7h10v2H5zm0 4h10v2H5z" }) })) }));
};
const PaginationComponent = ({ paginationDetails, capturePageNum, captureRowPerItems, }) => {
    const { current_page, total_pages, page_size } = paginationDetails;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { children: "Rows per page:" }), (0, jsx_runtime_1.jsx)("select", { value: page_size, onChange: (e) => captureRowPerItems(Number(e.target.value)), className: "border rounded p-1", children: [10, 25, 50, 100].map((size) => ((0, jsx_runtime_1.jsx)("option", { value: size, children: size }, size))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "border rounded p-1 disabled:opacity-50", disabled: current_page === 1, onClick: () => capturePageNum(current_page - 1), children: "Previous" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Page ", current_page, " of ", total_pages] }), (0, jsx_runtime_1.jsx)("button", { className: "border rounded p-1 disabled:opacity-50", disabled: current_page === total_pages, onClick: () => capturePageNum(current_page + 1), children: "Next" })] })] }));
};
exports.default = TanStackTable;
