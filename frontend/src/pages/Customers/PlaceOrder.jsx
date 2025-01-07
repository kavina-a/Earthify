import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useCreateCheckoutSessionMutation } from "../../redux/api/stripeApiSlice";
import { useEcoPointsQuery } from "../../redux/api/usersApiSlice";
import Navigation from "../Auth/Navigation";
import { MdEco, MdCheckCircle } from "react-icons/md"; // Import icons
import {  useGetShippingAddressQuery } from "../../redux/api/orderApiSlice";


const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const [createOrder] = useCreateOrderMutation();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const { data: ecoPointsData, isLoading: ecoPointsLoading, error: ecoPointsError } =
    useEcoPointsQuery();

  const [ecoPoints, setEcoPoints] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalPrice, setFinalPrice] = useState(cart.totalPrice);
  const [ecoPointsApplied, setEcoPointsApplied] = useState(false);
  const { data: shippingAddressData, isLoading: shippingAddressLoading, error: shippingAddressError } = useGetShippingAddressQuery();

  useEffect(() => {
    if (ecoPointsData && ecoPointsData.ecoPoints) {
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
      toast.error(error.message || "An error occurred while placing the order.");
    }
  };

  return (
    <>
      <div className="flex flex-col bg-gray-50 min-h-screen">
        {/* Navbar */}
        <Navigation />

        {/* Progress Header */}
        <div className="p-6 bg-mutedPalette-mutedBlue text-center shadow-lg mb-8">
          <h1 className="text-4xl font-bold text-mutedPalette-beige animate-bounce mb-[2%]">
            Ready to Place Your Order? 🛒
          </h1>
          <ProgressSteps step1 step2 step3 />
        </div>

        <div className="container mx-auto mt-12 px-6">
          {cart.cartItems.length === 0 ? (
            <p className="text-center text-gray-700">
              Your cart is empty.{" "}
              <Link to="/shop" className="text-green-600 hover:underline">
                Go to Shop
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items Section */}
              <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>
                <ul>
                  {cart.cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b py-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md shadow-md"
                        />
                        <Link
                          to={`/customer/product/${item._id}`}
                          className="text-lg font-semibold text-mutedPalette-mutedBlue hover:text-mutedPalette-softTan"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-gray-800 font-semibold">
                          {(item.quantity * item.price).toFixed(2)} LKR
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary Section */}
              <div className="bg-gray-100 rounded-lg shadow-md p-6 sticky top-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>
                <ul className="text-gray-700 space-y-4">
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
                    <li className="text-green-500 font-semibold">
                      <strong>Total After Discount:</strong> {finalPrice.toFixed(2)} LKR
                    </li>
                  )}
                </ul>

                <div className="mt-6">
                        <h3 className="text-lg font-semibold ">Shipping Information</h3>

                        {shippingAddressLoading && (
                          <p className="text-mutedPalette-mutedBlue">Loading shipping information...</p>
                        )}

                        {shippingAddressError && (
                          <p className="text-red-600">Error loading shipping information.</p>
                        )}

                        {shippingAddressData && (
                          <>
                            <p className="text-mutedPalette-mutedBlue">
                              <strong>City:</strong> {shippingAddressData.city || "N/A"}
                            </p>
                            <p className="text-mutedPalette-mutedBlue">
                              <strong>Street:</strong> {shippingAddressData.street || "N/A"}
                            </p>
                            <p className="text-mutedPalette-mutedBlue">
                              <strong>Postal Code:</strong> {shippingAddressData.postalCode || "N/A"}
                            </p>
                          </>
                        )}
                      </div>

               {/* Payment Method */}
               <div className="mt-6">
               <h3 className="text-lg font-semibold ">Payment Method</h3>
               <p className="text-mutedPalette-mutedBlue">
                   <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>

              <div className="flex items-center justify-center mt-6 space-x-4">
            <span className="text-gray-700 text-sm font-bold ">
              Use Eco Points -
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ecoPointsApplied}
                onChange={toggleEcoPoints}
                disabled={ecoPointsLoading || ecoPointsError}
                className="sr-only peer"
              />
              <div className="w-16 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer-checked:bg-green-500 transition-all"></div>
              <div className="absolute left-1 top-0.5 w-7 h-7 bg-white rounded-full flex items-center justify-center text-green-500 peer-checked:translate-x-8 peer-checked:bg-green-700 transition-all">
                🌱 {/* You can replace this emoji with an icon, like <MdEco size={20} /> */}
              </div>
            </label>

            
          </div>

                {/* Place Order */}
                <button
                  onClick={placeOrderHandler}
                  className="w-full mt-4 bg-mutedPalette-mutedBlue text-mutedPalette-beige py-2 px-4 rounded-lg font-medium hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import ProgressSteps from "../../components/ProgressSteps";
