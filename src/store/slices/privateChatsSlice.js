import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    privateChats: []
    // one object in array will have following fields:
    // privateChatId, user1Id, user1Name, user1Email, user2Id, user2Name, user2Email, lastMsg, lastMsgSenderId,
    // and an array of messages
    // each message contains following info
    // messageId, content, senderId, sentDateTime, status, statusDateTIme
};

const privateChatsSlice = createSlice({
    name: "privateChats",
    initialState,
    reducers: {

        // method to set the private chats
        setPrivateChats: (state, action)=>
        {
            state.privateChats = action.payload.privateChats;
        },

        // add a new private chat
        addPrivateChat: (state, action)=>
        {
            state.privateChats.unshift(action.payload.privateChat);
        },

        // method to add a new message in a private chat by index
        addPrivateChatMessage: (state, action)=>
        {
            state.privateChats[action.payload.index].messages.unshift(action.payload.message);
        }

    }
});

export default privateChatsSlice.reducer;

export const {setPrivateChats, addPrivateChat, addPrivateChatMessage} = privateChatsSlice.actions;