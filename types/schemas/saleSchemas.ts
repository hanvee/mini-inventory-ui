import { z } from "zod";

export const saleItemSchema = z.object({
  product_code: z.string().min(1, { message: "Product is required" }),
  qty: z.number().min(1, { message: "Quantity must be at least 1" }),
});

export const saleSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  customer_id: z.number().min(1, { message: "Customer is required" }),
  subtotal: z.number().min(0, { message: "Subtotal must be at least 0" }),
  items: z
    .array(saleItemSchema)
    .min(1, { message: "At least one item is required" }),
});

export const saleFormSchema = saleSchema;
