import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthPage() {
    return (
        
        <div>
            <div>Header goes here</div>
            <Outlet/>
            <div>Footer goes here</div>
        </div>

    )
}

export default AuthPage