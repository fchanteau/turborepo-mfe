import * as React from "react"
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import type {
  Column,
  ColumnDef,
  FilterFn,
  Row,
  RowData,
  TableFeatures,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  FilterIcon,
  ListFilterIcon,
} from "lucide-react"
import { cn } from "cn"

import { Badge } from "#components/badge"
import { Button } from "#components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "#components/command"
import { Input } from "#components/input"
import { Popover, PopoverContent, PopoverTrigger } from "#components/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/table"
import { Toggle } from "#components/toggle"

type DataTableColumnMeta = {
  /** Column name shown in the filter dropdown. Defaults to a string `header`, then the column id. */
  filterTitle?: string
  /** Label of a value in the filter dropdown (e.g. `true` → "In stock"). Defaults to `String(value)`. */
  filterLabel?: (value: unknown) => string
}

// Keeps rows whose value is one of the values selected in the column filter dropdown.
const filterFn_inValues: FilterFn<TableFeatures, RowData> = (
  row,
  columnId,
  filterValue: unknown[]
) => filterValue.includes(row.getValue(columnId))
filterFn_inValues.autoRemove = (filterValue: unknown[] | undefined) =>
  !filterValue?.length

const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inValues: filterFn_inValues,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

type DataTableFeatures = typeof dataTableFeatures

// `any` value type lets columns with different accessor types share one array, as in TanStack's docs.
type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

type DataTableProps<TData extends RowData> = {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  /** Shows a search input filtering all columns when set. */
  filterPlaceholder?: string
  /**
   * Adds a "Filters" toggle that shows a value filter in every filterable column header
   * (accessor columns, unless `enableColumnFilter: false`). Hiding the filters clears them.
   */
  enableColumnFilters?: boolean
  pageSize?: number
  emptyMessage?: React.ReactNode
  getRowId?: (row: TData) => string
  onRowClick?: (row: TData) => void
  /** Tree data: returns the nested rows of a row. They render as indented, expandable rows. */
  getSubRows?: (row: TData) => TData[] | undefined
  /** Detail panel rendered under a row when it is expanded. */
  renderSubComponent?: (row: TData) => React.ReactNode
  /** Restricts which rows can show the detail panel. Defaults to every row. */
  getRowCanExpand?: (row: TData) => boolean
  className?: string
}

