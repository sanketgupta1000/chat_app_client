import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserAvatar from '../components/ui/UserAvatar';
import ChatBubble from '../components/ui/ChatBubble';
import Input from '../components/input/Input';
import Button from '../components/input/Button';
import PrivateChatService from '../../services/privateChatService';
import { addPrivateChatMessage } from '../../store/slices/privateChatsSlice';
import toast from 'react-hot-toast';


function PrivateChatPane()
{

    // get the private chat index from the url
    const privateChatIndex = useParams().privateChatIndex;

    // get the private chat from the store
    const privateChat = useSelector((state)=>state.privateChats.privateChats[privateChatIndex]);

    // get the current user's id from the store
    const currentUserId = useSelector((state)=>state.user.userId);

    // get the other user's id
    const otherUserId = privateChat.user1Id === currentUserId ? privateChat.user2Id : privateChat.user1Id;

    // get the other user's name
    const otherUserName = privateChat.user1Id === currentUserId ? privateChat.user2Name : privateChat.user1Name;

    const jwt = useSelector((state)=>state.user.token);

    const isFetching = useRef(false);

    const dispatch = useDispatch();

    // to fetch older messages when user scrolls up
    const handleScroll = (e)=>
    {
        if((!isFetching.current) && (e.target.scrollTop === 0))
        {
            // start fetching
            isFetching.current = true;

            // fetch older messages
            const privateChatService = new PrivateChatService();
            privateChatService
            .getMessages({
                jwt: jwt,
                privateChatId: privateChat.privateChatId,
                offset: privateChat.messages.length,
                limit: 10
            })
            .then((messages)=>
            {
                messages.forEach((m)=>
                {
                    dispatch(
                        addPrivateChatMessage({
                            index: privateChatIndex,
                            message: {
                                messageId: m.id,
                                content: m.message,
                                senderId: m.sender_id,
                                sentDateTime: m.sent_date_time,
                                status: m.status,
                                statusDateTime: m.status_time
                            }
                        })
                    );
                })
            })
            .catch((e)=>
            {
                console.log(e);
                // show in toast
                toast.error("Failed to fetch older messages");
            })
            .finally(()=>
            {
                // done fetching
                isFetching.current = false;
            });
        }
    }

    return (

        <div>

            {/* user avatar */}
            <UserAvatar
                userId={otherUserId}
                name={otherUserName}
                imgSrc={"https://placehold.jp/100x100.png"}
                rounded={false}
                className='absolute top-0 w-full'       
            />

            {/* chatbubbles */}
            <div className="my-14 h-[90vh] overflow-scroll flex flex-col-reverse" onScroll={handleScroll}>

                {privateChat.messages.map((message)=>
                {
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const msgDate = new Date(message.sentDateTime);
                    const msgDateString = `${msgDate.getDate()} ${monthNames[msgDate.getMonth()]}`;
                    const msgTimeString = `${msgDate.getHours()}:${msgDate.getMinutes()}`;

                    const statusDate = new Date(message.statusDateTime);
                    const statusDateString = `${statusDate.getDate()} ${monthNames[statusDate.getMonth()]}`;
                    const statusTimeString = `${statusDate.getHours()}:${statusDate.getMinutes()}`;
                    return (

                        <ChatBubble

                            key={message.messageId}
                            message={message.content}
                            messageDate={msgDateString}
                            messageTime={msgTimeString}
                            direction={message.senderId === currentUserId ? 'right' : 'left'}
                            status={message.status}
                            statusDate={statusDateString}
                            statusTime={statusTimeString}

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
                />

                <Button
                    onClick={()=>
                        {
                            console.log("Send button clicked");
                        }
                    }
                >
                    Send
                </Button>

            </div>

        </div>

    );

}

export default PrivateChatPane;