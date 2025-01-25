import { apiSlice  } from "./apiSlice";
import { PRODUCTS_URL, UPLOAD_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/detail/${productId}`,
            }),
            providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
        }),

        allProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/all`,
                credentials: 'include',
            }),
        }),

        getProductsBySeller: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/list`,
            }),
        }),

        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }), 
            keepUnusedDataFor: 5,   
        }),

        getFilteredProducts: builder.query({
            query: ({checked, radio}) => ({
                url: `${PRODUCTS_URL}/filtered-products`,
                method: 'POST',
                body: { checked, radio }
            })

        }),

        getProductsByCategory: builder.query({
            query: ({ category, excludeProductId }) => ({
                url: `${PRODUCTS_URL}/category/${category}/exclude/${excludeProductId}`,
                method: 'GET',
            }),
        }),

        createProduct: builder.mutation({
            query: (productData) => ({
                url: `${PRODUCTS_URL}/create`,
                method: 'POST',
                body: productData
            }),
            transformResponse: (response) => response, // Ensure the response is returned properly
            invalidatesTags: ["Product"],
        }),

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data
            })
        }),

        updateProduct: builder.mutation({
            query: ({productId, formData}) => ({
                url: `${PRODUCTS_URL}/update/${productId}`,
                method: 'PUT',
                body: formData
            })
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/delete/${productId}`,
                method: 'DELETE',
            }),
            providesTags: ["Product"],
        }),

        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/create/review/${data.productId}`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["Product"],
        }),

        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        }),

        getNewProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/new`,
            }),
            keepUnusedDataFor: 5,
        }),

        getFavorites: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/favorites`,
            }),
        }),

        addToFavorites: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/add-favorite/${productId}`,
                method: 'PUT',
            }),
            invalidatesTags: ["Product"],
        }),

        removeFromFavorites: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/remove-favorite/${productId}`,
                method: 'PUT',
            }),
            invalidatesTags: ["Product"],
    }),
})
});

export const { 
    useGetProductByIdQuery,
    useAllProductsQuery, 
    useGetProductDetailsQuery, 
    useCreateProductMutation,
    useUploadProductImageMutation, 
    useUpdateProductMutation, 
    useDeleteProductMutation, 
    useCreateReviewMutation, 
    useGetTopProductsQuery, 
    useGetNewProductsQuery,
    useGetProductsBySellerQuery,
    useGetFilteredProductsQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
    useGetFavoritesQuery,
    useGetProductsByCategoryQuery
             } = productApiSlice;


