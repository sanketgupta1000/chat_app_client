class ChatNotFoundError extends Error
{
    constructor(message)
    {
        super(message);
    }
}

export {
    ChatNotFoundError
};