/**
 * Converts a string from camelCase to SNAKE_CASE
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}

/**
 * Converts a string from SNAKE_CASE to camelCase
 */
export function snakeToCamel(str: string): string {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transforms object keys from camelCase to SNAKE_CASE recursively
 */
export function transformObjectKeysToCamel(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformObjectKeysToCamel(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = snakeToCamel(key);
    acc[camelKey] = transformObjectKeysToCamel(obj[key]);
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Transforms object keys from camelCase to SNAKE_CASE recursively
 */
export function transformObjectKeysToSnake(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformObjectKeysToSnake(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnake(key);
    acc[snakeKey] = transformObjectKeysToSnake(obj[key]);
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Formats a monetary value as Indonesian Rupiah
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a date string to a more readable format (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
