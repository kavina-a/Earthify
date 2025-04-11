const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const ServiceProvider = require('../models/serviceProviderModel');

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, paymentMethod, finalPrice} = req.body;

    const customer = await Customer.findOne({user: req.user._id})

    if (!customer || !customer.address) {
        res.status(404);
        throw new Error("Customer or address not found");
      }

    //to check if orderItems is an array and has at least one item
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    //loops through the orderItems array and checks if the product exists in the database and then makes a new array
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    //to check if the number of items in the orderItems array is the same as the number of items in the itemsFromDB array
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        seller: matchingItemFromDB.seller,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new Order({
      customer: customer.user,
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress: customer.address,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      finalPrice,
    });

    const ecoPointsPercentage = 5; // 5% of the total price
    const ecoPointsToAdd = Math.round((totalPrice * ecoPointsPercentage) / 100);
    customer.ecoPoints += ecoPointsToAdd;
    await customer.save();
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//to get all orders - admin only
const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const orders = await Order.find({})
        .populate({
          path: "customer",
          select: "firstName", 
        })
        .populate({
          path: "serviceProvider", 
          select: "businessName", 
        });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error getting orders', error: error.message });
    }
  });



//to get all orders for a specific customer
const getCustomerOrders = asyncHandler( async( req, res) => {
    try {
        const orders = await Order.find({customer: req.user._id})
        res.json(orders)
    }catch(error) {
        console.log(error);
        res.status(400).json({ message: 'Error getting orders', error: error.message });
        
    }
})

const getServiceProviderOrders = asyncHandler(async (req, res) => {
  try {
    console.log("Starting getServiceProviderOrders...");

    // Step 1: Get logged-in user ID
    const userId = new mongoose.Types.ObjectId(req.user._id);
    console.log("Logged-in User ID:", userId);

    // Step 2: Find the Service Provider linked to this user
    const serviceProvider = await ServiceProvider.findOne({ user: userId }).select("_id");
    if (!serviceProvider) {
      console.log("Service Provider not found for User ID:", userId);
      return res.status(404).json({
        success: false,
        message: "Service Provider not found.",
      });
    }

    const serviceProviderId = serviceProvider._id;
    console.log("Service Provider ID:", serviceProviderId);

    // Step 3: Aggregate Orders
    const sellerOrders = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.seller": serviceProviderId,
        },
      },
      {
        $group: {
          _id: "$_id",
          customer: { $first: "$customer" },
          shippingAddress: { $first: "$shippingAddress" },
          paymentMethod: { $first: "$paymentMethod" },
          itemsPrice: { $first: "$itemsPrice" },
          taxPrice: { $first: "$taxPrice" },
          shippingPrice: { $first: "$shippingPrice" },
          totalPrice: { $first: "$totalPrice" },
          finalPrice: { $first: "$finalPrice" },
          isPaid: { $first: "$isPaid" },
          isConfirmed: { $first: "$isConfirmed" }, // fixed typo
          paidAt: { $first: "$paidAt" },
          isDelivered: { $first: "$isDelivered" },
          deliveredAt: { $first: "$deliveredAt" },
          orderItems: { $push: "$orderItems" },
        },
      },
      {
        $project: {
          _id: 1,
          customer: 1,
          shippingAddress: 1,
          paymentMethod: 1,
          itemsPrice: 1,
          taxPrice: 1,
          shippingPrice: 1,
          totalPrice: 1,
          finalPrice: 1,
          isPaid: 1,
          isConfirmed: 1,
          paidAt: 1,
          isDelivered: 1,
          deliveredAt: 1,
          orderItems: {
            $filter: {
              input: "$orderItems",
              as: "item",
              cond: { $eq: ["$$item.seller", serviceProviderId] },
            },
          },
        },
      },
      {
        $facet: {
          paid: [
            {
              $match: { isPaid: true, isDelivered: false },
            },
          ],
          delivered: [
            {
              $match: { isDelivered: true },
            },
          ],
        },
      },
    ]);

    console.log("Aggregated Seller Orders:", JSON.stringify(sellerOrders, null, 2));

    res.status(200).json({
      success: true,
      orders: sellerOrders[0] || { paid: [], delivered: [] },
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch orders for the service provider.",
    });
  }
});

