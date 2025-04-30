interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<TextInputProps> = ({
  label,
  id,
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
    <input
      id={id}
      {...rest}
      className={`mt-1 block w-full p-3 rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${className ?? ''}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
