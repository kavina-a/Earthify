import { Link } from "react-router-dom";
import moment from "moment";
import { useGetProductsBySellerQuery, useDeleteProductMutation } from "../../redux/api/productsApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ProductUpdate from "./ProductUpdate";
import { useState } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError, error, refetch } = useGetProductsBySellerQuery();
  const [deleteProduct, { isSuccess }] = useDeleteProductMutation();

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    }
  };

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch(); // Triggers re-fetching of the products
    }
  }, [isSuccess, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-earthTone-forestGreen">
        Loading...
      </div>
    );
  }

  if (isError) {
    console.error("Error loading products:", error);
    return (
      <div className="flex justify-center items-center h-screen text-earthTone-rustRed">
        Error loading products
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-earthTone-oliveGreen">All Products</h1>
        <p className="text-earthTone-sandstoneBeige mt-2">Manage your products efficiently</p>
        <p className="mt-4 text-earthTone-forestGreen text-lg font-semibold">
          Total Products: {products.length}
        </p>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-earthTone-creamyWhite rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <img
              src={`http://localhost:5001${product.image}`}
              alt={product.name}
              className="h-48 w-full object-cover"
            />

            {/* Product Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-earthTone-oliveGreen">{product.name}</h3>
              <p className="text-earthTone-sandstoneBeige mt-1 text-sm">
                {product.description?.substring(0, 100)}...
              </p>
              <p className="text-earthTone-charcoalGray text-xs mt-2">
                Created: {moment(product.createdAt).format("MMMM Do YYYY")}
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 bg-earthTone-sandstoneBeige border-t border-earthTone flex justify-between items-center">
              <p className="text-lg font-bold text-earthTone-oliveGreen">$ {product.price}</p>
              <div className="flex space-x-2">
                {/* Update Button */}
                <button
                  onClick={() => openModal(product._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-earthTone-forestGreen rounded-lg hover:bg-earthTone-oliveGreen focus:ring-2 focus:ring-earthTone-forestGreen"
                >
                  Update
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-earthTone-rustRed rounded-lg hover:bg-earthTone-charcoalGray focus:ring-2 focus:ring-earthTone-rustRed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Update Modal */}
      {isModalOpen && (
        <ProductUpdate
          isOpen={isModalOpen}
          onClose={closeModal}
          productId={selectedProductId}
          refetchProducts={refetch}
        />
      )}
    </div>
  );
};

export default AllProducts;