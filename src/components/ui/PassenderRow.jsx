// components/ui/PassengerRow.jsx
import * as React from "react"
import { Input } from "./Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select"
import { Label } from "./Label"
import DateField from "./DateField"
import { AlertCircle, CheckCircle, Globe, User, UserCog } from "lucide-react"
import { Badge } from "./Badge"
import countries from "react-select-country-list"

export const PassengerRow = ({
  index,
  type = "Adult",
  onDataChange,
  initialData,
  onValidation,
  showErrors = false
}) => {
  const [data, setData] = React.useState({
    title: "",
    surname: "",
    givenName: "",
    passportNo: "",
    dateOfBirth: "",
    passportExpiry: "",
    nationality: "",
    ...initialData
  })

  const [touched, setTouched] = React.useState({})
  const countryList = React.useMemo(() => countries().getData(), [])

  // Validation rules
  const validationRules = {
    surname: { required: true, minLength: 2 },
    givenName: { required: true, minLength: 2 },
    passportNo: { required: type !== "Infant", pattern: /^[A-Z0-9]{6,9}$/ },
    dateOfBirth: { required: true },
    passportExpiry: { required: type !== "Infant", futureDate: true },
    nationality: { required: true }
  }

  const validateField = (field, value) => {
    const rules = validationRules[field]
    if (!rules) return null

    if (rules.required && !value) {
      return "This field is required"
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return "Invalid format (6-9 alphanumeric characters)"
    }

    if (rules.futureDate && value) {
      const expiry = new Date(value)
      const today = new Date()
      if (expiry <= today) {
        return "Passport must be valid (future date)"
      }
    }

    return null
  }

  const getFieldError = (field) => {
    if (!showErrors) return null
    return validateField(field, data[field])
  }

  const isFieldValid = (field) => {
    if (!touched[field]) return null
    const error = validateField(field, data[field])
    return !error
  }

  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    setTouched(prev => ({ ...prev, [field]: true }))

    if (onDataChange) {
      onDataChange(index, newData)
    }

    if (onValidation) {
      const isValid = !validateField(field, value)
      onValidation(index, field, isValid)
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const titles = type === "Adult"
    ? ["Mr", "Ms", "Mrs"]
    : type === "Child"
      ? ["Mr", "Ms"]
      : ["INF"]

  const getPassengerIcon = () => {
    switch (type) {
      case "Adult": return <User className="h-4 w-4" />
      case "Child": return <UserCog className="h-4 w-4" />
      default: return <User className="h-4 w-4 opacity-50" />
    }
  }

  const isRowComplete = () => {
    const requiredFields = ['surname', 'givenName', 'dateOfBirth', 'nationality']
    if (type !== "Infant") {
      requiredFields.push('passportNo', 'passportExpiry')
    }
    return requiredFields.every(field => data[field] && !validateField(field, data[field]))
  }

  return (
    <div className={`border rounded-lg transition-all duration-200 ${isRowComplete() ? 'border-green-200 bg-green-50/30' : 'border-border bg-card'} hover:border-ring/50`}>
      <div className="p-4">
        {/* Row Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isRowComplete() ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
              {getPassengerIcon()}
            </div>
            <div>
              <div className="font-medium">
                {type} {index + 1}
                {isRowComplete() && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Fill in passenger details
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Required fields are marked with *
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <Label htmlFor={`title-${index}`} className="text-xs mb-1.5">
              Title *
            </Label>
            <Select
              value={data.title}
              onValueChange={(value) => handleChange("title", value)}
            >
              <SelectTrigger
                id={`title-${index}`}
                className={`h-10 ${getFieldError('title') ? 'border-destructive' : ''}`}
                error={!!getFieldError('title')}
              >
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('title') && (
              <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError('title')}
              </div>
            )}
          </div>

          {/* Surname */}
          <div className="md:col-span-3">
            <Label htmlFor={`surname-${index}`} className="text-xs mb-1.5">
              Surname *
            </Label>
            <Input
              id={`surname-${index}`}
              value={data.surname}
              onChange={(e) => handleChange("surname", e.target.value)}
              onBlur={() => handleBlur('surname')}
              placeholder="Enter surname"
              className="h-10"
              error={getFieldError('surname')}
              success={isFieldValid('surname') ? "Valid" : ""}
            />
          </div>

          {/* Given Name */}
          <div className="md:col-span-3">
            <Label htmlFor={`givenName-${index}`} className="text-xs mb-1.5">
              Given Name *
            </Label>
            <Input
              id={`givenName-${index}`}
              value={data.givenName}
              onChange={(e) => handleChange("givenName", e.target.value)}
              onBlur={() => handleBlur('givenName')}
              placeholder="Enter given name"
              className="h-10"
              error={getFieldError('givenName')}
              success={isFieldValid('givenName') ? "Valid" : ""}
            />
          </div>

          {/* Passport Number */}
          <div className="md:col-span-2">
            <Label htmlFor={`passportNo-${index}`} className="text-xs mb-1.5">
              Passport No {type !== "Infant" && "*"}
            </Label>
            <Input
              id={`passportNo-${index}`}
              value={data.passportNo}
              onChange={(e) => handleChange("passportNo", e.target.value.toUpperCase())}
              onBlur={() => handleBlur('passportNo')}
              placeholder="AB1234567"
              className="h-10"
              maxLength={9}
              disabled={type === "Infant"}
              error={getFieldError('passportNo')}
              success={isFieldValid('passportNo') ? "Valid format" : ""}
              helperText={type === "Infant" ? "Not required for infants" : "6-9 alphanumeric"}
            />
          </div>

          {/* Date of Birth */}
          <div className="md:col-span-2">
            <Label htmlFor={`dob-${index}`} className="text-xs mb-1.5">
              Date of Birth *
            </Label>
            <DateField
              id={`dob-${index}`}
              value={data.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e?.target?.value ?? "")}
              onBlur={() => handleBlur('dateOfBirth')}
              max={new Date().toISOString().split('T')[0]}
              error={getFieldError('dateOfBirth')}
              className="h-10"
            />
          </div>

          {/* Passport Expiry */}
          <div className="md:col-span-2">
            <Label htmlFor={`passportExpiry-${index}`} className="text-xs mb-1.5">
              Passport Expiry {type !== "Infant" && "*"}
            </Label>
            <DateField
              id={`passportExpiry-${index}`}
              value={data.passportExpiry}
              onChange={(e) => handleChange("passportExpiry", e?.target?.value ?? "")}
              onBlur={() => handleBlur('passportExpiry')}
              min={new Date().toISOString().split('T')[0]}
              disabled={type === "Infant"}
              error={getFieldError('passportExpiry')}
              helperText={type === "Infant" ? "Not required" : "Must be future date"}
              className="h-10"
            />
          </div>

          {/* Nationality */}
          <div className="md:col-span-2">
            <Label htmlFor={`nationality-${index}`} className="text-xs mb-1.5 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Nationality *
            </Label>
            <Select
              value={data.nationality}
              onValueChange={(value) => handleChange("nationality", value)}
            >
              <SelectTrigger
                id={`nationality-${index}`}
                className={`h-10 ${getFieldError('nationality') ? 'border-destructive' : ''}`}
                error={!!getFieldError('nationality')}
                leftIcon={<Globe className="h-4 w-4 text-muted-foreground" />}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countryList.map((country) => (
                  <SelectItem
                    key={country.value}
                    value={country.value}
                  >
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('nationality') && (
              <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError('nationality')}
              </div>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        {showErrors && !isRowComplete() && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Please complete all required fields:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {Object.keys(validationRules).map(field => {
                const error = validateField(field, data[field])
                if (error && validationRules[field]?.required) {
                  return (
                    <div key={field} className="text-xs text-destructive">
                      • {field.charAt(0).toUpperCase() + field.slice(1)}: {error}
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        {/* Age Information */}
        <div className="mt-4 text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>
              <strong>Age requirements:</strong> {type === "Adult" ? "12+ years" : type === "Child" ? "2-11 years" : "Under 2 years"}
            </span>
          </div>
          {type === "Infant" && (
            <div className="mt-1 text-amber-600 dark:text-amber-400">
              Note: Infants must be accompanied by at least one adult. Passport details are not required for infants.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export a hook for managing multiple passenger rows
export const usePassengerRows = (initialPassengers = []) => {
  const [passengers, setPassengers] = React.useState(initialPassengers)
  const [validation, setValidation] = React.useState({})

  const addPassenger = (type, data = {}) => {
    const newPassenger = {
      id: Date.now(),
      type,
      ...data
    }
    setPassengers([...passengers, newPassenger])
    return newPassenger
  }

  const updatePassenger = (index, data) => {
    setPassengers(prev => prev.map((p, i) =>
      i === index ? { ...p, ...data } : p
    ))
  }

  const ensurePassengerCount = (total, getTypeForIndex) => {
    setPassengers(prev => {
      if (prev.length >= total) return prev.slice(0, total)
      const next = [...prev]
      while (next.length < total) {
        const i = next.length
        const type = getTypeForIndex(i)
        next.push({
          id: Date.now() + i,
          type,
          title: type === "Adult" ? "Mr" : type === "Child" ? "Master" : "INF"
        })
      }
      return next
    })
  }

  const removePassenger = (index) => {
    setPassengers(prev => prev.filter((_, i) => i !== index))
  }

  const validatePassenger = (index, field, isValid) => {
    setValidation(prev => ({
      ...prev,
      [`${index}-${field}`]: isValid
    }))
  }

  const isAllValid = () => {
    return passengers.every(p =>
      p.surname && p.givenName && p.dateOfBirth && p.nationality &&
      (p.type === "Infant" || (p.passportNo && p.passportExpiry))
    )
  }

  const getValidationErrors = () => {
    const errors = []
    passengers.forEach((p, index) => {
      if (!p.surname) errors.push(`Passenger ${index + 1}: Surname is required`)
      if (!p.givenName) errors.push(`Passenger ${index + 1}: Given name is required`)
      if (!p.dateOfBirth) errors.push(`Passenger ${index + 1}: Date of birth is required`)
      if (!p.nationality) errors.push(`Passenger ${index + 1}: Nationality is required`)
      if (p.type !== "Infant") {
        if (!p.passportNo) errors.push(`Passenger ${index + 1}: Passport number is required`)
        if (!p.passportExpiry) errors.push(`Passenger ${index + 1}: Passport expiry is required`)
      }
    })
    return errors
  }

  return {
    passengers,
    addPassenger,
    updatePassenger,
    ensurePassengerCount,
    removePassenger,
    validatePassenger,
    isAllValid,
    getValidationErrors,
    validation
  }
}