// import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
// import { useCreateCheckoutSessionMutation } from "../../redux/api/stripeApiSlice";
// import { useEcoPointsQuery } from "../../redux/api/usersApiSlice";
// import Navigation from "../Auth/Navigation";

// const PlaceOrder = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const cart = useSelector((state) => state.cart);
//   const [createOrder] = useCreateOrderMutation();
//   const [createCheckoutSession] = useCreateCheckoutSessionMutation();
//   const { data: ecoPointsData, isLoading: ecoPointsLoading, error: ecoPointsError } =
//     useEcoPointsQuery();

//   const [ecoPoints, setEcoPoints] = useState(0);
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [finalPrice, setFinalPrice] = useState(cart.totalPrice);
//   const [ecoPointsApplied, setEcoPointsApplied] = useState(false);


//   useEffect(() => {
//     if (ecoPointsData && ecoPointsData.ecoPoints) {
//       const ecoPoints = ecoPointsData.ecoPoints;
//       setEcoPoints(ecoPoints);
//     }
//   }, [ecoPointsData]);

//   const applyEcoPoints = () => {
//     if (ecoPointsApplied) {
//       setFinalPrice(cart.totalPrice); 
//       setEcoPointsApplied(false); 
//       setDiscountApplied(false); // Reset discount flag
//       toast.info("Eco Points discount removed.");
//     } else {
//       // Apply the discount
//       if (ecoPoints > 0) {
//         const discountedPrice = Math.max(finalPrice - ecoPoints, 0); // Ensure price doesn't go below 0
//         setFinalPrice(discountedPrice);
//         setEcoPointsApplied(true); // Mark Eco Points as applied
//         setDiscountApplied(true); // Set discount flag
//         toast.success("Eco Points applied successfully!");
//       } else {
//         toast.error("No Eco Points available to apply.");
//       }
//     }
//   };

//   const placeOrderHandler = async () => {
//     try {
//       const res = await createOrder({
//         orderItems: cart.cartItems,
//         paymentMethod: cart.paymentMethod,
//         itemsPrice: cart.itemsPrice,
//         shippingPrice: cart.shippingPrice,
//         taxPrice: cart.taxPrice,
//         totalPrice: cart.totalPrice,
//         finalPrice,
//       }).unwrap();

//       if (discountApplied && res._id) {
//         localStorage.setItem("ecoPoints", "0");
//         setEcoPoints(0);
//       }

//       const { url } = await createCheckoutSession({
//         orderId: res._id,
//         cartItems: cart.cartItems,
//       }).unwrap();

//       if (url) {
//         window.location.href = url;
//       } else {
//         toast.error("Stripe checkout URL is missing.");
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred while placing the order.");
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col bg-gray-50 min-h-screen">
//       {/* Navbar */}
//       <Navigation />

//       {/* Catchy Header Section */}
//       <div className="p-6 bg-mutedPalette-mutedBlue text-center ml-[40%] lg:ml-[4%] shadow-lg mb-8">
//         <h1 className="text-4xl font-bold text-mutedPalette-beige animate-bounce">
//           Find What You Love, Love What You Find ❤️
//         </h1>
//         <ProgressSteps step1 step2 step3 />
//       </div>

    
//       <div className="container mx-auto mt-12 px-6">

        
//         {cart.cartItems.length === 0 ? (
//           <p className="text-center text-gray-700">
//             Your cart is empty.{" "}
//             <Link to="/shop" className="text-green-600 hover:underline">
//               Go to Shop
//             </Link>
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items Section */}
//             <div className="col-span-2 bg-green-100 rounded-lg shadow-md p-6">
//               <h2 className="text-2xl font-bold text-green-800 mb-6">Cart Items</h2>
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="border-b text-mutedPalette-mutedBlue">
//                     <th className="py-3">Image</th>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cart.cartItems.map((item, index) => (
//                     <tr
//                       key={index}
//                       className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-green-50"}`}
//                     >
//                       <td className="py-3">
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-16 h-16 object-cover rounded-md shadow-md"
//                         />
//                       </td>
//                       <td className="py-3">
//                         <Link
//                           to={`/customer/product/${item._id}`}
//                           className="text-green-600 hover:underline"
//                         >
//                           {item.name}
//                         </Link>
//                       </td>
//                       <td className="py-3">{item.quantity}</td>
//                       <td className="py-3">{item.price.toFixed(2)} LKR </td>
//                       <td className="py-3">
//                         {(item.quantity * item.price).toFixed(2)} LKR
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Order Summary Section */}
//             <div className="bg-green-50 rounded-lg shadow-md p-6">
//               <h2 className="text-2xl font-bold text-green-800 mb-6">Order Summary</h2>
//               <ul className="text-mutedPalette-mutedBlue space-y-4">
//                 <li>
//                   <strong>Items:</strong> {cart.itemsPrice} LKR
//                 </li>
//                 <li>
//                   <strong>Shipping:</strong>  {cart.shippingPrice} LKR
//                 </li>
//                 <li>
//                   <strong>Tax:</strong>  {cart.taxPrice} LKR
//                 </li>
//                 <li>
//                   <strong>Total:</strong>  {cart.totalPrice} LKR
//                 </li>
//                 <li>
//   <strong>Total After Discount:</strong>{" "}
//   {ecoPointsApplied ? `${finalPrice.toFixed(2)} LKR` : `${cart.totalPrice} LKR`}
// </li>
//               </ul>

