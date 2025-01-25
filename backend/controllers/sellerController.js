const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const ServiceProvider = require('../models/serviceProviderModel');

const getSellerAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find the service provider's ID
  const serviceProvider = await ServiceProvider.findOne({ user: userId }).select("_id");
  if (!serviceProvider) {
    return res.status(404).json({ success: false, message: "Service Provider not found" });
  }

  const serviceProviderId = serviceProvider._id;

  // Aggregate analytics
  const analytics = await Order.aggregate([
    { $unwind: "$orderItems" },
    { $match: { "orderItems.seller": serviceProviderId } },
    {
      // Group by product to consolidate product sales
      $group: {
        _id: "$orderItems.name",
        productRevenue: { $sum: "$orderItems.totalPrice" }, // Sum product revenue
        quantitySold: { $sum: "$orderItems.quantity" }, // Sum product quantity
      },
    },
    {
      // Group again to calculate total revenue and collect product sales
      $group: {
        _id: null,
        totalRevenue: { $sum: "$productRevenue" }, // Sum revenue across all products
        productSales: {
          $push: {
            product: "$_id",
            quantity: "$quantitySold",
            total: "$productRevenue",
          },
        },
      },
    },
    {
      // Add total order count and total revenue at the parent Order level
      $lookup: {
        from: "orders",
        let: { serviceProviderId: serviceProviderId },
        pipeline: [
          { $match: { "orderItems.seller": serviceProviderId } },
          {
            $group: {
              _id: null,
              totalOrderRevenue: { $sum: "$totalPrice" }, // Sum total price across orders
              orderCount: { $sum: 1 }, // Count the number of orders
            },
          },
        ],
        as: "orderSummary",
      },
    },
    {
      // Merge order count and revenue with the aggregated product sales
      $project: {
        _id: 0,
        totalRevenue: { $first: "$orderSummary.totalOrderRevenue" }, // Use total revenue from orders
        orderCount: { $first: "$orderSummary.orderCount" }, // Use order count from orders
        productSales: 1,
      },
    },
  ]);

  // Calculate most sold product
  const productSales = analytics[0]?.productSales || [];
  const mostSellingProduct = productSales.reduce(
    (max, product) => (product.quantity > max.quantity ? product : max),
    { quantity: 0 }
  );

  res.status(200).json({
    success: true,
    analytics: {
      totalRevenue: analytics[0]?.totalRevenue || 0,
      orderCount: analytics[0]?.orderCount || 0,
      mostSellingProduct,
      productSales,
    },
  });
});

module.exports = { getSellerAnalytics };