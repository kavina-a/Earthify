import { Link } from "react-router-dom";
import { useGetServiceProviderOrdersQuery } from "../../redux/api/orderApiSlice";
import Navigation from "./Navigation";

const PendingOrders = () => {
  const { data: ordersData, isLoading, error } = useGetServiceProviderOrdersQuery();

  console.log("Orders Data:", ordersData);

  // Safely retrieve delivered and paid orders
  const deliveredOrders = ordersData?.orders?.delivered || [];
  const paidOrders = ordersData?.orders?.paid || [];

  return (

    <div className="">

    <Navigation />

    <div className="container mx-auto px-6 py-8 bg-gray-100 min-h-screen">
      {/* Loading and Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-600 animate-pulse">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-red-500">
            {error?.data?.error || error.error}
          </p>
        </div>
      ) : (
        <>
          {/* Paid Orders Section */}
          <section className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              Paid Orders
            </h2>
            {paidOrders.length > 0 ? (
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">ITEMS</th>
                    <th className="px-4 py-2 border border-gray-200">ORDER ID</th>
                    <th className="px-4 py-2 border border-gray-200">DATE</th>
                    <th className="px-4 py-2 border border-gray-200">TOTAL</th>
                    <th className="px-4 py-2 border border-gray-200">PAID</th>
                    <th className="px-4 py-2 border border-gray-200">DELIVERED</th>
                    <th className="px-4 py-2 border border-gray-200"></th>
                  </tr>
                </thead>
                <tbody>
                  {paidOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-200">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="flex items-center mb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <p className="ml-2">{item.name}</p>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">{order._id}</td>
                      <td className="px-4 py-2 border border-gray-200">
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">${order.totalPrice}</td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        {order.isPaid ? (
                          <span className="bg-green-200 text-green-800 py-1 px-2 rounded">
                            Completed
                          </span>
                        ) : (
                          <span className="bg-red-200 text-red-800 py-1 px-2 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        {order.isDelivered ? (
                          <span className="bg-green-200 text-green-800 py-1 px-2 rounded">
                            Completed
                          </span>
                        ) : (
                          <span className="bg-red-200 text-red-800 py-1 px-2 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        <Link to={`/service-provider/order/${order._id}`}>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            More
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">No paid orders found.</p>
            )}
          </section>

          {/* Delivered Orders Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              Delivered Orders
            </h2>
            {deliveredOrders.length > 0 ? (
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-green-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">ITEMS</th>
                    <th className="px-4 py-2 border border-gray-200">ORDER ID</th>
                    <th className="px-4 py-2 border border-gray-200">DATE</th>
                    <th className="px-4 py-2 border border-gray-200">TOTAL</th>
                    <th className="px-4 py-2 border border-gray-200">PAID</th>
                    <th className="px-4 py-2 border border-gray-200">DELIVERED</th>
                    <th className="px-4 py-2 border border-gray-200"></th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-200">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="flex items-center mb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <p className="ml-2">{item.name}</p>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">{order._id}</td>
                      <td className="px-4 py-2 border border-gray-200">
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">${order.totalPrice}</td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        {order.isPaid ? (
                          <span className="bg-green-200 text-green-800 py-1 px-2 rounded">
                            Completed
                          </span>
                        ) : (
                          <span className="bg-red-200 text-red-800 py-1 px-2 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        {order.isDelivered ? (
                          <span className="bg-green-200 text-green-800 py-1 px-2 rounded">
                            Completed
                          </span>
                        ) : (
                          <span className="bg-red-200 text-red-800 py-1 px-2 rounded">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-center">
                        <Link to={`/service-provider/order/${order._id}`}>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            More
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">No delivered orders found.</p>
            )}
          </section>
        </>
      )}
    </div>
  </div>
  );
};

export default PendingOrders;