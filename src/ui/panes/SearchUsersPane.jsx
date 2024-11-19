import React, { useCallback, useMemo, useRef, useState } from 'react'
import Input from '../components/input/Input';
import { useSelector } from 'react-redux';
import UserAvatar from '../components/ui/UserAvatar';
import UserService from '../../services/userService';
import { handleErrorsAfterLogin } from '../../utils/errors/handlers';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';

// logic: search friends by name and all users by name and email

function SearchUsersPane()
{

    // private chats
    const privateChats = useSelector((state)=>state.privateChats.privateChats);

    const currentUserId = useSelector((state)=>state.user.userId);
    const jwt = useSelector((state)=>state.user.token);

    // reference to the search input
    const searchRef = useRef(null);

    // own friends matching the search
    const [matchingPrivateChats, setMatchingPrivateChats] = useState([]);

    // caching the function used to update the matching friends, so that it is not recreated on every render
    // dependencies include all the variables used in the function, so that the function is recreated only when any of these variables change
    const updateMatchingPrivateChats = useCallback(()=>
    {
        if(searchRef.current.value.length==0)
        {
            setMatchingPrivateChats([]);
        }
        else
        {
            const matching = privateChats.filter(
                (chat)=>
                {
                    return(
                        (chat.user1Name.toLowerCase().includes(searchRef.current.value.toLowerCase()) && (chat.user1Id!=currentUserId)) ||
                        (chat.user2Name.toLowerCase().includes(searchRef.current.value.toLowerCase()) && (chat.user2Id!=currentUserId))
                    );
                }
            );
            setMatchingPrivateChats(matching);
        }
    }, [privateChats, currentUserId, searchRef, setMatchingPrivateChats]);

    const navigate = useNavigate();

    // matching users, actual result from backend
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [isSearching, setSearching] = useState(false);

    // function to search users
    const searchUsers = useCallback((limit, offset, shouldAppend)=>
    {
        if(searchRef.current.value.length==0)
        {
            setMatchingUsers([]);
        }
        else
        {
            setSearching(true);
            // call the backend to search users
    
            const userService = new UserService();
            userService
            .getUsersBySearchKey({
                searchKey: searchRef.current.value,
                jwt: jwt,
                limit: limit,
                offset: offset,
            })
            .then((users)=>
            {
                if(shouldAppend)
                {
                    setMatchingUsers([...matchingUsers, ...users]);
                }
                else
                {
                    setMatchingUsers(users);
                }
            })
            .catch((e)=>
            {
                console.log(e);
                handleErrorsAfterLogin(e, navigate);
            })
            .finally(()=>
            {
                setSearching(false);
            });
        }
    }, [setSearching, setMatchingUsers, searchRef, jwt, matchingUsers, navigate]);

    // for fetching on scroll
    const matchingUsersBoxRef = useRef(null);
    const handleScroll = useCallback(()=>
    {
        console.log("Scroll handler called");
        if(
            Math.abs( (matchingUsersBoxRef.current.scrollTop+matchingUsersBoxRef.current.clientHeight) - (matchingUsersBoxRef.current.scrollHeight) ) <= 3
        )
        {
            // near the end, fetch
            searchUsers(5, matchingUsers.length, true);
        }
    }, [matchingUsersBoxRef, searchUsers]);

    // input handler, caching
    const handleInput = useCallback(()=>
    {
        console.log("Input handler called");
        updateMatchingPrivateChats();
        searchUsers(5, 0, false);
    }, [updateMatchingPrivateChats, searchUsers]);

    // debouncing the input events, so that only after user stops typing, we request to backend
    // useMemo, since we don't want to recreate the debounced callback again and again, we want to cache its result
    const debouncedHandleInput = useMemo(()=>
    {
        return debounce(handleInput, 200);
    }, [handleInput]);

    // debouncing the scroll events, so that only after user stops scrolling, we request to backend
    // useMemo, since we don't want to recreate the debounced callback again and again, we want to cache its result
    const debouncedHandleScroll = useMemo(()=>
    {
        return debounce(handleScroll, 200);
    }, [handleScroll]);

    return(

        <div>

            {/* Input for search */}
            <Input
                ref={searchRef}
                placeholder="Search by name or email"
                isFullWidth={true}
                onInput={debouncedHandleInput}
            />

            {/* friends heading */}
            <h2 className="text-lg font-semibold m-4">
                Matching Friends
            </h2>

            {/* List of matching friends */}
            <div className='rounded-md overflow-scroll max-h-[40vh]'>

                {matchingPrivateChats.map((privateChat, index) =>
                (
                    <UserAvatar

                        key={privateChat.privateChatId}

                        userId={privateChat.user1Id == currentUserId
                            ?
                            privateChat.user2Id
                            :
                            privateChat.user1Id
                        }

                        name={privateChat.user1Id == currentUserId
                            ?
                            privateChat.user2Name
                            :
                            privateChat.user1Name
                        }

                        imgSrc={"https://placehold.jp/100x100.png"}

                    />
                ))}

            </div>

            {/* users heading */}
            <h2 className="text-lg font-semibold m-4">
                Matching Users
                {/* loading if searching */}
                {isSearching &&
                    <span className='loading loading-spinner loading-xs'></span>
                }
            </h2>

            {/* List of matching users */}
            <div className='rounded-md overflow-scroll max-h-[35vh]' ref={matchingUsersBoxRef} onScroll={debouncedHandleScroll}>

                {matchingUsers.map((user, index) =>
                (
                    <UserAvatar

                        key={user.id}
                        userId={user.id}
                        name={user.name}
                        imgSrc={"https://placehold.jp/100x100.png"}

                    />
                ))}
            </div>


        </div>

    );

}

export default SearchUsersPane;