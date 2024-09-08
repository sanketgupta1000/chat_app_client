import config, { baseUrl } from "../configs/config";
import { InvalidCredentialsError, UserNotFoundError } from "../utils/errors/userErrors";
import { InvalidDataError, NetworkError, UnknownError } from "../utils/errors/sharedErrors";
import { RequestExistsError, RequestNotFoundError } from "../utils/errors/friendshipRequestErrors";


class FriendshipRequestService
{

    // to get the suggested users
    async getSuggestedUsers(jwt)
    {
        let response;
        try
        {
            response = await fetch(
                baseUrl + "/api/users/suggestions",
                {
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    }
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        // got the response
        if(response.status==403)
        {
            // token incorrect/expired
            throw new InvalidCredentialsError();
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        return (await response.json()).suggestedUsers;

    }

    // method to send a friendship request
    async sendFriendshipRequest({jwt, receiverId})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/friendship-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        receiver_id: receiverId
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        // got the response
        if(response.status==403)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status==422)
        {
            // invalid data
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==404)
        {
            // receiver not found
            throw new UserNotFoundError((await response.json()).message);
        }
        else if(response.status==409)
        {
            // request already exists
            throw new RequestExistsError((await response.json()).message);
        }
        else if(response.status!=201)
        {
            throw new UnknownError();
        }

        // request sent
        return (await response.json()).request;

    }

    // get received friendship requests
    async getReceivedFriendshipRequests(jwt)
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/friendship-requests/received",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${jwt}`
                    }
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        if(response.status==403)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        return (await response.json()).requests;

    }

    // method to respond to a friendship request
    async respondToFriendshipRequest({jwt, requestId, response})
    {
        let resp;
        try
        {
            resp = await fetch(
                config.baseUrl + "/api/friendship-requests",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        friendship_request_id: requestId,
                        response
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        if(resp.status==403)
        {
            throw new InvalidCredentialsError();
        }
        else if(resp.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(resp.status==404)
        {
            throw new RequestNotFoundError((await response.json()).message);
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

    }

}

export default FriendshipRequestService;