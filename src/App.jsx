import { useEffect, useState } from "react"
import LoadingSpinner from "./ui/components/ui/LoadingSpinner"
import AllChatsPane from "./ui/panes/AllChatsPane"
import { useDispatch, useSelector } from "react-redux";
import AuthService from "./services/authService";
import { addGroup, addNewerChatMessage, addNewerGroupChatMessage, addPrivateChat, addReceivedRequest, login, logout, setGroups, setPrivateChats, setReceivedRequests } from "./store/slices";
import { Outlet, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PrivateChatService from "./services/privateChatService";
import GroupChatService from "./services/groupChatService";
import FriendshipRequestService from "./services/friendshipRequestService";
import useSocket from "./hooks/useSocket";
import { handleErrorsAfterLogin } from "./utils/errors/handlers";

function App() {

    const [isLoading, setLoading] = useState(true);

    // get jwt
    const {token, isLoggedIn} = useSelector(state=>state.user);
// console.log(token);
    const dispatch = useDispatch();

    // socket
    const {connectSocket, socketOn, removeListeners, isSocketConnected, disconnectSocket} = useSocket();

    const privateChats = useSelector(state=>state.privateChats.privateChats);

    const groups = useSelector(state => state.groups.groups);

    const navigate = useNavigate();

    // fetch user after first render
    useEffect(()=>
    {

        setLoading(true);

        if(token)
        {
            // token exists

            // try to get user
            const authService = new AuthService();

            authService
            .getCurrentUser(token)
            .then((user)=>
            {
                // got user, save
                dispatch(login({
                    token: token,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email
                }));
            })
            .then(()=>
            {
                // fetch private chats
                const privateChatService = new PrivateChatService();
                return privateChatService.getAllPrivateChats(token);
            })
            .then((privateChats)=>
            {
                privateChats = privateChats.map(((chat)=>{
                    return {
                        privateChatId: chat.id,
                        user1Id: chat.user1_id,
                        user2Id: chat.user2_id,
                        user1Name: chat.user1_name,
                        user2Name: chat.user2_name,
                        lastMsg: chat.last_msg,
                        lastMsgSenderId: chat.last_msg_sender_id,
                        messages: []
                    };
                }));

                console.log(privateChats);

                // set private chats
                dispatch(setPrivateChats({
                    privateChats: privateChats
                }));

            })
            .then(()=>
            {
                // fetch groups
                const groupChatService = new GroupChatService();
                return groupChatService.getAllGroupChats(token);
            })
            .then((groups)=>
            {
                groups = groups.map((group)=>
                {
                    return {
                        groupId: group.id,
                        groupName: group.group_name,
                        groupImgSrc: "https://placehold.jp/100x100.png",
                        groupDescription: group.group_description,
                        adminId: group.admin_id,
                        lastMsg: group.last_msg,
                        lastMsgSenderId: group.last_msg_sender_id,
                        messages: [],
                        members: group.members.map((member)=>
                        {
                            return {
                                memberId: member.id,
                                memberName: member.name
                            };
                        })
                    };
                });

                console.log(groups);

                // set groups
                dispatch(setGroups({
                    groups: groups
                }));
            })
            .then(()=>
            {
                // fetch friendship requests
                const friendshipRequestService = new FriendshipRequestService();
                return friendshipRequestService.getReceivedFriendshipRequests(token);
            })
            .then((requests)=>
            {
                requests = requests.map((req)=>
                {
                    return {
                        requestId: req.id,
                        senderId: req.sender_id,
                        senderName: req.sender_name,
                        senderEmail: req.sender_email,
                        matchingInterests: req.matching_interests.map((mi)=>
                        {
                            return {
                                interestId: mi.id,
                                interestName: mi.name
                            };
                        }),
                        rating: req.sender_avg_rating
                    }
                });

                console.log(requests);

                // set received requests
                dispatch(setReceivedRequests({
                    receivedFriendshipRequests: requests
                }));
            })
            .catch((err)=>
            {
                console.log(err);
                // show in a toast
                handleErrorsAfterLogin(err, navigate);
            })
            .finally(()=>
            {
                setLoading(false);
            });

        }
        else
        {
            // token doesn't exist
            // clear data
            dispatch(setPrivateChats({
                privateChats: []
            }));
            dispatch(setGroups({
                groups: []
            }));
            dispatch(setReceivedRequests({
                receivedFriendshipRequests: []
            }));
            dispatch(logout());
            setLoading(false);
        }

    }, [token]);


    // another useEffect to connect/disconnect socket on login and logout
    useEffect(()=>
    {

        if(isLoggedIn)
        {
            // connect socket
            connectSocket({jwt: token});
        }
        else
        {
            // disconnect socket
            disconnectSocket();
        }

        // cleanup
        return ()=>
        {
            disconnectSocket();
        }

    }, [isLoggedIn]);

    // useEffect to add or remove event listeners when socket connection changes
    useEffect(()=>
    {

        if(isSocketConnected)
        {
            // add event listeners

            // whenever a friendship request comes, add it to store
            socketOn("new friendship request", ({request})=>
            {
                console.log("new friendship request received from: "+request.sender_id);
                dispatch(addReceivedRequest({
                    receivedRequest: {
                        requestId: request.id,
                        senderId: request.sender_id,
                        senderName: request.sender_name,
                        senderEmail: request.sender_email,
                        matchingInterests: request.matching_interests.map((mi)=>
                            {
                                return {
                                    interestId: mi.id,
                                    interestName: mi.name
                                };
                            }),
                        rating: request.sender_avg_rating
                    }
                }));
            });

            // whenever a new private chat is created (new friend), add it to store
            socketOn("new private chat", (privateChat)=>
            {
                dispatch(addPrivateChat({
                    privateChat: {
                        privateChatId: privateChat.id,
                        user1Id: privateChat.user1_id,
                        user1Name: privateChat.user1_name,
                        user2Id: privateChat.user2_id,
                        user2Name: privateChat.user2_name,
                        lastMsgSenderId: privateChat.last_msg_sender_id,
                        lastMsg: privateChat.last_msg,
                        messages: []
                    }
                }));
            });

            socketOn("new private chat message", (privateChatMsg)=>
            {
                console.log("new private chat message received from: "+privateChatMsg.sender_id);
                console.log(privateChatMsg);
                // find index of the private chat
                console.log(privateChats);
                const privateChatIndex = privateChats.findIndex((chat)=>
                {
                    console.log("chat.privateChatId: "+chat.privateChatId);
                    return chat.privateChatId == privateChatMsg.private_chat_id;
                });

                console.log("privateChatIndex: "+privateChatIndex);

                if(privateChatIndex != -1)
                {
                    console.log("private chat found");
                    // private chat found
                    // add message
                    dispatch(addNewerChatMessage({
                        index: privateChatIndex,
                        message: {
                            messageId: privateChatMsg.id,
                            content: privateChatMsg.message,
                            senderId: privateChatMsg.sender_id,
                            sentDateTime: privateChatMsg.sent_date_time,
                            status: privateChatMsg.status,
                            statusDateTime: privateChatMsg.status_time
                        }
                    }));
                }
            });

            // whenever a new group is created, add it to store
            socketOn("new group", (newGroup)=>
            {
                console.log("new group created: "+newGroup.group_name);
                dispatch(addGroup({
                    group: {
                        groupId: newGroup.id,
                        groupName: newGroup.group_name,
                        groupImgSrc: "https://placehold.jp/100x100.png",
                        groupDescription: newGroup.group_description,
                        adminId: newGroup.admin_id,
                        lastMsg: newGroup.last_msg,
                        lastMsgSenderId: newGroup.last_msg_sender_id,
                        messages: [],
                        members: newGroup.members.map((member)=>
                        {
                            return {
                                memberId: member.id,
                                memberName: member.name
                            };
                        })
                    }
                }));
            });

            socketOn("new group message", (newGroupChat) =>
            {
                console.log("new group chat message receieved from: " + newGroupChat.sender_id);
                
                console.log(groups);

                const groupChatIndex = groups.findIndex((group) =>
                {
                    return group.groupId == newGroupChat.group_id;
                });

                console.log("groupChatIndex: " + groupChatIndex);

                if(groupChatIndex != -1)
                {

                    dispatch(addNewerGroupChatMessage({
                        index: groupChatIndex,
                        message: {
                            messageId: newGroupChat.id,
                            content: newGroupChat.message,
                            senderId: newGroupChat.sender_id,
                            sentDateTime: newGroupChat.sent_date_time,
                            senderName: newGroupChat.sender_name
                        }
                    }));
                }
            });
        }
        else
        {
            // remove event listeners
            removeListeners("new friendship request");
            removeListeners("new private chat");
            removeListeners("new private chat message");
            removeListeners("new group");
            removeListeners("new group message");
        }

        //  cleanup
        return ()=>
        {
            removeListeners("new friendship request");
            removeListeners("new private chat");
            removeListeners("new private chat message");
            removeListeners("new group");
            removeListeners("new group message");
        }

    }, [isSocketConnected, privateChats, groups]);



    return (
        
        <div>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
    
            {
            isLoading
            ?
            <LoadingSpinner/>
            :
            <Outlet/>
            }
        </div>

    );
}

export default App
