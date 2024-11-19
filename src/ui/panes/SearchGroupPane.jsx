import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '../components/input/Input';
import GroupAvatar from '../components/ui/GroupAvatar';

// logic: search own groups by name

function SearchGroupPane()
{

    // groups
    const groups = useSelector((state)=>state.groups.groups);

    // matching groups state
    // an object in this will also contain index, to provide link to the group's chat
    const [matchingGroups, setMatchingGroups] = useState([]);

    // ref to the search input
    const searchRef = useRef(null);

    // input handler
    const updateMatchingGroups = useCallback(()=>
    {
        console.log("Input handler called");
        if(searchRef.current.value.length==0)
        {
            setMatchingGroups([]);
        }
        else
        {
            let matching = [];
            for(let i = 0; i<groups.length; i++)
            {
                if(groups[i].groupName.toLowerCase().includes(searchRef.current.value.toLowerCase()))
                {
                    matching.push(
                        {
                            ...(groups[i]),
                            index: i
                        }
                    );
                }
            }
            setMatchingGroups(matching);
        }
    }, [searchRef, setMatchingGroups, groups]);

    // debounced
    const debouncedHandleInput = useMemo(()=>
    {
        return debounce(updateMatchingGroups, 200);
    }, [updateMatchingGroups]);

    return (

        <div>

            {/* search input */}
            <Input
                ref={searchRef}
                placeholder="Search by group name"
                isFullWidth={true}
                onInput={debouncedHandleInput}
            />

            {/* groups heading */}
            <h2 className="text-lg font-semibold m-4">
                Matching Groups
            </h2>

            {/* list of matching groups */}
            <div className='rounded-md overflow-scroll max-h-[70vh]'>

                {matchingGroups.map((group) =>
                (
                    <GroupAvatar

                        key={group.groupId}

                        groupId={group.groupId}

                        groupName={group.groupName}

                        imgSrc={"https://placehold.jp/100x100.png"}

                        memberNames={group.members.map((m) => m.memberName)}

                        to={`/home/group-chats/${group.index}`}

                    />
                ))}

            </div>

        </div>

    )

}

export default SearchGroupPane;