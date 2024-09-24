import React from 'react';
import AllChatsPane from '../panes/AllChatsPane';
import { Outlet } from 'react-router-dom';

function HomePage()
{

    return (

        <>
            
            <div className='flex w-full flex-column flex-wrap md:flex-row'>

                {/* left side pane */}
                <div className="bg-base-300 h-screen w-full md:max-w-[38%]">
                    <AllChatsPane/>
                </div>

                {/* divider */}
                <div className="divider divider-horizontal m-0 hidden md:flex"></div>

                {/* right side pane */}
                <div className="bg-base-300 h-screen w-full md:w-fit md:grow-[2] md:max-w-[59%] relative">

                    {/* right side pane's content will change based on url */}
                    <Outlet/>

                </div>

            </div>

        </>

    );

}


export default HomePage;