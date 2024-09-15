import { configureStore } from "@reduxjs/toolkit";
import { friendshipRequestsReducer, groupsReducer, privateChatsReducer, userReducer } from "./slices";


const store = configureStore(
    {
        reducer: {
            friendshipRequests: friendshipRequestsReducer,
            groups: groupsReducer,
            privateChats: privateChatsReducer,
            user: userReducer
        }
    }
)

export default store;