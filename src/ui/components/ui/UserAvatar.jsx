import React from 'react'
import Button from '../input/Button';
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import FriendshipRequestService from '../../../services/friendshipRequestService';
import PrivateChatService from '../../../services/privateChatService';
import toast from "react-hot-toast";
import { setPrivateChats } from '../../../store/slices';

// a general component to display user
// will be used to: display the current user's profile on top of leftsidepane, display the private chats, group members, user's preview as a suggested user , etc
function UserAvatar({

    userId,
    requestId,
    name,
    imgSrc,
    email,
    lastMessage,
    lastMessageFrom,
    matchingInterests,
    rating,
    showSendRequestBtn = false,
    showRequestActions = false,
    rounded=true,
    isLink = true,
    to,
    className="",
    modalId,
})
{
    const jwt = useSelector(state=>state.user.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function closeModal()
    {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.close();  // Close the modal
        }
    }

    function respondRequest(requestId, response)
    {
        const friendshipRequestService = new FriendshipRequestService();
        const privateChatService = new PrivateChatService();
        friendshipRequestService.respondToFriendshipRequest({jwt: jwt, requestId: requestId, response: response})
        .then(() => {
            closeModal();
            navigate(`/home/users/${userId}`);
            if(response)
            {
                // Response accepted so getting all chats including new private chat.
                privateChatService.getAllPrivateChats(jwt).then((privateChats) => {
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
                    dispatch(setPrivateChats({
                        privateChats: privateChats
                    }));
                });
                toast.success("Request Accepted !");
            }
            else
                toast.success("Request Rejectd !");
        })
    }

    const UserCard = (

        <div className={`card card-side flex-wrap bg-base-100 ${rounded?"":"rounded-none"} p-3 justify-between ${isLink?"hover:bg-base-200":""} ${className}`}>

            {/* user image, name, and email or message */}
            <div className='flex flex-row items-center justify-between'>
                <div className='avatar'>
                    <div className='w-16 rounded-full'>
                        <img src={imgSrc} alt={`${name}'s Profile Photo`} />
                    </div>
                </div>

                <div className='ms-3'>
                    <div className='font-bold'>{name}</div>

                    {
                    email &&
                    <div className='text-sm text-gray-500'>{email}</div>
                    }

                    {
                    lastMessage &&
                    <div className='text-sm text-gray-500'>
                        {lastMessageFrom}: {lastMessage}
                    </div>
                    }

                </div>

            </div>

            {/* matching interests */}
            {
            matchingInterests &&
            <div className='mt-2 text-sm text-gray-500'>
                Matching Interests: {matchingInterests.toString()}
            </div>
            }

            {/* rating */}
            {
            rating &&
            <div className='mt-2'>
                <span className='text-sm text-gray-500'>Rating: </span>
                <span className='text-yellow-500'>{rating} / 5 ⭐</span>
            </div>
            }

            {/* accept and reject buttons for request */}
            {
            showRequestActions && 
            <div className='flex justify-end mt-4'>
                <Button
                    className="me-2"
                    onClick={(e)=>
                    {
                        // dummy method for now
                        // TODO: use the service there
                        e.stopPropagation();
                        e.preventDefault();
                        respondRequest(requestId, true);
                        
                        console.log("Accepting request: "+requestId);
                    }
                    }
                >Accept</Button>

                <Button
                    colour='secondary'
                    onClick={(e)=>
                    {
                        e.stopPropagation();
                        e.preventDefault();
                        respondRequest(requestId, false);
                        console.log("Rejecting request: "+requestId);
                    }
                    }

                >
                    Reject
                </Button>

            </div>
            }

            {/* send request button */}
            {
            showSendRequestBtn && 
            <div className='flex mt-4'>
                <Button
                    onClick={(e)=>
                    {
                        e.stopPropagation();
                        e.preventDefault();
                        const friendshipRequestService = new FriendshipRequestService();
                        friendshipRequestService.sendFriendshipRequest({jwt: jwt,receiverId: userId})
                        .then((res) => {
                            console.log(res);
                            closeModal();
                            toast.success("Request Sent successfully!");
                        });
                    }
                    }
                >
                    Send Request
                </Button>
            </div>
            }

        </div>

    );

    return (

      (isLink?
        <Link to={to?to:`/home/users/${userId}`}>

            {UserCard}

        </Link>
        :
        {UserCard}
      )

    );

}


export default UserAvatar;