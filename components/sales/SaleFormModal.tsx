import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ISale, ISaleItem, IProduct, ICustomer } from "@/types/models";
import { Input, SelectInput, Button } from "@/components/ui/form";
import { saleFormSchema } from "@/types/schemas";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/form/DatePicker";
import { useProducts, useCustomers } from "@/hooks";

interface SaleFormProps {
  onSubmit: (data: Omit<ISale, "invoice_id">) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function SaleFormModal({
  onSubmit,
  onCancel,
  isSubmitting,
}: SaleFormProps) {
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [calculatedSubtotal, setCalculatedSubtotal] = useState(0);

  const { products, loading: loadingProducts } = useProducts();
  const { customers, loading: loadingCustomers } = useCustomers();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ISale>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      customer_id: 0,
      subtotal: 0,
      items: [{ product_code: "", qty: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchCustomerId = watch("customer_id");
  const formItems = watch("items");

  const productOptions = products.map((product) => ({
    value: product.product_code ?? 0,
    label: product.name,
  }));

  const customerOptions = customers.map((customer) => ({
    value: customer.id ?? 0,
    label: customer.name,
  }));

  const calculateSubtotal = () => {
    const items = getValues("items");

    if (items && items.length > 0 && products.length > 0) {
      let total = 0;

      items.forEach((item) => {
        if (item.product_code && item.qty) {
          const product = products.find(
            (p) => p.product_code === item.product_code
          );
          if (product) {
            total += product.price * item.qty;
          }
        }
      });

      setCalculatedSubtotal(total);
      setValue("subtotal", total);
    } else {
      setCalculatedSubtotal(0);
      setValue("subtotal", 0);
    }
  };

  useEffect(() => {
    setValue("date", format(saleDate, "yyyy-MM-dd"));
  }, [saleDate, setValue]);

  useEffect(() => {
    if (watchCustomerId) {
      setSelectedCustomer(Number(watchCustomerId));
    }
  }, [watchCustomerId]);

  useEffect(() => {
    calculateSubtotal();
  }, [formItems]);

  const handleAddItem = () => {
    append({ product_code: "", qty: 1 });
  };

  const handleFormSubmit = async (data: ISale) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleProductChange = (index: number, value: string) => {
    setValue(`items.${index}.product_code`, value);
    calculateSubtotal();
  };

  const handleQuantityChange = (index: number, value: number) => {
    setValue(`items.${index}.qty`, value);
    calculateSubtotal();
  };

  if (loadingProducts || loadingCustomers) {
    return <div>Loading data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DatePicker
            id="date"
            label="Sale Date"
            selected={saleDate}
            onChange={(date) => date && setSaleDate(date)}
            disabled={isSubmitting}
            buttonIcon={<CalendarIcon className="h-4 w-4" />}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <SelectInput
          id="customer_id"
          label="Customer"
          required={true}
          disabled={isSubmitting}
          options={customerOptions}
          error={errors.customer_id?.message}
          {...register("customer_id", { valueAsNumber: true })}
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Sale Items</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddItem}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
          </Button>
        </div>

        {errors.items && !Array.isArray(errors.items) && (
          <p className="text-red-500 text-sm mb-2">{errors.items.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row items-start md:items-end gap-2 p-3 bg-gray-50 rounded-md"
            >
              <div className="flex-grow w-full md:w-auto">
                <Controller
                  control={control}
                  name={`items.${index}.product_code`}
                  render={({ field }) => (
                    <SelectInput
                      id={`items.${index}.product_code`}
                      label="Product"
                      required={true}
                      disabled={isSubmitting}
                      options={productOptions}
                      error={
                        errors.items &&
                        errors.items[index]?.product_code?.message
                      }
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        handleProductChange(index, e.target.value);
                      }}
                    />
                  )}
                />
              </div>

              <div className="w-full md:w-32">
                <Controller
                  control={control}
                  name={`items.${index}.qty`}
                  render={({ field }) => (
                    <Input
                      id={`items.${index}.qty`}
                      label="Quantity"
                      required={true}
                      type="number"
                      min={1}
                      disabled={isSubmitting}
                      error={errors.items && errors.items[index]?.qty?.message}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        handleQuantityChange(
                          index,
                          parseInt(e.target.value, 10) || 0
                        );
                      }}
                    />
                  )}
                />
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="mt-4 md:mt-0"
                  onClick={() => {
                    remove(index);
                    setTimeout(calculateSubtotal, 0);
                  }}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="text-right mb-4">
          <div className="text-gray-600">Subtotal:</div>
          <div className="text-xl font-bold">
            ${calculatedSubtotal.toFixed(2)}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Sale
          </Button>
        </div>
      </div>
    </form>
  );
}
