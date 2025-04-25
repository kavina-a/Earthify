import moment from "moment";
import {
  useGetProductsBySellerQuery,
  useDeleteProductMutation,
} from "../../redux/api/productsApiSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ProductUpdate from "./ProductUpdate";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const AllProducts = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsBySellerQuery();
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
      refetch();
    }
  }, [isSuccess, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-earthTone-forestGreen animate-pulse text-xl font-medium">
        Loading your beautiful products...
      </div>
    );
  }

  if (isError) {
    console.error("Error loading products:", error);
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        Oops! Something went wrong while loading products.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg font-medium">
        No products found. Let’s add some! 🚀
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <div className="bg-earthTone-creamyWhite shadow-lg rounded-xl p-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
          {/* Left Section: Text */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-earthTone-oliveGreen tracking-tight flex items-center justify-center md:justify-start space-x-2">
              <span>Your Product Catalog</span>
              <span role="img" aria-label="box">
                📦
              </span>
            </h1>
            <p className="text-earthTone-sandstoneBeige mt-2 text-lg">
              Manage your products beautifully and efficiently ✨
            </p>
          </div>

          <div className="flex space-x-4">
            <div className="bg-earthTone-sandstoneBeige text-earthTone-oliveGreen rounded-lg p-4 shadow-md text-center w-32">
              <p className="text-sm font-bold">PRODUCTS</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-earthTone-creamyWhite rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-2xl flex flex-col justify-between"
          >
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-t-xl"
              />
              <span className="absolute top-2 right-2 bg-earthTone-sandstoneBeige text-earthTone-oliveGreen text-xs font-semibold px-3 py-1 rounded-full shadow">
                {moment(product.createdAt).format("MMM Do")}
              </span>
            </div>

            {/* Product Details */}
            <div className="p-5 flex-grow">
              <h3 className="text-lg font-semibold text-earthTone-oliveGreen mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-earthTone-sandstoneBeige text-sm mb-3">
                {product.description?.substring(0, 80)}
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 bg-earthTone-sandstoneBeige border-t border-earthTone flex justify-between items-center">
              <p className="text-lg font-bold text-earthTone-oliveGreen">
                $ {product.price}
              </p>
              <div className="flex space-x-2">
                {/* Update Button */}
                <button
                  onClick={() => openModal(product._id)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-earthTone-forestGreen rounded-lg hover:bg-earthTone-oliveGreen transition-colors duration-200 focus:ring-2 focus:ring-earthTone-forestGreen"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-earthTone-rustRed rounded-lg hover:bg-earthTone-charcoalGray transition-colors duration-200 focus:ring-2 focus:ring-earthTone-rustRed"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
