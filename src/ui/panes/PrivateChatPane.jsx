import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import UserAvatar from '../components/ui/UserAvatar';
import ChatBubble from '../components/ui/ChatBubble';
import Input from '../components/input/Input';
import Button from '../components/input/Button';
import PrivateChatService from '../../services/privateChatService';
import { addNewerChatMessage, addOlderChatMessage } from '../../store/slices/privateChatsSlice';
import toast from 'react-hot-toast';
import { handleErrorsAfterLogin } from '../../utils/errors/handlers';


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

    //  ref for new message textarea
    const newMessageRef = useRef(null);

    // ref for chat bubbles container
    const chatBubblesRef = useRef(null);

    const navigate = useNavigate();

    // function to fetch messages
    const fetchMessages = useCallback(()=>
    {
        console.log("fetchMessages called. isFetching.current: "+isFetching.current);
        if((!isFetching.current))
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
                        addOlderChatMessage({
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
                handleErrorsAfterLogin(e, navigate);
            })
            .finally(()=>
            {
                // done fetching
                isFetching.current = false;
            });
        }
    }, [isFetching, jwt, privateChat, privateChatIndex, dispatch, addOlderChatMessage]);

    // to fetch older messages when user scrolls up
    const handleScroll = (e)=>
    {
        if(Math.abs(e.target.clientHeight - e.target.scrollTop - e.target.scrollHeight) <=1 )
        {
            fetchMessages();
        }
    }

    // useeffect to fetch after first render if no messages in privateChat.messages
    useEffect(()=>
    {
        if(privateChat.messages.length<10)
        {
            fetchMessages();
        }
    }, [privateChatIndex]);

    // to send a new message
    const sendMessage =useCallback(()=>
    {
        const message = newMessageRef.current.value;
        if(message.length>0)
        {

            // clear the textarea
            newMessageRef.current.value = "";

            const privateChatService = new PrivateChatService();
            privateChatService
            .sendMessage({
                jwt: jwt,
                privateChatId: privateChat.privateChatId,
                message: message
            })
            .then((message)=>
            {
                dispatch(
                    addNewerChatMessage({
                        index: privateChatIndex,
                        message: {
                            messageId: message.id,
                            content: message.message,
                            senderId: message.sender_id,
                            sentDateTime: message.sent_date_time,
                            status: message.status,
                            statusDateTime: message.status_time
                        }
                    })
                );
                
                // scroll to bottom
                // chatBubblesRef.current.scrollTop = 0;
            })
            .catch((e)=>
            {
                console.log(e);
                // restore textarea
                newMessageRef.current.value = message;
                handleErrorsAfterLogin(e, navigate);
            });
        }
    },[newMessageRef, jwt, privateChat, privateChatIndex, dispatch, addNewerChatMessage]);

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
            <div className="mt-[88px] mb-[96px] overflow-scroll flex flex-col-reverse" style={{ height: 'calc(100vh - 184px)' }} onScroll={handleScroll} ref={chatBubblesRef}>

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
                            status={(message.senderId===currentUserId)?message.status:null}
                            statusDate={(message.senderId===currentUserId)?statusDateString:null}
                            statusTime={(message.senderId===currentUserId)?statusTimeString:null}

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

export default PrivateChatPane;