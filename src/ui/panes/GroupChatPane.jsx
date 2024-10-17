import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import GroupChatService from '../../services/groupChatService';
import { addNewerGroupChatMessage, addOlderGroupChatMessage } from '../../store/slices/groupsSlice';
import ChatBubble from '../components/ui/ChatBubble';
import UserAvatar from '../components/ui/UserAvatar';
import Input from '../components/input/Input';
import Button from '../components/input/Button';
import toast from 'react-hot-toast';
function GroupChatPane()
{
    // get the group chat index from params
    const groupChatIndex = useParams().groupChatIndex;

    // get the group from the store
    const group = useSelector((state) => state.groups.groups[groupChatIndex]);
    
    // get the current user id
    const currentUserId = useSelector((state)=>state.user.userId);

    // get the group id and name
    const groupId = group.groupId;
    const groupName = group.groupName;

    const jwt = useSelector((state)=>state.user.token);

    const isFetching = useRef(false);

    const dispatch = useDispatch();

    //  ref for new message textarea
    const newMessageRef = useRef(null);

    // ref for chat bubbles container
    const chatBubblesRef = useRef(null);

    const fetchMessages = useCallback(() => {
        console.log("fetchMessages called. isFetching.current: "+isFetching.current);
        if((!isFetching.current))
        {
            isFetching.current = true;

            // fetch older messages
            const groupChatService = new GroupChatService();
            console.log("fetching");
            groupChatService.getMessages({
                jwt: jwt,
                groupId: groupId,
                offset: group.messages.length,
                limit: 10
            })
            .then((messages) => 
            {
                messages.forEach((m)=>
                {
                    dispatch(
                        addOlderGroupChatMessage({
                            index: groupChatIndex,
                            message: {
                                messageId: m.id,
                                content: m.message,
                                senderId: m.sender_id,
                                sentDateTime: m.sent_date_time,
                                senderName: m.sender_name
                            }
                        })
                    );
                })
            })
            .catch((err) => {
                console.log(err);
                // show in toast
                toast.error("Failed to fetch older messages");
            })
            .finally(() => {
                isFetching.current = false;
            })
        }
    }, [isFetching, jwt, group, groupChatIndex, dispatch, addOlderGroupChatMessage]);

    // to fetch older messages when user scrolls up
    const handleScroll = (e)=>
    {
        if(Math.abs(e.target.clientHeight - e.target.scrollTop - e.target.scrollHeight) <=1 )
        {
            fetchMessages();
        }
    }

    // useeffect to fetch after first render if no messages in group.messages
    useEffect(()=>
    {
        if(group.messages.length === 0)
        {
            fetchMessages();
        }
    },[groupChatIndex]);

    // to send a message in group
    const sendMessage = useCallback(() => 
    {
        const message = newMessageRef.current.value;
        if(message.length > 0)
        {
            newMessageRef.current.value = "";

            const groupChatService = new GroupChatService();
            groupChatService.sendMessage({
                jwt: jwt,
                groupId: groupId,
                message: message
            })
            .then((group_chat) =>
            {
                console.log(group_chat);
                dispatch(
                    addNewerGroupChatMessage({
                        index: groupChatIndex,
                        message: {
                            messageId: group_chat.id,
                            senderId: group_chat.sender_id,
                            senderName: group_chat.sender_name,
                            sentDateTime: group_chat.sent_date_time,
                            content: group_chat.message
                        }
                    })
                );
            })
            .catch((err) => 
            {
                console.log(err);
                // restore textarea
                newMessageRef.current.value = message;
                // show in toast
                toast.error("Failed to send message");
            });
        }
    },[newMessageRef, jwt, group, groupChatIndex, dispatch, addNewerGroupChatMessage]);

    return (
        <div>
            {/* user avatar */}
            <UserAvatar
                userId={groupId}
                name={groupName}
                imgSrc={"https://placehold.jp/100x100.png"}
                rounded={false}
                className='absolute top-0 w-full'       
            />
            
            {/* chatbubbles */}
            <div className="my-20 h-[75vh] overflow-scroll flex flex-col-reverse" onScroll={handleScroll} ref={chatBubblesRef}>
                
                {group.messages.map((m) => 
                {
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const msgDate = new Date(m.sentDateTime);
                    const msgDateString = `${msgDate.getDate()} ${monthNames[msgDate.getMonth()]}`;
                    const msgTimeString = `${msgDate.getHours()}:${msgDate.getMinutes()}`;

                    return (

                        <ChatBubble

                            key={m.messageId}
                            message={m.content}
                            messageDate={msgDateString}
                            messageTime={msgTimeString}
                            direction={m.senderId === currentUserId ? 'right' : 'left'}
                            senderName={m.senderName}

                        />

                    );
                })}

            </div>

            {/* input for sending new message */}
            <div className="flex flex-row w-full absolute bottom-0">

                <Input
                    type="textarea"
                    placeholder="Type a message..."
                    className="w-[90%]"
                    ref={newMessageRef}
                />

                <Button
                    onClick={sendMessage}
                >
                    Send
                </Button>

            </div>
        </div>
    );
}

export default GroupChatPane;

