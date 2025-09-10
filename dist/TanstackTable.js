"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_table_1 = require("@tanstack/react-table");
const TanStackTable = ({ columns, data, loading = false, getData, paginationDetails, removeSortingForColumnIds = [], heightClass, noDataLabel, noDataDescription, showNoDataIcon = true, noDataHeight, onRowClick, }) => {
    const [sorting, setSorting] = (0, react_1.useState)([]);
    const shouldStickyLastColumn = columns.length > 6;
    const lastColumnIndex = columns.length - 1;
    const table = (0, react_table_1.useReactTable)({
        columns,
        data: (data === null || data === void 0 ? void 0 : data.length) ? data : [],
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(),
    });
    const capturePageNum = (0, react_1.useCallback)((value) => {
        var _a, _b;
        if (getData) {
            getData({
                page: value,
                page_size: (paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size) || 15,
                order_by: ((_a = sorting[0]) === null || _a === void 0 ? void 0 : _a.id)
                    ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
                    : "",
                order_type: ((_b = sorting[0]) === null || _b === void 0 ? void 0 : _b.desc) ? "desc" : "asc",
            });
        }
    }, [getData, paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size, sorting]);
    const captureRowPerItems = (0, react_1.useCallback)((value) => {
        var _a, _b;
        if (getData) {
            getData({
                page: 1,
                page_size: value,
                order_by: ((_a = sorting[0]) === null || _a === void 0 ? void 0 : _a.id)
                    ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
                    : "",
                order_type: ((_b = sorting[0]) === null || _b === void 0 ? void 0 : _b.desc) ? "desc" : "asc",
            });
        }
    }, [getData, sorting]);
    const getWidth = (0, react_1.useCallback)((id) => {
        const widthObj = columns.find((col) => col.id === id);
        return widthObj ? (widthObj === null || widthObj === void 0 ? void 0 : widthObj.width) || (widthObj === null || widthObj === void 0 ? void 0 : widthObj.size) || "100px" : "100px";
    }, [columns]);
    const isLastColumn = (0, react_1.useCallback)((index) => {
        return shouldStickyLastColumn && index === lastColumnIndex;
    }, [shouldStickyLastColumn, lastColumnIndex]);
    const getColumnStyle = (0, react_1.useCallback)((headerId, index) => {
        const baseStyle = {
            minWidth: getWidth(headerId),
            width: getWidth(headerId),
        };
        if (isLastColumn(index)) {
            return Object.assign(Object.assign({}, baseStyle), { position: "sticky", right: 0, backgroundColor: "black", zIndex: 11 });
        }
        return Object.assign(Object.assign({}, baseStyle), { position: "sticky", top: 0, backgroundColor: "black", zIndex: 10 });
    }, [getWidth, isLastColumn]);
    const getCellStyle = (0, react_1.useCallback)((index, isEven) => {
        if (isLastColumn(index)) {
            return {
                position: "sticky",
                right: 0,
                backgroundColor: isEven ? "white" : "#f9fafb",
                zIndex: 5,
            };
        }
        return {};
    }, [isLastColumn]);
    const sortAndGetData = (0, react_1.useCallback)((header) => {
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
                page_size: (paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size) || 15,
                order_by: orderBy,
                order_type: orderType,
            });
        }
    }, [getData, paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size, removeSortingForColumnIds]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full rounded-md bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: `w-full relative bg-white ${heightClass || "h-96"} overflow-auto custom-scrollbar`, style: { display: "flex", flexDirection: "column" }, children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex flex-col", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full border-collapse bg-white min-w-full table-fixed", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-black border-b", children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)("tr", { className: "border-b", children: headerGroup.headers.map((header, index) => ((0, jsx_runtime_1.jsx)("th", { colSpan: header.colSpan, className: "bg-black text-left px-3 py-2 text-sm font-normal text-white/90 sticky top-0 z-10", style: getColumnStyle(header.id, index), children: (0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-2 ${header.column.getCanSort()
                                                ? "cursor-pointer select-none"
                                                : ""}`, onClick: () => sortAndGetData(header), children: [(0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()), (0, jsx_runtime_1.jsx)(SortItems, { header: header, removeSortingForColumnIds: removeSortingForColumnIds })] }) }, `${header.id}-${index}`))) }, headerGroup.id))) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-gray-200", children: [...Array((paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size) || 15)].map((_, i) => ((0, jsx_runtime_1.jsx)("tr", { className: `border-b border-b-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`, children: [...Array(columns.length)].map((_, j) => ((0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 text-sm text-gray-900 whitespace-nowrap", style: getCellStyle(j, i % 2 === 0), children: j === 1 ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 flex gap-2 items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-7 w-7 bg-gray-200 rounded-full" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3/5 bg-gray-200" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "p-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3/5 bg-gray-200" }) })) }, `loading-cell-${i}-${j}`))) }, `loading-row-${i}`))) })] }) })) : !data.length ? ((0, jsx_runtime_1.jsx)(NoDataDisplay, { title: noDataLabel || "No Data Available", description: noDataDescription, showIcon: showNoDataIcon, height: noDataHeight || heightClass || "h-96" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex flex-col", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full overflow-auto custom-scrollbar", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full border border-gray-200 border-collapse bg-white min-w-full table-fixed", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-black border-b", children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)("tr", { className: "border-b", children: headerGroup.headers.map((header, index) => ((0, jsx_runtime_1.jsx)("th", { colSpan: header.colSpan, className: "bg-black text-left px-3 py-2 text-sm font-normal text-white/90 sticky top-0 z-10", style: getColumnStyle(header.id, index), children: (0, jsx_runtime_1.jsxs)("div", { className: `flex items-center gap-2 ${header.column.getCanSort()
                                                    ? "cursor-pointer select-none"
                                                    : ""}`, onClick: () => sortAndGetData(header), children: [(0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()), (0, jsx_runtime_1.jsx)(SortItems, { header: header, removeSortingForColumnIds: removeSortingForColumnIds })] }) }, `${header.id}-${index}`))) }, headerGroup.id))) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-gray-200", children: (data === null || data === void 0 ? void 0 : data.length) ? (table.getRowModel().rows.map((row, index) => ((0, jsx_runtime_1.jsx)("tr", { className: `transition-colors duration-200 border-b border-b-gray-100 cursor-pointer ${index % 2 === 0
                                            ? "bg-white hover:bg-gray-100"
                                            : "bg-gray-50 hover:bg-gray-100"}`, onClick: () => onRowClick === null || onRowClick === void 0 ? void 0 : onRowClick(row.original), children: row.getVisibleCells().map((cell, cellIndex) => ((0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-sm text-gray-900 whitespace-nowrap", style: getCellStyle(cellIndex, index % 2 === 0), children: (0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: columns.length, className: "text-center py-8", children: (0, jsx_runtime_1.jsx)(NoDataDisplay, { title: noDataLabel || "No Data Available", description: noDataDescription, showIcon: showNoDataIcon, height: noDataHeight || heightClass || "h-96" }) }) })) })] }) }) })) }), !loading && (data === null || data === void 0 ? void 0 : data.length) && paginationDetails ? ((0, jsx_runtime_1.jsx)("div", { className: "border-gray-200", children: (0, jsx_runtime_1.jsx)(PaginationComponent, { paginationDetails: paginationDetails, capturePageNum: capturePageNum, captureRowPerItems: captureRowPerItems, initialPage: (paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.current_page) || 1 }) })) : null] }));
};
const SortItems = ({ header, removeSortingForColumnIds = [] }) => {
    const currentSort = header.column.getIsSorted();
    if (removeSortingForColumnIds.includes(header.id)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center", children: currentSort === "asc" ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M3 5l7-4 7 4H3z" }) })) : currentSort === "desc" ? ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M17 15l-7 4-7-4h14z" }) })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { d: "M5 7h10v2H5zm0 4h10v2H5z" }) })) }));
};
const PaginationComponent = ({ paginationDetails, capturePageNum, captureRowPerItems, initialPage = 1, limitOptionsFromProps = [], }) => {
    var _a, _b, _c, _d, _e;
    const [inputPageValue, setInputPageValue] = (0, react_1.useState)(initialPage.toString());
    const [limitOptions] = (0, react_1.useState)(limitOptionsFromProps.length
        ? limitOptionsFromProps
        : [
            { title: "15/page", value: 15 },
            { title: "25/page", value: 25 },
            { title: "100/page", value: 100 },
            { title: "250/page", value: 250 },
            { title: "500/page", value: 500 },
        ]);
    const totalPages = (_a = paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.total_pages) !== null && _a !== void 0 ? _a : 1;
    const selectedValue = (_b = paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.page_size) !== null && _b !== void 0 ? _b : 15;
    const totalRecords = (_d = (_c = paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.total_records) !== null && _c !== void 0 ? _c : paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.total_count) !== null && _d !== void 0 ? _d : 0;
    const currentPage = (_e = paginationDetails === null || paginationDetails === void 0 ? void 0 : paginationDetails.current_page) !== null && _e !== void 0 ? _e : initialPage;
    const lastIndex = currentPage * selectedValue;
    const firstIndex = lastIndex - selectedValue;
    const handlePageChange = (0, react_1.useCallback)((page) => {
        if (page >= 1 && page <= totalPages) {
            setInputPageValue(page.toString());
            capturePageNum(page);
        }
    }, [capturePageNum, totalPages]);
    const handleRowChange = (0, react_1.useCallback)((newLimit) => {
        captureRowPerItems(Number(newLimit));
    }, [captureRowPerItems]);
    const handleInputChange = (0, react_1.useCallback)((e) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]+$/.test(value)) {
            setInputPageValue(value);
        }
    }, []);
    const onKeyDownInPageChange = (0, react_1.useCallback)((e) => {
        if (e.key === "Enter") {
            const page = Math.max(1, Math.min(parseInt(inputPageValue) || 1, totalPages));
            handlePageChange(page);
        }
    }, [inputPageValue, totalPages, handlePageChange]);
    const getPageNumbers = (0, react_1.useCallback)(() => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push(null);
                pageNumbers.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push(null);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            }
            else {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center p-2 sticky bottom-0 bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-5", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("select", { value: selectedValue, onChange: (e) => handleRowChange(e.target.value), className: "w-24 text-xs py-1 h-8 border rounded cursor-pointer", children: limitOptions.map((item) => ((0, jsx_runtime_1.jsx)("option", { value: item.value, className: "text-xs", children: item.title }, item.value))) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs opacity-80", children: [Math.min(firstIndex + 1, totalRecords), " -", " ", Math.min(lastIndex, totalRecords), " of ", totalRecords] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-xs opacity-80", children: ["Go to", (0, jsx_runtime_1.jsx)("input", { value: inputPageValue, onChange: handleInputChange, onKeyDown: onKeyDownInPageChange, className: "h-6 w-10 text-center bg-gray-100 rounded text-xs ml-2 border", placeholder: "Page" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { className: "border rounded p-1 text-xs disabled:opacity-50", disabled: currentPage === 1, onClick: () => handlePageChange(currentPage - 1), children: "Previous" }), getPageNumbers().map((pageNumber, index) => pageNumber === null ? ((0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "..." }, `ellipsis-${index}`)) : ((0, jsx_runtime_1.jsx)("button", { className: `text-xs px-2 py-1 rounded ${pageNumber === currentPage ? "bg-black text-white" : "border"}`, onClick: () => handlePageChange(pageNumber), children: pageNumber }, pageNumber))), (0, jsx_runtime_1.jsx)("button", { className: "border rounded p-1 text-xs disabled:opacity-50", disabled: currentPage === totalPages, onClick: () => handlePageChange(currentPage + 1), children: "Next" })] })] })] }));
};
const NoDataDisplay = ({ title, description, showIcon = true, height }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center ${height || "h-96"} text-center p-4`, children: [showIcon && ((0, jsx_runtime_1.jsx)("svg", { className: "w-12 h-12 text-gray-400 mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" }) })), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-600", children: title }), description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: description }))] }));
};
exports.default = TanStackTable;