const getServiceProviderOrderById = asyncHandler(async (req, res) => {
  try {
    console.log("Starting getServiceProviderOrderById...");

    // Extract the logged-in user's ID and order ID from request
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const orderId = req.params.orderId;
    console.log("Logged-in User ID:", userId);
    console.log("Order ID:", orderId);

    // Find the Service Provider
    const serviceProvider = await ServiceProvider.findOne({ user: userId }).select("_id");
    if (!serviceProvider) {
      console.log("Service Provider not found for User ID:", userId);
      return res.status(404).json({
        success: false,
        message: "Service Provider not found.",
      });
    }
    const serviceProviderId = serviceProvider._id;
    console.log("Service Provider ID:", serviceProviderId);

    // Fetch the order containing items related to this seller
    console.log("Fetching order for Service Provider ID:", serviceProviderId);
    const sellerOrder = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } }, // Match specific order ID
      { $unwind: "$orderItems" }, // Break down orderItems array
      {
        $match: {
          "orderItems.seller": serviceProviderId, // Match the logged-in seller
        },
      },
      {
        $group: {
          _id: "$_id",
          customer: { $first: "$customer" },
          shippingAddress: { $first: "$shippingAddress" },
          paymentMethod: { $first: "$paymentMethod" },
          itemsPrice: { $first: "$itemsPrice" },
          taxPrice: { $first: "$taxPrice" },
          shippingPrice: { $first: "$shippingPrice" },
          totalPrice: { $first: "$totalPrice" },
          finalPrice: { $first: "$finalPrice" },
          isPaid: { $first: "$isPaid" },
          isConfirmed: { $first: "$isConfirmed" },
          paidAt: { $first: "$paidAt" },
          isDelivered: { $first: "$isDelivered" },
          deliveredAt: { $first: "$deliveredAt" },
          orderItems: { $push: "$orderItems" },
        },
      },
      {
        $project: {
          _id: 1,
          customer: 1,
          shippingAddress: 1,
          paymentMethod: 1,
          itemsPrice: 1,
          taxPrice: 1,
          shippingPrice: 1,
          totalPrice: 1,
          finalPrice: 1,
          isPaid: 1,
          isConfirmed: 1,
          paidAt: 1,
          isDelivered: 1,
          deliveredAt: 1,
          orderItems: {
            $filter: {
              input: "$orderItems",
              as: "item",
              cond: { $eq: ["$$item.seller", serviceProviderId] },
            },
          },
        },
      },
    ]);

    // If no order is found
    if (!sellerOrder.length) {
      console.log("Order not found or not associated with the Service Provider.");
      return res.status(404).json({
        success: false,
        message: "Order not found or not associated with the Service Provider.",
      });
    }

    // Return the fetched order
    console.log("Fetched Order:", sellerOrder[0]);
    res.status(200).json({
      success: true,
      order: sellerOrder[0],
    });
  } catch (error) {
    console.error("Error in getServiceProviderOrderById:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});


const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getShippingAddress = asyncHandler(async (req, res) => { 
  try {
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }
    res.json(customer.address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

const updateDelivery = asyncHandler(async (req, res) => { 
  try {

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isDelivered = !order.isDelivered;
    order.deliveredAt = order.isDelivered ? Date.now() : null;
  
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" }, // Deconstruct the orderItems array
      {
        $group: {
          _id: "$orderItems.product", // Group by product ID
          totalSold: { $sum: "$orderItems.quantity" }, // Sum the quantity of each product
        },
      },
      { $sort: { totalSold: -1 } }, // Sort by totalSold in descending order
      { $limit: 5 }, // Limit to the top 5 products
      {
        $lookup: {
          from: "products", // Reference the Product collection
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Unwind productDetails for easier access
      {
        $project: {
          _id: 0, // Exclude the _id field
          product: "$productDetails.name",
          totalSold: 1,
          category: "$productDetails.category",
          price: "$productDetails.price",
          image: "$productDetails.image",
          id: "$productDetails._id",
        },
      },
    ]);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch top-selling products" });
  }
};

const getTopSellingCategories = async (req, res) => {
  try {
    const topCategories = await Order.aggregate([
      { $unwind: "$orderItems" }, // Deconstruct the orderItems array
      {
        $lookup: {
          from: "products", // Reference the Product collection
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Unwind productDetails for easier access
      {
        $group: {
          _id: "$productDetails.category", // Group by category
          totalSold: { $sum: "$orderItems.quantity" }, // Sum the quantity of products in each category
        },
      },
      { $sort: { totalSold: -1 } }, // Sort by totalSold in descending order
      { $limit: 5 }, // Limit to the top 5 categories
      {
        $lookup: {
          from: "categories", // Reference the Category collection
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" }, // Unwind categoryDetails for easier access
      {
        $project: {
          _id: 0, // Exclude the _id field
          category: "$categoryDetails.name",
          totalSold: 1,
          productIds: 1,
        },
      },
    ]);

    res.status(200).json(topCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch top-selling categories" });
  }
};



module.exports = { createOrder,
                   getAllOrders,
                   getCustomerOrders,  
                   getServiceProviderOrders,
                   findOrderById,
                   markOrderAsPaid, 
                   markOrderAsDelivered, 
                   getShippingAddress,
                   getTopSellingProducts,
                   getTopSellingCategories,
                   getServiceProviderOrderById,
                   updateDelivery
                  };