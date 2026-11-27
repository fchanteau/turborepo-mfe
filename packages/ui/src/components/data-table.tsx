import * as React from "react"
import {
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
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
import type { Column, ColumnDef, Row, RowData } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "#components/button"
import { Input } from "#components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/table"

const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
})

type DataTableFeatures = typeof dataTableFeatures

// `any` value type lets columns with different accessor types share one array, as in TanStack's docs.
type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

type DataTableProps<TData extends RowData> = {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  /** Shows a search input filtering all columns when set. */
  filterPlaceholder?: string
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
    // Keeps a parent row visible when only one of its sub-rows matches the search.
    filterFromLeafRows: hasSubRows,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  })

  const globalFilter = (table.state.globalFilter as string | undefined) ?? ""

  // Reveals matching sub-rows while searching.
  React.useEffect(() => {
    if (hasSubRows && globalFilter) table.toggleAllRowsExpanded(true)
  }, [hasSubRows, globalFilter, table])

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
      {filterPlaceholder !== undefined && (
        <Input
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder}
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
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
  DataTableFeatures,
  DataTableProps,
}
