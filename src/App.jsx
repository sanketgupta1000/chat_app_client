import { useEffect, useState } from "react"
import LoadingSpinner from "./ui/components/ui/LoadingSpinner"
import AllChatsPane from "./ui/panes/AllChatsPane"
import { useDispatch, useSelector } from "react-redux";
import AuthService from "./services/authService";
import { login, setGroups, setPrivateChats, setReceivedRequests } from "./store/slices";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PrivateChatService from "./services/privateChatService";
import GroupChatService from "./services/groupChatService";
import FriendshipRequestService from "./services/friendshipRequestService";

function App() {

    const [isLoading, setLoading] = useState(true);

    // get jwt
    const token = useSelector(state=>state.user.token);
// console.log(token);
    const dispatch = useDispatch();

    // fetch user after first render
    useEffect(()=>
    {

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
                toast.error("Failed to fetch data");
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
            setLoading(false);
        }

    }, [token]);

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
