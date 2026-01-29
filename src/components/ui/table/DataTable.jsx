import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ReusableTable } from './ReusableTable'
import FilterPanel from './FilterPanel'
import { IconCalendar } from '@tabler/icons-react'
import { Plane } from 'lucide-react'
import PrimaryButton from '../PrimaryButton'


export function DataTable({ data }) {
  const navigate = useNavigate()
  const [selectedAirlines, setSelectedAirlines] = React.useState([])
  const [rowSelection, setRowSelection] = React.useState({})

  // Filter data based on selected airlines
  const filteredData = React.useMemo(() => {
    if (selectedAirlines.length === 0) return data
    return data.filter((item) => selectedAirlines.includes(item.airline))
  }, [data, selectedAirlines])

  const columns = React.useMemo(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="font-medium flex items-center gap-2">
          <IconCalendar className="h-4 w-4 text-primary" />
          {row.getValue('date')}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'flight',
      header: 'Flight',
      cell: ({ row }) => (
        <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {row.getValue('flight')}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'origin-destination',
      header: 'Origin - Destination',
      cell: ({ row }) => <div>{row.getValue('origin-destination')}</div>,
      size: 120,
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => <div>{row.getValue('time')}</div>,
      size: 100,
    },
    {
      accessorKey: 'bag',
      header: 'Baggage',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('bag')}
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: 'meal',
      header: 'Meal',
      cell: ({ row }) => {
        const meal = row.getValue('meal')
        return (
          <div className={`px-2 py-1 rounded text-xs font-medium ${meal === 'YES' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {meal}
          </div>
        )
      },
      size: 100,
    },
    {
      accessorKey: 'price',
      header: 'Price (PKR)',
      cell: ({ row }) => {
        const price = row.getValue('price')
        return (
          <div className="text-right font-semibold">
            Rs.{price.toLocaleString()}
          </div>
        )
      },
      size: 120,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          <PrimaryButton onClick={() => navigate(`/booking/${row.original.id}`)}>
            <Plane className="h-4 w-4" />
            Book Now
          </PrimaryButton>
        </div>
      ),
      size: 100,
    },
  ], [navigate])

  const handleAirlineChange = (airline, checked) => {
    setSelectedAirlines((prev) =>
      checked ? [...prev, airline] : prev.filter((a) => a !== airline)
    )
  }

  const handleClearFilters = () => {
    setSelectedAirlines([])
    setRowSelection({})
  }

  const filterComponent = (
    <FilterPanel
      selectedAirlines={selectedAirlines}
      onAirlineChange={handleAirlineChange}
      onClearFilters={handleClearFilters}
    />
  )

  return (
    <ReusableTable
      isLoading={!filteredData || filteredData.length === 0}
      data={filteredData}
      columns={columns}
      enableRowSelection={true}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      filterComponent={filterComponent}
      itemLabel="flight"
      className="px-4 h"
      stickyFooter={true}
    // className='[&_.table-container]:h-[calc(100vh-15.5rem)] [&.full-screen]:[&_.table-container]:h-[100vh]'
    />
  )
}