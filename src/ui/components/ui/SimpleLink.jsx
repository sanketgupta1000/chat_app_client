import React from 'react'
import { Link } from 'react-router-dom'

function SimpleLink({
    to,
    className="",
    children,
    ...props
})
{

    return (

        <Link
            to={to}
            className={`hover:underline ${className}`}
            {...props}
        >
            {children}
        </Link>

    )

}

export default SimpleLink