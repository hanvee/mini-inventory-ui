import { useState, useEffect } from "react";
import { IProduct } from "@/types/models";
import { Input, SelectInput, Button } from "@/components/ui/form";
import { Category } from "@/types/enums";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema } from "@/types/schemas";

interface ProductFormProps {
  initialData?: Partial<IProduct>;
  onSubmit: (data: Partial<IProduct>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ProductFormModal({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      product_code: initialData?.product_code || "",
      name: initialData?.name || "",
      category: initialData?.category || "",
      price: initialData?.price || 0,
    },
  });

  const categoryOptions = Object.values(Category).map((value) => ({
    value,
    label: value,
  }));

  useEffect(() => {
    if (initialData) {
      reset({
        product_code: initialData.product_code || "",
        name: initialData.name || "",
        category: initialData.category || "",
        price: initialData.price || 0,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: IProduct) => {        
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Name"
        required={true}
        disabled={isSubmitting}
        error={errors.name?.message}
        {...register("name")}
      />

      <SelectInput
        id="category"
        label="Category"
        required={true}
        disabled={isSubmitting}
        options={categoryOptions}
        error={errors.category?.message}
        {...register("category")}
      />

      <Input
        id="price"
        label="Price"
        required={true}
        type="number"
        disabled={isSubmitting}
        error={errors.price?.message}
        {...register("price",  { valueAsNumber: true })}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialData ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
