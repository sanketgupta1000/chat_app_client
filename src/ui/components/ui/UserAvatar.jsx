import React from 'react'
import Button from '../input/Button';


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
    className=""

})
{

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
                <span className='text-sm text-gray-500'>Rating:</span>
                <span className='text-yellow-500'>{rating}</span>
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
                        console.log("Sending request: "+userId);
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
        <a href={to?to:`/home/users/${userId}`}>

            {UserCard}

        </a>
        :
        {UserCard}
      )

    );

}


export default UserAvatar;