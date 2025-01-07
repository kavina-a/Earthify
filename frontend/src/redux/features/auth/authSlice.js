import { createSlice } from '@reduxjs/toolkit';

// This is where you manage local state like authentication, theme or preferences.

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
        reducers: {
            setCredentials: (state, action) => {
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
                const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
                localStorage.setItem('expirationTime', expirationTime);
            },
            logout: (state) => {
                state.userInfo = null;
                localStorage.clear();
            }
        }
});

// these are plurual because they are actions not action
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

