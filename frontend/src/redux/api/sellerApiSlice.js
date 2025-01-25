import { apiSlice } from "./apiSlice";
import { SELLER_URL } from "../constants";

export const sellerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSellerAnalytics: builder.query({
            query: () => `${SELLER_URL}/chart/analytics`,
          }),
    }),
    });

    export const { useGetSellerAnalyticsQuery } = sellerApiSlice;