function DataTable<TData extends RowData>({
  columns,
  data,
  filterPlaceholder,
  enableColumnFilters = false,
  pageSize = 10,
  emptyMessage = "No results.",
  getRowId,
  onRowClick,
  getSubRows,
  renderSubComponent,
  getRowCanExpand,
  className,
}: DataTableProps<TData>) {
  const expandable = getSubRows !== undefined || renderSubComponent !== undefined
  const hasSubRows = getSubRows !== undefined

  const tableColumns = React.useMemo(
    () =>
      expandable ? [expanderColumn<TData>(hasSubRows), ...columns] : columns,
    [expandable, hasSubRows, columns]
  )

  const table = useTable({
    features: dataTableFeatures,
    columns: tableColumns,
    data,
    getRowId: getRowId && ((row: TData) => getRowId(row)),
    getSubRows: getSubRows && ((row: TData) => getSubRows(row)),
    getRowCanExpand: renderSubComponent
      ? (row) => getRowCanExpand?.(row.original) ?? true
      : undefined,
    globalFilterFn: "includesString",
    defaultColumn: { filterFn: "inValues" },
    // Keeps a parent row visible when only one of its sub-rows matches the search.
    filterFromLeafRows: hasSubRows,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  })

  const globalFilter = (table.state.globalFilter as string | undefined) ?? ""
  const activeColumnFilters = table.state.columnFilters.length
  const [showColumnFilters, setShowColumnFilters] = React.useState(false)

  const toggleColumnFilters = (pressed: boolean) => {
    setShowColumnFilters(pressed)
    if (!pressed) table.resetColumnFilters(true)
  }

  // Reveals matching sub-rows while searching or filtering.
  React.useEffect(() => {
    if (hasSubRows && (globalFilter || activeColumnFilters))
      table.toggleAllRowsExpanded(true)
  }, [hasSubRows, globalFilter, activeColumnFilters, table])

  const rows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length
  const { pageIndex } = table.state.pagination

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    row: Row<DataTableFeatures, TData>
  ) => {
    // Ignore keys from controls inside the row (expander, buttons…).
    if (event.target !== event.currentTarget) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onRowClick?.(row.original)
    }
  }

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-4", className)}>
      {(filterPlaceholder !== undefined || enableColumnFilters) && (
        <div className="flex items-center gap-2">
          {filterPlaceholder !== undefined && (
            <Input
              placeholder={filterPlaceholder}
              aria-label={filterPlaceholder}
              value={globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          )}
          {enableColumnFilters && (
            <Toggle
              variant="outline"
              pressed={showColumnFilters}
              onPressedChange={toggleColumnFilters}
              aria-label={showColumnFilters ? "Hide column filters" : "Show column filters"}
            >
              <ListFilterIcon data-icon="inline-start" />
              Filters
              {activeColumnFilters > 0 && (
                <Badge variant="secondary">{activeColumnFilters}</Badge>
              )}
            </Toggle>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : showColumnFilters &&
                      header.column.getCanFilter() ? (
                      <div className="flex items-center gap-1">
                        <table.FlexRender header={header} />
                        <DataTableColumnFilter column={header.column} />
                      </div>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsExpanded() ? "expanded" : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick && (() => onRowClick(row.original))}
                    onKeyDown={
                      onRowClick && ((event) => handleRowKeyDown(event, row))
                    }
                  >
                    {row.getAllCells().map((cell, index) => (
                      <TableCell key={cell.id}>
                        {/* Indents the first data column of nested rows (getSubRows) by their depth. */}
                        {hasSubRows && index === 1 && row.depth > 0 ? (
                          <div className="flex items-center">
                            {Array.from({ length: row.depth }, (_, level) => (
                              <span
                                key={level}
                                aria-hidden="true"
                                className="inline-block w-6 shrink-0"
                              />
                            ))}
                            <table.FlexRender cell={cell} />
                          </div>
                        ) : (
                          <table.FlexRender cell={cell} />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderSubComponent && row.getIsExpanded() && (
                    <TableRow
                      data-slot="data-table-sub-row"
                      className="bg-muted/30 hover:bg-muted/30"
                    >
                      <TableCell
                        colSpan={row.getAllCells().length}
                        className="whitespace-normal"
                      >
                        {renderSubComponent(row.original)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {filteredCount} row(s)
          {table.getPageCount() > 1 &&
            ` · Page ${pageIndex + 1} of ${table.getPageCount()}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function expanderColumn<TData extends RowData>(
  hasSubRows: boolean
): DataTableColumnDef<TData> {
  return {
    id: "expander",
    enableSorting: false,
    enableGlobalFilter: false,
    header: ({ table }) =>
      hasSubRows ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={table.getIsAllRowsExpanded()}
          aria-label={
            table.getIsAllRowsExpanded() ? "Collapse all rows" : "Expand all rows"
          }
          onClick={table.getToggleAllRowsExpandedHandler()}
        >
          <ChevronRightIcon
            className={cn(
              "transition-transform",
              table.getIsAllRowsExpanded() && "rotate-90"
            )}
          />
        </Button>
      ) : (
        <span className="sr-only">Expand</span>
      ),
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={row.getIsExpanded()}
          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
          onClick={(event) => {
            event.stopPropagation()
            row.toggleExpanded()
          }}
        >
          <ChevronRightIcon
            className={cn(
              "transition-transform",
              row.getIsExpanded() && "rotate-90"
            )}
          />
        </Button>
      ) : null,
  }
}

function DataTableColumnFilter<TData extends RowData, TValue>({
  column,
}: {
  column: Column<DataTableFeatures, TData, TValue>
}) {
  const { header, meta } = column.columnDef
  const title =
    meta?.filterTitle ?? (typeof header === "string" ? header : column.id)
  const getLabel = (value: unknown) =>
    meta?.filterLabel?.(value) ??
    (value === undefined || value === null || value === ""
      ? "(empty)"
      : String(value))

  const selected = (column.getFilterValue() as unknown[] | undefined) ?? []
  const options = Array.from(column.getFacetedUniqueValues())
    .map(([value, count]) => ({ value, count, label: getLabel(value) }))
    .sort((a, b) =>
      typeof a.value === "number" && typeof b.value === "number"
        ? a.value - b.value
        : a.label.localeCompare(b.label)
    )

  const toggleValue = (value: unknown) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    column.setFilterValue(next.length ? next : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant={selected.length ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label={
              selected.length
                ? `Filter ${title} (${selected.length} selected)`
                : `Filter ${title}`
            }
          />
        }
      >
        <FilterIcon className={cn(selected.length && "fill-current")} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandList>
            <CommandEmpty>No values found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={option.label}
                  data-checked={selected.includes(option.value)}
                  onSelect={() => toggleValue(option.value)}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {option.count}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value="__clear__"
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center"
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type DataTableColumnHeaderProps<TData extends RowData, TValue> = {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
  className?: string
}

function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  const sorted = column.getIsSorted()
  const SortIcon =
    sorted === "asc"
      ? ArrowUpIcon
      : sorted === "desc"
        ? ArrowDownIcon
        : ArrowUpDownIcon

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("-ml-2", className)}
      onClick={column.getToggleSortingHandler()}
      aria-label={`Sort by ${title}`}
    >
      {title}
      <SortIcon data-icon="inline-end" />
    </Button>
  )
}

export { DataTable, DataTableColumnHeader }
export type {
  DataTableColumnDef,
  DataTableColumnHeaderProps,
  DataTableColumnMeta,
  DataTableFeatures,
  DataTableProps,
}
