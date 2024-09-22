// will write functions for authenticating here

import config from "../configs/config";
import {NetworkError, InvalidDataError, UnknownError} from "../utils/errors/sharedErrors";
import { UserExistsError, UserNotFoundError, InvalidCredentialsError } from "../utils/errors/userErrors";

class AuthService
{
    // method to signup
    async signup({
        email,
        name,
        description,
        password,
        // interestIds is an array of strings
        interestIds
    })
    {

        let response;

        try
        {
            response = await fetch(
                config.baseUrl + "/api/users/signup",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        name: name,
                        description: description,
                        password: password,
                        interests: interestIds.map((i)=>
                        {
                            return {
                                id: i
                            };
                        })
                    })
                }
            );
        }
        catch(e)
        {
            console.log(e);
            throw new NetworkError();
        }

        // got response
        if(response.status==422)
        {
            // invalid data
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==409)
        {
            // email taken
            throw new UserExistsError((await response.json()).message);
        }
        else if(response.status!=201)
        {
            throw new UnknownError();
        }

        // all good
        return (await response.json()).user;

    }

    // method to get jwt/login
    async login({
        email,
        password
    })
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        // got response
        if(response.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==404)
        {
            throw new UserNotFoundError((await response.json()).message);
        }
        else if(response.status==401)
        {
            throw new InvalidCredentialsError((await response.json()).message);
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        return (await response.json()).token;

    }

    // method to get the current user
    async getCurrentUser(jwt)
    {

        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/users/self",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    }
                }
            );
        }
        catch(err)
        {
            throw new NetworkError();
        }

        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }

        return (await response.json()).currentUser;

    }

}

export default AuthService;