import { useEffect, useState } from "react";
import UserService from "../services/userService";

function useUserDetails({userId, jwt})
{
    const [isLoading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>
    {
        
        // fetch user details using service
        // set loading to true
        setLoading(true);
        
        const userService = new UserService();

        // get user details
        userService
        .getUserById({userId, jwt})
        .then((user)=>
        {
            setUserDetails(user);
        })
        .catch((err)=>
        {
            setError(err);
        })
        .finally(()=>
        {
            setLoading(false);
        });

    }, [userId]);

    return [isLoading, userDetails, error];
}

export default useUserDetails;