import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";
import { get } from "mongoose";

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
        url: `${ORDERS_URL}/${orderId}/deliver`,
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

    // getTotalOrders: builder.query({
    //   query: () => `${ORDERS_URL}/total-orders`,
    // }),

    // getTotalSales: builder.query({
    //   query: () => `${ORDERS_URL}/total-sales`,
    // }),

    // getTotalSalesByDate: builder.query({
    //   query: () => `${ORDERS_URL}/total-sales-by-date`,
    // }),

  }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    // useGetPaypalClientIdQuery,
    useGetCustomerOrdersQuery,
    useGetServiceProviderOrdersQuery,
    useGetAllOrdersQuery,
    useDeliverOrderMutation,
    useGetShippingAddressQuery,
    // useGetTotalOrdersQuery,
    // useGetTotalSalesQuery,
    // useGetTotalSalesByDateQuery,
    useGetTopSellingProductsQuery,
    useGetTopSellingCategoriesQuery,
} = orderApiSlice;