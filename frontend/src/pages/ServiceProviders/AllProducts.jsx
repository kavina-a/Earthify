import { Link } from "react-router-dom";
import moment from "moment";
import { useGetProductsBySellerQuery, useDeleteProductMutation } from "../../redux/api/productsApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError, error, refetch } = useGetProductsBySellerQuery();
  const [deleteProduct, { isSuccess }] = useDeleteProductMutation();

  // Handle delete logic
  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch(); // Triggers re-fetching of the products
    }
  }, [isSuccess, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error loading products:", error); // Log the error message
    return <div>Error loading products</div>;
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error loading products:", error); // Log the error message
    return <div>Error loading products</div>;
  }

  return (
    <div className="container mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-bold h-12">
            All Products ({products.length})
          </div>
          <div className="flex flex-wrap justify-around items-center">
            {products.map((product) => (
              <div className="flex border rounded-lg shadow-lg p-4 m-2" key={product._id}>
                <img
                  src={`http://localhost:5001${product.image}`} // Prepend the base URL to the relative path stored in DB
                  alt={product.name}
                  className="w-[10rem] object-cover"
                />
                <div className="p-4 flex flex-col justify-around">
                  <div className="flex justify-between">
                    <h5 className="text-xl font-semibold mb-2">{product?.name}</h5>
                    <p className="text-gray-400 text-xs">
                      {moment(product.createdAt).format("MMMM Do YYYY")}
                    </p>
                  </div>
                  <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">
                    {product?.description?.substring(0, 160)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/service-provider/product/update/${product._id}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                    >
                      Update Product
                    </Link>
                    <p className="text-lg font-bold">$ {product?.price}</p>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/4 p-3 mt-2"></div>
      </div>
    </div>
  );
};

export default AllProducts;