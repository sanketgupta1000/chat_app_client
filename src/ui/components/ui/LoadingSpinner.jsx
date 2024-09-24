import React from 'react'


function LoadingSpinner({message})
{

    return (
        <div>
            
            {
            message?
            message
            :
            "Loading..."
            }

        </div>
    )

}


export default LoadingSpinner