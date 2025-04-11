import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/customer/placeorder");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 flex flex-col justify-center items-center py-12">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 relative overflow-hidden">

        {/* Decorative Background Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Progress Steps */}
        <div className="mb-10 relative z-10">
          <ProgressSteps step1 step2 />
        </div>

        {/* Title */}
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-extrabold text-mutedPalette-mutedBlue mb-3">
            Secure Your Payment
          </h2>
          <p className="text-gray-600 text-lg">
            Choose your preferred payment method to complete your purchase.
          </p>
        </div>

        {/* Payment Options */}
        <form onSubmit={submitHandler} className="space-y-8 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Stripe Payment Option */}
            <div
              className={`border-2 rounded-2xl p-6 text-center cursor-pointer transform transition-all duration-300 shadow-sm hover:shadow-md ${
                paymentMethod === "Stripe"
                  ? "border-blue-400 scale-105 bg-blue-50"
                  : "border-gray-300 hover:scale-105 bg-white"
              }`}
              onClick={() => setPaymentMethod("Stripe")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe"
                className="hidden"
                checked={paymentMethod === "Stripe"}
                onChange={() => setPaymentMethod("Stripe")}
              />
              <div className="flex flex-col items-center space-y-3">
                <FaCreditCard size={40} className="text-blue-500" />
                <span className="text-lg font-semibold text-mutedPalette-mutedBlue">
                  Pay with Stripe
                </span>
                <p className="text-sm text-gray-500">
                  Fast and secure credit or debit card payment.
                </p>
              </div>
            </div>

            {/* Cash On Delivery Option */}
            <div
              className={`border-2 rounded-2xl p-6 text-center cursor-pointer transform transition-all duration-300 shadow-sm hover:shadow-md ${
                paymentMethod === "Cash"
                  ? "border-yellow-400 scale-105 bg-yellow-50"
                  : "border-gray-300 hover:scale-105 bg-white"
              }`}
              onClick={() => setPaymentMethod("Cash")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Cash"
                className="hidden"
                checked={paymentMethod === "Cash"}
                onChange={() => setPaymentMethod("Cash")}
              />
              <div className="flex flex-col items-center space-y-3">
                <FaMoneyBillWave size={40} className="text-yellow-500" />
                <span className="text-lg font-semibold text-mutedPalette-mutedBlue">
                  Cash on Delivery
                </span>
                <p className="text-sm text-gray-500">
                  Pay in cash when your order is delivered.
                </p>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-mutedPalette-mutedBlue text-white rounded-xl shadow-lg text-lg font-bold hover:bg-blue-600 transition-all duration-300"
          >
            Continue to Review Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;