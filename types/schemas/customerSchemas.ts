import { z } from "zod";
import { Gender } from "../enums/genderEnum";

export const customerSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, { message: "Name is required" }),
  city: z.string().min(1, { message: "City is required" }),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
});

export const customerFormSchema = customerSchema.omit({ id: true });
