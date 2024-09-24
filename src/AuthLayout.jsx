import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './ui/components/ui/LoadingSpinner';

// component to wrap every page
// will be useful to check auth before user can access the page
function AuthLayout({children, authRequired})
{

    const {isLoggedIn, userId} = useSelector(state=>state.user);

    // to display loading till user is getting checked
    const [isLoading, setLoading] = useState(true);

    // navigate for redirecting
    const navigate = useNavigate();

    useEffect(()=>
    {

        if(authRequired && (!isLoggedIn))
        {
            // auth required but not logged in, redirect to login
            navigate("/auth/login");
        }
        else if((!authRequired) && isLoggedIn)
        {
            // auth not required, but logged in
            // redirect to home
            navigate(`/home/users/${userId}`);
            // navigate("/home/user1");
        }

        // set loading to false
        setLoading(false);

    }, [isLoggedIn]);

    return (

        (isLoading?
        <LoadingSpinner/>
        :
        <div>
            {children}
        </div>
        )

    )

}


export default AuthLayout