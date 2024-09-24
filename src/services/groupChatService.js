import config from "../configs/config";
import { GroupNotFoundError } from "../utils/errors/groupErrors";
import { NetworkError, UnknownError, InvalidDataError } from "../utils/errors/sharedErrors";
import { InvalidCredentialsError } from "../utils/errors/userErrors";

class GroupChatService
{
    // method to get all group chats
    async getAllGroupChats(jwt)
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/groups/my-groups",
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

        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        return (await response.json()).groups;
    }

    // method to create a group chat
    async createGroupChat({jwt, name, description, memberIds})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/groups",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        group_name: name,
                        group_description: description,
                        members: memberIds
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status!=201)
        {
            throw new UnknownError();
        }

        return (await response.json()).group;
    }

    // method to send a message in a group chat
    async sendMessage({jwt, groupId, message})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/groups/send-message",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        group_id: groupId,
                        message: message
                    })
                }
            );
        }
        catch(e)
        {
            throw new NetworkError();
        }

        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==404)
        {
            throw new GroupNotFoundError((await response.json()).message);
        }
        else if(response.status!=201)
        {
            throw new UnknownError();
        }

        return (await response.json()).group_chat;
    }

    // method to get messages in a group chat
    async getMessages({jwt, groupId, offset, limit})
    {
        let response;
        try
        {
            response = await fetch(
                config.baseUrl + "/api/groups",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        group_id: groupId,
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

        if(response.status==401)
        {
            throw new InvalidCredentialsError();
        }
        else if(response.status==422)
        {
            throw new InvalidDataError((await response.json()).message);
        }
        else if(response.status==404)
        {
            throw new GroupNotFoundError((await response.json()).message);
        }
        else if(response.status!=200)
        {
            throw new UnknownError();
        }

        return (await response.json()).messages;
    }

}

export default GroupChatService;