// components/ui/BookingSummary.jsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Separator } from "./Separator"
import { Badge } from "./Badge"
import { Calculator, CreditCard, Shield } from "lucide-react"
import { Button } from "./Button"

export const BookingSummary = ({ 
  adultCount = 0,
  adultPrice = 94000,
  childCount = 0,
  childPrice = 0,
  infantCount = 0,
  onConfirmBooking,
  isLoading = false
}) => {
  const adultTotal = adultCount * adultPrice
  const childTotal = childCount * childPrice
  const infantTotal = 0 // Price on call
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
        
        {/* Security Information */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="font-medium">Secure Booking</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your personal and payment information is protected with 256-bit SSL encryption.
          </p>
        </div>
        
        <Separator />
        
        {/* Payment Methods */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Accepted Payment Methods</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 border rounded text-xs">Credit Card</div>
            <div className="px-3 py-1 border rounded text-xs">Debit Card</div>
            <div className="px-3 py-1 border rounded text-xs">Bank Transfer</div>
          </div>
        </div>
        
        {/* Confirm Button */}
        <div className="pt-4">
          <Button
            onClick={onConfirmBooking}
            disabled={isLoading || adultCount === 0}
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
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            By confirming, you agree to our Terms & Conditions and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  )
}