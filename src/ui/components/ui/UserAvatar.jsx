import React, { useState } from 'react'
import Button from '../input/Button';
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import FriendshipRequestService from '../../../services/friendshipRequestService';
import PrivateChatService from '../../../services/privateChatService';
import toast from "react-hot-toast";
import { removeReceivedRequest, setPrivateChats } from '../../../store/slices';
import LoadingSpinner from './LoadingSpinner';

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

    const receivedFriendshipRequests = useSelector(state=>state.friendshipRequests.receivedFriendshipRequests);

    // is the request being responded to?
    const [isResponding, setResponding] = useState(false);
    const [respondingMsg, setRespondingMsg] = useState("");

    function closeModal()
    {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.close();  // Close the modal
        }
    }

    function respondRequest(requestId, response)
    {
        setResponding(true);
        if(response)
        {
            setRespondingMsg("Accepting...");
        }
        else
        {
            setRespondingMsg("Rejecting...");
        }

        const friendshipRequestService = new FriendshipRequestService();
        friendshipRequestService.respondToFriendshipRequest({jwt: jwt, requestId: requestId, response: response})
        .then(() => {

            // responded successfully
            // close modal
            closeModal();

            // navigate(`/home/users/${userId}`);
            if(response)
            {
                toast.success("Request Accepted !");
            }
            else
                toast.success("Request Rejected !");

            // now remove the request from redux store
            const index = receivedFriendshipRequests.findIndex((f)=>f.requestId==requestId);
            if(index!=-1)
            {
                dispatch(removeReceivedRequest({
                    index: index
                }));
            }
        })
        // TODO: handle errors
        .finally(()=>
        {
            setResponding(false);
        });
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
            (
            (!isResponding)
            ?
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
            :
            <div className="flex justify-end mt-4">
                <LoadingSpinner
                    message={respondingMsg}
                />
            </div>
            )
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
        <Link
            to={to?to:`/home/users/${userId}`}
            // close modal on click if it is a link
            onClick={closeModal}
        >

            {UserCard}

        </Link>
        :
        {UserCard}
      )

    );

}


export default UserAvatar;