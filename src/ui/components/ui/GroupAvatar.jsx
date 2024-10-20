import React from 'react';
import { Link } from 'react-router-dom';

function GroupAvatar({
    groupId,
    groupName,
    groupIndex,
    imgSrc,
    lastMessage,
    lastMessageFrom,
    memberNames,
    rounded=true,
    isLink=true,
    to,
    className=""
})
{

    const GroupCard = (
        <div className={`card card-side flex-wrap bg-base-100 ${rounded?"":"rounded-none"} p-3 justify-between ${isLink?"hover:bg-base-200":""} ${className}`}>

            {/* group image, name, and memberNames or message */}
            <div className='flex flex-row items-center justify-between'>
                <div className='avatar'>
                    <div className='w-16 rounded-full'>
                        <img src={imgSrc} alt={`${groupName}'s Photo`} />
                    </div>
                </div>

                <div className='ms-3'>
                    <div className='font-bold'>{groupName}</div>

                    {
                    memberNames &&
                    <div className='text-sm text-gray-500'>{memberNames.toString()}</div>
                    }

                    {
                    lastMessage &&
                    <div className='text-sm text-gray-500'>{lastMessageFrom}:{lastMessage}</div>
                    }

                </div>

            </div>

        </div>
    );

    return (

        (isLink?
        <Link to={to?to:`/home/groups/${groupIndex}`}>
            {GroupCard}
        </Link>
        :
        {GroupCard}
        )

    )

}

export default GroupAvatar;