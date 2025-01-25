import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetServiceProviderOrderByIdQuery, useUpdateDeliveryMutation } from "../../redux/api/orderApiSlice";
import Navigation from "./Navigation";
import { FaCheckCircle, FaTimesCircle, FaTruck, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { data, isLoading, error, refetch } = useGetServiceProviderOrderByIdQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateDeliveryMutation();

  const orderData = data?.order;

  const [isDelivered, setIsDelivered] = useState(orderData?.isDelivered || false);

  useEffect(() => {
    if (orderData) {
      setIsDelivered(orderData.isDelivered);
    }
  }, [orderData]);

  const handleStatusChange = async () => {
    try {
      const response = await updateOrderStatus({ orderId }).unwrap();
      setIsDelivered(response.order.isDelivered);
      refetch();
    } catch (error) {
      console.error("Failed to update delivery status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">{error?.data?.error || error.message || "An error occurred"}</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">No order data available.</p>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-6 py-8 bg-gray-100 min-h-screen">
        <section className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Order Details</h2>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FaDollarSign className="mr-2 text-green-500" /> Order Information
              </h3>
              <p className="text-gray-700"><strong>Order ID:</strong> {orderData._id || "N/A"}</p>
              <p className="text-gray-700"><strong>Total Price:</strong> ${orderData.totalPrice.toFixed(2)}</p>
              <p className="text-gray-700">
                <strong>Paid:</strong>{" "}
                <span
                  className={`font-semibold ${
                    orderData.isPaid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {orderData.isPaid ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-gray-700">
                <strong>Delivered:</strong>{" "}
                <span
                  className={`font-semibold ${
                    isDelivered ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isDelivered ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-gray-700"><strong>Payment Method:</strong> {orderData.paymentMethod || "N/A"}</p>
            </div>

            {/* Shipping Address with Button */}
            <div className="bg-gray-50 shadow rounded-lg p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" /> Shipping Address
              </h3>
              <p className="text-gray-700"><strong>Street:</strong> {orderData.shippingAddress?.street || "N/A"}</p>
              <p className="text-gray-700"><strong>City:</strong> {orderData.shippingAddress?.city || "N/A"}</p>
              <p className="text-gray-700"><strong>Postal Code:</strong> {orderData.shippingAddress?.postalCode || "N/A"}</p>
              <button
                className={`mt-6 px-6 py-3 rounded-lg shadow text-white font-bold text-lg transition-all ${
                  isDelivered
                    ? "bg-red-500 hover:bg-red-600 hover:shadow-lg"
                    : "bg-green-500 hover:bg-green-600 hover:shadow-lg"
                }`}
                onClick={handleStatusChange}
                disabled={isUpdating}
              >
                {isUpdating
                  ? "Updating..."
                  : isDelivered
                  ? "Mark as Pending"
                  : "Mark as Delivered"}
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaTruck className="mr-2 text-yellow-500" /> Order Items
            </h3>
            {orderData.orderItems && orderData.orderItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300">Product</th>
                      <th className="px-4 py-2 border border-gray-300 text-right">Price</th>
                      <th className="px-4 py-2 border border-gray-300 text-right">Quantity</th>
                      <th className="px-4 py-2 border border-gray-300 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.orderItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border border-gray-300">
                          <div className="flex items-center">
                            <img
                              src={item.image || "https://via.placeholder.com/150"}
                              alt={item.name || "Item"}
                              className="w-12 h-12 object-cover rounded mr-4"
                            />
                            <p>{item.name || "Item Name"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 border border-gray-300 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 border border-gray-300 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No items available in this order.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderDetailPage;