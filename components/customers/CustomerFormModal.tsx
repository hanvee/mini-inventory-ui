import { useState, useEffect } from "react";
import { ICustomer } from "@/types/models";
import { Input, SelectInput, Button } from "@/components/ui/form";
import { Gender } from "@/types/enums/genderEnum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema } from "@/types/schemas";

interface CustomerFormProps {
  initialData?: Partial<ICustomer>;
  onSubmit: (data: Partial<ICustomer>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CustomerFormModal({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICustomer>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      gender: initialData?.gender || "",
    },
  });

  const genderOptions = Object.values(Gender).map((value) => ({
    value,
    label: value,
  }));

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData?.name || "",
        city: initialData?.city || "",
        gender: initialData?.gender || "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ICustomer) => {
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

      <Input
        id="city"
        label="City"
        required={true}
        disabled={isSubmitting}
        error={errors.city?.message}
        {...register("city")}
      />

      <SelectInput
        id="gender"
        label="Gender"
        required={true}
        disabled={isSubmitting}
        options={genderOptions}
        error={errors.gender?.message}
        {...register("gender")}
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData?.id
            ? "Update Customer"
            : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