//               {/* Shipping Info */}
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold text-green-800">Shipping Information</h3>
//                 <p className="text-mutedPalette-mutedBlue">
//                   <strong>City:</strong> {cart.shippingAddress.city}
//                 </p>
//                 <p className="text-mutedPalette-mutedBlue">
//                   <strong>Street:</strong> {cart.shippingAddress.street}
//                 </p>
//                 <p className="text-mutedPalette-mutedBlue">
//                   <strong>Postal Code:</strong> {cart.shippingAddress.postalCode}
//                 </p>
//               </div>

//               {/* Payment Method */}
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold text-green-800">Payment Method</h3>
//                 <p className="text-mutedPalette-mutedBlue">
//                   <strong>Method:</strong> {cart.paymentMethod}
//                 </p>
//               </div>

//               {/* Apply Eco Points */}
//             <button
//                 type="button"
//                 onClick={applyEcoPoints}
//                 disabled={ecoPointsLoading || ecoPointsError}
//                 className={`w-full mt-6 bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition ${
//                   ecoPointsLoading || ecoPointsError ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {ecoPointsLoading
//                   ? "Loading Eco Points..."
//                   : ecoPointsError
//                   ? "Error Fetching Points"
//                   : ecoPointsApplied
//                   ? "Remove Eco Points Discount"
//                   : `Apply Eco Points (${ecoPoints})`}
//               </button>

//               {/* Place Order */}
//               <button
//                 type="button"
//                 onClick={placeOrderHandler}
//                 disabled={cart.cartItems.length === 0}
//                 className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
//               >
//                 Place Order
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       </div>
//     </>
//   );
// };

// export default PlaceOrder;

// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// // import Message from "../../components/Message";
// import ProgressSteps from "../../components/ProgressSteps";
// // import Loader from "../../components/Loader";
// import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
// import { clearCartItems } from "../../redux/features/cart/cartSlice";
// import { loadStripe } from "@stripe/stripe-js";
// import { STRIPE_PUBLISHABLE_KEY } from "../../redux/constants";
// import { useCreateCheckoutSessionMutation } from "../../redux/api/stripeApiSlice";
// import { useState } from "react";
// import { useEcoPointsQuery } from "../../redux/api/usersApiSlice";

// const PlaceOrder = () => {
//   const navigate = useNavigate();

//   const cart = useSelector((state) => state.cart);

//   const [createOrder, { isLoading, error }] = useCreateOrderMutation();
//   const [createCheckoutSession ] = useCreateCheckoutSessionMutation();
//   const { data: ecoPointsData, isLoading: ecoPointsLoading, error: ecoPointsError } = useEcoPointsQuery();

//   console.log("Eco Points Data:", ecoPointsData);

//   //eco points----------
//   const [ecoPoints, setEcoPoints] = useState(0);
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [finalPrice, setFinalPrice] = useState(cart.totalPrice)

//   useEffect(() => {
//     if (ecoPointsData && ecoPointsData.ecoPoints) {
//       const ecoPoints = ecoPointsData.ecoPoints; // Extract the value
//       setEcoPoints(ecoPoints); // Update state
//     }
//   }, [ecoPointsData]);

//   const applyEcoPoints = () => {
//     if (discountApplied) {
//       toast.error("Eco Points already applied.");
//       return;
//     }

//     if (ecoPoints > 0) {
//       const discountedPrice = Math.max(finalPrice - ecoPoints, 0); // Ensure no negative price
//       setFinalPrice(discountedPrice);
//       setDiscountApplied(true);
//       toast.success("Eco Points applied successfully!");
//     } else {
//       toast.error("No Eco Points available to apply.");
//     }
//   };
//   //eco points----------


