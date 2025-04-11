import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import Navigation from "./Navigation";
import { useGetSellerAnalyticsQuery } from "../../redux/api/sellerApiSlice";
import { useCurrentProfileQuery } from "../../redux/api/usersApiSlice";
import { HiTrendingUp, HiCurrencyDollar, HiClipboardList, HiShoppingCart } from "react-icons/hi";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardHome = () => {
  const { data, isLoading, error } = useGetSellerAnalyticsQuery();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useCurrentProfileQuery();

  if (isLoading || profileLoading) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || profileError) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-red-500">
            Error loading dashboard: {error?.message || profileError?.message}
          </p>
        </div>
      </div>
    );
  }

  const analytics = data.analytics;

  // Prepare data for charts
  const productSalesData = analytics.productSales.map((product) => ({
    name: product.product,
    quantity: product.quantity,
  }));

  const barChartData = {
    labels: productSalesData.map((p) => p.name),
    datasets: [
      {
        label: "Quantity Sold",
        data: productSalesData.map((p) => p.quantity),
        backgroundColor: "rgba(99, 102, 241, 0.8)", // Indigo
        borderColor: "rgba(99, 102, 241, 1)", // Indigo Border
        borderWidth: 1,
        hoverBackgroundColor: "rgba(165, 180, 252, 0.8)",
      },
    ],
  };

  const pieChartData = {
    labels: productSalesData.map((p) => p.name),
    datasets: [
      {
        label: "Revenue Distribution",
        data: productSalesData.map((p) => p.quantity),
        backgroundColor: [
          "#93C5FD",
          "#A5B4FC",
          "#FCA5A5",
          "#FCD34D",
          "#86EFAC",
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl shadow-xl mb-12 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-3xl font-bold mb-2">
              Welcome back, {profileData.businessName || "Seller"}! 🎉
            </h3>
            <p className="text-lg max-w-2xl">
              Dive into your store's performance and unlock new insights. Track
              your top-selling products, analyze revenue trends, and grow your business smartly. 🚀
            </p>
          </div>
          <div className="bg-white text-indigo-700 rounded-xl px-6 py-4 shadow-md text-center w-full md:w-72">
            <p className="text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold mt-2">${analytics.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-2xl transition-all">
            <HiCurrencyDollar className="text-green-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-2xl transition-all">
            <HiShoppingCart className="text-blue-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{analytics.orderCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-2xl transition-all">
            <HiTrendingUp className="text-yellow-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Top Product</p>
              <p className="text-lg">
                {analytics.mostSellingProduct.product || "N/A"}{" "}
                <span className="text-sm text-gray-400">
                  ({analytics.mostSellingProduct.quantity || 0} sold)
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-2xl transition-all">
            <HiClipboardList className="text-purple-500 text-3xl" />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-xl font-bold">{analytics.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        {/* Performance Tips (New Section) */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl shadow-xl p-6 mb-12 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">Boost Your Sales!</h3>
            <p className="text-white opacity-90">
              Don't forget to promote your top products and restock fast-moving items.
            </p>
          </div>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg shadow hover:bg-green-50 transition">
            View Tips
          </button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition-all">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Product Sales (Quantity)
            </h3>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltip: {
                    enabled: true,
                    mode: "nearest",
                    intersect: false,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    bodyColor: "#333",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    callbacks: {
                      label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { drawBorder: false } },
                },
                animation: {
                  duration: 1000,
                  easing: "easeOutCubic",
                },
              }}
            />
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition-all">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Revenue Distribution
            </h3>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                    align: "center",
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 14,
                        weight: "bold",
                      },
                      color: "#333",
                    },
                  },
                  tooltip: {
                    enabled: true,
                    mode: "nearest",
                    intersect: true,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    bodyColor: "#333",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    callbacks: {
                      label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw} units`;
                      },
                    },
                  },
                },
                animation: {
                  duration: 1500,
                  easing: "easeInOutQuad",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;