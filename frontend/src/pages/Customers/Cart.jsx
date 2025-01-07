import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../../redux/features/cart/cartSlice';
import { motion } from 'framer-motion';
import NavBar from '../Auth/Navigation';
import { useState } from 'react';

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
    navigate('/customer/shipping');
  };

  const slides = [
    { url: "/images/home1.png", title: "Beautiful Nature" },
    { url: "/images/home2.png", title: "Majestic Mountains" },
    { url: "/images/home3.png", title: "Serene Waterfalls" },
    { url: "/images/home4.png", title: "Lush Forest" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="">
      {/* Navbar */}
      <NavBar />

      <div className="p-6 bg-mutedPalette-mutedBlue text-center ml-[40%] lg:ml-[4%]">
        <h1 className="text-4xl font-bold text-white"></h1>

        <p className="text-lg mt-4 text-white"></p>

        <p className="mt-2 text-white">
          Turn your points into big savings on sustainable products. Start shopping today and make an impact!
        </p>
      </div>

      {/* Posters Section */}
      <div className="overflow-x-auto scrollbar-hide">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex gap-1"
        >
          {/* Poster 1 */}
          <div className="flex-shrink-0 w-80">
            <img
              src="/images/cart-poster1.png"
              alt="Poster 1"
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Poster 2 */}
          <div className="flex-shrink-0 w-80">
            <img
              src="/images/cart-poster3.png"
              alt="Poster 2"
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Poster 3 */}
          <div className="flex-shrink-0 w-80">
            <img
              src="/images/cart-poster2.png"
              alt="Poster 3"
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Poster 4 */}
          <div className="flex-shrink-0 w-80">
            <img
              src="/images/cart-poster1.png"
              alt="Poster 4"
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Poster 5 */}
          <div className="flex-shrink-0 w-80">
            <img
              src="/images/cart-poster3.png"
              alt="Poster 5"
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>
          {/* Poster 6 */}
          <div className="flex-shrink-0 w-80">
            <img
              src="/images/cart-poster2.png"
              alt="Poster 6"
              className="w-full h-70 object-cover rounded-lg shadow-lg"
            />
          </div>
        </motion.div>
      </div>

      {/* Cart Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col md:flex-row justify-between items-start gap-8 ml-[40%] lg:ml-[8%] mt-[6%]"
      >
        {cartItems.length === 0 ? (
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-primaryGreen">
              Your cart is empty.
            </h2>
            <Link
              to="/shop"
              className="text-primaryGreen-light hover:underline mt-4 inline-block"
            >
              Go To Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Shopping Cart Section on the Left */}
            <div className="flex flex-col w-full md:w-2/3 mx-auto">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-3xl font-bold mb-6 text-mutedPalette-mutedBlue"
              >
                Shopping Cart
              </motion.h1>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center mb-6 p-4 w-[95%] bg-mutedPalette-beige rounded-lg shadow-lg"
                  >
                  <div className="w-20 h-20">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 ml-6">
                    <Link
                      to={`/customer/product/${item._id}`}
                      className="text-lg font-bold text-mutedPalette-mutedBlue hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 text-sm text-mutedPalette-sageGreen">
                      {item.category}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-black">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Picker */}
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-mutedPalette-mutedBlue text-white px-2 py-1 rounded-full hover:bg-primaryGreen"
                      onClick={() =>
                        item.quantity > 1 &&
                        addToCartHandler(item, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-primaryBrown">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-mutedPalette-mutedBlue text-white px-2 py-1 rounded-full hover:bg-primaryGreen"
                      onClick={() =>
                        item.quantity < item.countInStock &&
                        addToCartHandler(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-red-500 ml-6 hover:text-red-700 transition duration-200"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary Section on the Right */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/3 bg-mutedPalette-beige p-6 rounded-lg shadow-lg mr-[4%] mt-[10%]"
            >
              
              <h2 className="text-2xl font-bold mb-4 text-mutedPalette-mutedBlue border-b pb-4">
                Summary
              </h2>
              <div className="text-lg mb-4 flex justify-between items-center">
                <span>Items:</span>
                <span className="font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <div className="text-lg mb-4 flex justify-between items-center">
                <span>Total:</span>
                <span className="font-bold text-primaryBrown-dark">
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <button
                className="bg-mutedPalette-mutedBlue text-white py-3 px-6 mt-6 rounded-md shadow-lg w-full text-lg hover:bg-primaryGreen transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
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