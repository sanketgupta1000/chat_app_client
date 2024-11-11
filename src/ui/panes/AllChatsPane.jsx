import React, { useState, useEffect } from 'react';
import UserAvatar from '../components/ui/UserAvatar';
import { useSelector } from 'react-redux';
import Button from '../components/input/Button';
import TabContainer from '../components/ui/TabContainer';
import TabBar from '../components/ui/TabBar';
import GroupAvatar from '../components/ui/GroupAvatar';
import UserModal from '../components/ui/UserModal';
import FriendshipRequestService from '../../services/friendshipRequestService';
import CheckBox from '../components/input/CheckBox';
import Input from '../components/input/Input';
import { Controller, useFieldArray, useForm } from "react-hook-form";
import InputError from "../components/input/InputError";
import GroupChatService from '../../services/groupChatService';
import { NetworkError, UnknownError } from "../../utils/errors/sharedErrors";
import { InvalidCredentialsError } from "../../utils/errors/userErrors";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addGroup } from '../../store/slices';
import { handleErrorsAfterLogin } from '../../utils/errors/handlers';
import { useNavigate } from 'react-router-dom';

function AllChatsPane({
    className = ""
}) {

    const navigate = useNavigate();

    // user id, and email from redux store
    const { userId, userEmail, userName } = useSelector(state => state.user);
    // const suggestedUser = useSelector(state => state.friendshipRequests);
    const jwt = useSelector(state => state.user.token);
    // state for tabs
    const [tab, setTab] = useState(1);

    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const [findUserBtnLoading, setFindUserBtnLoading] = useState(false);

    // friendship requests from redux store
    const receivedFriendshipRequests = useSelector(state=>state.friendshipRequests.receivedFriendshipRequests);
    
    // private chats
    const privateChats = useSelector(state => state.privateChats.privateChats);

    // groups
    const groups = useSelector(state => state.groups.groups);

    // react hook form
    const { register, handleSubmit, control, formState, reset } = useForm();
    // errors
    const { errors } = formState;

    const dispatch = useDispatch();

    const [isCreatingGroup, setCreatingGroup] = useState(false);

    const handleCreateGroup = (data) => {

        // set the loading state
        setCreatingGroup(true);

        const memberIds = []
        // console.log(data);

        data.group.forEach((m) => {
            if(m.value == true)
            {
                memberIds.push(m.memberId);
            }
        });
        const groupChatService = new GroupChatService();
        groupChatService.createGroupChat({
            jwt: jwt,
            name: data.group_name,
            description: data.description,
            memberIds: memberIds,
            adminId: userId,
            adminName: userName
        })
        .then((group) => {
            
            dispatch(addGroup({
                group: {
                    groupId: group.id,
                    groupName: group.group_name,
                    groupImgSrc: "https://placehold.jp/100x100.png",
                    groupDescription: group.group_description,
                    adminId: group.admin_id,
                    lastMsg: group.last_msg,
                    lastMsgSenderId: group.last_msg_sender_id,
                    messages: [],
                    members: group.members.map((m)=>
                        {
                            return {memberId: m.id, memberName: m.name};
                        })
                }
            }));
            // reset the form
            reset();
            toast.success("Group created successfully!");
        })
        .catch((err) => 
        {
            console.log(err);
            handleErrorsAfterLogin(err, navigate);
        })
        .finally(() => 
        {
            document.getElementById("createGroup").close();
            setCreatingGroup(false);
        });
    }

    return (

        <>

            {/* to display user's profile */}
            <div className='flex flex-row items-center justify-evenly flex-wrap pt-4'>

                <UserAvatar
                    name={userName}
                    userId={userId}
                    email={userEmail}
                    imgSrc={"https://placehold.jp/100x100.png"}

                />

                <Button
                    loading={findUserBtnLoading}
                    onClick={() => {
                        setFindUserBtnLoading(true);
                        const friendshipRequestService = new FriendshipRequestService();

                        friendshipRequestService.getSuggestedUsers(jwt)
                            .then((users) => {
                                setSuggestedUsers(users);
                                document.getElementById("findUserModal").showModal();
                            })
                            .catch((error)=>
                            {
                                console.log(error);
                                handleErrorsAfterLogin(error, navigate);
                            })
                            .finally(()=>
                            {
                                setFindUserBtnLoading(false);
                            })
                    }
                    }
                >
                    {findUserBtnLoading
                    ?
                    "Finding users"
                    :
                    "Find New Users"
                    }
                </Button>

                {/* Friend Suggestions Modal */}
                <UserModal id="findUserModal" header="Suggested users">
                    {
                        suggestedUsers.length == 0
                            ?
                            <div>
                                No Users with Matching Interests.
                            </div>
                            :
                            suggestedUsers.map((user) => (
                                <UserAvatar
                                    key={user.id}
                                    userId={user.id}
                                    name={user.name}
                                    imgSrc={"https://placehold.jp/100x100.png"}
                                    email={user.email}
                                    showSendRequestBtn={true}
                                    rating={user.avg_rating}
                                    modalId="findUserModal"
                                />
                            ))
                    }
                </UserModal>
            </div>

            {/* to display list of chatboxes */}
            <div className='p-3 lg:p-4'>

                {/* tabs */}
                <TabContainer>

                    <TabBar
                        tabName={"Chats"}
                        tabActive={tab == 1}
                        setTabActive={() => setTab(1)}
                    />

                    <TabBar
                        tabName={"Groups"}
                        tabActive={tab == 2}
                        setTabActive={() => setTab(2)}
                    />

                </TabContainer>

                {/* chatboxes */}

                {/* private chats */}
                {
                    tab == 1 &&

                    <div className='rounded-md overflow-scroll max-h-[40vh]'>

                        {privateChats.map((privateChat, index) =>
                        (
                            <UserAvatar

                                key={privateChat.privateChatId}

                                userId={privateChat.user1Id == userId
                                    ?
                                    privateChat.user2Id
                                    :
                                    privateChat.user1Id
                                }

                                name={privateChat.user1Id == userId
                                    ?
                                    privateChat.user2Name
                                    :
                                    privateChat.user1Name
                                }

                                imgSrc={"https://placehold.jp/100x100.png"}

                                lastMessage={privateChat.lastMsg
                                    ?
                                    privateChat.lastMsg
                                    :
                                    null
                                }

                                lastMessageFrom={
                                    privateChat.lastMsgSenderId ?
                                        (
                                            privateChat.lastMsgSenderId == privateChat.user1Id
                                                ?
                                                privateChat.user1Name
                                                :
                                                privateChat.user2Name
                                        )
                                        :
                                        null
                                }

                                to={`/home/private-chats/${index}`}

                            />
                        ))}

                    </div>

                }

                {/* groups */}
                {
                    tab == 2 &&
                    <div className='rounded-md overflow-scroll max-h-[40vh]'>

                        {groups.map((group, index) =>
                        (
                            <GroupAvatar

                                key={group.groupId}

                                groupId={group.groupId}

                                groupName={group.groupName}

                                imgSrc={"https://placehold.jp/100x100.png"}

                                lastMessage={group.lastMsg
                                    ?
                                    group.lastMsg
                                    :
                                    null
                                }

                                lastMessageFrom={
                                    group.lastMsgSenderId ?
                                        (
                                            (group.members.find((m) => m.memberId == group.lastMsgSenderId)).memberName
                                        )
                                        :
                                        null
                                }

                                memberNames={group.members.map((m) => m.memberName)}

                                to={`/home/group-chats/${index}`}

                            />
                        ))}

                    </div>
                }

                <div className='flex flex-row items-center justify-evenly flex-wrap pt-4'>
                    {/* button to see received requests */}
                    <Button
                        onClick={() => {
                            // open modal to show the requests
                            document.getElementById('frdReqModal').showModal()
                        }}
                    >
                        Received Friendship Requests
                    </Button>

                    {/* Friend Request Modal */}
                    <UserModal id="frdReqModal" header="Received Requests">
                        {
                            receivedFriendshipRequests.length == 0
                                ?
                                <div>
                                    No Friend Requeest yet...
                                </div>
                                :
                                receivedFriendshipRequests.map((req) => (
                                    <UserAvatar
                                        key={req.requestId}
                                        requestId={req.requestId}
                                        userId={req.senderId}
                                        name={req.senderName}
                                        imgSrc={"https://placehold.jp/100x100.png"}
                                        email={req.senderEmail}
                                        showRequestActions={true}
                                        modalId="frdReqModal"
                                    />
                                ))
                        }
                    </UserModal>

                    {/* Create group button */}
                    <Button
                        onClick={() => {
                            document.getElementById('createGroup').showModal();
                            // console.log(privateChats);
                        }
                        }
                    >
                        Create Group
                    </Button>

                    {/* Friend list modal to create group */}
                    <UserModal id="createGroup" header="Select Group members">
                        {
                            <form className="card-body" onSubmit={handleSubmit(handleCreateGroup)}>
                                <Input
                                    label="Group Name"
                                    type="text"
                                    placeholder="Group Name"
                                    {...register("group_name", {
                                        required: true,
                                        minLength: 5
                                    })}
                                ></Input>
                                {errors.group_name && <InputError>Please enter a name of at least 5 characters</InputError>}

                                <Input
                                    label="Description"
                                    type="textarea"
                                    placeholder="Description"
                                    {...register("description", {
                                        required: true,
                                        minLength: 10
                                    })}
                                ></Input>
                                {errors.description && <InputError>Please enter a description of at least 10 characters</InputError>}

                                {
                                    <Controller
                                        control={control}
                                        name="group"
                                        defaultValue={privateChats.map((p) => ({ memberId: p.user1Id == userId ? p.user2Id : p.user1Id, value: false }))} // Initialize value as an array with 'false' for each private chat
                                        rules={{
                                            validate: {
                                                required: (value) =>
                                                    value.some((privateChat) => privateChat.value) || "Please select at least one group member."
                                            }
                                        }}
                                        render={({ field: { onChange, value = [] } }) => (  // Ensure value is an array (default empty array)
                                            <>
                                                {privateChats.map((privateChat, index) => (
                                                    <div key={privateChat.privateChatId}>
                                                        <CheckBox
                                                            label={
                                                                privateChat.user1Id == userId
                                                                    ?
                                                                    privateChat.user2Name
                                                                    :
                                                                    privateChat.user1Name
                                                            }
                                                            checked={value[index]?.value || false}  // Safely access value[index]
                                                            onChange={(e) => {
                                                                const newMember = [...value];
                                                                newMember[index] = {memberId: privateChat.user1Id == userId ? privateChat.user2Id : privateChat.user1Id, value: e.target.checked };  // Ensure newMember[index] is an object
                                                                onChange(newMember);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    />
                                }
                                {
                                    errors.group && <InputError>Please select at least one group member</InputError>
                                }
                                <Button
                                    type='submit'
                                    loading={isCreatingGroup}
                                >
                                    {isCreatingGroup ? "Creating Group..." : "Create Group"}
                                </Button>
                            </form>
                        }
                    </UserModal>
                </div>

            </div>

        </>

    )

}

export default AllChatsPane;