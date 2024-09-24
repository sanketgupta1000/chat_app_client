import React, { useState } from 'react';
import UserAvatar from '../components/ui/UserAvatar';
import { useSelector } from 'react-redux';
import Button from '../components/input/Button';
import TabContainer from '../components/ui/TabContainer';
import TabBar from '../components/ui/TabBar';
import GroupAvatar from '../components/ui/GroupAvatar';
import UserModal from '../components/ui/UserModal';
function AllChatsPane() {

    // user id, and email from redux store
    const { userId, userEmail, userName } = useSelector(state => state.user);

    // state for tabs
    const [tab, setTab] = useState(1);

    let users = [
        {
            id: 1,
            email: "gohilsumit15@gmail.com",
            name: "Sumit Gohil",
        },
        {
            id: 2,
            email: "sanketgupta1000@gmail.com",
            name: "Sanket Gupta",
        },
        {
            id: 3,
            email: "darshit1234@gmail.com",
            name: "Darshit Talsaniya",
        },
        {
            id: 4,
            email: "devshah1203@gmail.com",
            name: "Dev Shah",
        },
        {
            id: 5,
            email: "milan7781@gmail.com",
            name: "Milan Vadhel",
        },
        {
            id: 6,
            email: "parth2606@gmail.com",
            name: "Parth Vasava",
        }
    ]
    // const [dummyUser, setDummyUser] = useState(users);

    // private chats
    const privateChats = useSelector(state => state.privateChats.privateChats);

    // groups
    const groups = useSelector(state => state.groups.groups);

    return (

        <div className='bg-base-300 h-screen w-full'>

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
                        // setDummyUser(users);
                        document.getElementById("findUserModal").showModal();
                    }
                    }
                >
                    Find New Users
                </Button>

                {/* Friend Suggestions Modal */}
                <UserModal id="findUserModal" header="Suggested users">
                    {
                        users.map((user) => (
                        <UserAvatar
                            key={user.id}
                            name={user.name}
                            imgSrc={"https://placehold.jp/100x100.png"}
                            email={user.email}
                            showSendRequestBtn={true}
                            rating={4.2}
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

                                to={`/private-chats/${index}`}

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
                        onClick={() => document.getElementById('frdReqModal').showModal()
                        }
                    >
                        Received Friendship Requests
                    </Button>
                    
                    {/* Friend Request Modal */}
                    <UserModal id="frdReqModal" header="Received Requests">
                        {
                            users.map((user) => (
                            <UserAvatar
                                key={user.id}
                                name={user.name}
                                imgSrc={"https://placehold.jp/100x100.png"}
                                email={user.email}
                                showRequestActions={true}
                            />
                            ))
                        }
                    </UserModal>
                </div>

            </div>

        </div>

    )

}

export default AllChatsPane;