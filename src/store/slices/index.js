import { setReceivedRequests, addReceivedRequest, removeReceivedRequest } from "./friendshipRequestsSlice"
import friendshipRequestsReducer from "./friendshipRequestsSlice";

import { setGroups, addGroup, addGroupMessage, addOlderGroupChatMessage, addNewerGroupChatMessage } from "./groupsSlice";
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
    addOlderGroupChatMessage,
    addNewerGroupChatMessage,
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