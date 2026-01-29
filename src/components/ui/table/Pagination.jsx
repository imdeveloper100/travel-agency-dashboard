import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '../Button'

export function Pagination({ table, itemLabel = 'item' }) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
      <div className="text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} {itemLabel}
        {table.getFilteredRowModel().rows.length !== 1 ? 's' : ''} available
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({
            length: Math.min(5, table.getPageCount()),
          }).map((_, i) => {
            const pageIndex = Math.max(
              0,
              table.getState().pagination.pageIndex - 2
            )
            const page = pageIndex + i

            if (page >= table.getPageCount()) return null

            return (
              <Button
                key={page}
                variant={
                  table.getState().pagination.pageIndex === page
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(page)}
              >
                {page + 1}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}