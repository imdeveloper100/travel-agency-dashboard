import React from 'react'
import { IconCurrencyDollar, IconInfoCircle } from '@tabler/icons-react'
import { Input } from './Input'
import { Label } from './Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'

const PaymentInfoTab = ({ formData, handleChange, paymentMethods }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Price (PKR)"
          type="number"
          required
          placeholder="96000"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          leftIcon={<IconCurrencyDollar className="h-4 w-4" />}
          min="0"
          step="100"
          rightIcon={<span className="text-sm font-medium">PKR</span>}
          helperText="Total ticket price"
        />

        <div className="space-y-3">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleChange('paymentMethod', value)}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Payment Information</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Tickets will be issued immediately upon successful payment.
          All prices include applicable taxes and fees.
        </p>
      </div>
    </>
  )
}

export default PaymentInfoTab