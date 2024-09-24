import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUserDetails from '../../hooks/useUserDetails';
import { InvalidDataError, NetworkError } from '../../utils/errors/sharedErrors';
import toast from 'react-hot-toast';
import { InvalidCredentialsError } from '../../utils/errors/userErrors';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useSelector } from 'react-redux';


function UserProfilePane()
{

    // get user id from url
    const {userId} = useParams();

    // get token from redux
    const jwt = useSelector(state=>state.user.token);

    const[isLoading, userDetails, error] = useUserDetails({userId, jwt});

    useEffect(()=>
    {

        if(!isLoading)
        {
            if(error)
            {
                if(error instanceof NetworkError)
                {
                    // show toast
                    toast.error("Cannot connect to server. Please check your internet connection.");
                }
                else if(error instanceof InvalidCredentialsError)
                {
                    // show toast
                    toast.error("Session expired. Please login again.");
                }
                else if(error instanceof InvalidDataError)
                {
                    toast.error("Invalid data given. Please try again.");
                }
                else if(error instanceof UserNotFoundError)
                {
                    toast.error("User not found.");
                }
                else
                {
                    toast.error("An unknown error occurred. Please try again.");
                }
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
                <div className="flex flex-col items-center p-3">

                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src="https://placehold.jp/100x100.png" />
                        </div>
                    </div>

                    {/* name and email */}
                    <h2 className="text-xl font-bold">{userDetails.name}</h2>
                    <h3 className="text-lg opacity-50">{userDetails.email}</h3>

                </div>

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