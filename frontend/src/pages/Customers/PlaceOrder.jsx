// Full "Big Boss" Visual + Functional Upgrade
// Keeping your logic, adding elegance 🎨

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useCreateCheckoutSessionMutation } from "../../redux/api/stripeApiSlice";
import { useEcoPointsQuery } from "../../redux/api/usersApiSlice";
import Navigation from "../Auth/Navigation";
import { MdEco } from "react-icons/md";
import { useGetShippingAddressQuery } from "../../redux/api/orderApiSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [createOrder] = useCreateOrderMutation();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const {
    data: ecoPointsData,
    isLoading: ecoPointsLoading,
    error: ecoPointsError,
  } = useEcoPointsQuery();

  const { data: shippingAddressData } = useGetShippingAddressQuery();

  const [ecoPoints, setEcoPoints] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalPrice, setFinalPrice] = useState(cart.totalPrice);
  const [ecoPointsApplied, setEcoPointsApplied] = useState(false);

  useEffect(() => {
    if (ecoPointsData?.ecoPoints) {
      setEcoPoints(ecoPointsData.ecoPoints);
    }
  }, [ecoPointsData]);

  const toggleEcoPoints = () => {
    if (ecoPointsApplied) {
      setFinalPrice(cart.totalPrice);
      setEcoPointsApplied(false);
      setDiscountApplied(false);
      toast.info("Eco Points discount removed.");
    } else {
      if (ecoPoints > 0) {
        const discountedPrice = Math.max(finalPrice - ecoPoints, 0);
        setFinalPrice(discountedPrice);
        setEcoPointsApplied(true);
        setDiscountApplied(true);
        toast.success("Eco Points applied successfully!");
      } else {
        toast.error("No Eco Points available to apply.");
      }
    }
  };

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        finalPrice,
      }).unwrap();

      if (discountApplied && res._id) {
        localStorage.setItem("ecoPoints", "0");
        setEcoPoints(0);
      }

      const { url } = await createCheckoutSession({
        orderId: res._id,
        cartItems: cart.cartItems,
      }).unwrap();

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Stripe checkout URL is missing.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while placing the order."
      );
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-white via-blue-50 to-yellow-50 min-h-screen">
      {/* Navbar */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative p-10 text-center shadow-lg rounded-b-3xl bg-gradient-to-r from-mutedPalette-mutedBlue to-mutedPalette-sageGreen mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-mutedPalette-beige mb-4 leading-tight">
          You're One Step Away From Impact
        </h1>

        <p className="text-mutedPalette-beige text-lg max-w-2xl mx-auto mb-3">
          Confirm your choices and complete your journey. Every order plants the
          seeds for a greener tomorrow.
        </p>

        <p className="text-mutedPalette-beige text-sm italic max-w-xl mx-auto">
          Eco Points will be automatically applied if selected — enjoy your
          rewards for making sustainable decisions!
        </p>

        {/* Decorative Circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Progress Steps */}
        <div className="mt-10">
          <ProgressSteps step1 step2 step3 />
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {cart.cartItems.length === 0 ? (
          <p className="text-center text-gray-700">
            Your cart is empty.{" "}
            <Link to="/shop" className="text-green-600 hover:underline">
              Go to Shop
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items Section */}
            <div className="col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-8">
                Review Your Cart
              </h2>
              <ul className="space-y-6">
                {cart.cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b pb-6"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                      <Link
                        to={`/customer/product/${item._id}`}
                        className="text-lg font-semibold text-mutedPalette-mutedBlue hover:text-primaryGreen transition"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-right text-mutedPalette-mutedBlue">
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="font-semibold">
                        {(item.quantity * item.price).toFixed(2)} LKR
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 sticky top-20">
              <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-8">
                Order Summary
              </h2>

              <ul className="space-y-4 text-gray-700">
                <li>
                  <strong>Items:</strong> {cart.itemsPrice} LKR
                </li>
                <li>
                  <strong>Shipping:</strong> {cart.shippingPrice} LKR
                </li>
                <li>
                  <strong>Tax:</strong> {cart.taxPrice} LKR
                </li>
                <li>
                  <strong>Total:</strong> {cart.totalPrice} LKR
                </li>
                {ecoPointsApplied && (
                  <li className="text-green-600 font-semibold">
                    <strong>After Eco Points:</strong> {finalPrice.toFixed(2)}{" "}
                    LKR
                  </li>
                )}
              </ul>

              {/* Shipping Information */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-mutedPalette-mutedBlue mb-2">
                  Shipping Info
                </h3>
                {shippingAddressData ? (
                  <div className="text-gray-700 space-y-1">
                    <p>
                      <strong>City:</strong> {shippingAddressData.city}
                    </p>
                    <p>
                      <strong>Street:</strong> {shippingAddressData.street}
                    </p>
                    <p>
                      <strong>Postal:</strong> {shippingAddressData.postalCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading shipping info...</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-mutedPalette-mutedBlue mb-2">
                  Payment Method
                </h3>
                <p className="text-gray-700">{cart.paymentMethod}</p>
              </div>

              {/* Eco Points Toggle */}
              <div className="flex items-center justify-between mt-8 bg-green-50 p-4 rounded-lg shadow-inner">
                <div className="flex items-center space-x-3 text-green-800">
                  <MdEco size={24} />
                  <span className="font-semibold">
                    Use Eco Points ({ecoPoints})
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecoPointsApplied}
                    onChange={toggleEcoPoints}
                    disabled={ecoPointsLoading || ecoPointsError}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                  <div className="absolute left-1 top-0.5 w-6 h-6 bg-white rounded-full transition-all peer-checked:translate-x-7"></div>
                </label>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrderHandler}
                className="w-full mt-6 py-3 bg-mutedPalette-mutedBlue text-mutedPalette-beige rounded-xl shadow-md hover:bg-opacity-90 transition text-lg font-bold"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
