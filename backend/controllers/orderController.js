const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');

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

//to get all orders for a specific service provider
const getServiceProviderOrders = asyncHandler(async (req, res) => {
  try {
    const serviceProviderId = req.user._id;

    // Find all orders containing items for the service provider
    const orders = await Order.find({
      orderItems: { $elemMatch: { seller: serviceProviderId } },
    });

    // Filter orderItems to include only those matching the service provider
    const filteredOrders = orders.map((order) => ({
      ...order._doc, // Spread other order properties
      orderItems: order.orderItems.filter(
        (item) => item.seller.toString() === serviceProviderId.toString()
      ),
    }));

    res.json(filteredOrders);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error getting orders', error: error.message });
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
                   getTopSellingCategories
                  };