import { createSlice } from '@reduxjs/toolkit';
import { set } from 'mongoose';

const initialState = {
    products: [],
    categories: [],
    checked: [],
    radio: [],
    price: [],
}

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        },
        setChecked: (state, action) => {
            state.checked = action.payload
        },
        setRadio: (state, action) => {
            state.radio = action.payload
        },
        setPrice: (state, action) => {
            state.price = action.payload
        }
    }
})

export const { setProducts, setCategories, setChecked, setRadio, setPrice } = shopSlice.actions
export default shopSlice.reducer;