import { InvalidCredentialsError } from "../utils/errors/userErrors";
import { InvalidDataError, UnknownError, NetworkError } from "../utils/errors/sharedErrors";
import { ChatNotFoundError } from "../utils/errors/privateChatErrors";
import config from "../configs/config";

class PrivateChatService
{
    // method to get all private chats
    async getAllPrivateChats(jwt)
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/private-chats/my-chats",
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

        // got the response
        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        // got the private chats
        return (await response.json()).privateChats;

                        
    }

    // method to send a message
    async sendMessage({jwt, privateChatId, message})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/private-chats/send",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        private_chat_id: privateChatId,
                        message: message
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        // got the response
        if(response.status==401)
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
            throw new ChatNotFoundError((await response.json()).message);
        }
        else if(response.status!=201)
        {
            throw new UnknownError();
        }

        // message sent
        return (await response.json()).message;
    }

    // method to get messages
    async getMessages({jwt, privateChatId, offset, limit})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + '/api/private-chats',
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        private_chat_id: privateChatId,
                        offset: offset,
                        limit: limit
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        // got the response
        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status==422)
        {
            // invalid data
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        // messages received
        return (await response.json()).messages;
    }
}

export default PrivateChatService;