interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  className?: string;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  size = "md",
  isLoading = false,
  ...rest
}) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "p-12",
  };

  const base = `px-4 ${sizeClasses[size]} rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`;
  const variants = {
    primary:
      "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    danger: 
      "text-white bg-red-500 hover:bg-red-700 focus:ring-red-500",
    warning:
      "text-white bg-orange-400 hover:bg-orange-700 focus:ring-orange-500",
    success:  
      "text-white bg-green-400 hover:bg-success-700 focus:ring-success-500",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
