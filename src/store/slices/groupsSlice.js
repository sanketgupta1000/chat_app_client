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
            }

        }
    }
);

export default groupSlice.reducer;

export const {setGroups, addGroup, addGroupMessage} = groupSlice.actions;