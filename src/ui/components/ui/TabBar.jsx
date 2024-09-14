import React from 'react';


function TabBar({
    tabName,
    tabActive,
    setTabActive,
    className,
    ...props
})
{

    return (

        <span
            role='tab'
            className={`tab hover:cursor-pointer ${tabActive?"tab-active":""} ${className}`}
            onClick={setTabActive}
            {...props}
        >
            {tabName}
        </span>

    )

}

export default TabBar;