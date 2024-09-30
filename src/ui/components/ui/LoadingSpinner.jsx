import React from 'react'


function LoadingSpinner({message})
{

    return (
        <div>
            
            {
            message?
            message
            :
            <div className='hero bg-base-200 min-h-screen'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
            }

        </div>
    )

}


export default LoadingSpinner