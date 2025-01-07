import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import cartSlideReducer from "./features/cart/cartSlice";
import shopSliceReeducer from "./features/shop/shopSlice";

//was told that i dont need to think about this alot, but this is essential ( the reducer part and the middleware part)
const store = configureStore ({
    reducer : {
        [apiSlice.reducerPath]: apiSlice.reducer, //
        auth: authReducer,
        cart: cartSlideReducer,
        shop: shopSliceReeducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);
export default store;

