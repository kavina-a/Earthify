import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl p-8 bg-mutedPalette-beige rounded-lg shadow-lg">
        {/* Progress Steps */}
        <ProgressSteps step1 step2 />

        {/* Title */}
        <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue text-center mb-8">
          Select Payment Method
        </h2>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stripe Payment */}
          <div
            className={`border-2 rounded-lg p-6 text-text-mutedPalette-mutedBlue text-center cursor-pointer transform transition-transform duration-300 ${
              paymentMethod === "Stripe"
                ? "border-mutedPalette-mutedBlue scale-105"
                : "border-mutedPalette-dustyMauve hover:scale-105"
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
            <span className="text-lg font-semibold text-mutedPalette-mutedBlue">
              Stripe Payment
            </span>
          </div>

          {/* Cash on Delivery */}
          <div
            className={`border-2 rounded-lg p-6 text-center cursor-pointer transform transition-transform duration-300 ${
              paymentMethod === "Cash"
                ? "border-mutedPalette-mutedBlue scale-105"
                : "border-mutedPalette-dustyMauve hover:scale-105"
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
            <span className="text-lg font-semibold text-mutedPalette-mutedBlue">
              Cash On Delivery
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={submitHandler}
          className="mt-8 bg-mutedPalette-mutedBlue text-white py-3 px-6 rounded-lg shadow-lg text-lg font-medium w-full hover:bg-mutedPalette-sageGreenx transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Shipping;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   savePaymentMethod,
// } from "../../redux/features/cart/cartSlice";
// import ProgressSteps from "../../components/ProgressSteps";

// const Shipping = () => {
//   const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;

//   const [paymentMethod, setPaymentMethod] = useState("Stripe");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(savePaymentMethod(paymentMethod));
//     navigate("/customer/placeorder");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen ">
//       <div className="w-full max-w-3xl p-8 bg-primaryGreen-light rounded-lg shadow-lg">
//         {/* Progress Steps */}
//         <ProgressSteps step1 step2 />

//         {/* Title */}
//         <h2 className="text-3xl font-bold text-white text-center mb-8">
//           Select Payment Method
//         </h2>

//         {/* Payment Method Selection */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Stripe Payment */}
//           <div
//             className={`border-2 rounded-lg p-6 text-center cursor-pointer transform transition-transform duration-300 ${
//               paymentMethod === "Stripe"
//                 ? "border-primaryGreen-dark bg-primaryGreen-light scale-105"
//                 : "border-gray-300 hover:scale-105"
//             }`}
//             onClick={() => setPaymentMethod("Stripe")}
//           >
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="Stripe"
//               className="hidden"
//               checked={paymentMethod === "Stripe"}
//               onChange={() => setPaymentMethod("Stripe")}
//             />
//             <span className="text-lg font-semibold text-primaryBrown">
//               Stripe Payment
//             </span>
//           </div>

//           {/* Cash on Delivery */}
//           <div
//             className={`border-2 rounded-lg p-6 text-center cursor-pointer transform transition-transform duration-300 ${
//               paymentMethod === "Cash"
//                 ? "border-primaryGreen-dark bg-primaryGreen-light scale-105"
//                 : "border-gray-300 hover:scale-105"
//             }`}
//             onClick={() => setPaymentMethod("Cash")}
//           >
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="Cash"
//               className="hidden"
//               checked={paymentMethod === "Cash"}
//               onChange={() => setPaymentMethod("Cash")}
//             />
//             <span className="text-lg font-semibold text-primaryBrown">
//               Cash On Delivery
//             </span>
//           </div>

//           {/* <div
//             className={`border-2 rounded-lg p-6 text-center cursor-pointer transform transition-transform duration-300 ${
//               paymentMethod === "CardOnDelivery"
//                 ? "border-primaryGreen-dark bg-primaryGreen-light scale-105"
//                 : "border-gray-300 hover:scale-105"
//             }`}
//             onClick={() => setPaymentMethod("CardOnDelivery")}
//           >
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="CardOnDelivery"
//               className="hidden"
//               checked={paymentMethod === "CardOnDelivery"}
//               onChange={() => setPaymentMethod("CardOnDelivery")}
//             />
//             <span className="text-lg font-semibold text-primaryBrown">
//               Card Payment On Delivery
//             </span>
//           </div> */}
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={submitHandler}
//           className="mt-8 bg-primaryGreen-dark text-white py-3 px-6 rounded-lg shadow-lg text-lg font-medium w-full hover:bg-primaryGreen hover:shadow-xl transition-all duration-300"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Shipping;

// // import { useEffect, useState } from "react";

// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   saveShippingAddress,
// //   savePaymentMethod,
// // } from "../../redux/features/cart/cartSlice";
// // import ProgressSteps from "../../components/ProgressSteps";
// // import { useGetShippingAddressQuery } from "../../redux/api/orderApiSlice";

// // const Shipping = () => {
// //   const cart = useSelector((state) => state.cart);
// //   const { shippingAddress } = cart;

// //   const [paymentMethod, setPaymentMethod] = useState("Stripe"); //change this to stripe 
  
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const [street, setStreet] = useState("");
// //   const [city, setCity] = useState("");
// //   const [postalCode, setPostalCode] = useState("");

// //   const submitHandler = (e) => {
// //     e.preventDefault();
// //     dispatch(saveShippingAddress({ street, city, postalCode }));
// //     dispatch(savePaymentMethod(paymentMethod));
// //     navigate("/customer/placeorder");
// //   };

// //   const { data } = useGetShippingAddressQuery();

// //   useEffect(() => {
// //     if (data) {
// //       setStreet(data.street);
// //       setCity(data.city);
// //       setPostalCode(data.postalCode);
// //     }
// //   }, [data]);

// //   // Payment
// //   // useEffect(() => {
// //   //   if (!shippingAddress.address) {
// //   //     navigate("/login");
// //   //   }
// //   // }, [navigate, shippingAddress]);

// //   return (
// //     <div className="container mx-auto mt-10">
// //       <ProgressSteps step1 step2 />
// //       <div className="mt-[10rem] flex justify-around items-center flex-wrap">
// //         <form onSubmit={submitHandler} className="w-[40rem]">
// //           <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
        
// //           <div className="mb-4">
// //             <label className="block text-gray-400">Select Method</label>
// //             <div className="mt-2">
// //               <label className="inline-flex items-center">
// //                 <input
// //                   type="radio"
// //                   className="form-radio text-pink-500"
// //                   name="paymentMethod"
// //                   value="PayPal"
// //                   checked={paymentMethod === "PayPal"}
// //                   onChange={(e) => setPaymentMethod(e.target.value)}
// //                 />
// //                 <span className="ml-2">Stripe Payment</span>
// //               </label>

// //               <label className="inline-flex items-center">
// //                 <input
// //                   type="radio"
// //                   className="form-radio text-pink-500"
// //                   name="paymentMethod"
// //                   value="Cash"
// //                   checked={paymentMethod === "Cash"}
// //                   onChange={(e) => setPaymentMethod(e.target.value)}
// //                 />
// //                 <span className="ml-2">Cash On Delivery</span>
// //               </label>

// //               <label className="inline-flex items-center">
// //                 <input
// //                   type="radio"
// //                   className="form-radio text-pink-500"
// //                   name="paymentMethod"
// //                   value="CardOnDelivery"
// //                   checked={paymentMethod === "CardOnDelivery"}
// //                   onChange={(e) => setPaymentMethod(e.target.value)}
// //                 />
// //                 <span className="ml-2">Card Payment On Delivery</span>
// //               </label>

// //             </div>
// //           </div>

// //           <button
// //             className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full"
// //             type="submit"
// //           >
// //             Continue
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Shipping;