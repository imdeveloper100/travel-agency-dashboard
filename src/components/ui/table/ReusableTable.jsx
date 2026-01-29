import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Loader2,
} from 'lucide-react'

import { Checkbox } from '../Checkbox'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table'
import { Pagination } from './Pagination'
import { cn } from '@/lib/utils'

const ReusableTable = React.forwardRef((props, ref) => {
  const {
    data = [],
    columns = [],
    isLoading = false,
    enableRowSelection = false,
    enablePagination = true,
    enableFilters = false,
    enableSorting = false,
    filterComponent,
    rowSelection: externalRowSelection,
    onRowSelectionChange,
    onRowClick,
    onRowDoubleClick,
    stickyFooter = false,
    className,
    pageSize = 10,
    itemLabel = 'item',
    showHeader = true,
    emptyStateMessage = 'No data found',
    loadingMessage = 'Loading...',
    ...tableProps
  } = props

  const [internalRowSelection, setInternalRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  })

  const rowSelection = externalRowSelection !== undefined ? externalRowSelection : internalRowSelection
  const setRowSelection = onRowSelectionChange || setInternalRowSelection

  // Add selection column if enabled
  const tableColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns

    const selectionColumn = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    }

    return [selectionColumn, ...columns]
  }, [columns, enableRowSelection])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFilters ? columnFilters : undefined,
      rowSelection,
      pagination: enablePagination ? pagination : undefined,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFilters ? setColumnFilters : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFilters ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    ...tableProps,
  })

  // Expose table API via ref
  React.useImperativeHandle(ref, () => ({
    getSelectedRows: () => {
      const selectedRows = {}
      Object.keys(rowSelection).forEach(rowId => {
        if (rowSelection[rowId]) {
          selectedRows[rowId] = data[rowId]
        }
      })
      return selectedRows
    },
    getTableInstance: () => table,
    resetSelection: () => setRowSelection({}),
  }))

  // Handle row click events
  const handleRowClick = (row, e) => {
    if (onRowClick) {
      onRowClick(row.original, e)
    }
  }

  const handleRowDoubleClick = (row, e) => {
    if (onRowDoubleClick) {
      onRowDoubleClick(row.original, e)
    }
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Component Slot */}
      {filterComponent && filterComponent}

      {/* Table Section */}
      <div className="flex-1 min-w-0 justify-between">
        {/* Selection Info */}
        {enableRowSelection && selectedRows > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-accent/50 px-4 py-2.5">
            <span className="text-sm font-medium">
              {selectedRows} {itemLabel}{selectedRows !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setRowSelection({})}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Table Container */}
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Scrollable Table Container */}
          <div className={cn(
            "overflow-auto",
            stickyFooter ? "max-h-[calc(100vh-15.5rem)]" : ""
          )}>
            <div className="min-w-max">
              <div className="relative w-full">
                <table className="w-full caption-bottom text-sm">
                  {showHeader && (
                    <TableHeader className="border-b-2 border-accent-dark/50">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b-none sticky top-0 z-10 bg-white">
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className="whitespace-nowrap font-semibold text-foreground h-11 bg-accent-dark/25"
                              style={{
                                width: header.getSize(),
                                minWidth: header.getSize(),
                              }}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                  )}

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={tableColumns.length}
                          className="h-48 text-center"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {loadingMessage}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                          className={cn(
                            "cursor-pointer hover:bg-primary/10 transition-colors",
                            (onRowClick || onRowDoubleClick) && "hover:text-primary"
                          )}
                          onClick={(e) => handleRowClick(row, e)}
                          onDoubleClick={(e) => handleRowDoubleClick(row, e)}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="py-3 whitespace-nowrap"
                              style={{
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                              }}
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
                          colSpan={tableColumns.length}
                          className="h-48 text-center text-muted-foreground"
                        >
                          {emptyStateMessage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination - Always positioned at bottom of the container */}
        {enablePagination && !isLoading && data.length > 0 && (
          <div className="sticky bottom-0 bg-background pt-4 border-t border-border mt-4">
            <Pagination
              table={table}
              itemLabel={itemLabel}
            />
          </div>
        )}
      </div>
    </div>
  )
})

ReusableTable.displayName = 'ReusableTable'

export { ReusableTable }