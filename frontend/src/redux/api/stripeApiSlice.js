import { apiSlice } from "./apiSlice";
import { STRIPE_URL } from "../constants";  

export const stripeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: ({ orderId, cartItems }) => ({
                url: `${STRIPE_URL}/create-checkout-session`,
                method: 'POST',
                body: {
                    products: {
                      orderId,      // Include the order ID in the products object
                      cartItems,    // Include the cart items (the actual products)
                    },
                  },
            }),
        }),
        updateOrderToPaid: builder.mutation({
            query: (orderId) => ({
                url: `${STRIPE_URL}/order/${orderId}/pay`,
                method: 'PUT',
            }),
        }),
    }),
});

export const { useCreateCheckoutSessionMutation, useUpdateOrderToPaidMutation } = stripeApiSlice;