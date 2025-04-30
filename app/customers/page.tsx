"use client";

import { useState } from "react";
import Table from "@/components/common/Table";
import Modal from "@/components/common/Modal";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import { useCustomers } from "@/hooks/useCustomers";
import { ICustomer } from "@/types/models";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/form/Button";

export default function CustomerPage() {
  const {
    customers,
    loading,
    error,
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    isSubmitting,
    operationError,
    selectedCustomer,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    resetForm,
    setSelectedCustomer,
  } = useCustomers();

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<ICustomer | null>(
    null
  );

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex space-x-2">
          '
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditClick(info.row.original.id)}
          >
            Edit
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
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEditClick = async (id: number | string) => {
    await getCustomerById(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (customer: ICustomer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (data: Partial<ICustomer>) => {
    const success = await createCustomer(data as Omit<ICustomer, "id">);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleEditSubmit = async (data: Partial<ICustomer>) => {
    if (selectedCustomer?.id) {
      const success = await updateCustomer(selectedCustomer.id, data);
      if (success) {
        setIsEditModalOpen(false);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (customerToDelete?.id) {
      const success = await deleteCustomer(customerToDelete.id);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button variant="primary" onClick={handleCreateClick}>
          Add Customer
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      {loading && customers.length === 0 ? (
        <div className="flex justify-center py-10">Loading Customers...</div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {customers.length} of {totalItems} customers
            </p>
          </div>
          <Table
            data={customers}
            columns={columns}
            searchPlaceholder="Search customers..."
            onSearch={handleSearch}
          />
        </>
      )}

      {/* Create Customer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Customer"
      >
        {operationError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {operationError}
          </div>
        )}
        <CustomerFormModal
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer"
      >
        {operationError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {operationError}
          </div>
        )}
        <CustomerFormModal
          initialData={selectedCustomer || {}}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="mb-6">
          Are you sure you want to delete customer "{customerToDelete?.name}"?
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
            children="Cancel"
          ></Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isSubmitting}
            onClick={handleDeleteConfirm}
            children="Delete"
          ></Button>
        </div>
      </Modal>
    </div>
  );
}
