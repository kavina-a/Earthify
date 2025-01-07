import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';


const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

//mind you , you are already exporting it here
export const apiSlice = createApi({
    baseQuery,
    // tagTypes: ['User', 'Category'],
    endpoints: () => ({}),
});

