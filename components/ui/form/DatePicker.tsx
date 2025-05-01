import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  id: string;
  label: string;
  selected: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  buttonIcon?: React.ReactNode;
}

export function DatePicker({
  id,
  label,
  selected,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error,
  buttonIcon,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={datePickerRef}>
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            type="text"
            className={`block w-full rounded-md p-3 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              error ? "border-red-300" : ""
            }`}
            value={format(selected, "yyyy-MM-dd")}
            onClick={() => !disabled && setIsOpen(true)}
            readOnly
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 rounded-r-md border-l border-gray-300"
            disabled={disabled}
          >
            {buttonIcon}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1">
          <ReactDatePicker
            selected={selected}
            onChange={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            inline
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
}
