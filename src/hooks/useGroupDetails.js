import { useEffect, useState } from "react";
import GroupChatService from "../services/groupChatService";

function useGroupDetails({groupId, jwt})
{
    const [isLoading, setLoading] = useState(true);
    const [groupDetails, setGroupDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>
    {
        setLoading(true);
        const groupChatService = new GroupChatService();

        groupChatService
        .getGroupChatById({groupId, jwt})
        .then((group)=>
        {
            setGroupDetails(group);
        })
        .catch((err)=>
        {
            setError(err);
        })
        .finally(()=>
        {
            setLoading(false);
        });

    }, [groupId]);

    return [isLoading, groupDetails, error];
}