//   // useEffect(() => {
//   //   if (!cart.shippingAddress.address) {
//   //     navigate("customer/shipping");
//   //   }
//   // }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

//   const dispatch = useDispatch();

//   const placeOrderHandler = async () => {

//     try {

//       console.log(finalPrice);

//       const res = await createOrder({
//         orderItems: cart.cartItems,
//         // shippingAddress: cart.shippingAddress,
//         paymentMethod: cart.paymentMethod,
//         itemsPrice: cart.itemsPrice,
//         shippingPrice: cart.shippingPrice,
//         taxPrice: cart.taxPrice,
//         totalPrice: cart.totalPrice,
//         finalPrice: finalPrice,
//       }).unwrap();

//       if (discountApplied && res._id) { // Ensure the order is created successfully
//         localStorage.setItem("ecoPoints", "0");
//         setEcoPoints(0);
//       }

     
//       console.log("Order Response:", res);

//       const orderId = res._id;
//       console.log("Order ID:", orderId);

//       console.log("Cart Items being sent to Stripe API:", cart.cartItems);

//       const { url } = await createCheckoutSession({
//         orderId,               // The order ID generated from the createOrder API
//         cartItems: cart.cartItems, // The cart items from your state
//       }).unwrap();

//       console.log("Stripe Checkout URL:", url);


//       if (url) {
//         window.location.href = url;
//       } else {
//         console.error("Stripe checkout URL is missing or undefined");
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred while placing the order.");
//     }
//   };

//   return (
//     <>
//       <ProgressSteps step1 step2 step3 />

//       <div className="container mx-auto mt-8">
//         {cart.cartItems.length === 0 ? (
//           <p> Your car is empty </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr>
//                   <td className="px-1 py-2 text-left align-top">Image</td>
//                   <td className="px-1 py-2 text-left">Product</td>
//                   <td className="px-1 py-2 text-left">Quantity</td>
//                   <td className="px-1 py-2 text-left">Price</td>
//                   <td className="px-1 py-2 text-left">Total</td>
//                 </tr>
//               </thead>

//               <tbody>
//                 {cart.cartItems.map((item, index) => (
//                   <tr key={index}>
//                     <td className="p-2">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-16 h-16 object-cover"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <Link to={`/customer/product/${item._id}`}>{item.name}</Link>
//                     </td>
//                     <td className="p-2">{item.quantity}</td>
//                     <td className="p-2">{item.price.toFixed(2)}</td>
//                     <td className="p-2">
//                       $ {(item.quantity * item.price).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="mt-8">
//           <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
//           <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
//             <ul className="text-lg">
//               <li>
//                 <span className="font-semibold mb-4">Items:</span> $
//                 {cart.itemsPrice}
//               </li>
//               <li>
//                 <span className="font-semibold mb-4">Shipping:</span> $
//                 {cart.shippingPrice}
//               </li>
//               <li>
//                 <span className="font-semibold mb-4">Tax:</span> $
//                 {cart.taxPrice}
//               </li>
//               <li>
//                 <span className="font-semibold mb-4">Total:</span> $
//                 {cart.totalPrice}
//               </li>
//               <li>
//                 <span className="font-semibold mb-4">Total After Discount:  </span> $
//                 {discountApplied ? finalPrice.toFixed(2) : cart.totalPrice}
//               </li>
              
//             </ul>

//             {/* {error && <Message variant="danger">{error.data.message}</Message>} */}

//             <div>
//               <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
//               <p>
//               <strong>Address:</strong> 
//                   <p><strong>City:</strong> {cart.shippingAddress.city}</p>
//                   <p><strong>Street:</strong> {cart.shippingAddress.street}</p>
//                   <p><strong>Postal Code:</strong> {cart.shippingAddress.postalCode}</p>
//               </p>
//             </div>

//             <div>
//               <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
//               <strong>Method:</strong> {cart.paymentMethod}
//             </div>
//           </div>

//           <button
//             type="button"
//             className="bg-green-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
//             onClick={applyEcoPoints}
//           >
//                 <span className="font-semibold mb-4">Eco Points - </span> 
//                 {ecoPointsLoading ? "Loading..." : ecoPointsError ? "Error fetching points" : ecoPoints}
//           </button>

//           <button
//             type="button"
//             className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
//             disabled={cart.cartItems === 0}
//             onClick={placeOrderHandler}
//           >
//             Place Order
//           </button>

//           {/* {isLoading && <Loader />} */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PlaceOrder;