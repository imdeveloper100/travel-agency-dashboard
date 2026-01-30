// components/ui/BookingSummary.jsx
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Separator } from "./Separator"
import { Badge } from "./Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { Calculator, Users } from "lucide-react"
import PrimaryButton from "./PrimaryButton"

export const BookingSummary = ({
  passengerRows = [],
  adultCount = 0,
  adultPrice = 94000,
  childCount = 0,
  childPrice = 0,
  infantCount = 0,
  onConfirmBooking,
  isLoading = false,
  isValid = true
}) => {
  const adultTotal = adultCount * adultPrice
  const childTotal = childCount * childPrice
  const total = adultTotal + childTotal

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Booking Summary</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Calculator className="h-3 w-3" />
            Price Breakdown
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Passenger Details Table */}
        {passengerRows.length >= 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-primary" />
              Passenger Details
            </div>
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent-light/30 hover:bg-accent-light/20">
                    <TableHead className="h-10 font-semibold text-foreground">Title</TableHead>
                    <TableHead className="h-10 font-semibold text-foreground">Surname</TableHead>
                    <TableHead className="h-10 font-semibold text-foreground">Given Name</TableHead>
                    <TableHead className="h-10 font-semibold text-foreground">Passport No</TableHead>
                    <TableHead className="h-10 font-semibold text-foreground">Date of Birth</TableHead>
                    <TableHead className="h-10 font-semibold text-foreground">Passport Expiry</TableHead>
                    <TableHead className="h-10 font-semibold text-foreground">Nationality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passengerRows.map((p, i) => (
                    <TableRow key={p.id ?? i} className="hover:bg-primary/5">
                      <TableCell className="py-3">{p.title || "—"}</TableCell>
                      <TableCell className="py-3">{p.surname || "—"}</TableCell>
                      <TableCell className="py-3">{p.givenName || "—"}</TableCell>
                      <TableCell className="py-3">{p.passportNo || "—"}</TableCell>
                      <TableCell className="py-3">{p.dateOfBirth || "—"}</TableCell>
                      <TableCell className="py-3">{p.passportExpiry || "—"}</TableCell>
                      <TableCell className="py-3">{p.nationality || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <Separator />

        {/* Passengers Summary */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium">
            <div className="col-span-2">Passenger Type</div>
            <div className="text-center">Count</div>
            <div className="text-right">Total</div>
          </div>

          <Separator />

          <div className="space-y-2">
            {adultCount > 0 && (
              <div className="grid grid-cols-4 gap-4 py-2">
                <div className="col-span-2">Adult</div>
                <div className="text-center">{adultCount}</div>
                <div className="text-right font-semibold">
                  PKR {adultTotal.toLocaleString()}
                </div>
              </div>
            )}

            {childCount > 0 && (
              <div className="grid grid-cols-4 gap-4 py-2">
                <div className="col-span-2">Child</div>
                <div className="text-center">{childCount}</div>
                <div className="text-right font-semibold">
                  PKR {childTotal.toLocaleString()}
                </div>
              </div>
            )}

            {infantCount > 0 && (
              <div className="grid grid-cols-4 gap-4 py-2">
                <div className="col-span-2">Infant</div>
                <div className="text-center">{infantCount}</div>
                <div className="text-right font-semibold">Price On Call</div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                PKR {total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Including all taxes and fees
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Confirm Button */}
        <div>
          <PrimaryButton
            onClick={onConfirmBooking}
            disabled={isLoading || adultCount === 0 || !isValid}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Processing...
              </>
            ) : (
              'Confirm Booking & Proceed to Payment'
            )}
          </PrimaryButton>
          <p className="text-xs text-center text-muted-foreground mt-2">
            By confirming, you agree to our Terms & Conditions and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  )
}