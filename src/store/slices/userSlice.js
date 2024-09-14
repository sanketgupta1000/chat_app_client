import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    // is the user logged in
    isLoggedIn: false,
    // the value of jwt, incase logged in
    // get from local storage
    token: localStorage.getItem("token"),
    // user id
    userId: null,
    // name
    userName: null,
    // email
    userEmail: null

};

export const userSlice = createSlice(
    {
        name: 'user',
        initialState,
        reducers: {

            // methods to manipulate the user

            // to log the user in
            login: (state, action) =>
            {
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.userId = action.payload.userId;
                state.userName = action.payload.userName;
                state.userEmail = action.payload.userEmail;
                // save token in localstorage
                localStorage.setItem("token", action.payload.token);
            },

            // to log the user out
            logout: (state, action)=>
            {
                state.isLoggedIn = false;
                state.token = null;
                state.userId = null;
                state.userName = null;
                state.userEmail = null;
                localStorage.removeItem("token");
            }

        }
    }
);

// to map to store
export default userSlice.reducer;

// to actually use
export const {login, logout} = userSlice.actions;