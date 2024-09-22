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

const router = createBrowserRouter(

    createRoutesFromElements(

        <Route
            path="/"
            element={<App/>}
        >

            <Route
                path='testhome/'
                element={<AuthLayout authRequired={true}><HomePage/></AuthLayout>}
            />

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

        <RouterProvider router={router}>

            <App />

        </RouterProvider>

    </Provider>

  </StrictMode>,
)
