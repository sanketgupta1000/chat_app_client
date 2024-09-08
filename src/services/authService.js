// will write functions for authenticating here

import { baseUrl } from "../configs/config";
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
                baseUrl + "/api/users/signup",
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
                baseUrl + "/api/users/login",
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

}

export default AuthService;