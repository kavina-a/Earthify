import { Link } from "react-router-dom";
import { useGetCustomerOrdersQuery } from "../../redux/api/orderApiSlice";
import Navigation from "../Auth/Navigation";
import { AiOutlineEye } from "react-icons/ai"; // Import an icon for the button

const Orders = () => {
  const { data: orders, isLoading, error } = useGetCustomerOrdersQuery();

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navigation />

      {/* Catchy Header Section */}
      <div className="p-6 bg-mutedPalette-mutedBlue text-center lg:ml-[4%] shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-mutedPalette-beige animate-bounce">
        Your Favorites Are on Their Way! 
        </h1>
        <p className="text-lg mt-4 text-mutedPalette-beige font-light">
        Track your happiness. One sustainable product at a time!
                </p>
       
      </div>

      <div className="container mx-auto px-6 py-8 bg-gray-50">
        {/* Header */}
        <h2 className="text-3xl font-bold text-mutedPalette-mutedBlue mb-8 text-center">
          My Orders
        </h2>

        {/* Loading and Error States */}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading your orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error?.data?.error || error.error}
          </p>
        ) : (
          <div className="overflow-x-auto">
            {/* Orders Table */}
            <table className="w-full bg-white rounded-lg shadow-md">
              {/* Sticky Header */}
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-4 px-6 text-left font-medium text-gray-600"></th>
                  <th className="py-4 px-6 text-left font-medium text-gray-600">
                    ORDER ID
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-gray-600">
                    DATE
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-gray-600">
                    TOTAL
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-gray-600">
                    PAID
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-gray-600">
                    DELIVERED
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-gray-600">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md transition-all`}
                  >
                    {/* Product Image */}
                    <td className="py-4 px-6">
                      <img
                        src={order.orderItems[0]?.image}
                        alt={order.user}
                        className="w-16 h-16 object-cover rounded-md shadow"
                      />
                    </td>

                    {/* Order ID */}
                    <td className="py-4 px-6 text-gray-700 font-semibold">
                      {order._id}
                    </td>

                    {/* Order Date */}
                          <td className="py-4 px-6 text-gray-600">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }).format(new Date(order.createdAt))}
                          </td>

                    {/* Total Price */}
                    <td className="py-4 px-6 text-gray-700 font-bold">
                      ${order.totalPrice.toFixed(2)}
                    </td>

                    {/* Payment Status with Progress Bar */}
                    <td className="py-4 px-6">
                      {order.isPaid ? (
                        <div className="flex items-center space-x-2">
                          <span className="inline-block px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            Paid
                          </span>
                          <div className="w-16 h-1 bg-green-300 rounded-full">
                            <div className="h-1 bg-green-600 w-full rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="inline-block px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                            Pending
                          </span>
                          <div className="w-16 h-1 bg-red-300 rounded-full">
                            <div className="h-1 bg-red-600 w-2/4 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Delivery Status with Progress Bar */}
                    <td className="py-4 px-6">
                      {order.isDelivered ? (
                        <div className="flex items-center space-x-2">
                          <span className="inline-block px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            Delivered
                          </span>
                          <div className="w-16 h-1 bg-green-300 rounded-full">
                            <div className="h-1 bg-green-600 w-full rounded-full"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="inline-block px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                            Pending
                          </span>
                          <div className="w-16 h-1 bg-red-300 rounded-full">
                            <div className="h-1 bg-red-600 w-2/4 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Action: View Details with Icon */}
                    <td className="py-4 px-6">
                      <Link to={`/order/${order._id}`}>
                        <button className="flex items-center bg-mutedPalette-mutedBlue text-mutedPalette-beige px-4 py-2 text-sm rounded-md shadow-md hover:bg-mutedPalette-beige hover:text-mutedPalette-mutedBlue transition">
                          <AiOutlineEye className="mr-2" />
                          View Details
                        </button>
                      </Link>
                    </td>
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