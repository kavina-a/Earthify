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
import {
  useCurrentProfileQuery,
} from "../../redux/api/usersApiSlice";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardHome = () => {
  const { data, isLoading, error } = useGetSellerAnalyticsQuery();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useCurrentProfileQuery();
  console.log( `profileData: ${JSON.stringify(profileData)}` );


  if (isLoading) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600 animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-red-500">Error loading analytics: {error.message}</p>
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
        hoverBackgroundColor: "rgba(165, 180, 252, 0.8)", // Light Indigo Hover
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
          "#93C5FD", // Sky Blue
          "#A5B4FC", // Indigo
          "#FCA5A5", // Red
          "#FCD34D", // Amber
          "#86EFAC", // Green
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-lg mb-8">
        {profileLoading && <h1 className="text-4xl font-bold text-white">Loading your profile...</h1>}
        {profileError && <h1 className="text-4xl font-bold text-white">Error loading profile</h1>}
        {profileData && (
          <h3 className="text-3xl font-bold mb-2">Welcome back, {profileData.businessName || "Seller"}! </h3>
        )}
          <p className="text-lg">
            Let’s dive into your store's performance and discover new ways to boost your sales
            today! Check out your top-performing products, analyze revenue trends, and unlock
            insights to grow your business. 💡
          </p>
        </div>

        {/* Summary Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Total Orders</h3>
              <p className="text-2xl font-bold">{analytics.orderCount}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Most Selling Product</h3>
              <p className="text-lg">
                {analytics.mostSellingProduct.product || "N/A"} (
                {analytics.mostSellingProduct.quantity || 0} sold)
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Product Sales (Quantity)
            </h3>
            <Bar
  data={barChartData}
  options={{
    responsive: true,
    maintainAspectRatio: true, // Ensures chart dimensions remain consistent
    plugins: {
      legend: {
        display: true,
        position: "top", // Positions legend at the top
      },
      tooltip: {
        enabled: true,
        mode: "nearest", // Tooltip stays near the data point
        intersect: false, // Prevents tooltips from overlapping
        backgroundColor: "rgba(255,255,255,0.9)", // White tooltip background
        bodyColor: "#333", // Text color inside the tooltip
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
      x: {
        grid: { display: false },
      },
      y: {
        grid: { drawBorder: false },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutCubic", // Smooth animation for the chart
    },
  }}
/>
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Revenue Distribution
            </h3>
            <Pie
  data={pieChartData}
  options={{
    responsive: true,
    maintainAspectRatio: true, // Ensures the chart dimensions are consistent
    plugins: {
      legend: {
        display: true,
        position: "right", // Positions legend to the right
        align: "center",
        labels: {
          boxWidth: 12,
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333", // Legend text color
        },
      },
      tooltip: {
        enabled: true,
        mode: "nearest", // Tooltip appears near the data point
        intersect: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)", // White tooltip background
        bodyColor: "#333", // Text color
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
      easing: "easeInOutQuad", // Smooth animation for the chart
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