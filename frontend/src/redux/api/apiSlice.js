import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include', // Ensures cookies (like jwt) are included in requests
});

// Exporting the API slice with global configurations
export const apiSlice = createApi({
    baseQuery,
    // tagTypes: ['User', 'Category'], // If caching/tagging is required
    endpoints: () => ({}),
});