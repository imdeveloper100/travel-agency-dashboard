import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const DatePicker = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  placeholder = "Select date",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value + "T00:00:00") : null
  );
  const [view, setView] = useState("days"); // "days", "months", "years"
  const [yearRange, setYearRange] = useState({
    start: Math.floor(new Date().getFullYear() / 10) * 10,
    end: Math.floor(new Date().getFullYear() / 10) * 10 + 9,
  });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      const dateFromValue = new Date(value + "T00:00:00"); // Add time to avoid timezone issues
      setSelectedDate(dateFromValue);
      setCurrentDate(dateFromValue);
    }
  }, [value]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days
  const prevMonthLastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();
  const prevMonthDays = [];
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i);
  }

  // Get current month days
  const currentMonthDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    currentMonthDays.push(day);
  }

  // Get next month days to fill the grid
  const totalCells = 42; // 6 rows × 7 days
  const remainingCells =
    totalCells - prevMonthDays.length - currentMonthDays.length;
  const nextMonthDays = [];
  for (let day = 1; day <= remainingCells; day++) {
    nextMonthDays.push(day);
  }

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Navigate years
  const goToPrevYear = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
    );
  };

  const goToNextYear = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1)
    );
  };

  // Navigate year ranges
  const goToPrevYearRange = () => {
    setYearRange({
      start: yearRange.start - 10,
      end: yearRange.end - 10,
    });
  };

  const goToNextYearRange = () => {
    setYearRange({
      start: yearRange.start + 10,
      end: yearRange.end + 10,
    });
  };

  // Handle view changes
  const handleMonthHeaderClick = () => {
    if (view === "days") {
      setView("months");
    } else if (view === "months") {
      setView("years");
      // Set year range to include current year
      const currentYear = currentDate.getFullYear();
      const rangeStart = Math.floor(currentYear / 10) * 10;
      setYearRange({
        start: rangeStart,
        end: rangeStart + 9,
      });
    }
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setView("days");
  };

  // Handle year selection
  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView("months");
  };

  // Handle date selection
  const handleDateSelect = (day, monthOffset = 0) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    setSelectedDate(newDate);

    // Format date as YYYY-MM-DD for input value (timezone-safe)
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const dayFormatted = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dayFormatted}`;

    onChange && onChange({ target: { value: formattedDate } });
    setIsOpen(false);
  };

  // Check if date is selected
  const isDateSelected = (day, monthOffset = 0) => {
    if (!selectedDate) return false;
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );
    return (
      checkDate.getDate() === selectedDate.getDate() &&
      checkDate.getMonth() === selectedDate.getMonth() &&
      checkDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (day, monthOffset = 0) => {
    const today = new Date();
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  // Format display value
  const formatDisplayValue = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {required && <span className="text-red-500 mr-1">*</span>}
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => {
            if (!disabled) {
              setView("days"); // Reset to days view when opening
              setIsOpen(!isOpen);
            }
          }}
          className={`w-full px-4 py-2 border rounded-lg bg-white flex items-center justify-between transition-colors focus:border-[#2E90FA] ${
            disabled
              ? "bg-gray-50 cursor-not-allowed border-gray-200"
              : "cursor-pointer focus:border-[#2E90FA] hover:border-gray-400 "
          } ${
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E90FA] focus:border-[#2E90FA]"
          }`}
        >
          <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
            {selectedDate ? formatDisplayValue(selectedDate) : placeholder}
          </span>
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>

        {/* Calendar Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={
                  view === "days"
                    ? goToPrevMonth
                    : view === "months"
                    ? goToPrevYear
                    : goToPrevYearRange
                }
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <button
                type="button"
                onClick={handleMonthHeaderClick}
                className="font-medium text-gray-900 hover:text-[#2E90FA] transition-colors cursor-pointer"
              >
                {view === "days" &&
                  `${
                    months[currentDate.getMonth()]
                  } ${currentDate.getFullYear()}`}
                {view === "months" && currentDate.getFullYear()}
                {view === "years" && `${yearRange.start} - ${yearRange.end}`}
              </button>

              <button
                type="button"
                onClick={
                  view === "days"
                    ? goToNextMonth
                    : view === "months"
                    ? goToNextYear
                    : goToNextYearRange
                }
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Days View */}
            {view === "days" && (
              <>
                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Previous Month Days */}
                  {prevMonthDays.map((day) => (
                    <button
                      key={`prev-${day}`}
                      type="button"
                      onClick={() => handleDateSelect(day, -1)}
                      className="w-8 h-8 text-sm text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {day}
                    </button>
                  ))}

                  {/* Current Month Days */}
                  {currentMonthDays.map((day) => {
                    const selected = isDateSelected(day);
                    const today = isToday(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`w-8 h-8 text-sm rounded-md transition-colors ${
                          selected
                            ? "bg-[#2E90FA] text-white"
                            : today
                            ? "bg-blue-50 text-[#2E90FA] font-medium"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}

                  {/* Next Month Days */}
                  {nextMonthDays.map((day) => (
                    <button
                      key={`next-${day}`}
                      type="button"
                      onClick={() => handleDateSelect(day, 1)}
                      className="w-8 h-8 text-sm text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Months View */}
            {view === "months" && (
              <div className="grid grid-cols-3 gap-2">
                {monthsShort.map((month, index) => {
                  const isCurrentMonth =
                    index === currentDate.getMonth() &&
                    selectedDate &&
                    selectedDate.getFullYear() === currentDate.getFullYear();
                  const isSelectedMonth =
                    selectedDate &&
                    index === selectedDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear();

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthSelect(index)}
                      className={`px-4 py-3 text-sm rounded-md transition-colors ${
                        isSelectedMonth
                          ? "bg-[#2E90FA] text-white"
                          : isCurrentMonth
                          ? "bg-blue-50 text-[#2E90FA] font-medium"
                          : "text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years View */}
            {view === "years" && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const year = yearRange.start + i;
                  const isCurrentYear = year === new Date().getFullYear();
                  const isSelectedYear =
                    selectedDate && year === selectedDate.getFullYear();

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`px-4 py-3 text-sm rounded-md transition-colors ${
                        isSelectedYear
                          ? "bg-[#2E90FA] text-white"
                          : isCurrentYear
                          ? "bg-blue-50 text-[#2E90FA] font-medium"
                          : "text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {typeof error === "object" ? error.message : error}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
