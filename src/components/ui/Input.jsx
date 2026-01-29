import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

const Input = React.forwardRef(({ 
  className, 
  type, 
  label,
  helperText,
  error,
  success,
  disabled,
  required,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const inputType = type === "password" && showPassword ? "text" : type
  
  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-4 w-4 text-destructive" />
    if (success) return <CheckCircle className="h-4 w-4 text-green-500" />
    return null
  }

  const getRightElement = () => {
    if (type === "password" && showPasswordToggle) {
      return (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )
    }
    if (rightIcon) return rightIcon
    return getStatusIcon()
  }

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          className={cn(
            "text-sm font-medium leading-none",
            error && "text-destructive",
            success && "text-green-600",
            disabled && "text-muted-foreground opacity-70"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-lg border bg-background px-3 py-2.5 text-base transition-all duration-200",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground/70",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
            "read-only:bg-muted/30 read-only:cursor-default",
            leftIcon && "pl-10",
            (rightIcon || getStatusIcon() || (type === "password" && showPasswordToggle)) && "pr-10",
            error 
              ? "border-destructive focus:ring-destructive/30 focus:border-destructive" 
              : success 
              ? "border-green-400 focus:ring-green-300 focus:border-green-400"
              : "border-input hover:border-ring/50",
            isFocused && !error && !success && "border-ring",
            className
          )}
          ref={ref}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            helperText || error 
              ? `${props.id}-description` 
              : undefined
          }
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {getRightElement()}
        </div>
      </div>
      
      {(helperText || error) && (
        <p
          id={`${props.id}-description`}
          className={cn(
            "text-sm flex items-center gap-1.5",
            error 
              ? "text-destructive" 
              : success 
              ? "text-green-600"
              : "text-muted-foreground"
          )}
        >
          {error && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export { Input }