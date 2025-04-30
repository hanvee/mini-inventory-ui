import { useState, useEffect } from "react";
import { ICustomer } from "@/types/models";
import { Input, SelectInput, Button } from "@/components/ui/form";
import { Gender } from "@/types/enums/genderEnum";

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
  const [formData, setFormData] = useState<Partial<ICustomer>>({
    name: initialData?.name ?? "",
    city: initialData?.city ?? "",
    gender: initialData?.gender ?? "",
  });

  const genderOptions = Object.values(Gender).map((value) => ({
    value,
    label: value,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: initialData?.name ?? "",
      city: initialData?.city ?? "",
      gender: initialData?.gender ?? "",
    });
  }, [initialData?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.gender?.trim()) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Name"
        required={true}
        value={formData.name || ""}
        onChange={handleChange}
        error={errors.name}
        disabled={isSubmitting}
      />

      <Input
        id="city"
        name="city"
        label="City"
        required={true}
        value={formData.city || ""}
        onChange={handleChange}
        error={errors.city}
        disabled={isSubmitting}
      />

      <SelectInput
        id="gender"
        name="gender"
        label="Gender"
        required={true}
        value={formData.gender || ""}
        onChange={handleChange}
        options={genderOptions}
        error={errors.gender}
        disabled={isSubmitting}
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
