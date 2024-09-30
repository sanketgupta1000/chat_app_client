import { setReceivedRequests, addReceivedRequest, removeReceivedRequest } from "./friendshipRequestsSlice"
import friendshipRequestsReducer from "./friendshipRequestsSlice";

import { setGroups, addGroup, addGroupMessage } from "./groupsSlice";
import groupsReducer from "./groupsSlice";

import { setPrivateChats, addPrivateChat, addNewerChatMessage, addOlderChatMessage } from "./privateChatsSlice";
import privateChatsReducer from "./privateChatsSlice";

import { login, logout } from "./userSlice";
import userReducer from "./userSlice"

export {
    setReceivedRequests,
    addReceivedRequest,
    removeReceivedRequest,
    friendshipRequestsReducer,
    setGroups,
    addGroup,
    addGroupMessage,
    groupsReducer,
    setPrivateChats,
    addPrivateChat,
    addNewerChatMessage,
    addOlderChatMessage,
    privateChatsReducer,
    login,
    logout,
    userReducer
};