import React, { useState } from 'react';
import UserAvatar from '../components/ui/UserAvatar';
import { useSelector } from 'react-redux';
import Button from '../components/input/Button';
import TabContainer from '../components/ui/TabContainer';
import TabBar from '../components/ui/TabBar';
import GroupAvatar from '../components/ui/GroupAvatar';

function AllChatsPane()
{

    // user id, and email from redux store
    const {userId, userEmail, userName} = useSelector(state=>state.user);
    
    // state for tabs
    const [tab, setTab] = useState(1);

    // private chats
    const privateChats = useSelector(state=>state.privateChats.privateChats);

    // groups
    const groups = useSelector(state=>state.groups.groups);

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
                    onClick={()=>
                        {
                            console.log("Find New Users button clicked");
                        }
                    }
                >
                    Find New Users
                </Button>

            </div>

            {/* to display list of chatboxes */}
            <div className='p-3 lg:p-4'>

                {/* tabs */}
                <TabContainer>

                    <TabBar
                        tabName={"Chats"}
                        tabActive={tab==1}
                        setTabActive={()=>setTab(1)}
                    />

                    <TabBar
                        tabName={"Groups"}
                        tabActive={tab==2}
                        setTabActive={()=>setTab(2)}
                    />

                </TabContainer>

                {/* chatboxes */}
                
                {/* private chats */}
                {
                tab==1 && 

                <div className='rounded-md overflow-scroll max-h-[55vh]'>

                    {privateChats.map((privateChat, index)=>
                    (
                        <UserAvatar
                        
                            key={privateChat.privateChatId}

                            userId={privateChat.user1Id==userId
                                ?
                                privateChat.user2Id
                                :
                                privateChat.user1Id
                            }

                            name={privateChat.user1Id==userId
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
                                privateChat.lastMsgSenderId?
                                (
                                    privateChat.lastMsgSenderId==privateChat.user1Id
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
                tab==2 &&
                <div className='rounded-md overflow-scroll max-h-[55vh]'>

                    {groups.map((group, index)=>
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
                                group.lastMsgSenderId?
                                (
                                    (group.members.find((m)=>m.memberId==group.lastMsgSenderId)).memberName
                                )
                                :
                                null
                            }

                            memberNames={group.members.map((m)=>m.memberName)}

                            to={`/group-chats/${index}`}

                        />
                    ))}

                </div>
                }

                <div className='mt-4 md:mt-4 lg:mt-10 w-fit mx-auto'>
                    {/* button to see received requests */}
                    <Button
                        onClick={()=>
                        {
                            console.log("Received Friendship Requests button clicked")
                        }
                        }
                    >
                        Received Friendship Requests
                    </Button>
                </div>

            </div>

        </div>

    )

}

export default AllChatsPane;