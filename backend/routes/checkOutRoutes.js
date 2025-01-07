const express = require('express');
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = 'sk_test_51Q5MsnKcg0aY6eUJEzI7ZbILm8r4Zr7x188NzJOEZRc8eJ4bSFxY7BkEhRjKNyQy7gqlcQv7OkeNrmC1pe9cr4Rb00VHCKVMyW';
const stripe = Stripe(STRIPE_SECRET_KEY);

router.get('/checkout-session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        // Retrieve the session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log("Retrieved Stripe session:", session);

        res.status(200).json(session);
    } catch (error) {
        console.error("Error retrieving Stripe session:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;