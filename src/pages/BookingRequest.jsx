import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Button } from '../components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Search, Plane, Users, CheckCircle, Check, X, Clock } from 'lucide-react'
import { useBookingRequests } from '../context/BookingRequestsContext'

const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  'on-hold': { label: 'On Hold', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
}

const TABLE_HEADERS = [
  { id: 'details', label: 'Booking Details' },
  { id: 'group', label: 'Group', icon: Plane },
  { id: 'passengers', label: 'Passengers', icon: Users },
  { id: 'price', label: 'Price (PKR)' },
  { id: 'status', label: 'Status', icon: CheckCircle },
  { id: 'action', label: 'Action', align: 'right' },
]

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BookingRequest() {
  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''
  const { requests, updateStatus } = useBookingRequests()
  const [keyword, setKeyword] = React.useState('')
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')

  const filtered = React.useMemo(() => {
    let list = requests
    if (statusFilter) {
      list = list.filter((r) => r.status === statusFilter)
    }
    if (keyword.trim()) {
      const k = keyword.toLowerCase()
      list = list.filter(
        (r) =>
          (r.reference && r.reference.toLowerCase().includes(k)) ||
          (r.ticketId && String(r.ticketId).toLowerCase().includes(k)) ||
          (r.flightInfo && r.flightInfo.toLowerCase().includes(k))
      )
    }
    if (dateFrom) {
      list = list.filter((r) => r.bookingDate && r.bookingDate.slice(0, 10) >= dateFrom)
    }
    if (dateTo) {
      list = list.filter((r) => r.bookingDate && r.bookingDate.slice(0, 10) <= dateTo)
    }
    return list
  }, [requests, statusFilter, keyword, dateFrom, dateTo])

  const handleSearch = () => { }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Booking Requests</h1>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <Label htmlFor="keyword" className="text-sm">Keyword Search</Label>
              <Input
                id="keyword"
                placeholder="Reference, ticket, flight..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-10"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="dateFrom" className="text-sm">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="dateTo" className="text-sm">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-10 px-6"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent-light/20 hover:bg-accent-light/20 border-0">
                {TABLE_HEADERS.map((col) => {
                  const Icon = col.icon
                  return (
                    <TableHead
                      key={col.id}
                      className={`h-11 font-semibold text-foreground ${col.align === 'right' ? 'text-right' : ''}`}
                    >
                      {Icon ? (
                        <span className="flex items-center gap-1.5">
                          {col.label} <Icon className="h-4 w-4" />
                        </span>
                      ) : (
                        col.label
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length} className="h-32 text-center text-muted-foreground">
                    No booking requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => {
                  const statusConf = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending
                  return (
                    <TableRow key={r.id} className="hover:bg-accent-light/10">
                      <TableCell className="py-3">
                        <div className="font-medium">{r.reference || r.id}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(r.bookingDate)}</div>
                      </TableCell>
                      <TableCell className="py-3">{r.flightInfo}</TableCell>
                      <TableCell className="py-3">{r.passengerCount}</TableCell>
                      <TableCell className="py-3 font-semibold">
                        Rs.{(r.totalAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={statusConf.className}>
                          {statusConf.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(r.status === 'pending' || r.status === 'on-hold') && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => updateStatus(r.id, 'approved')}
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </Button>
                              {r.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={() => updateStatus(r.id, 'on-hold')}
                                >
                                  <Clock className="h-3.5 w-3.5" /> On Hold
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() => updateStatus(r.id, 'rejected')}
                              >
                                <X className="h-3.5 w-3.5" /> Reject
                              </Button>
                            </>
                          )}
                          {(r.status === 'approved' || r.status === 'rejected') && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <footer className="text-sm text-muted-foreground py-4">
        Copyright © {new Date().getFullYear()} All Rights Reserved
      </footer>
    </div>
  )
}
