import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserAvatar from '../components/ui/UserAvatar';

function GroupInfoPane()
{

    // get the group index from params
    const groupIndex = useParams().groupIndex;

    // get the group from the store
    const group = useSelector((state) => state.groups.groups[groupIndex]);

    // find admin
    const admin = group.members.find((member)=>member.memberId===group.adminId);
    
    return (

        <div>

            {/* group details */}
            <div className="flex flex-col items-center p-3">

                {/* group image */}
                <div className="avatar">
                    <div className="w-24 rounded-full">
                        <img src={group.groupImgSrc} alt={`${group.groupName}'s Photo`} />
                    </div>
                </div>

                {/* group name */}
                <h2 className='text-xl font-bold'>{group.groupName}</h2>
                {/* admin name */}
                <h3 className='text-lg opacity-50'>Admin: {admin.memberName}</h3>

            </div>

            {/* group description */}
            <div>
                <h3 className="text-lg font-bold p-3">About Group</h3>
                <p className="p-3">
                    {group.groupDescription}
                </p>
            </div>

            {/* group members */}
            <div>
                <h3 className="text-lg font-bold p-3">Members</h3>

                <div className='max-h-[50vh] overflow-scroll'>
                    {group.members.map((member, index)=>
                    (
                        <UserAvatar
                            key={member.memberId}
                            userId={member.memberId}
                            imgSrc={"https://placehold.jp/100x100.png"}
                            name={member.memberName}
                        />
                    ))}

                </div>
            </div>

        </div>

    );

}

export default GroupInfoPane;