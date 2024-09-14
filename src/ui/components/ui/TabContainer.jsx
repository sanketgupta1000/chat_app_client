import React from 'react';


function TabContainer({
    className="",
    children,
    ...props
})
{

    return (

        <div
            role='tablist'
            className={`tabs tabs-boxed max-w-[50%] mx-auto mb-3 lg:mb-4 ${className}`}
            {...props}
        >

            {children}

        </div>

    )

}


export default TabContainer;