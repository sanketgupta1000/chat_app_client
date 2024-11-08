// will write error handlers here

import toast from "react-hot-toast";
import { InvalidDataError, NetworkError, UnknownError } from "./sharedErrors";
import { InvalidCredentialsError, UserExistsError, UserNotFoundError } from "./userErrors";
import { RequestExistsError, RequestNotFoundError } from "./friendshipRequestErrors";
import { GroupNotFoundError } from "./groupErrors";
import { ChatNotFoundError } from "./privateChatErrors";
import { useNavigate } from "react-router-dom";

// messages for errors

// common
const NETWORK_ERROR = "Network error. Please check your internet connection.";
const UNKNOWN_ERROR = "An unknown error occurred. Please try again later.";
const INVALID_DATA_ERROR = "Invalid data given. Please check your inputs and try again.";

// before login
const EMAIL_ALREADY_EXISTS = "Email already exists. Please try another email or login.";
const EMAIL_NOT_FOUND = "User not found. Please try another email or register.";
const INVALID_CREDENTIALS = "Invalid credentials. Please try again.";

// after login
const SESSION_EXPIRED = "Session expired. Please login again.";
const REQUEST_EXISTS = "Friendship Request already exists.";
const REQUEST_NOT_FOUND = "Friendship Request not found.";
const GROUP_NOT_FOUND = "Group not found.";
const CHAT_NOT_FOUND = "Chat not found.";
const USER_NOT_FOUND = "User not found, please try again.";

// const navigate = useNavigate();

// of course there is no such thing as "login" in rest api
// so this will handle the errors before the token is set
function handleErrorsBeforeLogin(error)
{

    if(error instanceof NetworkError)
    {
        toast.error(NETWORK_ERROR);
    }
    else if(error instanceof InvalidDataError)
    {
        toast.error(INVALID_DATA_ERROR);
    }
    else if(error instanceof UserExistsError)
    {
        toast.error(EMAIL_ALREADY_EXISTS);
    }
    else if(error instanceof UserNotFoundError)
    {
        toast.error(EMAIL_NOT_FOUND);
    }
    else if(error instanceof InvalidCredentialsError)
    {
        toast.error(INVALID_CREDENTIALS);
    }
    else if(error instanceof UnknownError)
    {
        toast.error(UNKNOWN_ERROR);
    }

}

// will handle the errors after the token is set
function handleErrorsAfterLogin(error, navigate)
{
    if(error instanceof NetworkError)
    {
        toast.error(NETWORK_ERROR);
    }
    else if(error instanceof InvalidCredentialsError)
    {
        toast.error(SESSION_EXPIRED);
        navigate("/auth/login");
    }
    else if(error instanceof InvalidDataError)
    {
        toast.error(INVALID_DATA_ERROR);
    }
    else if(error instanceof RequestExistsError)
    {
        toast.error(REQUEST_EXISTS);
    }
    else if(error instanceof RequestNotFoundError)
    {
        toast.error(REQUEST_NOT_FOUND);
    }
    else if(error instanceof GroupNotFoundError)
    {
        toast.error(GROUP_NOT_FOUND);
    }
    else if(error instanceof ChatNotFoundError)
    {
        toast.error(CHAT_NOT_FOUND);
    }
    else if(error instanceof UserNotFoundError)
    {
        toast.error(USER_NOT_FOUND);
    }
    else if(error instanceof UnknownError)
    {
        toast.error(UNKNOWN_ERROR);
    }
}

export {
    handleErrorsBeforeLogin,
    handleErrorsAfterLogin
};