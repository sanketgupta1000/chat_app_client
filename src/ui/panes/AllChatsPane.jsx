import React, { useState } from 'react';
import UserAvatar from '../components/ui/UserAvatar';
import { useSelector } from 'react-redux';
import Button from '../components/input/Button';
import TabContainer from '../components/ui/TabContainer';
import TabBar from '../components/ui/TabBar';
import GroupAvatar from '../components/ui/GroupAvatar';
import UserModal from '../components/ui/UserModal';
import FriendshipRequestService from '../../services/friendshipRequestService';
function AllChatsPane({
    className=""
})
{

    // user id, and email from redux store
    const { userId, userEmail, userName } = useSelector(state => state.user);
    // const suggestedUser = useSelector(state => state.friendshipRequests);
    const jwt = useSelector(state=>state.user.token);
    // state for tabs
    const [tab, setTab] = useState(1);

    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const [frndRequests, setFrndRequests] = useState([]);
    // private chats
    const privateChats = useSelector(state => state.privateChats.privateChats);

    // groups
    const groups = useSelector(state => state.groups.groups);

    return (

        <>

            {/* to display user's profile */}
            <div className='flex flex-row items-center justify-evenly flex-wrap pt-4'>

                <UserAvatar
                    name={userName}
                    userId={userId}
                    email={userEmail}
                    imgSrc={"https://placehold.jp/100x100.png"}

                />

                <Button
                    onClick={() => {
                            const friendshipRequestService = new FriendshipRequestService();

                            friendshipRequestService.getSuggestedUsers(jwt)
                            .then((users) => 
                            {
                                setSuggestedUsers(users);
                            })
                            document.getElementById("findUserModal").showModal();
                        }
                    }
                >
                    Find New Users
                </Button>

                {/* Friend Suggestions Modal */}
                <UserModal id="findUserModal" header="Suggested users">
                    {
                        suggestedUsers.length == 0
                        ?
                        <div>
                            No Users with Matching Interests.
                        </div>
                        :
                        suggestedUsers.map((user) => (
                        <UserAvatar
                            key={user.id}
                            userId={user.id}
                            name={user.name}
                            imgSrc={"https://placehold.jp/100x100.png"}
                            email={user.email}
                            showSendRequestBtn={true}
                            rating={user.avg_rating}
                            modalId="findUserModal"
                        />
                        ))
                    }
                </UserModal>
            </div>

            {/* to display list of chatboxes */}
            <div className='p-3 lg:p-4'>

                {/* tabs */}
                <TabContainer>

                    <TabBar
                        tabName={"Chats"}
                        tabActive={tab == 1}
                        setTabActive={() => setTab(1)}
                    />

                    <TabBar
                        tabName={"Groups"}
                        tabActive={tab == 2}
                        setTabActive={() => setTab(2)}
                    />

                </TabContainer>

                {/* chatboxes */}

                {/* private chats */}
                {
                    tab == 1 &&

                    <div className='rounded-md overflow-scroll max-h-[55vh]'>

                        {privateChats.map((privateChat, index) =>
                        (
                            <UserAvatar

                                key={privateChat.privateChatId}

                                userId={privateChat.user1Id == userId
                                    ?
                                    privateChat.user2Id
                                    :
                                    privateChat.user1Id
                                }

                                name={privateChat.user1Id == userId
                                    ?
                                    privateChat.user2Name
                                    :
                                    privateChat.user1Name
                                }

                                imgSrc={"https://placehold.jp/100x100.png"}

                                lastMessage={privateChat.lastMsg
                                    ?
                                    privateChat.lastMsg
                                    :
                                    null
                                }

                                lastMessageFrom={
                                    privateChat.lastMsgSenderId ?
                                        (
                                            privateChat.lastMsgSenderId == privateChat.user1Id
                                                ?
                                                privateChat.user1Name
                                                :
                                                privateChat.user2Name
                                        )
                                        :
                                        null
                                }

                                to={`/home/private-chats/${index}`}

                            />
                        ))}

                    </div>

                }

                {/* groups */}
                {
                    tab == 2 &&
                    <div className='rounded-md overflow-scroll max-h-[55vh]'>

                        {groups.map((group, index) =>
                        (
                            <GroupAvatar

                                key={group.groupId}

                                groupId={group.groupId}

                                groupName={group.groupName}

                                imgSrc={"https://placehold.jp/100x100.png"}

                                lastMessage={group.lastMsg
                                    ?
                                    group.lastMsg
                                    :
                                    null
                                }

                                lastMessageFrom={
                                    group.lastMsgSenderId ?
                                        (
                                            (group.members.find((m) => m.memberId == group.lastMsgSenderId)).memberName
                                        )
                                        :
                                        null
                                }

                                memberNames={group.members.map((m) => m.memberName)}

                                to={`/group-chats/${index}`}

                            />
                        ))}

                    </div>
                }

                <div className='mt-4 md:mt-4 lg:mt-10 w-fit mx-auto'>
                    {/* button to see received requests */}
                    <Button
                        onClick={() => 
                            {
                                const friendshipRequestService = new FriendshipRequestService()
                                friendshipRequestService.getReceivedFriendshipRequests(jwt)
                                .then((frndReqs) => {
                                    console.log(frndReqs);
                                    setFrndRequests(frndReqs);
                                })
                                document.getElementById('frdReqModal').showModal()
                            }
                        }
                    >
                        Received Friendship Requests
                    </Button>
                    
                    {/* Friend Request Modal */}
                    <UserModal id="frdReqModal" header="Received Requests">
                        {
                            frndRequests.length == 0 
                            ? 
                            <div>
                                No Friend Requeest yet...
                            </div> 
                            :
                            frndRequests.map((reqs) => (
                                <UserAvatar
                                    key={reqs.id}
                                    requestId={reqs.id}
                                    userId={userId}
                                    name={reqs.sender_name}
                                    imgSrc={"https://placehold.jp/100x100.png"}
                                    email={reqs.sender_email}
                                    showRequestActions={true}
                                    modalId="frdReqModal"
                                />
                            ))
                        }
                    </UserModal>
                </div>

            </div>

        </>

    )

}

export default AllChatsPane;