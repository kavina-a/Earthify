import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../../redux/features/cart/cartSlice";
import { motion } from "framer-motion";
import NavBar from "../Auth/Navigation";
import { useState } from "react";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (product, quantity) => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/customer/shipping");
  };

  const slides = [
    { url: "/images/home1.png", title: "Beautiful Nature" },
    { url: "/images/home2.png", title: "Majestic Mountains" },
    { url: "/images/home3.png", title: "Serene Waterfalls" },
    { url: "/images/home4.png", title: "Lush Forest" },
    { url: "/images/home1.png", title: "Beautiful Nature" },
    { url: "/images/home2.png", title: "Majestic Mountains" },

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="bg-gradient-to-b from-white to-green-50 min-h-screen">
      {/* Navbar */}
      <NavBar />

      {/* Posters Section */}
      <div className="overflow-x-auto scrollbar-hide py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex gap-4 px-6"
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-80">
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-60 object-cover rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Cart Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-10"
      >
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <h2 className="text-3xl font-bold text-primaryGreen mb-4">
              Your cart is empty 🛒
            </h2>
            <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>
            <Link
              to="/shop"
              className="bg-primaryGreen-light text-white px-6 py-3 rounded-full shadow hover:bg-primaryGreen transition-all"
            >
              Go To Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Left: Cart Items */}
            <div className="flex flex-col w-full md:w-2/3 space-y-6">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-4xl font-bold text-mutedPalette-mutedBlue mb-6"
              >
                Shopping Cart
              </motion.h1>

              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="w-24 h-24">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg shadow"
                    />
                  </div>

                  <div className="flex-1 ml-6 mt-4 md:mt-0">
                    <Link
                      to={`/customer/product/${item._id}`}
                      className="text-xl font-bold text-mutedPalette-mutedBlue hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 text-sm text-gray-500 capitalize">
                      {item.category}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-black">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button
                      className="bg-mutedPalette-mutedBlue text-white px-3 py-1 rounded-full hover:bg-primaryGreen transition"
                      onClick={() =>
                        item.quantity > 1 &&
                        addToCartHandler(item, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="text-lg font-bold text-primaryBrown">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-mutedPalette-mutedBlue text-white px-3 py-1 rounded-full hover:bg-primaryGreen transition"
                      onClick={() =>
                        item.quantity < item.countInStock &&
                        addToCartHandler(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Item */}
                  <button
                    className="text-red-500 ml-6 hover:text-red-700 transition duration-200"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Right: Summary */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/3 bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all space-y-6"
            >
              <h2 className="text-2xl font-bold text-mutedPalette-mutedBlue border-b pb-4">
                Order Summary
              </h2>

              <div className="text-lg flex justify-between">
                <span>Items</span>
                <span className="font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>

              <div className="text-lg flex justify-between">
                <span>Total</span>
                <span className="font-bold text-primaryBrown-dark">
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                🎁 Free delivery on orders over $50!
              </div>

              <button
                className="bg-mutedPalette-mutedBlue text-white py-3 px-6 w-full rounded-xl shadow-md hover:bg-primaryGreen transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;