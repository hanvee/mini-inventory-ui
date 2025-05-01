"use client";

import { useState } from "react";
import Table from "@/components/common/Table";
import Modal from "@/components/common/Modal";
import SaleFormModal from "@/components/sales/SaleFormModal";
import { ISale } from "@/types/models";
import { AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/form/Button";
import { useSales, useCustomers } from "@/hooks";
import { format } from "date-fns";

export default function SalePage() {
  const {
    sales,
    loading,
    error,
    totalItems,
    isSubmitting,
    operationError,
    createSale,
    deleteSale,
    refreshData,
    handleSearch,
  } = useSales();

  const { customers } = useCustomers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saleToView, setSaleToView] = useState<ISale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<ISale | null>(null);

  // Helper function to get customer name by ID
  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : `Customer #${customerId}`;
  };

  const columns = [
    {
      accessorKey: "invoice_id",
      header: "Invoice Number",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => {
        try {
          return format(new Date(info.getValue()), "MMM dd, yyyy");
        } catch (error) {
          return info.getValue();
        }
      },
    },
    {
      accessorKey: "customer_id",
      header: "Customer",
      cell: (info) => getCustomerName(info.getValue()),
    },
    {
      accessorKey: "subtotal",
      header: "Amount",
      cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
    },
    {
      accessorKey: "sale_items",
      header: "Items",
      cell: (info) => {
        const items = info.getValue() || [];
        return items.length > 0 ? `${items.length} item(s)` : "0 items";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewClick(info.row.original)}
          >
            View
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(info.row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewClick = (sale: ISale) => {
    setSaleToView(sale);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (sale: ISale) => {
    setSaleToDelete(sale);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (data: Omit<ISale, "invoice_id">) => {
    const success = await createSale(data);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (saleToDelete?.invoice_id) {
      await deleteSale(saleToDelete.invoice_id);
      setIsDeleteModalOpen(false);
      setSaleToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button variant="primary" onClick={handleCreateClick}>
          Create New Sale
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      {loading && sales.length === 0 ? (
        <div className="flex justify-center py-10">Loading Sales...</div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {sales.length} of {totalItems} sales
            </p>
          </div>
          <Table
            data={sales}
            columns={columns}
            searchPlaceholder="Search sales..."
            onSearch={handleSearch}
          />
        </>
      )}

      {/* Create Sale Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Sale"
        size="lg"
      >
        {operationError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {operationError}
          </div>
        )}
        <SaleFormModal
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* View Sale Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Sale Details"
        size="md"
      >
        {saleToView && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <p className="font-medium">{saleToView.invoice_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(new Date(saleToView.date), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">
                  {getCustomerName(saleToView.customer_id)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-lg">
                  ${Number(saleToView.subtotal).toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Code
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(saleToView.sale_items || []).map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.product_code}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="mb-6">
          Are you sure you want to delete invoice "{saleToDelete?.invoice_id}"?
          This action cannot be undone.
        </div>
        {operationError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {operationError}
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            size="sm"
            isLoading={isSubmitting}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isSubmitting}
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
