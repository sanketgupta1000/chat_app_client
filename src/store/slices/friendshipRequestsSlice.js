import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    receivedFriendshipRequests: []
    // each object will have following properties
    // requestId, senderId, senderName, senderEmail, array of matchingInterests, rating
}

const friendshipRequestsSlice = createSlice(
    {
        name: "friendshipRequests",
        initialState,
        reducers: {
            
            // to set received requests
            setReceivedRequests: (state, action)=>
            {
                state.receivedFriendshipRequests = action.payload.receivedFriendshipRequests;
            },
            
            // to add to received requests
            addReceivedRequest: (state, action)=>
            {
                state.receivedFriendshipRequests.unshift(action.payload.receivedRequest);
            },

            // to remove a received request by index
            removeReceivedRequest: (state, action) =>
            {
                state.receivedFriendshipRequests.splice(action.payload.index);
            }

        }
    }
);

export default friendshipRequestsSlice.reducer;

export const {setReceivedRequests, addReceivedRequest, removeReceivedRequest} = friendshipRequestsSlice.actions;