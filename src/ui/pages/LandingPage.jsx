import React from 'react';
import Button from '../components/input/Button';
import { useNavigate } from 'react-router-dom';

function LandingPage()
{

    const navigate = useNavigate();

    return (

        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
            }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                    <p className="mb-5">
                    Connect and chat with like-minded individuals! Discover new friends and engage in conversations based on shared interests. Join our community and start meaningful interactions today!
                    </p>
                    <Button
                        className="btn btn-primary"
                        onClick={()=>
                        {
                            navigate("/home");
                        }
                        }
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </div>

    );

}

export default LandingPage;