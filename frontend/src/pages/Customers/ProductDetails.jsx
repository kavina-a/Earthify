import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductByIdQuery } from "../../redux/api/productsApiSlice";
import { useFetchCategoryByIdQuery } from "../../redux/api/categoryApiSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { FaBox, FaClock, FaStar, FaShoppingCart } from "react-icons/fa";
import moment from "moment";
import { useGetProductsByCategoryQuery } from "../../redux/api/productsApiSlice";
import { motion } from "framer-motion";
import NavBar from "../Auth/Navigation";

const ProductDetails = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(params._id);
  const { data: categoryData } = useFetchCategoryByIdQuery(productData?.category);
  const { data: productsData } = useGetProductsByCategoryQuery({
    category: productData?.category,
    excludeProductId: productData?._id,
  });

  const addToCartHandler = () => {
    dispatch(addToCart({ ...productData, quantity }));
    toast.success("Item added to cart successfully!", { autoClose: 2000 });
  };

  if (isLoading) {
    return <div className="text-center text-lg font-bold">Loading...</div>;
  }

  if (isError) {
    toast.error(error?.message || "Error fetching product details");
    return <div className="text-center text-lg font-bold">Error Loading Product</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      {/* Hero Section */}
      <div className="p-10 bg-gradient-to-r from-mutedPalette-mutedBlue via-mutedPalette-sageGreen to-mutedPalette-mutedBlue text-center shadow-lg rounded-b-3xl relative">
        <h1 className="text-4xl font-extrabold text-mutedPalette-beige mb-4">
          Curated Finds, Crafted for You
        </h1>
        <p className="text-mutedPalette-beige text-lg max-w-xl mx-auto">
          Discover the perfect addition to your collection with our carefully selected products.
        </p>
        <div className="absolute top-0 left-0 w-32 h-32 bg-primaryGreen-light opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primaryBrown opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Back to Home */}
        <div className="mb-8">
          <Link to="/" className="text-mutedPalette-mutedBlue hover:underline font-medium">
            &#8592; Back to Home
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-8 border">
          {/* Image */}
          <div className="flex justify-center items-center bg-mutedPalette-mutedBlue rounded-xl p-6 shadow-md">
            <img
              src={productData?.image}
              alt={productData?.name}
              className="rounded-xl shadow-xl w-full object-cover max-h-[400px]"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-4xl font-extrabold text-mutedPalette-mutedBlue mb-4">
                {productData?.name}
              </h2>
              <p className="text-mutedPalette-mutedBlue text-lg leading-relaxed mb-6">
                {productData?.description}
              </p>

              {/* Product Metadata */}
              <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm mb-8">
                <div className="flex items-center space-x-2">
                  <FaClock />
                  <span>Added: {moment(productData?.createAt).fromNow()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-400" />
                  <span>{productData?.numReviews} Reviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBox />
                  <span>In Stock: {productData?.countInStock}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaShoppingCart />
                  <span>Shipping: Free & Fast</span>
                </div>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-primaryBrown mb-6">
                ${productData?.price.toFixed(2)}
              </p>

              {/* Quantity Selector */}
              {productData?.countInStock > 0 && (
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-mutedPalette-mutedBlue">
                    Select Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="p-2 w-24 border border-gray-300 rounded-lg focus:ring-mutedPalette-mutedBlue focus:border-mutedPalette-mutedBlue"
                  >
                    {[...Array(productData?.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={productData?.countInStock === 0}
              className={`py-3 px-6 rounded-lg font-bold transition duration-300 shadow ${
                productData?.countInStock > 0
                  ? "bg-mutedPalette-mutedBlue text-mutedPalette-beige hover:bg-opacity-90"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {productData?.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-4xl font-extrabold mb-4 text-mutedPalette-mutedBlue">
            Explore More in {categoryData?.name}
          </h2>
          <p className="text-mutedPalette-mutedBlue text-lg mb-10">
            Discover hand-selected items from the {categoryData?.name} collection.
          </p>

          {!productsData ? (
            <p className="text-center text-mutedPalette-mutedBlue text-lg">Loading related products...</p>
          ) : productsData.length === 0 ? (
            <p className="text-center text-mutedPalette-mutedBlue text-lg">
              No related products found. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsData.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl border"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-bold text-mutedPalette-mutedBlue">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {product.description.length > 60
                        ? `${product.description.substring(0, 60)}...`
                        : product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-primaryBrown">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
                        className="py-2 px-4 bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-lg hover:bg-opacity-90 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;