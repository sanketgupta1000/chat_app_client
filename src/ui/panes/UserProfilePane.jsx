import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import useUserDetails from '../../hooks/useUserDetails';
import { InvalidDataError, NetworkError } from '../../utils/errors/sharedErrors';
import toast from 'react-hot-toast';
import { InvalidCredentialsError } from '../../utils/errors/userErrors';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/input/Button';
import { logout, setToken } from '../../store/slices/userSlice';
import { handleErrorsAfterLogin } from '../../utils/errors/handlers';
import FriendshipRequestService from '../../services/friendshipRequestService';
import { removeReceivedRequest } from '../../store/slices';

function UserProfilePane()
{

    // get user id from url
    const {userId} = useParams();
    const dispatch = useDispatch();
    // get token from redux
    const jwt = useSelector(state=>state.user.token);

    // get current user id
    const currentUserId = useSelector(state=>state.user.userId);

    // get the list of friends of the current user
    const privateChats = useSelector(state=>state.privateChats.privateChats);

    const[isLoading, userDetails, setUserDetails, error] = useUserDetails({userId, jwt});

    const navigate = useNavigate();

    // is it the current user's profile?
    const isCurrentUser = userId == currentUserId;

    // chatIndex in case they are friends
    let chatIndex = null;
    for(let i=0; i<privateChats.length; i++)
    {
        if(
            (privateChats[i].user1Id==userId && privateChats[i].user2Id==currentUserId)
            ||
            (privateChats[i].user1Id==currentUserId && privateChats[i].user2Id==userId)
        )
        {
            chatIndex = i;
            break;
        }
    }

    const [isSending, setSending] = useState(false);

    const [isResponding, setResponding] = useState(false);
    const [respondingMsg, setRespondingMsg] = useState("");

    const receivedFriendshipRequests = useSelector(state=>state.friendshipRequests.receivedFriendshipRequests);

    useEffect(()=>
    {

        if(!isLoading)
        {
            if(error)
            {
                console.log(error);
                handleErrorsAfterLogin(error, navigate);
            }
            else
            {
                // fetched user successfully
            }
        }

    }, [isLoading]);

    return (

        <div>

            {(isLoading || error)?
            <LoadingSpinner/>
            :
            <div>

                {/* user avatar big */}
                <div className="relative p-3">
                    <div className="flex justify-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                        <img src="https://placehold.jp/100x100.png" alt="User Avatar" />
                        </div>
                    </div>
                    </div>
                    <div className="absolute right-3 top-3">

                    {/* if it is the current user's profile */}
                    {isCurrentUser &&
                    <Button className="ml-4" colour="primary"
                        onClick={() => 
                            {
                                dispatch(setToken({token: null}));
                            }
                        }
                    >
                        Logout
                    </Button>
                    }
                    </div>
                </div>
                    {/* name and email */}
                <div className="flex flex-col items-center p-3">
                    <h2 className="text-xl font-bold">{userDetails.name}</h2>
                    <h3 className="text-lg opacity-50">{userDetails.email}</h3>
                </div>

                {/* send request button */}
                {userDetails.canSendFriendRequest &&
                    <div className="flex flex-col items-center p-3">

                        <Button
                            loading={isSending}
                            onClick={()=>
                            {
                                setSending(true);

                                // send friend request
                                const friendshipRequestService = new FriendshipRequestService();
                                friendshipRequestService.sendFriendshipRequest({jwt: jwt, receiverId: userId})
                                .then(()=>
                                {
                                    toast.success("Request Sent successfully!");

                                    // change the state of the user details
                                    setUserDetails((prev)=>
                                    {
                                        return {
                                            ...prev,
                                            canSendFriendRequest: false,
                                            hasSentFriendRequest: true
                                        };
                                    });

                                })
                                .catch((error)=>
                                {
                                    console.log(error);
                                    handleErrorsAfterLogin(error, navigate);
                                })
                                .finally(()=>
                                {
                                    setSending(false);
                                });

                            }}
                        >
                            {isSending?"Sending...":"Send Request"}
                        </Button>

                    </div>
                }

                {/* requested button in case request is sent and not responded */}
                {userDetails.hasSentFriendRequest &&
                
                    <div className="flex flex-col items-center p-3">
                            
                            <Button
                                disabled={true}
                            >
                                Requested ✅
                            </Button>
                    </div>

                }

                {/* accept and reject request buttons in case other has sent */}
                {userDetails.canRespondToFriendRequest && (!isResponding) &&
                
                    <div className="flex flex-col items-center p-3">
                                
                        <Button
                            onClick={()=>
                            {
                                setResponding(true);
                                setRespondingMsg("Accepting...");
                                const friendshipRequestService = new FriendshipRequestService();
                                friendshipRequestService.respondToFriendshipRequest({jwt: jwt, requestId: userDetails.requestId, response: true})
                                .then(()=>
                                {
                                    toast.success("Request Accepted successfully!");

                                    const index = receivedFriendshipRequests.findIndex((f)=>f.requestId==userDetails.requestId);
                                    if(index!=-1)
                                    {
                                        dispatch(removeReceivedRequest({
                                            index: index
                                        }));
                                    }

                                    // change the state of the user details
                                    setUserDetails((prev)=>
                                    {
                                        return {
                                            ...prev,
                                            canRespondToFriendRequest: false,
                                            hasRespondedToFriendRequest: true,
                                            responseToFriendRequest: "accepted",
                                            areFriends: true
                                        };
                                    });

                                })
                                .catch((error)=>
                                {
                                    console.log(error);
                                    handleErrorsAfterLogin(error, navigate);
                                })
                                .finally(()=>
                                {
                                    setResponding(false);
                                    setRespondingMsg("");
                                });
                            }}
                        >
                            Accept
                        </Button>

                        <Button
                            onClick={()=>
                            {
                                setResponding(true);
                                setRespondingMsg("Rejecting...");
                                const friendshipRequestService = new FriendshipRequestService();
                                friendshipRequestService.respondToFriendshipRequest({jwt: jwt, requestId: userDetails.requestId, response: false})
                                .then(()=>
                                {
                                    toast.success("Request Rejected successfully!");

                                    const index = receivedFriendshipRequests.findIndex((f)=>f.requestId==userDetails.requestId);
                                    if(index!=-1)
                                    {
                                        dispatch(removeReceivedRequest({
                                            index: index
                                        }));
                                    }

                                    // change the state of the user details
                                    setUserDetails((prev)=>
                                    {
                                        return {
                                            ...prev,
                                            canRespondToFriendRequest: false,
                                            hasRespondedToFriendRequest: true,
                                            responseToFriendRequest: "rejected"
                                        };
                                    });
                                })
                                .catch((error)=>
                                {
                                    console.log(error);
                                    handleErrorsAfterLogin(error, navigate);
                                })
                                .finally(()=>
                                {
                                    setResponding(false);
                                    setRespondingMsg("");
                                });
                            }}
                        >
                            Reject
                        </Button>
                    </div>

                }

                {/* responding message */}
                {isResponding &&
                    <div className="flex flex-col items-center p-3">
                        <p>{respondingMsg}</p>
                    </div>
                }

                {/* responded message */}
                {userDetails.hasRespondedToFriendRequest &&
                    <div className="flex flex-col items-center p-3">
                        <Button
                            disabled={true}
                        >
                            {(userDetails.responseToFriendRequest=="accepted")?"Accepted":"Rejected"} ✅
                        </Button>
                    </div>
                }

                {/* chat button */}
                {userDetails.areFriends &&
                
                    <div className="flex flex-col items-center p-3">
                        <Button
                            onClick={()=>
                            {
                                navigate(`/home/private-chats/${chatIndex}`);
                            }}
                        >
                            Chat
                        </Button>
                    </div>
                }


                {/* description */}
                <div>

                    <h3 className="text-lg font-bold p-3">About me</h3>
                    <p className="p-3">
                        {userDetails.description}
                    </p>

                    {/* <button className="btn btn-primary m-3">Edit</button> */}

                </div>

                {/* interests */}
                <div>

                    <h3 className="text-lg font-bold p-3">Interests</h3>

                    <ul className="p-3">
                        {userDetails.interests.map((interest)=>
                        <li key={interest.id}>{interest.name}</li>
                        )}
                    </ul>

                    {/* <button className="btn btn-primary m-3">Edit</button> */}

                </div>

                {
                userDetails.avg_rating &&
                <div>

                    <h3 className="text-lg font-bold p-3">Rating</h3>

                    <div className="p-3">
                        <span className="text-sm text-gray-500">Rating:</span>
                        <span className="text-yellow-500">{userDetails.avg_rating}</span>
                    </div>

                    {/* <button className="btn btn-primary m-3">Rate</button> */}
                </div>
                }

            </div>
            }

        </div>

    );

}

export default UserProfilePane;