import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}/create`,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    // getPaypalClientId: builder.query({
    //   query: () => ({
    //     url: PAYPAL_URL,
    //   }),
    // }),

    getCustomerOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/customer`,
      }),
      keepUnusedDataFor: 5,
    }),

    getServiceProviderOrders: builder.query({
        query: () => ({
          url: `${ORDERS_URL}/serviceprovider`,
        }),
        keepUnusedDataFor: 5,
      }),

    //admin
    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/all`,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/deliver/${orderId}`,
        method: "PUT",
      }),
    }),

    getShippingAddress: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/shipping`,
      }),
    }),

    getTopSellingProducts: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/top-products`,
      }),
    }),

    getTopSellingCategories: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/top-categories`,
      }),
    }),

    getServiceProviderOrderById : builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/order/${orderId}`,
      })
    }),

    updateDelivery: builder.mutation({
      query: ({ orderId }) => ({
        url: `${ORDERS_URL}/delivery/${orderId}`,
        method: "PUT",
      }),
  }),
}),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetCustomerOrdersQuery,
    useGetServiceProviderOrdersQuery,
    useGetAllOrdersQuery,
    useDeliverOrderMutation,
    useGetShippingAddressQuery,
    useGetTopSellingProductsQuery,
    useGetTopSellingCategoriesQuery,
    useGetServiceProviderOrderByIdQuery,
    useUpdateDeliveryMutation,
} = orderApiSlice;