import React from "react";
import DatePicker from "./DatePicker";

const DateField = (
  {
    label,
    error,
    className = "",
    required = false,
    placeholder = "date",
    value,
    onChange,
    disabled = false,
    ...props
  }
) => {
    return (
      <div className={`mb-4 w-full ${className}`}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          error={error}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  };

DateField.displayName = "DateField";

export default DateField; 