import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom';
import LoginPage from './ui/pages/LoginPage.jsx';
import AuthLayout from './AuthLayout.jsx';
import SignupPage from './ui/pages/SignupPage.jsx';
import AuthPage from './ui/pages/AuthPage.jsx';
import HomePage from './ui/pages/HomePage.jsx';
import UserProfilePane from './ui/panes/UserProfilePane.jsx';
import PrivateChatPane from './ui/panes/PrivateChatPane.jsx';
import SocketContextProvider from './contexts/SocketContextProvider.jsx';
import GroupChatPane from './ui/panes/GroupChatPane.jsx';

const router = createBrowserRouter(

    createRoutesFromElements(

        <Route
            path="/"
            element={<App/>}
        >

            <Route
                path='home/'
                element={<AuthLayout authRequired={true}><HomePage/></AuthLayout>}
            >

                {/* user profile page */}
                <Route
                    path='users/:userId/'
                    element={<UserProfilePane/>}
                />

                {/* private chat page */}
                <Route
                    path='private-chats/:privateChatIndex/'
                    element={<PrivateChatPane/>}
                />

                {/* group chat page */}
                <Route
                    path='group-chats/:groupChatIndex/'
                    element={<GroupChatPane/>}
                />
            </Route>

            <Route
                path='auth/'
                element={
                    <AuthLayout
                        authRequired={false}
                    >
                        <AuthPage/>
                    </AuthLayout>
                }
            >

                <Route
                    path="login/"
                    element={<LoginPage/>}
                />

                <Route
                    path='signup/'
                    element={<SignupPage/>}
                />
            
            </Route>
            

        </Route>


        
    )

)

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>

        <SocketContextProvider>

            <RouterProvider router={router} />
            
        </SocketContextProvider>


    </Provider>

  </StrictMode>,
)
