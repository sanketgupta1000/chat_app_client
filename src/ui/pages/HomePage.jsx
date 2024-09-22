import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/input/Button';
import { logout } from '../../store/slices';


function HomePage()
{

    const userName = useSelector(state=>state.user.userName);

    const dispatch = useDispatch();

    return (

        <>
            <div>Hi {userName}!</div>

            <Button
                onClick={()=>
                {
                    dispatch(logout());
                }
                }
            >
                Logout
            </Button>
        </>

    );

}


export default HomePage;