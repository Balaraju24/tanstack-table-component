import React, { useCallback, useState } from "react";
import { LimitOption, PaginationProps } from "../../lib/core";
import { Input } from "../ui/input";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCNPagination,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const PaginationComponent: React.FC<PaginationProps> = ({
  capturePageNum,
  captureRowPerItems,
  initialPage = 1,
  limitOptionsFromProps = [],
  paginationDetails,
}) => {
  const [inputPageValue, setInputPageValue] = useState<string>(
    initialPage.toString()
  );
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
    <ShadCNPagination className="flex justify-between items-center !mx-0 !px-3 sticky bottom-0 bg-white border-t shadow-none">
      {/* Left side: rows per page + record count */}
      <PaginationContent className="flex items-center gap-5">
        <Select
          value={selectedValue?.toString()}
          onValueChange={handleRowChange}
        >
          <SelectTrigger className="w-24 h-8 text-xs border rounded-none cursor-pointer">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent className="w-[120px] text-xs bg-white">
            {limitOptions.map((item) => (
              <SelectItem
                value={item.value?.toString()}
                key={item.value}
                className="cursor-pointer text-xs"
              >
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-xs opacity-80">
          {Math.min(firstIndex + 1, totalRecords)} -{" "}
          {Math.min(lastIndex, totalRecords)} of {totalRecords}
        </div>
      </PaginationContent>

      {/* Right side: GoTo + navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center text-xs opacity-80">
          GoTo
          <Input
            value={inputPageValue}
            onChange={handleInputChange}
            onKeyDown={onKeyDownInPageChange}
            className="h-6 w-10 ml-2 text-center bg-gray-200 rounded-none text-xs"
          />
        </div>

        <PaginationContent className="flex items-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage === 1 ? undefined : "#"}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }
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
                  className={`text-xs w-6 h-6 ${
                    pageNumber === currentPage
                      ? "bg-black text-white"
                      : "hover:bg-gray-200"
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
              className={
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </ShadCNPagination>
  );
};

export default PaginationComponent;
