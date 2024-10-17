import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthPage() {
    return (
        
        <div>
            <div className="navbar bg-primary text-primary-content">
                <button className="btn btn-ghost text-xl">ChatBuddies</button>
            </div>
            <Outlet/>
            <footer className="footer footer-center bg-primary text-primary-content p-4">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by ChatBuddies</p>
                </aside>
            </footer>
        </div>

    )
}

export default AuthPage