import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductByIdQuery,
} from "../../redux/api/productsApiSlice";
import {
  useFetchCategoryByIdQuery,
} from "../../redux/api/categoryApiSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { FaBox, FaClock, FaStar, FaShoppingCart } from "react-icons/fa";
import moment from "moment";
import { useGetProductsByCategoryQuery } from "../../redux/api/productsApiSlice";
import ProductCard from "./ProductCard";
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
  const { data: productsData, error: retrieveerror } = useGetProductsByCategoryQuery({
    category: productData?.category,
    excludeProductId: productData?._id,
  });

  console.log(productsData);  

  const addToCartHandler = () => {
    dispatch(addToCart({ ...productData, quantity }));
    toast.success("Item added to cart successfully!", {
      autoClose: 2000,
    });
  };

  if (isLoading) {
    return <div className="text-center text-lg font-bold">Loading...</div>;
  }

  if (isError) {
    toast.error(error?.message || "Error fetching product details");
    return <div className="text-center text-lg font-bold">Error Loading Product</div>;
  }

  return (
    <div className="">
      <NavBar />

      <div className="p-6 bg-mutedPalette-mutedBlue text-center w-screen shadow-lg ">
      <h1 className="text-4xl font-bold text-mutedPalette-beige animate-bounce">
        Find What You Love, Love What You Find ❤️
      </h1>
    </div>

    <div className="container mx-auto px-4 mt-10">
      <div className="mb-8">
        <Link
          to="/"
          className="text-mutedPalette-mutedBlue hover:underline font-medium"
        >
          &#8592; Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Product Image */}
        <div className="flex justify-center items-center">
          <img
            src={productData?.image}
            alt={productData?.name}
            className="rounded-lg shadow-lg max-w-full md:max-w-[30rem] object-cover"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4 text-mutedPalette-mutedBlue">{productData?.name}</h1>
          <p className="text-mutedPalette-mutedBlue text-lg mb-4">{productData?.description}</p>
          <p className="text-4xl font-extrabold mb-6 text-mutedPalette-mutedBlue">${productData?.price}</p>

          {/* Product Metadata */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center text-mutedPalette-mutedBlue">
              <FaClock className="mr-2" />
              <span>
                Added:{" "}
                <span className="font-medium">
                  {moment(productData?.createAt).fromNow()}
                </span>
              </span>
            </div>
            <div className="flex items-center text-mutedPalette-mutedBlue">
              <FaStar className="mr-2 text-yellow-500" />
              <span>
                Reviews:{" "}
                <span className="font-medium">{productData?.numReviews}</span>
              </span>
            </div>
            <div className="flex items-center text-mutedPalette-mutedBlue">
              <FaBox className="mr-2" />
              <span>
                In Stock:{" "}
                <span className="font-medium">{productData?.countInStock}</span>
              </span>
            </div>
            {/* <div className="flex items-center text-mutedPalette-mutedBlue">
              <FaShoppingCart className="mr-2" />
              <span>
                Quantity:{" "}
                <span className="font-medium">{productData?.countInStock}</span>
              </span>
            </div> */}
          </div>

          {/* Select Quantity */}
          {productData?.countInStock > 0 && (
            <div className="mb-6">
              <label className="block mb-2 font-medium text-mutedPalette-mutedBlue">Select Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="p-2 w-24 border border-gray-300 rounded-md focus:ring-mutedPalette-mutedBlue focus:border-mutedPalette-mutedBlue"
              >
                {[...Array(productData?.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={addToCartHandler}
            disabled={productData?.countInStock === 0}
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ${
              productData?.countInStock > 0
                ? "bg-mutedPalette-mutedBlue text-mutedPalette-beige hover:bg-opacity-90"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {productData?.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-mutedPalette-mutedBlue">
          Explore More in <span className="text-mutedPalette-mutedBlue">{categoryData?.name}</span>
        </h2>
        <p className="text-mutedPalette-mutedBlue text-lg mb-8">
          Discover more products in the <span className="font-semibold">{categoryData?.name}</span> category to enhance your shopping experience.
        </p>

        {!productsData ? (
          <p className="text-center text-mutedPalette-mutedBlue text-lg">Loading related products...</p>
        ) : productsData.length === 0 ? (
          <p className="text-center text-mutedPalette-mutedBlue text-lg">
            No related products found. Check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsData.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="shadow-lg rounded-lg bg-mutedPalette-mutedBlue overflow-hidden transition duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-mutedPalette-beige">
                    {product.name}
                  </h3>
                  <p className="text-mutedPalette-beige text-sm mb-4">
                    {product.description.length > 60
                      ? `${product.description.substring(0, 60)}...`
                      : product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-mutedPalette-beige">
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

// import { useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   useGetProductByIdQuery,
// } from "../../redux/api/productsApiSlice";
// import {
//   useFetchCategoryByIdQuery,
// } from "../../redux/api/categoryApiSlice";
// import { addToCart } from "../../redux/features/cart/cartSlice";
// import { FaBox, FaClock, FaDollarSign, FaStar, FaShoppingCart } from "react-icons/fa";
// import moment from "moment";
// import { useGetProductsByCategoryQuery } from "../../redux/api/productsApiSlice";
// import ProductCard from "./ProductCard";
// import { motion } from "framer-motion";


// const ProductDetails = () => {
//   const { userInfo } = useSelector((state) => state.auth);

//   const params = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [quantity, setQuantity] = useState(1);
//   const { data: productData, isLoading, isError, error } = useGetProductByIdQuery(params._id);
//   const { data: categoryData } = useFetchCategoryByIdQuery(productData?.category);
//   const { data: productsData, error: retrieveerror } = useGetProductsByCategoryQuery({
//     category: productData?.category,
//     excludeProductId: productData?._id,
// });

// console.log(productsData);  

//   const addToCartHandler = () => {
//     dispatch(addToCart({ ...productData, quantity }));
//     toast.success("Item added to cart successfully!", {
//       autoClose: 2000,
//     });
//   };

//   if (isLoading) {
//     return <div className="text-center text-lg font-bold">Loading...</div>;
//   }

//   if (isError) {
//     toast.error(error?.message || "Error fetching product details");
//     return <div className="text-center text-lg font-bold">Error Loading Product</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 mt-10">
//       <div className="mb-8">
//         <Link
//           to="/"
//           className="text-gray-700 hover:text-pink-600 hover:underline font-medium"
//         >
//           &#8592; Back to Home
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {/* Left: Product Image */}
//         <div className="flex justify-center items-center">
//           <img
//             src={productData?.image}
//             alt={productData?.name}
//             className="rounded-lg shadow-lg max-w-full md:max-w-[30rem] object-cover"
//           />
//         </div>

//         {/* Right: Product Details */}
//         <div className="flex flex-col">
//           <h1 className="text-3xl font-bold mb-4">{productData?.name}</h1>
//           <p className="text-gray-600 text-lg mb-4">{productData?.description}</p>
//           <p className="text-4xl font-extrabold text-pink-600 mb-6">${productData?.price}</p>

//           {/* Product Metadata */}
//           <div className="grid grid-cols-2 gap-4 mb-8">
//             <div className="flex items-center">
//               <FaClock className="mr-2 text-gray-500" />
//               <span>
//                 Added:{" "}
//                 <span className="font-medium">
//                   {moment(productData?.createAt).fromNow()}
//                 </span>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <FaStar className="mr-2 text-yellow-500" />
//               <span>
//                 Reviews:{" "}
//                 <span className="font-medium">{productData?.numReviews}</span>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <FaBox className="mr-2 text-gray-500" />
//               <span>
//                 In Stock:{" "}
//                 <span className="font-medium">{productData?.countInStock}</span>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <FaShoppingCart className="mr-2 text-gray-500" />
//               <span>
//                 Quantity:{" "}
//                 <span className="font-medium">{productData?.quantity}</span>
//               </span>
//             </div>
//           </div>

//           {/* Select Quantity */}
//           {productData?.countInStock > 0 && (
//             <div className="mb-6">
//               <label className="block mb-2 font-medium">Select Quantity</label>
//               <select
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 className="p-2 w-24 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
//               >
//                 {[...Array(productData?.countInStock).keys()].map((x) => (
//                   <option key={x + 1} value={x + 1}>
//                     {x + 1}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Add to Cart Button */}
//           <button
//             onClick={addToCartHandler}
//             disabled={productData?.countInStock === 0}
//             className={`py-3 px-6 rounded-lg font-bold transition duration-300 ${
//               productData?.countInStock > 0
//                 ? "bg-pink-600 text-white hover:bg-pink-700"
//                 : "bg-gray-400 text-white cursor-not-allowed"
//             }`}
//           >
//             {productData?.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
//           </button>
//         </div>
//       </div>

//       <div className="mt-12">
//   <h2 className="text-3xl font-bold mb-6 text-gray-800">
//     Explore More in <span className="text-pink-600">{categoryData?.name}</span>
//   </h2>
//   <p className="text-gray-600 text-lg mb-8">
//     Discover more products in the <span className="font-semibold">{categoryData?.name}</span> category to enhance your shopping experience.
//   </p>

//   {!productsData ? (
//     <p className="text-center text-gray-500 text-lg">Loading related products...</p>
//   ) : productsData.length === 0 ? (
//     <p className="text-center text-gray-500 text-lg">
//       No related products found. Check back later!
//     </p>
//   ) : (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//       {productsData.map((product) => (
//         <motion.div
//           key={product._id}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="shadow-lg rounded-lg bg-white overflow-hidden transition duration-300 transform hover:-translate-y-1"
//         >
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-48 object-cover"
//           />
//           <div className="p-4">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">
//               {product.name}
//             </h3>
//             <p className="text-gray-500 text-sm mb-4">
//               {product.description.length > 60
//                 ? `${product.description.substring(0, 60)}...`
//                 : product.description}
//             </p>
//             <div className="flex justify-between items-center">
//               <p className="text-lg font-bold text-pink-600">
//                 ${product.price.toFixed(2)}
//               </p>
//               <button
//             onClick={addToCartHandler}
//             disabled={productData?.countInStock === 0}
//             className={`py-3 px-6 rounded-lg font-bold transition duration-300 ${
//               productData?.countInStock > 0
//                 ? "bg-pink-600 text-white hover:bg-pink-700"
//                 : "bg-gray-400 text-white cursor-not-allowed"
//             }`}
//           >
//             {productData?.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
//           </button>
//             </div>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   )}
// </div>
//     </div>
//   );
// }

// export default ProductDetails;
