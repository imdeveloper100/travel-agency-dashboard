import React from 'react'
import { IconUser } from '@tabler/icons-react'
import { Input } from './Input'
import { Label } from './Label'

const PassengerInfoTab = ({ formData, handleChange }) => {
  return (
    <>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <IconUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Passenger Information</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This information is optional for admin. Agents will fill this when booking tickets for customers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Passenger Name"
          placeholder="John Doe"
          value={formData.passengerName}
          onChange={(e) => handleChange('passengerName', e.target.value)}
          leftIcon={<IconUser className="h-4 w-4" />}
          helperText="Optional: Can be filled later by agent"
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          helperText="Optional: For ticket confirmation"
          error={formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "Invalid email format" : ""}
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+92 300 1234567"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        helperText="Optional contact number"
      />

      <div className="space-y-3">
        <Label htmlFor="notes">Additional Notes</Label>
        <textarea
          id="notes"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Special requests, dietary restrictions, address, etc."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          These notes will be visible to agents when they book this ticket for customers.
        </p>
      </div>
    </>
  )
}

export default PassengerInfoTab