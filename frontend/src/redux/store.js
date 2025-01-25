import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import cartSlideReducer from "./features/cart/cartSlice";
import shopSliceReeducer from "./features/shop/shopSlice";

//the store is the central place where the state of your application is managed.
//It holds the state, allows access to the state,
//and lets you update the state via actions and reducers.

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

