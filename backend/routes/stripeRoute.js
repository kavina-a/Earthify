const express = require('express');
const Stripe = require('stripe');
const Order = require('../models/orderModel');

const STRIPE_SECRET_KEY = 'sk_test_51Q5MsnKcg0aY6eUJEzI7ZbILm8r4Zr7x188NzJOEZRc8eJ4bSFxY7BkEhRjKNyQy7gqlcQv7OkeNrmC1pe9cr4Rb00VHCKVMyW';
const stripe = Stripe(STRIPE_SECRET_KEY);

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body; // Extract the products object
    console.log("Products:", products);

    const orderId = products.orderId; // Extract orderId from products
    const cartItems = products.cartItems; // Extract cartItems array

    console.log("Order ID:", orderId);
    console.log("Cart Items:", cartItems);

    // Validate that cartItems exist and have the required structure
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        console.error("Invalid or missing cartItems array in request body");
        return res.status(400).json({ error: 'Cart items array is missing or invalid' });
    }

    try {
        // Map the cart items to Stripe's required line_items format
        const lineItems = cartItems.map(product => {
            if (!product.name || !product.image || !product.price || !product.quantity) {
                console.error("Invalid product data:", product);
                throw new Error("Invalid product data. Ensure each product has name, image, price, and quantity.");
            }

            return {
                price_data: {
                    currency: 'lkr', // Replace with your desired currency if needed
                    product_data: {
                        name: product.name,
                        images: [`http://localhost:5001${product.image}`], // Ensure the image URL is correct
                    },
                    unit_amount: Math.round(product.price * 100), // Stripe requires amounts in cents
                },
                quantity: product.quantity,
            };
        });

        console.log("Line Items for Stripe Checkout:", JSON.stringify(lineItems, null, 2));

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Only 'card' is supported for now
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:5173/customer/success?order_id=${orderId}`, // Redirects to the success page
            cancel_url: `http://localhost:5173/cancel`, // Redirects to the cancellation page
            metadata: { orderId }, // Include order ID in metadata
        });

        console.log("Stripe Checkout Session Created:", session);

        // Respond with the session URL
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Error Creating Stripe Checkout Session:", error);
        res.status(500).json({ error: error.message });
    }
});


router.put('/order/:orderId/pay', async (req, res) => {
    const { orderId } = req.params;

    try {
        // Find the order by ID and mark it as paid
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = true;
        order.updatedAt = Date.now();

        // Save the updated order
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order as paid:", error.message);
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;

