import { z } from "zod";
import { Category } from "../enums";

export const productSchema = z.object({
  product_code: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  category: z.nativeEnum(Category, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  price: z.number().min(1, { message: "Price is required" }),
});

export const productFormSchema = productSchema.omit({ product_code: true });
