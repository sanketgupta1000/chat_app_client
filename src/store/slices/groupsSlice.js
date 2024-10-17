import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groups:[]
    // each object in the array will have:
    // groupId, groupName, groupImgSrc, groupDescription, adminId, lastMsg, lastMsgSenderId, messages[], members[]
    // each object of members[] will have
    // memberId, memberName
    // each object in messages[] will have
    // senderId, senderName, sentDateTime, content
};

const groupSlice = createSlice(
    {
        name: "group",
        initialState,
        reducers: {

            // method to set groups
            setGroups: (state, action)=>
            {
                state.groups = action.payload.groups;
            },

            // add a group
            addGroup: (state, action)=>
            {
                state.groups.unshift(action.payload.group);
            },

            // add message to a group by index
            addGroupMessage: (state, action)=>
            {
                state.groups[action.payload.index].messages.unshift(action.payload.message);
            },

            // method to add older message in a group chat by index
            addOlderGroupChatMessage: (state, action)=>
            {
                state.groups[action.payload.index].messages.push(action.payload.message);
            },

            // method to add newer message in a private chat by index
            addNewerGroupChatMessage: (state, action)=>
            {
                state.groups[action.payload.index].messages.unshift(action.payload.message);
                // update last message
                state.groups[action.payload.index].lastMsg = action.payload.message.content;
                state.groups[action.payload.index].lastMsgSenderId = action.payload.message.senderId;
            }

        }
    }
);

export default groupSlice.reducer;

export const {setGroups, addGroup, addGroupMessage, addOlderGroupChatMessage, addNewerGroupChatMessage} = groupSlice.actions;