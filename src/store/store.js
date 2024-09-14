import { configureStore } from "@reduxjs/toolkit";
import { friendshipRequestsReducer, groupsReducer, privateChatsReducer, userReducer } from "./slices";


const store = configureStore(
    {
        reducer: {
            friendshipRequestsReducer,
            groupsReducer,
            privateChatsReducer,
            userReducer
        }
    }
)

export default store;