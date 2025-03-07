import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { TrashIcon } from "lucide-react";
import { CalendarDatePicker } from "../ui/calendar-datetime-picker";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { FilterableColumn, QueryParams } from "@/types/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
  queryParams: QueryParams;
  routeName: string; // Dynamic route to pass in Inertia router
  entityId?: string | number;
  isLoading: boolean;
  onFilter: (name: string, value: string | string[]) => void;
  onReset: () => void;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns,
  queryParams,
  routeName,
  entityId,
  isLoading,
  onFilter,
  onReset,
}: DataTableToolbarProps<TData>) {
  // Create an array of params that should not trigger the reset button
  const excludedParams = ["page", "per_page", "tab"];

  // Check if there are any filter parameters (excluding pagination and sorting)
  const isFiltered = Object.keys(queryParams).some(
    (param) => !excludedParams.includes(param),
  );

  const [dateRanges, setDateRanges] = useState<{
    [key: string]: { from: Date; to: Date };
  }>(
    filterableColumns
      .filter((col) => col.filterType === "date")
      .reduce(
        (acc, col) => {
          acc[col.accessorKey] = {
            from: new Date(new Date().getFullYear(), 0, 1),
            to: new Date(),
          };
          return acc;
        },
        {} as { [key: string]: { from: Date; to: Date } },
      ),
  );

  const [showAllFilters, setShowAllFilters] = useState(false); // State to control filter visibility
  const [isMobile, setIsMobile] = useState(false); // State to track if the screen is below "md"
  const [isReset, setIsReset] = useState(false);

  // Create a ref to store references to all text inputs
  const textInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Store previous values to compare against
  const previousValues = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    // Handler to detect screen width changes and set mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 'md' breakpoint is usually 768px
    };

    handleResize(); // Initialize on component mount
    window.addEventListener("resize", handleResize); // Attach the event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
    };
  }, []);

  // Initialize previous values from queryParams
  useEffect(() => {
    previousValues.current = Object.keys(queryParams).reduce(
      (acc, key) => {
        if (typeof queryParams[key] === "string") {
          acc[key] = queryParams[key] as string;
        }
        return acc;
      },
      {} as { [key: string]: string },
    );
  }, []);

  const updateQuery = (name: string, value: string | string[]) => {
    const updatedParams = {
      ...queryParams,
      [name]: value,
      page: queryParams.page || 1, // Ensure page is preserved
    };

    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete updatedParams[name]; // Remove param if value is empty
    }

    if (entityId) {
      updatedParams.entityId = entityId; // Include entityId if provided
    }

    router.get(route(routeName, { id: entityId }), updatedParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDateSelect = (
    accessorKey: string,
    { from, to }: { from: Date; to: Date },
  ) => {
    setDateRanges((prev) => ({
      ...prev,
      [accessorKey]: { from, to },
    }));
    updateQuery(accessorKey, [from.toISOString(), to.toISOString()]); // Apply date range query
  };

  const handleTextInputChange = (accessorKey: string, value: string) => {
    // Check if the value is the same as the previous one
    if (previousValues.current[accessorKey] === value) {
      return;
    }

    // Update previous value
    previousValues.current[accessorKey] = value;

    // Only trigger filter if value has changed
    onFilter(accessorKey, value);
  };

  const handleReset = () => {
    // Clear all text input values
    Object.values(textInputRefs.current).forEach((input) => {
      if (input) {
        input.value = "";
      }
    });

    setIsReset(true);
    onReset();
    setShowAllFilters(false);
    setTimeout(() => setIsReset(false), 100);
  };

  const activeFilterableColumns = filterableColumns.filter(
    (col) => !col.excludeFromTable,
  );

  const shouldShowAllFiltersButton = isMobile || activeFilterableColumns.length > 4;

  const visibleFilters =
    showAllFilters || isMobile
      ? activeFilterableColumns
      : activeFilterableColumns.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <div
          className={`flex flex-1 flex-wrap items-center gap-2 ${isMobile && !showAllFilters ? "hidden" : ""}`}
        >
          {/* Loop through visible filterable columns */}
          {visibleFilters.map((column) => {
            if (column.filterType === "text") {
              return (
                <Input
                  key={column.accessorKey}
                  placeholder={`Filter by ${column.title}`}
                  defaultValue={queryParams[column.accessorKey] || ""}
                  disabled={isLoading}
                  ref={(el) => {
                    textInputRefs.current[column.accessorKey] = el;
                  }}
                  onBlur={(event) => {
                    handleTextInputChange(
                      column.accessorKey,
                      (event.target as HTMLInputElement).value,
                    );
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleTextInputChange(
                        column.accessorKey,
                        (event.target as HTMLInputElement).value,
                      );
                    }
                  }}
                  className="h-8 w-[150px] lg:w-[170px]"
                />
              );
            }

            if (column.filterType === "select" && column.options) {
              return (
                <DataTableFacetedFilter
                  key={column.accessorKey}
                  column={table.getColumn(column.accessorKey)}
                  title={column.title}
                  options={column.options}
                  onSelect={(selectedValues: string[]) => {
                    onFilter(column.accessorKey, selectedValues);
                  }}
                  initialSelectedValues={queryParams[column.accessorKey] || []}
                  disabled={isLoading}
                  isReset={isReset}
                />
              );
            }

            if (column.filterType === "date") {
              return (
                <CalendarDatePicker
                  key={column.accessorKey}
                  date={dateRanges[column.accessorKey]}
                  onDateSelect={(dateRange) =>
                    handleDateSelect(column.accessorKey, dateRange)
                  }
                  className="h-8"
                  variant="outline"
                />
              );
            }

            return null;
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={isLoading}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <Button variant="outline" size="sm">
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          ) : null}

          {shouldShowAllFiltersButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllFilters(!showAllFilters)}
              className={`h-8 w-full ${isMobile && "mt-2"}`}
            >
              {showAllFilters ? "Hide Filters" : "Show All Filters"}
            </Button>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
