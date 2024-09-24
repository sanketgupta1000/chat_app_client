import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    privateChats: []
    // one object in array will have following fields:
    // privateChatId, user1Id, user1Name, user2Id, user2Name, lastMsg, lastMsgSenderId,
    // and an array of messages
    // each message contains following info
    // messageId, content, senderId, sentDateTime, status, statusDateTIme
};

// dummy
// const initialState = {
//     privateChats: [
//         {
//             privateChatId: "p1",
//             user1Id: "jdfndjA165464SDJBFDJNSDJFN",
//             user1Name: "Sanket Gupta",
//             // user1Email: "sanketgupta1000@gmail.com",
//             user2Id: "user2",
//             user2Name: "Sumit Gohil",
//             // user2Email: "gohilsumit15@gmail.com",
//             lastMsg: "Hi Sanket!",
//             lastMsgSenderId: "user2",
//             messages: []

//         },
//         {
//             privateChatId: "p2",
//             user1Id: "jdfndjA165464SDJBFDJNSDJFN",
//             user1Name: "Sanket Gupta",
//             // user1Email: "sanketgupta1000@gmail.com",
//             user2Id: "user3",
//             user2Name: "Harshpalsinh Zala",
//             // user2Email: "abc123@gmail.com",
//             lastMsg: "Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!",
//             lastMsgSenderId: "jdfndjA165464SDJBFDJNSDJFN",
//             messages: []

//         },
//         {
//             privateChatId: "p3",
//             user1Id: "jdfndjA165464SDJBFDJNSDJFN",
//             user1Name: "Sanket Gupta",
//             // user1Email: "sanketgupta1000@gmail.com",
//             user2Id: "user3",
//             user2Name: "Harshpalsinh Zala",
//             // user2Email: "abc123@gmail.com",
//             lastMsg: "Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!",
//             lastMsgSenderId: "jdfndjA165464SDJBFDJNSDJFN",
//             messages: []

//         },
//         {
//             privateChatId: "p4",
//             user1Id: "jdfndjA165464SDJBFDJNSDJFN",
//             user1Name: "Sanket Gupta",
//             // user1Email: "sanketgupta1000@gmail.com",
//             user2Id: "user3",
//             user2Name: "Harshpalsinh Zala",
//             // user2Email: "abc123@gmail.com",
//             lastMsg: "Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!",
//             lastMsgSenderId: "jdfndjA165464SDJBFDJNSDJFN",
//             messages: []

//         },
//         {
//             privateChatId: "p5",
//             user1Id: "jdfndjA165464SDJBFDJNSDJFN",
//             user1Name: "Sanket Gupta",
//             // user1Email: "sanketgupta1000@gmail.com",
//             user2Id: "user3",
//             user2Name: "Harshpalsinh Zala",
//             // user2Email: "abc123@gmail.com",
//             lastMsg: "Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!",
//             lastMsgSenderId: "jdfndjA165464SDJBFDJNSDJFN",
//             messages: []

//         },
//         {
//             privateChatId: "p6",
//             user1Id: "jdfndjA165464SDJBFDJNSDJFN",
//             user1Name: "Sanket Gupta",
//             // user1Email: "sanketgupta1000@gmail.com",
//             user2Id: "user3",
//             user2Name: "Harshpalsinh Zala",
//             // user2Email: "abc123@gmail.com",
//             lastMsg: "Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!Hey there Harshpal!",
//             lastMsgSenderId: "jdfndjA165464SDJBFDJNSDJFN",
//             messages: []

//         }
//     ]
//     // one object in array will have following fields:
//     // privateChatId, user1Id, user1Name, user1Email, user2Id, user2Name, user2Email, lastMsg, lastMsgSenderId,
//     // and an array of messages
//     // each message contains following info
//     // messageId, content, senderId, sentDateTime, status, statusDateTIme
// };

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
            state.privateChats[action.payload.index].messages.push(action.payload.message);
        }

    }
});

export default privateChatsSlice.reducer;

export const {setPrivateChats, addPrivateChat, addPrivateChatMessage} = privateChatsSlice.actions;