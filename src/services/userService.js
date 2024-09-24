import config from "../configs/config";
import { InvalidDataError, NetworkError, UnknownError } from "../utils/errors/sharedErrors";
import { InvalidCredentialsError, UserNotFoundError } from "../utils/errors/userErrors";

class UserService
{
    // method to get the user by id
    async getUserById({userId, jwt})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/users/"+userId,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    }
                }
            );
        }
        catch(e)
        {
            console.log(e);
            throw new NetworkError();
        }

        // got response
        if(response.status==401)
        {
            // invalid credentials
            throw new InvalidCredentialsError();
        }
        else if(response.status==422)
        {
            // invalid data
            throw new InvalidDataError();
        }
        else if(response.status==404)
        {
            // user not found
            throw new UserNotFoundError();
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        // all good
        return (await response.json()).user;
    }
}

export default UserService;