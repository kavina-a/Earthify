import { Link } from "react-router-dom";
import { useGetCustomerOrdersQuery } from "../../redux/api/orderApiSlice";
import Navigation from "../Auth/Navigation";
import { AiOutlineEye } from "react-icons/ai";

const Orders = () => {
  const { data: orders, isLoading, error } = useGetCustomerOrdersQuery();

  return (
    <div className="flex flex-col bg-gradient-to-br from-white via-blue-50 to-yellow-50 min-h-screen font-sans">
      {/* Navbar */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative p-12 text-center shadow-lg rounded-b-3xl bg-gradient-to-r from-mutedPalette-mutedBlue to-mutedPalette-sageGreen mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-mutedPalette-beige mb-4 leading-tight">
          Your Order Journey 
        </h1>
        <p className="text-mutedPalette-beige text-lg max-w-2xl mx-auto">
          Track your purchases and check order statuses. Here’s everything you’ve got!
        </p>

        {/* Decorative Background */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-16">
        {isLoading ? (
          <p className="text-center text-gray-600 text-lg">Loading your orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">
            {error?.data?.error || error.error}
          </p>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-2xl font-bold mb-4">No orders yet!</p>
            <Link
              to="/shop"
              className="inline-block mt-4 bg-mutedPalette-mutedBlue text-mutedPalette-beige px-6 py-3 rounded-full shadow-md hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 overflow-x-auto">
            <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-8 text-center">
              My Orders
            </h2>

            <table className="w-full text-left text-sm">
              {/* Table Header */}
              <thead className="bg-gray-100 rounded-xl text-gray-600">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Paid</th>
                  <th className="py-4 px-6">Delivered</th>
                  {/* <th className="py-4 px-6">Action</th> */}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`transition-all ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 hover:scale-[1.01] hover:shadow-md`}
                  >
                    <td className="py-4 px-6">
                      <img
                        src={order.orderItems[0]?.image}
                        alt={order.user}
                        className="w-16 h-16 object-cover rounded-md shadow-md"
                      />
                    </td>

                    <td className="py-4 px-6 font-medium text-mutedPalette-mutedBlue">
                      {order._id}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(order.createdAt))}
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-700">
                      ${order.totalPrice.toFixed(2)}
                    </td>

                    {/* Paid Status */}
                    <td className="py-4 px-6">
                      {order.isPaid ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            Paid
                          </span>
                          <div className="w-16 h-1 bg-green-300 rounded-full">
                            <div className="h-1 bg-green-600 w-full rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                            Pending
                          </span>
                          <div className="w-16 h-1 bg-red-300 rounded-full">
                            <div className="h-1 bg-red-600 w-2/4 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Delivered Status */}
                    <td className="py-4 px-6">
                      {order.isDelivered ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            Delivered
                          </span>
                          <div className="w-16 h-1 bg-green-300 rounded-full">
                            <div className="h-1 bg-green-600 w-full rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                            Pending
                          </span>
                          <div className="w-16 h-1 bg-red-300 rounded-full">
                            <div className="h-1 bg-red-600 w-2/4 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Action Button */}
                    {/* <td className="py-4 px-6">
                      <Link to={`/order/${order._id}`}>
                        <button className="flex items-center bg-mutedPalette-mutedBlue text-mutedPalette-beige px-4 py-2 text-sm rounded-md shadow-md hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition">
                          <AiOutlineEye className="mr-2" />
                          View Details
                        </button>
                      </Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;