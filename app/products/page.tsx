"use client";

import { useState } from "react";
import Table from "@/components/common/Table";
import Modal from "@/components/common/Modal";
import ProductFormModal from "@/components/products/ProductFormModal";
import { IProduct } from "@/types/models";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/form/Button";
import { useProducts } from "@/hooks";

export default function ProductPage() {
  const {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    isSubmitting,
    operationError,
    selectedProduct,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    resetForm,
  } = useProducts();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: "product_code",
      header: "Product Code",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "color",
      header: "Color",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditClick(info.row.original.product_code)}
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
    await getProductById(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (data: Partial<IProduct>) => {
    const success = await createProduct(data as Omit<IProduct, "product_code">);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleEditSubmit = async (data: Partial<IProduct>) => {
    console.log(data);

    if (selectedProduct?.product_code) {
      const success = await updateProduct(selectedProduct.product_code, data);
      if (success) {
        setIsEditModalOpen(false);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete?.product_code) {
      const success = await deleteProduct(productToDelete.product_code);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button variant="primary" onClick={handleCreateClick}>
          Add Product
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="flex justify-center py-10">Loading Products...</div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {products.length} of {totalItems} products
            </p>
          </div>
          <Table
            data={products}
            columns={columns}
            searchPlaceholder="Search products..."
            onSearch={handleSearch}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Product"
      >
        {operationError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {operationError}
          </div>
        )}
        <ProductFormModal
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
        <ProductFormModal
          initialData={selectedProduct || {}}
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
          Are you sure you want to delete customer "{productToDelete?.name}"?
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
