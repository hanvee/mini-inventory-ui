interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  id,
  options,
  error,
  className,
  required,
  ...rest
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-600">*</span>}
    </label>
    <select
      id={id}
      {...rest}
      className={`mt-1 block w-full rounded-md border p-3 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
        error ? "border-red-300" : "border-gray-300"
      } ${className ?? ""}`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);